import {
  buildJsonLd,
  buildOfferSchema,
  buildPurchaseUrl,
  stripHtml,
  extractFeatureList,
  mapBillingInterval,
} from "../buildJsonLd"

// --- Helpers ---

function makeOffer(overrides = {}) {
  return {
    id: "offer-test",
    path: overrides.path || "/offers2/test-offer",
    name: "Test Offer",
    data: {
      attributes: {
        display_name__limio: "Test Plan",
        offer_features__limio: "<ul><li>Feature A</li><li>Feature B</li></ul>",
        ...overrides.attributes,
      },
      price: overrides.price !== undefined ? overrides.price : [
        {
          value: 99,
          currencyCode: "USD",
          type: "recurring",
          repeat_interval: 1,
          repeat_interval_type: "months",
        },
      ],
      attachments: overrides.attachments || [],
      products: [],
    },
  }
}

const defaultConfig = {
  schemaType: "SoftwareApplication",
  applicationName: "Test App",
  applicationUrl: "https://example.com",
  applicationCategory: "BusinessApplication",
  pageDescription: "Test page description",
  includeAddOns: false,
}

// --- Tests ---

describe("mapBillingInterval", () => {
  test.each([
    ["years", "ANN"],
    ["months", "MON"],
    ["weeks", "WK"],
    ["days", "DAY"],
  ])("%s maps to %s", (input, expected) => {
    expect(mapBillingInterval(input)).toBe(expected)
  })

  test("unknown type returns null", () => {
    expect(mapBillingInterval("unknown")).toBeNull()
  })
})

describe("stripHtml", () => {
  test("strips tags and joins li items with comma", () => {
    expect(stripHtml("<p>Hello <strong>world</strong></p>")).toBe("Hello world")
    expect(stripHtml("<ul><li>A</li><li>B</li><li>C</li></ul>")).toBe("A, B, C")
  })

  test("returns empty string for null/undefined/empty", () => {
    expect(stripHtml(null)).toBe("")
    expect(stripHtml(undefined)).toBe("")
    expect(stripHtml("")).toBe("")
  })
})

describe("extractFeatureList", () => {
  test("parses li items into ListItem entries with position", () => {
    const html = "<ul><li>Feature A</li><li><strong>Bold</strong> text</li></ul>"
    const result = extractFeatureList(html)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ "@type": "ListItem", position: 1, name: "Feature A" })
    expect(result[1]).toEqual({ "@type": "ListItem", position: 2, name: "Bold text" })
  })

  test("returns empty array for null/undefined and skips empty items", () => {
    expect(extractFeatureList(null)).toEqual([])
    const html = "<ul><li>Valid</li><li>   </li><li></li></ul>"
    expect(extractFeatureList(html)).toHaveLength(1)
  })
})

describe("buildPurchaseUrl", () => {
  test("builds full purchase URL with UTM params", () => {
    const result = buildPurchaseUrl(makeOffer(), {
      shopDomain: "https://shop.example.com",
      checkoutBasePath: "/checkout",
      utmSource: "ai",
      utmMedium: "llm",
      utmCampaign: "limio-pricing-page",
    })
    expect(result).toBe(
      "https://shop.example.com/checkout?purchase=/offers2/test-offer&utm_source=ai&utm_medium=llm&utm_campaign=limio-pricing-page"
    )
  })

  test("returns null when shopDomain empty or offer has no path", () => {
    expect(buildPurchaseUrl(makeOffer(), { shopDomain: "" })).toBeNull()
    expect(buildPurchaseUrl(makeOffer(), null)).toBeNull()
    expect(buildPurchaseUrl({ name: "No Path" }, { shopDomain: "https://shop.example.com" })).toBeNull()
  })

  test("falls back to offer.id when path is missing", () => {
    const result = buildPurchaseUrl(
      { id: "/offers2/fallback-offer", name: "Fallback" },
      { shopDomain: "https://shop.example.com", checkoutBasePath: "/checkout" }
    )
    expect(result).toBe("https://shop.example.com/checkout?purchase=/offers2/fallback-offer")
  })

  test("omits UTM params when all empty", () => {
    const result = buildPurchaseUrl(makeOffer(), {
      shopDomain: "https://shop.example.com",
      checkoutBasePath: "/checkout",
      utmSource: "", utmMedium: "", utmCampaign: "",
    })
    expect(result).not.toContain("utm_")
  })

  test("strips trailing slash from shopDomain and encodes UTM values", () => {
    const result = buildPurchaseUrl(makeOffer(), {
      shopDomain: "https://shop.example.com/",
      checkoutBasePath: "/checkout",
      utmSource: "ai bot", utmMedium: "", utmCampaign: "test&value",
    })
    expect(result).toContain("https://shop.example.com/checkout")
    expect(result).toContain("utm_source=ai%20bot")
    expect(result).toContain("utm_campaign=test%26value")
  })
})

describe("buildOfferSchema", () => {
  test("maps yearly offer with priceSpecification", () => {
    const offer = makeOffer({
      price: [{ value: 1188, currencyCode: "USD", repeat_interval: 1, repeat_interval_type: "years" }],
    })
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.price).toBe("1188.00")
    expect(result.priceCurrency).toBe("USD")
    expect(result.priceSpecification.unitCode).toBe("ANN")
    expect(result.priceSpecification.billingDuration).toEqual({ "@type": "QuantitativeValue", value: 1, unitCode: "ANN" })
  })

  test("defaults to MON priceSpecification when repeat_interval_type is missing", () => {
    const offer = makeOffer({
      price: [{ value: 24.50, currencyCode: "USD", repeat_interval: 1 }],
    })
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.price).toBe("24.50")
    expect(result.priceSpecification).toBeDefined()
    expect(result.priceSpecification.unitCode).toBe("MON")
    expect(result.priceSpecification.billingDuration).toEqual({ "@type": "QuantitativeValue", value: 1, unitCode: "MON" })
  })

  test("omits price fields when no price data", () => {
    const result = buildOfferSchema(makeOffer({ price: [] }), "Subscription")
    expect(result.price).toBeUndefined()
    expect(result.priceCurrency).toBeUndefined()
    expect(result.priceSpecification).toBeUndefined()
  })

  test("uses price__limio fallback when data.price is empty", () => {
    const offer = makeOffer({
      price: [],
      attributes: {
        display_name__limio: "Fallback Plan",
        price__limio: [{ value: 49.99, currencyCode: "EUR", repeat_interval: 1, repeat_interval_type: "months" }],
      },
    })
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.price).toBe("49.99")
    expect(result.priceCurrency).toBe("EUR")
  })

  test("maps upsell items to isRelatedTo, filtering empty names", () => {
    const offer = makeOffer({
      attributes: {
        display_name__limio: "Pro Plan",
        upsell_offers__limio: {
          items: [{ label: "" }, { label: "Enterprise Plan" }, { name: "" }],
        },
      },
    })
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.isRelatedTo).toHaveLength(1)
    expect(result.isRelatedTo[0]).toEqual({ "@type": "Offer", name: "Enterprise Plan" })
  })

  test("omits isRelatedTo when no upsell data", () => {
    expect(buildOfferSchema(makeOffer(), "Subscription").isRelatedTo).toBeUndefined()
  })

  test("maps image attachment as absolute URL", () => {
    const offer = makeOffer({ attachments: [{ type: "image", url: "https://example.com/image.png" }] })
    expect(buildOfferSchema(offer, "Subscription").image).toBe("https://example.com/image.png")
  })

  test("includes checkoutPageURLTemplate when purchaseConfig has shopDomain", () => {
    const result = buildOfferSchema(makeOffer(), "Subscription", {
      shopDomain: "https://shop.example.com",
      checkoutBasePath: "/checkout",
      utmSource: "ai", utmMedium: "llm", utmCampaign: "pricing",
    })
    expect(result.checkoutPageURLTemplate).toBe(
      "https://shop.example.com/checkout?purchase=/offers2/test-offer&utm_source=ai&utm_medium=llm&utm_campaign=pricing"
    )
    expect(result.url).toBe(result.checkoutPageURLTemplate)
  })

  test("omits checkoutPageURLTemplate when no shopDomain", () => {
    const result = buildOfferSchema(makeOffer(), "Subscription", {})
    expect(result.checkoutPageURLTemplate).toBeUndefined()
    expect(result.url).toBeUndefined()
  })
})

describe("buildJsonLd", () => {
  test("produces correct top-level WebPage structure", () => {
    const result = buildJsonLd([makeOffer()], [], defaultConfig)
    expect(result["@context"]).toBe("https://schema.org")
    expect(result["@type"]).toBe("WebPage")
    expect(result.description).toBe("Test page description")
    expect(result.mainEntity["@type"]).toBe("SoftwareApplication")
    expect(result.mainEntity.applicationCategory).toBe("BusinessApplication")
    expect(result.mainEntity.operatingSystem).toBe("Web")
  })

  test("Product and Service types omit applicationCategory and operatingSystem", () => {
    for (const schemaType of ["Product", "Service"]) {
      const result = buildJsonLd([makeOffer()], [], { ...defaultConfig, schemaType })
      expect(result.mainEntity["@type"]).toBe(schemaType)
      expect(result.mainEntity.applicationCategory).toBeUndefined()
      expect(result.mainEntity.operatingSystem).toBeUndefined()
    }
  })

  test("maps multiple offers to the offers array", () => {
    const offers = [
      makeOffer({ attributes: { display_name__limio: "Plan A" } }),
      makeOffer({ attributes: { display_name__limio: "Plan B" } }),
    ]
    const result = buildJsonLd(offers, [], defaultConfig)
    expect(result.mainEntity.offers).toHaveLength(2)
    expect(result.mainEntity.offers[0].name).toBe("Plan A")
    expect(result.mainEntity.offers[1].name).toBe("Plan B")
  })

  test("attaches add-ons via schema.org addOn property on each offer", () => {
    const addOns = [
      makeOffer({ path: "/offers2/mobile-addon", attributes: { display_name__limio: "Mobile Add-On" } }),
      makeOffer({ path: "/offers2/vr-addon", attributes: { display_name__limio: "VR Add-On" } }),
    ]
    const result = buildJsonLd([makeOffer()], addOns, { ...defaultConfig, includeAddOns: true })
    expect(result.mainEntity.offers).toHaveLength(1)
    expect(result.mainEntity.offers[0].addOn).toHaveLength(2)
    expect(result.mainEntity.offers[0].addOn[0].name).toBe("Mobile Add-On")
    expect(result.mainEntity.offers[0].addOn[0].category).toBe("Add-On")
  })

  test("add-ons excluded by default", () => {
    const result = buildJsonLd([makeOffer()], [makeOffer()], defaultConfig)
    expect(result.mainEntity.offers[0].addOn).toBeUndefined()
  })

  test("deduplicates add-ons by path", () => {
    const addOns = [
      makeOffer({ path: "/offers2/mobile", attributes: { display_name__limio: "Mobile Add-On" } }),
      makeOffer({ path: "/offers2/mobile", attributes: { display_name__limio: "Mobile Add-On" } }),
      makeOffer({ path: "/offers2/vr", attributes: { display_name__limio: "VR Add-On" } }),
    ]
    const result = buildJsonLd([makeOffer()], addOns, { ...defaultConfig, includeAddOns: true })
    expect(result.mainEntity.offers[0].addOn).toHaveLength(2)
    expect(result.mainEntity.offers[0].addOn[0].name).toBe("Mobile Add-On")
    expect(result.mainEntity.offers[0].addOn[1].name).toBe("VR Add-On")
  })

  test("add-ons do not get purchase links", () => {
    const addOns = [makeOffer({ attributes: { display_name__limio: "Mobile Add-On" } })]
    const config = { ...defaultConfig, includeAddOns: true, shopDomain: "https://shop.example.com" }
    const result = buildJsonLd([makeOffer()], addOns, config)
    expect(result.mainEntity.offers[0].checkoutPageURLTemplate).toBeDefined()
    expect(result.mainEntity.offers[0].addOn[0].checkoutPageURLTemplate).toBeUndefined()
  })

  test("includes checkoutPageURLTemplate on offers when shopDomain is set", () => {
    const config = {
      ...defaultConfig,
      shopDomain: "https://saas-dev-shop.prod.limio.com",
      utmSource: "ai", utmMedium: "llm", utmCampaign: "limio-pricing-page",
    }
    const result = buildJsonLd([makeOffer()], [], config)
    const offer = result.mainEntity.offers[0]
    expect(offer.checkoutPageURLTemplate).toContain("/offers2/test-offer")
    expect(offer.checkoutPageURLTemplate).toContain("utm_source=ai")
    expect(offer.url).toBe(offer.checkoutPageURLTemplate)
  })

  test("omits checkoutPageURLTemplate when shopDomain not configured", () => {
    const result = buildJsonLd([makeOffer()], [], defaultConfig)
    expect(result.mainEntity.offers[0].checkoutPageURLTemplate).toBeUndefined()
  })

  test("handles empty/null offers gracefully", () => {
    expect(buildJsonLd([], [], defaultConfig).mainEntity.offers).toHaveLength(0)
    expect(buildJsonLd(null, null, defaultConfig).mainEntity.offers).toHaveLength(0)
  })
})
