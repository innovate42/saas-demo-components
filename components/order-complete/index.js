import React, { useMemo } from "react"
import { useCheckout } from "@limio/internal-checkout-sdk"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const sanitize = (str) => xss(str || "")

const formatPrice = (amount, currency, locale) => {
    if (amount == null) return null
    try {
        return new Intl.NumberFormat(locale || "en-US", {
            style: "currency",
            currency: currency || "USD"
        }).format(amount)
    } catch {
        return `${currency || "$"}${amount}`
    }
}

const formatDate = (dateStr, locale) => {
    try {
        return new Date(dateStr).toLocaleDateString(locale || "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    } catch {
        return dateStr
    }
}

const OrderComplete = () => {
    const props = useStaticProps() || {}
    const { useCheckoutSelector } = useCheckout()
    const checkoutState = useCheckoutSelector(state => state) || {}
    const { order = {}, paidSchedule = {}, schedule = {}, locale } = checkoutState

    const {
        heading = "Order Confirmed",
        successMessage = "Thank you for your purchase! A confirmation email has been sent.",
        orderSummaryTitle = "Order Summary",
        onboardingTitle = "Get Started",
        primaryColor__limio_color: primaryColor = "#635BFF",
        successColor__limio_color: successColor = "#30D158",
        ctaText = "Go to Dashboard",
        ctaUrl = "/",
        onboardingSteps = []
    } = props

    // Extract data from the single order item
    const orderItem = order?.orderItems?.[0]
    const offer = orderItem?.offer
    const attrs = offer?.data?.attributes || {}
    const products = offer?.data?.products || []
    const productCode = products[0]?.attributes?.product_code__limio || "default"

    const email = order?.customerDetails?.email || ""
    const planName = attrs.display_name__limio || attrs.group__limio || "Your Plan"

    const price = useMemo(() => formatPrice(paidSchedule.amount, paidSchedule.currency, locale), [paidSchedule, locale])
    const renewalPrice = useMemo(() => formatPrice(schedule.amount, schedule.currency, locale), [schedule, locale])
    const today = formatDate(new Date().toISOString(), locale)

    // Group configured steps by product code, then resolve matching steps
    const activeSteps = useMemo(() => {
        if (!onboardingSteps?.length) return []
        const groups = {}
        onboardingSteps.forEach(step => {
            const code = (step.productCode || "default").trim()
            if (!groups[code]) groups[code] = []
            groups[code].push(step)
        })
        return groups[productCode] || groups["default"] || []
    }, [onboardingSteps, productCode])

    return (
        <div className="oc-page" style={{ "--oc-primary": primaryColor, "--oc-success": successColor }}>
            <div className="oc-container">
                {/* Success header */}
                <div className="oc-header">
                    <div className="oc-check-circle">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="oc-heading">{heading}</h1>
                    <p className="oc-subtext">
                        {email
                            ? <>{successMessage} We've sent the details to <strong>{email}</strong>.</>
                            : successMessage
                        }
                    </p>
                </div>

                {/* Order summary card */}
                <div className="oc-card">
                    <h2 className="oc-card-title">{orderSummaryTitle}</h2>
                    <dl className="oc-details">
                        <div className="oc-detail-row">
                            <dt>Plan</dt>
                            <dd>{planName}</dd>
                        </div>
                        {price && (
                            <div className="oc-detail-row">
                                <dt>Amount paid</dt>
                                <dd>{price}</dd>
                            </div>
                        )}
                        {renewalPrice && renewalPrice !== price && (
                            <div className="oc-detail-row">
                                <dt>Renewal price</dt>
                                <dd>{renewalPrice}</dd>
                            </div>
                        )}
                        <div className="oc-detail-row">
                            <dt>Date</dt>
                            <dd>{today}</dd>
                        </div>
                        {email && (
                            <div className="oc-detail-row">
                                <dt>Email</dt>
                                <dd>{email}</dd>
                            </div>
                        )}
                        {productCode && productCode !== "default" && (
                            <div className="oc-detail-row">
                                <dt>Product</dt>
                                <dd className="oc-mono">{productCode}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Onboarding steps card */}
                {activeSteps.length > 0 && (
                    <div className="oc-card">
                        <h2 className="oc-card-title">{onboardingTitle}</h2>
                        <ol className="oc-steps">
                            {activeSteps.map((step, i) => (
                                <li key={i} className="oc-step">
                                    <div className="oc-step-marker">
                                        <span className="oc-step-num">{i + 1}</span>
                                        {i < activeSteps.length - 1 && <span className="oc-step-connector" />}
                                    </div>
                                    <div className="oc-step-body">
                                        {step.stepUrl ? (
                                            <a href={step.stepUrl} className="oc-step-link">{step.stepTitle}</a>
                                        ) : (
                                            <h3 className="oc-step-title">{step.stepTitle}</h3>
                                        )}
                                        {step.stepDescription && (
                                            <p className="oc-step-desc">{step.stepDescription}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* CTA button */}
                <a href={ctaUrl} className="oc-cta">
                    {ctaText}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

export default OrderComplete
