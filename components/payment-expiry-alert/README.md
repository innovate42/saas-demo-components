# Payment Expiry Alert

## Overview

Displays a warning banner when a subscriber's default payment method is expiring soon or has already expired. The component has two states with independently configurable copy:

1. **Expiring soon** — the default card will expire within a configurable number of days
2. **Expired** — the default card has already expired

This is important because Zuora does **not** automatically fall back to backup payment methods when the default fails. Without the Cascading Payment Methods feature enabled, payment collection will fail and require manual intervention.

## When it shows

The alert is **visible** when ALL of these conditions are true:
- The subscriber has a default payment method set
- The default payment method is either already expired OR expiring within the configured threshold (default: 90 days)
- If "Show when backup payment exists" is set to "No": only shows when no valid non-expiring backup exists

The alert is **hidden** when ANY of these are true:
- No default payment method exists
- The default payment method is not expiring within the threshold and is not expired
- "Show when backup payment exists" is "No" AND a valid non-expiring backup payment method exists

In the **Page Builder**, the component always renders with placeholder values ("Visa ending in 4242", "45 days") so it can be positioned and configured visually. The page builder always shows the "expiring soon" state.

## Two states

### Expiring soon state
Shown when the default payment method will expire within the threshold but hasn't expired yet. Uses the **Expiring soon heading** and **Expiring soon description** prompts.

### Expired state
Shown when the default payment method's expiry date has passed. Uses the **Expired heading** and **Expired description** prompts. This is typically styled with more urgency (e.g. red colors).

## Data source

The component reads payment data from the Limio SDK:
- **Default payment method**: `customer.data.defaultPaymentMethodId` via `useLimioUserCustomer()`
- **All payment methods**: `useLimioUserPaymentMethods()` filtered to exclude invoice-type methods
- **Expiry date**: `expirationMonth` and `expirationYear` from the payment method data
- **Card details**: brand, last 4 digits extracted from the payment method data (supports Zuora and direct payment data)

## Configuration (Prompts)

| Prompt | Type | Default | Description |
|--------|------|---------|-------------|
| **Expiring soon heading** | String | "Your payment method is expiring soon" | Heading when the card is expiring but not yet expired |
| **Expiring soon description** | Rich text | "Your {{brand}} ending in {{last4}} expires in {{daysUntilExpiry}} days..." | Body text for the expiring soon state |
| **Expired heading** | String | "Your payment method has expired" | Heading when the card has already expired |
| **Expired description** | Rich text | "Your {{brand}} ending in {{last4}} has expired..." | Body text for the expired state |
| **CTA button text** | String | "Update payment method" | The text shown on the call-to-action button (shared between both states) |
| **CTA button URL** | String | "/add-payment-method" | The URL the CTA links to |
| **Expiry threshold (days)** | String | "90" | Number of days before expiry to start showing the alert. E.g. "90" means the alert appears when the card expires within 90 days |
| **Show when backup payment exists** | Picklist | "Yes - always show" | Controls visibility when backup payment methods exist. "Yes" (recommended) always shows because Zuora does not auto-fallback to backups. "No" hides the alert if a valid non-expiring backup exists — use this only if Cascading Payment Methods is enabled in Zuora |
| **Background color** | Color | #fff7ed (warm amber) | Background color of the alert card |
| **Border color** | Color | #fed7aa (amber border) | Border color of the alert card |
| **Text color** | Color | #9a3412 (dark amber) | Text and icon color |

### Template variables

Both description fields support mustache-style template variables:

| Variable | Replaced with | Example |
|----------|--------------|---------|
| `{{brand}}` | Card brand name | "Visa", "MasterCard", "American Express" |
| `{{last4}}` | Last 4 digits of card | "4242" |
| `{{daysUntilExpiry}}` | Days until the card expires | "45", "7", "0" |

If a description does not contain `{{` mustache brackets, it is displayed as-is without any replacement.

### Recommended color configurations

| State | Background | Border | Text | Effect |
|-------|-----------|--------|------|--------|
| Default (amber warning) | #fff7ed | #fed7aa | #9a3412 | Warm warning tone |
| Red urgent | #fef2f2 | #fecaca | #991b1b | High urgency for expired cards |
| Blue informational | #eff6ff | #bfdbfe | #1e40af | Softer informational tone |

Since both states share the same color prompts, the colors apply to whichever state is active. If you want the expired state to appear more urgent, consider using the component twice — one configured for expiring-soon (with a high threshold and amber colors) and one configured for expired (with threshold set to "0" and red colors).

## Layout

- **Desktop (≥768px)**: The alert renders at 724px total width (matching the saved-payment-methods 2-card grid: 350px + 24px gap + 350px), centered on the page
- **Mobile (<768px)**: Full width, single column
- The layout uses the same grid conventions as the saved-payment-methods component for visual alignment

## Placement

Place this component on the same page as the saved-payment-methods component, typically above the payment method cards so it's the first thing the subscriber sees. It works as a standalone component — drag it from the component picker in the Page Builder.

## About Zuora and backup payment methods

By default, Zuora only uses the default payment method for billing. If it fails or expires, retries use the same failed method — non-default payment methods on the account are **not** automatically used as fallback.

To enable automatic fallback, Zuora offers the **Cascading Payment Methods** feature which requires:
- Explicit enablement in Zuora settings
- Customer consent to pay with backup methods in a defined sequence

This is why the "Show when backup payment exists" setting defaults to "Yes" — most tenants should always show the alert regardless of backup methods, since having a backup doesn't help unless Cascading is enabled.

## Dependencies

- Requires `@limio/internal-checkout-sdk` for payment method hooks
- Requires `@limio/sdk` for component props and page builder detection
- Must be placed on a self-service page where the subscriber is logged in
