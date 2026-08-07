import React, { useEffect, useMemo, useState } from "react"
import { ErrorBoundary } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

// Timezone -> ISO country. Enough coverage for the markets ALLDATA sell into;
// the routing table itself lives in props, so adding a market is a config edit.
const TZ_COUNTRY = {
    "Europe/London": "GB",
    "Europe/Dublin": "IE",
    "Europe/Berlin": "DE",
    "Europe/Vienna": "AT",
    "Europe/Zurich": "CH",
    "Europe/Brussels": "BE",
    "Europe/Amsterdam": "NL",
    "Europe/Paris": "FR",
    "Europe/Rome": "IT",
    "Europe/Madrid": "ES",
    "Europe/Warsaw": "PL",
    "Europe/Prague": "CZ",
    "Europe/Copenhagen": "DK",
    "Europe/Stockholm": "SE",
    "Europe/Helsinki": "FI",
    "Europe/Oslo": "NO",
    "Europe/Lisbon": "PT",
    "Europe/Luxembourg": "LU",
    "Europe/Budapest": "HU",
    "Europe/Bucharest": "RO",
    "Europe/Bratislava": "SK",
    "Europe/Athens": "GR",
    "Europe/Zagreb": "HR",
    "Europe/Ljubljana": "SI",
    "Europe/Sofia": "BG",
    "Europe/Tallinn": "EE",
    "Europe/Riga": "LV",
    "Europe/Vilnius": "LT",
    "America/New_York": "US",
    "America/Chicago": "US",
    "America/Denver": "US",
    "America/Phoenix": "US",
    "America/Los_Angeles": "US",
    "America/Anchorage": "US",
    "Pacific/Honolulu": "US",
    "America/Toronto": "CA",
    "America/Vancouver": "CA",
    "America/Edmonton": "CA",
    "America/Winnipeg": "CA",
    "America/Halifax": "CA",
    "Australia/Sydney": "AU",
    "Australia/Melbourne": "AU",
    "Australia/Brisbane": "AU",
    "Australia/Perth": "AU",
}

const readQueryCountry = () => {
    try {
        const q = new URLSearchParams(window.location.search)
        const c = q.get("country") || q.get("region")
        return c ? c.trim().toUpperCase() : ""
    } catch (e) {
        return ""
    }
}

const readLocaleCountry = () => {
    try {
        const langs = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language]
        for (const tag of langs) {
            const parts = String(tag || "").split("-")
            if (parts.length > 1) {
                const region = parts[parts.length - 1].toUpperCase()
                if (/^[A-Z]{2}$/.test(region)) return region
            }
        }
    } catch (e) {
        /* ignore */
    }
    return ""
}

const readTimezoneCountry = () => {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        return TZ_COUNTRY[tz] || ""
    } catch (e) {
        return ""
    }
}

// Explicit override first (so a market can be forced), then the browser's own
// signals. No third-party geo-IP call, so nothing to block and nothing to wait on.
const detectCountry = () => {
    const override = readQueryCountry()
    if (override) return { country: override, source: "override" }
    const tz = readTimezoneCountry()
    if (tz) return { country: tz, source: "timezone" }
    const locale = readLocaleCountry()
    if (locale) return { country: locale, source: "language" }
    return { country: "", source: "unknown" }
}

const parseCountries = (str) =>
    String(str || "")
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)

const AdGeoRoute = () => {
    const props = useStaticProps() || {}
    const {
        headline = "",
        subheadline = "",
        manualPrompt = "",
        redirectDelayMs = 900,
        autoRedirect = true,
        fallbackUrl = "/ad-us-pro",
        routes = [],
        componentId = "geo-route",
    } = props

    const [detected, setDetected] = useState(null)

    useEffect(() => {
        setDetected(detectCountry())
    }, [])

    const target = useMemo(() => {
        if (!detected) return null
        const match = (routes || []).find((r) =>
            parseCountries(r?.countries).includes(detected.country)
        )
        return {
            url: match?.url || fallbackUrl,
            label: match?.label || "",
            matched: !!match,
        }
    }, [detected, routes, fallbackUrl])

    useEffect(() => {
        if (!autoRedirect || !target?.url) return undefined
        const delay = Number(redirectDelayMs)
        const ms = Number.isFinite(delay) ? Math.max(0, delay) : 0
        const timer = setTimeout(() => {
            window.location.assign(target.url)
        }, ms)
        return () => clearTimeout(timer)
    }, [autoRedirect, target, redirectDelayMs])

    return (
        <section id={componentId} className="ad-geo-route">
            <div className="ad-geo-route__inner">
                <div className="ad-geo-route__spinner" aria-hidden="true" />
                {headline?.trim() && (
                    <h1 className="ad-geo-route__headline">{headline}</h1>
                )}
                {subheadline?.trim() && (
                    <p className="ad-geo-route__subheadline">{subheadline}</p>
                )}

                {detected && (
                    <p className="ad-geo-route__detected">
                        <span className="ad-geo-route__code">
                            {detected.country || "??"}
                        </span>
                        {target?.matched
                            ? ` detected — routing to ${target.label}`
                            : " not matched — using the default shop"}
                        <span className="ad-geo-route__source">
                            via {detected.source}
                        </span>
                    </p>
                )}

                {manualPrompt?.trim() && (
                    <p className="ad-geo-route__prompt">{manualPrompt}</p>
                )}
                <div className="ad-geo-route__links">
                    {(routes || []).map((r, i) => (
                        <a
                            key={r?.url || i}
                            className="ad-geo-route__link"
                            href={r?.url || "#"}
                        >
                            {r?.label}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

AdGeoRoute.Error = () => (
    <section className="ad-geo-route">
        <div className="ad-geo-route__inner">
            <p className="ad-geo-route__subheadline">
                Choose your region to continue.
            </p>
            <div className="ad-geo-route__links">
                <a className="ad-geo-route__link" href="/ad-us-pro">
                    United States
                </a>
                <a className="ad-geo-route__link" href="/ad-uk-diy">
                    United Kingdom
                </a>
                <a className="ad-geo-route__link" href="/ad-eu-diy">
                    Europe
                </a>
            </div>
        </div>
    </section>
)

const Wrapped = () => (
    <ErrorBoundary fallback={<AdGeoRoute.Error />}>
        <AdGeoRoute />
    </ErrorBoundary>
)

export default Wrapped
