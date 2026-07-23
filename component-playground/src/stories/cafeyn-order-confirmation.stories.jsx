import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import CafeynOrderConfirmation from "../../../components/cafeyn-order-confirmation"

export default {
    title: "Cafeyn/Order Confirmation",
    component: CafeynOrderConfirmation,
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
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

// Order data comes from the playground's @limio/internal-checkout-sdk mock
// (useCompleteCheckoutSession): Julia Schneider, Team ×5, Audio add-on.
export const Default = { args: {} }

export const WithoutSteps = {
    args: { steps: [] },
}
