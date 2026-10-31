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
const DELETE_IDEA_WORKFLOW_ID = "wf_90a8f1268843";
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
      --text-faint: #9290a3;
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
    * { box-sizing: border-box; }
    body {
      margin: 0; background: var(--bg); color: var(--text);
      font-family: "Manrope", -apple-system, sans-serif; font-size: 14px; line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .icon { width: 15px; height: 15px; display: inline-block; vertical-align: -3px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
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

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
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

// Fire-and-forget outbound delivery to every webhook a tenant has registered
// for this event type - no retry/queue (a demo-scale feature, not a durable
// delivery system). Runs via ctx.waitUntil so it completes after the response
// is already sent back to the caller, without the caller waiting on it.
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
    await Promise.all(
      webhooks.map(async (w) => {
        let deliveryStatus = "error";
        try {
          const signature = await signWebhookPayload(w.secret, body);
          const res = await fetch(w.url, {
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
          // Single attempt, no retry - a dead customer endpoint shouldn't
          // affect anything else in the request that triggered this event.
        }
        try {
          await callWorkflow(env, RECORD_WEBHOOK_DELIVERY_WORKFLOW_ID, { id: w.id, status: deliveryStatus });
        } catch {}
      })
    );
  })();
  if (ctx && ctx.waitUntil) ctx.waitUntil(task);
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

async function requireAuth(request, env, customerSlug) {
  const token = getCookie(request, sessionCookieName(customerSlug));
  return verifySessionToken(env, token, customerSlug);
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
  <style>
    ${DESIGN_TOKENS}
    body { font-weight: 400; }
    a { color: inherit; }
    .nav { position: sticky; top: 0; z-index: 10; background: rgba(244,243,247,.85); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; }
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
    <div class="logo-mark">R</div>
    <h1>Log in to your board</h1>
    <p>Enter your board's name to go to its admin login.</p>
    ${errorMsg ? `<div class="error">${escapeHtml(errorMsg)}</div>` : ""}
    <form id="form">
      <input id="slug" required placeholder="e.g. acme-saas" autofocus />
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
    <div class="logo-mark">R</div>
    <h1>Start your own feedback board</h1>
    <p>Enter your company name and we'll set up a real board, with your own Slack, Linear, and Notion connections - no login, no credit card.</p>
    ${errorMsg ? `<div class="error">${escapeHtml(errorMsg)}</div>` : ""}
    <form id="form">
      <label>Company name</label>
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

function signupDonePage(customerSlug) {
  const base = "https://requesthub.zohaib-iot.workers.dev";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>You're set up - RequestHub</title>
  ${DESIGN_FONT_LINK}
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
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; }
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
      <iframe src="${FASTN_BASE}/api/v1/embed/iframe?token=${encodeURIComponent(token)}&org-id=${encodeURIComponent(endOrgId)}&theme=light" allow="clipboard-write"></iframe>
    </div>
  </div>
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
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; }
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
          <label>Channel name</label>
          <input id="slackChannel" name="slackChannel" placeholder="#feedback" value="${escapeHtml(settings.slackChannel || "")}" />
        </div>
      </div>

      <div class="card">
        <h2>Linear</h2>
        <p class="hint">The team that tickets get created in when you mark an idea "Planned" or "In Progress". Pick one from your workspace below, or paste a Team ID directly.</p>
        <div class="field">
          <select id="linearTeamPicker" disabled><option>Loading your Linear teams...</option></select>
          <p class="select-note" id="linearTeamNote"></p>
          <label>Team ID</label>
          <input id="linearTeamId" name="linearTeamId" placeholder="e.g. 6a0351f8-9f72-49b7-a11a-753726597688" value="${escapeHtml(settings.linearTeamId || "")}" />
        </div>
      </div>

      <div class="card">
        <h2>Notion</h2>
        <p class="hint">The changelog database in Notion - each shipped idea becomes its own row (title, category, description), not a line appended to a page. Pick one from your workspace below, or paste a Database ID directly.</p>
        <div class="field">
          <select id="notionPagePicker" disabled><option>Loading your Notion databases...</option></select>
          <p class="select-note" id="notionPageNote"></p>
          <label>Database ID</label>
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
            return `<div class="field">
          <label>${defaultLabel}</label>
          <input name="statusLabel_${key}" value="${escapeHtml(currentLabel)}" placeholder="${defaultLabel}" />
          ${needsLinear
            ? `<select id="linearState_${key}" name="linearStateId_${key}" data-current="${escapeHtml(settings.linearStateIds?.[key] || "")}" disabled><option>${settings.linearTeamId ? "Loading Linear states..." : "Connect a Linear team above first"}</option></select>
          <p class="select-note" id="linearStateNote_${key}"></p>`
            : ""}
        </div>`;
          })
          .join("")}
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
      <p class="hint" style="margin-top: 10px;">Optional: add <code style="background:none;border:none;padding:0;display:inline;">data-color="#ff6600"</code> to match your brand, and <code style="background:none;border:none;padding:0;display:inline;">data-position="bottom-left"</code> / <code style="background:none;border:none;padding:0;display:inline;">"top-left"</code> / <code style="background:none;border:none;padding:0;display:inline;">"top-right"</code> to move it (defaults to bottom-right, current purple).</p>
    </div>

    <div class="card">
      <h2>Team</h2>
      <p class="hint">Invite teammates to sign in with their own email instead of sharing the admin password. Anyone invited gets full admin access, same as the shared password.</p>
      <div id="teamList"></div>
      <div class="team-invite-row">
        <input type="email" id="inviteEmail" placeholder="teammate@company.com" />
        <button type="button" class="btn-copy" id="inviteBtn">Invite</button>
      </div>
      <p class="hint" id="inviteNote" style="margin-top: 8px;"></p>
    </div>

    <div class="card">
      <h2>Webhooks</h2>
      <p class="hint">Notify your own systems when an idea is submitted or its status changes. Each delivery is a signed POST - verify it with HMAC-SHA256 over the raw body using the secret shown when you create it (shown once, not stored anywhere you can retrieve again).</p>
      <div id="webhookList"></div>
      <div class="team-invite-row">
        <input type="url" id="webhookUrl" placeholder="https://your-system.example.com/webhooks/requesthub" />
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
        formData.forEach(function (value, key) {
          if (key.indexOf('statusLabel_') === 0) statusLabels[key.slice('statusLabel_'.length)] = value;
          if (key.indexOf('linearStateId_') === 0) linearStateIds[key.slice('linearStateId_'.length)] = value;
        });
        var body = {
          slackChannel: formData.get('slackChannel') || '',
          linearTeamId: formData.get('linearTeamId') || '',
          notionPageId: formData.get('notionPageId') || '',
          statusLabels: statusLabels,
          linearStateIds: linearStateIds,
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
            return '<div class="team-row"><span>' + url + '<br/><span style="color:var(--text-faint);font-size:11px;">' + w.events.replace(/,/g, ', ') + status + '</span></span>' +
              '<button type="button" class="btn-remove" data-id="' + w.id + '">Remove</button></div>';
          }).join('');
          list.querySelectorAll('.btn-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
              fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/webhooks/' + btn.getAttribute('data-id'), {
                method: 'DELETE',
              }).then(loadWebhooks);
            });
          });
        });
    }
    loadWebhooks();

    document.getElementById('addWebhookBtn').addEventListener('click', function () {
      var input = document.getElementById('webhookUrl');
      var note = document.getElementById('webhookNote');
      var url = input.value.trim();
      if (!url) return;
      fetch('/api/customers/' + encodeURIComponent(customerSlug) + '/webhooks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: url }),
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
  <link rel="icon" href="${favicon}" />
  ${DESIGN_FONT_LINK}
  <style>
    ${DESIGN_TOKENS}
    .topbar {
      background: var(--card); border-bottom: 1px solid var(--border);
      padding: 0 24px; display: flex; align-items: center; gap: 4px; height: 56px;
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

    .empty { color: var(--text-faint); font-size: 13.5px; text-align: center; padding: 40px 16px; }

    .idea { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 14px 16px; margin-bottom: 8px; }
    .idea-row { display: flex; gap: 14px; align-items: flex-start; }
    .idea-body { flex: 1; min-width: 0; }
    .idea-title { font-weight: 600; font-size: 14px; color: var(--text); }
    .idea-desc { color: var(--text-muted); font-size: 13px; margin-top: 3px; line-height: 1.45; }
    .meta { margin-top: 10px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }

    .chip {
      display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: var(--radius-pill);
      font-weight: 600; font-size: 11px;
    }
    .chip.cat-Feature { background: var(--accent-tint); color: var(--accent); }
    .chip.cat-Bug { background: var(--bad-tint); color: var(--bad); }
    .chip.cat-Feedback { background: var(--good-tint); color: var(--good); }

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
    .btn-submit {
      background: var(--accent); color: #fff; border: none; padding: 10px 18px; border-radius: var(--radius-btn);
      font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 4px;
    }
    .btn-submit:hover { background: var(--accent-hover); }
    .btn-cancel {
      background: none; color: var(--text-muted); border: none; padding: 10px 14px; font-size: 13.5px;
      cursor: pointer; font-family: inherit;
    }

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
    <div class="nav-right">
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
              <label>What's your idea, bug, or feedback?</label>
              <input id="title" required maxlength="200" placeholder="e.g. Add dark mode" />
            </div>
            <div class="field">
              <label>More detail (optional)</label>
              <textarea id="description" maxlength="2000" placeholder="Add any extra context..."></textarea>
            </div>
            <div class="row-2">
              <div class="field">
                <label>Category</label>
                <select id="category">
                  <option>Feature</option>
                  <option>Bug</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div class="field">
                <label>Your email (optional)</label>
                <input id="submitterEmail" type="email" placeholder="you@example.com" />
              </div>
            </div>
            <button type="submit" class="btn-submit">Submit</button>
            <button type="button" class="btn-cancel" id="cancelFormBtn">Cancel</button>
          </form>
        </div>

        <div class="filters-row">
          <div class="filter-tabs">
            <button class="filter-tab active" data-sort="votes">Most voted</button>
            <button class="filter-tab" data-sort="new">Newest</button>
          </div>
          <input id="search" placeholder="Search feedback..." />
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
    const categories = ["Feature", "Bug", "Feedback"];
    let allIdeas = [];
    let statusLabels = { under_review: "Under Review", planned: "Planned", in_progress: "In Progress", shipped: "Shipped", declined: "Declined" };
    let activeCategory = "all";
    let activeSort = "votes";

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

      let ideas = allIdeas.filter(function (i) {
        if (activeCategory !== 'all' && i.category !== activeCategory) return false;
        if (q && i.title.toLowerCase().indexOf(q) === -1 && (i.description || '').toLowerCase().indexOf(q) === -1) return false;
        return true;
      });
      ideas = ideas.slice().sort(function (a, b) {
        if (sort === 'new') return new Date(b.created_at) - new Date(a.created_at);
        return b.votes - a.votes;
      });

      if (!ideas.length) {
        list.innerHTML = '<div class="empty">No feedback yet - be the first!</div>';
        return;
      }
      const voted = getVotedIds();

      list.innerHTML = ideas.map(function (i) {
        const hasVoted = voted.indexOf(i.id) !== -1;
        return '<div class="idea">' +
          '<div class="idea-row">' +
          '<div class="vote-widget">' +
          '<button class="vote-arrow up' + (hasVoted ? ' on' : '') + '" data-idea-id="' + i.id + '"' + (hasVoted ? ' disabled' : '') + ' title="Vote">' + ICONS.chevronUp + '</button>' +
          '<span class="vote-count">' + i.votes + '</span>' +
          '<button class="vote-arrow down' + (hasVoted ? '' : ' disabled') + '" data-idea-id="' + i.id + '"' + (hasVoted ? '' : ' disabled') + ' title="Remove vote">' + ICONS.chevronDown + '</button>' +
          '</div>' +
          '<div class="idea-body">' +
          '<div class="idea-title">' + escapeHtml(i.title) + '</div>' +
          (i.description ? '<div class="idea-desc">' + escapeHtml(i.description) + '</div>' : '') +
          '<div class="meta">' +
          '<span class="chip cat-' + i.category + '">' + (ICONS[i.category] || '') + i.category + '</span>' +
          '<span class="chip status-chip ' + i.status + '">' + (statusLabels[i.status] || i.status.replace('_', ' ')) + '</span>' +
          '<span class="meta-right">' +
          '<button class="comment-count" data-idea-id="' + i.id + '">' + ICONS.comment + '<span class="cc-num">Comments</span></button>' +
          '</span>' +
          '</div>' +
          '<div class="comments" id="comments-' + i.id + '">' +
          '<div class="comments-list"></div>' +
          '<form class="comment-form" data-idea-id="' + i.id + '">' +
          '<input class="comment-name" placeholder="Your name" maxlength="80" />' +
          '<input class="comment-email" type="email" placeholder="Email (optional)" maxlength="200" />' +
          '<input class="comment-body" placeholder="Add a comment..." maxlength="2000" required />' +
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
          it.icon + '<span>' + it.label + '</span><span class="count">' + counts[it.key] + '</span></button>';
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

    function load() {
      fetch('/api/ideas?customer=' + encodeURIComponent(customerSlug))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          allIdeas = d.ideas || [];
          if (d.statusLabels) statusLabels = d.statusLabels;
          render();
        });
    }

    document.getElementById('search').addEventListener('input', render);

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
    });

    document.getElementById('submit-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const category = document.getElementById('category').value;
      const submitterEmail = document.getElementById('submitterEmail').value.trim();
      if (!title) return;
      fetch('/api/ideas', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ customerSlug, title, description, category, submitterEmail }),
      })
        .then(function (r) { return r.json(); })
        .then(function () {
          document.getElementById('title').value = '';
          document.getElementById('description').value = '';
          document.getElementById('submitterEmail').value = '';
          document.getElementById('formCard').classList.remove('open');
          load();
        });
    });

    load();
  </script>
  ${["acme-saas", "demo"].includes(customerSlug) ? `<script src="/embed.js" data-customer="${escapeHtml(customerSlug)}"></script>` : ""}
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
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; }
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
  ${DESIGN_FONT_LINK}
  <style>
    ${DESIGN_TOKENS}
    .topbar {
      background: var(--card); border-bottom: 1px solid var(--border);
      padding: 0 24px; display: flex; align-items: center; gap: 4px; height: 56px;
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
    .card.cat-Feature { border-left-color: var(--accent); }
    .card.cat-Bug { border-left-color: var(--bad); }
    .card.cat-Feedback { border-left-color: var(--good); }
    .card-body { flex: 1; min-width: 0; }
    .card-title { font-weight: 600; font-size: 13.5px; color: var(--text); }
    .card-desc { color: var(--text-muted); font-size: 12px; margin-top: 4px; line-height: 1.4; }
    .card-meta { margin-top: 10px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: var(--radius-pill); font-weight: 600; font-size: 10.5px; }
    .chip.cat-Feature { background: var(--accent-tint); color: var(--accent); }
    .chip.cat-Bug { background: var(--bad-tint); color: var(--bad); }
    .chip.cat-Feedback { background: var(--good-tint); color: var(--good); }
    .vote-box {
      flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
      width: 32px; border: 1px solid var(--border); border-radius: 8px; padding: 4px 0; color: var(--text-faint);
    }
    .vote-box .icon { width: 12px; height: 12px; }
    .vote-box .vote-num { font-size: 12px; font-weight: 700; color: var(--text); }
    .empty-col { color: var(--text-faint); font-size: 12px; padding: 10px 2px; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">${escapeHtml(customerSlug)}</div>
    <a class="top-tab" href="/b/${encodeURIComponent(customerSlug)}">Feedback</a>
    <a class="top-tab active" href="/b/${encodeURIComponent(customerSlug)}/roadmap">Roadmap</a>
    <div class="nav-right">
      ${isOwner ? `<a class="nav-admin-link owner-link" href="/owner">&larr; Owner console</a>` : ""}
      <a class="nav-admin-link" href="/b/${encodeURIComponent(customerSlug)}/admin">Admin</a>
    </div>
  </div>

  <div class="page">
    <h1 class="page-title">Roadmap</h1>
    <div class="board" id="board"></div>
  </div>

  <script>
    var customerSlug = ${JSON.stringify(customerSlug)};
    var DEFAULT_LABELS = { under_review: "Under Review", planned: "Planned", in_progress: "In Progress", shipped: "Shipped", declined: "Declined" };

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.innerText = s || '';
      return d.innerHTML;
    }

    function render(ideas, statusLabels) {
      var labels = statusLabels || DEFAULT_LABELS;
      var COLUMNS = ["under_review", "planned", "in_progress", "shipped", "declined"].map(function (key) {
        return { key: key, label: labels[key] || DEFAULT_LABELS[key] };
      });
      var board = document.getElementById('board');
      board.innerHTML = COLUMNS.map(function (col) {
        var items = ideas.filter(function (i) { return i.status === col.key; })
          .sort(function (a, b) { return b.votes - a.votes; });
        var cards = items.length
          ? items.map(function (i) {
              return '<div class="card cat-' + i.category + '">' +
                '<div class="card-body">' +
                '<div class="card-title">' + escapeHtml(i.title) + '</div>' +
                (i.description ? '<div class="card-desc">' + escapeHtml(i.description) + '</div>' : '') +
                '<div class="card-meta">' +
                '<span class="chip cat-' + i.category + '">' + i.category + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="vote-box"><svg class="icon" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg><span class="vote-num">' + i.votes + '</span></div>' +
                '</div>';
            }).join('')
          : '<div class="empty-col">Nothing here yet.</div>';
        return '<div class="column">' +
          '<div class="column-header"><span class="column-dot ' + col.key + '"></span>' +
          '<span class="column-title">' + col.label + '</span>' +
          '<span class="column-count">' + items.length + '</span></div>' +
          cards +
          '</div>';
      }).join('');
    }

    fetch('/api/ideas?customer=' + encodeURIComponent(customerSlug))
      .then(function (r) { return r.json(); })
      .then(function (d) { render(d.ideas || [], d.statusLabels); });
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
  <style>
    ${DESIGN_TOKENS}
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; }
    .logo-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .brand { font-weight: 700; font-size: 15px; }
    .brand .org { color: var(--text-faint); font-weight: 500; }
    .nav-right { margin-left: auto; display: flex; align-items: center; gap: 16px; }
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

    .card { position: relative; background: var(--card); border: 1px solid var(--border); border-left-width: 3px; border-radius: 12px; padding: 12px 28px 12px 11px; margin-bottom: 8px; cursor: grab; }
    .card.cat-Feature { border-left-color: var(--accent); }
    .card.cat-Bug { border-left-color: var(--bad); }
    .card.cat-Feedback { border-left-color: var(--good); }
    .card.dragging { opacity: 0.4; }
    .card-delete-btn {
      position: absolute; top: 6px; right: 6px; width: 18px; height: 18px; line-height: 16px; text-align: center;
      border: none; border-radius: 50%; background: transparent; color: var(--text-faint); font-size: 15px; cursor: pointer; padding: 0;
    }
    .card-delete-btn:hover { background: var(--bad-tint); color: var(--bad); }
    .card-title { font-weight: 600; font-size: 13px; color: var(--text); }
    .card-desc { color: var(--text-muted); font-size: 11.5px; margin-top: 4px; line-height: 1.4; }
    .card-meta { margin-top: 9px; display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }

    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-weight: 600; font-size: 10.5px; }
    .chip.cat-Feature { background: var(--accent-tint); color: var(--accent); }
    .chip.cat-Bug { background: var(--bad-tint); color: var(--bad); }
    .chip.cat-Feedback { background: var(--good-tint); color: var(--good); }
    .chip.badge { background: var(--surface-3); color: var(--text-muted); text-decoration: none; }
    .chip.badge:hover { color: var(--text); }
    .card-votes { color: var(--text-faint); font-size: 10.5px; margin-left: auto; font-weight: 600; }
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
      <a href="/b/${encodeURIComponent(customerSlug)}/settings">Settings</a>
      <a href="/b/${encodeURIComponent(customerSlug)}/billing">Billing</a>
      <a class="logout" href="/b/${encodeURIComponent(customerSlug)}/logout">Log out</a>
    </nav>
  </div>

  <div class="page">
    <div class="filters-row">
      <input id="search" placeholder="Search feedback..." />
      <select id="category">
        <option value="all">All categories</option>
        <option value="Feature">Feature</option>
        <option value="Bug">Bug</option>
        <option value="Feedback">Feedback</option>
      </select>
    </div>
    <div class="board" id="board"></div>
  </div>

  <script>
    const customerSlug = ${JSON.stringify(customerSlug)};
    const statuses = ${JSON.stringify(STATUSES)};
    let allIdeas = [];
    let STATUS_LABELS = { under_review: "Under Review", planned: "Planned", in_progress: "In Progress", shipped: "Shipped", declined: "Declined" };
    let draggingIdeaId = null;

    function escapeHtml(s) {
      const d = document.createElement('div');
      d.innerText = s || '';
      return d.innerHTML;
    }

    function changeStatus(ideaId, status) {
      return fetch('/api/ideas/' + ideaId + '/status', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: status, customerSlug: customerSlug }),
      }).then(function (r) { return r.json(); });
    }

    function render() {
      const board = document.getElementById('board');
      const q = (document.getElementById('search').value || '').toLowerCase();
      const category = document.getElementById('category').value;

      const filtered = allIdeas.filter(function (i) {
        if (category !== 'all' && i.category !== category) return false;
        if (q && i.title.toLowerCase().indexOf(q) === -1 && (i.description || '').toLowerCase().indexOf(q) === -1) return false;
        return true;
      });

      board.innerHTML = statuses.map(function (status) {
        const items = filtered.filter(function (i) { return i.status === status; })
          .sort(function (a, b) { return b.votes - a.votes; });
        const cards = items.length
          ? items.map(function (i) {
              const badges = [];
              if (i.submitter_email) badges.push('<span class="chip badge">' + escapeHtml(i.submitter_email) + '</span>');
              if (i.linear_issue_url) badges.push('<a class="chip badge" href="' + i.linear_issue_url + '" target="_blank" rel="noopener">Linear &#8599;</a>');
              if (i.notion_archived_at) badges.push('<span class="chip badge">Notion</span>');
              return '<div class="card cat-' + i.category + '" draggable="true" data-idea-id="' + i.id + '">' +
                '<button type="button" class="card-delete-btn" data-idea-id="' + i.id + '" title="Delete">&times;</button>' +
                '<div class="card-title">' + escapeHtml(i.title) + '</div>' +
                (i.description ? '<div class="card-desc">' + escapeHtml(i.description) + '</div>' : '') +
                '<div class="card-meta">' +
                '<span class="chip cat-' + i.category + '">' + i.category + '</span>' +
                badges.join('') +
                '<span class="card-votes">' + i.votes + ' votes</span>' +
                '</div>' +
                '</div>';
            }).join('')
          : '<div class="empty-col">Nothing here.</div>';
        return '<div class="column" data-status="' + status + '">' +
          '<div class="column-header"><span class="column-dot ' + status + '"></span>' +
          '<span class="column-title">' + STATUS_LABELS[status] + '</span>' +
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
          if (d.statusLabels) STATUS_LABELS = d.statusLabels;
          render();
        });
    }

    load();
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
  var COLLAPSED = { width: '64px', height: '64px' };
  var EXPANDED = { width: '380px', height: 'min(600px, calc(100vh - 40px))' };
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
    .join(';');
  iframe.setAttribute('allowtransparency', 'true');
  document.body.appendChild(iframe);

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.source !== 'requesthub-widget') return;
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
        <div class="field"><input id="title" required maxlength="200" placeholder="What's on your mind?" /></div>
        <div class="field"><textarea id="description" maxlength="2000" placeholder="More detail (optional)"></textarea></div>
        <div class="field"><input id="email" type="email" placeholder="Your email (optional)" /></div>
        <button type="submit" class="btn-submit">Send feedback</button>
      </form>
    </div>
    <div class="panel-footer"><a href="/b/${encodeURIComponent(customerSlug)}" target="_blank" rel="noopener">View full feedback board &#8599;</a></div>
  </div>

  <script>
    var customerSlug = ${JSON.stringify(customerSlug)};

    function post(type) {
      window.parent.postMessage({ source: 'requesthub-widget', type: type }, '*');
    }

    document.getElementById('launcher').addEventListener('click', function () {
      document.body.classList.add('open');
      post('open');
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
    <h1>${isSetup ? "Set your admin password" : "Admin login"}</h1>
    <p>${
      isSetup
        ? `No admin password is set yet for "${escapeHtml(customerSlug)}". Choose one now - whoever knows it can triage ideas and connect your tools.`
        : `Enter the admin password for "${escapeHtml(customerSlug)}" to continue.`
    }</p>
    ${errorMsg ? `<div class="error">${escapeHtml(errorMsg)}</div>` : ""}
    <form id="form">
      <input id="password" type="password" placeholder="Password" required minlength="6" autofocus />
      <button type="submit">${isSetup ? "Set password & continue" : "Log in"}</button>
    </form>

    ${
      isSetup
        ? ""
        : `<div class="divider">or</div>
    <form id="magicForm">
      <input id="magicEmail" type="email" placeholder="Your invited email address" required />
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
    <h1>RequestHub owner console</h1>
    <p>This is the product-wide admin - every customer on RequestHub, not just one board.</p>
    ${errorMsg ? `<div class="error">${escapeHtml(errorMsg)}</div>` : ""}
    <form id="form">
      <input id="password" type="password" placeholder="Owner password" required autofocus />
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
    .topbar { background: var(--card); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; align-items: center; gap: 10px; }
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

    if (request.method === "GET" && url.pathname === "/signup") {
      return html(signupPage(url.searchParams.get("error")));
    }

    if (request.method === "GET" && url.pathname === "/signup/done") {
      const customerSlug = url.searchParams.get("slug") || "";
      if (!customerSlug) {
        return new Response(null, { status: 302, headers: { Location: "/signup" } });
      }
      return html(signupDonePage(customerSlug));
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
      }
      try {
        await callWorkflow(env, SET_CUSTOMER_SETTINGS_WORKFLOW_ID, {
          customerSlug,
          slackChannel,
          linearTeamId,
          notionPageId,
          statusLabels,
          linearStateIds,
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
        try {
          const settings = await callWorkflow(env, GET_CUSTOMER_SETTINGS_WORKFLOW_ID, { customerSlug });
          statusLabels = settings?.statusLabels || null;
        } catch {}
        return json({ ...data, ideas, statusLabels });
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
      try {
        const data = await callWorkflow(env, VOTE_WORKFLOW_ID, {
          ideaId: Number(voteMatch[1]),
          direction: voteBody.direction === "down" ? "down" : "up",
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    const commentsMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/comments$/);
    if (request.method === "GET" && commentsMatch) {
      try {
        const data = await callWorkflow(env, LIST_COMMENTS_WORKFLOW_ID, { ideaId: Number(commentsMatch[1]) });
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
      try {
        const data = await callWorkflow(env, ADD_COMMENT_WORKFLOW_ID, {
          ideaId: Number(commentsMatch[1]),
          authorName: body.authorName || "Anonymous",
          authorEmail: body.authorEmail || "",
          body: body.body,
        });
        return json(data);
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

    return new Response("Not found", { status: 404 });
  },
};
