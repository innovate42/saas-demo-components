# OpenText Business Network — Demo Script

Demo for **Rich Reinwart** (Lead PM, Enterprise), **Anatoly Krivkin** (PM, B2B Integration Essentials),
**Tony Myers** (VP Product), **Anne Blanchard**, **Samarth Gupta**. Tue 10 Nov 2026, 11:00 CT / 17:00 UK, their Teams.

All shop URLs on `https://saas-dev-shop.prod.limio.com`. Salesforce: saasdemo3. Billing: Zuora API sandbox
(Media Tenant), standing in for **Galaxy**. Test card `4111 1111 1111 1111`, any future expiry/CVC (confirm the Zuora test gateway's ACH test
account during the dry run).

> **Open before the call:** (1) `/ot-store` (2) Limio admin → Orders (3) Salesforce: the Acme Fasteners
> opportunity + the Northwind Outdoor Supply opportunity (4) webhook.site inbox
> `https://webhook.site/#!/view/e0d03d20-1eb3-4dda-bc5d-05f2a2732ca3` (5) Zuora Media Tenant → Subscriptions.

**The thread to pull through every act:** *"Your competitors (TrueCommerce, SPS) make SMBs talk to a
specialist. Zenbridge and Orderful sell online but only Web EDI. You can be the only one where a supplier
picks their ERP and their retailers, pays, and is provisioning in the same minute — and live in 9 days."*

---

## Act 1 — The store: "an e-commerce site for Trading Grid" (~4 min)

**Their words:** *"Select dynamically > OpenText supported ERP > pick mine… list of trading partners — search,
sort, checkbox, put that in the cart… paying with credit card."* (Rich, Anatoly)

1. **`/ot-store`** — on-brand OpenText (header, Inter, blue gradient). Three products, *one* store:
   Essentials (portal), **Trading Grid Foundation** (ERP-integrated), Enterprise (talk to us).
2. Open the **region picker in the header** (globe, defaults to Americas · USD) → **United Kingdom → Europe**:
   "from" prices switch $ → £ → €. *"One page, three currencies; the region also decides which data centre
   we provision in — your EMEA ops-centre point."*
3. The **"which fits you?"** helper: answer *ERP / 5–15 partners / OpenText sets it up* → recommends Trading Grid.
   *"This is your demand-gen persona — finance and supply-chain people, not IT."*

## Act 2 — Guided buying: ERP → partners → bundle (~6 min)  ★ the moment

1. **`/ot-trading-grid`** — Step 1 **pick NetSuite** ("pre-built adapter").
2. Step 2 **search the partner directory**: type *walm* → Walmart (shows **850 · 855 · 856 · 810 · 846**);
   filter **Home & DIY** → Home Depot; pick Target, Costco, Kroger, AutoZone. Six partners.
   Type a partner that isn't listed → "we'll connect it". *"This is your catalog exchange ask, Rich."*
3. Step 3 **the recommendation is the cheapest way to cover six partners**: *Foundation 5 + 1 additional
   partner* ($578) beats Foundation 10 ($899). Toggle Annual: "2 months free".
4. Step 4 **Guided onboarding** (one-off) vs self-service — *"your PS team as a product, not a hand-hold."*
5. Summary shows ERP, partners, **data centre**, monthly + one-off. **Continue to checkout.**

## Act 3 — Checkout: card or ACH + click-through order form (~3 min)

**Their words:** *"Templatised sales order form and T&Cs… make it a credit card process."*

1. **Sign in / Register** — checkout is behind the **Trading Grid Online** sign-in (Auth0, `opentext-auth0`):
   same navy look as `tradinggrid.opentext.com`, but **Register** is open self-serve (first name, last name,
   company) instead of invitation-only. Email/password or Google. *"Same login as the portal they'll live in."*
2. **`/ot-checkout`** — three collapsible steps: **1 Your details** → *Continue* → **2 Company & billing**
   (company, tax ID, industry; type the street and pick it from the **Loqate** list) → *Continue to payment* →
   **3 Payment**. Finished steps collapse to a one-line summary with *Edit*; Enter works as *Continue*. The cart
   (plan + ERP adapter + extra partner + onboarding) stays on the right with an **Upgrade your plan** card
   (Essentials Plus / next tier) and **Add to your plan** add-ons.
3. Promo **`GOLIVE20`** — 20% off the first 3 months (launch offer for the relaunch campaign).
4. Payment: **card or ACH**. Tick **"I accept the OpenText Business Network order form and terms on behalf of
   my company"** — that *is* the signed order form. Place order.
5. **Warm-up:** place one throwaway order ~10 min before the call. The first order after a quiet spell can
   return a gateway 504 while Zuora is cold, even though the order still goes through (~30 s).
6. **Morning of the demo:** open every page once and reload it. The first visit after a publish can still
   serve the previous build.

## Act 4 — Behind the click: Salesforce, provisioning, entitlements (~6 min)  ★

**Their words:** *"Integrate Salesforce to automation template — hasn't been done." "Appropriate info captured,
automate that integration with provisioning."*

1. **Zuora** (as Galaxy): new account + subscription in USD, the add-ons as rate plans.
2. **Salesforce** — new **Opportunity, Closed Won**, channel *Self-serve web store*, ERP, partners, region,
   currency. *"Your reporting stays in Salesforce: self-serve and sales-led in one pipeline."*
3. On the account: **OT Provisioning order** — *Provision tenant (North America) → Install NetSuite adapter →
   Configure connectivity → Onboard Walmart / Target / …*, each a dependent step, go-live target **+9 days**.
   *"This is the hand-off your automation templates consume. Today it's a PS spreadsheet."*
4. **Entitlement webhook** (webhook.site tab): the order event carries `entitlements__limio` — partners,
   documents/month, connection type, support tier. *"Point this at the Trading Grid provisioning API."*
5. Pre-built example if a fresh order is slow: **Northwind Outdoor Supply** (6 partners, guided onboarding).

## Act 5 — Onboarding assistant: "sweat onboarding" (~4 min)

1. **`/ot-confirm`** is an onboarding page, not a receipt: *"You're in. Let's get you trading in 9 days"*, the
   order recap, four steps (set-up details → invite your team → connect your ERP → test with partners) and a
   Day 0 → Day 9 timeline. Click **Talk to the onboarding assistant**: it reads the order back ("Foundation 5,
   NetSuite, Walmart, Target…"), then asks **one question at a time**: NetSuite version, AS2 vs SFTP
   (recommends SFTP if unsure), EDI ID (*"no ID yet? we'll use ZZ:ACMESUPPLY"*), admin users, go-live date.
2. It reads everything back, the customer confirms → outcome **Onboarding details captured**.
3. Salesforce: run **Sync OpenText onboarding conversations** → the provisioning order fills in
   connection method, EDI ID, ERP version, admin users, go-live date, **AI summary + full transcript**, and a
   Task lands on the opportunity. *"The 9-day promise, with nobody re-keying an Excel file."*

## Act 6 — Self-service portal (~3 min)

1. **`/ot-account`** — subscription, **Add partners & add-ons** (`/ot-direct-update`, prorated),
   **Change plan** (`/ot-direct-update-sub`): Essentials Plus → **Trading Grid Foundation 5** (cross-product
   upgrade) or Monthly → Annual. Each change is a new Closed Won "plan change" opportunity in Salesforce.
2. **Upgrade to Trading Grid Enterprise** → `/ot-enterprise` → **Web-to-Lead** lands in Salesforce.
3. **Request cancellation** → `/ot-cancel` → **Web-to-Case** in Salesforce (service owns retention, as today).
4. Invoices and payment methods are self-serve.

## Act 7 — Sales hands off to self-serve (Limio for Salesforce) (~3 min)

1. Salesforce → **Acme Fasteners – Trading Grid Foundation 10** (Proposal stage, Dynamics 365 BC, Home Depot /
   Lowe's / Ace / Tractor Supply / Menards).
2. Rep generates a **checkout link** (Limio for Salesforce) with the negotiated bundle → sends it.
3. Customer signs in or registers, then pays on the same OpenText checkout → **the rep's opportunity flips to Closed Won** (channel
   *Sales-assisted checkout link*) and the provisioning order is created — same automation as self-serve.
   *"Reps sell, the store collects — no contract, no PS ticket."*

## Close (~2 min)

- **Internationalisation:** USD/GBP/EUR on one catalog; region → data centre; sales org per region.
- **Fits your stack:** Limio sits between opentext.com, Salesforce and Galaxy. We already run Webroot and Carbonite
  checkouts for OpenText (`buy.webroot.com`) — same platform, same team.
- **Next step:** a 2-week pilot scoped to one bundle + one region; Galaxy and provisioning-API interop session with
  Anatoly's and Chris's teams.

---

## Runbook

| Thing | Where |
|---|---|
| Labels | `otall`, `otess` (Essentials), `ottg` (Trading Grid), `otaddons` |
| Offers | `/offers2/OT <Essentials Starter\|Essentials Plus\|Trading Grid Foundation 5\|10> <Monthly\|Annual> <USD\|GBP\|EUR>` (24) |
| Add-ons | `/add_ons/OT <ERP Adapter\|Extra Trading Partner\|Premium Support> <Monthly\|Annual> <CUR>`, `/add_ons/OT Guided Onboarding <CUR>` |
| Zuora | Products `OT-BN-ESSENTIALS`, `OT-BN-TGFOUNDATION`, `OT-BN-ADDONS` (Media Tenant 39825) |
| Pages | `/ot-store`, `/ot-trading-grid`, `/ot-essentials`, `/ot-enterprise`, `/ot-checkout`, `/ot-confirm`, `/ot-account`, `/ot-direct-update`, `/ot-direct-update-sub`, `/ot-invoices`, `/ot-payment-methods`, `/ot-cancel` |
| Components | `ot-header`, `ot-store`, `ot-buy`, `ot-request-form` (innovate42/saas-demo-components#123); `ot-step-header`, `ot-step-continue`, `ot-onboarding` (#124) |
| Login | Auth0 tenant `limio`, app *OpenText Business Network* (`w3UFQVwqy6beMqyZ4CKaRINYOf4jB8fJ`) → Limio provider `opentext-auth0` on checkout, confirm and the 6 portal pages; store/product pages stay public. See `ot-AUTH0-SETUP.md`. |
| Order → Salesforce | `OTOrderEventTrigger` on `i42as__OrderEvent__e` → `OTOrderEventHandler` |
| Onboarding → Salesforce | Limio agent `ot-bn-onboarding` → `OTOnboardingSync` (run on demand) |
| Order custom fields | `OT_Product`, `OT_ERP`, `OT_ERP_Adapter`, `OT_TradingPartners`, `OT_PartnerCount`, `OT_Documents`, `OT_Region`, `OT_DataCentre`, `OT_Onboarding` |

Run the onboarding sync on demand (Developer Console → Execute Anonymous, or CLI):

```apex
OTOnboardingSync.run();
```

After every test order check the Limio `process_event` is `processed` with `criticalPluginErrors: []`.
