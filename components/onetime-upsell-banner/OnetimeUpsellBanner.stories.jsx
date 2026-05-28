import React from "react"
import OnetimeUpsellBanner from "./index"
import { __mockConfig } from "@limio/sdk"

// --- Fixture helpers ----------------------------------------------------

const makeOneTimeSub = (id, productName) => ({
  id,
  status: "active",
  record_type: "subscription",
  name: productName,
  offers: [
    {
      name: productName,
      quantity: 1,
      data: {
        record_subtype: "base",
        offer: {
          data: {
            attributes: {
              display_name__limio: productName,
              price__limio: [{ type: "onetime", value: "99.00", currencyCode: "USD" }],
              autoRenew__limio: false,
            },
          },
        },
      },
    },
  ],
})

const makeRecurringSub = (id, productName) => ({
  id,
  status: "active",
  record_type: "subscription",
  name: productName,
  offers: [
    {
      name: productName,
      quantity: 1,
      data: {
        record_subtype: "base",
        offer: {
          data: {
            attributes: {
              display_name__limio: productName,
              price__limio: [{ type: "recurring", value: "20.00", currencyCode: "USD" }],
              autoRenew__limio: true,
              term__limio: { type: "months", length: 1, renewal_trigger: "auto" },
            },
          },
        },
      },
    },
  ],
})

// --- Reset & control helpers --------------------------------------------

const resetMocks = () => {
  __mockConfig.propsOverride = null
  __mockConfig.subscriptionsOverride = null
  __mockConfig.contextOverride = null
  __mockConfig.userOverride = null
}

const applyProps = (args) => {
  __mockConfig.propsOverride = {
    headingTemplate: args.headingTemplate,
    subheading__limio_richtext: args.subheading,
    ctaLabel: args.ctaLabel,
    learnMoreUrl: args.learnMoreUrl,
    themeColor: args.themeColor,
    minCourses: args.minCourses,
  }
}

// --- Story config -------------------------------------------------------

export default {
  title: "Components/OnetimeUpsellBanner",
  component: OnetimeUpsellBanner,
  parameters: { layout: "padded" },
  argTypes: {
    themeColor: {
      control: { type: "select" },
      options: ["orange", "blue", "red", "green", "black", "grey"],
    },
    minCourses: { control: { type: "number", min: 1, max: 10 } },
  },
  args: {
    headingTemplate: "You have {count} courses so far. You could save money by buying a subscription.",
    subheading: "<p>Switch to a subscription and get unlimited access to every course.</p>",
    ctaLabel: "Learn more",
    learnMoreUrl: "/subscribe",
    themeColor: "orange",
    minCourses: 1,
  },
}

// 1. Only one-time purchases — banner renders with count interpolated.
export const OneTimeOnly = {
  render: (args) => {
    resetMocks()
    applyProps(args)
    __mockConfig.subscriptionsOverride = {
      subscriptions: [
        makeOneTimeSub("sub-1", "Intro to React"),
        makeOneTimeSub("sub-2", "Advanced TypeScript"),
        makeOneTimeSub("sub-3", "System Design 101"),
      ],
    }
    return <OnetimeUpsellBanner />
  },
}

// 2. Has at least one recurring subscription — banner hides (returns null).
export const MixedWithRecurring = {
  render: (args) => {
    resetMocks()
    applyProps(args)
    __mockConfig.subscriptionsOverride = {
      subscriptions: [
        makeOneTimeSub("sub-1", "Intro to React"),
        makeOneTimeSub("sub-2", "Advanced TypeScript"),
        makeRecurringSub("sub-3", "Pro Plan"),
      ],
    }
    return (
      <div>
        <p style={{ fontFamily: "Inter, sans-serif", color: "#666", marginBottom: 12 }}>
          (Banner is intentionally hidden — user already has a recurring subscription.)
        </p>
        <OnetimeUpsellBanner />
      </div>
    )
  },
}

// 3. Page Builder preview — banner always renders so editors can style it.
export const InPageBuilder = {
  render: (args) => {
    resetMocks()
    applyProps(args)
    __mockConfig.contextOverride = { isInPageBuilder: true }
    __mockConfig.subscriptionsOverride = { subscriptions: [] }
    return <OnetimeUpsellBanner />
  },
}

// 4. Below threshold — banner hides when fewer purchases than minCourses.
export const BelowThreshold = {
  args: {
    minCourses: 3,
  },
  render: (args) => {
    resetMocks()
    applyProps(args)
    __mockConfig.subscriptionsOverride = {
      subscriptions: [makeOneTimeSub("sub-1", "Intro to React")],
    }
    return (
      <div>
        <p style={{ fontFamily: "Inter, sans-serif", color: "#666", marginBottom: 12 }}>
          (Banner hidden — 1 purchase &lt; minCourses=3.)
        </p>
        <OnetimeUpsellBanner />
      </div>
    )
  },
}
