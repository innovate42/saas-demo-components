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

**Language requirement: EVERYTHING customer-facing is in German.** Alexandre (an evaluator) is personally building Cafeyn's new German pricing model this summer, and Germany is their strongest new market post-Readly. So: all pages, offer display names/prices/features, CTAs, checkout labels, custom-field labels, validation messages, order confirmation, My Account, cancel journey, and confirmation emails — in German (formal *Sie*, currency €, German number/date formats: `12,00 €`, `pro Nutzer/Monat`). German copy is the default text in components' `limioProps` and in offer attributes, not an afterthought. Internal things (component/code names, offer paths, commit messages, this repo) stay in English.

---

## 2. Brand kit (Cafeyn look & feel)

> Researched 2026-07-23. Cafeyn ran a full rebrand in **September 2024** ("Read as you like" / "Lisez comme vous aimez"): warm, neutral, high-contrast, editorial — a "café crème" identity, brown ink on cream, NOT the old coral-red LeKiosk-era accent and not tech-blue SaaS. Direct scraping of cafeyn.co was blocked by this environment's egress policy, so: the three hex codes below are Brandfetch-verified; derived tokens and fonts are faithful approximations, marked as such. **If the executing agent's environment can fetch cafeyn.co, verify the live CSS (custom properties, @font-face, border radii) first and replace the approximations.**

### Verified colors (Brandfetch, cafeyn.co)
| Token | Hex | Use |
|---|---|---|
| Oil (espresso brown, near-black) | `#211712` | Primary text, logo, dark surfaces, **primary CTA background** |
| Bone (warm beige/latte) | `#DED0B9` | Signature secondary/surface tone |
| White | `#FFFFFF` | Base background |

### Derived tokens (approximations consistent with the 2024 identity)
| Token | Hex | Use |
|---|---|---|
| Background cream | `#F7F2E9` | Page background |
| Surface tint | `#EFE6D5` | Card/section alt background (Bone low tint) |
| Accent caramel | `#8A6D4E` | Sparing accent (badges, links, highlights) |
| Muted text | `#5C4F45` | Secondary copy |

CTA style: dark Oil button with cream text, pill-shaped (~24px radius); cards soft-rounded (12–16px). Generous whitespace; let magazine covers provide the color.

### Typography (approximation — exact 2024 typeface is unpublished)
- Headlines: warm soft serif — **Fraunces** (Google Fonts, 500–600).
- Body/UI: clean sans — **Inter** or **Poppins** (Poppins matches the pre-2024 Cafeyn web app).

### Logo
Lowercase **"cafeyn"** wordmark, rendered Oil-brown on cream in the current identity. Sources: https://brandfetch.com/cafeyn.co (SVG/PNG), https://seeklogo.com/vector-logo/605179/cafeyn, FR Wikipedia "Fichier:Cafeyn-logo.svg". ⚠️ Older files are the 2019 coral-red era — check the color before using.

### Imagery & voice
Magazine/newspaper cover thumbnails (subtle shadow, small radius) as the dominant imagery; warm, cozy editorial photography ("intimacy, rest, protection"). Calm, premium-editorial tone. Product facts to use in copy: **~2,500 titles, 500+ publishers** (institutional pages cite 1,600+), offline reading, audio articles, Smart Reader article mode, personalized recommendations, multiprofile. Markets: FR, UK, DE, NL, BE, IT, ES, CH, AT, IE, CA.

---

## 3. Offer catalog to create in Limio (saas-dev)

> ⚠️ Note: at the time of writing, the Limio SaaS Dev MCP (`mcp__Limio_SaaS_Dev__*`) returned **HTTP 401**. The executing agent has an API key — use `limio_create_offers` / `limio_update_offers` / `limio_get_offers` against saas-dev once authenticated. First run `limio_get_offers {"offers_source": "catalog", "reduced_data": true}` to learn the tenant's existing attribute conventions and copy an existing SaaS offer as a template.

### 3.1 Products

One base product, per-seat licensed: **Cafeyn for Business** — access to 1,500+ newspapers & magazines for every employee. Plus add-on products for cross-sell.

### 3.2 Self-serve plans (the pricing page)

Per-seat pricing, quantity 1–10 seats self-serve (fits their €500–2,000/yr target band). Monthly and annual terms to demo term upgrade:

Made-up but anchored on reality: Cafeyn's consumer tiers are Premium €12.99/mo, Duo €15.99, Famille €20.99, and their real B2B pricing is quote-only today — so a per-seat B2B price near the consumer anchor with a volume/annual discount is credible:

| Plan | Positioning | Price (annual term) | Price (monthly term) | Notes |
|---|---|---|---|---|
| **Team** | Full press catalog for your team, up to 10 seats | €120/user/yr (€10/user/mo) | €12/user/mo | 5 seats annual = €600 → the "just let me pay ~€500 and go" story |
| **Business** (Best value) | Everything in Team + audio articles, reading analytics, priority support | €180/user/yr (€15/user/mo) | €18/user/mo | `best_value__limio: true`; 10 seats annual = €1,800 (top of their stated band) |
| **Enterprise** | 50+ seats, SSO, custom catalog (CSEs, libraries, universities), account manager | "Contact sales" | — | CTA routes to sales-assisted flow, no checkout |

Offer attributes that matter:
- `allow_multibuy__limio: true` + per-seat rate plan so the quantity selector multiplies price (see `plan-selection`/`saas-pricing-page` components for how quantity is consumed).
- `display_name__limio`, `display_price__limio`, `detailed_display_price__limio`, `offer_features__limio`, `cta_text__limio`, `best_value__limio` — **all in German**, e.g. display price `10 € pro Nutzer/Monat`, detailed price `Jährliche Abrechnung · ab 2 Lizenzen`, CTAs `Mit Team starten` / `Business wählen` / `Vertrieb kontaktieren`, best-value badge `Beliebteste Wahl`. Plan names "Team" / "Business" / "Enterprise" work as-is in German.
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

Create one promo code offer/discount: **`CAFEYN20`** — 20% off first year, applied at checkout (display: `20 % Rabatt im ersten Jahr`). Demo line: "launch promo for the DACH rollout".

### 3.6 Sales-assisted offers (Salesforce)

Create 1–2 **non-published / direct-link** offers for the sales-assisted path:
- **Business 25 seats — negotiated** (e.g. €10/user/mo annual, custom terms) — the offer a rep attaches to a Salesforce opportunity and sends as a payment link; buyer lands directly on a pre-filled checkout.
- Optionally a **CSE** variant (French works councils — their flagship B2B vertical, typically employer-funded 1-year unlimited access) to nod at their vertical pricing (CSEs, libraries, universities, hospitality).
Demo the Limio Salesforce flow: opportunity → generate offer/payment link → customer pays → order back on the Salesforce account.

**Reuse Sam's tested CPQ setup on saas-dev (do NOT rebuild from scratch).** Sam + Taras configured and demo-tested a full sales-assisted CPQ flow on this exact tenant for the Amazing Life demo (2026-07-17 → 07-21, Slack #sales-demo). What exists and works:
- Salesforce → Limio **checkout link from an opportunity**, landing on a client-branded checkout page — theirs is `/al-checkout` (renamed from the default `/lm-quote-checkout`). Create a `/cafeyn-checkout` equivalent the same way.
- **Fields prefilled from the SF account/contact and locked down** on the checkout.
- **Custom fields on the SF contact/opportunity passed through the checkout link** and surfaced in the Limio cart — their examples: `churchSize`, `existingCustomer`, `productInterest`, `Phone`. Gotcha (cost them an hour): on the Limio checkout field config, the `limioField` path must be `customFields.<name>` (e.g. `customFields.churchSize`), **not** `customerDetails.<name>`. Dropdowns read better than booleans in the cart (they switched `existingCustomer` from true/false to Yes/No).
- Confirmation email verified working.
- Cafeyn equivalents to configure: `companySize` (dropdown, label `Unternehmensgröße`), `sector` (label `Branche`: Medien/Bibliothek/Hochschule/Hotellerie/Sonstiges), `existingCafeynUser` (label `Bereits Cafeyn-Nutzer?`, Ja/Nein dropdown — German labels, per the language requirement).
- Taras is the go-to for the SF-side custom fields/permissions; note there was a one-time SF permissions fix needed before fields appeared on the opportunity.
- Next iteration in progress (for their Aug 31 demo): **updating an existing sub via Limio CPQ** — if ready in time, it doubles as the Cafeyn upsell-via-sales story.

---

## 4. Pages to build in Limio

1. **B2B landing / pricing page** (`cafeyn-business` campaign): Cafeyn header → hero → seat-quantity pricing cards → comparison table → logo/covers band → FAQ → CTA banner → footer.
2. **Checkout**: standard Limio checkout, Cafeyn-styled (colors/fonts via page builder theme), quantity + add-ons + promo code field visible.
3. **Order confirmation**: branded confirmation (e.g. `Willkommen bei Cafeyn for Business — Ihr Team hat jetzt Zugriff auf über 2.500 Titel`).
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
2. `cafeyn-hero` — B2B hero: German headline (e.g. `Die ganze Presse für Ihr Team`), subcopy, CTA, magazine-cover collage imagery.
3. `cafeyn-offers` — pricing cards fork of `practicetek-offers`/`b2b-offer-cards` with **seat quantity stepper on the card**, per-seat price × quantity total, monthly/annual toggle, best-value badge — Cafeyn styling baked in as defaults.
4. `cafeyn-footer` — Cafeyn footer with markets/social links.
5. (Optional) `cafeyn-covers-band` — scrolling strip of publication covers ("Le Monde, ELLE, L'Équipe, The Independent…") for authenticity.

Register stories in `component-playground/src/stories/` and verify in Storybook (`yarn` at repo root, then playground storybook) before pushing.

### Deployment note
CI (`.github/workflows/main.yml`) mirrors only `saas-dev` and `stripe` branches to CodeCommit (which is what syncs components into Limio). **Develop and push on `claude/caffeine-b2b-demo-apm0py`**; merging to `saas-dev` (which triggers the mirror) is a human step — flag it in the PR/summary, don't push to `saas-dev` directly.

---

## 6. Demo emphasis — what to make unmissable

These come from what Juliette & Alexandre explicitly raised on the call (or from their competitive context vs Chargebee). Each has a concrete build task:

1. **Checkout customizability is the real battleground.** Their literal evaluation question was *"how customisable is the checkout?"* (they're weighing Chargebee's checkout for B2B). Make it obvious: B2B fields at checkout — `Firmenname` (company name), `USt-IdNr.` (VAT ID), `Branche` (sector dropdown) — quantity editable in the cart, everything Cafeyn-branded, all German. Enable `request_company_info__limio` on the offers and add the custom checkout fields.
2. **Chargebee coexistence, not replacement.** They evaluate Limio *alongside* Chargebee. Be ready to show the order events/webhooks flowing outward (the same pattern that feeds Salesforce) and narrate: "Limio industrialises your B2B on top of the billing you already run." No build task beyond having an order's event payload ready to show in the Limio admin.
3. **Invoicing pain.** Invoices are hand-made in Salesforce today ("tout est très manuel"). Show payment/invoice history in My Account — wire up `payments-table-tailwind` (German labels: `Rechnungen`, `Zahlungsverlauf`) and mention automated invoice generation post-checkout.
4. **Germany is the wedge.** The whole demo being in German (§1) *is* this point — Alexandre is building the German pricing model right now. In the walkthrough, also mention that cloning the catalog for FR/UK markets is config, not a project.
5. **B2C→B2B conversion story.** Their biggest latent opportunity: thousands of businesses on B2C subs. Create one **B2C "Premium" subscription** (a €12,99 individual plan) plus a **switch offer B2C Premium → Team**, and demo an existing individual user upgrading their company onto a business plan. Turns the demo into a revenue story.
6. **Agentic teaser (optional, 2 min).** The three-pathway pitch included an AI agent that qualifies and routes to checkout — the Limio agent with `build_checkout_link` already runs on sprint-chat. If time allows, show it (German prompt/replies if feasible). Chargebee can't match this.
7. **Click count.** Juliette benchmarked The Economist for ease of purchase. Count the self-serve clicks and keep landing → paid at ~3 steps; rehearse it that way.

**Deliberately out of scope** (not raised on the call): trials; deep admin/team-seat management (seat expansion is their phase 2 — show the seat change in My Account exists, move on).

## 7. Build order for the executing agent

1. **Recon**: `limio_get_offers` (catalog) + `limio_get_pages` on saas-dev; copy attribute/tag conventions from the existing SaaS demo offers. Confirm how quantity/per-seat rate plans and switch offers are modelled on this tenant.
2. **Catalog**: create products → self-serve offers (3 plans × monthly/annual) → add-ons → switch offers → promo code → sales-assisted offers (§3) → B2C Premium plan + B2C→Team switch offer (§6.5). All display attributes in German.
3. **Components**: build `cafeyn-*` components (§5) with German default copy, verify in Storybook, commit + push branch.
4. **Pages/campaign**: build the 4 pages (§4) in German, attach `cafeyn-b2b` label offers, apply brand theme (colors/fonts from §2) in the page builder; set checkout localisation to `de` and configure the B2B checkout fields (§6.1).
5. **Salesforce**: wire or narrate the sales-assisted payment-link flow (§3.6).
6. **End-to-end test**: purchase Team ×5 annual with `CAFEYN20` → confirm order → My Account → add 3 seats → upgrade to Business → add Audio add-on → view invoices/payments → start cancel, accept save offer. Also test the B2C→Team switch. Check every screen along the way is German.
7. Write a short **demo script** (README section or `CAFEYN-DEMO-SCRIPT.md`) mapping each click to the meeting pain points (self-serve €500 purchase, 3-click sales link, checkout customizability, invoicing, B2C conversion, phase-2 expansion story).

## 8. Acceptance checklist

- [ ] **Every customer-facing screen, label, price, email is in German** (formal Sie, `12,00 €` formats) — pricing page, checkout, confirmation, My Account, cancel journey.
- [ ] Pricing page looks unmistakably Cafeyn (colors, font, logo, imagery) on desktop + mobile.
- [ ] Quantity selector: price updates as seats change; 1–10 seats self-serve; total lands in €500–2,000/yr band for typical picks.
- [ ] Monthly ↔ annual toggle works; annual shows savings.
- [ ] Checkout shows B2B fields (Firmenname, USt-IdNr., Branche) and editable quantity — the checkout-customizability proof (§6.1).
- [ ] `CAFEYN20` promo applies at checkout.
- [ ] Post-purchase: seat count change, Team↔Business upgrade/downgrade, add-on cross-sell all work from My Account.
- [ ] Invoice/payment history visible in My Account (§6.3).
- [ ] B2C Premium → Team switch offer works (B2C→B2B conversion story, §6.5).
- [ ] Sales-assisted offer reachable via direct link with pre-set negotiated pricing and German locked-down fields (Salesforce story demoable).
- [ ] Self-serve flow is ~3 clicks from landing to paid (Economist benchmark, §6.7).
- [ ] Storybook builds clean; components pushed on `claude/caffeine-b2b-demo-apm0py`.
