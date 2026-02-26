import React from "react"
import PricingHero from "./pricing-hero/index"
import PricingCards from "./pricing-cards/index"
import ComparisonTable from "./comparison-table/index"
import FAQAccordion from "./faq-accordion/index"
import CTABanner from "./cta-banner/index"

export default {
  title: "Full Page/Pricing Page",
  parameters: {
    layout: "fullscreen",
  },
}

export const Complete = {
  render: () => (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <PricingHero />
      <PricingCards />
      <ComparisonTable />
      <FAQAccordion />
      <CTABanner />
    </div>
  ),
}
