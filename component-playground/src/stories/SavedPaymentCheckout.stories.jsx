import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import SavedPaymentCheckout from "../../../components/saved-payment-checkout/index"

export default {
    title: "Checkout/Saved Payment Checkout",
    component: SavedPaymentCheckout,
    parameters: { layout: "centered" },
    decorators: [
        (Story, context) => (
            <LimioProvider>
                <ComponentContext.Provider value={context.args}>
                    <div style={{ width: 420, padding: 24 }}>
                        <Story />
                    </div>
                </ComponentContext.Provider>
            </LimioProvider>
        )
    ]
}

export const Default = {
    args: {
        heading: "Payment method",
        noPaymentMethodMessage: "No saved payment method found.",
        expiryDateLabel: "Expires {{expiryDate}}",
        expiresSoonLabel: "Expires {{expiryDate}}",
        expiredPaymentMethodLabel: "Expired {{expiryDate}}",
        changePaymentLabel: "Change",
        changePaymentUrl: ""
    }
}

export const WithChangeLink = {
    args: {
        ...Default.args,
        changePaymentUrl: "/account/payment-methods"
    }
}

export const NoHeading = {
    args: {
        ...Default.args,
        heading: ""
    }
}

export const CustomLabels = {
    args: {
        ...Default.args,
        heading: "Your card on file",
        changePaymentLabel: "Update payment method",
        changePaymentUrl: "/account/billing",
        expiryDateLabel: "Valid until {{expiryDate}}",
        expiredPaymentMethodLabel: "Card expired {{expiryDate}}"
    }
}

export const SkeletonState = {
    render: () => (
        <div style={{ width: 420, padding: 24 }}>
            <SavedPaymentCheckout.Skeleton />
        </div>
    )
}

export const ErrorState = {
    render: () => (
        <div style={{ width: 420, padding: 24 }}>
            <SavedPaymentCheckout.Error errorText="Unable to load your payment method. Please try again later." />
        </div>
    )
}
