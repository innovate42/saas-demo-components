# OpenText design language (Business Network store demo)

Extracted from opentext.com and opentext.com/products/b2b-integration-essentials on 2026-11-03
(computed styles in a live browser; the site blocks plain HTTP clients).

## Colour

```css
:root {
  --ot-blue:        #0066FF; /* primary CTA, links, active states */
  --ot-blue-dark:   #024CBB; /* hover, gradient start */
  --ot-navy:        #000066; /* gradient end, dark bands */
  --ot-ink:         #101C2F; /* headings, logo wordmark */
  --ot-body:        #3F4D62; /* body copy */
  --ot-line:        #E7EAEF; /* borders, section gradient top */
  --ot-mist:        #F6F7F7; /* subtle panels */
  --ot-white:       #FFFFFF;
  --ot-gradient:    linear-gradient(135deg, #024CBB 11%, #000066 48%);
  --ot-fade:        linear-gradient(#E7EAEF 0%, #FFFFFF 100%);
  --ot-logo-grad:   linear-gradient(135deg, #1A6AFF 0%, #00008B 100%);
}
```

## Typography

- Family: `"Inter var", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif` (load Inter from Google Fonts).
- Body 16px / 24px, weight 300, letter-spacing -0.011em, colour `--ot-body`.
- H1 40px / 48px, weight 800, letter-spacing -0.022em, colour `--ot-ink`.
- H2 24px / 30px, weight 700, letter-spacing -0.019em.
- Buttons and links weight 700.

## Components

- Primary button: `--ot-blue` fill, 2px border same colour, white text, **16px radius**, padding 10px 30px, weight 700.
- Text links: `--ot-blue`, weight 700, no underline.
- Cards: white, 1px `--ot-line` border, 16px radius, soft shadow on hover.
- Dark band: `--ot-gradient` background, white text (used for hero and "talk to an expert" strips).
- Section backgrounds alternate white and `--ot-fade`.

## Logo

The current mark (gradient rounded square with the "o" glyph plus the `opentext` wordmark in `#101C2F`) is
inlined as SVG in `components/ot-header`. There is no stable public URL for it, which is why the demo pages use
the custom header rather than the stock nav-header (the stock one needs a fetchable logo URL at build time).

## Voice

Plain, confident, outcome-led. From the Essentials page: "EDI connectivity made easy", "without needing in-house
expertise", "connect with major retailers in days", stats such as "70% faster onboarding" and "90% fewer errors".
Name retailers (Walmart, Target, Costco, Amazon, CVS, Nordstrom). Speak to non-technical owners and supply-chain
teams, not EDI specialists.
