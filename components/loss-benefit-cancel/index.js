import React, { Suspense } from "react"
import { useLimioContext, ErrorBoundary, sanitiseHTML } from "@limio/sdk"
import { getCurrentOffer } from "@limio/shop/src/shop/helpers/checks"
import { useLimioUserSubscription } from "@limio/internal-checkout-sdk"
import { useAuthModeFetch } from "@limio/shop/src/components/helpers.tsx"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

// Preview data shown in the Limio Page Builder when moustache templates are unresolved
const PAGE_BUILDER_PREVIEW = {
    planName: "Example Plan",
    displayPrice: "<p><strong>$9.99/month</strong></p>",
    featuresHtml: "<ul><li>Access to all plan features</li><li>Priority customer support</li><li>Monthly newsletter</li><li>Early access to new features</li></ul>",
    addOns: [{ name: "Example Add-On", price: "<p>$4.99/month</p>" }],
}

function isMoustache(val) {
    return typeof val === "string" && val.includes("{{")
}

function getActiveAddOns(addOns) {
    if (!Array.isArray(addOns) || addOns.length === 0) return []

    const now = new Date()
    return addOns.filter(addOn => {
        if (!["active", "pending", "pending-external"].includes(addOn.status)) return false
        const end = addOn?.data?.end ? new Date(addOn.data.end) : null
        const start = addOn?.data?.start ? new Date(addOn.data.start) : null
        if (start && start > now) return false
        if (end && end < now) return false
        return true
    })
}

function getAddOnAttributes(addOn) {
    return addOn?.data?.offer?.data?.attributes || addOn?.data?.add_on?.data?.attributes || {}
}

function formatAddOnPrice(priceObj) {
    if (!priceObj || typeof priceObj.amount !== "number") return ""
    const currency = priceObj.currency || "USD"
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(priceObj.amount)
}

// Renders the card UI — used by both live and page builder modes
function LossBenefitCard({ resolvedPlanName, resolvedPrice, resolvedFeatures, activeAddOns, props }) {
    const {
        heading = "Here's what you'll lose",
        subheading = "If you cancel your subscription, you'll no longer have access to these features:",
        addOnsHeading = "You will also lose",
        addOnDescription = "You'll also lose access to this add-on:",
        primaryColor = "#6C2D91",
        showPlanName = true,
        showPrice = true,
    } = props

    return (
        <section className="lbc-container" style={{ "--lbc-primary": primaryColor }}>
            <div className="lbc-card">
                {showPlanName && resolvedPlanName && (
                    <div className="lbc-plan-badge">
                        <span className="lbc-plan-name">{resolvedPlanName}</span>
                        {showPrice && resolvedPrice && (
                            <span
                                className="lbc-plan-price"
                                dangerouslySetInnerHTML={{ __html: sanitiseHTML(resolvedPrice) }}
                            />
                        )}
                    </div>
                )}

                <h2 className="lbc-heading">{heading}</h2>
                <p className="lbc-subheading">{subheading}</p>

                <div className="lbc-features">
                    <div
                        className="lbc-features-list"
                        dangerouslySetInnerHTML={{ __html: sanitiseHTML(resolvedFeatures) }}
                    />
                </div>

                {activeAddOns.length > 0 && (
                    <div className="lbc-addons-section">
                        <h3 className="lbc-addons-heading">{addOnsHeading}</h3>
                        <p className="lbc-addons-description">{addOnDescription}</p>
                        {activeAddOns.map((addOn, i) => {
                            const attrs = addOn?.data ? getAddOnAttributes(addOn) : {}
                            const name = attrs.display_name__limio || addOn?.data?.add_on?.name || addOn?.data?.name || addOn?.name || ""
                            const price = attrs.display_price__limio || formatAddOnPrice(addOn?.data?.price) || addOn?.price || ""

                            return (
                                <div key={i} className="lbc-addon-item">
                                    <span className="lbc-addon-name">{name}</span>
                                    {showPrice && price && (
                                        <span
                                            className="lbc-addon-price"
                                            dangerouslySetInnerHTML={{ __html: sanitiseHTML(price) }}
                                        />
                                    )}
                                    <span className="lbc-addon-tag">Add-on</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

// Live page version — fetches subscription data via Suspense hook
function LossBenefitCancelLive() {
    const props = useStaticProps() || {}
    const {
        offerFeatures__limio_richtext = "",
        fallbackFeatures__limio_richtext = "<ul><li>Access to all plan features</li><li>Customer support</li><li>Regular updates</li></ul>",
        planName = "",
        displayPrice = "",
    } = props

    const params = new URL(window.location).searchParams
    const subIdParam = params.get("subId") || ""

    const { userSubscription } = useLimioUserSubscription(subIdParam)

    // Fetch add-ons via dedicated API endpoint (workaround: useLimioUserSubscription drops addOns)
    const { data: addOnData } = useAuthModeFetch(
        `/api/mma/subscriptions/${subIdParam}/related/subscription_add_on`,
        { suspense: true }
    )

    // Get the current offer from the subscription
    const offer = userSubscription ? getCurrentOffer(userSubscription) : null
    const offerAttributes = offer?.data?.attributes || {}

    // Subscription data is primary source, non-moustache props are overrides, fallback last
    const resolvedPlanName = offerAttributes.display_name__limio || (!isMoustache(planName) && planName) || ""
    const resolvedPrice = offerAttributes.display_price__limio || (!isMoustache(displayPrice) && displayPrice) || ""
    const resolvedFeatures = offerAttributes.offer_features__limio || (!isMoustache(offerFeatures__limio_richtext) && offerFeatures__limio_richtext) || fallbackFeatures__limio_richtext

    const activeAddOns = getActiveAddOns(addOnData?.items || [])

    return (
        <LossBenefitCard
            resolvedPlanName={resolvedPlanName}
            resolvedPrice={resolvedPrice}
            resolvedFeatures={resolvedFeatures}
            activeAddOns={activeAddOns}
            props={props}
        />
    )
}

function LossBenefitCancel() {
    const { isInPageBuilder } = useLimioContext() || {}
    const props = useStaticProps() || {}

    // Page builder: show preview data directly (no subscription fetch needed)
    if (isInPageBuilder) {
        return (
            <LossBenefitCard
                resolvedPlanName={PAGE_BUILDER_PREVIEW.planName}
                resolvedPrice={PAGE_BUILDER_PREVIEW.displayPrice}
                resolvedFeatures={PAGE_BUILDER_PREVIEW.featuresHtml}
                activeAddOns={PAGE_BUILDER_PREVIEW.addOns}
                props={props}
            />
        )
    }

    // Live page: fetch subscription data with Suspense
    return (
        <ErrorBoundary
            fallback={
                <div className="lbc-container">
                    <p>Could not load subscription details.</p>
                </div>
            }
        >
            <Suspense
                fallback={
                    <div className="lbc-container">
                        <div className="lbc-card">
                            <p>Loading subscription details...</p>
                        </div>
                    </div>
                }
            >
                <LossBenefitCancelLive />
            </Suspense>
        </ErrorBoundary>
    )
}

export default LossBenefitCancel
