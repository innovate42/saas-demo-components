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
 * Build the checkout purchase URL for an offer with optional UTM tracking.
 * Uses Limio purchase link format: /checkout?purchase=/offers2/offerName
 * @param {object} offer - Limio offer object
 * @param {object} purchaseConfig - Purchase link configuration
 * @returns {string|null} Full checkout URL or null if not enough data
 */
export function buildPurchaseUrl(offer, purchaseConfig) {
  const { shopDomain = "", checkoutBasePath = "/checkout", utmSource = "", utmMedium = "", utmCampaign = "" } = purchaseConfig || {}

  if (!shopDomain) return null

  // Derive offer path from offer.path (Limio standard) or offer.id
  const offerPath = offer?.path || offer?.id
  if (!offerPath) return null

  const baseUrl = shopDomain.replace(/\/+$/, "")
  const checkoutPath = checkoutBasePath.startsWith("/") ? checkoutBasePath : "/" + checkoutBasePath

  let url = `${baseUrl}${checkoutPath}?purchase=${offerPath}`

  // Append UTM parameters if any are set
  const utmParams = []
  if (utmSource) utmParams.push(`utm_source=${encodeURIComponent(utmSource)}`)
  if (utmMedium) utmParams.push(`utm_medium=${encodeURIComponent(utmMedium)}`)
  if (utmCampaign) utmParams.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`)

  if (utmParams.length > 0) {
    url += "&" + utmParams.join("&")
  }

  return url
}

/**
 * Map a single Limio offer to a schema.org Offer object.
 * @param {object} offer - Limio offer object
 * @param {string} category - "Subscription" or "Add-On"
 * @param {object} purchaseConfig - Purchase link configuration for checkoutPageURLTemplate
 */
export function buildOfferSchema(offer, category, purchaseConfig) {
  const attrs = offer?.data?.attributes || {}
  // Price lives at offer.data.price[0] in mock SDK but at
  // offer.data.attributes.price__limio[0] in real Limio tenants — try both
  const priceData = offer?.data?.price?.[0] || attrs.price__limio?.[0]
  const imageUrl = offer?.data?.attachments?.[0]?.url

  const schema = {
    "@type": "Offer",
    name: attrs.display_name__limio || offer?.name || "",
    category: category || "Subscription",
  }

  // Only include description if non-empty
  const desc = stripHtml(attrs.checkout_description__limio || attrs.offer_features__limio)
  if (desc) {
    schema.description = desc
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

  // Purchase / checkout link with UTM tracking
  const purchaseUrl = buildPurchaseUrl(offer, purchaseConfig)
  if (purchaseUrl) {
    schema.url = purchaseUrl
    schema.checkoutPageURLTemplate = purchaseUrl
  }

  // Upsell offers → isRelatedTo (filter out entries with empty names)
  const upsellItems = attrs.upsell_offers__limio?.items
  if (upsellItems && upsellItems.length > 0) {
    const validUpsells = upsellItems
      .filter((item) => item.label || item.name)
      .map((item) => ({
        "@type": "Offer",
        name: item.label || item.name,
      }))
    if (validUpsells.length > 0) {
      schema.isRelatedTo = validUpsells
    }
  }

  // Image attachment — ensure absolute URL
  if (imageUrl) {
    if (imageUrl.startsWith("http")) {
      schema.image = imageUrl
    } else if (typeof window !== "undefined" && window.location?.origin) {
      schema.image = window.location.origin + imageUrl
    }
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
    shopDomain = "",
    checkoutBasePath = "/checkout",
    utmSource = "ai",
    utmMedium = "llm",
    utmCampaign = "limio-pricing-page",
  } = config || {}

  const purchaseConfig = { shopDomain, checkoutBasePath, utmSource, utmMedium, utmCampaign }

  const mappedOffers = (offers || []).map((offer) => buildOfferSchema(offer, "Subscription", purchaseConfig))

  // Add-ons use schema.org's addOn property on each subscription offer
  // rather than being listed as separate top-level offers
  if (includeAddOns && addOns?.length) {
    const mappedAddOns = addOns.map((addOn) => buildOfferSchema(addOn, "Add-On", purchaseConfig))
    mappedOffers.forEach((offer) => {
      offer.addOn = mappedAddOns
    })
  }

  const allOffers = mappedOffers

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
