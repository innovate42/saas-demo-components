import React, { useEffect, useRef, useState } from "react"
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

// Line icons for the Products menu, picked by each entry's "icon" key.
const ICONS = {
    portal: "M4 5h16v11H4zM8 20h8M12 16v4",
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    enterprise: "M4 20V8l8-4 8 4v12M9 20v-6h6v6M8 10h.01M12 10h.01M16 10h.01",
    plug: "M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5",
    partners: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 2.5-5 5-5s5 2 5 5M11 20c0-3 2.5-5 5-5s5 2 5 5",
    onboarding: "M5 12l4 4L19 6",
    support: "M4 13v-1a8 8 0 0 1 16 0v1M4 13h3v5H4zM17 13h3v5h-3z",
}

const Icon = ({ name }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ot-header__icon">
        <path d={ICONS[name] || ICONS.grid} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

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

// Products entries in their "group" columns, keeping the order they were entered in.
const groupProducts = (products) => {
    const groups = []
    ;(products || []).forEach((p) => {
        const name = p.group || ""
        let g = groups.find((x) => x.name === name)
        if (!g) groups.push((g = { name, items: [] }))
        g.items.push(p)
    })
    return groups
}

const OtHeader = () => {
    const props = useStaticProps() || {}
    const {
        logoHref = "/ot-store",
        storeLabel = "",
        productsLabel = "",
        products = [],
        featureKicker = "",
        featureTitle = "",
        featureText = "",
        featureLinkLabel = "",
        featureHref = "",
        items = [],
        showRegion = true,
        accountLabel = "",
        accountHref = "/ot-account",
        ctaLabel = "",
        ctaHref = "#",
    } = props

    const [region, setRegion] = useState("NA")
    const [open, setOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)
    const closeTimer = useRef(null)

    useEffect(() => {
        setRegion(readRegion())
        const onChange = (e) => e?.detail && REGIONS[e.detail] && setRegion(e.detail)
        window.addEventListener("ot-region-change", onChange)
        return () => window.removeEventListener("ot-region-change", onChange)
    }, [])

    // Close the Products panel on Escape or a click elsewhere
    useEffect(() => {
        if (!menuOpen) return
        const onKey = (e) => e.key === "Escape" && setMenuOpen(false)
        const onClick = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false)
        document.addEventListener("keydown", onKey)
        document.addEventListener("mousedown", onClick)
        return () => {
            document.removeEventListener("keydown", onKey)
            document.removeEventListener("mousedown", onClick)
        }
    }, [menuOpen])

    const choose = (key) => {
        setRegion(key)
        try {
            window.localStorage.setItem("ot-region", key)
        } catch (e) {
            // storage blocked: the choice still applies to this page
        }
        window.dispatchEvent(new CustomEvent("ot-region-change", { detail: key }))
    }

    // Hover opens the panel on desktop; a short delay lets the pointer cross the gap.
    const isDesktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 961px)").matches
    const hoverOpen = () => {
        if (!isDesktop()) return
        clearTimeout(closeTimer.current)
        setMenuOpen(true)
    }
    const hoverClose = () => {
        if (!isDesktop()) return
        clearTimeout(closeTimer.current)
        closeTimer.current = setTimeout(() => setMenuOpen(false), 150)
    }

    const here = typeof window !== "undefined" ? window.location.pathname : ""
    const r = REGIONS[region]
    const groups = groupProducts(products)
    const productActive = (products || []).some((p) => p.url === here)
    const showProducts = productsLabel?.trim() && groups.length > 0

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
                    {showProducts && (
                        <div className="ot-header__menu" ref={menuRef} onMouseEnter={hoverOpen} onMouseLeave={hoverClose}>
                            <button
                                type="button"
                                className={`ot-header__link ot-header__menu-toggle${productActive ? " ot-header__link--active" : ""}${menuOpen ? " ot-header__menu-toggle--open" : ""}`}
                                aria-expanded={menuOpen}
                                aria-haspopup="true"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                {productsLabel}
                                <svg viewBox="0 0 12 12" aria-hidden="true" className="ot-header__chevron">
                                    <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            </button>
                            <div className={`ot-header__panel${menuOpen ? " ot-header__panel--open" : ""}`}>
                                <div className="ot-header__panel-inner">
                                    {featureTitle?.trim() && (
                                        <a className="ot-header__feature" href={featureHref || "#"}>
                                            {featureKicker?.trim() && <span className="ot-header__feature-kicker">{featureKicker}</span>}
                                            <span className="ot-header__feature-title">{featureTitle}</span>
                                            {featureText?.trim() && <span className="ot-header__feature-text">{featureText}</span>}
                                            {featureLinkLabel?.trim() && <span className="ot-header__feature-link">{featureLinkLabel} ›</span>}
                                        </a>
                                    )}
                                    <div className="ot-header__groups">
                                        {groups.map((g, gi) => (
                                            <div className="ot-header__group" key={gi}>
                                                {g.name && <p className="ot-header__group-title">{g.name}</p>}
                                                {g.items.map((p, i) => (
                                                    <a
                                                        key={i}
                                                        href={p.url}
                                                        className={`ot-header__product${here === p.url ? " ot-header__product--active" : ""}`}
                                                    >
                                                        <Icon name={p.icon} />
                                                        <span>
                                                            <span className="ot-header__product-label">{p.label}</span>
                                                            {p.description && <span className="ot-header__product-desc">{p.description}</span>}
                                                        </span>
                                                    </a>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
                        <label className="ot-header__region" title={`${r.label}: prices, currency and data centre follow your region`}>
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="ot-header__globe">
                                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                                <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                            </svg>
                            <span className="ot-header__region-value">
                                {SYMBOL[r.currency]} {r.currency}
                            </span>
                            <svg viewBox="0 0 12 12" aria-hidden="true" className="ot-header__chevron">
                                <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
