const SUBMIT_WORKFLOW_ID = "wf_3316b2d12e5f";
const LIST_WORKFLOW_ID = "wf_a825a0c0f5bd";
const UPDATE_STATUS_WORKFLOW_ID = "wf_b5b1e6e18d9b";
const VOTE_WORKFLOW_ID = "wf_af7b6c5033db";
const ADD_COMMENT_WORKFLOW_ID = "wf_fc41a427478e";
const LIST_COMMENTS_WORKFLOW_ID = "wf_115e3671bb89";
const FASTN_BASE = "https://api.fastn.dev";
const STATUSES = ["under_review", "planned", "in_progress", "shipped"];
const DEFAULT_LINEAR_TEAM_ID = "6a0351f8-9f72-49b7-a11a-753726597688";
const DEFAULT_NOTION_PAGE_ID = "409a930e-131b-8141-b9b3-e1f703a67f6f";

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
  const favicon =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%234f46e5'/%3E%3Cpath d='M9 22V10h7.2c2.9 0 4.8 1.7 4.8 4.3 0 1.9-1 3.3-2.7 3.9L22 22h-3.3l-3.2-3.4H12V22H9zm3-5.8h4c1.4 0 2.2-.7 2.2-1.9 0-1.2-.8-1.8-2.2-1.8h-4v3.7z' fill='white'/%3E%3C/svg%3E";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RequestHub - ${escapeHtml(customerSlug)}</title>
  <link rel="icon" href="${favicon}" />
  <style>
    :root {
      --bg: #f8fafc;
      --card: #ffffff;
      --border: #e2e8f0;
      --border-strong: #cbd5e1;
      --text: #0f172a;
      --text-muted: #64748b;
      --text-faint: #94a3b8;
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --primary-light: #eef2ff;
      --radius-lg: 16px;
      --radius-md: 10px;
      --radius-sm: 7px;
      --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
      --shadow-md: 0 1px 3px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.04);
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      color: var(--text);
      background: var(--bg);
      -webkit-font-smoothing: antialiased;
    }
    .topbar {
      background: var(--card);
      border-bottom: 1px solid var(--border);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-mark {
      width: 30px; height: 30px; border-radius: 8px;
      background: var(--primary); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 15px; flex-shrink: 0;
    }
    .brand { font-weight: 700; font-size: 16px; letter-spacing: -0.01em; }
    .tenant-pill {
      margin-left: auto; font-size: 12px; font-weight: 600; color: var(--primary);
      background: var(--primary-light); padding: 4px 10px; border-radius: 999px;
    }
    .page { max-width: 680px; margin: 0 auto; padding: 32px 20px 64px; }
    .hero { margin-bottom: 24px; }
    .hero h1 { font-size: 24px; margin: 0 0 4px; letter-spacing: -0.02em; }
    .hero p { margin: 0; color: var(--text-muted); font-size: 14.5px; }
    .card {
      background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    form.card { padding: 20px; margin-bottom: 32px; }
    .field { margin-bottom: 14px; }
    .field:last-of-type { margin-bottom: 0; }
    label {
      display: block; font-size: 12px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.04em; color: var(--text-muted); margin-bottom: 6px;
    }
    label .optional { text-transform: none; font-weight: 400; letter-spacing: normal; color: var(--text-faint); }
    input, textarea, select {
      width: 100%; padding: 10px 12px; border: 1px solid var(--border-strong);
      border-radius: var(--radius-sm); font-size: 14px; font-family: inherit; color: var(--text);
      background: #fff; transition: border-color .15s, box-shadow .15s;
    }
    input::placeholder, textarea::placeholder { color: var(--text-faint); }
    input:focus, textarea:focus, select:focus {
      outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light);
    }
    textarea { resize: vertical; min-height: 64px; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    button { font-family: inherit; cursor: pointer; }
    .btn-primary {
      background: var(--primary); color: #fff; border: none; padding: 11px 20px;
      border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; margin-top: 16px;
      transition: background .15s;
    }
    .btn-primary:hover { background: var(--primary-hover); }
    .section-head {
      display: flex; align-items: baseline; justify-content: space-between;
      margin-bottom: 12px;
    }
    .section-head h2 { font-size: 15px; margin: 0; color: var(--text-muted); font-weight: 600; }
    .empty {
      color: var(--text-faint); font-size: 14px; text-align: center; padding: 32px 16px;
    }
    .idea {
      padding: 16px; margin-bottom: 10px;
    }
    .idea-row { display: flex; gap: 14px; align-items: flex-start; }
    .vote-btn {
      flex-shrink: 0; width: 54px; display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 1px; padding: 8px 4px; border: 1px solid var(--border-strong);
      border-radius: var(--radius-md); background: #fff; color: var(--text-muted);
      font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em;
      transition: all .15s;
    }
    .vote-btn::before { content: "▲"; font-size: 9px; color: var(--text-faint); margin-bottom: 2px; }
    .vote-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
    .vote-btn:hover::before { color: var(--primary); }
    .vote-btn.voted { background: var(--primary); border-color: var(--primary); color: #fff; cursor: default; }
    .vote-btn.voted::before { color: #fff; }
    .vote-btn .count { font-size: 17px; font-weight: 700; font-family: inherit; line-height: 1.1; }
    .idea-body { flex: 1; min-width: 0; }
    .idea-title { font-weight: 600; font-size: 15px; letter-spacing: -0.005em; }
    .idea-desc { color: var(--text-muted); font-size: 13.5px; margin-top: 3px; line-height: 1.45; }
    .meta { margin-top: 10px; display: flex; gap: 8px; align-items: center; font-size: 12px; flex-wrap: wrap; }
    .tag {
      padding: 3px 9px; border-radius: 999px; font-weight: 600; font-size: 11.5px;
      background: var(--primary-light); color: var(--primary);
    }
    .tag.Bug { background: #fee2e2; color: #b91c1c; }
    .tag.Feedback { background: #d1fae5; color: #047857; }
    .status-select {
      width: auto; padding: 4px 8px; font-size: 12px; font-weight: 600; border-radius: 999px;
      border-color: var(--border); background: #f1f5f9; color: var(--text-muted);
      -webkit-appearance: none; appearance: none; cursor: pointer;
    }
    .status-select:focus { box-shadow: 0 0 0 3px var(--primary-light); }
    .comments-toggle {
      background: none; border: none; color: var(--text-muted); font-size: 12.5px; font-weight: 600;
      cursor: pointer; padding: 0; margin-top: 10px; width: auto; display: inline-flex; align-items: center; gap: 4px;
    }
    .comments-toggle::before { content: "💬"; font-size: 12px; }
    .comments-toggle:hover { color: var(--primary); }
    .comments {
      display: none; margin-top: 12px; border-top: 1px solid var(--border); padding-top: 12px;
    }
    .comments.open { display: block; }
    .comments-list { margin-bottom: 10px; }
    .comment { font-size: 13px; margin-bottom: 10px; display: flex; gap: 8px; }
    .comment-avatar {
      width: 22px; height: 22px; border-radius: 50%; background: var(--primary-light); color: var(--primary);
      font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .comment-body-text { color: var(--text); line-height: 1.4; }
    .comment-author { font-weight: 600; margin-right: 4px; }
    .comment-form { display: flex; gap: 6px; }
    .comment-form input { flex: 1; margin: 0; padding: 7px 10px; font-size: 13px; }
    .comment-form button {
      margin: 0; padding: 7px 14px; font-size: 13px; font-weight: 600; border: none;
      border-radius: var(--radius-sm); background: var(--primary); color: #fff;
    }
    .comment-form button:hover { background: var(--primary-hover); }
    .footer-note {
      text-align: center; color: var(--text-faint); font-size: 12px; margin-top: 32px;
    }
    @media (max-width: 480px) {
      .page { padding: 20px 14px 48px; }
      .row-2 { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="logo-mark">R</div>
    <div class="brand">RequestHub</div>
    <div class="tenant-pill">${escapeHtml(customerSlug)}</div>
  </div>

  <div class="page">
    <div class="hero">
      <h1>Feedback board</h1>
      <p>Share an idea, report a bug, or vote on what we should build next.</p>
    </div>

    <form id="submit-form" class="card">
      <div class="field">
        <label>What's your idea, bug, or feedback?</label>
        <input id="title" required maxlength="200" placeholder="e.g. Add dark mode" />
      </div>
      <div class="field">
        <label>More detail <span class="optional">(optional)</span></label>
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
          <label>Your email <span class="optional">(optional)</span></label>
          <input id="submitterEmail" type="email" placeholder="you@example.com" />
        </div>
      </div>
      <button type="submit" class="btn-primary">Submit feedback</button>
    </form>

    <div class="section-head"><h2>All requests</h2></div>
    <div id="list"><div class="empty">Loading...</div></div>

    <div class="footer-note">Powered by RequestHub, built on Fastn</div>
  </div>

  <script>
    const customerSlug = ${JSON.stringify(customerSlug)};
    const statuses = ${JSON.stringify(STATUSES)};

    function render(ideas) {
      const list = document.getElementById('list');
      if (!ideas.length) {
        list.innerHTML = '<div class="empty">No ideas yet - be the first!</div>';
        return;
      }
      const voted = getVotedIds();

      list.innerHTML = ideas.map(function (i) {
        const options = statuses.map(function (s) {
          return '<option value="' + s + '"' + (s === i.status ? ' selected' : '') + '>' + s.replace('_', ' ') + '</option>';
        }).join('');
        const hasVoted = voted.indexOf(i.id) !== -1;
        return '<div class="idea card">' +
          '<div class="idea-row">' +
          '<button class="vote-btn' + (hasVoted ? ' voted' : '') + '" data-idea-id="' + i.id + '"' + (hasVoted ? ' disabled' : '') + '>' +
          '<span class="count">' + i.votes + '</span><span>vote' + (i.votes === 1 ? '' : 's') + '</span>' +
          '</button>' +
          '<div class="idea-body">' +
          '<div class="idea-title">' + escapeHtml(i.title) + '</div>' +
          (i.description ? '<div class="idea-desc">' + escapeHtml(i.description) + '</div>' : '') +
          '<div class="meta"><span class="tag ' + i.category + '">' + i.category + '</span>' +
          '<select class="status-select" data-idea-id="' + i.id + '">' + options + '</select>' +
          '</div>' +
          '<button class="comments-toggle" data-idea-id="' + i.id + '">Comments</button>' +
          '<div class="comments" id="comments-' + i.id + '">' +
          '<div class="comments-list"></div>' +
          '<form class="comment-form" data-idea-id="' + i.id + '">' +
          '<input class="comment-name" placeholder="Your name" maxlength="80" />' +
          '<input class="comment-body" placeholder="Add a comment..." maxlength="2000" required />' +
          '<button type="submit">Post</button>' +
          '</form>' +
          '</div>' +
          '</div>' +
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

      list.querySelectorAll('.vote-btn:not(.voted)').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const ideaId = btn.getAttribute('data-idea-id');
          fetch('/api/ideas/' + ideaId + '/vote', { method: 'POST' })
            .then(function (r) { return r.json(); })
            .then(function () {
              addVotedId(Number(ideaId));
              load();
            });
        });
      });

      list.querySelectorAll('.comments-toggle').forEach(function (btn) {
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
          const bodyInput = form.querySelector('.comment-body');
          const body = bodyInput.value.trim();
          if (!body) return;
          fetch('/api/ideas/' + ideaId + '/comments', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ authorName: nameInput.value.trim() || 'Anonymous', body }),
          })
            .then(function (r) { return r.json(); })
            .then(function () {
              bodyInput.value = '';
              loadComments(ideaId);
            });
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
      try {
        return JSON.parse(localStorage.getItem('requesthub_voted_' + customerSlug) || '[]');
      } catch {
        return [];
      }
    }

    function addVotedId(id) {
      try {
        const ids = getVotedIds();
        if (ids.indexOf(id) === -1) ids.push(id);
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

    const voteMatch = url.pathname.match(/^\/api\/ideas\/(\d+)\/vote$/);
    if (request.method === "POST" && voteMatch) {
      try {
        const data = await callWorkflow(env, VOTE_WORKFLOW_ID, { ideaId: Number(voteMatch[1]) });
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
          body: body.body,
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
          linearTeamId: body.linearTeamId || DEFAULT_LINEAR_TEAM_ID,
          notionPageId: body.notionPageId || DEFAULT_NOTION_PAGE_ID,
        });
        return json(data);
      } catch (err) {
        return json({ ok: false, error: err.message }, 502);
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
