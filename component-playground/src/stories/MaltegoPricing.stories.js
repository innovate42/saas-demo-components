import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import MaltegoPricing from "../../../components/maltego-pricing/index"

export default {
    title: "Maltego Pricing",
    component: MaltegoPricing,
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

export const Default = {
    args: {
        headline: "Explore plans that power all digital investigations",
        subheadline: "From individual researchers to enterprise teams — choose the plan that fits your needs.",
        showComparisonTable: true,
        showFaq: true,
        showGroupToggle: true,
        ctaText: "Get started",
        freeCta: "Use for free",
        enterpriseCta: "Book a Demo",
        bestValueLabel: "Best Value",
        primaryColor: "#EFBF04",
        bestValueColor: "#EFBF04",
        backgroundColor: "#FFFFFF",
        cardColor: "#FFFFFF",
        textColor: "#1B2438",
        mutedTextColor: "#5A6175",
        faqHeadline: "Frequently asked questions",
        comparisonHeadline: "Compare all features",
        groupLabels: [
            { id: "monthly", label: "Monthly" },
            { id: "annual", label: "Annual" },
        ],
        featureCategories: [
            { id: "products", label: "Products" },
            { id: "data", label: "Data" },
            { id: "services", label: "Services" },
        ],
        faqItems: [
            { id: "trial", label: "Is there a free trial available?" },
            { id: "upgrade", label: "Can I change my plan later?" },
            { id: "cancel", label: "What is the cancellation policy?" },
            { id: "payment", label: "What payment methods do you accept?" },
            { id: "discount", label: "Do you offer discounts for annual billing?" },
        ],
    },
}

export const DarkPurple = {
    args: {
        ...Default.args,
        primaryColor: "#7C3AED",
        bestValueColor: "#F59E0B",
        backgroundColor: "#0F0A1F",
        cardColor: "#1A1333",
        textColor: "#F8FAFC",
        mutedTextColor: "#A1A1C7",
        headline: "Invest in the right plan",
        subheadline: "Powerful tools for every stage of growth.",
    },
}

export const BlueTech = {
    args: {
        ...Default.args,
        primaryColor: "#2563EB",
        bestValueColor: "#16A34A",
        backgroundColor: "#F1F5F9",
        cardColor: "#FFFFFF",
        textColor: "#0F172A",
        mutedTextColor: "#64748B",
        headline: "Plans that scale with your team",
        subheadline: "Enterprise-grade tools at every tier.",
    },
}

export const MinimalNoExtras = {
    args: {
        ...Default.args,
        showComparisonTable: false,
        showFaq: false,
        showGroupToggle: false,
        headline: "Simple, transparent pricing",
        subheadline: "No hidden fees. No surprises.",
    },
}

export const WarmBranding = {
    args: {
        ...Default.args,
        primaryColor: "#E85D04",
        bestValueColor: "#2D6A4F",
        backgroundColor: "#FFFBF5",
        cardColor: "#FFFFFF",
        textColor: "#2B2D42",
        mutedTextColor: "#8D99AE",
        headline: "Plans built for creators",
        subheadline: "Start free, scale as you grow. Cancel anytime.",
        bestValueLabel: "Most Popular",
    },
}
