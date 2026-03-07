# Test Coverage Analysis

## Current State

**Test coverage: 0%.** The codebase has **zero test files**. While the project has Jest configured (in both the root `package.json` and `component-playground/package.json`) and testing libraries installed (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jest-axe`, `jest-extended`, `msw`), no actual tests have been written. The only test-related file is `component-playground/scripts/test.js`, which is a CRA-style test runner script — not a test itself.

Additionally, the root-level `yarn test` command is broken (`jest` is not in the PATH), and the `component-playground/scripts/test.js` runner fails when invoked via `npx jest` due to an identifier collision.

---

## Recommended Test Coverage Improvements (Prioritized)

### Priority 1: Shared Utility Functions (High Impact, Easy to Test)

These are pure or near-pure functions used across many components. They are the best place to start because they require no DOM rendering, have clear inputs/outputs, and their correctness impacts every component that uses them.

#### 1.1 `components/source/currency/index.js` — `formatCurrency()`
- Currency formatting with locale support and `Intl.NumberFormat` fallback
- Test cases: valid amount/currency pairs, undefined/null inputs (returns `""`), missing `Intl` support fallback, various locale codes

#### 1.2 `components/source/utils/string/index.js`
- **`capitaliseFirstLetter()`** — Simple but used widely; test empty string, undefined, normal strings
- **`formatDisplayPrice()`** — Template replacement with `{{currencyCode}}`, `{{currencySymbol}}`, `{{amount}}`, `{{formattedPrice}}`, etc. Test all template placeholders, missing price data, invalid currency codes
- **`parseString()`** — Mustache-style `{{path.to.value}}` interpolation with optional encode function. Test nested paths, missing values (replaced with `""`), non-string input (should throw), encode function application
- **`encodeDates()`** — ISO date detection and formatting. Test valid ISO dates, non-date strings (passthrough), various date formats

#### 1.3 `components/source/utils/date/index.js`
- **`formatDate()`** — Multiple named formats (`DATE_EN`, `DATE_MED`, `DATE_FULL`, `DATE_SHORT`) plus Luxon locale fallback
- **`getTermDates()`** — Complex logic with renewal, gift, and standard purchase paths. Test each branch

#### 1.4 `components/source/utils/offers/index.js`
- **`sortOffers()`** — Sorting by custom order or by price, with sales channel filtering. Test custom sorting map, price-based fallback, sales channel filtering
- **`sortOffers2()`** — Metadata-based ordering with deduplication
- **`filterTrials()`** — Marks trial offers as hidden
- **`groupOffers()`** — Groups offers by `group__limio` attribute with label lookup
- **`getPeriodForOffer()`** — Has a **bug**: references undefined `status` variable on line 131. Test should catch this
- **`checkActiveOffers()`** — Date-based filtering with future-dated offer support
- **`getCurrentOffer()`** — Finds current non-discount offer from a subscription

#### 1.5 `components/source/utils/basket/index.js`
- **`handleQuantityChange()`** — Quantity clamping with max/min bounds
- **`checkEmptyQuantityOnBlur()`** — Fallback to minimum on blur

#### 1.6 `components/source/utils/address/index.js`
- **`addressSummary()`** — Formats address with country lookup from JSON data
- **`getCurrentAddress()`** — Finds most recent active address by type

#### 1.7 `components/source/utils/subscriptions/index.js`
- **`getPriceForUserSubscription()`** — Complex price resolution from schedules or offer attributes
- **`checkPreviousSchedule()` / `checkCurrentSchedule()`** — Schedule filtering and sorting by date
- **`getRenewalDateForUserSubscription()`** — Renewal date extraction with formatting

#### 1.8 `components/source/utils/paymentMethods/index.js`
- **`getCurrentPayment()`** — Most recent payment method lookup
- **`processPaymentMethod()`** — Complex branching logic for Zuora, Nexi, PayPal, Apple Pay, ACH, direct debit, invoice, Twikey, external integrations. High complexity = high test value
- **`getPaymentLabel()`** — Payment type label resolution

---

### Priority 2: Component-Level Helper Functions (Medium Impact)

These helpers are co-located with specific components but contain testable business logic.

#### 2.1 `components/cancel-save-offer-custom/helpers.ts` and `components/cancel-save-offer-tailwind/helpers.js`
- **`filterOffers()`** — Filters offers by term matching against subscription data. Separates discounts from standard offers. Critical business logic for the cancellation save flow

#### 2.2 `components/switch-subscription-tailwind/helpers/index.js`
- **`filterOffers()`** — More complex variant with `filterSameTerm`, `filterBySameProduct`, multibuy support, and discount term matching

#### 2.3 `components/order-table-custom/helpers/index.js`
- **`stripPathToProductName()`** — Path parsing (has a quirk: returns `console.log()` result for non-strings instead of throwing)
- **`formatCurrency()`** — Duplicate of the source utility (could be deduplicated)
- **`checkCurrentSchedule()`** — Duplicate of subscriptions utility
- **`checkActiveOffers()`** — Duplicate of offers utility
- **`formatDate()`** — Yet another date formatting function

#### 2.4 `components/saas-pricing-page/helpers.js`
- **`getAllOfferFeatures()`** — Aggregates unique features across offers
- **`getSaveXText()`** — Finds promotional save text from offers

#### 2.5 `components/maltego-cart-items/helpers.js` and `components/plan-selection/helpers.js`
- Similar cart/plan selection helper logic

#### 2.6 `components/edit-base-plan*/components/helpers.js` and `components/edit-add-ons*/components/helpers.js`
- Plan editing and add-on management helpers

---

### Priority 3: React Component Rendering Tests (Higher Effort)

Once utilities are covered, add component-level tests using `@testing-library/react`. The mocks in `__mocks__/@limio/sdk.js` already provide a solid foundation.

#### 3.1 Start with simpler, self-contained components:
- `components/breadcrumbs/` and `components/breadcrumbs-tailwind/` — Simple navigation UI
- `components/faq-banner/` and `components/faq-banner-tailwind/` — Static content display
- `components/welcome-name/` — Simple user greeting
- `components/section/` and `components/section-tailwind/` — Layout wrappers
- `components/features/` and `components/features-tailwind/` — Feature list display

#### 3.2 Then move to interactive components:
- `components/offer-cards-tailwind/` — Offer rendering + add-to-basket interaction
- `components/cancel-survey-tailwind/` — Survey form with radio buttons and confirmation dialog
- `components/cancel-save-offer-tailwind/` — Save offer flow with confirmation

#### 3.3 Complex subscription management components (highest effort):
- `components/order-table-tailwind/` — Subscription dashboard with edit capabilities
- `components/payments-table-tailwind/` — Payment management with multiple payment provider editors
- `components/switch-subscription-tailwind/` — Subscription switching flow

---

### Priority 4: Accessibility Tests

The project already has `jest-axe` installed. Add `axe` checks to component render tests:

```js
import { axe, toHaveNoViolations } from "jest-axe"
expect.extend(toHaveNoViolations)

it("has no accessibility violations", async () => {
  const { container } = render(<Component />)
  expect(await axe(container)).toHaveNoViolations()
})
```

Focus on components with interactive elements: offer cards, cancel flows, checkout buttons.

---

## Bugs and Issues Found During Analysis

1. **`components/source/utils/offers/index.js:131`** — `getPeriodForOffer()` references an undefined `status` variable. This would cause a ReferenceError at runtime when the function is called with a non-recurring, non-external-price offer.

2. **`components/order-table-custom/helpers/index.js:19`** — `stripPathToProductName()` returns the result of `console.log()` (which is `undefined`) instead of throwing or returning an empty string when given a non-string input.

3. **Significant code duplication** — `formatCurrency`, `checkCurrentSchedule`, `checkActiveOffers`, and `filterOffers` are each duplicated across 2-4 files with slight variations. Tests would help verify consistency and enable safe consolidation.

---

## Infrastructure Fixes Needed

1. **Root `package.json`**: Add a jest configuration or fix the `test` script so `yarn test` works from the project root. Currently `jest` is not found in PATH.
2. **`component-playground/scripts/test.js`**: This CRA-style runner conflicts with `npx jest`. Consider using a standard `jest.config.js` instead.
3. **Module resolution**: Jest needs `moduleNameMapper` entries for `@limio/*` imports to point at the playground packages or mocks.
