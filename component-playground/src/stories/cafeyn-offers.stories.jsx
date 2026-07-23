import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import CafeynOffers from "../../../components/cafeyn-offers"

const eur = (value, interval) => [{
    name: "charge_1",
    label: "Charge 1",
    value: String(value),
    currencyCode: "EUR",
    type: "recurring",
    trigger: "order_date",
    repeat_interval: 1,
    repeat_interval_type: interval,
}]

const cafeynOffer = (id, name, group, value, interval, extra = {}) => ({
    id,
    path: `/offers2/Cafeyn ${name} ${group === "yearly" ? "Annual" : "Monthly"} EUR`,
    data: {
        attributes: {
            display_name__limio: name,
            group__limio: group,
            allow_multibuy__limio: true,
            best_value__limio: false,
            price__limio: eur(value, interval),
            ...extra,
        },
        price: eur(value, interval),
        products: [],
        attachments: [],
    },
})

const TEAM_FEATURES = "<ul><li>Über 2.500 Zeitungen &amp; Magazine</li><li>Bis zu 10 Lizenzen</li><li>Offline lesen auf allen Geräten</li><li>Smart Reader Artikelansicht</li></ul>"
const BIZ_FEATURES = "<ul><li><strong>Alles aus Team +</strong></li><li>Audio-Artikel &amp; Podcasts</li><li>Lese-Analysen für Ihr Team</li><li>Priorisierter Support</li></ul>"

const cafeynOffers = [
    cafeynOffer("team-m", "Team", "monthly", 12, "months", {
        display_price__limio: "<p><strong>12&nbsp;€</strong> pro Nutzer/Monat</p>",
        detailed_display_price__limio: "<p>Monatliche Abrechnung · jederzeit kündbar</p>",
        offer_features__limio: TEAM_FEATURES,
        cta_text__limio: "Mit Team starten",
    }),
    cafeynOffer("biz-m", "Business", "monthly", 18, "months", {
        display_price__limio: "<p><strong>18&nbsp;€</strong> pro Nutzer/Monat</p>",
        detailed_display_price__limio: "<p>Monatliche Abrechnung · jederzeit kündbar</p>",
        offer_features__limio: BIZ_FEATURES,
        cta_text__limio: "Business wählen",
        best_value__limio: true,
    }),
    cafeynOffer("team-a", "Team", "yearly", 120, "years", {
        display_price__limio: "<p><strong>10&nbsp;€</strong> pro Nutzer/Monat</p>",
        detailed_display_price__limio: "<p>120&nbsp;€ pro Nutzer/Jahr · jährliche Abrechnung</p>",
        offer_features__limio: TEAM_FEATURES,
        cta_text__limio: "Mit Team starten",
    }),
    cafeynOffer("biz-a", "Business", "yearly", 180, "years", {
        display_price__limio: "<p><strong>15&nbsp;€</strong> pro Nutzer/Monat</p>",
        detailed_display_price__limio: "<p>180&nbsp;€ pro Nutzer/Jahr · jährliche Abrechnung</p>",
        offer_features__limio: BIZ_FEATURES,
        cta_text__limio: "Business wählen",
        best_value__limio: true,
    }),
]

const shopValue = {
    shop: {
        campaign: { name: "Cafeyn B2B", path: "/pages/ca-pricing", attributes: { pushToCheckout: false } },
        offers: cafeynOffers,
        addOns: [],
        basketItems: [],
    },
}

export default {
    title: "Cafeyn/Offers",
    component: CafeynOffers,
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
    decorators: [
        (Story, context) => (
            <LimioProvider value={shopValue}>
                <ComponentContext.Provider value={context.args}>
                    <Story />
                </ComponentContext.Provider>
            </LimioProvider>
        ),
    ],
}

export const Default = { args: {} }

export const WithoutEnterpriseCard = {
    args: { showEnterpriseCard: false },
}

export const OneLicense = {
    args: { defaultQuantity: 1 },
}
