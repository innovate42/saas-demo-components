import React from "react"
import { ErrorBoundary, formatCurrency, useSubscriptions } from "@limio/sdk"
import { useCompleteCheckoutSession, useLimioUserSubscriptionPaymentMethods } from "@limio/internal-checkout-sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const Icon = ({ name }) => {
    const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }
    switch (name) {
        case "sparkle":
            return <svg {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></svg>
        case "seat":
            return <svg {...common}><circle cx="12" cy="7" r="3" /><path d="M5 21c0-4 3-7 7-7s7 3 7 7" /></svg>
        case "book":
            return <svg {...common}><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5z" /><path d="M8 7h6M8 11h6" /></svg>
        case "mail":
            return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
        case "podcast":
            return <svg {...common}><circle cx="12" cy="12" r="2" /><path d="M9 12a3 3 0 0 1 6 0M6 12a6 6 0 0 1 12 0M12 14v8" /></svg>
        default:
            return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 5-5" /></svg>
    }
}

const fillTemplate = (tpl, vars) => String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""))

const formatAmount = (amount, currency) => {
    if (amount == null) return ""
    try {
        return new Intl.NumberFormat("de-DE", { style: "currency", currency: currency || "EUR" }).format(Number(amount))
    } catch {
        try { return formatCurrency(amount, currency || "EUR") } catch { return `${amount} €` }
    }
}

const formatDate = (d) => {
    if (!d) return ""
    try { return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) } catch { return String(d) }
}

// Walks the Limio payment-method object — which can come back under one of
// several shapes depending on the gateway — and picks out a human brand
// label + the last4 (ported from stripe-components/order-confirmation).
const summariseCard = (pm) => {
    if (!pm) return null
    const data = pm.data || {}
    const zuora = data.zuora?.result || data.zuora_stripe_card?.result || data.CreditCard || {}
    const integration = data.integrationData?.self_service || {}
    const stripeLike = pm.card || data.card || data.stripe?.card || {}

    const last4 =
        data.last4 ||
        zuora.CreditCardMaskNumber?.slice(-4) ||
        zuora.last4 ||
        stripeLike.last4 ||
        integration.last4 ||
        pm.last4 ||
        ""

    const rawBrand =
        zuora.CreditCardType ||
        stripeLike.brand ||
        stripeLike.network ||
        integration.brand ||
        data.CreditCardType ||
        ""

    const GATEWAY_TOKENS = /^(zuora|stripe|stripe_payment_element|stripe_card|paypal_wrapper)$/i
    const brand = rawBrand && !GATEWAY_TOKENS.test(String(rawBrand)) ? rawBrand : null

    if (!brand && !last4) return null
    return { brand: brand || "Karte", last4: last4 || "" }
}

const CafeynOrderConfirmation = () => {
    const props = useStaticProps() || {}
    const {
        eyebrow, heading, subheading,
        planLabel, seatsLabel, addOnsLabel, nameLabel, emailLabel, referenceLabel,
        paymentLabel, paymentEndingText, nextChargeLabel, nextChargeJoiner,
        stepsHeading, steps = [],
        primaryCta, primaryHref, secondaryCta, secondaryHref,
        footerLinks = [],
        componentId = "cafeyn-order-confirmation",
    } = props

    // Read the just-completed order from the checkout session (NOT useUser,
    // which is the auth account — could differ from the checkout customer).
    const { useCheckoutSelector } = useCompleteCheckoutSession?.() || {}
    const order = useCheckoutSelector?.((s) => s?.order) || {}
    const {
        customerDetails = {},
        orderItems = [],
        order_reference,
        sub_reference,
        subscriptionReference,
    } = order

    const firstName = customerDetails.firstName || ""
    const lastName = customerDetails.lastName || ""
    const email = customerDetails.email || ""

    const baseItem = orderItems.find((item) => item?.offer) || {}
    const planName = baseItem.offer?.data?.attributes?.display_name__limio || ""
    const seatCount = Number(baseItem.quantity) > 1 ? Number(baseItem.quantity) : null
    const addOnNames = orderItems
        .flatMap((item) => [
            ...(Array.isArray(item.crossSell) ? item.crossSell : []),
            ...(item.type === "add_on" ? [item] : []),
        ])
        .map((a) => a?.offer?.data?.attributes?.display_name__limio || a?.data?.attributes?.display_name__limio)
        .filter(Boolean)

    const { subscriptions = [] } = useSubscriptions() || {}
    const subRef = sub_reference || subscriptionReference
    const sub = (subRef && subscriptions.find((s) => s.name === subRef || s.reference === subRef))
        || subscriptions[0]

    const subName = planName || sub?.productName || sub?.offer?.name || sub?.name || ""
    const nextDate = sub?.nextPaymentDate ?? sub?.schedule?.find?.((s) => s.type === "payment")?.date
    const nextAmount = sub?.nextPaymentAmount ?? sub?.schedule?.find?.((s) => s.type === "payment")?.amount
    const currency = sub?.currency || order.currency || "EUR"
    const reference = order_reference || subRef || sub?.id

    const subId = sub?.id
    const { payment_methods = [], paymentMethods = [] } =
        useLimioUserSubscriptionPaymentMethods?.(subId) || {}
    const paymentList = payment_methods.length ? payment_methods : paymentMethods
    const defaultPayment = paymentList.find((p) => p.default || p.isDefault) || paymentList[0]
    const cardSummary = summariseCard(defaultPayment) || summariseCard(sub?.paymentMethod)

    const rows = [
        subName && { label: planLabel, value: <span>{subName}</span> },
        seatCount && { label: seatsLabel, value: <span>{seatCount}</span> },
        addOnNames.length > 0 && { label: addOnsLabel, value: <span>{addOnNames.join(", ")}</span> },
        (firstName || lastName) && { label: nameLabel, value: <span>{`${firstName} ${lastName}`.trim()}</span> },
        email && { label: emailLabel, value: <span>{email}</span> },
        reference && { label: referenceLabel, value: <code>{reference}</code> },
        cardSummary && {
            label: paymentLabel,
            value: (
                <span>
                    {cardSummary.brand}
                    {cardSummary.last4 && <> {paymentEndingText} <strong>{cardSummary.last4}</strong></>}
                </span>
            ),
        },
        nextDate && {
            label: nextChargeLabel,
            value: (
                <span>
                    <strong>{formatAmount(nextAmount, currency)}</strong> {nextChargeJoiner} <strong>{formatDate(nextDate)}</strong>
                </span>
            ),
        },
    ].filter(Boolean)

    return (
        <section id={componentId} className="cafeyn-oc">
            <header className="cafeyn-oc__hero">
                <div className="cafeyn-oc__check" aria-hidden="true">
                    <svg viewBox="0 0 40 40" width="44" height="44">
                        <circle cx="20" cy="20" r="18" fill="none" strokeWidth="2" className="cafeyn-oc__check-ring" />
                        <path d="M12 20.5L18 26 29 14" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="cafeyn-oc__check-tick" />
                    </svg>
                </div>
                {eyebrow && <div className="cafeyn-oc__eyebrow">{eyebrow}</div>}
                {heading && <h1 className="cafeyn-oc__heading">{fillTemplate(heading, { firstName: firstName || "willkommen" })}</h1>}
                {subheading && <p className="cafeyn-oc__sub">{subheading}</p>}
            </header>

            {rows.length > 0 && (
                <div className="cafeyn-oc__summary">
                    {rows.map((row, i) => (
                        <div className="cafeyn-oc__summary-row" key={i}>
                            <span className="cafeyn-oc__summary-label">{row.label}</span>
                            <span className="cafeyn-oc__summary-value">{row.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {steps.length > 0 && (
                <div className="cafeyn-oc__steps">
                    {stepsHeading && <h2 className="cafeyn-oc__steps-heading">{stepsHeading}</h2>}
                    <ul className="cafeyn-oc__grid">
                        {steps.map((step) => (
                            <li key={step.id || step.label} className="cafeyn-oc__item">
                                <span className="cafeyn-oc__icon"><Icon name={step.icon} /></span>
                                <div className="cafeyn-oc__item-body">
                                    <div className="cafeyn-oc__item-label">{step.label}</div>
                                    {step.description && <div className="cafeyn-oc__item-desc">{step.description}</div>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="cafeyn-oc__actions">
                {primaryCta && (
                    <a href={primaryHref || "/ca-account"} className="cafeyn-oc__cta cafeyn-oc__cta--primary">
                        {primaryCta}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                )}
                {secondaryCta && (
                    <a href={secondaryHref || "#"} className="cafeyn-oc__cta cafeyn-oc__cta--ghost">{secondaryCta}</a>
                )}
            </div>

            {footerLinks.length > 0 && (
                <div className="cafeyn-oc__footer">
                    {footerLinks.map((link, i) => (
                        <React.Fragment key={link.id || i}>
                            {i > 0 && <span className="cafeyn-oc__footer-sep" aria-hidden="true">·</span>}
                            <a href={link.href || "#"} className="cafeyn-oc__footer-link">{link.label}</a>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </section>
    )
}

CafeynOrderConfirmation.Skeleton = () => (
    <div className="cafeyn-oc">
        <div className="cafeyn-oc__summary" style={{ minHeight: "12rem" }} />
    </div>
)

CafeynOrderConfirmation.Error = () => (
    <div className="cafeyn-oc">
        <p style={{ textAlign: "center" }}>
            Ihre Bestellung war erfolgreich — die Details können gerade nicht angezeigt werden. Sie erhalten in Kürze eine Bestätigung per E-Mail.
        </p>
    </div>
)

const Wrapped = () => (
    <ErrorBoundary fallback={<CafeynOrderConfirmation.Error />}>
        <CafeynOrderConfirmation />
    </ErrorBoundary>
)

export default Wrapped
