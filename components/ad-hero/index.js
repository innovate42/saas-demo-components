import React from "react"
import { ErrorBoundary, sanitiseHTML } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const sanitize = (str) => sanitiseHTML(str || "")

const PillGroup = ({ label, items, name }) => {
    if (!Array.isArray(items) || items.length === 0) return null
    return (
        <div className="ad-hero__pill-group">
            {label?.trim() && <span className="ad-hero__pill-label">{label}</span>}
            <div className="ad-hero__pills" role="group" aria-label={label || name}>
                {items.map((item, i) => (
                    <a
                        key={item?.href || i}
                        href={item?.href || "#"}
                        className={`ad-hero__pill${item?.active ? " ad-hero__pill--active" : ""}`}
                        aria-current={item?.active ? "page" : undefined}
                    >
                        {item?.label}
                    </a>
                ))}
            </div>
        </div>
    )
}

const AdHero = () => {
    const props = useStaticProps() || {}
    const {
        kicker = "",
        headline = "",
        subheadline = "",
        trustLine = "",
        ctaText = "",
        ctaHref = "#plans",
        secondaryCtaText = "",
        secondaryCtaHref = "",
        regionLabel = "",
        regions = [],
        journeyLabel = "",
        journeys = [],
        componentId = "hero",
    } = props

    return (
        <section id={componentId} className="ad-hero">
            <div className="ad-hero__inner">
                <div className="ad-hero__switchers">
                    <PillGroup label={journeyLabel} items={journeys} name="journey" />
                    <PillGroup label={regionLabel} items={regions} name="region" />
                </div>

                {kicker?.trim() && <p className="ad-hero__kicker">{kicker}</p>}
                {headline?.trim() && <h1 className="ad-hero__headline">{headline}</h1>}
                {subheadline?.trim() && (
                    <div
                        className="ad-hero__subheadline"
                        dangerouslySetInnerHTML={{ __html: sanitize(subheadline) }}
                    />
                )}

                {(ctaText?.trim() || secondaryCtaText?.trim()) && (
                    <div className="ad-hero__actions">
                        {ctaText?.trim() && (
                            <a className="ad-hero__cta" href={ctaHref || "#plans"}>
                                {ctaText}
                            </a>
                        )}
                        {secondaryCtaText?.trim() && (
                            <a
                                className="ad-hero__cta ad-hero__cta--secondary"
                                href={secondaryCtaHref || "#"}
                            >
                                {secondaryCtaText}
                            </a>
                        )}
                    </div>
                )}

                {trustLine?.trim() && (
                    <p className="ad-hero__trust">
                        <svg
                            className="ad-hero__trust-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            aria-hidden="true"
                        >
                            <path d="M12 3l7 3v5c0 4.5-2.9 8.4-7 10-4.1-1.6-7-5.5-7-10V6l7-3z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        {trustLine}
                    </p>
                )}
            </div>
        </section>
    )
}

AdHero.Error = () => (
    <section className="ad-hero">
        <div className="ad-hero__inner">
            <h1 className="ad-hero__headline">ALLDATA</h1>
        </div>
    </section>
)

const Wrapped = () => (
    <ErrorBoundary fallback={<AdHero.Error />}>
        <AdHero />
    </ErrorBoundary>
)

export default Wrapped
