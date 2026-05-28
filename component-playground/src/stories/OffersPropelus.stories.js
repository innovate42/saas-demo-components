import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import OffersPropelus from "../../../components/offers-propelus/index"

// Propelus-style mock offers with role and state arrays
const propellusOffers = [
    {
        id: "propelus-basic-001",
        name: "Basic Subscription",
        path: "/offers2/Propelus Basic",
        type: "item",
        data: {
            attachments: [
                {
                    type: "image/jpeg",
                    url: "https://placehold.co/200x80?text=Propelus",
                }
            ],
            attributes: {
                display_name__limio: "Basic Subscription",
                display_price__limio: "<p>Free</p>",
                detailed_display_price__limio: "<p>Self-Managed Account</p>",
                cta_text__limio: "Sign Up",
                checkout_description__limio: "<p>Self-Managed Account</p>",
                group__limio: "yearly",
                best_value__limio: false,
                offer_features__limio: "<ul><li>Clear view of CE requirements</li><li>Access to large CE course marketplace</li><li>Manual self-reporting</li><li>Forever course history</li><li>Chat and email support</li></ul>",
                role: ["vet", "nurse", "reg"],
                state: ["CA", "FL", "CO"],
                price__limio: [{ type: "recurring", value: "0", currencyCode: "USD" }],
            },
            price: [{ value: 0, currencyCode: "USD", type: "recurring" }],
            products: [{ path: "/products/propelus", name: "Propelus", attributes: { display_name__limio: "Propelus", product_code__limio: "PROPELUS-BASIC" } }],
        }
    },
    {
        id: "propelus-pro-002",
        name: "Professional Subscription",
        path: "/offers2/Propelus Professional",
        type: "item",
        data: {
            attachments: [
                {
                    type: "image/jpeg",
                    url: "https://placehold.co/200x80?text=Propelus",
                }
            ],
            attributes: {
                display_name__limio: "Professional Subscription",
                display_price__limio: "<p><strong>$99</strong>/yr</p>",
                detailed_display_price__limio: "<p>Billed annually</p>",
                cta_text__limio: "Get Started",
                checkout_description__limio: "<p>Fully-Managed Account</p>",
                group__limio: "yearly",
                best_value__limio: true,
                display_description__limio: "Most Popular",
                offer_features__limio: "<ul><li>Everything in Basic</li><li>Automated CE tracking</li><li>License renewal alerts</li><li>Priority support</li><li>Compliance dashboard</li></ul>",
                role: ["nurse", "reg"],
                state: ["CA", "CO"],
                price__limio: [{ type: "recurring", value: "99", currencyCode: "USD" }],
            },
            price: [{ value: 99, currencyCode: "USD", type: "recurring" }],
            products: [{ path: "/products/propelus", name: "Propelus", attributes: { display_name__limio: "Propelus", product_code__limio: "PROPELUS-PRO" } }],
        }
    },
    {
        id: "propelus-proplus-003",
        name: "Pro Plus Subscription",
        path: "/offers2/Propelus Pro Plus",
        type: "item",
        data: {
            attachments: [
                {
                    type: "image/jpeg",
                    url: "https://placehold.co/200x80?text=Propelus",
                }
            ],
            attributes: {
                display_name__limio: "Pro Plus Subscription",
                display_price__limio: "<p><strong>$149</strong>/yr</p>",
                detailed_display_price__limio: "<p>Billed annually</p>",
                cta_text__limio: "Subscribe",
                checkout_description__limio: "<p>Premium Account with CE courses included</p>",
                group__limio: "yearly",
                best_value__limio: false,
                offer_features__limio: "<ul><li>Everything in Professional</li><li>Unlimited CE course access</li><li>Personalized CE plans</li><li>Dedicated account manager</li><li>Advanced analytics</li></ul>",
                role: ["vet", "reg"],
                state: ["FL", "CO"],
                price__limio: [{ type: "recurring", value: "149", currencyCode: "USD" }],
            },
            price: [{ value: 149, currencyCode: "USD", type: "recurring" }],
            products: [{ path: "/products/propelus", name: "Propelus", attributes: { display_name__limio: "Propelus", product_code__limio: "PROPELUS-PROPLUS" } }],
        }
    },
]

const mockShop = {
    campaign: {
        name: "Propelus Plans",
        path: "/offers2/Propelus",
        attributes: { push_to_checkout__limio: true },
    },
    offers: propellusOffers,
    addOns: [],
    tag: "/tags/propelus",
    basketItems: [],
    addToBasket: (offer) => console.log("[Story] addToBasket", offer),
    initiateCheckout: async (data) => console.log("[Story] initiateCheckout", data),
    navigateToCheckout: async () => console.log("[Story] navigateToCheckout"),
}

export default {
    title: "Offers Propelus",
    component: OffersPropelus,
    parameters: { layout: "fullscreen" },
    decorators: [
        (Story, context) => (
            <LimioProvider value={{ shop: mockShop }}>
                <ComponentContext.Provider value={context.args}>
                    <Story />
                </ComponentContext.Provider>
            </LimioProvider>
        ),
    ],
}

// Default: gating screen shown, dropdowns derived from offer attributes
// Select "vet" + "CA" → only Basic shows
// Select "nurse" + "CA" → Basic + Professional show
// Select "reg" + "CO" → all three show
export const Default = {
    args: {
        heading: "Propelus Plans and Packages",
        subheading: "Find the best course or subscription for you",
        componentId: "offers-propelus",
        showImage: true,
        offerWidth: 2,
        themeColor: "blue",
        showGroupedOffers: false,
        groupLabels: [{ id: "yearly", label: "Annual" }],
        freeTrialLink: "",
        gatingHeading: "Select your location and profession",
        gatingSubheading: "Please select the state or country where you are licensed/certified.",
        gatingPrefixLabel: "I'm a",
        gatingStateLabel: "Pick your location",
        gatingRoleLabel: "Pick your profession",
        continueButtonText: "Continue",
        roleLabels: [
            { id: "vet", label: "Veterinarian" },
            { id: "nurse", label: "Nurse" },
            { id: "reg", label: "Registered Professional" },
        ],
        stateLabels: [
            { id: "CA", label: "California" },
            { id: "FL", label: "Florida" },
            { id: "CO", label: "Colorado" },
        ],
    },
}

// Orange theme variant
export const OrangeTheme = {
    args: {
        ...Default.args,
        themeColor: "orange",
        gatingHeading: "Where do you practice?",
        continueButtonText: "Show My Plans",
    },
}

// Green theme variant
export const GreenTheme = {
    args: {
        ...Default.args,
        themeColor: "green",
    },
}

// Grouped offers (tab pill switcher visible after gating)
export const WithGroupedOffers = {
    args: {
        ...Default.args,
        showGroupedOffers: true,
        groupLabels: [{ id: "yearly", label: "Annual Plans" }],
    },
}
