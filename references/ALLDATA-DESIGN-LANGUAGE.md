# ALLDATA Design Language

The primitives behind the ALLDATA / QED42 demo (`ad-*` components + `AD *` pages
on saas-dev). Use this to build anything that must feel native to ALLDATA:
industrial, trustworthy, OEM-authoritative — navy and steel with a single orange
accent. Not consumer-SaaS pastel, not editorial.

**Verified live** against `alldata.com/us/en/` on 2026-08-07 — computed styles and
CSS custom properties read from the production site. These are the real values.

Positioning line from the site: the industry's #1 choice for OEM-accurate
mechanical and collision repair information; *"Trusted by more than 400,000
technicians in over 115,000 shops worldwide."*

---

## 1. Tokens

### Color

| Token | Value | Use |
|---|---|---|
| `--ad-navy` | `#1B3D6E` | **The** brand colour. Headers, headlines, primary CTA background, dark bands |
| `--ad-navy-dark` | `#1D3359` | Navy pressed/hover, footer, deepest band |
| `--ad-navy-light` | `#004987` | Links, secondary navy, active nav item |
| `--ad-orange` | `#F16824` | The single accent: badges, "most popular", underlines, key figures. **Sparing** |
| `--ad-ink` | `#35363A` | Body text, table text |
| `--ad-steel` | `#54565A` | Secondary copy, captions, table meta |
| `--ad-line` | `#DCE1E8` | Hairline borders, table rules, card edges |
| `--ad-mist` | `#F4F6F9` | Alternate section bands, table stripes, input fills |
| `--ad-paper` | `#F8F9FA` | Page background (Bootstrap `--light` on the live site) |
| `--ad-white` | `#FFFFFF` | Cards on paper, text on navy |
| `--ad-success` | `#28A745` | Entitlement granted, "included" checks |
| `--ad-warning` | `#FFC107` | Proration notices, "changes at renewal" |

Rules:
- **Navy is the button colour.** Orange is never a large fill — it is a badge, a
  rule, a figure, an underline. One orange element per card, maximum.
- Dark bands are solid navy `#1B3D6E`, white text. No gradients on the live site.
- Tints: `rgba(27, 61, 110, 0.04)` for hover washes, `rgba(241, 104, 36, 0.10)`
  for the featured-plan halo.

### Typography

The live site loads **Montserrat** (as `Montserrat Book` / `Medium` / `Bold`
webfont splits). We use the Google Fonts `Montserrat` family, weights 400/500/700.

| Role | Spec |
|---|---|
| h1 (hero) | Montserrat 700, 3rem / 1.12, `--ad-navy` |
| h2 (section) | Montserrat 700, 2rem / 1.2, `--ad-navy` |
| h3 (card title) | Montserrat 700, 1.25rem / 1.3, `--ad-navy` |
| Kicker | Montserrat 700, 0.8125rem, uppercase, 0.10em tracking, `--ad-orange` |
| Body | Montserrat 400, 1rem / 1.65, `--ad-ink` |
| Body muted | Montserrat 400, 0.9375rem / 1.6, `--ad-steel` |
| UI / buttons | Montserrat 700, 0.9375rem, 0.02em tracking |
| Price figure | Montserrat 700, 2.5rem / 1, `--ad-navy` |
| Price suffix | Montserrat 500, 1rem, `--ad-steel` |
| Fine print | Montserrat 400, 0.8125rem / 1.5, `--ad-steel` |

Load once per page via `pageStyle`:
```css
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap");
```

### Locale conventions

| | US (English) | EU (German) |
|---|---|---|
| Price | `$249.00` | `249,00 €` (comma decimals, NBSP before €) |
| Per-period | `/month`, `/year` | `pro Monat`, `pro Jahr` |
| Access points | `5 access points` | `5 Zugangspunkte` |
| Address | formal, US states | formal *Sie*, **no free-text state field** |
| Dates | `08/07/2026` | `07.08.2026` |

> **EU checkout rule:** omit the state/region field for DE/EU — free-text
> Bundesland breaks the Salesforce order sync (known saas-dev gotcha).

### Spacing & layout

- **Container**: `90%` width, `max-width: 75rem`, centred.
- **Section padding**: `4rem 0` desktop, `2.25rem 0` at ≤767px.
- **Gap scale**: 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 rem.
- **Breakpoints**: 1200 / 992 / 768 / 576 (Bootstrap, matching the live site).

### Radii & elevation

| Element | Radius |
|---|---|
| Buttons, inputs | `4px` |
| Cards, panels | `8px` |
| Badges, chips, region pills | `9999px` |
| Table container | `8px` |

Shadows — tight and cool, the site is not "floaty":
- Resting card: `0 1px 2px rgba(27, 61, 110, 0.08)`
- Lifted / featured card: `0 8px 24px rgba(27, 61, 110, 0.14)`
- Sticky bar: `0 -2px 8px rgba(27, 61, 110, 0.10)`

### The shared token block

Every `ad-*` component copies this verbatim at the top of its `index.css`,
scoped to the component's own root class:

```css
.ad-<component> {
  --ad-navy: #1B3D6E;
  --ad-navy-dark: #1D3359;
  --ad-navy-light: #004987;
  --ad-orange: #F16824;
  --ad-ink: #35363A;
  --ad-steel: #54565A;
  --ad-line: #DCE1E8;
  --ad-mist: #F4F6F9;
  --ad-paper: #F8F9FA;
  --ad-white: #FFFFFF;
  --ad-success: #28A745;
  --ad-font: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  --ad-radius-btn: 4px;
  --ad-radius-card: 8px;
  --ad-radius-pill: 9999px;
  --ad-shadow-rest: 0 1px 2px rgba(27, 61, 110, 0.08);
  --ad-shadow-lift: 0 8px 24px rgba(27, 61, 110, 0.14);
  font-family: var(--ad-font);
  color: var(--ad-ink);
}
```

---

## 2. Primitives

### Buttons
`padding: 0.75rem 1.5rem`, radius `4px`, Montserrat 700 0.9375rem.
- **Primary**: navy bg, white text; hover `--ad-navy-dark`.
- **Secondary**: white bg, 1px navy border, navy text; hover `--ad-mist` bg.
- **Accent** (rare — one per page, e.g. the featured plan's CTA): orange bg,
  white text; hover `#D4551A`.
- On navy bands: white bg + navy text.

### Cards
White on `--ad-paper`, 1px `--ad-line`, 8px radius, resting shadow.
**Featured plan**: 2px `--ad-orange` border + lifted shadow + an orange pill
badge top-centre. Never flip the card's background colour.

### Region / language pills
Pill radius, `--ad-mist` bg, `--ad-steel` text, 0.8125rem 700. Active pill:
navy bg, white text. Used for the `US / EU / AU` and `EN / DE` switchers — these
are the visual proof of "region is an attribute, not a deployment".

### Access-point selector (their pricing model)
This is **not** a generic seat stepper. Render it as **two discrete pack cards**
(5 / 10) side by side, each with its own price and its own Zuora rate-plan note
in the admin view. Selected pack: 2px navy border + navy check disc.
Label above: `Access points` / `Zugangspunkte`.

### Check rows
Green (`--ad-success`) check glyph, inline SVG, 1.5px stroke, in a
`rgba(40,167,69,0.10)` disc (1.25rem), 0.75rem gap to the label.
Excluded / ineligible rows: `--ad-steel` at 50% opacity with a strikethrough and
a small "Not available with your current plan" note — this is the
**mutual-exclusion** visual.

### Badges
Pill, 0.75rem 700, uppercase, 0.06em tracking.
- `MOST POPULAR` / `BELIEBTESTE WAHL` — orange bg, white text.
- `INCLUDED` / `INKLUSIVE` — `--ad-success` tint bg, success text. Used for the
  **free product inclusion** rule, which must read visually *different* from a
  bundle line item.
- `SAVE 17%` / `17 % SPAREN` — navy tint bg, navy text, on the annual toggle.

### Proration notice (the money moment)
A `--ad-mist` panel, 8px radius, 1px `--ad-line`, left border 3px
`--ad-warning`. Shows: current plan → new plan, the prorated credit, the amount
due today, and the next full charge date. This panel is the single most
important piece of UI in the demo — give it room.

### Icons
Inline SVG, 1.5px stroke, `currentColor`. No icon fonts (the live site uses
Font Awesome; we don't ship it), no emoji in UI.

---

## 3. Section patterns

| Band | Component | Notes |
|---|---|---|
| Nav | `nav-header-tailwind` (reused, themed) | ALLDATA wordmark, navy links, region + language pills right |
| Hero | `ad-hero` (custom) | Paper bg, navy headline, trust line (400,000 technicians), region/currency pills |
| Pricing | `ad-offers` (custom) | Access-point pack cards, monthly/annual toggle, featured = Repair 10 AP |
| Inclusions | `ad-offers` inline | `INCLUDED` badges — inclusion rules, visually distinct from bundle rows |
| Comparison | `comparison-table` (reused) | Mist band, navy header row |
| FAQ | `faq-accordion` (reused) | White cards, 8px radius |
| CTA closer | `cta-banner` (reused) | Solid navy band, white text, white button |
| Footer | `footer-tailwind` (reused, themed) | `--ad-navy-dark` bg, white text |

Band rhythm: paper → white cards → mist band → paper → navy closer.
Never two tinted bands adjacent.

---

## 4. Page recipes

Custom components on the **pricing pages only**. Every other page is stock Limio
components styled in-app via `pageStyle`.

- **`/ad-us-pro`** and **`/ad-eu-diy`** (the showcases): nav → `ad-hero` →
  `ad-offers` → `comparison-table` → `faq-accordion` → `cta-banner` → footer.
  Same components, different labels and locale props — that *is* the
  one-catalog argument, made visually.
- **`/ad-checkout`**: Limio modular checkout, themed via `pageStyle` only.
  B2B fields: Shop name, VAT/Tax ID, Trade. Promo code, tax, address
  validation hook. **Count the steps out loud.**
- **`/ad-confirm`**: nav → stock order confirmation → footer.
- **`/ad-account`, `/ad-direct-update`, `/ad-direct-update-sub`,
  `/ad-invoices`, `/ad-payment-methods`, `/ad-cancel`, `/ad-cancel-save`**:
  stock components restyled via `pageStyle`; German labels via props on the EU
  variants.

---

## 5. Rules of thumb

1. **Navy carries the brand; orange carries the eye.** One orange element per
   card. If two things are orange, neither is emphasis.
2. **Buttons are 4px, cards are 8px, badges are pills.** Don't invent radii.
3. **Montserrat, three weights, no exceptions.** 400 body, 500 price suffix,
   700 everything structural.
4. **Access points are packs, not a stepper.** Their model is Zuora rate plans
   in batches of 5 and 10 — the UI must show discrete packs or the story is
   wrong.
5. **Inclusions ≠ bundles.** A free inclusion gets an `INCLUDED` badge; a bundle
   member is a plain line item. ALLDATA make this distinction; so must we.
6. **Paper ≠ white ≠ mist.** Background `#F8F9FA`, cards pure white, `#F4F6F9`
   marks a section change. Three layers, always that order.
7. **English is default; German is the EU shop's real copy**, not a placeholder.
   Formal *Sie*, `249,00 €`, `pro Monat`.
8. **Page-level styling lives in `pageStyle`**; component CSS is scoped to the
   component's own subtree.
