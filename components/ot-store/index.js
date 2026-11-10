import React, { useEffect, useState } from "react"
import { ErrorBoundary, sanitiseHTML } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const REGIONS = {
    NA: { label: "Americas", currency: "USD" },
    UK: { label: "United Kingdom", currency: "GBP" },
    EU: { label: "Europe", currency: "EUR" },
    APAC: { label: "Asia-Pacific", currency: "USD" },
}
const LOCALE = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" }
// "From" prices mirror the cheapest monthly offer of each family in the catalog.
const FROM = {
    essentials: { USD: 149, GBP: 119, EUR: 139 },
    tradinggrid: { USD: 499, GBP: 399, EUR: 449 },
}

const money = (n, c) => {
    try {
        return new Intl.NumberFormat(LOCALE[c] || "en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n)
    } catch (e) {
        return `${n} ${c}`
    }
}

const sanitize = (s) => sanitiseHTML(s || "")

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

// Three questions route a visitor to the right product, the way a seller
// would qualify them on a call.
const QUIZ = [
    {
        q: "How do you create orders and invoices today?",
        a: [
            { label: "By hand, in a portal or spreadsheet", score: { essentials: 2 } },
            { label: "In our ERP (NetSuite, SAP, Dynamics…)", score: { tradinggrid: 2 } },
        ],
    },
    {
        q: "How many trading partners ask you for EDI?",
        a: [
            { label: "1 – 5", score: { essentials: 1 } },
            { label: "5 – 15", score: { tradinggrid: 1 } },
            { label: "More than 15", score: { enterprise: 3 } },
        ],
    },
    {
        q: "Who will run the integration?",
        a: [
            { label: "We'd like to do it ourselves", score: { essentials: 1, tradinggrid: 1 } },
            { label: "We want OpenText to set it up", score: { tradinggrid: 1 } },
            { label: "Our IT team, with custom requirements", score: { enterprise: 2 } },
        ],
    },
]

const OtStore = () => {
    const props = useStaticProps() || {}
    const {
        kicker = "",
        headline = "",
        subheadline = "",
        products = [],
        statsTitle = "",
        stats = [],
        stepsTitle = "",
        steps = [],
        quizTitle = "",
        quizChatLabel = "",
        quizChatHref = "/ot-help-me-choose",
        bandTitle = "",
        bandBody = "",
        bandCta = "",
        bandHref = "/ot-enterprise",
    } = props

    const [region, setRegion] = useState("NA")
    const [answers, setAnswers] = useState({})
    useEffect(() => {
        setRegion(readRegion())
        const onChange = (e) => e?.detail && REGIONS[e.detail] && setRegion(e.detail)
        window.addEventListener("ot-region-change", onChange)
        return () => window.removeEventListener("ot-region-change", onChange)
    }, [])

    const currency = REGIONS[region].currency
    const done = Object.keys(answers).length === QUIZ.length
    const scores = { essentials: 0, tradinggrid: 0, enterprise: 0 }
    Object.entries(answers).forEach(([qi, ai]) => {
        const s = QUIZ[qi].a[ai].score
        Object.entries(s).forEach(([k, v]) => (scores[k] += v))
    })
    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
    const winnerCard = (products || []).find((p) => p.key === winner)

    return (
        <div className="ot-store">
            <section className="ot-store__hero">
                <div className="ot-store__inner">
                    {kicker && <p className="ot-store__kicker">{kicker}</p>}
                    <h1 className="ot-store__headline">{headline}</h1>
                    <div className="ot-store__sub" dangerouslySetInnerHTML={{ __html: sanitize(subheadline) }} />
                </div>
            </section>

            <section className="ot-store__inner ot-store__products">
                {(products || []).map((p) => {
                    const from = FROM[p.key]
                    return (
                        <article key={p.key} className={`ot-store__card${p.featured ? " ot-store__card--featured" : ""}`}>
                            {p.badge && <span className="ot-store__badge">{p.badge}</span>}
                            <p className="ot-store__card-kicker">{p.kicker}</p>
                            <h2 className="ot-store__card-title">{p.title}</h2>
                            <div className="ot-store__card-body" dangerouslySetInnerHTML={{ __html: sanitize(p.body) }} />
                            <p className="ot-store__price">
                                {from ? (
                                    <>
                                        From <strong>{money(from[currency], currency)}</strong>/month
                                    </>
                                ) : (
                                    <strong>{p.priceText}</strong>
                                )}
                            </p>
                            <a className={`ot-store__cta${p.featured ? "" : " ot-store__cta--outline"}`} href={p.href}>
                                {p.cta}
                            </a>
                            {p.cta2 && p.href2 && (
                                <a className="ot-store__cta2" href={p.href2}>
                                    {p.cta2} <span aria-hidden="true">→</span>
                                </a>
                            )}
                        </article>
                    )
                })}
            </section>

            <section className="ot-store__quiz-wrap">
                <div className="ot-store__inner">
                    <h2 className="ot-store__h2">{quizTitle}</h2>
                    <div className="ot-store__quiz">
                        {QUIZ.map((item, qi) => (
                            <div key={qi} className="ot-store__q">
                                <p>{item.q}</p>
                                <div className="ot-store__answers">
                                    {item.a.map((a, ai) => (
                                        <button
                                            key={ai}
                                            type="button"
                                            className={`ot-store__answer${answers[qi] === ai ? " ot-store__answer--on" : ""}`}
                                            onClick={() => setAnswers({ ...answers, [qi]: ai })}
                                        >
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {quizChatLabel && (
                        <p className="ot-store__quiz-chat">
                            <a href={quizChatHref}>{quizChatLabel}</a>
                        </p>
                    )}
                    {done && winnerCard && (
                        <div className="ot-store__verdict">
                            <span>
                                We recommend <strong>{winnerCard.title}</strong>
                            </span>
                            <a className="ot-store__cta" href={winnerCard.href}>
                                {winnerCard.cta}
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {(stats || []).length > 0 && (
                <section className="ot-store__inner ot-store__stats-wrap">
                    <h2 className="ot-store__h2">{statsTitle}</h2>
                    <div className="ot-store__stats">
                        {stats.map((s, i) => (
                            <div key={i} className="ot-store__stat">
                                <strong>{s.value}</strong>
                                <span>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {(steps || []).length > 0 && (
                <section className="ot-store__inner ot-store__steps-wrap">
                    <h2 className="ot-store__h2">{stepsTitle}</h2>
                    <ol className="ot-store__steps">
                        {steps.map((s, i) => (
                            <li key={i}>
                                <span className="ot-store__step-n">{i + 1}</span>
                                <strong>{s.title}</strong>
                                <span>{s.body}</span>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {bandTitle && (
                <section className="ot-store__band">
                    <div className="ot-store__inner ot-store__band-inner">
                        <div>
                            <h2>{bandTitle}</h2>
                            <p>{bandBody}</p>
                        </div>
                        <a className="ot-store__cta ot-store__cta--light" href={bandHref}>
                            {bandCta}
                        </a>
                    </div>
                </section>
            )}
        </div>
    )
}

const Wrapped = () => (
    <ErrorBoundary fallback={<div className="ot-store" />}>
        <OtStore />
    </ErrorBoundary>
)

export default Wrapped
