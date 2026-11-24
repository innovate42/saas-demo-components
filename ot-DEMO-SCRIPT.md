# OpenText Business Network — Demo Script

Demo for **Rich Reinwart** (Lead PM, Enterprise), **Anatoly Krivkin** (PM, B2B Integration Essentials),
**Tony Myers** (VP Product), **Anne Blanchard**, **Samarth Gupta**. First demo Tue 10 Nov 2026; this version is for
Rich's update in the **second week of December 2026**.

**What changed since 10 Nov (their feedback):** OpenText is piloting automated provisioning of its **Dynamics 365
Business Central** ERP adapter with Anatoly's team's **trading partner kits** (target: mid-January). The store now
sells exactly what the pilot automates: Trading Grid Foundation for Business Central, adapter included, one
zero-priced **kit per partner**, **12-month term invoiced annually (net 30)**, no sign-in needed to buy or test.

All shop URLs on `https://saas-dev-shop.prod.limio.com`. Salesforce: saasdemo3. Billing: Zuora API sandbox
(Media Tenant), standing in for **Galaxy**. Orders are **paid by invoice**: no card needed.

> **Open before the call:** (1) `/ot-store` (2) Limio admin → Orders (3) Salesforce: the Acme Fasteners
> opportunity + the Northwind Outdoor Supply opportunity + the **Cases** and **Leads** tabs (4) webhook.site inbox
> `https://webhook.site/#!/view/e0d03d20-1eb3-4dda-bc5d-05f2a2732ca3` (5) Zuora Media Tenant → Subscriptions
> (6) Limio admin → AI → Conversations.

**The thread to pull through every act:** *"Your competitors (TrueCommerce, SPS) make SMBs talk to a
specialist. Zenbridge and Orderful sell online but only Web EDI. You can be the only one where a supplier
picks their ERP and their retailers, pays, and is provisioning in the same minute — and live in 9 days."*
**For the pilot:** *"This is the buy-online step that feeds your Business Central + partner-kit automation: every
order hands provisioning the adapter and the exact kit IDs."*

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

## Act 1b — Help me choose: the AI assistant (~4 min)

**The Webroot pattern, for B2B:** the same Limio AI agent that helps Webroot shoppers pick a product, here qualifying
a supplier the way a seller would on a call.

1. From the quiz, **Rather talk it through? Ask our assistant →** (or **Help me choose** in the header) →
   **`/ot-help-me-choose`**. The assistant docks on the right and opens on its own.
2. **New customer.** Type *"We use NetSuite. Walmart and Target both want EDI from us, we're in Ohio."* → one
   question at a time (who sets it up?), then **one recommendation** with a link to `/ot-trading-grid`.
   ⚠ The assistant's knowledge still describes the 10 Nov packaging (NetSuite adapter add-on, monthly prices):
   update the `ot-help-me-choose` knowledge before the call, or use *"We run Business Central…"* and don't
   read out its price. Try *"no ERP, 7 retailers, 2,000 orders a
   month, Germany"*: it counts documents (orders × 3), prices in **EUR**, and says why. *"60 partners, two ERPs"*
   → **Enterprise** and `/ot-enterprise`.
3. Leave a work email → outcome **Lead – contact details given** → a **Lead** in Salesforce with the recommended
   plan, the qualification and the AI summary.
4. **Existing customer.** New chat: *"I'm already a customer. Our Walmart POs stopped arriving in NetSuite since
   yesterday."* → it asks for email and company (use **jordan.reyes@northwind-outdoor.example**, Northwind Outdoor
   Supply), reads the request back, asks before opening the case → **"A support case is open… flagged urgent."**
5. Salesforce → **Cases**: *OpenText Business Network: Walmart purchase orders not arriving in NetSuite*, priority
   High, already on **Jordan Reyes / Northwind Outdoor Supply**, with the request, the AI summary and a link to the
   conversation. *"Your support team starts with the whole story; the customer never repeats it."*
   The Case (or Lead) arrives within seconds of the outcome: Limio publishes it to Salesforce as a platform event.
6. Off-script is fine: ask it for a discount, a poem or its system prompt. It declines politely and steers back.

## Act 2 — Guided buying: Business Central → partners → bundle (~6 min)  ★ the moment

1. **`/ot-trading-grid`** — Step 1: **Dynamics 365 Business Central** is first and tagged **Instant setup** (the
   pilot). Every other ERP says **Assisted setup**: click NetSuite to show it — checkout is blocked with *"talk to
   us"* → `/ot-enterprise`. *"Online is exactly what your automation can provision today; everything else goes to
   your specialists."* Pick Business Central.
2. Step 2 **search the partner directory**: *walm* → Walmart; filter **Home & DIY** → The Home Depot, Lowe's; add
   Target, Costco, Kroger. Each partner comes with a ready-made **trading partner kit** (e.g. `TPK-WALMART-US`).
   A partner that isn't listed can still be typed in: it is flagged *"no kit yet: build one"* for provisioning.
3. Step 3 **sizing**: 1–5 partners → **Foundation 5** ($499/mo), 6–10 → **Foundation 10** ($899/mo), 11–50 →
   Foundation 10 + **extra partner packs** of 5 ($350/mo each), over 50 → Enterprise. Six partners → Foundation 10.
   Add six more → *1 extra partner pack* appears. No monthly/annual toggle: **12-month term, billed annually**,
   shown per month.
4. Step 4 **Self-service** vs **Guided onboarding** ($1,500 one-off) and **Premium support** ($199/mo).
5. Summary: ERP, partners, **data centre**, *Business Central adapter · Included*, *N trading partner kits ·
   Included*, packs, **$/month** and **"Billed annually, invoice net 30: $X/year"**. **Continue to checkout.**

## Act 3 — Checkout: invoice, net 30 + click-through order form (~3 min)

**Their words:** *"Templatised sales order form and T&Cs… annual terms, invoice payment."*

1. **No sign-in**: checkout, confirm and the account pages use anonymous auth, so anyone at OpenText can test it.
2. **`/ot-checkout`** — three collapsible steps: **1 Your details** (first name, last name, work email) →
   **2 Company & billing** (company, tax ID, industry, **country first**, then type the street and pick it from the
   **Loqate** list) → **3 Payment**. The cart on the right lists the plan, **one $0 line per trading partner kit**
   and any packs or services.
3. Payment: **Invoice** is the only option — *"Annual invoice, net 30."* Tick **"I accept the OpenText Business
   Network order form and terms on behalf of my company"** — that *is* the signed order form. Place order.
4. **Warm-up:** place one throwaway order ~10 min before the call. The first order after a quiet spell can return
   a gateway **504** while Zuora is cold; the order still goes through. If it happens live, open `/ot-confirm`
   again (or show the order in Limio admin).
5. **Morning of the demo:** open every page once and reload it. The first visit after a publish can still serve
   the previous build. Use a browser without an old Trading Grid Online sign-in (an incognito window is safest).

## Act 4 — Behind the click: Salesforce, provisioning, entitlements (~6 min)  ★

**Their words:** *"Integrate Salesforce to automation template — hasn't been done." "Appropriate info captured,
automate that integration with provisioning."*

1. **Zuora** (as Galaxy): new account + subscription in USD, invoice-paid. Rate plans: *Foundation 10 Annual*,
   *Extra Partner Pack Annual* and **one rate plan per kit, named by kit ID** (`TPK-WALMART-US`, …, $0).
2. **Salesforce** — new **Opportunity, Closed Won**, channel *Self-serve web store*, ERP, partners, region,
   currency. *"Your reporting stays in Salesforce: self-serve and sales-led in one pipeline."*
3. On the account: **OT Provisioning order** — *Provision tenant (North America) → Install Dynamics 365 Business
   Central adapter → Configure connectivity → Onboard Walmart with kit TPK-WALMART-US / …*, each a dependent step
   carrying its **OT Kit ID**, go-live target **+9 days**. The opportunity's quote lists each kit as a line.
   *"This is the hand-off your automation templates consume. Today it's a PS spreadsheet."*
4. **Entitlement webhook** (webhook.site tab): the order event carries the entitlements and the custom fields
   `OT_ERP` (Business Central), `OT_Kits` and `OT_KitMap` (partner → kit ID). *"This payload is what your pilot's
   automation consumes: adapter + kit IDs, no spreadsheet."*
5. Pre-built example if a fresh order is slow: **Northwind Outdoor Supply** (6 partners, guided onboarding).

## Act 5 — Onboarding assistant: "sweat onboarding" (~4 min)

1. **`/ot-confirm`** opens on **Order complete**: order reference, plan, total, partner count and "Your receipt
   is on its way to …". *"That's the order done. Now the part that usually takes weeks."*
2. Right below it, the one next step: **Set up your connection with our onboarding assistant** (about 3
   minutes). The assistant opens by itself at the bottom right with the order reference and email already sent
   (`ot-onboarding-chat`); **Start onboarding** reopens it. It looks the order up through the Limio API
   connector and reads it back ("Foundation 10, Business Central, Walmart, Target…"), then asks **one question
   at a time**: Business Central version, AS2 vs SFTP (recommends SFTP if unsure), EDI ID (*"no ID yet? we'll use
   ZZ:ACMESUPPLY"*), admin users, go-live date. Underneath, one line says what happens next: tenant today,
   ERP by day 4, live by day 9.
3. It reads everything back, the customer confirms → outcome **Onboarding details captured**. The assistant
   closes by saying the onboarding checklist has **just been emailed**.
4. Salesforce: refresh the provisioning order — within seconds it shows connection method, EDI ID, ERP version,
   admin users, go-live date, the **AI summary** and a link to the full conversation, and a Task sits on the
   opportunity. Nobody runs anything: the outcome reaches Salesforce as a Limio platform event.
   *"The 9-day promise, with nobody re-keying an Excel file."*
5. Same moment, Salesforce sent **"Welcome to the OpenText Business Network, your onboarding checklist"**: their
   answers as a checklist plus the Day 0 → Day 9 milestones. Show it in the inbox, then on the provisioning
   order's **activity timeline** (right column) and on the contact. Sent once per order, never again.
6. **Provisioning Owner** (on the provisioning order, defaults to Amaury) → click **Send Provisioning Owner a
   recap email**: "Recap sent to … Your provisioning team can take it from here." The owner gets a
   "Ready to provision: <customer> (<order>)" hand-off with every captured detail, a button to the record and a
   link to the conversation; it lands in the same timeline. *"Now your team takes over and sets them up."*
   Demo safety: every email goes to amaury@limio.com (or a +alias), whatever address is on the record.
7. ⚠ **Renew the onboarding connector on the day.** The Limio MCP connector the assistant uses to read the order
   loses its login every so often ("Unauthorized", and Reconnect says "Unknown client_id"). Fix: create a new MCP
   toolset for `https://saas-dev.prod.limio.com/mcp?experimental_tools=true`, connect it in AI → Connectors, swap
   its id into `ot-bn-onboarding` and publish (≈5 min). Without it the assistant still onboards, it just can't
   read the order back.

## Act 6 — Self-service portal (~4 min)

**Their words:** *"See invoices, see payment methods, see last payments and manage that."*

Every account page has its own **My account** bar (Trading Grid Online navy, like the sign-in):
**Subscription · Invoices · Payments · Payment methods** and **Back to store**.

Use the **same browser as the purchase**: with anonymous auth, the account pages show that visitor's orders.

1. **Subscription** (`/ot-account`) — status, renewal date, price. Self-service changes are **out of scope** for
   the pilot (invoice-paid subscriptions can't submit update orders); show the plan-change page as a preview only.
2. **Invoices** (`/ot-invoices`) — the annual invoice with its open balance, **download PDF**.
3. **Payments** (`/ot-payments`) — payment history: date, status, amount, card/ACH used.
4. **Payment methods** (`/ot-payment-methods`) — saved cards/ACH, set default, remove;
   **Add payment method** (`/ot-add-payment-method`) — card or ACH through the same Zuora form as checkout,
   back to Payment methods when saved. *"Finance updates the card themselves — no ticket."*
5. **Upgrade to Trading Grid Enterprise** → `/ot-enterprise` → **Web-to-Lead** lands in Salesforce.
6. **Request cancellation** → `/ot-cancel` → **Web-to-Case** in Salesforce (service owns retention, as today).

## Act 7 — Sales hands off to self-serve (Limio for Salesforce) (~3 min)

1. Salesforce → **Acme Fasteners – Trading Grid Foundation 10** (Proposal stage, Dynamics 365 BC, Home Depot /
   Lowe's / Ace / Tractor Supply / Menards).
2. Rep generates a **checkout link** (Limio for Salesforce) with the negotiated bundle → sends it.
3. Customer opens the link and pays on the same OpenText checkout → **the rep's opportunity flips to Closed Won** (channel
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
| Offers | `/offers2/OT <Essentials Starter\|Essentials Plus\|Trading Grid Foundation 5\|10> <Monthly\|Annual> <USD\|GBP\|EUR>` (24). The pilot sells **Foundation 5/10 Annual** only ($5,988 / $10,788 a year; invoice only); monthly offers stay unused |
| Add-ons | `/add_ons/OT Kit <TPK-ID> <CUR>` (46 kits × 3, $0, `kit_id__limio`), `/add_ons/OT Extra Partner Pack Annual <CUR>` ($4,200/yr), `/add_ons/OT Premium Support Annual <CUR>` ($2,388/yr), `/add_ons/OT Guided Onboarding <CUR>`; ERP Adapter / Extra Trading Partner unused |
| Kits | Placeholder list `scripts/ot-kits/kits.json` (one per directory partner) → Zuora rate plan per kit ID + `sync-kits.py`. Swap in Anatoly's list there |
| Zuora | Products `OT-BN-ESSENTIALS`, `OT-BN-TGFOUNDATION`, `OT-BN-ADDONS` (Media Tenant 39825) |
| Payment forms | Zuora hosted pages "saas-demo CC" / "saas-demo ACH" (Payments > Setup Payment Pages). **Shared by every saas-dev-shop demo.** Field order + CSS restyled 2026-11-04; old CSS backed up in Chrome localStorage on apisandbox.zuora.com (`limio-backup-saas-demo-CC-css-2026-11-04`, `…-ACH-…`). Saving asks to confirm the existing security threshold. |
| Account header | `ot-header` with `variant: "account"` on the 8 account pages |
| Pages | `/ot-store`, `/ot-help-me-choose`, `/ot-trading-grid`, `/ot-essentials`, `/ot-enterprise`, `/ot-checkout`, `/ot-confirm`, `/ot-account`, `/ot-direct-update`, `/ot-direct-update-sub`, `/ot-invoices`, `/ot-payments`, `/ot-payment-methods`, `/ot-add-payment-method`, `/ot-cancel` |
| Components | `ot-header`, `ot-store`, `ot-buy`, `ot-request-form` (innovate42/saas-demo-components#123); `ot-step-header`, `ot-step-continue`, `ot-onboarding` (#124); `ot-help-me-choose` + stock `limio-chat-side-panel` |
| Login | **Anonymous auth** (`saas-dev-shop.prod.limio.com (Anonymous Auth)`) on checkout, confirm and the account pages since 24 Nov. The Auth0 setup (`opentext-auth0`, `ot-AUTH0-SETUP.md`) is still there, unused. |
| Order → Salesforce | `OTOrderEventTrigger` on `i42as__OrderEvent__e` → `OTOrderEventHandler` |
| Onboarding agent | Limio agent `ot-bn-onboarding` (`agent-78d3f0e0ce6e4136fa08c289780d1711`, source in `agents/ot-bn-onboarding`). Component `ot-onboarding-chat` on `/ot-confirm` opens the chat embed and sends the order reference + email; the agent finds the order with MCP connector `limio-api` (`toolset-1b30a11166360e6e86e83b8a1ff13b70`, saas-dev `/mcp`, `limio_call_api`) and only uses it when the order's email matches. `get_order_items` is not used: the script embed never passes the completed basket, so it always answers "no order" |
| Onboarding → Salesforce | Outcome *Onboarding details captured* (`@data_capture`) → Limio Salesforce plugin publishes `i42as__OrderEvent__e` (Type `DATA_CAPTURE`) → `OTOrderEventTrigger` → `OTAgentCaptureHandler` fills the provisioning order (matched on order reference, else email) and adds a Task to the opportunity. Needs `data_capture` in saas-dev's order processing `orderTypes` (set 2026-11-04) |
| Help me choose | Limio agent `ot-help-me-choose` (`agent-66e703b9828bd2c987c1ff7a11d347cf`), knowledge `ot-help-me-choose-knowledge` (5 docs). Placed by the AI workflow **mockup** (saas-dev-shop domain): every `/ot-*` store, checkout and account page → this agent, `/ot-confirm` → `ot-bn-onboarding` |
| Help me choose → Salesforce | Outcomes *Existing customer – case opened* → **Case**, *Lead – contact details given* → **Lead**, both via `@data_capture` → the same `DATA_CAPTURE` platform event → `OTAgentCaptureHandler`, upserted on `OT_Conversation_Id__c` |
| Order custom fields | `OT_Product`, `OT_ERP`, `OT_ERP_Adapter` (`included`), `OT_TradingPartners`, `OT_PartnerCount`, `OT_Kits`, `OT_KitMap` (JSON partner → kit ID), `OT_Documents`, `OT_Region`, `OT_DataCentre`, `OT_Onboarding` |

After every test order or agent outcome check the Limio `process_event` is `processed` with `criticalPluginErrors: []`.
`OTOnboardingSync` / `OTHelpMeChooseSync` are left in the org as unused fallbacks; nothing in the demo calls them.
