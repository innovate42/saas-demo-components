# Limio Demo Builder — Generic Playbook

Turn a prospect **domain** + a **Granola discovery call** into a full, credible,
working Limio demo on `saas-dev`: catalog (products, offers, labels, add-ons,
cross-sell + upsell/downgrade/upgrade paths, promo), branded pages, and then
**autonomously placed test orders** (a new order **and** a plan change/upgrade)
verified clean in Limio.

> **Invocation.** "I've got a demo with **<Prospect>**, here's their site
> **<domain>** and the discovery call — build it." That's enough to start; I'll
> ask the few questions below, then build and self-verify.
>
> **Worked example:** [`CAFEYN-DEMO-SCRIPT.md`](CAFEYN-DEMO-SCRIPT.md) (Cafeyn
> B2B, DACH, German). This playbook is the generalisation of how it was built.

**Use the Limio CLI for everything.** It is the sanctioned path (change-vector
updates, publish, doctor, object lookups) and encodes the guardrails. Run
`limio docs` first — it's the AI-agent guide. First-time setup:
`limio env list` → `limio login <env>` (browser SSO, or `--client-credentials`
for headless) → `limio whoami` to confirm scope. `saas-dev` is a **production**
tenant: every write (`catalog put/create/rm`, `jobs`, `build`, `publish`,
non-GET `api`) needs `--allow-prod`, and an agent should only pass it with the
operator's explicit approval for that specific change. Never handle or paste raw
tokens/client-secrets — the CLI manages auth itself.

---

## 0. Inputs I need (I'll ask for whatever's missing)

1. **Prospect domain** — for brand (colours, fonts, logo, tone) and to mirror
   their real `/pricing` structure and product names.
2. **Granola discovery call** — paste it, or point me at it and I'll pull it via
   the Granola tools (`query_granola_meetings` / `list_meetings` /
   `get_meeting_transcript`). This drives the *pains → demo acts* mapping.
3. **Clarifying questions** (I'll ask only what discovery didn't answer):
   - Pricing model: flat / **per-seat** / usage / hybrid; is there a quantity stepper?
   - Tiers and names (e.g. Team / Business / Enterprise) + relative prices.
   - Billing frequency: monthly, annual, both (with the annual-saving %).
   - Currency + geographies (→ `allowed_countries`, tax/state handling).
   - Payment methods to show (card via Zuora HPM, **invoice**, PayPal…).
   - Self-serve vs **sales-assisted** (quote/OBO link) vs **B2C→B2B** conversion.
   - **Is LFS (Limio for Salesforce) in scope?** i.e. does the demo need the
     Salesforce-native story — opportunity → generated checkout/OBO link →
     quote checkout, order syncing back to the SF account? If yes, plan the
     `‹slug›sales` offer, the quote-checkout page, and the SF opportunity setup;
     if no, keep it commerce-only (pricing → checkout → account) and skip those.
   - Add-ons (cross-sell) and their prices.
   - Upgrade/downgrade/term-switch expectations (what plan-change story to tell).
   - Language of the on-screen copy.

Output of this step: a short **blueprint** (tiers × frequency, prices, add-ons,
labels, pages, the acts) I confirm with you before building.

---

## 1. Design language (from the domain)

Fetch the site (WebFetch / browser), extract palette, typography, logo, voice,
and their `/pricing` layout. Write **`<SLUG>-DESIGN-LANGUAGE.md`** (see the
Cafeyn one under `references/`) — colours as CSS variables, font stack, tone,
component notes. Every custom component reads these so the demo looks unmistakably
like the prospect. `<SLUG>` = short ASCII slug of the prospect (e.g. `gl` for GitLab).

---

## 2. Catalog build — order matters (CLI, change-vector `put`)

Build bottom-up so each object's references already exist. **Re-GET live state in
the same step before any mutate** (others may be editing concurrently), and
**never delete+recreate** — use `limio catalog put "<path>" --set '<field>=<val>'`
(in-place change vector). Keep paths/labels **flat and ASCII** (no nesting, no
hyphen tricks — the platform slugifies display names).

1. **Product(s)** — a demo product + SKU(s) (`product_code__limio`), Zuora
   rate-plan bundle (`productBundles`).
2. **Offers** — one per **tier × billing frequency** (e.g. Team Monthly, Team
   Annual, Business Monthly, Business Annual). Per offer set: `price__limio`
   (currency, recurring charge), `term__limio` / `initial_term__limio`,
   `group__limio` (`monthly`/`yearly` — drives the pricing toggle),
   `default_quantity_options__limio` + `allow_multibuy__limio: true` for per-seat,
   display fields (`display_name__limio`, `display_price__limio`,
   `offer_features__limio`, `display_description__limio`), `allowed_countries__limio`,
   `checkout__limio` (`/‹slug›-checkout`), `update_configuration__limio`
   (`/‹slug›-direct-update`), and **`payment_types__limio: ["zuora_card","invoice"]`**.
   > **Always include `invoice`** — it lets orders be placed without the Zuora
   > card iframe, which is what makes autonomous agent testing possible (§6).
3. **Labels** — one per campaign grouping, e.g. `‹slug›b2b` (self-serve tiers),
   `‹slug›sales` (negotiated), `‹slug›b2c` (consumer), `‹slug›addons`,
   `‹slug›save` (retention). Attach with `limio labels attach "‹label›" --to
   "offers2/<Offer>"` (labels the item **and** registers the picklist). **No
   typos / drift** — a label on a page that no offer carries fails the page's
   build (we lost time to a `cafeynb2b2` typo). Validate with `limio labels check`.
4. **Add-ons (cross-sell)** — with `crosssell_display_name__limio` +
   `crosssell_display_description__limio`, `products`, `productBundles`, and wire
   them onto offers via `cross_sell_addons__limio` (`item_label` pointing at the
   add-on label).
5. **Upsell / downgrade / upgrade paths** — wire the tiers to each other so the
   plan-change flow has somewhere to go:
   - `upsell_offers__limio` / `upsell_display_name__limio` (e.g. Team → Business),
   - `downgrade_offers__limio` / `downgrade_cta__limio` (Business → Team),
   - `upgrade_offers__limio` for the B2C→B2B jump.
   These are what populate the `/‹slug›-direct-update-sub` "change plan" screen.
6. **Sales-assisted / Enterprise** — a negotiated offer under `‹slug›sales` and a
   quote/OBO checkout page, or a "contact sales" card.
7. **Promo** (optional) — a promo code for the launch-discount beat.

---

## 3. Pages build

Create pages (`pages2/…`) with **flat per-page tags** (`/tags/‹slug›-pricing`,
`…-checkout`, etc.) and a `referencedLabel` that **matches the offers' labels
exactly** (this is the drift trap — verify both sides).

Typical set: **Pricing** (public), **Checkout**, **Complete/Confirm**,
**Account**, **Direct Update** (seat/quantity change), **Direct Update Sub**
(plan change), **Invoices**, **Payment Methods**, **Cancel** + **Cancel Save**,
and **Sales/Quote Checkout** if sales-assisted.

**Per-page authentication** (this is decisive for self-service + agent testing):
- **Pricing** stays public: `data.isAuthenticated=false`, `pageAuthProvider=""`.
- **Every self-service page** (Account, Direct Update, Direct Update Sub,
  Checkout, Complete, Invoices, Payment Methods, Cancel*): set
  `data.isAuthenticated=true` **and** `data.pageAuthProvider` to the tenant's
  **"Anonymous Auth"** provider (on saas-dev that's `saas-dev-shop.prod.limio.com`
  — *not* the `auth0-…` provider, which forces a real login). Anonymous Auth ties
  the order to the browser session's identity so `/‹slug›-account` shows the sub
  with **no login**, which is what lets an agent test the whole journey.
  ```
  limio catalog put "pages2/<Page>" \
    --set 'data.isAuthenticated=true' \
    --set 'data.pageAuthProvider="saas-dev-shop.prod.limio.com"' --allow-prod
  ```
  Auth is baked at build time → the page must be **republished** and the browser
  **hard-reloaded** for it to take effect.

**Components — bespoke only for Pricing; in-app styling everywhere else.**
The **pricing page** is the one that has to *look* like the prospect, so build
**custom React components** for it (typically a branded hero + offer/pricing-card
component reading `<SLUG>-DESIGN-LANGUAGE.md`). **All other pages** (checkout,
complete, account, direct-update, direct-update-sub, invoices, payment-methods,
cancel/cancel-save, quote) should use **Limio's stock components styled in-app** —
i.e. the page-builder + a page-level `pageStyle` / CSS block for brand colours,
fonts, and layout tweaks — **not** new custom components. This keeps the build
fast and robust: bespoke code (and its dependencies) is confined to one page, and
the transactional pages ride the platform's maintained components.

For the custom pricing components, keep dependencies clean or the shop build
breaks: use the SDK's `sanitiseHTML` (not the external `xss` package), avoid paid
FontAwesome pro / the retired `@limio/ui-form`, and prefer `@limio/design-system`
/ small shims over raw MUI. Component source ships via the **`saas-dev` branch** —
the shop build compiles from the merged repo source, so a component change only
takes effect after its **PR is merged** (then republish the page). In-app
`pageStyle` changes, by contrast, are catalog edits — no PR/merge, just
`catalog put` + republish.

---

## 4. Build & publish — sequencing to avoid the known failures

- **Publish one page at a time** (`limio publish "<Page>"`). A single broken page
  fails the *whole* batch build, so per-page isolates problems.
- **Merge component changes first.** The shop build reads component `package.json`
  + source from the `saas-dev` branch; unmerged fixes are invisible to it.
- **Offers go live via the page build that references them** (by label/tag) —
  there's no standalone "publish offer". Confirm they're indexed with
  `limio api GET /api/offers/v2` (only published offers appear; an unpublished
  target offer will 404 an order).
- **Run `limio doctor`** — it health-checks offers, labels, index freshness, and
  token scopes; run it whenever checkout errors don't make sense.
- **CloudFront caches ~1h** after publish. Verify live with `curl -sI` and
  **hard-reload** the browser (force navigation) — otherwise you're testing a
  stale build.

---

## 5. Autonomous verification — place a new order AND a plan change

The goal: prove the demo works before demo-day by actually transacting. Two
paths; use whichever fits.

### A. Admin API (fastest, no browser)
`POST /api/admin/order` (via `limio api POST /api/admin/order -d @order.json --allow-prod`) with: **published** offer version (from `/api/offers/v2`,
not catalog HEAD), full `customerDetails` (owner is auto-created), **no**
`checkoutId`, `payment: {"type":"invoice"}`, and a **genuinely unique email**
(a reused email hits a stale-owner Salesforce-ref path). For DE/EU billing,
**omit the `state` field** (free-text Bundesland breaks SF order sync). Verify:
`limio objects get process process_event-<same-hash-as-event-id>` →
`status: processed`, `criticalPluginErrors: []`; order goes `active`. (Note: the
`salesforceRefs getRefs` `contactId` log line is a cosmetic non-critical bug on
admin orders — it does **not** block provisioning.)

### B. Browser self-service (authentic, exercises the real pages)
Requires the anonymous-auth pages (§3) republished. Caveats, all learned the hard
way:
- **reCAPTCHA is off** on saas-dev, so agent submissions are allowed. (If a tenant
  *enables* it, the agent path is blocked and a human must click — I will not
  solve CAPTCHAs.)
- **Select payment + terms with a native DOM `.click()`**, not `form_input`.
  `form_input` sets a radio's `.checked` but doesn't fire the checkout's
  `onChange`, so `paymentType` stays empty and the order silently stalls at
  `pending-payment` (shows an optimistic "success" page but **never creates a
  `process_event`**). A real click registers it ("This transaction will be paid
  for with an invoice").
- Keep the session cookies (`lmo_session`) across pages so the order ties to the
  session identity and `/‹slug›-account` shows it.

Flow: `‹slug›-pricing` (pick tier, per-seat qty) → `‹slug›-checkout` (fill B2B
fields, native-click **invoice** + terms, submit) → `‹slug›-confirm` (should show
the real order, not "details unavailable") → `‹slug›-account` (sub appears) →
**Plan ändern** → `‹slug›-direct-update-sub` (pick target tier) →
`‹slug›-direct-update` (Submit). Verify each with a fresh `process_event`
(`processed`, `criticalPluginErrors: []`).

**Confirm the plan change on the sub:** `limio sub <name> --full` → for an
up/downgrade at term end you'll see **two `subscription_offers`** — the current
tier for this term and the new tier scheduled from the next renewal.

**Exact browser mechanics** (standard Limio checkout selectors, language-agnostic):
select the payment method with `document.querySelector('input[type=radio][value="invoice"]').click()`;
tick terms with `document.querySelector('input[name="customerDetails.terms"]').click()`;
the place-order button is the checkout's submit button (its label is localized).
Drive tier CTAs / "change plan" the same way (real `.click()`). Between pages,
**hard-reload** (force navigation) so you get the freshly-published build, and do
**not** clear cookies mid-journey (that drops the session identity).

---

## 6. Sequencing gotchas — the checklist

- Flat, ASCII labels/paths; **no drift or typos** between a page's
  `referencedLabel` and its offers' labels.
- **Re-GET live state before mutating**; **never delete+recreate** — use
  `catalog put --set` (concurrent human edits are common).
- **Publish individual pages**, not bulk.
- Put **`invoice`** on every offer and **Anonymous Auth** on self-service pages so
  the demo is agent-testable end to end.
- **Native-click** payment radio + terms checkbox in the browser.
- Admin orders: **published** offer version + `customerDetails` + **unique email**
  + no `checkoutId`; drop `state` for DE/EU.
- Component dependency hygiene (SDK `sanitiseHTML`, no paid/retired deps); **merge
  component PRs before** the shop build.
- Allow for **CloudFront ~1h** + hard reload when verifying.
- A UI-green order can still fail downstream — **always check the `process_event`**.

---

## 7. Demo-day script

Finally, generate **`<SLUG>-DEMO-SCRIPT.md`** in the Cafeyn style: acts mapped to
the prospect's stated pains, click-counts called out, exact URLs, and a runbook
(catalog labels, page tags/auth, "check process events after each action"). This
is the artefact you present from.

---

## Example: "demo with GitLab, https://about.gitlab.com/"

I'd: pull the discovery from Granola → confirm a blueprint (e.g. Free/Premium/
Ultimate-style tiers, per-seat, monthly+annual, USD, card+invoice, add-ons,
Premium→Ultimate upgrade) → extract GitLab's brand into `gl-DESIGN-LANGUAGE.md`
→ build the catalog (products, offers, `glb2b`/`glsales`/`gladdons` labels,
cross-sell add-ons, upsell/downgrade wiring) → build + auth-configure + publish
the `gl-*` pages → **place a new order and a plan change via invoice/anonymous
auth and confirm both `process_event`s are clean** → hand you `gl-DEMO-SCRIPT.md`.
