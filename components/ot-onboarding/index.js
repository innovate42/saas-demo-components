import React, { useEffect, useState } from "react"
import { ErrorBoundary, sanitiseHTML } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

// Order-confirmation onboarding: turns "thanks for your order" into a guided
// start. The recap comes from what ot-buy stored for this checkout; the
// assistant button opens the Limio onboarding agent (window.LimioChat).

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

const Icon = ({ name }) => {
    const paths = {
        chat: "M4 5h16v11H8l-4 4V5Z",
        users: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 1a2.5 2.5 0 1 0 0-5M3 19c0-3 2.7-5 6-5s6 2 6 5M15 14c3 0 5 1.6 5 4",
        plug: "M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8Zm6 9v4",
        test: "M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3",
        flag: "M5 21V4m0 0h11l-2 4 2 4H5",
    }
    return (
        <svg viewBox="0 0 24 24" className="ot-onb__icon" aria-hidden="true">
            <path d={paths[name] || paths.flag} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

const OtOnboarding = () => {
    const props = useStaticProps() || {}
    const {
        kicker = "",
        headline = "",
        subheadline = "",
        steps = [],
        timelineTitle = "",
        timeline = [],
        assistantTitle = "",
        assistantBody = "",
        assistantCta = "",
        assistantFallbackHref = "",
        secondaryLinks = [],
    } = props

    const [sel, setSel] = useState({})
    const [hint, setHint] = useState("")
    useEffect(() => setSel(readSelection()), [])

    const startAssistant = () => {
        if (!openAssistant()) {
            if (assistantFallbackHref) {
                window.location.href = assistantFallbackHref
            } else {
                setHint("The assistant is starting up. Look for the chat button at the bottom right.")
            }
        }
    }

    const partners = (sel.partners && sel.partners.length ? sel.partners : (sel.OT_TradingPartners || "").split(";"))
        .map((p) => String(p).trim())
        .filter(Boolean)

    const recap = [
        sel.OT_Product && { label: "Product", value: sel.OT_Product },
        sel.OT_ERP && !String(sel.OT_ERP).startsWith("n/a") && { label: "ERP", value: sel.OT_ERP },
        partners.length > 0 && { label: "Trading partners", value: `${partners.length}` },
        sel.OT_DataCentre && { label: "Data centre", value: sel.OT_DataCentre },
        sel.OT_Onboarding && { label: "Onboarding", value: sel.OT_Onboarding },
    ].filter(Boolean)

    return (
        <div className="ot-onb">
            <section className="ot-onb__hero">
                <div className="ot-onb__inner ot-onb__hero-grid">
                    <div>
                        <p className="ot-onb__kicker">
                            <span className="ot-onb__tick">✓</span> {kicker}
                        </p>
                        <h1 className="ot-onb__headline">{headline}</h1>
                        <div className="ot-onb__sub" dangerouslySetInnerHTML={{ __html: sanitize(subheadline) }} />
                        <div className="ot-onb__hero-actions">
                            <button type="button" className="ot-onb__btn" onClick={startAssistant}>
                                {assistantCta}
                            </button>
                            {(secondaryLinks || []).slice(0, 1).map((l, i) => (
                                <a key={i} className="ot-onb__btn ot-onb__btn--ghost" href={l.href}>
                                    {l.label}
                                </a>
                            ))}
                        </div>
                        {hint && <p className="ot-onb__hint">{hint}</p>}
                    </div>
                    {recap.length > 0 && (
                        <aside className="ot-onb__recap">
                            <h2>Your order</h2>
                            <dl>
                                {recap.map((r) => (
                                    <div key={r.label}>
                                        <dt>{r.label}</dt>
                                        <dd>{r.value}</dd>
                                    </div>
                                ))}
                            </dl>
                            {partners.length > 0 && (
                                <ul className="ot-onb__partners">
                                    {partners.map((p) => (
                                        <li key={p}>{p}</li>
                                    ))}
                                </ul>
                            )}
                        </aside>
                    )}
                </div>
            </section>

            <section className="ot-onb__inner ot-onb__steps-wrap">
                <h2 className="ot-onb__h2">Get started in four steps</h2>
                <ol className="ot-onb__steps">
                    {(steps || []).map((s, i) => (
                        <li key={i} className={`ot-onb__step${i === 0 ? " ot-onb__step--now" : ""}`}>
                            <div className="ot-onb__step-head">
                                <span className="ot-onb__step-n">{i + 1}</span>
                                <Icon name={s.icon} />
                                {s.when && <span className="ot-onb__when">{s.when}</span>}
                            </div>
                            <h3>{s.title}</h3>
                            <p>{s.body}</p>
                            {s.cta &&
                                (s.action === "assistant" ? (
                                    <button type="button" className="ot-onb__link" onClick={startAssistant}>
                                        {s.cta} →
                                    </button>
                                ) : (
                                    <a className="ot-onb__link" href={s.href}>
                                        {s.cta} →
                                    </a>
                                ))}
                        </li>
                    ))}
                </ol>
            </section>

            {(timeline || []).length > 0 && (
                <section className="ot-onb__inner ot-onb__timeline-wrap">
                    <h2 className="ot-onb__h2">{timelineTitle}</h2>
                    <div className="ot-onb__timeline">
                        {timeline.map((t, i) => (
                            <div key={i} className="ot-onb__milestone">
                                <span className="ot-onb__day">{t.day}</span>
                                <span className="ot-onb__dot" />
                                <strong>{t.title}</strong>
                                <span>{t.body}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="ot-onb__band">
                <div className="ot-onb__inner ot-onb__band-inner">
                    <div>
                        <h2>{assistantTitle}</h2>
                        <div dangerouslySetInnerHTML={{ __html: sanitize(assistantBody) }} />
                    </div>
                    <button type="button" className="ot-onb__btn ot-onb__btn--light" onClick={startAssistant}>
                        {assistantCta}
                    </button>
                </div>
            </section>

            {(secondaryLinks || []).length > 1 && (
                <section className="ot-onb__inner ot-onb__links">
                    {secondaryLinks.slice(1).map((l, i) => (
                        <a key={i} href={l.href}>
                            {l.label} →
                        </a>
                    ))}
                </section>
            )}
        </div>
    )
}

const Wrapped = () => (
    <ErrorBoundary fallback={<div className="ot-onb" />}>
        <OtOnboarding />
    </ErrorBoundary>
)

export default Wrapped
