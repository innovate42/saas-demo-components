import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import LossBenefitCancel from "../../../components/loss-benefit-cancel/index"

export default {
    title: "Loss Benefit Cancel",
    component: LossBenefitCancel,
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
        heading: "Here's what you'll lose",
        subheading: "If you cancel your subscription, you'll no longer have access to these features:",
        primaryColor: "#002C5F",
        dangerColor: "#dc2626",
        fallbackFeatures__limio_richtext: "<ul><li>Access to all plan features</li><li>Customer support</li><li>Regular updates</li></ul>",
        showPlanName: true,
        showPrice: true,
    },
}

export const HyundaiBluelink = {
    args: {
        ...Default.args,
        heading: "You'll lose these Bluelink features",
        subheading: "Cancelling your plan means you'll no longer have access to:",
        dangerColor: "#c41230",
        fallbackFeatures__limio_richtext: "<ul><li>Connected Routing, Hyundai's cloud-based navigation</li><li>EV Routing & EV POI (point of interest)</li><li>Bluelink App status updates, vehicle information and send POI to car</li><li>Digital Key (optional)</li><li>Online Voice Recognition</li><li>Vehicle system OTA updates (if available for the vehicle)</li></ul>",
    },
}

export const NoPlanDetails = {
    args: {
        ...Default.args,
        showPlanName: false,
        showPrice: false,
    },
}

export const CustomBranding = {
    args: {
        ...Default.args,
        heading: "Don't miss out!",
        subheading: "Your Premium subscription includes all of these benefits:",
        primaryColor: "#635BFF",
        dangerColor: "#ef4444",
    },
}
