#!/usr/bin/env node
// Smoke test suite for the live RequestHub Worker. Exercises only public,
// no-login routes plus auth-gating checks on admin routes (never attempts to
// log in - there's no safe, scriptable way to do that without a real
// customer's password). Run: node tests/smoke.mjs [baseUrl]
//
// Writes go to a dedicated "smoke-test" tenant, never "demo": the hourly runs
// used to leave ~90 junk ideas on the board prospects see from "See a live
// demo". Every idea created here is deleted at the end through the partner
// API, using the smoke-test tenant's key from SMOKE_API_KEY or tests/.smoke.env.

import { readFileSync } from "node:fs";

const BASE_URL = process.argv[2] || "https://requesthub.zohaib-iot.workers.dev";
const CUSTOMER = process.env.SMOKE_CUSTOMER || "smoke-test";

function loadSmokeKey() {
  if (process.env.SMOKE_API_KEY) return process.env.SMOKE_API_KEY;
  try {
    const line = readFileSync(new URL("./.smoke.env", import.meta.url), "utf8")
      .split("\n")
      .find((l) => l.startsWith("SMOKE_API_KEY="));
    return line ? line.slice("SMOKE_API_KEY=".length).trim() : "";
  } catch {
    return "";
  }
}
const SMOKE_API_KEY = loadSmokeKey();

let passed = 0;
let failed = 0;
const failures = [];
const createdIdeaIds = [];

const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const res = await realFetch(input, init);
  const url = typeof input === "string" ? input : input.url;
  if (init?.method === "POST" && url.endsWith("/api/ideas")) {
    try {
      const body = await res.clone().json();
      if (body?.idea?.id) createdIdeaIds.push(body.idea.id);
    } catch {}
  }
  return res;
};

async function check(name, fn) {
  try {
    await fn();
    passed++;
    console.log("  ok   " + name);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message });
    console.log("  FAIL " + name + " - " + err.message);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || "assertion failed");
}

async function run() {
  console.log("RequestHub smoke test against " + BASE_URL + "\n");

  console.log("Public pages (expect 200, no auth):");
  await check("homepage", async () => {
    const r = await fetch(BASE_URL + "/");
    assert(r.status === 200, "status " + r.status);
  });
  await check("board page", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER);
    assert(r.status === 200, "status " + r.status);
  });
  await check("roadmap page", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER + "/roadmap");
    assert(r.status === 200, "status " + r.status);
  });
  await check("changelog page", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER + "/changelog");
    assert(r.status === 200, "status " + r.status);
  });
  await check("changelog API returns shipped items", async () => {
    const r = await fetch(BASE_URL + "/api/customers/" + CUSTOMER + "/changelog");
    const body = await r.json();
    assert(r.status === 200, "status " + r.status);
    assert(body.ok === true, "changelog call failed: " + JSON.stringify(body));
    assert(Array.isArray(body.items), "items was not an array");
  });
  await check("changelog RSS feed is valid XML", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER + "/changelog.rss");
    const text = await r.text();
    assert(r.status === 200, "status " + r.status);
    assert((r.headers.get("content-type") || "").includes("rss+xml"), "wrong content-type: " + r.headers.get("content-type"));
    assert(text.startsWith("<?xml"), "response did not start with an XML declaration");
    assert(text.includes("<rss version=\"2.0\">"), "missing rss root element");
  });
  await check("embed.js", async () => {
    const r = await fetch(BASE_URL + "/embed.js");
    assert(r.status === 200, "status " + r.status);
    const text = await r.text();
    assert(text.includes("requesthub-widget"), "embed.js missing expected marker");
  });
  await check("changelog-embed.js", async () => {
    const r = await fetch(BASE_URL + "/changelog-embed.js");
    assert(r.status === 200, "status " + r.status);
    const text = await r.text();
    assert(text.includes("requesthub-changelog-widget"), "changelog-embed.js missing expected marker");
  });
  await check("changelog-widget.html", async () => {
    const r = await fetch(BASE_URL + "/changelog-widget.html?customer=" + CUSTOMER);
    assert(r.status === 200, "status " + r.status);
    const text = await r.text();
    assert(text.includes("What's new"), "changelog-widget.html missing expected content");
  });
  const xssPayload = "</script><script>window.__smoke_xsspoc=1</script>";
  await check("widget.html does not let ?customer= break out of its inline <script> tag (reflected-XSS regression)", async () => {
    const r = await fetch(BASE_URL + "/widget.html?customer=" + encodeURIComponent(xssPayload));
    assert(r.status === 200, "status " + r.status);
    const text = await r.text();
    assert(!text.includes(xssPayload), "raw payload (with a literal </script> breakout) appeared unescaped in the response");
  });
  await check("changelog-widget.html does not let ?customer= break out of its inline <script> tag (reflected-XSS regression)", async () => {
    const r = await fetch(BASE_URL + "/changelog-widget.html?customer=" + encodeURIComponent(xssPayload));
    assert(r.status === 200, "status " + r.status);
    const text = await r.text();
    assert(!text.includes(xssPayload), "raw payload (with a literal </script> breakout) appeared unescaped in the response");
  });

  console.log("\nCore read/write loop (public, no auth):");
  let ideaId;
  await check("submit idea", async () => {
    const r = await fetch(BASE_URL + "/api/ideas", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerSlug: CUSTOMER,
        title: "[smoke-test] automated check " + new Date().toISOString(),
        description: "Created by tests/smoke.mjs - safe to ignore or delete.",
        category: "Feature",
      }),
    });
    const body = await r.json();
    assert(r.status === 200, "status " + r.status);
    assert(body.ok === true, "ok was not true: " + JSON.stringify(body));
    assert(body.idea && body.idea.id, "no idea.id in response");
    ideaId = body.idea.id;
  });
  await check("idea appears in list", async () => {
    const r = await fetch(BASE_URL + "/api/ideas?customer=" + CUSTOMER);
    const body = await r.json();
    assert(body.ok !== false, "list call failed: " + JSON.stringify(body));
    assert(Array.isArray(body.ideas), "ideas was not an array");
    assert(body.ideas.some((i) => i.id === ideaId), "newly submitted idea not found in list");
    assert(body.statusLabels && body.statusLabels.declined, "statusLabels missing the declined status");
    assert(Array.isArray(body.categories) && body.categories.length > 0, "categories missing or empty");
    assert(Array.isArray(body.hiddenRoadmapStatuses), "hiddenRoadmapStatuses was not an array");
  });
  await check("submit idea with a custom (non-default) category", async () => {
    const r = await fetch(BASE_URL + "/api/ideas", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerSlug: CUSTOMER,
        title: "[smoke-test] custom category " + Date.now(),
        category: "Smoke Test Category",
      }),
    });
    const body = await r.json();
    assert(body.ok === true, "custom-category submit failed: " + JSON.stringify(body));
    assert(body.idea.category === "Smoke Test Category", "category not stored as submitted");
  });
  await check("submit idea rejects a submitterEmail containing CRLF (email header injection)", async () => {
    const r = await fetch(BASE_URL + "/api/ideas", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerSlug: CUSTOMER,
        title: "[smoke-test] crlf-injection-regression-check " + Date.now(),
        submitterEmail: "attacker@example.com\r\nBcc: victim@example.com",
      }),
    });
    const body = await r.json();
    assert(r.status === 200 && body.ok === false, "expected a clean rejection, got: " + JSON.stringify(body));
  });
  await check("submit idea with tags normalizes, dedupes, and caps at 5", async () => {
    const r = await fetch(BASE_URL + "/api/ideas", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerSlug: CUSTOMER,
        title: "[smoke-test] tags check " + Date.now(),
        category: "Feature",
        tags: ["Mobile", "mobile", " API ", "third", "fourth", "fifth", "sixth"],
      }),
    });
    const body = await r.json();
    assert(body.ok === true, "tagged submit failed: " + JSON.stringify(body));
    assert(Array.isArray(body.idea.tags), "idea.tags was not an array");
    assert(body.idea.tags.length === 5, "expected tags capped at 5, got " + body.idea.tags.length);
    assert(body.idea.tags.includes("mobile") && body.idea.tags.includes("api"), "tags not normalized/deduped as expected: " + JSON.stringify(body.idea.tags));
    const listR = await fetch(BASE_URL + "/api/ideas?customer=" + CUSTOMER);
    const listBody = await listR.json();
    const found = listBody.ideas.find((i) => i.id === body.idea.id);
    assert(found && Array.isArray(found.tags) && found.tags.length === 5, "tags not reflected in idea list");
  });
  await check("tag edit requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/tags", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customerSlug: CUSTOMER, tags: ["hacked"] }),
    });
    assert(r.status === 401, "status " + r.status);
  });
  await check("idea has a permalink page", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER + "/ideas/" + ideaId);
    assert(r.status === 200, "status " + r.status);
  });
  await check("subscribe to idea updates", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "smoke-test-subscriber@example.com" }),
    });
    const body = await r.json();
    assert(r.status === 200, "status " + r.status);
    assert(body.ok === true, "subscribe failed: " + JSON.stringify(body));
  });
  await check("subscribe rejects a missing email", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const body = await r.json();
    assert(r.status === 400, "status " + r.status);
    assert(body.ok === false, "expected ok:false");
  });
  await check("unsubscribe page handles an unknown token gracefully", async () => {
    const r = await fetch(BASE_URL + "/unsubscribe?token=not-a-real-token");
    const text = await r.text();
    assert(r.status === 200, "status " + r.status);
    assert(text.includes("Couldn't unsubscribe"), "missing expected error copy");
  });
  let voterCookie = "";
  const votesBefore = (await (await fetch(BASE_URL + "/api/ideas?customer=" + CUSTOMER)).json()).ideas.find((i) => i.id === ideaId).votes;
  await check("vote up (mints a voter-identity cookie)", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/vote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ direction: "up" }),
    });
    const setCookie = r.headers.get("set-cookie");
    assert(setCookie && setCookie.includes("rh_voter="), "no rh_voter cookie was set on first vote");
    voterCookie = setCookie.split(";")[0];
    const body = await r.json();
    assert(body.ok === true, "vote failed: " + JSON.stringify(body));
    assert(body.idea.votes === votesBefore + 1, "vote count did not increase by exactly 1");
  });
  await check("voting up again with the same voter cookie is a no-op", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/vote", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: voterCookie },
      body: JSON.stringify({ direction: "up" }),
    });
    const body = await r.json();
    assert(body.ok === true, "repeat vote failed: " + JSON.stringify(body));
    assert(body.alreadyVoted === true, "repeat vote from the same visitor was not detected as a duplicate");
    assert(body.idea.votes === votesBefore + 1, "vote count changed on a duplicate vote");
  });
  await check("voting up with no cookie at all also counts as a distinct visitor", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/vote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ direction: "up" }),
    });
    const body = await r.json();
    assert(body.ok === true, "vote failed: " + JSON.stringify(body));
    assert(body.idea.votes === votesBefore + 2, "a second distinct visitor's vote did not increase the count");
  });
  await check("vote down (undo) with the original voter cookie", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/vote", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: voterCookie },
      body: JSON.stringify({ direction: "down" }),
    });
    const body = await r.json();
    assert(body.ok === true, "unvote failed: " + JSON.stringify(body));
    assert(body.idea.votes === votesBefore + 1, "undo did not decrease the count by exactly 1");
  });
  await check("post a comment", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ authorName: "smoke-test", body: "automated comment, safe to ignore" }),
    });
    const body = await r.json();
    assert(body.ok === true, "comment post failed: " + JSON.stringify(body));
  });
  await check("idea list with includeComments=1 returns a searchable comments map", async () => {
    const r = await fetch(BASE_URL + "/api/ideas?customer=" + CUSTOMER + "&includeComments=1");
    const body = await r.json();
    assert(r.status === 200, "status " + r.status);
    assert(body.commentsByIdea && typeof body.commentsByIdea === "object", "commentsByIdea missing or not an object");
  });
  await check("comment appears in list, not flagged internal/team", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/comments");
    const body = await r.json();
    const mine = (body.comments || []).find((c) => c.author_name === "smoke-test");
    assert(mine, "posted comment not found");
    assert(mine.is_team === false, "anonymous comment was flagged is_team");
    assert(mine.internal === false, "anonymous comment was flagged internal");
  });
  await check("idea list reflects the new comment count", async () => {
    const r = await fetch(BASE_URL + "/api/ideas?customer=" + CUSTOMER);
    const body = await r.json();
    const mine = (body.ideas || []).find((i) => i.id === ideaId);
    assert(mine, "idea not found in list");
    assert(mine.comment_count === 1, "expected comment_count 1, got " + mine.comment_count);
  });
  await check("status history reachable", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/history");
    const body = await r.json();
    assert(r.status === 200, "status " + r.status);
    assert(Array.isArray(body.history), "history was not an array");
  });
  await check("status change rejected without a status", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/status", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "not-a-real-status", customerSlug: CUSTOMER }),
    });
    const body = await r.json();
    assert(r.status === 401 || body.ok === false, "invalid status change should be rejected (got " + JSON.stringify(body) + ")");
  });

  console.log("\nBoard takeover protection:");
  await check("a visitor cannot set the first admin password of a passwordless board", async () => {
    const r = await fetch(BASE_URL + "/api/customers/" + CUSTOMER + "/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: "takeover-attempt-123" }),
    });
    assert(r.status === 403, "status " + r.status + " - first-come password claim must be refused");
  });
  await check("a passwordless board's admin page offers signup, not a password form", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER + "/login");
    const text = await r.text();
    assert(r.status === 200, "status " + r.status);
    assert(!text.includes("Set your admin password"), "still offers to set the admin password");
    assert(text.includes("/signup"), "no path to start a board");
  });
  await check("signup requires an admin password", async () => {
    const r = await fetch(BASE_URL + "/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "smoke no password " + Date.now() }),
    });
    const body = await r.json();
    assert(r.status === 400 && body.ok === false, "expected 400, got " + r.status);
  });

  console.log("\nAdmin routes correctly require auth (expect 401/302, no session sent):");
  await check("admin triage page redirects to login", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER + "/admin", { redirect: "manual" });
    assert(r.status === 302, "status " + r.status + " (expected a redirect to login)");
  });
  await check("analytics page redirects to login", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER + "/analytics", { redirect: "manual" });
    assert(r.status === 302, "status " + r.status + " (expected a redirect to login)");
  });
  await check("stats API requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/customers/" + CUSTOMER + "/stats");
    assert(r.status === 401, "status " + r.status);
  });
  await check("settings page redirects to login", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER + "/settings", { redirect: "manual" });
    assert(r.status === 302, "status " + r.status);
  });
  await check("status change requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/status", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "planned", customerSlug: CUSTOMER }),
    });
    assert(r.status === 401, "status " + r.status);
  });
  await check("pin idea requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/pin", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customerSlug: CUSTOMER, pinned: true }),
    });
    assert(r.status === 401, "status " + r.status);
  });
  await check("delete idea requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customerSlug: CUSTOMER }),
    });
    assert(r.status === 401, "status " + r.status);
  });
  await check("merge idea requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/merge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customerSlug: CUSTOMER, canonicalId: ideaId }),
    });
    assert(r.status === 401, "status " + r.status);
  });
  await check("merge-status is public and reports an unmerged idea", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/merge-status?customer=" + CUSTOMER);
    const d = await r.json();
    assert(r.status === 200 && d.ok && d.idea && d.idea.mergedInto === null, JSON.stringify(d));
  });
  await check("webhooks list requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/customers/" + CUSTOMER + "/webhooks");
    assert(r.status === 401, "status " + r.status);
  });
  await check("webhook deliveries list requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/customers/" + CUSTOMER + "/webhooks/1/deliveries");
    assert(r.status === 401, "status " + r.status);
  });
  await check("webhook redeliver requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/customers/" + CUSTOMER + "/webhook-deliveries/1/redeliver", { method: "POST" });
    assert(r.status === 401, "status " + r.status);
  });
  await check("api-key status requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/customers/" + CUSTOMER + "/api-key");
    assert(r.status === 401, "status " + r.status);
  });
  await check("partner API v1 rejects missing auth", async () => {
    const r = await fetch(BASE_URL + "/api/v1/ideas");
    const body = await r.json();
    assert(r.status === 401, "status " + r.status);
    assert(body.ok === false, "expected ok:false");
  });
  await check("partner API v1 rejects an invalid key", async () => {
    const r = await fetch(BASE_URL + "/api/v1/ideas", {
      headers: { Authorization: "Bearer rhk_" + "0".repeat(64) },
    });
    assert(r.status === 401, "status " + r.status);
  });
  await check("partner API v1 rejects a malformed Authorization header", async () => {
    const r = await fetch(BASE_URL + "/api/v1/ideas", {
      headers: { Authorization: "Bearer not-a-real-key-format" },
    });
    assert(r.status === 401, "status " + r.status);
  });
  await check("CSV export requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/customers/" + CUSTOMER + "/export.csv");
    assert(r.status === 401, "status " + r.status);
  });
  await check("linear webhook receiver rejects a bad signature", async () => {
    const r = await fetch(BASE_URL + "/api/webhooks/linear/" + CUSTOMER, {
      method: "POST",
      headers: { "content-type": "application/json", "linear-signature": "0".repeat(64) },
      body: JSON.stringify({ type: "Issue", data: { id: "fake" } }),
    });
    assert(r.status === 401, "status " + r.status);
  });

  if (SMOKE_API_KEY && createdIdeaIds.length) {
    console.log("\nCleanup (partner API, " + CUSTOMER + " tenant):");
    await check("partner API v1 deletes the ideas this run created", async () => {
      for (const id of createdIdeaIds) {
        const r = await realFetch(BASE_URL + "/api/v1/ideas/" + id, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + SMOKE_API_KEY },
        });
        assert(r.status === 200, "delete #" + id + " status " + r.status);
      }
    });
    await check("partner API v1 delete is tenant-scoped (another tenant's idea is not found)", async () => {
      const r = await realFetch(BASE_URL + "/api/v1/ideas/4", {
        method: "DELETE",
        headers: { Authorization: "Bearer " + SMOKE_API_KEY },
      });
      assert(r.status === 404, "status " + r.status + " - smoke-test key must not delete demo's idea #4");
    });
  }

  console.log("\n" + passed + " passed, " + failed + " failed.");
  if (!SMOKE_API_KEY && createdIdeaIds.length) {
    console.log("No SMOKE_API_KEY - left " + createdIdeaIds.length + " test idea(s) on the \"" + CUSTOMER + "\" board.");
  }
  if (failed > 0) {
    console.log("\nFailures:");
    failures.forEach((f) => console.log("  - " + f.name + ": " + f.error));
    process.exit(1);
  }
}

run();
