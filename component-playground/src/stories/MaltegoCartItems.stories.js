import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import MaltegoCartItems from "../../../components/maltego-cart-items/index"

export default {
    title: "Maltego Cart Items",
    component: MaltegoCartItems,
    parameters: { layout: "fullscreen" },
    decorators: [
        (Story, context) => (
            <LimioProvider>
                <ComponentContext.Provider value={context.args}>
                    <Story />
                </ComponentContext.Provider>
            </LimioProvider>
        ),
    ],
}

const baseArgs = {
    showOfferIcons: true,
    offerAdditionalInfo: "{{data.attributes.checkout_description__limio}}",
    addOnAdditionalInfo: "{{data.attributes.description__limio}}",
    lineItemAdditionalInfo: "",
    addOnAdditionalInfo2: "{{data.attributes.description__limio}}",
    unitPriceLabel: "{quantity} x {{formattedPrice}} each",
    emptyCartMessage: "Your cart is empty, view offers to go to offers",
    emptyCTALabel: "See offers",
    emptyCartUrl: "/default",
    displayUpsellOffers: true,
    showPriceInUpsellOffers: true,
    readOnly: false,
    showDiscountNote: false,
}

export const RadioLayout = {
    name: "Radio Layout (Standard)",
    args: {
        ...baseArgs,
        showAsCards: false,
    },
}

export const CardLayout = {
    name: "Card Layout (Show as cards)",
    args: {
        ...baseArgs,
        showAsCards: true,
    },
}
