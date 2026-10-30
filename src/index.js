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
    .status-select { width: auto; padding: 3px 6px; font-size: 12px; }
    .idea-row { display: flex; gap: 12px; align-items: flex-start; }
    .vote-btn { width: auto; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6px 10px; border: 1px solid #d0d0d0; border-radius: 8px; background: #fff; cursor: pointer; font-size: 11px; color: #444; line-height: 1.1; }
    .vote-btn:hover { background: #f3f4f6; }
    .vote-btn.voted { background: #eef2ff; border-color: #3730a3; color: #3730a3; cursor: default; }
    .vote-btn .count { font-size: 15px; font-weight: 700; }
    .idea-body { flex: 1; min-width: 0; }
    .comments-toggle { background: none; border: none; color: #3730a3; font-size: 12px; cursor: pointer; padding: 0; margin-top: 8px; width: auto; }
    .comments-toggle:hover { text-decoration: underline; }
    .comments { display: none; margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px; }
    .comments.open { display: block; }
    .comment { font-size: 13px; margin-bottom: 8px; }
    .comment-author { font-weight: 600; }
    .comment-form { display: flex; gap: 6px; margin-top: 8px; }
    .comment-form input { flex: 1; margin: 0; padding: 6px 8px; font-size: 13px; }
    .comment-form button { margin: 0; padding: 6px 12px; font-size: 13px; }
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
      const voted = getVotedIds();

      list.innerHTML = ideas.map(function (i) {
        const options = statuses.map(function (s) {
          return '<option value="' + s + '"' + (s === i.status ? ' selected' : '') + '>' + s.replace('_', ' ') + '</option>';
        }).join('');
        const hasVoted = voted.indexOf(i.id) !== -1;
        return '<div class="idea">' +
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
            return '<div class="comment"><span class="comment-author">' + escapeHtml(c.author_name) + ':</span> ' + escapeHtml(c.body) + '</div>';
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
