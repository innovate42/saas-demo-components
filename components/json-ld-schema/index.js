import React from "react"
import { useCampaign } from "@limio/sdk"
import { buildJsonLd } from "./buildJsonLd"

function JsonLdSchema({
  schemaType = "SoftwareApplication",
  applicationName = "",
  applicationUrl = "",
  applicationCategory = "BusinessApplication",
  pageDescription = "",
  includeAddOns = false,
}) {
  const { offers = [], addOns = [] } = useCampaign() || {}

  if (!offers.length) return null

  const jsonLd = buildJsonLd(offers, addOns, {
    schemaType,
    applicationName,
    applicationUrl,
    applicationCategory,
    pageDescription,
    includeAddOns,
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default JsonLdSchema
