import React from "react"
import { useCampaign } from "@limio/sdk"
import { buildJsonLd } from "./buildJsonLd"

function JsonLdSchema({
  schemaType = "SoftwareApplication",
  applicationName = "",
  applicationUrl = "",
  applicationCategory = "BusinessApplication",
  pageDescription = "",
  offerDetailsField = "offer_features__limio",
  includeAddOns = false,
  shopDomain = "",
  checkoutBasePath = "/checkout",
  utmSource = "ai",
  utmMedium = "llm",
  utmCampaign = "limio-pricing-page",
}) {
  const { offers = [], addOns = [] } = useCampaign() || {}

  if (!offers.length) return null

  const jsonLd = buildJsonLd(offers, addOns, {
    schemaType,
    applicationName,
    applicationUrl,
    applicationCategory,
    pageDescription,
    offerDetailsField,
    includeAddOns,
    shopDomain,
    checkoutBasePath,
    utmSource,
    utmMedium,
    utmCampaign,
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default JsonLdSchema
