/**
 * Pure logic module — maps Limio offer data to JSON-LD schema.org structured data.
 * No React imports, no browser APIs (regex-based HTML parsing for SSR compatibility).
 */

/**
 * Strip HTML tags from a string. Replaces </li><li> boundaries with ", " first
 * so list items are joined cleanly.
 */
export function stripHtml(html) {
  if (!html) return ""
  return html
    .replace(/<\/li>\s*<li[^>]*>/gi, ", ")
    .replace(/<[^>]*>/g, "")
    .trim()
}

/**
 * Map Limio repeat_interval_type to UN/CEFACT unit codes.
 */
export function mapBillingInterval(type) {
  const map = {
    years: "ANN",
    months: "MON",
    weeks: "WK",
    days: "DAY",
  }
  return map[type] || null
}

/**
 * Extract individual features from offer_features__limio HTML.
 * Parses each <li> into an OfferCatalog entry for search engine indexing.
 */
export function extractFeatureList(html) {
  if (!html) return []
  const liRegex = /<li[^>]*>(.*?)<\/li>/gi
  const features = []
  let match
  while ((match = liRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, "").trim()
    if (text) {
      features.push({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: text },
      })
    }
  }
  return features
}

/**
 * Map a single Limio offer to a schema.org Offer object.
 * @param {object} offer - Limio offer object
 * @param {string} category - "Subscription" or "Add-On"
 */
export function buildOfferSchema(offer, category) {
  const attrs = offer?.data?.attributes || {}
  const priceData = offer?.data?.price?.[0]
  const imageUrl = offer?.data?.attachments?.[0]?.url

  const schema = {
    "@type": "Offer",
    name: attrs.display_name__limio || offer?.name || "",
    description: stripHtml(attrs.checkout_description__limio || attrs.offer_features__limio),
    category: category || "Subscription",
  }

  // Price fields — omit entirely for "contact sales" offers with no price
  if (priceData && priceData.value != null) {
    schema.price = parseFloat(priceData.value).toFixed(2)
    schema.priceCurrency = priceData.currencyCode

    const unitCode = mapBillingInterval(priceData.repeat_interval_type)
    if (unitCode) {
      schema.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price: schema.price,
        priceCurrency: priceData.currencyCode,
        unitCode: unitCode,
        billingDuration: {
          "@type": "QuantitativeValue",
          value: priceData.repeat_interval || 1,
          unitCode: unitCode,
        },
      }
    }
  }

  // Upsell offers → isRelatedTo
  const upsellItems = attrs.upsell_offers__limio?.items
  if (upsellItems && upsellItems.length > 0) {
    schema.isRelatedTo = upsellItems.map((item) => ({
      "@type": "Offer",
      name: item.label || item.name || "",
    }))
  }

  // Image attachment
  if (imageUrl) {
    schema.image = imageUrl
  }

  // Features as itemOffered Service with OfferCatalog
  const featuresHtml = attrs.offer_features__limio
  if (featuresHtml) {
    const featureList = extractFeatureList(featuresHtml)
    const itemOffered = {
      "@type": "Service",
      name: attrs.display_name__limio || offer?.name || "",
      description: stripHtml(featuresHtml),
    }
    if (featureList.length > 0) {
      itemOffered.hasOfferCatalog = {
        "@type": "OfferCatalog",
        name: "Features",
        itemListElement: featureList,
      }
    }
    schema.itemOffered = itemOffered
  }

  return schema
}

/**
 * Build the full JSON-LD schema.org structured data from Limio offers.
 * @param {Array} offers - Array of Limio offer objects from useCampaign()
 * @param {Array} addOns - Array of Limio add-on offer objects from useCampaign()
 * @param {object} config - Configuration from limioProps
 */
export function buildJsonLd(offers, addOns, config) {
  const {
    schemaType = "SoftwareApplication",
    applicationName = "",
    applicationUrl = "",
    applicationCategory = "BusinessApplication",
    pageDescription = "",
    includeAddOns = false,
  } = config || {}

  const mappedOffers = (offers || []).map((offer) => buildOfferSchema(offer, "Subscription"))

  const mappedAddOns =
    includeAddOns && addOns?.length
      ? addOns.map((addOn) => buildOfferSchema(addOn, "Add-On"))
      : []

  const allOffers = [...mappedOffers, ...mappedAddOns]

  const mainEntity = {
    "@type": schemaType,
    name: applicationName,
    url: applicationUrl,
    offers: allOffers,
  }

  // SoftwareApplication-specific fields
  if (schemaType === "SoftwareApplication") {
    mainEntity.applicationCategory = applicationCategory
    mainEntity.operatingSystem = "Web"
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    description: pageDescription,
    mainEntity: mainEntity,
  }

  // Add current URL if available (SSR-safe)
  if (typeof window !== "undefined" && window.location?.href) {
    jsonLd.url = window.location.href
  }

  return jsonLd
}

export default buildJsonLd
