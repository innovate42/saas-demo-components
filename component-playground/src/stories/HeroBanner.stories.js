import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import HeroBanner from "../../../components/hero-banner/index"

export default {
    title: "Hero Banner",
    component: HeroBanner,
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

// Default — orange-to-pink gradient, dark background
export const Default = {
    args: {
        headline: "Choose Your Plan",
        subheadline: "Select a plan to explore features and pricing",
        primaryColor__limio_color: "#F96D24",
        secondaryColor__limio_color: "#CC3A5E",
        backgroundColor__limio_color: "#0a0a14",
        showWireframe: true,
        ctaText: "",
        sidebarPosition: "left",
    }
}

// CyberTech — cyan to purple
export const CyberTech = {
    args: {
        ...Default.args,
        headline: "Upgrade Your Stack",
        subheadline: "Enterprise-grade infrastructure at startup-friendly prices",
        primaryColor__limio_color: "#00d4ff",
        secondaryColor__limio_color: "#7c3aed",
        backgroundColor__limio_color: "#060612",
    }
}

// LimioGradient — limio.com branding
export const LimioGradient = {
    args: {
        ...Default.args,
        headline: "Start Your Subscription",
        subheadline: "Flexible plans that grow with your business",
        primaryColor__limio_color: "#F96D24",
        secondaryColor__limio_color: "#F9A825",
        backgroundColor__limio_color: "#0d0d1a",
    }
}

// SidebarRight — green theme, sidebar on right
export const SidebarRight = {
    args: {
        ...Default.args,
        headline: "Pick Your Path",
        subheadline: "Every plan includes a 14-day free trial",
        primaryColor__limio_color: "#10b981",
        secondaryColor__limio_color: "#059669",
        backgroundColor__limio_color: "#0a100f",
        sidebarPosition: "right",
    }
}

// NoWireframe — purple theme, wireframe off
export const NoWireframe = {
    args: {
        ...Default.args,
        headline: "Simple Pricing",
        subheadline: "No hidden fees, cancel anytime",
        primaryColor__limio_color: "#8b5cf6",
        secondaryColor__limio_color: "#6d28d9",
        backgroundColor__limio_color: "#0f0a1a",
        showWireframe: false,
    }
}
