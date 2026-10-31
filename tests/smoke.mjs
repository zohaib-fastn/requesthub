#!/usr/bin/env node
// Smoke test suite for the live RequestHub Worker. Exercises only public,
// no-login routes plus auth-gating checks on admin routes (never attempts to
// log in - there's no safe, scriptable way to do that without a real
// customer's password). Run: node tests/smoke.mjs [baseUrl]
//
// Leaves one tagged test idea behind on the "demo" tenant (same precedent as
// every other piece of test data already in this project) - there's no
// public delete endpoint to clean it up without an admin session.

const BASE_URL = process.argv[2] || "https://requesthub.zohaib-iot.workers.dev";
const CUSTOMER = "demo";

let passed = 0;
let failed = 0;
const failures = [];

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
  await check("embed.js", async () => {
    const r = await fetch(BASE_URL + "/embed.js");
    assert(r.status === 200, "status " + r.status);
    const text = await r.text();
    assert(text.includes("requesthub-widget"), "embed.js missing expected marker");
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
  await check("idea has a permalink page", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER + "/ideas/" + ideaId);
    assert(r.status === 200, "status " + r.status);
  });
  await check("vote up", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/vote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ direction: "up" }),
    });
    const body = await r.json();
    assert(body.ok === true, "vote failed: " + JSON.stringify(body));
    assert(body.idea.votes >= 1, "vote count did not increase");
  });
  await check("vote down (undo)", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/vote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ direction: "down" }),
    });
    const body = await r.json();
    assert(body.ok === true, "unvote failed: " + JSON.stringify(body));
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
  await check("comment appears in list, not flagged internal/team", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId + "/comments");
    const body = await r.json();
    const mine = (body.comments || []).find((c) => c.author_name === "smoke-test");
    assert(mine, "posted comment not found");
    assert(mine.is_team === false, "anonymous comment was flagged is_team");
    assert(mine.internal === false, "anonymous comment was flagged internal");
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

  console.log("\nAdmin routes correctly require auth (expect 401/302, no session sent):");
  await check("admin triage page redirects to login", async () => {
    const r = await fetch(BASE_URL + "/b/" + CUSTOMER + "/admin", { redirect: "manual" });
    assert(r.status === 302, "status " + r.status + " (expected a redirect to login)");
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
  await check("delete idea requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/ideas/" + ideaId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customerSlug: CUSTOMER }),
    });
    assert(r.status === 401, "status " + r.status);
  });
  await check("webhooks list requires auth", async () => {
    const r = await fetch(BASE_URL + "/api/customers/" + CUSTOMER + "/webhooks");
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

  console.log("\n" + passed + " passed, " + failed + " failed.");
  if (ideaId) {
    console.log("Left test idea #" + ideaId + " on the \"" + CUSTOMER + "\" board (tagged [smoke-test], no delete route exists without an admin session).");
  }
  if (failed > 0) {
    console.log("\nFailures:");
    failures.forEach((f) => console.log("  - " + f.name + ": " + f.error));
    process.exit(1);
  }
}

run();
