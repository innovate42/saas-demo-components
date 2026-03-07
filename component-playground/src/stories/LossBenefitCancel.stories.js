import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import LossBenefitCancel from "../../../components/loss-benefit-cancel/index"

// -- Mock subscription data for different scenarios --

const baseOffer = {
    name: "Limio Monthly",
    quantity: 1,
    data: {
        start: "2022-06-09T12:44:38.771Z",
        record_subtype: "base",
        offer: {
            data: {
                attributes: {
                    display_name__limio: "Limio Monthly",
                    display_price__limio: "<p><strong>£20.00 per month</strong></p>",
                    offer_features__limio: "<ul><li>Unlimited access to all content</li><li>Priority customer support</li><li>Monthly newsletter</li><li>Early access to new features</li><li>Community forum access</li></ul>",
                },
            }
        }
    },
}

const premiumOffer = {
    name: "Limio Premium Annual",
    quantity: 1,
    data: {
        start: "2022-06-09T12:44:38.771Z",
        record_subtype: "base",
        offer: {
            data: {
                attributes: {
                    display_name__limio: "Limio Premium Annual",
                    display_price__limio: "<p><strong>£180.00 per year</strong></p>",
                    offer_features__limio: "<ul><li>Everything in Monthly</li><li>Dedicated account manager</li><li>API access</li><li>Custom integrations</li><li>99.9% SLA guarantee</li></ul>",
                },
            }
        }
    },
}

const addonDigitalKey = {
    name: "Digital Key",
    status: "active",
    data: {
        start: "2022-06-09T12:44:38.771Z",
        add_on: {
            name: "Digital Key",
            data: {
                attributes: {
                    display_name__limio: "Digital Key Access",
                }
            }
        }
    }
}

const addonCloudStorage = {
    name: "Cloud Storage",
    status: "active",
    data: {
        start: "2022-06-09T12:44:38.771Z",
        add_on: {
            name: "Cloud Storage",
            data: {
                attributes: {
                    display_name__limio: "50GB Cloud Storage",
                }
            }
        }
    }
}

function makeSubscription({ offers = [], addOns = [], status = "active" } = {}) {
    // getCurrentOffer() falls back to subscription.data.offer when checkActiveOffers
    // returns empty (which happens in Storybook due to date string vs Date object comparison).
    const primaryOffer = offers.find(o => o.data?.record_subtype !== "discount")
    return {
        name: "Test Subscription",
        data: {
            offer: primaryOffer?.data?.offer,
        },
        status,
        id: "sub-test-001",
        reference: "TEST001",
        offers,
        addOns,
    }
}

// -- Decorator that injects subscriptions into context --

function withSubscriptions(subscriptions) {
    return (Story, context) => (
        <LimioProvider value={{ subscriptions }}>
            <ComponentContext.Provider value={context.args}>
                <Story />
            </ComponentContext.Provider>
        </LimioProvider>
    )
}

// -- Default args shared across stories --

const defaultArgs = {
    heading: "Here's what you'll lose",
    subheading: "If you cancel your subscription, you'll no longer have access to these features:",
    primaryColor: "#002C5F",
    dangerColor: "#dc2626",
    offerFeatures__limio_richtext: "{{data.attributes.offer_features__limio}}",
    planName: "{{data.attributes.display_name__limio}}",
    displayPrice: "{{data.attributes.display_price__limio}}",
    fallbackFeatures__limio_richtext: "<ul><li>Access to all plan features</li><li>Customer support</li><li>Regular updates</li></ul>",
    showPlanName: true,
    showPrice: true,
}

// -- Stories --

export default {
    title: "Loss Benefit Cancel",
    component: LossBenefitCancel,
    parameters: { layout: "fullscreen" },
}

export const SingleOffer = {
    args: { ...defaultArgs },
    decorators: [withSubscriptions([makeSubscription({ offers: [baseOffer] })])],
}

export const SingleOfferWithOneAddOn = {
    args: { ...defaultArgs },
    decorators: [withSubscriptions([makeSubscription({ offers: [baseOffer], addOns: [addonDigitalKey] })])],
}

export const SingleOfferWithTwoAddOns = {
    args: { ...defaultArgs },
    decorators: [withSubscriptions([makeSubscription({ offers: [baseOffer], addOns: [addonDigitalKey, addonCloudStorage] })])],
}

export const TwoOffers = {
    args: { ...defaultArgs },
    decorators: [withSubscriptions([makeSubscription({ offers: [baseOffer, premiumOffer] })])],
}

export const NoOffers = {
    args: { ...defaultArgs },
    decorators: [withSubscriptions([makeSubscription({ offers: [] })])],
}

export const NoSubscription = {
    args: { ...defaultArgs },
    decorators: [withSubscriptions([])],
}

export const HyundaiBluelink = {
    args: {
        ...defaultArgs,
        heading: "You'll lose these Bluelink features",
        subheading: "Cancelling your plan means you'll no longer have access to:",
        fallbackFeatures__limio_richtext: "<ul><li>Connected Routing, Hyundai's cloud-based navigation</li><li>EV Routing & EV POI (point of interest)</li><li>Bluelink App status updates, vehicle information and send POI to car</li><li>Digital Key (optional)</li><li>Online Voice Recognition</li><li>Vehicle system OTA updates (if available for the vehicle)</li></ul>",
    },
    decorators: [withSubscriptions([makeSubscription({ offers: [baseOffer], addOns: [addonDigitalKey] })])],
}
