# OpenText Business Network — Demo Script

Demo for **Rich Reinwart** (Lead PM, Enterprise), **Anatoly Krivkin** (PM, B2B Integration Essentials),
**Tony Myers** (VP Product), **Anne Blanchard**, **Samarth Gupta**. Tue 10 Nov 2026, 11:00 CT / 17:00 UK, their Teams.

All shop URLs on `https://saas-dev-shop.prod.limio.com`. Salesforce: saasdemo3. Billing: Zuora API sandbox
(Media Tenant), standing in for **Galaxy**. Test card `4111 1111 1111 1111`, any future expiry/CVC (confirm the Zuora test gateway's ACH test
account during the dry run).

> **Open before the call:** (1) `/ot-store` (2) Limio admin → Orders (3) Salesforce: the Acme Fasteners
> opportunity + the Northwind Outdoor Supply opportunity + the **Cases** and **Leads** tabs (4) webhook.site inbox
> `https://webhook.site/#!/view/e0d03d20-1eb3-4dda-bc5d-05f2a2732ca3` (5) Zuora Media Tenant → Subscriptions
> (6) Limio admin → AI → Conversations.

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

## Act 1b — Help me choose: the AI assistant (~4 min)

**The Webroot pattern, for B2B:** the same Limio AI agent that helps Webroot shoppers pick a product, here qualifying
a supplier the way a seller would on a call.

1. From the quiz, **Rather talk it through? Ask our assistant →** (or **Help me choose** in the header) →
   **`/ot-help-me-choose`**. The assistant docks on the right and opens on its own.
2. **New customer.** Type *"We use NetSuite. Walmart and Target both want EDI from us, we're in Ohio."* → one
   question at a time (who sets it up?), then **one recommendation**: *Trading Grid Foundation 5 + NetSuite adapter
   ($648/month)*, Guided Onboarding offered, link to `/ot-trading-grid`. Try *"no ERP, 7 retailers, 2,000 orders a
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

## Act 2 — Guided buying: ERP → partners → bundle (~6 min)  ★ the moment

1. **`/ot-trading-grid`** — Step 1 **pick NetSuite** ("pre-built adapter").
2. Step 2 **search the partner directory**: type *walm* → Walmart (shows **850 · 855 · 856 · 810 · 846**);
   filter **Home & DIY** → Home Depot; pick Target, Costco, Kroger, AutoZone. Six partners.
   Type a partner that isn't listed → "we'll connect it". *"This is your catalog exchange ask, Rich."*
3. Step 3 **the recommendation is the cheapest way to cover six partners**: *Foundation 5 + 1 additional
   partner* ($578) beats Foundation 10 ($899). Toggle Annual: "2 months free".
4. Step 4 **Guided onboarding** (one-off) vs self-service — *"your PS team as a product, not a hand-hold."*
5. Summary shows ERP, partners, **data centre**, monthly + one-off. **Continue to checkout.**

## Act 2b — Enterprise: the buyer builds their own quote (~4 min)

**Rich's words:** *"Competitors quote in < 2 days. OT quoting takes weeks."* Packaging stays complex; the buyer
gets a quote in minutes anyway, and sales gets it in Salesforce as a real quote, not an Excel attachment.

1. **`/ot-store`** → Trading Grid Enterprise card → **Build a quote →** (next to *Talk to our team*) → **`/ot-quote`**.
   **Demo shortcut — no typing:** open
   **https://saas-dev-shop.prod.limio.com/ot-quote?demo=1&region=NA** (bookmark it). The form fills itself with
   the buyer below, then `demo=1` drops out of the address bar so the prospect never sees it. Each load uses a new
   email (`amaury+q<yyMMddHHmmss>@limio.com`) and a new company (*Harbor Foods Distribution* + 3 random
   characters), so every quote lands on a fresh Salesforce Account/Contact. Nothing is submitted; every field
   stays editable. `&region=NA` keeps it in USD (drop it or switch the header region for £/€).
2. Fill the form like Atlassian's: you, company, **trading network** (ERP *Oracle NetSuite*, **40 partners**, key
   partners *Walmart, Kroger, Costco, Sysco*), **3-year** commitment, start date, Premium Support + Guided
   onboarding, billing and technical contacts, PO, tax exemption. With `?demo=1` this is already done: show the
   filled sections, then change the partner count live to reprice.
   The **Your quote** panel prices it live from the catalog: Foundation 10 + 30 additional partners + ERP adapter +
   Premium Support = **$36,170/yr**, $1,500 one-off, **$110,010 over 3 years**. Change the partner count or the
   region (header, $ → £ → €) and it reprices.
3. **Create my quote** → **"Your quote is ready"**: quote reference (*OTQ-…*), valid 30 days, line items, totals,
   **Download PDF** for procurement. *"Day 1, not week 3."*
4. Salesforce (seconds later): **Opportunity** *<Company> – Trading Grid Enterprise quote OTQ-…* at
   Proposal/Price Quote (lead source *OT Quote Builder*, ERP, partners, data centre, full brief in the description),
   **Account** + **Contact**, a High-priority **Task** *Review customer-built quote OTQ-…* for the owner, and a
   **Limio quote** on the opportunity → open it: the same lines and prices, editable (discount, price, quantity)
   by the rep in Limio for Salesforce. *"Sales starts from a priced quote, not a blank sheet."*

Behind it: the page sends a Limio `data_capture` order (no basket) → Limio's Salesforce plugin publishes
`i42as__OrderEvent__e` (Type `DATA_CAPTURE`) → `OTOrderEventTrigger` → `OTQuoteRequestHandler`, which reads the
offers from Limio's catalog and writes the quote in the shape Limio for Salesforce uses.
Not in the demo: the rep sending a checkout link from that quote. The quote page's link flow in saasdemo3 still
points at the Amazing Life checkout (`/al-checkout`).

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
4. Payment: **card or ACH**. The Zuora payment form looks like the rest of the checkout: card number, then
   expiry + CVV, then name on card (ACH: name on account, routing + account number, account type + bank name).
   Pick the billing **country first** in step 2 — Loqate and the payment form both wait for it. Tick **"I accept
   the OpenText Business Network order form and terms on behalf of my company"** — that *is* the signed order
   form. Place order.
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

1. **`/ot-confirm`** opens on **Order complete**: order reference, plan, total, partner count and "Your receipt
   is on its way to …". *"That's the order done. Now the part that usually takes weeks."*
2. Right below it, the one next step: **Set up your connection with our onboarding assistant** (about 3
   minutes). The assistant opens by itself at the bottom right with the order reference and email already sent
   (`ot-onboarding-chat`); **Start onboarding** reopens it. It looks the order up through the Limio API
   connector and reads it back ("Foundation 5, NetSuite, Walmart, Target…"), then asks **one question at a
   time**: NetSuite version, AS2 vs SFTP (recommends SFTP if unsure), EDI ID (*"no ID yet? we'll use
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

## Act 6 — Self-service portal (~4 min)

**Their words:** *"See invoices, see payment methods, see last payments and manage that."*

Every account page has its own **My account** bar (Trading Grid Online navy, like the sign-in):
**Subscription · Invoices · Payments · Payment methods** and **Back to store**.

1. **Subscription** (`/ot-account`) — status, renewal date, price, payment method on file.
   **Add partners & add-ons** (`/ot-direct-update`, prorated), **Change plan** (`/ot-direct-update-sub`):
   Essentials Plus → **Trading Grid Foundation 5** (cross-product upgrade) or Monthly → Annual. Each change is a
   new Closed Won "plan change" opportunity in Salesforce. *Plan changes need a card or ACH on file — an
   invoice-paid subscription can't submit an update order (known Zuora/Limio issue).*
2. **Invoices** (`/ot-invoices`) — every invoice, balance, **download PDF**, pay an open balance.
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
| Payment forms | Zuora hosted pages "saas-demo CC" / "saas-demo ACH" (Payments > Setup Payment Pages). **Shared by every saas-dev-shop demo.** Field order + CSS restyled 2026-11-04; old CSS backed up in Chrome localStorage on apisandbox.zuora.com (`limio-backup-saas-demo-CC-css-2026-11-04`, `…-ACH-…`). Saving asks to confirm the existing security threshold. |
| Account header | `ot-header` with `variant: "account"` on the 8 account pages |
| Pages | `/ot-store`, `/ot-help-me-choose`, `/ot-trading-grid`, `/ot-essentials`, `/ot-enterprise`, `/ot-quote` (anonymous auth, label `ottg`), `/ot-checkout`, `/ot-confirm`, `/ot-account`, `/ot-direct-update`, `/ot-direct-update-sub`, `/ot-invoices`, `/ot-payments`, `/ot-payment-methods`, `/ot-add-payment-method`, `/ot-cancel` |
| Components | `ot-header`, `ot-store`, `ot-buy`, `ot-request-form` (innovate42/saas-demo-components#123); `ot-step-header`, `ot-step-continue`, `ot-onboarding` (#124); `ot-help-me-choose` + stock `limio-chat-side-panel` |
| Login | Auth0 tenant `limio`, app *OpenText Business Network* (`w3UFQVwqy6beMqyZ4CKaRINYOf4jB8fJ`) → Limio provider `opentext-auth0` on checkout, confirm and the 6 portal pages; store/product pages stay public. See `ot-AUTH0-SETUP.md`. |
| Order → Salesforce | `OTOrderEventTrigger` on `i42as__OrderEvent__e` → `OTOrderEventHandler` |
| Onboarding agent | Limio agent `ot-bn-onboarding` (`agent-78d3f0e0ce6e4136fa08c289780d1711`, source in `agents/ot-bn-onboarding`). Component `ot-onboarding-chat` on `/ot-confirm` opens the chat embed and sends the order reference + email; the agent finds the order with MCP connector `limio-api` (`toolset-1b30a11166360e6e86e83b8a1ff13b70`, saas-dev `/mcp`, `limio_call_api`) and only uses it when the order's email matches. `get_order_items` is not used: the script embed never passes the completed basket, so it always answers "no order" |
| Onboarding → Salesforce | Outcome *Onboarding details captured* (`@data_capture`) → Limio Salesforce plugin publishes `i42as__OrderEvent__e` (Type `DATA_CAPTURE`) → `OTOrderEventTrigger` → `OTAgentCaptureHandler` fills the provisioning order (matched on order reference, else email) and adds a Task to the opportunity. Needs `data_capture` in saas-dev's order processing `orderTypes` (set 2026-11-04) |
| Help me choose | Limio agent `ot-help-me-choose` (`agent-66e703b9828bd2c987c1ff7a11d347cf`), knowledge `ot-help-me-choose-knowledge` (5 docs). Placed by the AI workflow **mockup** (saas-dev-shop domain): every `/ot-*` store, checkout and account page → this agent, `/ot-confirm` → `ot-bn-onboarding` |
| Help me choose → Salesforce | Outcomes *Existing customer – case opened* → **Case**, *Lead – contact details given* → **Lead**, both via `@data_capture` → the same `DATA_CAPTURE` platform event → `OTAgentCaptureHandler`, upserted on `OT_Conversation_Id__c` |
| Quote → Salesforce | `/ot-quote` (`ot-quote-builder`, innovate42/saas-demo-components#139, #140) sends `data_capture` with `form: "ot_quote_request"` → `DATA_CAPTURE` platform event → `OTOrderEventTrigger` → `OTQuoteRequestHandler` (Queueable, catalog callouts over the `limio` named credential): Account + Contact + Opportunity (`OT_Quote_Ref__c`, idempotent) + `i42as__Limio_Quote__c` (In Progress, approval Needed) + Task. A Lead is not enough: the Limio quote requires an Opportunity and takes its contact from `Opportunity.ContactId`. Permission set `OT_Quote_Builder`. AI workflow **mockup**: `/ot-quote` → `ot-help-me-choose` |
| Order custom fields | `OT_Product`, `OT_ERP`, `OT_ERP_Adapter`, `OT_TradingPartners`, `OT_PartnerCount`, `OT_Documents`, `OT_Region`, `OT_DataCentre`, `OT_Onboarding` |

After every test order or agent outcome check the Limio `process_event` is `processed` with `criticalPluginErrors: []`.
`OTOnboardingSync` / `OTHelpMeChooseSync` are left in the org as unused fallbacks; nothing in the demo calls them.
