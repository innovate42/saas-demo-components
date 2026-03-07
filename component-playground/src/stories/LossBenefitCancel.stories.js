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
                    display_price__limio: "<p>$4.99 per month</p>",
                    offer_features__limio: "<ul><li>Unlock and lock your car remotely</li><li>Share digital keys with family</li><li>Temporary guest access</li></ul>",
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
                    display_price__limio: "<p>$2.99 per month</p>",
                    offer_features__limio: "<ul><li>50GB cloud storage</li><li>Automatic backup</li><li>File sharing</li></ul>",
                }
            }
        }
    }
}

const addonDemoProduct = {
    name: "Demo Product",
    status: "active",
    data: {
        start: "2022-06-09T12:44:38.771Z",
        add_on: {
            name: "Demo Product",
            data: {
                attributes: {
                    display_name__limio: "Demo Product",
                    display_price__limio: "<p>$199.99 per year</p>",
                    offer_features__limio: "<ul><li>Premium demo access</li><li>Extended trial features</li><li>Priority onboarding</li></ul>",
                }
            }
        }
    }
}

const bluelinkPlusOffer = {
    name: "Bluelink PLUS Annual Plan USD",
    quantity: 1,
    data: {
        start: "2024-07-03T00:00:00.000Z",
        record_subtype: "base",
        offer: {
            data: {
                attributes: {
                    display_name__limio: "Bluelink PLUS Annual Plan USD",
                    display_price__limio: "<p>$29.99 per year</p>",
                    offer_features__limio: "<ul><li>All Bluelink LITE features included</li><li>LIVE Traffic (visualisation)</li><li>LIVE Fuel price, LIVE Speedcam</li><li>LIVE Parking</li><li>Weather</li><li>Sports</li><li>Remote lock/unlock</li><li>Remote start/stop charging (Electric, Plug-in Hybrid Vehicle only)</li><li>Remote Climate control (Electric Vehicle only)</li><li>Remote Battery Pre-conditioning (for latest gen Electric Vehicle)</li></ul>",
                },
            }
        }
    },
}

function makeSubscription({ offers = [], addOns = [], status = "active" } = {}) {
    return {
        name: "Test Subscription",
        data: {},
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
    addOnsHeading: "You will also lose",
    primaryColor: "#002C5F",
    fallbackFeatures__limio_richtext: "<ul><li>Access to all plan features</li><li>Customer support</li><li>Regular updates</li></ul>",
    showPlanName: true,
    showPrice: true,
    offerFeaturesField: "offer_features__limio",
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
        fallbackFeatures__limio_richtext: "<ul><li>Connected Routing, Hyundai's cloud-based navigation</li><li>EV Routing & EV POI (point of interest)</li><li>Bluelink App status updates, vehicle information and send POI to car</li><li>Digital Key (optional)</li><li>Online Voice Recognition</li><li>Vehicle system OTA updates (if available for the vehicle)</li></ul>",
    },
    decorators: [withSubscriptions([makeSubscription({ offers: [baseOffer], addOns: [addonDigitalKey] })])],
}

export const BluelinkPlusWithDemoAddon = {
    args: {
        ...defaultArgs,
        heading: "Here's what you'll lose",
        addOnsHeading: "You will also lose",
    },
    decorators: [withSubscriptions([makeSubscription({ offers: [bluelinkPlusOffer], addOns: [addonDemoProduct] })])],
}
