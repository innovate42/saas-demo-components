import React, { useEffect, useState } from "react"
import { ErrorBoundary, sanitiseHTML } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const REGIONS = {
    NA: { currency: "USD" },
    UK: { currency: "GBP" },
    EU: { currency: "EUR" },
    APAC: { currency: "USD" },
}
const LOCALE = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" }
// Monthly prices mirror the OT offers in the catalog (see the agent's knowledge).
const PRICES = {
    starter: { USD: 149, GBP: 119, EUR: 139 },
    plus: { USD: 299, GBP: 239, EUR: 279 },
    f5: { USD: 499, GBP: 399, EUR: 449 },
    f10: { USD: 899, GBP: 719, EUR: 829 },
}

const money = (n, c) => {
    try {
        return new Intl.NumberFormat(LOCALE[c] || "en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n)
    } catch (e) {
        return `${n} ${c}`
    }
}

const readRegion = () => {
    try {
        const fromUrl = new URLSearchParams(window.location.search).get("region")
        if (fromUrl && REGIONS[fromUrl.toUpperCase()]) return fromUrl.toUpperCase()
        const stored = window.localStorage.getItem("ot-region")
        if (stored && REGIONS[stored]) return stored
    } catch (e) {
        // storage blocked
    }
    return "NA"
}

// The Limio chat embed (window.LimioChat) loads after the page; wait for it
// briefly so a click right after load still opens the assistant.
const openChat = () => {
    let tries = 0
    const attempt = () => {
        if (window.LimioChat && typeof window.LimioChat.open === "function") {
            window.LimioChat.open()
        } else if (tries++ < 20) {
            setTimeout(attempt, 250)
        }
    }
    attempt()
}

const OtHelpMeChoose = () => {
    const props = useStaticProps() || {}
    const {
        kicker = "",
        headline = "",
        subheadline = "",
        startLabel = "",
        customerLabel = "",
        stepsTitle = "",
        steps = [],
        plansTitle = "",
        plans = [],
        customerTitle = "",
        customerBody = "",
    } = props

    const [region, setRegion] = useState("NA")
    useEffect(() => {
        setRegion(readRegion())
        const onChange = (e) => e?.detail && REGIONS[e.detail] && setRegion(e.detail)
        window.addEventListener("ot-region-change", onChange)
        return () => window.removeEventListener("ot-region-change", onChange)
    }, [])
    const currency = REGIONS[region].currency

    return (
        <div className="ot-hmc">
            <section className="ot-hmc__hero">
                <div className="ot-hmc__inner">
                    {kicker && <p className="ot-hmc__kicker">{kicker}</p>}
                    <h1 className="ot-hmc__headline">{headline}</h1>
                    <div className="ot-hmc__sub" dangerouslySetInnerHTML={{ __html: sanitiseHTML(subheadline || "") }} />
                    <div className="ot-hmc__actions">
                        <button type="button" className="ot-hmc__cta" onClick={openChat}>
                            {startLabel}
                        </button>
                        <button type="button" className="ot-hmc__cta ot-hmc__cta--ghost" onClick={openChat}>
                            {customerLabel}
                        </button>
                    </div>
                </div>
            </section>

            <section className="ot-hmc__inner ot-hmc__steps-wrap">
                <h2 className="ot-hmc__h2">{stepsTitle}</h2>
                <ol className="ot-hmc__steps">
                    {(steps || []).map((s, i) => (
                        <li key={i}>
                            <span className="ot-hmc__step-n">{i + 1}</span>
                            <strong>{s.title}</strong>
                            <span>{s.body}</span>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="ot-hmc__plans-wrap">
                <div className="ot-hmc__inner">
                    <h2 className="ot-hmc__h2">{plansTitle}</h2>
                    <div className="ot-hmc__plans">
                        {(plans || []).map((p, i) => {
                            const price = PRICES[p.key]
                            return (
                                <a key={i} className="ot-hmc__plan" href={p.href}>
                                    <span className="ot-hmc__plan-family">{p.family}</span>
                                    <strong className="ot-hmc__plan-title">{p.title}</strong>
                                    <span className="ot-hmc__plan-body">{p.body}</span>
                                    <span className="ot-hmc__plan-price">
                                        {price ? (
                                            <>
                                                <strong>{money(price[currency], currency)}</strong>/month
                                            </>
                                        ) : (
                                            <strong>Tailored pricing</strong>
                                        )}
                                    </span>
                                </a>
                            )
                        })}
                    </div>
                </div>
            </section>

            {customerTitle && (
                <section className="ot-hmc__band">
                    <div className="ot-hmc__inner ot-hmc__band-inner">
                        <div>
                            <h2>{customerTitle}</h2>
                            <p>{customerBody}</p>
                        </div>
                        <button type="button" className="ot-hmc__cta ot-hmc__cta--light" onClick={openChat}>
                            {customerLabel}
                        </button>
                    </div>
                </section>
            )}
        </div>
    )
}

const Wrapped = () => (
    <ErrorBoundary fallback={<div className="ot-hmc" />}>
        <OtHelpMeChoose />
    </ErrorBoundary>
)

export default Wrapped
