import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import AccountDashboard from "../../../components/account-dashboard/index"

export default {
    title: "Account Dashboard",
    component: AccountDashboard,
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

// Default — Full dashboard with all sections visible
export const Default = {
    args: {
        heroTitle: "Subscription Dashboard",
        heroSubtitle: "Manage your plans, billing, and account details",
        heading: "Account",
        profileSectionTitle: "Profile",
        subscriptionsSectionTitle: "Subscriptions",
        paymentHistoryTitle: "Payment History",
        availableOffersTitle: "Available Plans",
        availableOffersSubtitle: "Explore plans to upgrade or add to your account",
        showPaymentHistory: true,
        showAvailableOffers: true,
        showCancelledSubscriptions: false,
        nameLabel: "Name",
        emailLabel: "Email",
        memberSinceLabel: "Member since",
        planLabel: "Plan",
        statusLabel: "Status",
        priceLabel: "Price",
        periodLabel: "Billing period",
        renewalLabel: "Next billing date",
        startedLabel: "Started",
        referenceLabel: "Reference",
        productLabel: "Product",
        dateColumnLabel: "Date",
        descriptionColumnLabel: "Description",
        amountColumnLabel: "Amount",
        statusColumnLabel: "Status",
        upgradeUrl: "/upgrade",
        upgradeCtaText: "Change plan",
        manageAddOnsUrl: "/add-ons",
        manageAddOnsText: "Manage add-ons",
        cancelUrl: "/cancel",
        cancelCtaText: "Cancel plan",
        primaryColor__limio_color: "#635BFF",
        dangerColor__limio_color: "#DF1B41",
        noSubscriptionHeading: "No active subscription",
        noSubscriptionMessage: "You don't have an active plan yet. Choose a plan to get started.",
        getStartedText: "View plans",
        getStartedUrl: "/pricing"
    }
}

// With cancelled subscriptions visible
export const WithCancelledSubs = {
    args: {
        ...Default.args,
        heading: "Account History",
        showCancelledSubscriptions: true
    }
}

// Minimal — no payment history or available offers
export const MinimalView = {
    args: {
        ...Default.args,
        heading: "My Account",
        showPaymentHistory: false,
        showAvailableOffers: false,
        manageAddOnsUrl: "",
        cancelUrl: ""
    }
}

// Shopify-inspired green theme
export const ShopifyTheme = {
    args: {
        ...Default.args,
        heading: "My Account",
        primaryColor__limio_color: "#008060",
        dangerColor__limio_color: "#D72C0D",
        upgradeCtaText: "Upgrade plan",
        profileSectionTitle: "Customer",
        subscriptionsSectionTitle: "Your plans",
        paymentHistoryTitle: "Billing history",
        availableOffersTitle: "More plans",
        availableOffersSubtitle: "Add another plan or switch your current one"
    }
}

// Corporate blue theme
export const CorporateTheme = {
    args: {
        ...Default.args,
        heading: "Account Overview",
        primaryColor__limio_color: "#0070F3",
        dangerColor__limio_color: "#E00",
        upgradeCtaText: "Change subscription",
        cancelCtaText: "Cancel subscription",
        profileSectionTitle: "Your details",
        subscriptionsSectionTitle: "Plan details",
        paymentHistoryTitle: "Transaction history",
        availableOffersTitle: "Available subscriptions",
        availableOffersSubtitle: ""
    }
}

// Limio branded — orange-to-coral with Manrope font
export const LimioBranded = {
    args: {
        ...Default.args,
        heroTitle: "Subscription Dashboard",
        heroSubtitle: "Manage your Limio subscriptions and billing",
        heading: "Your Account",
        primaryColor__limio_color: "#F96D24",
        dangerColor__limio_color: "#CC3A5E",
        profileSectionTitle: "Profile",
        subscriptionsSectionTitle: "Subscriptions",
        paymentHistoryTitle: "Billing History",
        availableOffersTitle: "Explore Plans",
        availableOffersSubtitle: "Find the perfect plan for your subscription business",
        upgradeCtaText: "Switch plan",
        cancelCtaText: "Cancel",
        manageAddOnsText: "Add-ons",
    }
}
