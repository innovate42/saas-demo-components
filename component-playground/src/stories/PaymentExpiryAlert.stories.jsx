import React from "react"
import { ExpiryAlertBanner } from "../../../components/payment-expiry-alert/index"

export default {
    title: "Payment Alerts/Payment Expiry Alert",
    component: ExpiryAlertBanner,
    parameters: { layout: "centered" },
    decorators: [
        (Story) => (
            <div style={{ width: 350, padding: 24 }}>
                <Story />
            </div>
        )
    ]
}

// Default shows mustache variables as they appear in the limioProps default.
// At runtime, the real component resolves {{brand}}, {{last4}}, and {{daysUntilExpiry}}.
export const Default = {
    args: {
        heading: "Your payment method is expiring soon",
        subline: "<p>Your {{brand}} ending in {{last4}} expires in {{daysUntilExpiry}} days. Update your payment method to avoid interruptions.</p>",
        ctaLabel: "Update payment method",
        ctaUrl: "/add-payment-method",
        backgroundColor: "#fff7ed",
        borderColor: "#fed7aa",
        textColor: "#9a3412",
    }
}

// Shows what it looks like at runtime once mustache variables are resolved
export const Resolved = {
    args: {
        heading: "Your payment method is expiring soon",
        subline: "<p>Your Visa ending in 4242 expires in 45 days. Update your payment method to avoid interruptions.</p>",
        ctaLabel: "Update payment method",
        ctaUrl: "/add-payment-method",
        backgroundColor: "#fff7ed",
        borderColor: "#fed7aa",
        textColor: "#9a3412",
    }
}

export const ExpiringIn7Days = {
    args: {
        heading: "Your payment method expires very soon",
        subline: "<p>Your <strong>MasterCard ending in 8910</strong> expires in <strong>7 days</strong>. Please update it now to avoid service disruption.</p>",
        ctaLabel: "Update now",
        ctaUrl: "/add-payment-method",
        backgroundColor: "#fef2f2",
        borderColor: "#fecaca",
        textColor: "#991b1b",
    }
}

export const CustomCopy = {
    args: {
        heading: "Card expiring soon",
        subline: "<p>The card you use for billing (American Express ****1234) will expire next month. We recommend updating your payment details.</p>",
        ctaLabel: "Manage billing",
        ctaUrl: "/billing/update",
        backgroundColor: "#fff7ed",
        borderColor: "#fed7aa",
        textColor: "#9a3412",
    }
}

export const CustomColors = {
    args: {
        heading: "Your payment method is expiring soon",
        subline: "<p>Your {{brand}} ending in {{last4}} expires in {{daysUntilExpiry}} days. Update your payment method to avoid interruptions.</p>",
        ctaLabel: "Update payment method",
        ctaUrl: "/add-payment-method",
        backgroundColor: "#eff6ff",
        borderColor: "#bfdbfe",
        textColor: "#1e40af",
    }
}

export const NoCTA = {
    args: {
        heading: "Your payment method is expiring soon",
        subline: "<p>Your {{brand}} ending in {{last4}} expires in {{daysUntilExpiry}} days. Please visit your account settings to update it.</p>",
        ctaLabel: "",
        ctaUrl: "",
        backgroundColor: "#fff7ed",
        borderColor: "#fed7aa",
        textColor: "#9a3412",
    }
}
