# Cafeyn B2B Demo Script

**Call: 60 min. Demo: ~45 min with "how it works" woven in, then Q&A + next steps.**

Audience: Juliette & Alexandre + Cafeyn product/tech team. Call in **English**; every screen in **German** (their new market — Alexandre is building German pricing right now. Say that out loud early: *"we built this for your German launch"*). They explicitly asked to *understand the platform*, not just see it — so each section below ends with a **⚙️ Config point**: show where that capability is configured, in one breath, tied to their pain. Don't save the explanation for the end.

> `[FILL]` = executing agent inserts the live URL after publishing. Shop URLs are the saas-dev shop domain + the `ca-*` route; admin URLs are `saas-dev.prod.limio.com`.
>
> Pre-demo checks: one clean test order the morning of the demo; process events clean ([events console](https://saas-dev.prod.limio.com/objects/events/limio)); Salesforce org open in a tab with the prepared opportunity; **verify the checkout upsell shows "Upgrade auf Business" with its description** (offer attributes were fixed 23 Jul — republish offers if it still renders blank); confirm a completed test order shows **Closed Won** in Salesforce.

---

## 1. Branded Self-Serve Pricing Page — *7 min*

**Pain point:** Their B2B "journey" today is a quote-request form — fully manual. The 1–10 seat buyer (€500–2,000/yr) doesn't want a callback; friction is killing conversion.

* Go to the pricing page — `[FILL: shop domain]/ca-pricing`
  * Fully Cafeyn-branded (their 2024 identity: cream, espresso brown, magazine covers), fully German, mobile-responsive — resize the window or open on your phone.
  * **Team / Business / Enterprise**, per-seat with a **seat selector on the card**: drag 5 seats on Team → €600/Jahr. Say it: *"your buyer who 'just wants to pay €500' — this is them, self-serve, no callback."*
  * Flip **Monatlich ↔ Jährlich** — annual savings shown.
* Enterprise CTA (`Vertrieb kontaktieren`) — point at it, don't click: *"we'll come back to the sales side."*

**⚙️ Config point — pricing without engineering (this is Alexandre's summer project):** flip to the Limio catalog, open the Team offer. Price, German display copy, features, seat limits, countries — all attributes your commercial team edits and publishes. *"Your new German pricing model is a set of records here, not a dev project. FR/UK next quarter = duplicate + translate. And every offer can carry different pricing per vertical — CSE, library, university — which today you manage by hand."* Optionally show the CSE offer (`Cafeyn CSE Jahreslizenz`, €2.500 unlimited) as proof.

* Select **Team, 5 seats, annual** → checkout.

## 2. Checkout — the Chargebee Question — *10 min*

**Pain point:** They asked, verbatim, *"how customisable is the checkout?"* (evaluating Chargebee checkout for B2B). And businesses today buy consumer subs with zero company data captured.

* Walk the checkout — count the clicks out loud (they benchmarked The Economist; landing → paid ~3 steps).
  * **B2B fields, German**: Firmenname, USt-IdNr., Branche — *"minutes to add, not a vendor ticket."*
  * **Quantity editable in the cart** — 5 → 6 seats, total updates.
  * **Cross-sell**: add Audio & Podcasts add-on in one click.
  * **Upsell nudge**: "Upgrade auf Business — Audio-Artikel, Podcasts & Lese-Analysen · 15 € statt 10 €" — swap the basket to Business, then back.
  * Promo **`CAFEYN20`** (`20 % Rabatt im ersten Jahr`) — *"launch promo for your DACH rollout."*
* Complete purchase — test card `4242 4242 4242 4242`.
* Order confirmation: `Willkommen bei Cafeyn for Business` — plan, seats, add-on, invite-your-team next steps.
* **Salesforce moment**: switch to the SF tab — the Account + Contact were created and **the opportunity is Closed Won with the order amount** — `[FILL: SF org link]`. *"Today there's no bridge between your billing and Salesforce. This is the bridge — on every order, automatically, including the won-revenue reporting your 8 reps live in."*

**⚙️ Config point — what the checkout actually is:** show the checkout field configuration in the admin (the Firmenname/USt-IdNr./Branche fields, the German labels) and the page-builder theme that skins it. *"Fields, order, validation, language, branding — configuration. The upsell and add-ons you just saw are attributes on the offer, not code."* One sentence on coexistence: *"every completed order emits events — you just saw the Salesforce consumer; a billing engine consumes the same stream. Limio industrialises B2B on top of what you already run — not rip-and-replace."* Show one order's event payload in [process events](https://saas-dev.prod.limio.com/objects/events/limio) — 10 seconds, close it.

## 3. Sales-Assisted — Salesforce Payment Link — *10 min*

**Pain point:** Rep quotes in Salesforce, then manually re-creates the offer in Chargebee; invoices hand-made — "tout est très manuel." The "100 clicks → 3 clicks" story that landed in the intro call.

* In Salesforce: open the prepared opportunity (*Musterfirma GmbH — 25 Lizenzen*).
  * Generate the **Limio checkout link** from the opportunity — 3 clicks.
  * Custom opportunity fields ride along: Unternehmensgröße, Branche, Bereits Cafeyn-Nutzer.
* Open the link as the customer — `[FILL: shop domain]/ca-quote-checkout?...`
  * **Pre-filled, locked-down, Cafeyn-branded German checkout** at the negotiated price (€10/user/mo × 25, annual). Customer pays → done.
* Back in Salesforce: **the opportunity flips to Closed Won** with the paid amount, order attached to the account. *"No procurement email chain, no manual re-entry, and the rep's pipeline is accurate the second the customer pays."*

**⚙️ Config point — how a rep offer is set up:** show the negotiated offer in the catalog (`Cafeyn Business 25 Seats Negotiated`) — it's a normal offer with a Salesforce sales channel, not published on the public page. *"Your ops team defines what reps may sell — floors, terms, verticals — reps just pick and send. The custom fields are a mapping config on both sides; we set these up in an afternoon."* (If asked who: this pattern is live on this very environment for another customer demo.)

## 4. Self-Service Portal — *10 min*

**Pain point:** No B2B self-service at all; invoices manual; upsell/expansion is their phase 2 — show the vision now.

* From order confirmation click into **Mein Konto**.
  * **Rechnungen / Zahlungsverlauf** — invoices & payments the customer sees themselves (*"nobody emails your team for an invoice again"*).
  * **Add seats**: 5 → 8 — prorated price preview before confirming.
  * **Upgrade Team → Business** — proration shown; downgrade works the same.
  * **Post-purchase cross-sell**: add International Press Pack from the portal.
* **Cancel journey**: start cancellation → German cancel-reason survey → **retention offer** (`Bleiben Sie bei Cafeyn: 20 % Rabatt für 12 Monate`) → accept the save.
* *"This expansion + retention layer is your phase 2 — it already works, and it's configuration."*

**⚙️ Config point — journeys, not code:** show the cancel journey configuration (reasons list, the save-offer attachment) and note the portal pages are assembled from standard components in the page builder. *"Cancel reasons, save offers per segment, pause vs discount vs downgrade — your team A/B tests retention without a release. Proration comes from the billing engine — you saw it surfaced, not recalculated by hand."*

## 5. B2C → B2B Conversion — *4 min*

**Pain point:** Thousands of companies sit on B2C subscriptions today — their biggest untapped B2B pipeline, and currently invisible.

* Log in as an existing **B2C Premium** subscriber (€12,99).
* Show the **switch offer: Premium → Team** — the individual converts their company onto a business plan in a few clicks, same account.
* *"You don't have to find your B2B customers — they're already in your base. This is the migration path."*

**⚙️ Config point:** the switch is one `switch offer` record targeting Premium holders — eligibility rules decide who sees it. *"Point it at the thousands of company-looking B2C accounts and you have a conversion campaign, not a data-cleanup project."*

## 6. Agentic Teaser — *2 min, optional but differentiating*

They bought into the three-pathway model: self-serve / sales-assisted / **agentic**.

* Open the Limio agent (sprint-chat environment) — ask, as a prospect, about plans for a 7-person team; it qualifies and returns a checkout link into the §2 flow.
* One line: *"pathway three — the agent sells while your reps sleep. Chargebee doesn't do this."*

## 7. Wrap & Next Steps — *2 min, then Q&A*

* Recap against their three pathways: ✅ self-serve (§1–2), ✅ sales-assisted (§3), ✅ agentic (§6) — plus phase-2 expansion/retention already working (§4–5).
* Speed-to-live: *"everything you saw — catalog, pages, checkout, portal, Salesforce — was configured in days."* (They said in-house isn't realistic within 2 years.)
* Proposed next steps: pilot scope for the German self-serve launch (Alexandre's pricing model), Salesforce workshop with their ops, timeline to first live B2B order.
* Leave ~10–13 min for Q&A — likely topics: Chargebee coexistence depth (reuse §2's answer + event payload), data migration of existing B2B-on-B2C accounts (§5 answer), security/SSO (Enterprise tier roadmap conversation).

---

### Timing (60-min call)
| Section | Min |
|---|---|
| 1. Pricing page + pricing config | 7 |
| 2. Checkout + checkout/theming config, SF Closed Won | 10 |
| 3. Sales-assisted + rep-offer config | 10 |
| 4. Self-service portal + journeys config | 10 |
| 5. B2C→B2B + switch-offer config | 4 |
| 6. Agentic teaser | 2 |
| 7. Wrap & next steps | 2 |
| **Demo total** | **45** |
| Q&A / buffer | 15 |

### Fallbacks
* Salesforce misbehaves → screenshots of the working flow (take them during the dry-run) and narrate; the morning's clean order is already Closed Won in SF — show that record.
* Live order fails mid-demo → pivot to the morning's order in admin + Salesforce; check [process events](https://saas-dev.prod.limio.com/objects/events/limio) after the call, not during.
* Keep one pre-completed subscription in Mein Konto so §4 works even if §2's order hits an issue.
* Running long → cut §6 first, then compress §5 to one sentence over the switch-offer screen. Never cut the §2 Salesforce moment or §3 — those are their stated priorities.
