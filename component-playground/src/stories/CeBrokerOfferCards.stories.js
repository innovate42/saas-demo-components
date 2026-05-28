import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import CeBrokerOfferCards from "../../../components/cebroker-offer-cards/index"

export default {
    title: "Components/CeBroker Offer Cards",
    component: CeBrokerOfferCards,
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
    argTypes: {
        primaryColor: { control: { type: "color" } },
    },
}

export const Default = {
    args: {
        heading: "Propelus Plans and Packages",
        subheading: "Find the best course or subscription for you",
        filterLabel: "Filter by",
        componentId: "cebroker-offer-cards",
        primaryColor: "#0B5394",
        showImage: true,
        showGroupedOffers: true,
        showKeywordSearch: true,
        showFreeTrialLink: true,
        freeTrialLink: "Start a free trial",
        showRoleFilter: true,
        roleFilterLabel: "I'm a",
        roleFilterAllLabel: "All roles",
        roleLabels: [
            { id: "nurse-midwife", label: "Nurse Midwife" },
            { id: "pharmacist", label: "Pharmacist" },
            { id: "physician", label: "Physician" },
        ],
        showStateFilter: true,
        stateFilterLabel: "in",
        stateFilterAllLabel: "All states",
        stateLabels: [
            { id: "AK", label: "Alaska" },
            { id: "CA", label: "California" },
            { id: "FL", label: "Florida" },
            { id: "NY", label: "New York" },
            { id: "TX", label: "Texas" },
        ],
        groupLabels: [
            { id: "monthly", label: "One Time Courses" },
            { id: "yearly", label: "Subscriptions" },
        ],
    },
}

export const SingleGroup = {
    args: {
        ...Default.args,
        showGroupedOffers: false,
        heading: "All Courses",
        subheading: "Every course in the catalogue",
    },
}
