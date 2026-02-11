import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import OrderComplete from "../../../components/order-complete/index"

export default {
    title: "Order Complete",
    component: OrderComplete,
    parameters: {
        layout: "fullscreen"
    },
    decorators: [
        (Story, context) => (
            <LimioProvider>
                <ComponentContext.Provider value={context.args}>
                    <Story />
                </ComponentContext.Provider>
            </LimioProvider>
        )
    ]
}

const defaultSteps = [
    { productCode: "default", stepTitle: "Set up your account", stepDescription: "Complete your profile and configure your workspace preferences.", stepUrl: "" },
    { productCode: "default", stepTitle: "Explore your plan", stepDescription: "Discover the features and tools available with your subscription.", stepUrl: "" },
    { productCode: "default", stepTitle: "Get support", stepDescription: "Visit our help center or reach out to our team with any questions.", stepUrl: "" }
]

const physicalProductSteps = [
    { productCode: "LI.PHYSICAL", stepTitle: "Confirm your delivery address", stepDescription: "Make sure your shipping details are correct so your first issue arrives on time.", stepUrl: "/account/address" },
    { productCode: "LI.PHYSICAL", stepTitle: "Choose your start date", stepDescription: "Select when you'd like your subscription to begin.", stepUrl: "/account/preferences" },
    { productCode: "LI.PHYSICAL", stepTitle: "Download the companion app", stepDescription: "Get access to digital content while you wait for your first delivery.", stepUrl: "" },
    { productCode: "LI.PHYSICAL", stepTitle: "Manage your subscription", stepDescription: "View billing, pause, or make changes anytime from your account.", stepUrl: "/account" }
]

const digitalProductSteps = [
    { productCode: "LI.DIGITAL", stepTitle: "Activate your account", stepDescription: "Set your password and enable two-factor authentication for security.", stepUrl: "/activate" },
    { productCode: "LI.DIGITAL", stepTitle: "Install the desktop app", stepDescription: "Download the app for Mac, Windows, or Linux to get started.", stepUrl: "/download" },
    { productCode: "LI.DIGITAL", stepTitle: "Connect integrations", stepDescription: "Link your existing tools — Slack, GitHub, Jira and more.", stepUrl: "/integrations" },
    { productCode: "LI.DIGITAL", stepTitle: "Invite your team", stepDescription: "Collaborate by adding teammates to your workspace.", stepUrl: "/team/invite" },
    { productCode: "LI.DIGITAL", stepTitle: "Explore templates", stepDescription: "Browse ready-made templates to get productive on day one.", stepUrl: "" }
]

// Default — uses "default" onboarding steps (mock data has product_code LI.PHYSICAL, which matches physicalProductSteps)
export const Default = {
    args: {
        heading: "Order Confirmed",
        successMessage: "Thank you for your purchase! A confirmation email has been sent.",
        orderSummaryTitle: "Order Summary",
        onboardingTitle: "Get Started",
        primaryColor__limio_color: "#635BFF",
        successColor__limio_color: "#30D158",
        ctaText: "Go to Dashboard",
        ctaUrl: "/",
        onboardingSteps: [...physicalProductSteps, ...defaultSteps]
    }
}

// Fallback — when no product-specific steps match, falls back to "default" steps
export const FallbackToDefault = {
    args: {
        ...Default.args,
        onboardingTitle: "Next Steps",
        onboardingSteps: defaultSteps
    }
}

// Digital product onboarding — demonstrates a different product code with more steps
export const DigitalProduct = {
    args: {
        ...Default.args,
        heading: "Welcome Aboard",
        onboardingTitle: "Set Up Your Workspace",
        primaryColor__limio_color: "#0070F3",
        successColor__limio_color: "#17B169",
        ctaText: "Open Dashboard",
        onboardingSteps: [...digitalProductSteps, ...defaultSteps]
    }
}

// Dark purple theme
export const CustomBranding = {
    args: {
        ...Default.args,
        heading: "You're all set!",
        successMessage: "Your subscription is now active.",
        onboardingTitle: "Quick Start Guide",
        primaryColor__limio_color: "#7C3AED",
        successColor__limio_color: "#10B981",
        ctaText: "Start Exploring",
        onboardingSteps: [...physicalProductSteps, ...defaultSteps]
    }
}

// Minimal — no onboarding steps, just the order summary
export const NoOnboarding = {
    args: {
        ...Default.args,
        onboardingSteps: []
    }
}
