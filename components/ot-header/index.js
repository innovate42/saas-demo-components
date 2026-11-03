import React, { useEffect, useState } from "react"
import { ErrorBoundary } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import { OpenTextLogo } from "./logo"
import "./index.css"

// The header owns the region picker (like opentext.com's country selector).
// The choice is remembered per browser and broadcast with an
// "ot-region-change" event, so ot-store and ot-buy follow it. Default: USD.
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
        const onChange = (e) => e?.detail && REGIONS[e.detail] && setRegion(e.detail)
        window.addEventListener("ot-region-change", onChange)
        return () => window.removeEventListener("ot-region-change", onChange)
    }, [])

    const choose = (key) => {
        setRegion(key)
        try {
            window.localStorage.setItem("ot-region", key)
        } catch (e) {
            // storage blocked: the choice still applies to this page
        }
        window.dispatchEvent(new CustomEvent("ot-region-change", { detail: key }))
    }

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
                        <label className="ot-header__region" title="Prices, currency and data centre follow your region">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="ot-header__globe">
                                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                                <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                            </svg>
                            <select value={region} onChange={(e) => choose(e.target.value)} aria-label="Region">
                                {Object.entries(REGIONS).map(([key, val]) => (
                                    <option key={key} value={key}>
                                        {val.label} ({SYMBOL[val.currency]} {val.currency})
                                    </option>
                                ))}
                            </select>
                        </label>
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
