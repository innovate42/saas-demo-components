import {
  buildJsonLd,
  buildOfferSchema,
  stripHtml,
  extractFeatureList,
  mapBillingInterval,
} from "../buildJsonLd"

// --- Helpers ---

function makeOffer(overrides = {}) {
  return {
    id: "offer-test",
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
  test("1. Annual pricing — years maps to ANN", () => {
    expect(mapBillingInterval("years")).toBe("ANN")
  })

  test("2. Monthly pricing — months maps to MON", () => {
    expect(mapBillingInterval("months")).toBe("MON")
  })

  test("weeks maps to WK", () => {
    expect(mapBillingInterval("weeks")).toBe("WK")
  })

  test("days maps to DAY", () => {
    expect(mapBillingInterval("days")).toBe("DAY")
  })

  test("unknown type returns null", () => {
    expect(mapBillingInterval("unknown")).toBeNull()
  })
})

describe("stripHtml", () => {
  test("strips all HTML tags", () => {
    expect(stripHtml("<p>Hello <strong>world</strong></p>")).toBe("Hello world")
  })

  test("joins li items with comma separator", () => {
    expect(stripHtml("<ul><li>A</li><li>B</li><li>C</li></ul>")).toBe("A, B, C")
  })

  test("returns empty string for null/undefined", () => {
    expect(stripHtml(null)).toBe("")
    expect(stripHtml(undefined)).toBe("")
    expect(stripHtml("")).toBe("")
  })
})

describe("extractFeatureList", () => {
  test("4. Feature extraction — parses li items into OfferCatalog entries", () => {
    const html = "<ul><li>Feature A</li><li>Feature B</li></ul>"
    const result = extractFeatureList(html)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "Feature A" },
    })
    expect(result[1]).toEqual({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "Feature B" },
    })
  })

  test("5. Nested HTML in features — strips inner tags to plain text", () => {
    const html = "<ul><li><strong>Bold</strong> text</li><li>Normal</li></ul>"
    const result = extractFeatureList(html)
    expect(result[0].itemOffered.name).toBe("Bold text")
    expect(result[1].itemOffered.name).toBe("Normal")
  })

  test("6. Empty features — returns empty array for null/undefined", () => {
    expect(extractFeatureList(null)).toEqual([])
    expect(extractFeatureList(undefined)).toEqual([])
    expect(extractFeatureList("")).toEqual([])
  })

  test("skips empty li items", () => {
    const html = "<ul><li>Valid</li><li>   </li><li></li></ul>"
    const result = extractFeatureList(html)
    expect(result).toHaveLength(1)
    expect(result[0].itemOffered.name).toBe("Valid")
  })
})

describe("buildOfferSchema", () => {
  test("1. Annual pricing — maps yearly offer correctly", () => {
    const offer = makeOffer({
      price: [{ value: 1188, currencyCode: "USD", repeat_interval: 1, repeat_interval_type: "years" }],
    })
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.price).toBe("1188.00")
    expect(result.priceCurrency).toBe("USD")
    expect(result.priceSpecification.unitCode).toBe("ANN")
    expect(result.priceSpecification.billingDuration.value).toBe(1)
    expect(result.priceSpecification.billingDuration.unitCode).toBe("ANN")
  })

  test("2. Monthly pricing — maps monthly offer correctly", () => {
    const offer = makeOffer({
      price: [{ value: 99, currencyCode: "USD", repeat_interval: 1, repeat_interval_type: "months" }],
    })
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.price).toBe("99.00")
    expect(result.priceSpecification.unitCode).toBe("MON")
  })

  test("3. No price — omits price fields entirely", () => {
    const offer = makeOffer({ price: [] })
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.price).toBeUndefined()
    expect(result.priceCurrency).toBeUndefined()
    expect(result.priceSpecification).toBeUndefined()
  })

  test("7. Upsell mapping — maps upsell items to isRelatedTo", () => {
    const offer = makeOffer({
      attributes: {
        display_name__limio: "Pro Plan",
        upsell_offers__limio: {
          items: [
            { label: "Enterprise Plan" },
            { label: "Premium Plan" },
          ],
        },
      },
    })
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.isRelatedTo).toHaveLength(2)
    expect(result.isRelatedTo[0]).toEqual({ "@type": "Offer", name: "Enterprise Plan" })
    expect(result.isRelatedTo[1]).toEqual({ "@type": "Offer", name: "Premium Plan" })
  })

  test("8. No upsells — omits isRelatedTo when no upsell data", () => {
    const offer = makeOffer()
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.isRelatedTo).toBeUndefined()
  })

  test("12. Image attachment — maps attachments[0].url to image", () => {
    const offer = makeOffer({
      attachments: [{ type: "image", url: "https://example.com/image.png" }],
    })
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.image).toBe("https://example.com/image.png")
  })

  test("no image when attachments empty", () => {
    const offer = makeOffer({ attachments: [] })
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.image).toBeUndefined()
  })

  test("falls back to offer.name when display_name__limio missing", () => {
    const offer = makeOffer({ attributes: { display_name__limio: undefined } })
    offer.name = "Fallback Name"
    const result = buildOfferSchema(offer, "Subscription")
    expect(result.name).toBe("Fallback Name")
  })
})

describe("buildJsonLd", () => {
  test("produces correct top-level WebPage structure", () => {
    const offers = [makeOffer()]
    const result = buildJsonLd(offers, [], defaultConfig)
    expect(result["@context"]).toBe("https://schema.org")
    expect(result["@type"]).toBe("WebPage")
    expect(result.description).toBe("Test page description")
    expect(result.mainEntity["@type"]).toBe("SoftwareApplication")
    expect(result.mainEntity.name).toBe("Test App")
    expect(result.mainEntity.url).toBe("https://example.com")
  })

  test("SoftwareApplication includes applicationCategory and operatingSystem", () => {
    const result = buildJsonLd([makeOffer()], [], defaultConfig)
    expect(result.mainEntity.applicationCategory).toBe("BusinessApplication")
    expect(result.mainEntity.operatingSystem).toBe("Web")
  })

  test("10. Schema type variants — Product omits applicationCategory and operatingSystem", () => {
    const config = { ...defaultConfig, schemaType: "Product" }
    const result = buildJsonLd([makeOffer()], [], config)
    expect(result.mainEntity["@type"]).toBe("Product")
    expect(result.mainEntity.applicationCategory).toBeUndefined()
    expect(result.mainEntity.operatingSystem).toBeUndefined()
  })

  test("10b. Schema type variants — Service omits applicationCategory and operatingSystem", () => {
    const config = { ...defaultConfig, schemaType: "Service" }
    const result = buildJsonLd([makeOffer()], [], config)
    expect(result.mainEntity["@type"]).toBe("Service")
    expect(result.mainEntity.applicationCategory).toBeUndefined()
    expect(result.mainEntity.operatingSystem).toBeUndefined()
  })

  test("11. Multiple offers — maps all offers to the offers array", () => {
    const offers = [
      makeOffer({ attributes: { display_name__limio: "Plan A" } }),
      makeOffer({ attributes: { display_name__limio: "Plan B" } }),
      makeOffer({ attributes: { display_name__limio: "Plan C" } }),
    ]
    const result = buildJsonLd(offers, [], defaultConfig)
    expect(result.mainEntity.offers).toHaveLength(3)
    expect(result.mainEntity.offers[0].name).toBe("Plan A")
    expect(result.mainEntity.offers[1].name).toBe("Plan B")
    expect(result.mainEntity.offers[2].name).toBe("Plan C")
  })

  test("9. Add-ons included — appends add-ons with category Add-On when enabled", () => {
    const offers = [makeOffer()]
    const addOns = [
      makeOffer({ attributes: { display_name__limio: "Mobile Add-On" } }),
      makeOffer({ attributes: { display_name__limio: "VR Add-On" } }),
    ]
    const config = { ...defaultConfig, includeAddOns: true }
    const result = buildJsonLd(offers, addOns, config)
    expect(result.mainEntity.offers).toHaveLength(3)
    expect(result.mainEntity.offers[1].name).toBe("Mobile Add-On")
    expect(result.mainEntity.offers[1].category).toBe("Add-On")
    expect(result.mainEntity.offers[2].name).toBe("VR Add-On")
    expect(result.mainEntity.offers[2].category).toBe("Add-On")
  })

  test("add-ons excluded by default", () => {
    const offers = [makeOffer()]
    const addOns = [makeOffer({ attributes: { display_name__limio: "Mobile Add-On" } })]
    const result = buildJsonLd(offers, addOns, defaultConfig)
    expect(result.mainEntity.offers).toHaveLength(1)
  })

  test("handles empty offers array", () => {
    const result = buildJsonLd([], [], defaultConfig)
    expect(result.mainEntity.offers).toHaveLength(0)
  })

  test("handles null/undefined offers gracefully", () => {
    const result = buildJsonLd(null, null, defaultConfig)
    expect(result.mainEntity.offers).toHaveLength(0)
  })
})
