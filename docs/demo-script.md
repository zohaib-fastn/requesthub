# RequestHub demo - 7 minutes + 3 minutes of questions

Rubric reminder (Demo Day tab): works live on prod from the fresh account (25), customer
experience (10), demo (10). A recording earns half, so every step below is live.

## Before the demo

**The night before**
1. Sign in at https://requesthub.zohaib-iot.workers.dev/login with Google, using the personal
   account, and check that acme-saas is on your account (you need its admin side for most steps).
2. Post one test mention in #acme-saas-request-hub: `@fastn idea: test before the demo`.
   Within a few seconds the bot should reply in the thread with a link. Delete that idea from
   triage afterwards.
3. Claude: on acme's Settings, "Use RequestHub from Claude" -> Create link. In Claude, Settings
   -> Connectors -> Add custom connector, paste the link (it works once, for 10 minutes). Ask
   "What are the three most-voted open ideas on acme-saas?". If it answers, keep the connector
   for the demo; if not, drop the 5:40 beat.
4. Prepare the GitHub release (it is published live, so it must exist as a draft):
   github.com/zohaib-fastn/requesthub -> Releases -> Draft a new release. Tag `demo-1`,
   title "Row-level permissions", notes:
   `Regional managers now only see their own region's rows. Ships https://requesthub.zohaib-iot.workers.dev/b/acme-saas/ideas/254`
   Click **Save draft** (not Publish). On acme's Settings, the "GitHub releases" card must list
   `zohaib-fastn/requesthub` as followed.
5. Rehearse once end to end with a timer. Rehearsal moves idea 254 and merges ideas, so put
   254 back to Under Review afterwards and use different idea titles in the rehearsal.

**15 minutes before** - open these tabs, in this order, all signed in:
1. https://requesthub.zohaib-iot.workers.dev (home page)
2. https://requesthub.zohaib-iot.workers.dev/example/acme-saas (Acme's own product)
3. https://requesthub.zohaib-iot.workers.dev/b/acme-saas (Acme's public board)
4. https://requesthub.zohaib-iot.workers.dev/b/acme-saas/admin (triage)
5. https://requesthub.zohaib-iot.workers.dev/b/acme-saas/connect
6. https://requesthub.zohaib-iot.workers.dev/b/acme-saas/settings (scrolled to "GitHub releases")
7. Linear, the REQ team board
8. Slack, #acme-saas-request-hub
9. Notion, the changelog database
10. GitHub, the `demo-1` draft release (edit page, so Publish is one click)
11. Claude, a new chat with the RequestHub connector on

Close everything else, turn on Do Not Disturb, zoom the browser to 110%.

## The script

**0:00 - The problem (25s)**
> "Every SaaS team wants a feedback board inside its product. And every one of their
> customers wants that feedback to land in *their own* Slack, Linear and Notion. Building
> that means OAuth, tokens and three APIs, multiplied by every customer. RequestHub is a
> Canny-style feedback board where all of that is Fastn."

Show tab 1 for a moment.

**0:25 - A new customer signs up (45s)** - tab 1, "Start your board"
- Click "Sign up with Google", pick the account, name the board (e.g. "Demo Co").
- Land on the done page: "This is everything a customer has to do: one line of script."

**1:10 - Feedback from inside the customer's product, triaged by AI (90s)** - tab 2
> "This is Acme's own analytics product. That button in the corner is the line you just saw."
- Click the button, type "Export dashboards to CSV", send. "Thanks! We got it."
- Tab 8 (Slack): the "new idea" post landed in Acme's own channel.
- Tab 4 (triage): the card already carries a one-line AI summary and tags (`export`, `csv`).
> "Gemini reads every new idea: it picks the category when the customer didn't, tags it,
> summarises it and looks for duplicates. It runs after the customer has their answer,
> so it never slows a submission down."
- Tab 3 (public board): submit "csv download for dashboards pls". Back on tab 4, within a few
  seconds that card shows **Possible duplicate of #... Export dashboards to CSV**. Click
  **Merge**: votes and comments move to one idea.
- Point at "Scheduled PDF reports by email" (54 votes): the AI also caught that a request
  captured from Slack (#282) asks for the same thing.

**2:40 - Each customer connects their own tools (30s)** - tab 5
> "This is the Fastn hub, embedded with Fastn's SDK. Acme connected *their* Slack, Linear,
> Notion and GitHub here. Another customer connects theirs - nothing is shared."

**3:10 - Triage flows into their tools, both ways (75s)** - tab 4
- Move "Row-level permissions" from Under Review to **Planned**.
- Tab 7: a new Linear issue appears in Acme's REQ team, linked back to the idea.
- In Linear, move that issue to **In Progress**. Back on tab 4: the idea moved by itself.
> "Linear's webhook goes through a Fastn trigger, so every delivery is logged, retried and replayable."

**4:25 - Shipping is a GitHub release (45s)** - tab 10, then tab 6
- Publish the `demo-1` draft. Its notes link the idea.
- Tab 6, GitHub releases card: **Check now**. "1 new release, 1 idea shipped."
- The idea is Shipped: the Linear issue moves to Done, Notion (tab 9) gets a changelog row,
  and Slack (tab 8) gets the Shipped announcement - its text is the AI-written release note.
- Tab 3 -> Changelog: the release sits next to the shipped idea.
> "Every customer can follow their own public repos. They ship, their customers hear about it."

**5:10 - Ideas straight from Slack (30s)** - tab 8
- Post: `@fastn idea: let customers export the roadmap as PDF`
- The bot replies in the thread with a link: the idea is on Acme's board with your vote.

**5:40 - Use it from Claude (40s)** - tab 11 (skip if step 3 of the night before failed)
- Ask: "What are the most-voted open ideas on acme-saas, and is anything a duplicate?"
> "Settings gives each customer a one-time link that puts their board in Claude, through
> Fastn's MCP gateway, running as that customer - their data only."

**6:20 - Built to be relied on (20s)** - say, don't show
- Every delivery from Slack and Linear is listed in Settings with a Retry button (Fastn replay).
- Submits are idempotent, plans are enforced as Fastn customer tiers, the partner API is
  documented at /developers.

**6:40 - Close (20s)**
> "40 Fastn features in use, 17 platform issues found and logged along the way. Zero OAuth
> code in RequestHub: Fastn is the whole integration layer."

## If something goes wrong live

| What happens | What to do |
|---|---|
| Google sign-in is slow | Skip to tab 2; "signup is one click with Google" |
| No AI summary on the new card after ~10s | Click its **AI triage** button. Gemini's free tier allows 15 calls a minute per model and three models are chained, so this is rare |
| The duplicate is not flagged | Select both cards and use **Merge as duplicates** from the bulk bar |
| Linear issue doesn't appear in ~10s | Show REQ-32 "Add SSO login" as an earlier example, move on |
| Check now finds no release | The release must be published (not a draft or pre-release) and link the idea URL. Otherwise drag the idea to Shipped - Slack, Linear and Notion follow the same way |
| Slack bot doesn't reply | Show idea #283 on the board - it came from Slack |
| Claude answers slowly or not at all | Skip it: "every board can also be used from Claude through Fastn's MCP gateway" |
| Anything else fails | Settings -> Deliveries from your tools: show the failed delivery and press Retry |

## Questions to expect

- **How is one customer kept from another's data?** Each board is its own Fastn tenant; its
  Slack, Linear, Notion and GitHub connections belong to that tenant, and every server route
  checks the board's own session before touching its data.
- **Which AI, and what if it is wrong?** Gemini, called from a Fastn workflow with the key in
  Fastn Secrets. It only changes a category the submitter left at the default, it only adds
  tags, and duplicates are suggestions - nothing merges without a click. If Gemini is down,
  the idea is filed exactly as before. (Fastn's built-in `fastn.ai` returns 401 on prod, B42.)
- **What if Slack or Linear is down?** Fastn retries (3 attempts), then the event waits in a
  dead-letter queue; the customer retries it from Settings.
- **Can someone fake a Slack or Linear event?** Linear events are signature-checked; a
  replayed one only re-syncs the issue from Linear's real state. Fastn doesn't verify Slack
  signatures (logged as B100), so RequestHub checks with Slack that the message exists and
  is recent before filing it.
- **How does a customer install it?** One script tag for the widget; Google sign-in for
  the team; Connect page for their tools.
- **Can a customer's backend use it?** Yes - a REST API with an OpenAPI spec at /developers,
  with idempotency keys and signed webhooks.
- **What did Fastn not do well?** Point at the blockers: customer triggers running as the
  partner (B102), unsigned Slack events (B100), and CONNECTION_AMBIGUOUS when a customer
  connects GitHub twice, all worked around.
