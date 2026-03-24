import React from "react"
import { useCampaign } from "@limio/sdk"
import JsonLdSchema from "./index"
import { buildJsonLd } from "./buildJsonLd"

// Visual wrapper that shows both the invisible script tag and a readable JSON preview
const JsonLdPreview = (args) => {
  const { offers = [], addOns = [] } = useCampaign() || {}
  const jsonLd = buildJsonLd(offers, addOns, args)

  return (
    <div style={{ fontFamily: "monospace", padding: 24 }}>
      <JsonLdSchema {...args} />
      <h3 style={{ marginBottom: 8 }}>JSON-LD Output Preview</h3>
      <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>
        This is rendered as a hidden <code>&lt;script type="application/ld+json"&gt;</code> tag in the DOM.
        Below is the structured data that search engines will read.
      </p>
      <pre
        style={{
          background: "#1e1e1e",
          color: "#d4d4d4",
          padding: 20,
          borderRadius: 8,
          overflow: "auto",
          maxHeight: 600,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {JSON.stringify(jsonLd, null, 2)}
      </pre>
    </div>
  )
}

export default {
  title: "SEO/JSON-LD Schema",
  component: JsonLdPreview,
  argTypes: {
    schemaType: {
      control: "select",
      options: ["SoftwareApplication", "Product", "Service"],
    },
    applicationName: { control: "text" },
    applicationUrl: { control: "text" },
    applicationCategory: { control: "text" },
    pageDescription: { control: "text" },
    includeAddOns: { control: "boolean" },
    shopDomain: { control: "text" },
    checkoutBasePath: { control: "text" },
    utmSource: { control: "text" },
    utmMedium: { control: "text" },
    utmCampaign: { control: "text" },
  },
}

export const SoftwareApplication = {
  args: {
    schemaType: "SoftwareApplication",
    applicationName: "Emma by Marigold",
    applicationUrl: "https://myemma.com",
    applicationCategory: "BusinessApplication",
    pageDescription: "Email marketing pricing plans for teams of all sizes",
    includeAddOns: false,
  },
}

export const Product = {
  args: {
    schemaType: "Product",
    applicationName: "Emma Platform",
    applicationUrl: "https://myemma.com",
    applicationCategory: "",
    pageDescription: "Product pricing and plans",
    includeAddOns: false,
  },
}

export const WithAddOns = {
  args: {
    schemaType: "SoftwareApplication",
    applicationName: "Emma by Marigold",
    applicationUrl: "https://myemma.com",
    applicationCategory: "BusinessApplication",
    pageDescription: "Email marketing pricing plans with add-ons",
    includeAddOns: true,
  },
}

export const ServiceType = {
  args: {
    schemaType: "Service",
    applicationName: "Emma Consulting",
    applicationUrl: "https://myemma.com/consulting",
    applicationCategory: "",
    pageDescription: "Professional email marketing consulting services",
    includeAddOns: false,
  },
}

export const WithPurchaseLinks = {
  args: {
    schemaType: "SoftwareApplication",
    applicationName: "Emma by Marigold",
    applicationUrl: "https://myemma.com",
    applicationCategory: "BusinessApplication",
    pageDescription: "Email marketing pricing plans with purchase links",
    includeAddOns: true,
    shopDomain: "https://saas-dev-shop.prod.limio.com",
    checkoutBasePath: "/checkout",
    utmSource: "ai",
    utmMedium: "llm",
    utmCampaign: "limio-pricing-page",
  },
}

export const CustomUtmParams = {
  args: {
    schemaType: "SoftwareApplication",
    applicationName: "Emma by Marigold",
    applicationUrl: "https://myemma.com",
    applicationCategory: "BusinessApplication",
    pageDescription: "Custom UTM attribution example",
    includeAddOns: false,
    shopDomain: "https://myemma-shop.prod.limio.com",
    checkoutBasePath: "/checkout",
    utmSource: "google",
    utmMedium: "organic",
    utmCampaign: "emma-pricing-2026",
  },
}
