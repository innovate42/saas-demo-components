# ALLDATA / QED42 — Demo Blueprint (for confirmation)

Slug `ad` · pages `AD *` · routes `/ad-*` · tenant `saas-dev` (**production**).
Derived from the 7 Aug intro call + the demo brief. Confirm before I build.

---

## The three pains → the three acts that answer them

| Their pain (their priority order) | The act that kills it |
|---|---|
| 1. Checkout is slow — 4 steps, visible lag, customer waits for the order | **§2** one-page checkout, elapsed time called out loud, order orchestrated at placement |
| 2. Business logic is coded, not configured | **§3 + Part B** inclusion / mutual-exclusion rules shown as *records*, then the same records in admin |
| 3. New market launch takes ~a week | **Part B** add AU live — catalog + region attribute, no build |
| *(unasked, lands hardest)* upgrade = cancel + recreate | **§4** mid-term amendment with proration preview |

---

## Catalog

**Products** (`/products/…`) — digital, subscription-only, no one-time:
`ALLDATA Repair`, `ALLDATA Collision`, `ALLDATA Mobile`, `ALLDATA Estimator`,
`ALLDATA Tech-Assist`, `ALLDATA DIY`.

**Access points are discrete packs, not a stepper** — 5 and 10, each its own
offer with its own `rate_plan__zuora`, mirroring their Zuora rate-plan IDs.
This makes the §4 "5 → 10" change a genuine mid-term amendment.

### Offers

| Region / label | Offer | Term | Price | Notes |
|---|---|---|---|---|
| `adus` USD/EN | ALLDATA Repair — 5 Access Points | monthly | $199.00 | |
| | ALLDATA Repair — 5 Access Points | annual | $1,990.00 | save 17% |
| | ALLDATA Repair — 10 Access Points | monthly | $349.00 | **featured** |
| | ALLDATA Repair — 10 Access Points | annual | $3,490.00 | |
| | ALLDATA Collision — 5 Access Points | monthly | $179.00 | mutual-exclusion partner |
| | Tech Essentials Pack (Repair + Mobile + Estimator) | monthly | $429.00 | the bundle |
| `adeu` EUR/DE | ALLDATA Repair — 5 Zugangspunkte | monatlich | 179,00 € | |
| | ALLDATA Repair — 5 Zugangspunkte | jährlich | 1.790,00 € | |
| | ALLDATA Repair — 10 Zugangspunkte | monatlich | 319,00 € | **featured** |
| | Tech Essentials Paket | monatlich | 389,00 € | |
| `addiy` USD/EN | ALLDATA DIY — 1 Vehicle | annual | $19.99 | B2C journey |
| | ALLDATA DIY — 5 Vehicles | annual | $34.99 | |
| `addiyeu` EUR/DE | ALLDATA DIY — 1 Fahrzeug | jährlich | 24,99 € | EU DIY shop (§1 opener) |
| `adau` AUD/EN | ALLDATA Repair — 5 Access Points | monthly | A$299.00 | **built live in Part B** |
| `adaddons` | ALLDATA Mobile / Estimator / Tech-Assist | monthly | $39 / $59 / $49 | cross-sell |
| `adsave` | 25% off 3 months | — | — | cancel-save offer |

Every offer: `payment_types__limio: ["zuora_card", "invoice"]` (invoice is what
makes autonomous agent testing possible), `checkout__limio: /ad-checkout`,
`update_configuration__limio: /ad-direct-update`, explicit `price__limio`
(`use_external_price: false`) so the demo doesn't depend on a live Zuora call.

**Rule wiring**
- *Inclusion rule* — Repair 10 AP includes ALLDATA Mobile free → `INCLUDED`
  badge, visually distinct from a bundle line.
- *Mutual exclusion* — Collision 5 AP suppressed when Repair 10 AP is held.
- *Upsell* — Repair 5 AP → Repair 10 AP (`upsell_offers__limio`).
- *Downgrade* — Repair 10 AP → Repair 5 AP (`downgrade_offers__limio`).
- *Term switch* — monthly ↔ annual within a tier.

---

## Pages

Custom components on the **two pricing pages only**; everything else is stock
Limio components styled in-app via `pageStyle`.

| Page | Route | Auth | Label |
|---|---|---|---|
| AD EU DIY | `/ad-eu-diy` | public | `addiyeu` |
| AD US Pro | `/ad-us-pro` | public | `adus` |
| AD DIY | `/ad-diy` | public | `addiy` |
| AD Checkout | `/ad-checkout` | anonymous | — |
| AD Confirm | `/ad-confirm` | anonymous | — |
| AD Account | `/ad-account` | anonymous | — |
| AD Direct Update | `/ad-direct-update` | anonymous | — |
| AD Direct Update Sub | `/ad-direct-update-sub` | anonymous | `adus` |
| AD Invoices | `/ad-invoices` | anonymous | — |
| AD Payment Methods | `/ad-payment-methods` | anonymous | — |
| AD Cancel | `/ad-cancel` | anonymous | — |
| AD Cancel Save | `/ad-cancel-save` | anonymous | `adsave` |

Anonymous auth provider on saas-dev = `saas-dev-shop.prod.limio.com` (not
`auth0-…`, which forces a real login).

**Custom components to build**: `ad-hero`, `ad-offers` (access-point pack cards,
term toggle, inclusion/exclusion badges, region + language pills).
Reused as-is: `nav-header-tailwind`, `comparison-table`, `faq-accordion`,
`cta-banner`, `footer-tailwind`.

---

## Verification (before demo day)

1. New order via `/ad-us-pro` → `/ad-checkout` → `/ad-confirm`, invoice payment.
2. Plan change 5 AP → 10 AP via `/ad-account` → `/ad-direct-update-sub`.
3. Both confirmed with `process_event` = `processed`, `criticalPluginErrors: []`.
4. `limio sub <name> --full` shows two `subscription_offers` on the amendment.

---

## Not in scope (flagging, not building)

- **LFS / Salesforce** — they run Dynamics. Commerce-only demo.
- **Live Zuora / Dynamics connections** — the orchestration act (§5) shows the
  plugin architecture and the event payload against saas-dev's configured
  plugins, not a real ALLDATA Zuora tenant.
- **The four open items** — checkout KPI data, sync-vs-queued precision (Benny),
  GCP self-hosting position, IP ownership / exit path. These are answers, not
  build items, and three of them are yours. §2 over-claims unless Benny confirms
  what is synchronous.
