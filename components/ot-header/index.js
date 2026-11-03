import React, { useEffect, useState } from "react"
import { ErrorBoundary } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import { OpenTextLogo } from "./logo"
import "./index.css"

// Region is chosen on the store and buying pages and remembered per browser,
// so every page in the journey shows the same market. Keys match ot-buy.
const REGIONS = {
    NA: { label: "Americas", currency: "USD" },
    UK: { label: "United Kingdom", currency: "GBP" },
    EU: { label: "Europe", currency: "EUR" },
    APAC: { label: "Asia-Pacific", currency: "USD" },
}
const SYMBOL = { USD: "$", GBP: "£", EUR: "€" }

const readRegion = () => {
    try {
        const fromUrl = new URLSearchParams(window.location.search).get("region")
        if (fromUrl && REGIONS[fromUrl.toUpperCase()]) return fromUrl.toUpperCase()
        const stored = window.localStorage.getItem("ot-region")
        if (stored && REGIONS[stored]) return stored
    } catch (e) {
        // storage blocked: fall through to the default market
    }
    return "NA"
}

const OtHeader = () => {
    const props = useStaticProps() || {}
    const {
        logoHref = "/ot-store",
        storeLabel = "",
        items = [],
        showRegion = true,
        accountLabel = "",
        accountHref = "/ot-account",
        ctaLabel = "",
        ctaHref = "#",
    } = props

    const [region, setRegion] = useState("NA")
    const [open, setOpen] = useState(false)
    useEffect(() => {
        setRegion(readRegion())
        // ot-buy and ot-store broadcast region changes so the pill stays in sync
        const onChange = (e) => e?.detail && REGIONS[e.detail] && setRegion(e.detail)
        window.addEventListener("ot-region-change", onChange)
        return () => window.removeEventListener("ot-region-change", onChange)
    }, [])

    const here = typeof window !== "undefined" ? window.location.pathname : ""
    const r = REGIONS[region]

    return (
        <header className="ot-header">
            <div className="ot-header__inner">
                <a className="ot-header__brand" href={logoHref}>
                    <OpenTextLogo className="ot-header__logo" />
                    {storeLabel?.trim() && <span className="ot-header__store">{storeLabel}</span>}
                </a>
                <button
                    type="button"
                    className="ot-header__burger"
                    aria-label="Menu"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    <span />
                    <span />
                    <span />
                </button>
                <nav className={`ot-header__nav${open ? " ot-header__nav--open" : ""}`}>
                    {(items || []).map((item, i) => (
                        <a
                            key={i}
                            href={item.url}
                            className={`ot-header__link${here === item.url ? " ot-header__link--active" : ""}`}
                        >
                            {item.label}
                        </a>
                    ))}
                    {showRegion && r && (
                        <span className="ot-header__region" title="Prices and data centre follow your region">
                            {r.label} · {SYMBOL[r.currency]} {r.currency}
                        </span>
                    )}
                    {accountLabel?.trim() && (
                        <a className="ot-header__link ot-header__link--account" href={accountHref}>
                            {accountLabel}
                        </a>
                    )}
                    {ctaLabel?.trim() && (
                        <a className="ot-header__cta" href={ctaHref}>
                            {ctaLabel}
                        </a>
                    )}
                </nav>
            </div>
        </header>
    )
}

const Wrapped = () => (
    <ErrorBoundary fallback={<header className="ot-header" />}>
        <OtHeader />
    </ErrorBoundary>
)

export default Wrapped
