import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import WinBack from "../../../components/win-back/index"

export default {
    title: "Win Back",
    component: WinBack,
    parameters: { layout: "fullscreen" },
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

// Default — uses limioProps defaults from the component's package.json
export const Default = {
    args: {
        headline: "We'd love to have you back",
        subheadline: "Your account is still here, and we've been making things even better since you left.",
        greetingPrefix: "Welcome back",
        fallbackGreeting: "Welcome back",
        offersSectionTitle: "Pick up where you left off",
        offersSectionSubtitle: "Choose a plan that works for you and get started again in seconds.",
        showFeatures: true,
        showDetailedPrice: true,
        valueProps__limio_richtext: "<ul><li>All your data and preferences are still saved</li><li>New features and improvements since your last visit</li><li>Cancel anytime — no commitments</li></ul>",
        footerMessage: "Questions? Contact our support team anytime.",
        footerLinkText: "Get in touch",
        footerLinkUrl: "/support",
        primaryColor__limio_color: "#635BFF",
        accentColor__limio_color: "#0d9f6e",
    }
}

// Dark, techy SaaS branding
export const DarkBrand = {
    args: {
        ...Default.args,
        headline: "Your workspace misses you",
        subheadline: "We've shipped 23 new features since you last logged in. Come see what's new.",
        greetingPrefix: "Hey",
        offersSectionTitle: "Ready to jump back in?",
        offersSectionSubtitle: "Pick a plan and get back to building in under a minute.",
        valueProps__limio_richtext: "<ul><li>Your projects and settings are exactly where you left them</li><li>23 new features including AI-powered workflows</li><li>Free migration support from our team</li></ul>",
        primaryColor__limio_color: "#1a1a2e",
        accentColor__limio_color: "#00d4aa",
    }
}

// Warm, friendly tone
export const WarmTone = {
    args: {
        ...Default.args,
        headline: "We've been saving your spot",
        subheadline: "It's been a while! Your account and all your content are waiting for you.",
        greetingPrefix: "Hi there",
        offersSectionTitle: "Special offers just for you",
        offersSectionSubtitle: "As a returning member, you get access to our best pricing.",
        valueProps__limio_richtext: "<ul><li>Your content library is intact and ready to go</li><li>Exclusive returning member pricing below</li><li>30-day money-back guarantee on all plans</li><li>Priority onboarding support included</li></ul>",
        footerMessage: "Need help deciding? Our team is here for you.",
        footerLinkText: "Chat with us",
        primaryColor__limio_color: "#e65100",
        accentColor__limio_color: "#2e7d32",
    }
}

// Minimal — no features, no detailed price
export const Minimal = {
    args: {
        ...Default.args,
        headline: "Come back to Pro",
        subheadline: "Simple pricing, no surprises.",
        showFeatures: false,
        showDetailedPrice: false,
        valueProps__limio_richtext: "",
        footerMessage: "",
        primaryColor__limio_color: "#0070f3",
        accentColor__limio_color: "#0070f3",
    }
}

// Enterprise / B2B style
export const Enterprise = {
    args: {
        ...Default.args,
        headline: "Reactivate your team's account",
        subheadline: "Your team's data, integrations, and workspace are preserved and ready to resume.",
        greetingPrefix: "Welcome back",
        offersSectionTitle: "Choose your plan",
        offersSectionSubtitle: "All plans include SSO, audit logs, and dedicated support.",
        valueProps__limio_richtext: "<ul><li>All team members and permissions preserved</li><li>API keys and integrations still configured</li><li>SOC 2 Type II certified infrastructure</li><li>Dedicated account manager on Business and Enterprise plans</li></ul>",
        footerMessage: "Need a custom plan for your team?",
        footerLinkText: "Talk to sales",
        footerLinkUrl: "/contact-sales",
        primaryColor__limio_color: "#0f172a",
        accentColor__limio_color: "#3b82f6",
    }
}
