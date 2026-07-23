# Cafeyn B2B Demo Script

Audience: Juliette & Alexandre + Cafeyn product/tech team. Call in **English**; every screen in **German** (their new market — Alexandre is building German pricing right now. Say that out loud early: *"we built this for your German launch"*).

> `[FILL]` = executing agent inserts the live URL after publishing. Shop URLs are the saas-dev shop domain + the `ca-*` route; admin URLs are `saas-dev.prod.limio.com`.
>
> Pre-demo checks: run one clean test order the morning of the demo; process events clean ([events console](https://saas-dev.prod.limio.com/objects/events/limio)); have the Salesforce org with the Cafeyn opportunity open in a tab; have Chargebee coexistence answer ready (§7).

---

## 1. Branded Self-Serve Pricing Page

**Pain point:** Their B2B "journey" today is a quote-request form — fully manual. The 1–10 seat buyer (€500–2,000/yr) doesn't want a callback; friction is killing conversion.

* Go to the pricing page — `[FILL: shop domain]/ca-pricing`
  * Fully Cafeyn-branded (their September 2024 identity: cream, espresso brown, magazine covers), fully German, mobile-responsive — resize the window or open on your phone.
  * **Three plans: Team, Business, Enterprise** — per-seat pricing with a **seat selector on the card**: drag 5 seats on Team → total shows €600/Jahr. Say it: *"your buyer who 'just wants to pay €500' — this is them, self-serve, no callback."*
  * Flip the **Monatlich ↔ Jährlich** toggle — annual savings shown.
  * Highlight: marketing/commercial teams update offers, prices, and copy here without engineering — and cloning this for FR or UK is configuration, not a project.
* Enterprise card CTA (`Vertrieb kontaktieren`) — point at it, don't click yet: *"we'll come back to the sales-assisted side."*
* Select **Team, 5 seats, annual** → into checkout.

## 2. Checkout — the Chargebee Question

**Pain point:** They asked, verbatim, *"how customisable is the checkout?"* (evaluating Chargebee checkout for B2B). Also: B2B buyers need company details captured; today businesses buy consumer subs with no company data at all.

* Walk the checkout — count the clicks out loud (they benchmarked The Economist for ease of purchase; landing → paid is ~3 steps).
  * **B2B fields, in German**: Firmenname, USt-IdNr., Branche (dropdown) — *"these took minutes to add, not a ticket to a billing vendor."*
  * **Quantity editable in the cart** — bump 5 → 6 seats, total updates.
  * **In-checkout cross-sell**: add the Audio & Podcasts add-on with one click.
  * **In-checkout upsell nudge**: show the "Upgrade auf Business" prompt — swap the basket to Business, then back.
  * Apply promo code **`CAFEYN20`** (`20 % Rabatt im ersten Jahr`) — *"launch promo for your DACH rollout."*
* Complete the purchase — test card `4242 4242 4242 4242`.
* Order confirmation: `Willkommen bei Cafeyn for Business` — seats, plan, add-on, invite-your-team next steps.
* **Salesforce**: open the SF org — show the Account/Contact/order created automatically — `[FILL: SF org link]`. *"No bridge between your billing and Salesforce today — this is that bridge, on every order."*

## 3. Sales-Assisted — Salesforce Payment Link (their key requirement)

**Pain point:** Rep creates a quote in Salesforce, then manually re-creates the offer in Chargebee, invoices hand-made in Salesforce — "tout est très manuel." This is the "100 clicks → 3 clicks" story that landed in the intro call.

* In Salesforce: open the prepared opportunity (e.g. *Musterfirma GmbH — 25 Lizenzen*).
  * Generate the **Limio checkout link** from the opportunity — 3 clicks.
  * Custom opportunity fields ride along: Unternehmensgröße, Branche, Bereits Cafeyn-Nutzer.
* Open the link as the customer — `[FILL: shop domain]/ca-quote-checkout?...`
  * Landing on a **pre-filled, locked-down, Cafeyn-branded German checkout** at the negotiated price (€10/user/mo × 25, annual).
  * Customer pays → done. No procurement email chain, no manual Chargebee entry.
* Back in Salesforce: order lands on the account automatically.
* Mention verticals: *"same mechanism for your CSE, library, university pricing — each is just another offer, not another spreadsheet."*

## 4. Self-Service Portal

**Pain point:** No B2B self-service at all; businesses on B2C subs are invisible; invoices manual; upsell/expansion is their phase 2 — show the vision now.

* From order confirmation click into **Mein Konto** (subscriptions).
  * **Rechnungen / Zahlungsverlauf** — invoice & payment history the customer can see themselves (*"nobody emails your team for an invoice again"*).
  * **Add seats**: 5 → 8 on the base plan — show the prorated price preview before confirming.
  * **Upgrade Team → Business** — proration shown; mention downgrade works the same way.
  * **Add-on cross-sell** post-purchase: add International Press Pack from the portal.
* **Cancel journey**:
  * Start cancellation → German cancel-reason survey (customizable).
  * **Retention offer**: save offer before cancelling (discount / downgrade option) — accept the save.
  * Emphasize: *"this expansion + retention layer is your phase 2 — it's already here, it's configuration."*
* Show the result in the Limio admin (orders + [process events](https://saas-dev.prod.limio.com/objects/events/limio)) — every change is an event you can pipe to Salesforce — and to your billing.

## 5. B2C → B2B Conversion (the latent revenue story)

**Pain point:** Thousands of companies are sitting on B2C subscriptions today — their biggest untapped B2B pipeline.

* Log in as an existing **B2C Premium** subscriber (€12,99).
* Show the **switch offer: Premium → Team** — the individual converts their company onto a business plan in a few clicks, keeping the same account.
* Say it plainly: *"you don't have to find your B2B customers — they're already in your base. This is the migration path."*

## 6. Agentic Teaser (2 minutes, optional but differentiating)

They bought into the three-pathway model: self-serve / sales-assisted / **agentic**.

* Open the Limio agent (sprint-chat environment) — ask it, as a prospect, about plans for a 7-person team; it qualifies and returns a checkout link straight into the flow from §2.
* One line: *"pathway three — the agent sells while your reps sleep. Chargebee doesn't do this."*

## 7. How It Works (they asked to understand the platform, not just see it)

* **Offer configuration without engineering**: open the catalog — show a Team offer's attributes (German display price, features, seat rate plan), the promo code object, and the switch offers. Create/edit live if time allows — or show the **Limio MCP**: *"show me all Cafeyn offers created this week"* / change a price by prompt.
* **Chargebee coexistence** (have this crisp — they evaluate Limio *alongside* Chargebee): Limio sits on top as the commerce/subscriber-experience layer; every order/change emits events (show one payload) that flow to Salesforce today and to a billing engine the same way. *"We industrialise your B2B on top of the billing you already run — not a rip-and-replace."*
* **Multi-market**: the German shop you just saw → cloning catalog + pages for FR/UK is config; pricing per market, per vertical, per eligible base.
* **Theming/branding**: show the page-builder theme (colors/fonts) and how the Cafeyn look was applied — marketing-editable.
* **Journeys**: how the cancel flow and save offers are wired (the §4 experience is configuration, not code).
* **Speed to live**: this entire demo — catalog, pages, checkout, portal, Salesforce link — was configured in days, not a 2-year build (they said in-house isn't realistic within 2 years).

## 8. Wrap & Next Steps

* Recap against their three pathways: ✅ self-serve (§1–2), ✅ sales-assisted (§3), ✅ agentic (§6) — plus the phase-2 expansion/retention layer already working (§4–5).
* Proposed next steps: pilot scope for the German self-serve launch (Alexandre's pricing model), Salesforce CPQ workshop with their ops (bring Taras), timeline to first live B2B order.

---

### Timing (45 min call)
| Section | Min |
|---|---|
| 1. Pricing page | 5 |
| 2. Checkout | 8 |
| 3. Sales-assisted / Salesforce | 8 |
| 4. Self-service portal | 8 |
| 5. B2C→B2B | 3 |
| 6. Agentic teaser | 2 |
| 7. How it works | 8 |
| 8. Wrap | 3 |

### Fallbacks
* If the Salesforce org misbehaves → screenshots of the Amazing Life CPQ flow (Sam has them) and narrate.
* If a live order fails mid-demo → the morning's clean test order is already in the admin + Salesforce; pivot to showing that record and the process events view.
* Keep one pre-completed subscription in Mein Konto so §4 works even if §2's order hits an issue.
