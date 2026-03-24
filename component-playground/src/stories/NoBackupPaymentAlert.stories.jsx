import React from "react"
import { AlertBanner } from "../../../components/no-backup-payment-alert/index"

export default {
    title: "Payment Alerts/No Backup Payment Alert",
    component: AlertBanner,
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
// At runtime, the real component resolves {{brand}} and {{last4}} from the default payment method.
export const Default = {
    args: {
        heading: "No backup payment method",
        subline: "<p>Your {{brand}} ending in {{last4}} has no backup. If it fails, there's no fallback. Add a second payment method to avoid interruptions.</p>",
        ctaLabel: "Add backup method",
        ctaUrl: "/add-payment-method",
        backgroundColor: "#fff7ed",
        borderColor: "#fed7aa",
        textColor: "#9a3412",
    }
}

// Shows what it looks like at runtime once mustache variables are resolved
export const Resolved = {
    args: {
        heading: "No backup payment method",
        subline: "<p>Your Visa ending in 4242 has no backup. If it fails, there's no fallback. Add a second payment method to avoid interruptions.</p>",
        ctaLabel: "Add backup method",
        ctaUrl: "/add-payment-method",
        backgroundColor: "#fff7ed",
        borderColor: "#fed7aa",
        textColor: "#9a3412",
    }
}

export const CustomCopy = {
    args: {
        heading: "You only have one card on file",
        subline: "<p>We recommend adding a <strong>backup payment method</strong> in case your primary card is declined or expires. This helps ensure uninterrupted service.</p>",
        ctaLabel: "Add a card",
        ctaUrl: "/billing/add-payment",
        backgroundColor: "#fff7ed",
        borderColor: "#fed7aa",
        textColor: "#9a3412",
    }
}

export const CustomColors = {
    args: {
        heading: "No backup payment method",
        subline: "<p>Your {{brand}} ending in {{last4}} has no backup. If it fails, there's no fallback. Add a second payment method to avoid interruptions.</p>",
        ctaLabel: "Add backup method",
        ctaUrl: "/add-payment-method",
        backgroundColor: "#eff6ff",
        borderColor: "#bfdbfe",
        textColor: "#1e40af",
    }
}

export const RedUrgent = {
    args: {
        heading: "Action required: Add a backup payment",
        subline: "<p>Your account currently has <strong>no backup payment method</strong>. If your primary card fails, your subscription will be suspended.</p>",
        ctaLabel: "Fix this now",
        ctaUrl: "/add-payment-method",
        backgroundColor: "#fef2f2",
        borderColor: "#fecaca",
        textColor: "#991b1b",
    }
}

export const NoCTA = {
    args: {
        heading: "No backup payment method",
        subline: "<p>Consider adding a second payment method to your account for uninterrupted service.</p>",
        ctaLabel: "",
        ctaUrl: "",
        backgroundColor: "#fff7ed",
        borderColor: "#fed7aa",
        textColor: "#9a3412",
    }
}
