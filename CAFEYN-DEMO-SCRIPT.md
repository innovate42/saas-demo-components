# Cafeyn B2B Demo Script

**Call: 60 min. Demo: ~45 min — customer-facing and sales-facing journey first (§1–6), all configuration explained in one block at the end (§7). Don't flip between shop and admin mid-journey.**

Audience: Juliette & Alexandre + Cafeyn product/tech team. Call in **English**; every screen in **German** (their new market — Alexandre is building German pricing right now. Say that out loud early: *"we built this for your German launch"*). They explicitly asked to *understand the platform*, not just see it — that's §7, and it deserves real time: keep 10+ minutes for it.

> `[FILL]` = executing agent inserts the live URL after publishing. Shop URLs are the saas-dev shop domain + the `ca-*` route; admin URLs are `saas-dev.prod.limio.com`.
>
> Pre-demo checks: one clean test order the morning of the demo; process events clean ([events console](https://saas-dev.prod.limio.com/objects/events/limio)); Salesforce org open in a tab with the prepared opportunity; **verify the checkout upsell shows "Upgrade auf Business" with its description** (offer attributes fixed 23 Jul — republish offers if it still renders blank); confirm a completed test order shows **Closed Won** in Salesforce.

---

## Part A — The Journey (customer-facing & sales-facing, ~33 min)

## 1. Branded Self-Serve Pricing Page — *5 min*

**Pain point:** Their B2B "journey" today is a quote-request form — fully manual. The 1–10 seat buyer (€500–2,000/yr) doesn't want a callback; friction is killing conversion.

* Go to the pricing page — `[FILL: shop domain]/ca-pricing`
  * Fully Cafeyn-branded (their 2024 identity: cream, espresso brown, magazine covers), fully German, mobile-responsive — resize the window or open on your phone.
  * **Team / Business / Enterprise**, per-seat with a **seat selector on the card**: drag 5 seats on Team → €600/Jahr. Say it: *"your buyer who 'just wants to pay €500' — this is them, self-serve, no callback."*
  * Flip **Monatlich ↔ Jährlich** — annual savings shown.
* Enterprise CTA (`Vertrieb kontaktieren`) — point at it, don't click: *"that's the sales-assisted path, coming in a minute."*
* Select **Team, 5 seats, annual** → checkout.

## 2. Checkout — *8 min*

**Pain point:** They asked, verbatim, *"how customisable is the checkout?"* (evaluating Chargebee checkout for B2B). And businesses today buy consumer subs with zero company data captured.

* Walk the checkout — count the clicks out loud (they benchmarked The Economist; landing → paid ~3 steps).
  * **B2B fields, German**: Firmenname, USt-IdNr., Branche.
  * **Quantity editable in the cart** — 5 → 6 seats, total updates.
  * **Cross-sell**: add the Audio & Podcasts add-on in one click.
  * **Upsell nudge**: "Upgrade auf Business — Audio-Artikel, Podcasts & Lese-Analysen · 15 € statt 10 €" — swap the basket to Business, then back.
  * Promo **`CAFEYN20`** (`20 % Rabatt im ersten Jahr`) — *"launch promo for your DACH rollout."*
* Complete purchase — test card `4242 4242 4242 4242`.
* Order confirmation: `Willkommen bei Cafeyn for Business` — plan, seats, add-on, invite-your-team next steps.
* **Salesforce moment**: switch to the SF tab — Account + Contact created and **the opportunity is Closed Won with the order amount** — `[FILL: SF org link]`. *"Today there's no bridge between your billing and Salesforce. This is the bridge — on every order, automatically, including the won-revenue reporting your reps live in."* (One tab switch, then straight back to the journey — save the how for §7.)

## 3. Sales-Assisted — Salesforce Payment Link — *8 min*

**Pain point:** Rep quotes in Salesforce, then manually re-creates the offer in Chargebee; invoices hand-made — "tout est très manuel." The "100 clicks → 3 clicks" story that landed in the intro call.

* In Salesforce: open the prepared opportunity (*Musterfirma GmbH — 25 Lizenzen*).
  * Generate the **Limio checkout link** from the opportunity — 3 clicks.
  * Custom opportunity fields ride along: Unternehmensgröße, Branche, Bereits Cafeyn-Nutzer.
* Open the link as the customer — `[FILL: shop domain]/ca-quote-checkout?...`
  * **Pre-filled, locked-down, Cafeyn-branded German checkout** at the negotiated price (€10/user/mo × 25, annual). Customer pays → done.
* Back in Salesforce: **the opportunity flips to Closed Won** with the paid amount, order attached to the account. *"No procurement email chain, no manual re-entry, and the rep's pipeline is accurate the second the customer pays."*
* Mention verticals in passing: *"same mechanism for your CSE, library, university pricing — you'll see how it's set up at the end."*

## 4. Self-Service Portal — *8 min*

**Pain point:** No B2B self-service at all; invoices manual; upsell/expansion is their phase 2 — show the vision now.

* From order confirmation click into **Mein Konto**.
  * **Rechnungen / Zahlungsverlauf** — invoices & payments the customer sees themselves (*"nobody emails your team for an invoice again"*).
  * **Add seats**: 5 → 8 — prorated price preview before confirming.
  * **Upgrade Team → Business** — proration shown; downgrade works the same.
  * **Post-purchase cross-sell**: add International Press Pack from the portal.
* **Cancel journey**: start cancellation → German cancel-reason survey → **retention offer** (`Bleiben Sie bei Cafeyn: 20 % Rabatt für 12 Monate`) → accept the save.
* *"This expansion + retention layer is your phase 2 — it already works. How it's configured: end of the demo."*

## 5. B2C → B2B Conversion — *3 min*

**Pain point:** Thousands of companies sit on B2C subscriptions today — their biggest untapped B2B pipeline, and currently invisible.

* Log in as an existing **B2C Premium** subscriber (€12,99).
* Show the **switch offer: Premium → Team** — the individual converts their company onto a business plan in a few clicks, same account.
* *"You don't have to find your B2B customers — they're already in your base. This is the migration path."*

## 6. Agentic Teaser — *2 min, optional but differentiating*

They bought into the three-pathway model: self-serve / sales-assisted / **agentic**.

* Open the Limio agent (sprint-chat environment) — ask, as a prospect, about plans for a 7-person team; it qualifies and returns a checkout link into the §2 flow.
* One line: *"pathway three — the agent sells while your reps sleep. Chargebee doesn't do this."*

---

## Part B — How It All Works (§7, one block, ~10–12 min)

**They asked to understand the platform.** Now open the admin once and stay there. Walk it in the same order as the journey they just watched, so every config screen maps to something they saw:

1. **Pricing & offers (→ §1).** Open the catalog, then the Team offer: price, German display copy, features, seat limits (1–10), countries, monthly/annual grouping — all attributes the commercial team edits and publishes, no engineering. *"Alexandre's German pricing model is a set of records here, not a dev project. FR/UK = duplicate + translate."* Show the **CSE offer** (`Cafeyn CSE Jahreslizenz`, €2.500 unlimited) as the vertical-pricing proof — today each vertical is a manual spreadsheet; here it's another offer. Mention eligibility rules decide who sees what.
2. **Design & theming (→ everything they saw).** Open the page builder: the Cafeyn theme (colors/fonts), a page assembled from components, and how the pricing page copy is edited in place. *"Marketing owns look-and-feel and content. A checkout A/B test is a second page variant, not a release."*
3. **Checkout configuration (→ §2).** The B2B field config (Firmenname/USt-IdNr./Branche, German labels, validation), the upsell + cross-sell as offer attributes, the promo code object (`CAFEYN20`). *"This is the answer to 'how customisable is the checkout' — you configure it, you don't file tickets for it."*
4. **Sales-assisted setup (→ §3).** The negotiated offer (`Cafeyn Business 25 Seats Negotiated`) — a normal offer on the Salesforce channel, not published publicly; the custom-field mapping that carried Unternehmensgröße/Branche through the link. *"Ops defines what reps may sell — floors, terms, verticals — reps pick and send. Set up in an afternoon; this exact pattern is live on this environment for another customer."*
5. **Self-service & journeys (→ §4).** The cancel journey config: reasons list, the save-offer attachment (`Cafeyn Treueangebot 20`), where you'd add pause or downgrade as alternatives. Portal pages are standard components. *"Retention is something your team iterates weekly, not a roadmap item. Proration came from the billing engine — surfaced, not hand-calculated."*
6. **Switch offers (→ §5).** The Premium → Team switch record + eligibility. *"Point it at the company-looking B2C accounts and it's a conversion campaign, not a data-cleanup project."*
7. **Integration points (→ the two Salesforce moments).** Show one order's event payload in [process events](https://saas-dev.prod.limio.com/objects/events/limio): *"every order and change emits events. Salesforce consumes them — that's the Closed Won you saw twice. A billing engine consumes the same stream: Limio industrialises your B2B on top of what you already run — coexistence, not rip-and-replace."* If they lean in on Chargebee, this is where the deeper conversation lives.
8. **Speed to live.** *"Everything you saw — catalog, pages, checkout, portal, Salesforce — was configured in days."* (They said in-house isn't realistic within 2 years.)

## 8. Wrap & Next Steps — *2 min, then Q&A*

* Recap against their three pathways: ✅ self-serve, ✅ sales-assisted, ✅ agentic — plus phase-2 expansion/retention already working.
* Proposed next steps: pilot scope for the German self-serve launch (Alexandre's pricing model), Salesforce workshop with their ops, timeline to first live B2B order.
* Q&A buffer — likely topics: Chargebee coexistence depth (§7.7 + payload), migrating existing B2B-on-B2C accounts (§7.6), security/SSO (Enterprise-tier roadmap conversation).

---

### Timing (60-min call)
| Section | Min |
|---|---|
| 1. Pricing page | 5 |
| 2. Checkout (+ SF Closed Won) | 8 |
| 3. Sales-assisted / Salesforce | 8 |
| 4. Self-service portal | 8 |
| 5. B2C→B2B | 3 |
| 6. Agentic teaser | 2 |
| 7. How it all works (config block) | 11 |
| 8. Wrap & next steps | 2 |
| **Total demo** | **~47** |
| Q&A / buffer | 13 |

### Fallbacks
* Salesforce misbehaves → screenshots of the working flow (take them during the dry-run) and narrate; the morning's clean order is already Closed Won in SF — show that record.
* Live order fails mid-demo → pivot to the morning's order in admin + Salesforce; check [process events](https://saas-dev.prod.limio.com/objects/events/limio) after the call, not during.
* Keep one pre-completed subscription in Mein Konto so §4 works even if §2's order hits an issue.
* Running long → cut §6 first, then §5 (fold its config into §7.6 in one sentence). **Never cut §7 below ~8 min** — understanding the platform was their explicit ask — and never cut the Salesforce moments.
