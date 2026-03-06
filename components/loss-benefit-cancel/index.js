import React from "react"
import { useSubscriptions, useLimioContext } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const sanitize = (str) => xss(str || "")

/**
 * Extracts the current active standard offer from a subscription.
 * Filters out discount offers and picks the one without an end date (or latest start).
 */
function getActiveOffer(subscription) {
    const offers = subscription?.offers
    if (!Array.isArray(offers) || offers.length === 0) return null

    const now = new Date()
    const standardOffers = offers.filter(o => {
        const subtype = o?.data?.record_subtype
        return subtype !== "discount"
    })

    // Find one that is currently active (started, not ended)
    const active = standardOffers.find(o => {
        const start = o?.data?.start ? new Date(o.data.start) : null
        const end = o?.data?.end ? new Date(o.data.end) : null
        if (!start) return false
        return start <= now && (!end || end > now)
    })

    // Fallback: just use the first standard offer
    return active || standardOffers[0] || offers[0] || null
}

/**
 * Gets offer_features__limio from the subscription's current offer.
 * Path: subscription.offers[].data.offer.data.attributes.offer_features__limio
 */
function getOfferFeatures(subscription) {
    const activeOffer = getActiveOffer(subscription)
    return activeOffer?.data?.offer?.data?.attributes?.offer_features__limio || null
}

/**
 * Gets the display name from the subscription's current offer.
 */
function getOfferDisplayName(subscription) {
    const activeOffer = getActiveOffer(subscription)
    return activeOffer?.data?.offer?.data?.attributes?.display_name__limio || subscription?.name || ""
}

/**
 * Gets the display price from the subscription's current offer.
 */
function getOfferDisplayPrice(subscription) {
    const activeOffer = getActiveOffer(subscription)
    return activeOffer?.data?.offer?.data?.attributes?.display_price__limio || ""
}

function LossBenefitCancel() {
    const { isInPageBuilder } = useLimioContext() || {}
    const { subscriptions } = useSubscriptions() || {}
    const props = useStaticProps() || {}

    const {
        heading = "Here's what you'll lose",
        subheading = "If you cancel your subscription, you'll no longer have access to these features:",
        ctaKeepLabel = "Keep my subscription",
        ctaCancelLabel = "Continue with cancellation",
        keepRedirectUrl = "/account",
        cancelRedirectUrl = "/cancel-survey",
        primaryColor = "#002C5F",
        dangerColor = "#dc2626",
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

    // Extract data safely
    const featuresHtml = getOfferFeatures(subscription) || fallbackFeatures__limio_richtext
    const planName = getOfferDisplayName(subscription)
    const displayPrice = getOfferDisplayPrice(subscription)

    // Build redirect URLs with subscription context
    const buildUrl = (baseUrl) => {
        if (!subscription || !baseUrl) return baseUrl || "#"
        const separator = baseUrl.includes("?") ? "&" : "?"
        const subParam = subscription.id ? `subId=${encodeURIComponent(subscription.id)}` : ""
        return subParam ? `${baseUrl}${separator}${subParam}` : baseUrl
    }

    const handleKeep = () => {
        if (typeof window !== "undefined") {
            window.location.href = buildUrl(keepRedirectUrl)
        }
    }

    const handleCancel = () => {
        if (typeof window !== "undefined") {
            window.location.href = buildUrl(cancelRedirectUrl)
        }
    }

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

                {showPlanName && planName && (
                    <div className="lbc-plan-badge">
                        <span className="lbc-plan-name">{planName}</span>
                        {showPrice && displayPrice && (
                            <span
                                className="lbc-plan-price"
                                dangerouslySetInnerHTML={{ __html: sanitize(displayPrice) }}
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

                <div className="lbc-actions">
                    <button className="lbc-btn lbc-btn-keep" onClick={handleKeep}>
                        {ctaKeepLabel}
                    </button>
                    <button className="lbc-btn lbc-btn-cancel" onClick={handleCancel}>
                        {ctaCancelLabel}
                    </button>
                </div>
            </div>
        </section>
    )
}

export default LossBenefitCancel
