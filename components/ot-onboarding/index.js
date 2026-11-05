import React, { Suspense, useEffect, useState } from "react"
import { ErrorBoundary, sanitiseHTML } from "@limio/sdk"
import { useCompleteCheckoutSession } from "@limio/internal-checkout-sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

// Order confirmation, in the order a customer reads it: "Order complete" with
// the reference, plan and total, then ONE next step — the onboarding assistant
// (window.LimioChat, opened by ot-onboarding-chat) — then a single line on what
// happens after. The order comes from the completed checkout session; what
// ot-buy stored for this checkout fills any gaps.

const sanitize = (s) => sanitiseHTML(s || "")

const readSelection = () => {
    try {
        return JSON.parse(window.sessionStorage.getItem("ot-selection") || "{}")
    } catch (e) {
        return {}
    }
}

const openAssistant = () => {
    try {
        if (window.LimioChat && typeof window.LimioChat.open === "function") {
            window.LimioChat.open()
            return true
        }
    } catch (e) {
        // widget not mounted
    }
    return false
}

const money = (value, currency) => {
    const n = Number(value)
    if (!Number.isFinite(n) || n <= 0) return ""
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency || "USD",
            minimumFractionDigits: n % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2,
        }).format(n)
    } catch (e) {
        return `${n} ${currency || ""}`.trim()
    }
}

const fill = (template, vars) => String(template || "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "")

const attrs = (o) => o?.data?.attributes || {}
const charge = (o) => attrs(o).price__limio?.[0] || {}

// Receipt line + reference/plan/total/partners. Pure, so it renders both from
// the completed order and, while that loads, from what ot-buy stored.
const OrderDetails = ({ order = {}, sel = {}, successBody, successBodyNoEmail }) => {
    const items = Array.isArray(order.orderItems) ? order.orderItems : []
    const base = items.find((i) => i?.offer && i.type !== "add_on") || items.find((i) => i?.offer)
    const orderTotal = items.reduce((sum, i) => sum + (Number(charge(i.offer).value) || 0) * (Number(i.quantity) || 1), 0)
    const currency = charge(base?.offer).currencyCode || order.currency || sel.currency || "USD"
    const per = sel.per || (attrs(base?.offer).group__limio === "yearly" ? "year" : "month")

    const reference = order.order_reference || ""
    const email = order.customerDetails?.email || ""
    const plan = attrs(base?.offer).display_name__limio || sel.plan || sel.OT_Product || ""
    const total = money(orderTotal || sel.total, currency)
    const partners = Number(sel.OT_PartnerCount) || 0

    const facts = [
        reference && { label: "Order", value: reference },
        plan && { label: "Plan", value: plan },
        total && { label: "Total", value: `${total}/${per === "year" ? "yr" : "mo"}` },
        partners > 0 && { label: "Trading partners", value: String(partners) },
    ].filter(Boolean)

    return (
        <>
            <p className="ot-onb__receipt">{email ? fill(successBody, { email }) : successBodyNoEmail}</p>
            {facts.length > 0 && (
                <dl className="ot-onb__facts">
                    {facts.map((f) => (
                        <div key={f.label}>
                            <dt>{f.label}</dt>
                            <dd>{f.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </>
    )
}

// The completed-checkout hook suspends until the order loads (seconds when the
// page is opened without a fresh order), so it lives here, under its own
// Suspense, instead of holding back the whole page.
const CompletedOrderDetails = (props) => {
    const { useCheckoutSelector } = useCompleteCheckoutSession?.() || {}
    const order = useCheckoutSelector?.((s) => s?.order) || {}
    return <OrderDetails {...props} order={order} />
}

const OtOnboarding = () => {
    const props = useStaticProps() || {}
    const {
        successTitle = "",
        successBody = "",
        successBodyNoEmail = "",
        nextKicker = "",
        nextTitle = "",
        nextBody = "",
        nextCta = "",
        assistantFallbackHref = "",
        whatsNextLabel = "",
        whatsNext = "",
        secondaryLinks = [],
    } = props

    const [sel, setSel] = useState({})
    const [hint, setHint] = useState("")
    useEffect(() => setSel(readSelection()), [])
    const details = { sel, successBody, successBodyNoEmail }

    const startAssistant = () => {
        if (!openAssistant()) {
            if (assistantFallbackHref) {
                window.location.href = assistantFallbackHref
            } else {
                setHint("The assistant is starting up. It opens at the bottom right.")
            }
        }
    }

    return (
        <div className="ot-onb">
            <div className="ot-onb__wrap">
                <section className="ot-onb__done" aria-labelledby="ot-onb-done">
                    <span className="ot-onb__check" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <div className="ot-onb__done-text">
                        <h1 id="ot-onb-done" className="ot-onb__title">
                            {successTitle}
                        </h1>
                    </div>
                    <div className="ot-onb__details">
                        <Suspense fallback={<OrderDetails {...details} />}>
                            <CompletedOrderDetails {...details} />
                        </Suspense>
                    </div>
                </section>

                <section className="ot-onb__next" aria-labelledby="ot-onb-next">
                    <div className="ot-onb__next-text">
                        {nextKicker && <p className="ot-onb__kicker">{nextKicker}</p>}
                        <h2 id="ot-onb-next" className="ot-onb__next-title">
                            {nextTitle}
                        </h2>
                        {nextBody && <div className="ot-onb__next-body" dangerouslySetInnerHTML={{ __html: sanitize(nextBody) }} />}
                        {hint && <p className="ot-onb__hint">{hint}</p>}
                    </div>
                    {nextCta && (
                        <button type="button" className="ot-onb__btn" onClick={startAssistant}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M4 5h16v11H8l-4 4V5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                            </svg>
                            {nextCta}
                        </button>
                    )}
                </section>

                {whatsNext && (
                    <p className="ot-onb__whatsnext">
                        {whatsNextLabel && <strong>{whatsNextLabel}</strong>} {whatsNext}
                    </p>
                )}

                {(secondaryLinks || []).length > 0 && (
                    <nav className="ot-onb__links">
                        {secondaryLinks.map((l, i) => (
                            <a key={i} href={l.href}>
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </div>
        </div>
    )
}

const Wrapped = () => (
    <ErrorBoundary fallback={<div className="ot-onb" />}>
        <OtOnboarding />
    </ErrorBoundary>
)

export default Wrapped
