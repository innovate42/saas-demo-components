# Cafeyn B2B Demo — Script

Demo for Juliette & Alexandre (call in English, **everything on screen in German** —
Alexandre is building the German pricing model; Germany is the wedge, §6.4).
All URLs on `saas-dev-shop.prod.limio.com`. Test card `4242 4242 4242 4242`,
any future expiry/CVC.

> Setup before the call: one browser tab on `/ca-pricing`, one on the Limio admin
> (Orders + [process events](https://saas-dev.prod.limio.com/objects/events/limio)),
> one on Salesforce with the demo opportunity. Have the generated payment link
> ready (see `checkout_link.py`) as backup.

---

## Act 1 — Self-serve: "just let me pay ~€500 and go" (~4 min)

**Pain**: B2B today is a quote-request form; small companies just want to buy.
**Benchmark**: The Economist — count the clicks out loud. Landing → paid is 3 steps.

1. Open **`/ca-pricing`** — unmistakably Cafeyn (Oil-brown on cream, Newsreader
   serif, covers marquee). All German.
2. Toggle **Monatlich ↔ Jährlich** (−17 % chip), step the **Anzahl Lizenzen** to
   5 — Team card recalculates live: *600 € pro Jahr für 5 Nutzer*. Right in
   their stated €500–2,000 sweet spot. **Click 1: „Mit Team starten“.**
3. **`/ca-checkout`** — the checkout-customizability proof (their literal
   evaluation question, §6.1):
   - B2B fields: **Firmenname, USt-IdNr., Branche** (dropdown) — all custom
     config, not code.
   - Quantity editable in the cart; **Add-ons** (Internationale Presse +3 €,
     Audio & Podcasts +2 €) one click away; upsell nudge to Business.
   - Enter promo **`CAFEYN20`** — *20 % Rabatt im ersten Jahr* („launch promo
     for the DACH rollout").
   - **Click 2: fill details; Click 3: „Kaufen“.**
4. **`/ca-confirm`** — *Willkommen bei Cafeyn for Business* — plan, Lizenzen,
   Add-ons, next charge, invite-your-team next steps.
5. Flip to Limio admin: the order + outbound events (webhooks). Narrate
   **Chargebee coexistence** (§6.2): "these same events feed Salesforce — Limio
   industrialises your B2B *on top of* the billing you already run."

## Act 2 — Self-service account: phase 2, already working (~3 min)

**Pain**: invoices are hand-made in Salesforce; expansion is manual.

1. **`/ca-account`** — subscription overview. **Add 3 seats**
   (`/ca-direct-update` — proration shown before confirming).
2. **Upgrade Team → Business** (`/ca-direct-update-sub`) — the upgrade path you
   wired into the offers; monthly → annual term switch lives here too.
3. Add the **Audio & Podcasts** add-on post-purchase.
4. **`/ca-invoices`** — *Rechnungen / Zahlungsverlauf*, downloadable. "Generated
   automatically at checkout — nobody hand-writes these anymore" (§6.3).
5. Start cancellation from the account: the **save offer** intercepts
   (*20 % Rabatt für 12 Monate*, `/ca-cancel-save`) → accept → retained. Decline
   path shows the German exit survey.

## Act 3 — Sales-assisted: 100 clicks → 3 (~3 min)

**Pain**: Salesforce is central (~9 reps); quotes have no bridge to billing.

1. In Salesforce, open the demo opportunity → **Generate checkout link** with
   the negotiated offer (*Business — 25 Lizenzen, Sonderkonditionen, 10 €/Nutzer/Monat*).
   (Backup: run `checkout_link.py` and paste the link.)
2. Open the link as the buyer: **`/ca-quote-checkout`** — fields pre-filled and
   locked from the SF account (Firmenname, Unternehmensgröße, Branche, Bereits
   Cafeyn-Nutzer?), negotiated price, nothing to negotiate on-page. Pay.
3. Back in Salesforce: order lands on the account. "Rep sends a link instead of
   raising an invoice — that's the 100-clicks-to-3 story."

## Act 4 — B2C → B2B conversion (the revenue story, ~2 min)

**Pain**: thousands of businesses buy B2C subs today.

1. Show the **Cafeyn Premium** (12,99 €) B2C subscription on a demo account.
2. From its account view, the upgrade path offers **Cafeyn for Business Team** —
   switch, seats added, done. "Every B2C business user is a self-serve B2B lead."

## Closers

- **Germany first, then everywhere**: cloning this catalog for FR/UK is
  configuration (currencies, labels, pages), not a project.
- **Agentic teaser** (optional 2 min, §6.6): the Limio agent with
  `build_checkout_link` qualifies and routes to checkout — Chargebee can't.
- Deliberately not shown: trials, deep seat-management (their phase 2 — the
  seat change in My Account proves the rails exist).

---

## Runbook notes

- Offer catalog: `cafeyn-b2b` label (Team/Business × monthly/annual),
  `cafeyn-b2c` (Premium), `cafeyn-sales` (25-seat negotiated + CSE),
  `cafeyn-save` (retention discount), add-ons `cafeyn-addons-monthly/annual`,
  promo `CAFEYN20`.
- Pages: flat `ca-*` tags; all anonymous auth (required for the Salesforce
  OBO link flow).
- After each order/upgrade/cancel in rehearsal, check
  [process events](https://saas-dev.prod.limio.com/objects/events/limio) —
  a UI-green order can still fail downstream.
- Components ship from this repo via the `saas-dev` branch (PR merge = deploy).
