// Mock for @limio/sdk used in Storybook
// Extracts default values from package.json limioProps

// Mutable config object — stories can set overrides via this
export const __mockConfig = {
  propsOverride: null,
  offersOverride: null,
}

export function getPropsFromPackageJson(packageData) {
  const props = {}
  if (packageData && packageData.limioProps) {
    packageData.limioProps.forEach((prop) => {
      if (prop.type === "list" && prop.fields) {
        props[prop.id] = prop.default || []
      } else if (prop.type === "schema") {
        try {
          props[prop.id] = typeof prop.default === "string" ? JSON.parse(prop.default) : prop.default
        } catch {
          props[prop.id] = prop.default
        }
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

// Sample offers matching Emma pricing page tiers
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
    },
  },
]

export function useCampaign() {
  return { offers: __mockConfig.offersOverride || sampleOffers }
}

export function useBasket() {
  return {
    addOfferToBasket: (offer) => {
      console.log("Added to basket:", offer.data?.attributes?.display_name__limio || offer.id)
      alert(`Added "${offer.data?.attributes?.display_name__limio}" to basket`)
    },
    basket: [],
  }
}

export function sanitiseHTML(html) {
  return html || ""
}

export function groupOffers(offers, groupLabels = []) {
  const groups = {}
  ;(offers || []).forEach((offer) => {
    const groupId = offer.data?.attributes?.group__limio || "other"
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
