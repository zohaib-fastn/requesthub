# AI triage, "Use from Claude", and pre-demo polish

Plan written 4 Nov 2026 for the Launch Hackathon (sheet "Launch Hackathon (29- Oct)",
id 1lw8l95ggtKNUjTYw6XQcVXax7ptRGKqo1SeBSgsgNLE; Zohaib = column P on Fastn Features,
row 11 on Engineers). Features are already capped (35/35). What is left on the rubric:
"works live on prod" (verified for every demo step), "blockers found and fixed" (13 found,
0 fixed - the one weak category), customer experience and the demo itself.

## Context a fresh model needs

- Repo `~/Documents/repos/requesthub` (public: github.com/zohaib-fastn/requesthub). One
  Cloudflare Worker, `src/index.js` (~8k lines, server-rendered HTML with inline scripts).
  Deploy: `npx wrangler deploy`. Live: https://requesthub.zohaib-iot.workers.dev.
- Logic lives in Fastn workflows (`wf_*`) in Zohaib's personal Fastn org
  (`personal_zohaib-hamdani-cs-gmail`), edited through the `fastn-personal-cs` MCP server
  (`editWorkflowCode`, `createWorkflow`, `testSavedWorkflow`, `runWorkflowCode`). The
  `claude.ai Fastn` server is his work account - never use it for RequestHub.
- The Worker calls workflows with `callWorkflow(env, WF_ID, input, endOrgId, extraHeaders)`;
  `endOrgId` routes connector calls to that customer's own connections. GitHub calls go
  through `callGithubWorkflow` (pins `x-installation-id`, because two connections confuse Fastn).
- Tests: `node tests/smoke.mjs` (64 checks against prod, self-cleaning on the `smoke-test`
  tenant). `.qa/` (gitignored) holds Playwright scripts; `.qa/.tenants.env` has admin
  passwords for test boards `harbor-analytics` and `quill-metrics`. `acme-saas` is the demo
  tenant (Fastn end-org `b14dc996-d036-4797-8908-adbc63f15b77`, Slack channel
  `#acme-saas-request-hub`). Never leave test ideas on `acme-saas` or `demo`.
- Rules: ask before `git commit`/`git push` (commits happen locally; Zohaib says "push");
  no emojis; never paste secrets in chat; Katana writes must name Zohaib; when he is
  active, no long blocking sleeps (hand him the manual steps).
- Demo script: `docs/demo-script.md`. It still says the Slack channel is `#ai-news` (it is
  now `#acme-saas-request-hub`) and does not use the GitHub-release moment yet.
- Gemini: key stored as Fastn secret `GEMINI_API_KEY` (org-wide, `sec_e34cb3cb5793`), read
  in workflows with `await fastn.secrets.get("GEMINI_API_KEY")`. `fastn.ai.complete` is
  401 on prod (B42, fix merged but unreleased) - do not use it. Call
  `https://generativelanguage.googleapis.com/v1beta/models/<model>:generateContent` with
  header `x-goog-api-key`. Measured 4 Nov: `gemini-flash-lite-latest` 0.9 s and
  `gemini-3.5-flash-lite` 1.7 s both answered valid JSON; `gemini-3.8-flash` and
  `gemini-flash-latest` returned 503 "high demand". Use a chain
  `["gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-flash-latest"]`, 8 s
  timeout each, first success wins, and treat any failure as "no AI result" (never fail
  the user's action). The key was pasted in chat once - rotate it in AI Studio after the demo.
- Fastn's workflow sandbox has no `AbortController` and no `setTimeout`. Time-box a call
  with `Promise.race([call(), fastn.sleep(8000).then(() => ({ timeout: true }))])`.
  Re-checked 4 Nov later: `gemini-flash-lite-latest` 977 ms and `gemini-3.5-flash-lite`
  703 ms, both correct ("csv export of dashboards pls" -> Feature, tags export/csv/dashboards);
  `gemini-flash-latest` still timed out at 8 s. Test runs (`runWorkflowCode`) are capped at
  25 s total, so do not call several slow models one after another in a test.

## 1. Use RequestHub from Claude (F64) - BUILT, needs Zohaib's live check

Commit `88f5924` (local, not pushed). Settings card "Use RequestHub from Claude" ->
`POST /api/customers/:slug/claude-url` -> Fastn `POST /api/v1/embed/mcp-connect-codes`
`{endOrgId}` -> one-time URL `https://mcp.fastn.dev/fastn-workspace/c/mcpc_...`, 10-minute
expiry, shown with Copy and a countdown. Verified on prod: route returns 200 with a
well-formed URL for harbor-analytics; smoke 64/64.

Remaining: Zohaib creates a link on acme's Settings, adds it in Claude (Settings ->
Connectors -> Add custom connector), asks "what are acme's most-voted open ideas?" and
"mark idea 283 as planned". Claude should answer from RequestHub's own SaaS connector
(`requesthubapi`, connected on acme) running as acme. Then add this as a demo beat and
mark F64 Using in the sheet.

## 2. AI triage with Gemini - TO BUILD

Goal on stage: submit a messy idea, and within a few seconds the triage board shows it
categorised, tagged, with a one-line summary and "possible duplicate of #N - Merge".
On Shipped, a customer-facing release note is written for the changelog and Slack.

### 2a. Workflow `requesthub-ai-triage` (new, instant tier)

Input `{ op, customerSlug, ideaId }`. Ops:

- `triage`: load the idea; load the board's categories (requesthub_customers.categories,
  default Feature/Bug/Feedback) and up to 150 open ideas (id, title, status) for duplicate
  matching; call Gemini with a JSON response schema
  `{ category: enum(board categories), tags: string[] (<=4, lowercase, <=24 chars),
     summary: string (<=140 chars, plain, no quotes), duplicates: [{id:int, reason:string}] (<=3),
     sentiment: enum(positive, neutral, negative) }`.
  Prompt: "You triage feedback for the product board '<slug>'. Title/description follow.
  Existing open ideas are listed as 'id: title'. Only list a duplicate when it is the same
  request, not merely related." Apply: update `requesthub_ideas.category` only when the
  submitter left the default (first category) and the AI is sure; replace tags via the
  same table `requesthub_idea_tags` the existing `requesthub-set-idea-tags` workflow uses
  (keep any tags already set); store everything in a new table
  `requesthub_idea_ai (idea_id PK, summary, suggested_category, duplicate_ids TEXT,
   duplicates_json TEXT, sentiment, release_note, model, created_at, updated_at)`.
  Return the stored row. Idempotent: a second run overwrites.
- `release_note`: for a Shipped idea, write 1-2 sentences in the customer's voice
  ("You can now ...") from title, description and the last 5 comments; store in
  `requesthub_idea_ai.release_note`; return it.
- `dismiss_duplicate` `{ideaId, duplicateId}`: remove one id from `duplicate_ids`.

Model chain and timeout as above. On any AI failure return `{ ok: true, skipped: reason }`
so callers never fail. Add test cases: happy path (mock-free: the Gemini call is plain
fetch, so run them live on the `smoke-test` tenant and delete the ideas after), empty
description, unknown idea, AI failure (point at a bad model name) -> skipped.

### 2b. Worker wiring (`src/index.js`)

- After a successful submit on both paths (`deliverWebhooks(... "idea.created" ...)` at the
  board/widget route and the partner API route), `ctx.waitUntil(aiTriage(env, ctx, slug, ideaId, origin))`:
  calls the workflow, then `stampBoardWrite` + purges `boardCacheKeys` so the board shows
  the new category/tags. Never on the request path (submit stays ~2.5 s).
- On a transition to `shipped` (all four status call sites pass through
  `UPDATE_STATUS_WORKFLOW_ID`): call `release_note` first, then pass `releaseNote` into the
  status workflow so the Slack Shipped message's section text uses it when present; the
  changelog (`requesthub-list-changelog`, `wf_69d695b3974e`) returns
  `COALESCE(ai.release_note, i.description)` as `description` via LEFT JOIN requesthub_idea_ai.
- List workflow (`LIST_WORKFLOW_ID` = `wf_a825a0c0f5bd`): LEFT JOIN requesthub_idea_ai and
  return `ai: { summary, duplicates: [{id, title}], sentiment }` per idea (titles joined in SQL).
- Routes: `POST /api/ideas/:id/ai-triage` (admin, re-run on demand),
  `POST /api/ideas/:id/ai-duplicate-dismiss` (admin). Merge already exists:
  `POST /api/ideas/:id/merge` (grep `mergeMatch`).
- Triage UI (admin page, grep `tag-chip` renderers ~lines 4860-4880): under the title show
  the AI summary in muted text, and when `ai.duplicates` is non-empty a chip
  "Possible duplicate of #N" with buttons "Merge into #N" (calls the merge route) and
  "Not a duplicate" (dismiss). A small "AI" badge next to tags the AI set.
- Idea page and public board: show the summary only if it reads well; keep it optional.
- Smoke: the two new routes require auth (401); unknown idea 404.

### 2c. Demo beat (add to docs/demo-script.md)

At 1:30, after "Export dashboards to CSV" is submitted from the example site, open triage
and point out it was filed as Feature, tagged `export`, `csv`, with a one-line summary and
no duplicate; then submit "csv export of dashboards pls" from the board and show the
"Possible duplicate of #N" chip and Merge. At 4:30 the Shipped Slack message carries the
AI release note.

## 3. UI and performance - measured 4 Nov (Playwright, prod, cold contexts)

| Page | first byte | settled | requests | finding |
|---|---|---|---|---|
| Board (cached) | 145 ms | 0.8 s | 6 | fine; HTML is 79 KB because ideas are inlined - acceptable |
| Idea page | 785-990 ms | 2.9 s | 6 | slow server: not edge-cached, serial Fastn calls |
| Settings (admin) | 800 ms | 5.6-6.5 s | 11 | 3 destination pickers + states + webhooks + API key + deliveries + GitHub, all separate, all on load |
| Connect (admin) | 1.5 s | 12.7 s | 24 | server does tier catalogue + installation checks before responding; the hub iframe is heavy |
| Mobile (390px) | - | - | - | no horizontal overflow on any page; no console errors anywhere |

Fixes, in order of demo value:

1. Connect first byte: move `ensureTierCatalogue` and `ensureConnectInstallations` to
   `ctx.waitUntil` (they only matter for boards created before a tool existed) - 1.5 s -> ~0.3 s.
2. Idea page: cache it like the board (add `/b/:slug/ideas/:id` to `boardCacheKeyFor` with
   the same write-stamp invalidation) and run its Fastn reads in `Promise.all`.
3. Settings: one `GET /api/customers/:slug/settings-data` that returns pickers, webhooks,
   API-key status, deliveries and GitHub in one response (server fans out in parallel), or at
   least load the below-the-fold cards (deliveries, GitHub) lazily on scroll. Target: settle < 2 s.
4. Settings page on mobile: the three pickers read "No options found" on a board with no
   tools; hide the picker until an option exists and keep the text field - less noise.
5. Admin triage on mobile: the per-card "tags, comma separated" input is heavy; collapse it
   behind a "Tags" tap target.
6. Home page first load 1.5 s to DOMContentLoaded (cold); check the font `<link>` is
   preconnected and non-blocking.

## 4. Housekeeping before the demo

- Push local commits `d4d214f`, `e0e8d6c`, `88f5924` (ask Zohaib: "push").
- Blockers tab: log today's four Fastn findings (B111+): CONNECTION_AMBIGUOUS when a tenant has
  two connections even though one is default; forkConnector refuses an org with no parent;
  mock stubs refused on shared catalog connectors (403); the catalog GitHub OAuth asks for
  admin:org, admin:enterprise, manage_billing:enterprise. Raise in Intercom per rule 4.
- Daily Updates row for Wed 4 Nov before 19:00 (GitHub releases, Use from Claude, AI triage,
  the Slack formatting fix, Connect page cleanup, with links).
- Demo script: fix the Slack channel name, add the GitHub-release climax (publish a release
  linking an acme idea; Check now; the idea ships and Slack/Linear/Notion follow), the
  Claude beat, and the AI triage beat.
- Delete the test release `rh-release-test-1` on github.com/zohaib-fastn/requesthub and the
  test row "[Feature] [test] GitHub release auto-ship check" in acme's Notion changelog DB.
- Blocker fixes in fastn-platform (the 20-point category): PRs for the CONNECTION_AMBIGUOUS
  default-connection bug and B106 (updateOrgConfig drops tier fields) are the cleanest.
