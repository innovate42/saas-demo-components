// Mock for @limio/sdk used in Storybook
// Aligned to Limio Component Skill v5.0.0

import React from "react"

// Mutable config object — stories can set overrides via this
export const __mockConfig = {
  propsOverride: null,
  offersOverride: null,
  userOverride: null,
  subscriptionsOverride: null,
  contextOverride: null,
}

// --- Props ---

export function getPropsFromPackageJson(packageData) {
  const props = {}
  if (packageData && packageData.limioProps) {
    packageData.limioProps.forEach((prop) => {
      if (prop.type === "list" && prop.fields) {
        props[prop.id] = prop.default || []
      } else {
        props[prop.id] = prop.default
      }
    })
  }
  return props
}

export function useComponentProps(defaultProps) {
  if (__mockConfig.propsOverride) {
    return { ...defaultProps, ...__mockConfig.propsOverride }
  }
  return defaultProps
}

// --- Campaign / Offers ---

const sampleOffers = [
  {
    id: "offer-lite",
    path: "/offers/lite",
    data: {
      attributes: {
        display_name__limio: "Lite",
        display_description__limio: "Marketers who need to nail the basics.",
        display_price__limio: "<span class='price-currency'>$</span><span class='price-amount'>99</span><span class='price-period'>/month</span>",
        detailed_display_price__limio: "<p><strong>10,000 contacts</strong><br/>with annual contract</p>",
        offer_features__limio: "<p class='features-heading'>Lite includes:</p><ul><li>Drag and drop editor</li><li>Built-in integrations</li><li>Email and phone support</li></ul>",
        cta_text__limio: "Request a demo",
        best_value__limio: false,
        group__limio: "monthly",
      },
      price: [{ value: 99, currencyCode: "USD", type: "recurring", trigger: "subscription_start", repeat_interval: 1, repeat_interval_type: "months" }],
      products: [],
      attachments: [],
    },
  },
  {
    id: "offer-essentials",
    path: "/offers/essentials",
    data: {
      attributes: {
        display_name__limio: "Essentials",
        display_description__limio: "Growing brands who need more customization and automation.",
        display_price__limio: "<span class='price-currency'>$</span><span class='price-amount'>159</span><span class='price-period'>/month</span>",
        detailed_display_price__limio: "<p><strong>10,000 contacts</strong><br/>with annual contract</p>",
        offer_features__limio: "<p class='features-heading'>Everything in Lite, plus:</p><ul><li>Landing pages</li><li>Unlimited automation</li><li>SMS*</li></ul>",
        cta_text__limio: "Request a demo",
        best_value__limio: false,
        group__limio: "monthly",
      },
      price: [{ value: 159, currencyCode: "USD", type: "recurring", trigger: "subscription_start", repeat_interval: 1, repeat_interval_type: "months" }],
      products: [],
      attachments: [],
    },
  },
  {
    id: "offer-teams",
    path: "/offers/teams",
    data: {
      attributes: {
        display_name__limio: "Teams",
        display_description__limio: "Teams with multiple departments or locations who need to manage marketing activity from one central account.",
        display_price__limio: "<span class='price-currency'>$</span><span class='price-amount'>249</span><span class='price-period'>/month</span>",
        detailed_display_price__limio: "<p><strong>10,000 contacts</strong><br/>with annual contract</p>",
        offer_features__limio: "<p class='features-heading'>Everything in Essentials, plus:</p><ul><li>Tiered account structure</li><li>Custom user permissions</li><li>Brand Manager</li><li>Trend reporting</li><li>Share branded assets between subaccounts</li><li>SMS</li></ul>",
        cta_text__limio: "Request a demo",
        best_value__limio: false,
        group__limio: "monthly",
      },
      price: [{ value: 249, currencyCode: "USD", type: "recurring", trigger: "subscription_start", repeat_interval: 1, repeat_interval_type: "months" }],
      products: [],
      attachments: [],
    },
  },
  {
    id: "offer-corporate",
    path: "/offers/corporate",
    data: {
      attributes: {
        display_name__limio: "Corporate",
        display_description__limio: "Larger organizations who need to scale and control their marketing efficiently and seamlessly.",
        display_price__limio: "Contact us",
        detailed_display_price__limio: "<p>Build a plan to match your organization's structure.</p>",
        offer_features__limio: "<p class='features-heading'>Everything in Teams, plus:</p><ul><li>10+ subaccounts</li><li>Unlimited users</li><li>Priority phone support</li><li>Share audiences between subaccounts</li><li>SMS</li></ul>",
        cta_text__limio: "Let's talk",
        best_value__limio: true,
        group__limio: "monthly",
      },
      price: [],
      products: [],
      attachments: [],
    },
  },
]

export function useCampaign() {
  return {
    offers: __mockConfig.offersOverride || sampleOffers,
    campaign: { name: "Emma Pricing", path: "/pages/emma-pricing", attributes: {} },
    addOns: [],
    tag: "/tags/dummytag",
    groupValues: [{ label: "Monthly", id: "monthly" }],
  }
}

// --- Basket ---

export function useBasket() {
  return {
    orderItems: [],
    basketLoading: false,
    formattedTotal: "$0.00",
    pageOptions: { pushToCheckout: true },
    expiresAt: null,
    initiateCheckout: async ({ order }) => {
      const name = order?.orderItems?.[0]?.offer?.data?.attributes?.display_name__limio || "offer"
      console.log("[Storybook] initiateCheckout:", name)
    },
    addOfferToBasket: async ({ offer }) => {
      const name = offer?.data?.attributes?.display_name__limio || "offer"
      console.log("[Storybook] addOfferToBasket:", name)
    },
    removeFromBasket: async ({ id }) => {
      console.log("[Storybook] removeFromBasket:", id)
    },
    updateItemQuantity: async (itemId, quantity) => {
      console.log("[Storybook] updateItemQuantity:", itemId, quantity)
    },
    swapOffer: async (itemId, offer) => {
      console.log("[Storybook] swapOffer:", itemId)
    },
    clearOrderItems: async () => {
      console.log("[Storybook] clearOrderItems")
    },
    navigateToCheckout: async () => {
      console.log("[Storybook] navigateToCheckout")
    },
    redeemPromoCode: async (code) => {
      console.log("[Storybook] redeemPromoCode:", code)
    },
    removePromoCode: async (code) => {
      console.log("[Storybook] removePromoCode:", code)
    },
    updateCustomField: async (field, value) => {
      console.log("[Storybook] updateCustomField:", field, value)
    },
    setCheckoutDisabled: (disabled) => {
      console.log("[Storybook] setCheckoutDisabled:", disabled)
    },
    validateBasket: async () => {
      console.log("[Storybook] validateBasket")
      return true
    },
    updateBasketDetails: async (details) => {
      console.log("[Storybook] updateBasketDetails:", details)
    },
    selectOfferForSubscriptionUpdate: async (offer) => {
      console.log("[Storybook] selectOfferForSubscriptionUpdate")
    },
  }
}

// --- User ---

export function useUser() {
  if (__mockConfig.userOverride) return __mockConfig.userOverride
  return {
    attributes: {
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      sub: "user-123",
    },
    subscriptions: [],
    loginStatus: "logged-in",
    loaded: true,
    token: "mock-token",
  }
}

// --- Subscriptions ---

export function useSubscriptions() {
  if (__mockConfig.subscriptionsOverride) return __mockConfig.subscriptionsOverride
  return { subscriptions: [] }
}

export function useSubInfo(subscription) {
  return {
    status: subscription?.status || "active",
    isGift: false,
    quantity: 1,
    hasLapsed: false,
    hasPendingChange: false,
  }
}

export function useSchedule(subscription) {
  return {
    nextPaymentAmount: "$9.99",
    renewalPrice: "$9.99",
    termStartDate: "1 Jan 2025",
    termEndDate: "1 Jan 2026",
  }
}

// --- Context ---

export function useLimioContext() {
  if (__mockConfig.contextOverride) return __mockConfig.contextOverride
  return { isInPageBuilder: false }
}

// --- Checkout ---

export function useCheckout({ redirectOnFailure } = {}) {
  return {
    useCheckoutSelector: (selector) => {
      const state = {
        order: { orderItems: [] },
        paidSchedule: [],
        schedule: [],
        locale: "en",
        display: {
          orderTotal: {
            orderSubtotal: "$0.00",
            orderTotal: "$0.00",
            currency: "USD",
            taxSummary: [],
          },
        },
      }
      return selector ? selector(state) : state
    },
  }
}

export function usePreview() {
  return {
    loadingPreview: false,
    isTaxPreviewCountry: false,
    taxCalculated: false,
  }
}

// --- Utilities ---

export function sanitiseHTML(html) {
  return html || ""
}

export function formatDate(dateStr, format) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  } catch {
    return dateStr || ""
  }
}

export function formatCurrency(amount, currencyCode) {
  const symbols = { USD: "$", GBP: "\u00A3", EUR: "\u20AC" }
  const symbol = symbols[currencyCode] || currencyCode
  return `${symbol}${amount}`
}

export function formatCurrencyForCurrentLocale(amount, currencyCode) {
  return formatCurrency(amount, currencyCode)
}

export function formatDisplayPrice(template, priceArray) {
  if (!priceArray?.length) return template || ""
  const price = priceArray[0]
  return template
    .replace("{{amount}}", price.value)
    .replace("{{currencyCode}}", price.currencyCode)
    .replace("{{currencySymbol}}", formatCurrency("", price.currencyCode))
}

export function groupOffers(offers, groupLabels = []) {
  const groups = {}
  ;(offers || []).forEach((offer) => {
    const groupId = offer?.data?.attributes?.group__limio || "other"
    if (!groups[groupId]) {
      const label = groupLabels.find((g) => g.id === groupId)
      groups[groupId] = {
        groupId,
        id: groupId,
        label: label?.label || groupId,
        offers: [],
        thumbnail: label?.thumbnail || "",
      }
    }
    groups[groupId].offers.push(offer)
  })
  return Object.values(groups)
}

export function useOfferInfo(offer) {
  const attrs = offer?.data?.attributes || {}
  return {
    allowMultibuy: attrs.allow_multibuy__limio || false,
    offerDescription: attrs.display_description__limio || "",
    hasRecurringCharge: offer?.data?.price?.some((p) => p.type === "recurring") || false,
    isDelivery: false,
    productNames: (offer?.data?.products || []).map((p) => p.name),
    isAutoRenew: attrs.autoRenew__limio || false,
    offerImage: offer?.data?.attachments?.find((a) => a.type === "image")?.url || null,
    usesExternalPrice: false,
    isGift: false,
    displayName: attrs.display_name__limio || offer?.name || "",
  }
}

export function checkActiveOffers(offers, includeDiscounts = false) {
  if (!Array.isArray(offers)) return []
  const now = new Date()
  return offers.filter((o) => {
    const start = o?.data?.start ? new Date(o.data.start) : null
    const end = o?.data?.end ? new Date(o.data.end) : null
    if (!includeDiscounts && o?.data?.record_subtype === "discount") return false
    if (start && start > now) return false
    if (end && end < now) return false
    return true
  })
}

export function getCurrentOffer(subscription) {
  const offers = subscription?.offers || []
  const active = checkActiveOffers(offers, false)
  return active[0]?.data?.offer || null
}

export function getPeriodForOffer(offer) {
  const price = offer?.data?.price?.[0]
  if (!price) return "N/A"
  const interval = price.repeat_interval || 1
  const type = price.repeat_interval_type || "months"
  return `${interval} ${type.replace(/s$/, "")}`
}

// --- Components / Providers ---

export const LimioProvider = ({ children }) => children

export const ComponentContext = React.createContext({})

export const ErrorBoundary = ({ children, ErrorUI }) => {
  // Simple passthrough in Storybook — no error catching
  return children
}

export function withErrorBoundary(Component, ErrorUI) {
  return (props) => (
    <ErrorBoundary ErrorUI={ErrorUI}>
      <Component {...props} />
    </ErrorBoundary>
  )
}

// --- Address Utilities ---

export function addressSummary(address) {
  if (!address) return "N/A"
  const parts = [address.line1, address.city, address.state, address.postalCode, address.country]
  return parts.filter(Boolean).join(", ") || "N/A"
}

export function formatCountry(code) {
  const countries = { US: "United States", GB: "United Kingdom", DE: "Germany", FR: "France" }
  return countries[code] || code
}

// --- DateTime (Luxon stub) ---

export const DateTime = {
  fromISO: (iso) => ({
    toLocaleString: () => new Date(iso).toLocaleDateString(),
    toFormat: (fmt) => new Date(iso).toLocaleDateString(),
  }),
  now: () => ({
    toISO: () => new Date().toISOString(),
    toLocaleString: () => new Date().toLocaleDateString(),
  }),
}

// --- App Settings ---

export const LimioAppSettings = {
  getDateFormat: () => "DATE_FULL",
}
