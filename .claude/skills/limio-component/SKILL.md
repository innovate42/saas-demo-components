---
name: limio-component
description: This skill should be used when the user asks to "create a Limio component", "build a subscription component", "make offer cards", mentions "limioProps", "Limio SDK", "@limio/sdk", "useCampaign", "useBasket", or discusses building React components for the Limio subscription platform.
version: 1.0.0
---

# Limio Custom Component Creation

Use this skill when creating custom components for the Limio subscription management platform.

## Component Structure

A Limio component requires these files:

```
component-name/
├── package.json           # Dependencies + limioProps config
├── index.js               # Main React component
├── componentStaticProps.js # Props hook setup
└── index.css              # Styles (optional)
```

## package.json Format

```json
{
  "name": "@limio/component-name",
  "version": "1.0.0",
  "description": "Component description",
  "main": "./index.js",
  "dependencies": {
    "ramda": "^0.28.0",
    "xss": "^1.0.8"
  },
  "peerDependencies": {
    "react": "*"
  },
  "limioProps": []
}
```

## Dependencies

You can import **any public npm library** in the dependencies. Limio's build system will bundle them with your component.

**Recommended approach:** Prefer using well-maintained SDKs and libraries over writing custom code. This makes components:
- Easier to maintain
- More reliable
- Faster to develop
- Benefit from community updates and security fixes

**Common useful libraries:**
- `ramda` - Functional utilities (groupBy, prop, etc.)
- `xss` - HTML sanitization (required for rich text)
- `@mui/material` - Material UI components
- `@emotion/react` / `@emotion/styled` - CSS-in-JS (required for MUI)
- `framer-motion` - Animations
- `date-fns` or `dayjs` - Date formatting
- `lodash` - General utilities

**Example with multiple dependencies:**
```json
{
  "dependencies": {
    "ramda": "^0.28.0",
    "xss": "^1.0.8",
    "@mui/material": "5.16.7",
    "@emotion/react": "^11.10.6",
    "@emotion/styled": "^11.10.6",
    "framer-motion": "^10.16.4"
  }
}
```

## limioProps Types

### String
```json
{
  "id": "headline",
  "label": "Headline",
  "type": "string",
  "default": "Welcome"
}
```

### Boolean
```json
{
  "id": "showImage",
  "label": "Show image",
  "type": "boolean",
  "default": true
}
```

### Number
```json
{
  "id": "cardWidth",
  "label": "Card width",
  "type": "number",
  "default": "2"
}
```

### Rich Text (HTML)
```json
{
  "id": "description__limio_richtext",
  "label": "Description",
  "type": "richText",
  "default": "<p>Default content</p>"
}
```

### Color
```json
{
  "id": "primaryColor__limio_color",
  "label": "Primary color",
  "type": "color",
  "default": "#635BFF"
}
```

### DateTime
```json
{
  "id": "expiryDateTime",
  "label": "Expiry Date/Time",
  "type": "datetime",
  "default": "2025-12-10T11:30:42.809Z"
}
```

### Picklist (Dropdown)
```json
{
  "id": "theme",
  "label": "Theme",
  "type": "picklist",
  "options": [
    { "id": "light", "label": "Light", "value": "light" },
    { "id": "dark", "label": "Dark", "value": "dark" }
  ],
  "default": "light"
}
```

### List (Array of Objects)
```json
{
  "id": "groupLabels",
  "label": "Group Labels",
  "type": "list",
  "fields": {
    "name": {
      "id": "id",
      "label": "ID",
      "type": "string"
    },
    "url": {
      "id": "label",
      "label": "Label",
      "type": "string"
    },
    "thumbnail": {
      "id": "thumbnail",
      "label": "Thumbnail",
      "type": "string",
      "format": "uri",
      "purpose": "image"
    }
  },
  "default": [
    { "id": "monthly", "label": "Monthly" },
    { "id": "annual", "label": "Annual" }
  ]
}
```

**Important:** List items are objects with `id` and `label` properties, not plain strings.

## componentStaticProps.js

```javascript
import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk"
import packageData from "./package.json"

export function useStaticProps() {
    const defaultComponentProps = getPropsFromPackageJson(packageData)
    return useComponentProps(defaultComponentProps)
}
```

## Limio SDK Hooks

### useCampaign
Returns campaign data including offers.

```javascript
import { useCampaign } from "@limio/sdk"

const { offers, campaign, addOns, tag, groupValues } = useCampaign()
```

**offers array** - Each offer has:
- `offer.id` - Unique identifier
- `offer.data.attributes.display_name__limio` - Display name
- `offer.data.attributes.display_price__limio` - Price HTML
- `offer.data.attributes.detailed_display_price__limio` - Detailed price
- `offer.data.attributes.offer_features__limio` - Features HTML
- `offer.data.attributes.cta_text__limio` - CTA button text
- `offer.data.attributes.best_value__limio` - Boolean for highlighting
- `offer.data.attributes.group__limio` - Group category ID
- `offer.data.attachments` - Array of attachments (images, etc.)

### useBasket
Manages basket/cart functionality.

```javascript
import { useBasket } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"

const {
    orderItems,
    basketLoading,
    formattedTotal,
    pageOptions,
    initiateCheckout,
    addOfferToBasket,
    removeFromBasket,
    navigateToCheckout,
    redeemPromoCode,
    removePromoCode
} = useBasket()
```

**Add to basket pattern:**
```javascript
const handleAddToBasket = async (offer) => {
    const checkoutId = getCurrentBasketId()
    if (!checkoutId) {
        await initiateCheckout({ order: { orderItems: [{ offer }] } })
    } else {
        await addOfferToBasket({ offer })
    }
    if (pageOptions?.pushToCheckout) {
        await navigateToCheckout()
    }
}
```

### useComponentProps
Gets component props with defaults from package.json.

```javascript
import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk"
```

### useLimioContext
Gets context info including Page Builder detection.

```javascript
import { useLimioContext } from "@limio/sdk"

const { isInPageBuilder } = useLimioContext() || {}

// Use to disable fixed positioning, animations, etc. in Page Builder
if (isInPageBuilder) {
    // Render static/simplified version for editor
}
```

## Component Template

```javascript
import React, { useState, useMemo } from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { useStaticProps } from "./componentStaticProps"
import { groupBy, prop } from "ramda"
import xss from "xss"
import "./index.css"

const sanitizeString = (str) => xss(str || "")
const groupOffers = groupBy(prop("group__limio"))

const MyComponent = () => {
    const { offers } = useCampaign() || {}
    const props = useStaticProps() || {}

    const {
        heading = "Default heading",
        groupLabels = [],
        showGroupedOffers = false,
    } = props

    // Group offers by group__limio attribute
    const groupedOffers = useMemo(() => {
        if (!offers || !Array.isArray(offers)) return {}
        return groupOffers(
            offers.map(offer => ({
                ...offer,
                group__limio: offer?.data?.attributes?.group__limio || "default",
            }))
        )
    }, [offers])

    // Filter valid labels that have matching offers
    const validLabels = useMemo(() => {
        const groups = Object.keys(groupedOffers)
        if (groupLabels && groupLabels.length > 0) {
            return groupLabels.filter(item => groups.includes(item.id))
        }
        return groups.map(g => ({ id: g, label: g }))
    }, [groupLabels, groupedOffers])

    const [selectedGroup, setSelectedGroup] = useState(validLabels[0]?.id || "")

    const displayedOffers = useMemo(() => {
        if (showGroupedOffers && selectedGroup && groupedOffers[selectedGroup]) {
            return groupedOffers[selectedGroup]
        }
        return offers || []
    }, [showGroupedOffers, selectedGroup, groupedOffers, offers])

    if (!offers || offers.length === 0) {
        return null
    }

    return (
        <section>
            <h1>{heading}</h1>
            {displayedOffers.map((offer, i) => (
                <OfferCard key={offer?.id || i} offer={offer} />
            ))}
        </section>
    )
}

export default MyComponent
```

## HTML Sanitization

Always sanitize HTML from Limio attributes before rendering:

```javascript
import xss from "xss"

const sanitizeString = (str) => xss(str || "")

// Usage
<div dangerouslySetInnerHTML={{ __html: sanitizeString(offer.data.attributes.display_price__limio) }} />
```

## Best Practices

1. **Use public npm libraries**: Import any public npm package to speed up development and improve maintainability. Don't reinvent the wheel.

2. **Prefer SDKs over custom code**: Use well-maintained libraries instead of writing custom implementations. They're battle-tested, maintained, and receive security updates.

3. **Null safety**: Always use optional chaining and defaults
   ```javascript
   const { offers } = useCampaign() || {}
   const attributes = offer?.data?.attributes || {}
   ```

4. **List props**: Remember items are `{id, label}` objects, not strings
   ```javascript
   groupLabels.filter(item => groups.includes(item.id))
   ```

5. **Picklist options**: Use `options` array with `id`, `label`, `value`

6. **Keep CSS simple**: Prefer plain CSS for lightweight components, or use established libraries like MUI for complex UIs

7. **Loading states**: Handle `basketLoading` to prevent double submissions

8. **Sanitize HTML**: Always use `xss` library for user-generated content
