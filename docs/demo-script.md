# RequestHub demo - 7 minutes + 3 minutes of questions

Rubric reminder (Demo Day tab): works live on prod from the fresh account (25), customer
experience (10), demo (10). A recording earns half, so every step below is live.

## Before the demo

**The night before**
1. Sign in at https://requesthub.zohaib-iot.workers.dev/login with Google, using the personal
   account. Tell Claude it's done, so acme-saas and demo are added to your account
   (you need the acme-saas admin side for steps 4 and 5).
2. Post one test mention in #ai-news: `@fastn idea: test before the demo`. Within a few
   seconds the bot should reply in the thread with a link. If it doesn't, tell Claude.
3. Rehearse once end to end with a timer.

**15 minutes before** - open these tabs, in this order, all signed in:
1. https://requesthub.zohaib-iot.workers.dev (home page)
2. https://requesthub.zohaib-iot.workers.dev/example/acme-saas (Acme's own product)
3. https://requesthub.zohaib-iot.workers.dev/b/acme-saas (Acme's public board)
4. https://requesthub.zohaib-iot.workers.dev/b/acme-saas/admin (triage)
5. https://requesthub.zohaib-iot.workers.dev/b/acme-saas/connect
6. https://requesthub.zohaib-iot.workers.dev/b/acme-saas/settings (scroll to "Deliveries from your tools")
7. Linear, the REQ team board
8. Slack, #ai-news
9. Notion, the changelog database

Close everything else, turn on Do Not Disturb, zoom the browser to 110%.

## The script

**0:00 - The problem (30s)**
> "Every SaaS team wants a feedback board inside its product. And every one of their
> customers wants that feedback to land in *their own* Slack, Linear and Notion. Building
> that means OAuth, tokens and three APIs, multiplied by every customer. RequestHub is a
> Canny-style feedback board where all of that is Fastn."

Show tab 1 for a moment.

**0:30 - A new customer signs up (60s)** - tab 1, "Start your board"
- Click "Sign up with Google", pick the account, name the board (e.g. "Demo Co").
- Land on the done page: "This is everything a customer has to do: one line of script."
- Point at the snippet. Don't paste it anywhere - the next tab already did.

**1:30 - Feedback from inside the customer's product (75s)** - tab 2
> "This is Acme's own analytics product. That button in the corner is the line you just saw."
- Click the button, type "Export dashboards to CSV", send. "Thanks! We got it."
- Tab 3: the idea is on Acme's board. Upvote it.
- Tab 8 (Slack): the "new idea" post landed in Acme's own channel.
> "Every customer gets their own branded board. Votes, comments, a public roadmap and changelog."

**2:45 - Each customer connects their own tools (45s)** - tab 5
> "This is the Fastn hub, embedded with Fastn's SDK. Acme connected *their* Slack, Linear
> and Notion here. Another customer connects theirs - nothing is shared."
- Toggle dark mode: the hub follows RequestHub's theme live.

**3:30 - Triage flows into their tools, both ways (90s)** - tab 4
- Move "Row-level permissions" from Under Review to **Planned**.
- Tab 7: a new Linear issue appears in Acme's REQ team, linked back to the idea.
- In Linear, move that issue to **In Progress**. Back on tab 4 (refresh): the idea moved by itself.
> "Linear's webhook goes through a Fastn trigger, so every delivery is logged, retried and replayable."
- On tab 4, move it to **Shipped**: the Linear issue moves to Done, tab 9 (Notion) gets a
  changelog row, tab 8 (Slack) gets the ":rocket: Shipped" announcement, and the public
  changelog updates.

**5:00 - Ideas straight from Slack (45s)** - tab 8
- Post: `@fastn idea: let customers export the roadmap as PDF`
- The bot replies in the thread with a link. Open it: the idea is on Acme's board with your vote.
> "Every customer gets this automatically when they connect Slack."

**5:45 - Built to be relied on (45s)** - tab 6
- "Deliveries from your tools": every Linear update and Slack mention, with what happened.
> "If anything fails, the customer can retry it here - that's Fastn's replay."
- Say, don't show: submits are idempotent (a double click never files twice), plans are
  enforced as Fastn customer tiers, the partner API is documented at /developers.

**6:30 - Close (30s)**
> "40 Fastn features in use, 13 platform issues found and logged along the way. Zero OAuth
> code in RequestHub: Fastn is the whole integration layer."

## If something goes wrong live

| What happens | What to do |
|---|---|
| Google sign-in is slow | Skip to tab 2; "signup is one click with Google" |
| Linear issue doesn't appear in ~10s | Show REQ-32 "Add SSO login" as an earlier example, move on |
| Slack bot doesn't reply | Show idea #283 on the board - it came from Slack this morning |
| Anything fails | Tab 6 - show the failed delivery and press Retry. A failure becomes the reliability demo |

## Questions to expect

- **How is one customer kept from another's data?** Each board is its own Fastn tenant; its
  Slack, Linear and Notion connections belong to that tenant, and every server route checks
  the board's own session before touching its data.
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
  partner (B102) and unsigned Slack events (B100), both worked around.
