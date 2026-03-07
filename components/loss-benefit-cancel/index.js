import React from "react"
import { useSubscriptions, useLimioContext } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import { getCurrentOffer } from "../source/utils/offers"
import { parseString, encodeDates } from "../source/utils/string"
import xss from "xss"
import "./index.css"

const sanitize = (str) => xss(str || "")

function LossBenefitCancel() {
    const { isInPageBuilder } = useLimioContext() || {}
    const { subscriptions } = useSubscriptions() || {}
    const props = useStaticProps() || {}

    const {
        heading = "Here's what you'll lose",
        subheading = "If you cancel your subscription, you'll no longer have access to these features:",
        primaryColor = "#002C5F",
        dangerColor = "#dc2626",
        offerFeatures__limio_richtext: offerFeatures = "{{data.attributes.offer_features__limio}}",
        planName = "{{data.attributes.display_name__limio}}",
        displayPrice = "{{data.attributes.display_price__limio}}",
        fallbackFeatures__limio_richtext = "<ul><li>Access to all plan features</li><li>Customer support</li><li>Regular updates</li></ul>",
        showPlanName = true,
        showPrice = true,
    } = props

    // Get subscription from URL param or use the first active one
    let subscription = null
    if (!isInPageBuilder && typeof window !== "undefined") {
        try {
            const params = new URL(window.location).searchParams
            const subId = params.get("subId") || ""
            const subRef = params.get("subRef") || ""
            if (subId && Array.isArray(subscriptions)) {
                subscription = subscriptions.find(s => s?.id === subId) || null
            }
            if (!subscription && subRef && Array.isArray(subscriptions)) {
                subscription = subscriptions.find(s => s?.reference === subRef) || null
            }
        } catch (e) {
            // window.location may not be available in some contexts
        }
    }

    // Fallback to first active subscription
    if (!subscription && Array.isArray(subscriptions) && subscriptions.length > 0) {
        subscription = subscriptions.find(s => s?.status === "active") || subscriptions[0]
    }

    // Get the current offer from the subscription
    const offer = subscription ? getCurrentOffer(subscription) : null

    // Resolve moustache templates against offer data
    const resolvedFeatures = offer ? parseString(offerFeatures, offer, encodeDates) : ""
    const featuresHtml = resolvedFeatures || fallbackFeatures__limio_richtext
    const resolvedPlanName = offer ? parseString(planName, offer, encodeDates) : (subscription?.name || "")
    const resolvedPrice = offer ? parseString(displayPrice, offer, encodeDates) : ""

    return (
        <section
            className="lbc-container"
            style={{
                "--lbc-primary": primaryColor,
                "--lbc-danger": dangerColor,
            }}
        >
            <div className="lbc-card">
                <div className="lbc-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </div>

                <h2 className="lbc-heading">{heading}</h2>

                {showPlanName && resolvedPlanName && (
                    <div className="lbc-plan-badge">
                        <span className="lbc-plan-name">{resolvedPlanName}</span>
                        {showPrice && resolvedPrice && (
                            <span
                                className="lbc-plan-price"
                                dangerouslySetInnerHTML={{ __html: sanitize(resolvedPrice) }}
                            />
                        )}
                    </div>
                )}

                <p className="lbc-subheading">{subheading}</p>

                <div className="lbc-features">
                    <div
                        className="lbc-features-list"
                        dangerouslySetInnerHTML={{ __html: sanitize(featuresHtml) }}
                    />
                </div>
            </div>
        </section>
    )
}

export default LossBenefitCancel
