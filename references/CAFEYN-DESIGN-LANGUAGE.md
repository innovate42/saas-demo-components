# Cafeyn Design Language

The primitives and rules behind the Cafeyn B2B demo (`cafeyn-*` components +
`ca-*` pages on saas-dev). Modeled on the limio.com design-language method
(`limio-custom-components/references/DESIGN-LANGUAGE.md`) — same structure,
Cafeyn values. Use this to build anything that must feel native to Cafeyn's
September-2024 identity ("Read as you like" / "Lisez comme vous aimez"):
warm, neutral, high-contrast, editorial — brown ink on cream, a "café crème"
identity. Not coral-red LeKiosk, not tech-blue SaaS.

**Verified live** against cafeyn.co on 2026-07-23 (computed styles read from
the production site) — these are real values, not approximations, except
where marked.

---

## 1. Tokens

### Color

| Token | Value | Use |
|---|---|---|
| `--cafeyn-oil` | `#211712` | Espresso-brown ink: headings, body text, logo, **primary CTA background**, dark bands |
| `--cafeyn-cream` | `#FFFDF9` | Page background (warm off-white — lighter than you'd guess) |
| `--cafeyn-surface` | `#F2ECE2` | Alternate section bands, card fills, table stripes |
| `--cafeyn-bone` | `#DED0B9` | Signature latte tone: badges, highlight fills, decorative bands |
| `--cafeyn-caramel` | `#885F46` | Sparing accent: kickers, links, icons, active states |
| `--cafeyn-latte` | `#D2BD9F` | Secondary latte: borders on tinted surfaces, chart fills (sparing) |
| `--cafeyn-muted` | `#5C4F45` | Secondary copy, captions (approximation — derived, on-brand) |
| `--cafeyn-white` | `#FFFFFF` | Cards on cream, text on Oil |
| `--cafeyn-line` | `#E7DFD2` | Hairline borders on cream/white (approximation) |

- Dark bands are solid Oil `#211712` with cream/white text — no gradients
  anywhere in the 2024 identity.
- Tints of Bone (`rgba(222, 208, 185, 0.25–0.5)`) for hover washes and
  highlighted rows. Never grey tints on this site — warmth always.
- Let magazine covers provide the color; the chrome stays brown/cream.

### Typography

Two families (both Google Fonts):

- **Newsreader** (serif) — headlines only. Cafeyn's live site uses
  Newsreader for every `h1`–`h3`. Weights 400–600, optical sizing on.
- **Source Sans 3** (sans) — body, UI, buttons, labels. Weight 400/600.
  (Cafeyn also loads GT Walsheim for its wordmark; it's commercial — the
  wordmark ships as an image instead.)

| Role | Spec |
|---|---|
| h1 (hero) | Newsreader, 3.5rem / 1.1, w500, `oil` (live site: 58px) |
| h2 (section) | Newsreader, 2.5rem / 1.15, w500, `oil` |
| h3 (card title) | Newsreader, 1.5rem / 1.25, w500, `oil` |
| Kicker | Source Sans 3, 0.875rem, w600, uppercase, 0.08em tracking, `caramel` |
| Body | Source Sans 3, 1.0625rem / 1.6, w400, `oil` |
| Body muted | Source Sans 3, 1rem / 1.6, w400, `muted` |
| UI/buttons | Source Sans 3, 1rem, w600 |
| Price figure | Newsreader, 2.25rem, w500, `oil` |
| Fine print | Source Sans 3, 0.8125rem / 1.5, w400, `muted` |

German copy conventions (this demo is 100 % German): formal *Sie*; prices
`12 €`, `12,99 €` (comma decimals, non-breaking space before €);
`pro Nutzer/Monat`; dates `23.07.2026`.

### Spacing & layout

- **Container**: width `90%`, `max-width: 72rem`, centered.
- **Section padding**: `4.5rem 0` desktop, `2.5rem 0` at ≤ 767 px.
- **Gap scale**: 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4.5 rem.
- **Breakpoints**: 991 / 767 / 479.

### Radii & elevation (verified live)

| Element | Radius |
|---|---|
| Buttons, inputs | `8px` |
| Cards, panels, cover thumbnails | `16px` |
| Chips, avatar-ish elements, toggle track | `9999px` (pill) |
| Small inline elements (tags) | `4px` |

Shadows — soft and warm-neutral, used sparingly:
- Resting card: `0 1px 3px rgba(33, 23, 18, 0.06)`
- Lifted card / featured plan: `0 12px 32px rgba(33, 23, 18, 0.12)`
- Cover thumbnail: `0 4px 12px rgba(33, 23, 18, 0.15)`

### The shared token block

Every `cafeyn-*` component copies this verbatim at the top of its
`index.css` (the `limio-custom-components` convention — components are
self-contained, tokens repeated per component, all classes namespaced):

```css
.cafeyn-<component> {
  --cafeyn-oil: #211712;
  --cafeyn-cream: #FFFDF9;
  --cafeyn-surface: #F2ECE2;
  --cafeyn-bone: #DED0B9;
  --cafeyn-caramel: #885F46;
  --cafeyn-latte: #D2BD9F;
  --cafeyn-muted: #5C4F45;
  --cafeyn-white: #FFFFFF;
  --cafeyn-line: #E7DFD2;
  --cafeyn-font-serif: "Newsreader", Georgia, serif;
  --cafeyn-font-sans: "Source Sans 3", "Source Sans Pro", -apple-system, sans-serif;
  --cafeyn-radius-btn: 8px;
  --cafeyn-radius-card: 16px;
  --cafeyn-radius-pill: 9999px;
  --cafeyn-shadow-rest: 0 1px 3px rgba(33, 23, 18, 0.06);
  --cafeyn-shadow-lift: 0 12px 32px rgba(33, 23, 18, 0.12);
  font-family: var(--cafeyn-font-sans);
  color: var(--cafeyn-oil);
}
```

Fonts are loaded once per page via the page's `pageStyle`
(`@import url("https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..600&family=Source+Sans+3:wght@400;600&display=swap");`)
— components reference the families but don't import them.

---

## 2. Primitives

### Buttons
`padding: 0.75rem 1.5rem`, radius `8px`, Source Sans 3 w600 1rem.
- **Primary**: Oil bg, white text; hover `#3A2B22` (Oil lifted 10 %).
- **Secondary**: white bg, 1px `oil` border, oil text; hover `surface` bg.
- **Ghost/link**: no bg, `caramel` text, underline on hover.
- On dark (Oil) bands: white bg + oil text, or white outline.

### Cards
White bg on cream pages, 1px `--cafeyn-line` border, 16px radius, resting
shadow. **Featured plan** ("Beliebteste Wahl"): 2px Oil border + lifted
shadow + a Bone pill badge top-center; never a color flip.

### Badges & chips
Pill radius, Bone bg, Oil text, 0.8125rem w600 (`Beliebteste Wahl`,
`-17 % jährlich`). Accent chips (promo applied): caramel bg, white text.

### Check rows
Caramel check glyph (inline SVG) in a Bone-tinted disc (1.25rem circle,
`rgba(222,208,185,0.5)`), 0.75rem gap to the label, Source Sans 3.

### Quantity stepper (the per-seat control)
Pill-shaped track (`9999px`, surface bg, 1px line border) with − / + round
buttons (Oil on white) and the seat count in Newsreader w500 between them.
Label above: `Anzahl Lizenzen` (0.875rem, muted).

### Cover imagery
Magazine covers are the identity's color source: 2:3 ratio thumbnails,
4–8px radius, cover shadow, slight overlap or marquee strips. Lead with
German titles (Der Spiegel, Stern, Focus, 11FREUNDE), then Le Monde,
The Independent.

### Icons
Inline SVG, 1.5px stroke, `currentColor` (inherits oil/caramel). No icon
fonts, no emoji in UI.

---

## 3. Section patterns

| Band | Component | Notes |
|---|---|---|
| Nav | `nav-header-tailwind` (reused, themed via props) | Cafeyn logo (oil on cream), links oil |
| Hero | `cafeyn-hero` | Cream bg, Newsreader headline, subcopy, primary CTA, cover collage right |
| Pricing cards | `cafeyn-offers` | 3 cards (Team / Business / Enterprise-contact), term toggle, seat stepper, featured = Business |
| Covers band | `cafeyn-covers-band` (optional) | Marquee strip of covers on surface band |
| Comparison | `comparison-table` (reused) | Surface band, oil header row |
| FAQ | `faq-accordion` (reused) | White cards, 16px radius |
| CTA closer | `cta-banner` (reused) | Solid Oil band, white text, white button |
| Footer | `footer-tailwind` (reused, themed) | Oil bg, cream text |
| Order confirmation | `cafeyn-order-confirmation` | Cream page, white summary card, next-steps checklist |

Band rhythm: cream → white cards → surface band → cream → Oil closer.
Never two tinted bands adjacent.

## 4. Page recipes

- **`/ca-pricing`** (the showcase): nav → `cafeyn-hero` → `cafeyn-offers`
  → `cafeyn-covers-band` → `comparison-table` → `faq-accordion` →
  `cta-banner` (Oil) → footer.
- **`/ca-checkout`**: Limio modular checkout themed via `pageStyle`
  (fonts + colors only; structure is Limio's). B2B fields: Firmenname,
  USt-IdNr., Branche. Cross-sell add-ons + Team→Business upsell in cart.
- **`/ca-confirm`**: nav → `cafeyn-order-confirmation` → footer.
- **`/ca-account` + journeys** (`/ca-invoices`, `/ca-cancel`, …): Leemeeo
  page clones restyled via `pageStyle` — components unchanged, German
  labels via props, Cafeyn tokens via CSS.

## 5. Rules of thumb

1. **One accent per element.** Caramel *or* Bone, never both on the same
   element. If everything is warm, nothing is.
2. **Oil is the only "brand color" a CTA needs.** Resist colored buttons.
3. **Serif for meaning, sans for mechanics.** Plan names, prices, and
   headlines in Newsreader; everything interactive in Source Sans 3.
4. **Buttons are 8px, cards are 16px, chips are pills.** Don't invent radii.
5. **Cream ≠ white.** Page background is `#FFFDF9`; cards sit on it in pure
   white; `#F2ECE2` marks a section change. Three layers, always in that
   order.
6. **Covers carry the color.** If a band looks flat, add covers — not color.
7. **German first.** Default prop values are the final German copy, not
   English placeholders (formal *Sie*, `12,99 €`, `pro Nutzer/Monat`).
8. **Page-level styling lives in `pageStyle`**, component CSS is scoped to
   the component's own subtree.
