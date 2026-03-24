# No Backup Payment Alert

## Overview

Displays a warning banner when a subscriber has a default payment method but no valid backup payment method on file. This helps prevent service interruptions by prompting users to add a second payment method before their primary one fails.

The component automatically detects the subscriber's payment method status and only shows when action is needed — it is invisible when the user already has a valid backup.

## When it shows

The alert is **visible** when ALL of these conditions are true:
- The subscriber has a default payment method set
- There are no other non-expired payment methods on the account

The alert is **hidden** when ANY of these are true:
- No default payment method exists (nothing to protect)
- At least one other non-expired payment method exists (user has a backup)
- Payment methods without expiry data (e.g. Direct Debit, PayPal, Bank Transfer) are treated as valid backups

In the **Page Builder**, the component always renders with placeholder values ("Visa ending in 4242") so it can be positioned and configured visually.

## Data source

The component reads payment data from the Limio SDK:
- **Default payment method**: `customer.data.defaultPaymentMethodId` via `useLimioUserCustomer()`
- **All payment methods**: `useLimioUserPaymentMethods()` filtered to exclude invoice-type methods
- **Card details**: brand, last 4 digits extracted from the payment method data (supports Zuora and direct payment data)

## Configuration (Prompts)

| Prompt | Type | Default | Description |
|--------|------|---------|-------------|
| **Heading** | String | "No backup payment method" | The bold heading text at the top of the alert |
| **Description** | Rich text | "Your {{brand}} ending in {{last4}} has no backup..." | The body text below the heading. Supports `{{brand}}` and `{{last4}}` template variables that are resolved at runtime from the default payment method |
| **CTA button text** | String | "Add backup method" | The text shown on the call-to-action button |
| **CTA button URL** | String | "/add-payment-method" | The URL the CTA links to. Set to a page where the user can add a new payment method |
| **Background color** | Color | #fff7ed (warm amber) | Background color of the alert card |
| **Border color** | Color | #fed7aa (amber border) | Border color of the alert card |
| **Text color** | Color | #9a3412 (dark amber) | Text and icon color |

### Template variables

The **Description** field supports mustache-style template variables that are replaced at runtime with the subscriber's actual payment method details:

| Variable | Replaced with | Example |
|----------|--------------|---------|
| `{{brand}}` | Card brand name | "Visa", "MasterCard", "American Express" |
| `{{last4}}` | Last 4 digits of card | "4242" |

If the description does not contain `{{` mustache brackets, it is displayed as-is without any replacement.

## Layout

- **Desktop (≥768px)**: The alert renders at 724px total width (matching the saved-payment-methods 2-card grid: 350px + 24px gap + 350px), centered on the page
- **Mobile (<768px)**: Full width, single column
- The layout uses the same grid conventions as the saved-payment-methods component for visual alignment

## Placement

Place this component on the same page as the saved-payment-methods component, typically above or below the payment method cards. It works as a standalone component — drag it from the component picker in the Page Builder.

## Dependencies

- Requires `@limio/internal-checkout-sdk` for payment method hooks
- Requires `@limio/sdk` for component props and page builder detection
- Must be placed on a self-service page where the subscriber is logged in
