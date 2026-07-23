# Cafeyn B2B Demo — Build Plan

Plan for an agent (with Limio API key access + this repo) to build a Cafeyn-branded B2B demo on the `saas-dev` Limio environment. Develop on branch `claude/caffeine-b2b-demo-apm0py`.

---

## 1. Context — why this demo

From the intro call with Cafeyn (2026-07-20):

- Cafeyn is the "Spotify of the press": digital press streaming, **1,500+ titles**, B2C-first, recently merged with Readly (pan-European: FR, UK, DE, NL...).
- **B2B today is fully manual**: the B2B "journey" is a quote-request form; invoices live in Salesforce with no bridge to Chargebee; many businesses just buy B2C subscriptions.
- **Target self-serve segment: companies of 1–10 users, €500–2,000/year.** These buyers know the product and "just want to pay €500 and buy" — friction kills conversion.
- **Salesforce is central** (~8–9 B2B reps on it since early 2026) — a sales-assisted flow that generates a payment link from Salesforce is a key requirement ("100 clicks → 3 clicks").
- Upsell/expansion (seats, volume tiers, contract length) is their phase 2 — but we show it in the demo to sell the vision.
- Evaluators: Juliette & Alexandre. Competitor context: Chargebee checkout customization. Demo in English.

**Demo must show:** self-serve B2B catalog + pricing page → multi-quantity (per-seat) checkout → self-service account with seat upsell, tier upgrade/downgrade, cross-sell add-ons → promo codes → sales-assisted offer via Salesforce payment link. All wrapped in Cafeyn's look and feel.

---

## 2. Brand kit (Cafeyn look & feel)

> Verified from cafeyn.co on 2026-07-23. Use these as CSS variables in every custom component.

_TO BE FILLED FROM BRANDING RESEARCH_

---

## 3. Offer catalog to create in Limio (saas-dev)

> ⚠️ Note: at the time of writing, the Limio SaaS Dev MCP (`mcp__Limio_SaaS_Dev__*`) returned **HTTP 401**. The executing agent has an API key — use `limio_create_offers` / `limio_update_offers` / `limio_get_offers` against saas-dev once authenticated. First run `limio_get_offers {"offers_source": "catalog", "reduced_data": true}` to learn the tenant's existing attribute conventions and copy an existing SaaS offer as a template.

### 3.1 Products

One base product, per-seat licensed: **Cafeyn for Business** — access to 1,500+ newspapers & magazines for every employee. Plus add-on products for cross-sell.

### 3.2 Self-serve plans (the pricing page)

Per-seat pricing, quantity 1–10 seats self-serve (fits their €500–2,000/yr target band). Monthly and annual terms to demo term upgrade:

| Plan | Positioning | Price (annual term) | Price (monthly term) | Notes |
|---|---|---|---|---|
| **Team** | Core press catalog, up to 10 seats | €96/user/yr (€8/user/mo) | €10/user/mo | 5 seats annual = €480 → the "just let me pay €500" story |
| **Business** (Best value) | Everything in Team + premium titles, audio, reading analytics, priority support | €144/user/yr (€12/user/mo) | €15/user/mo | `best_value__limio: true` |
| **Enterprise** | 50+ seats, SSO, custom catalog, account manager | "Contact sales" | — | CTA routes to sales-assisted flow, no checkout |

Offer attributes that matter:
- `allow_multibuy__limio: true` + per-seat rate plan so the quantity selector multiplies price (see `plan-selection`/`saas-pricing-page` components for how quantity is consumed).
- `display_name__limio`, `display_price__limio` (e.g. "€8 /user /month"), `detailed_display_price__limio` (e.g. "Billed annually · min 2 seats"), `offer_features__limio`, `cta_text__limio` ("Start with Team" / "Choose Business" / "Talk to sales"), `best_value__limio`.
- `group__limio` to group monthly vs annual variants of the same plan for the term toggle.
- Label e.g. `cafeyn-b2b` on all offers + a campaign/page referencing that label.

### 3.3 Cross-sell add-ons

- **International Press Pack** — +€3/user/mo (Readly/DE + UK titles).
- **Audio & Podcasts** — +€2/user/mo.
Configured as add-on products so they appear in checkout (`edit-add-ons` / `quick-add-on` patterns) and can be added post-purchase from My Account.

### 3.4 Upgrade / downgrade (switch offers)

Create switch offers so an active subscription can:
- **Upgrade** Team → Business (and monthly → annual term).
- **Downgrade** Business → Team.
- **Add seats** (quantity change on the base plan — `edit-base-plan-new` component).
Tag them per Limio switch-offer convention (check an existing switch offer in the catalog for the exact `offer_type__limio`/tag conventions used on this tenant).

### 3.5 Promo code

Create one promo code offer/discount: **`CAFEYN20`** — 20% off first year, applied at checkout. Demo line: "launch promo for the DACH rollout".

### 3.6 Sales-assisted offers (Salesforce)

Create 1–2 **non-published / direct-link** offers for the sales-assisted path:
- **Business 25 seats — negotiated** (e.g. €10/user/mo annual, custom terms) — the offer a rep attaches to a Salesforce opportunity and sends as a payment link; buyer lands directly on a pre-filled checkout.
- Optionally a **Library/CSE** variant to nod at their vertical pricing (libraries, CSEs, hospitality).
Demo the Limio Salesforce flow: opportunity → generate offer/payment link → customer pays → order back on the Salesforce account. If the saas-dev tenant already has the Salesforce package connected, reuse it; otherwise show the link-generation from Limio and narrate the Salesforce sync.

---

## 4. Pages to build in Limio

1. **B2B landing / pricing page** (`cafeyn-business` campaign): Cafeyn header → hero → seat-quantity pricing cards → comparison table → logo/covers band → FAQ → CTA banner → footer.
2. **Checkout**: standard Limio checkout, Cafeyn-styled (colors/fonts via page builder theme), quantity + add-ons + promo code field visible.
3. **Order confirmation**: branded confirmation ("Your team now has access to 1,500+ titles").
4. **My Account (self-service)**: order table + "manage plan" — change seats (`edit-base-plan-new`), upgrade/downgrade (`switch-subscription-tailwind`), add-ons (`edit-add-ons`), cancel journey with save offer (`cancel-survey-tailwind` + `cancel-save-offer-tailwind`).

---

## 5. Components — reuse vs build

### Reuse as-is (config/theme only)
- `saas-pricing-page` — already does term picker + **quantity ("Number of Licenses")** + highlight color prop. Strong candidate for the core pricing block.
- `plan-selection` (product/term/billing/quantity/add-ons + preview basket) if a fuller configurator is wanted.
- `comparison-table`, `faq-accordion`, `cta-banner`, `init-checkout-button-saas-demo`.
- Self-service: `order-table-tailwind`, `payments-table-tailwind`, `edit-base-plan-new`, `edit-add-ons`, `switch-subscription-tailwind`, `cancel-survey-tailwind`, `cancel-save-offer-tailwind`, `order-confirmation-tailwind`.

### Build new (follow the `practicetek-*` pattern — that's the house style for client-branded demos)
Scaffold each with `yarn limio:create <dir> <Name>`; CSS files only; expose colors/copy as `limioProps` with Cafeyn defaults; keep `"react": "*"`.

1. `cafeyn-header` — logo, nav (Catalogue, Business, Pricing), "Log in" + CTA button.
2. `cafeyn-hero` — B2B hero: headline ("Give your team the world's press"), subcopy, CTA, magazine-cover collage imagery.
3. `cafeyn-offers` — pricing cards fork of `practicetek-offers`/`b2b-offer-cards` with **seat quantity stepper on the card**, per-seat price × quantity total, monthly/annual toggle, best-value badge — Cafeyn styling baked in as defaults.
4. `cafeyn-footer` — Cafeyn footer with markets/social links.
5. (Optional) `cafeyn-covers-band` — scrolling strip of publication covers ("Le Monde, ELLE, L'Équipe, The Independent…") for authenticity.

Register stories in `component-playground/src/stories/` and verify in Storybook (`yarn` at repo root, then playground storybook) before pushing.

### Deployment note
CI (`.github/workflows/main.yml`) mirrors only `saas-dev` and `stripe` branches to CodeCommit (which is what syncs components into Limio). **Develop and push on `claude/caffeine-b2b-demo-apm0py`**; merging to `saas-dev` (which triggers the mirror) is a human step — flag it in the PR/summary, don't push to `saas-dev` directly.

---

## 6. Build order for the executing agent

1. **Recon**: `limio_get_offers` (catalog) + `limio_get_pages` on saas-dev; copy attribute/tag conventions from the existing SaaS demo offers. Confirm how quantity/per-seat rate plans and switch offers are modelled on this tenant.
2. **Catalog**: create products → self-serve offers (3 plans × monthly/annual) → add-ons → switch offers → promo code → sales-assisted offers (§3).
3. **Components**: build `cafeyn-*` components (§5), verify in Storybook, commit + push branch.
4. **Pages/campaign**: build the 4 pages (§4), attach `cafeyn-b2b` label offers, apply brand theme (colors/fonts from §2) in the page builder.
5. **Salesforce**: wire or narrate the sales-assisted payment-link flow (§3.6).
6. **End-to-end test**: purchase Team ×5 annual with `CAFEYN20` → confirm order → My Account → add 3 seats → upgrade to Business → add Audio add-on → start cancel, accept save offer.
7. Write a short **demo script** (README section or `CAFEYN-DEMO-SCRIPT.md`) mapping each click to the meeting pain points (self-serve €500 purchase, 3-click sales link, phase-2 expansion story).

## 7. Acceptance checklist

- [ ] Pricing page looks unmistakably Cafeyn (colors, font, logo, imagery) on desktop + mobile.
- [ ] Quantity selector: price updates as seats change; 1–10 seats self-serve; total lands in €500–2,000/yr band for typical picks.
- [ ] Monthly ↔ annual toggle works; annual shows savings.
- [ ] `CAFEYN20` promo applies at checkout.
- [ ] Post-purchase: seat count change, Team↔Business upgrade/downgrade, add-on cross-sell all work from My Account.
- [ ] Sales-assisted offer reachable via direct link with pre-set negotiated pricing (Salesforce story demoable).
- [ ] Storybook builds clean; components pushed on `claude/caffeine-b2b-demo-apm0py`.
