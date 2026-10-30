const SUBMIT_WORKFLOW_ID = "wf_3316b2d12e5f";
const LIST_WORKFLOW_ID = "wf_a825a0c0f5bd";
const UPDATE_STATUS_WORKFLOW_ID = "wf_b5b1e6e18d9b";
const FASTN_BASE = "https://api.fastn.dev";
const STATUSES = ["under_review", "planned", "in_progress", "shipped"];

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

async function callWorkflow(env, workflowId, input) {
  const res = await fetch(`${FASTN_BASE}/api/v1/workflows/${workflowId}/execute`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FASTN_API_KEY}`,
      "X-fastn-Test-Mode": "true",
      "x-fastn-env": "test",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `Fastn call failed: ${res.status}`);
  }
  return body?.data ?? body;
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

function boardPage(customerSlug) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RequestHub - ${escapeHtml(customerSlug)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px; color: #1a1a1a; background: #fafafa; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .sub { color: #666; margin-bottom: 24px; font-size: 14px; }
    form { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 16px; margin-bottom: 28px; }
    label { display: block; font-size: 13px; font-weight: 600; margin-top: 10px; margin-bottom: 4px; }
    input, textarea, select { width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid #d0d0d0; border-radius: 6px; font-size: 14px; font-family: inherit; }
    textarea { resize: vertical; min-height: 60px; }
    button { margin-top: 14px; background: #1f2937; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; cursor: pointer; }
    button:hover { background: #111827; }
    .idea { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; }
    .idea-title { font-weight: 600; font-size: 15px; }
    .idea-desc { color: #444; font-size: 14px; margin-top: 4px; }
    .meta { margin-top: 8px; display: flex; gap: 8px; align-items: center; font-size: 12px; flex-wrap: wrap; }
    .tag { padding: 2px 8px; border-radius: 999px; background: #eef2ff; color: #3730a3; }
    .tag.Bug { background: #fee2e2; color: #991b1b; }
    .tag.Feedback { background: #ecfdf5; color: #065f46; }
    .status { color: #888; }
    .empty { color: #888; font-size: 14px; }
    .status-select { width: auto; padding: 3px 6px; font-size: 12px; margin-left: auto; }
  </style>
</head>
<body>
  <h1>RequestHub</h1>
  <div class="sub">Feedback board for <strong>${escapeHtml(customerSlug)}</strong></div>

  <form id="submit-form">
    <label>What's your idea, bug, or feedback?</label>
    <input id="title" required maxlength="200" placeholder="e.g. Add dark mode" />
    <label>More detail (optional)</label>
    <textarea id="description" maxlength="2000"></textarea>
    <label>Category</label>
    <select id="category">
      <option>Feature</option>
      <option>Bug</option>
      <option>Feedback</option>
    </select>
    <label>Your email (optional - we'll notify you on updates)</label>
    <input id="submitterEmail" type="email" placeholder="you@example.com" />
    <button type="submit">Submit</button>
  </form>

  <div id="list"><div class="empty">Loading...</div></div>

  <script>
    const customerSlug = ${JSON.stringify(customerSlug)};
    const statuses = ${JSON.stringify(STATUSES)};

    function render(ideas) {
      const list = document.getElementById('list');
      if (!ideas.length) {
        list.innerHTML = '<div class="empty">No ideas yet - be the first!</div>';
        return;
      }
      list.innerHTML = ideas.map(function (i) {
        const options = statuses.map(function (s) {
          return '<option value="' + s + '"' + (s === i.status ? ' selected' : '') + '>' + s.replace('_', ' ') + '</option>';
        }).join('');
        return '<div class="idea">' +
          '<div class="idea-title">' + escapeHtml(i.title) + '</div>' +
          (i.description ? '<div class="idea-desc">' + escapeHtml(i.description) + '</div>' : '') +
          '<div class="meta"><span class="tag ' + i.category + '">' + i.category + '</span>' +
          '<select class="status-select" data-idea-id="' + i.id + '">' + options + '</select>' +
          '</div>' +
          '</div>';
      }).join('');

      list.querySelectorAll('.status-select').forEach(function (sel) {
        sel.addEventListener('change', function () {
          const ideaId = sel.getAttribute('data-idea-id');
          fetch('/api/ideas/' + ideaId + '/status', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ status: sel.value }),
          })
            .then(function (r) { return r.json(); })
            .then(function () { load(); });
        });
      });
    }

    function escapeHtml(s) {
      const d = document.createElement('div');
      d.innerText = s || '';
      return d.innerHTML;
    }

    function load() {
      fetch('/api/ideas?customer=' + encodeURIComponent(customerSlug))
        .then(function (r) { return r.json(); })
        .then(function (d) { render(d.ideas || []); });
    }

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
          load();
        });
    });

    load();
  </script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "")) {
      return html(boardPage("demo"));
    }

    const boardMatch = url.pathname.match(/^\/b\/([a-z0-9-]+)\/?$/);
    if (request.method === "GET" && boardMatch) {
      return html(boardPage(boardMatch[1]));
    }

    if (request.method === "GET" && url.pathname === "/api/ideas") {
      const customerSlug = url.searchParams.get("customer") || "demo";
      try {
        const data = await callWorkflow(env, LIST_WORKFLOW_ID, { customerSlug });
        return json(data);
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
      try {
        const data = await callWorkflow(env, SUBMIT_WORKFLOW_ID, {
          customerSlug: body.customerSlug || "demo",
          title: body.title,
          description: body.description || "",
          category: body.category || "Feature",
          submitterEmail: body.submitterEmail || "",
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
      try {
        const data = await callWorkflow(env, UPDATE_STATUS_WORKFLOW_ID, {
          ideaId: Number(statusMatch[1]),
          status: body.status,
          linearTeamId: body.linearTeamId || "",
          notionPageId: body.notionPageId || "",
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
