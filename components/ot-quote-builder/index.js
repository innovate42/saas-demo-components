import React, { useEffect, useMemo, useState } from "react"
import { ErrorBoundary, useCampaign, useLimioContext, sanitiseHTML } from "@limio/sdk"
import { sendOrder, getRecaptchaToken } from "@limio/shop/src/shop/helpers/postRequests.ts"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

// Self-serve quote for Trading Grid Enterprise. The buyer describes their
// network; the quote is priced from the catalog offers and add-ons on the page
// (label ottg): the Trading Grid bundle with the most partners, plus extra
// trading partners, ERP adapters, premium support and guided onboarding.
//
// Submitting sends a standalone `data_capture` order. Limio's Salesforce plugin
// publishes it as an i42as__OrderEvent__e (Type DATA_CAPTURE, LimioOrder = the
// `data` below) and OTQuoteRequestHandler creates the Account, Contact,
// Opportunity and Limio quote. The event field holds 32k characters, so only
// catalog paths and quantities travel; Salesforce reads the offers from Limio.

const REGIONS = {
    NA: { label: "Americas", currency: "USD", dataCentre: "North America" },
    UK: { label: "United Kingdom", currency: "GBP", dataCentre: "EMEA (UK)" },
    EU: { label: "Europe", currency: "EUR", dataCentre: "EMEA (EU)" },
    APAC: { label: "Asia-Pacific", currency: "USD", dataCentre: "Asia-Pacific" },
}
const LOCALE = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" }

const COUNTRIES = [
    ["US", "United States"],
    ["CA", "Canada"],
    ["MX", "Mexico"],
    ["BR", "Brazil"],
    ["GB", "United Kingdom"],
    ["IE", "Ireland"],
    ["DE", "Germany"],
    ["FR", "France"],
    ["NL", "Netherlands"],
    ["BE", "Belgium"],
    ["ES", "Spain"],
    ["IT", "Italy"],
    ["AT", "Austria"],
    ["PT", "Portugal"],
    ["AU", "Australia"],
    ["NZ", "New Zealand"],
    ["SG", "Singapore"],
    ["JP", "Japan"],
    ["IN", "India"],
]
const DEFAULT_COUNTRY = { NA: "US", UK: "GB", EU: "DE", APAC: "AU" }

const ERPS = [
    "Oracle NetSuite",
    "SAP S/4HANA",
    "SAP ECC",
    "SAP Business One",
    "Dynamics 365 Finance & Operations",
    "Dynamics 365 Business Central",
    "Oracle E-Business Suite",
    "Infor CloudSuite",
    "Epicor Kinetic",
    "Sage Intacct",
    "Acumatica",
    "Other / several",
]
const INDUSTRIES = ["Retail & consumer goods", "Grocery", "Automotive", "Health & pharmacy", "Distribution & logistics", "Manufacturing", "Other"]
const EMPLOYEES = ["50 – 249", "250 – 999", "1,000 – 4,999", "5,000+"]
const VOLUMES = ["Up to 25,000 documents a month", "25,000 – 100,000", "100,000 – 500,000", "More than 500,000"]
const TRADE_REGIONS = ["North America", "Latin America", "UK & Europe", "Asia-Pacific"]

const money = (value, currency) => {
    const n = Number(value)
    if (!Number.isFinite(n)) return ""
    try {
        return new Intl.NumberFormat(LOCALE[currency] || "en-US", {
            style: "currency",
            currency: currency || "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(n)
    } catch (e) {
        return `${n} ${currency}`
    }
}

const attrs = (o) => o?.data?.attributes || {}
const charge = (o) => attrs(o).price__limio?.[0] || {}
const priceOf = (o) => Number(charge(o).value) || 0
const currencyOf = (o) => charge(o).currencyCode || "USD"
const nameOf = (o) => attrs(o).display_name__limio || o?.name || ""
const pathOf = (o) => o?.path || o?.data?.path || ""
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

const quoteRef = () => {
    const d = new Date()
    const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
    return `OTQ-${ymd}-${rand}`
}

const addDays = (days) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d
}

const isoDate = (d) => d.toISOString().slice(0, 10)

const longDate = (iso) => {
    try {
        return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    } catch (e) {
        return iso
    }
}

const EMPTY = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    company: "",
    website: "",
    industry: "",
    employees: "",
    country: "",
    taxId: "",
    erp: "",
    partners: "",
    keyPartners: "",
    volume: VOLUMES[1],
    tradeRegions: ["North America"],
    termYears: "3",
    startDate: "",
    erpAdapters: "1",
    premiumSupport: true,
    guidedOnboarding: true,
    managedServices: false,
    billingSame: true,
    billingName: "",
    billingEmail: "",
    addressLine1: "",
    city: "",
    state: "",
    postcode: "",
    billingCountry: "",
    techName: "",
    techEmail: "",
    poRequired: false,
    poNumber: "",
    taxExempt: "",
    comments: "",
}

const Section = ({ n, title, hint, children }) => (
    <section className="ot-qb__section">
        <div className="ot-qb__section-head">
            <span className="ot-qb__num">{n}</span>
            <div>
                <h2 className="ot-qb__section-title">{title}</h2>
                {hint && <p className="ot-qb__hint">{hint}</p>}
            </div>
        </div>
        <div className="ot-qb__grid">{children}</div>
    </section>
)

const Field = ({ label, wide, optional, children }) => (
    <label className={`ot-qb__field${wide ? " ot-qb__wide" : ""}`}>
        <span>
            {label}
            {optional && <em> (optional)</em>}
        </span>
        {children}
    </label>
)

const OtQuoteBuilder = () => {
    const { offers = [], addOns = [] } = useCampaign() || {}
    const { isInPageBuilder } = useLimioContext() || {}
    const props = useStaticProps() || {}
    const {
        kicker = "",
        title = "",
        intro = "",
        basePlanKey = "4",
        defaultPartners = "25",
        managedServicesLabel = "",
        validityDays = "30",
        submitLabel = "Create my quote",
        successTitle = "",
        successBody = "",
        asideTitle = "",
        termsNote = "",
        backLabel = "",
        backHref = "/ot-store",
    } = props

    const [region, setRegion] = useState("NA")
    const [form, setForm] = useState({ ...EMPTY, partners: defaultPartners })
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState("")
    const [sent, setSent] = useState(null)

    useEffect(() => {
        const r = readRegion()
        setRegion(r)
        setForm((f) => ({
            ...f,
            country: f.country || DEFAULT_COUNTRY[r],
            billingCountry: f.billingCountry || DEFAULT_COUNTRY[r],
            startDate: f.startDate || isoDate(addDays(30)),
        }))
        const onChange = (e) => e?.detail && REGIONS[e.detail] && setRegion(e.detail)
        window.addEventListener("ot-region-change", onChange)
        return () => window.removeEventListener("ot-region-change", onChange)
    }, [])

    const set = (k) => (e) => {
        const v = e.target.type === "checkbox" ? e.target.checked : e.target.value
        setForm((f) => ({ ...f, [k]: v }))
    }
    const toggleTradeRegion = (name) =>
        setForm((f) => ({
            ...f,
            tradeRegions: f.tradeRegions.includes(name) ? f.tradeRegions.filter((x) => x !== name) : [...f.tradeRegions, name],
        }))

    const currency = REGIONS[region].currency

    // Annual offers only: Enterprise is quoted on annual terms.
    const basePlan = useMemo(() => {
        const annual = offers.filter(
            (o) => currencyOf(o) === currency && attrs(o).group__limio === "yearly" && attrs(o).product_family__limio === "tradinggrid"
        )
        return (
            annual.find((o) => String(attrs(o).tier_rank__limio) === String(basePlanKey)) ||
            annual.sort((a, b) => (attrs(b).trading_partners__limio || 0) - (attrs(a).trading_partners__limio || 0))[0]
        )
    }, [offers, currency, basePlanKey])

    const addon = (key) =>
        addOns.find((a) => attrs(a).addon_key__limio === key && currencyOf(a) === currency && ["onetime", "yearly"].includes(attrs(a).group__limio || "yearly"))

    const partners = Math.max(1, parseInt(form.partners, 10) || 0)
    const included = attrs(basePlan).trading_partners__limio || 0
    const extraPartners = Math.max(0, partners - included)
    const adapters = Math.max(0, parseInt(form.erpAdapters, 10) || 0)
    const years = Math.max(1, parseInt(form.termYears, 10) || 1)

    const lines = useMemo(() => {
        if (!basePlan) return []
        const out = [{ kind: "plan", item: basePlan, quantity: 1, label: `${nameOf(basePlan)} (${included} partners included)` }]
        const xp = addon("extra_trading_partner")
        if (xp && extraPartners > 0) out.push({ kind: "addon", item: xp, quantity: extraPartners, label: `Additional trading partners × ${extraPartners}` })
        const erp = addon("erp_adapter")
        if (erp && adapters > 0) out.push({ kind: "addon", item: erp, quantity: adapters, label: `ERP adapter × ${adapters}` })
        const ps = addon("premium_support")
        if (ps && form.premiumSupport) out.push({ kind: "addon", item: ps, quantity: 1, label: nameOf(ps) || "Premium support" })
        const go = addon("guided_onboarding")
        if (go && form.guidedOnboarding) out.push({ kind: "addon", item: go, quantity: 1, label: nameOf(go) || "Guided onboarding", oneTime: true })
        return out
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basePlan, extraPartners, adapters, form.premiumSupport, form.guidedOnboarding, currency, addOns])

    const annual = lines.filter((l) => !l.oneTime).reduce((s, l) => s + priceOf(l.item) * l.quantity, 0)
    const oneTime = lines.filter((l) => l.oneTime).reduce((s, l) => s + priceOf(l.item) * l.quantity, 0)
    const contractValue = annual * years + oneTime

    const validUntil = isoDate(addDays(parseInt(validityDays, 10) || 30))

    const submit = async (e) => {
        e.preventDefault()
        if (busy || !basePlan) return
        setBusy(true)
        setError("")
        const ref = quoteRef()
        const billing = form.billingSame
            ? { name: `${form.firstName} ${form.lastName}`.trim(), email: form.email }
            : { name: form.billingName, email: form.billingEmail }
        const data = {
            form: "ot_quote_request",
            quote_ref: ref,
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            companyName: form.company,
            contact: { first_name: form.firstName, last_name: form.lastName, email: form.email, phone: form.phone, job_title: form.jobTitle },
            company: {
                name: form.company,
                website: form.website,
                industry: form.industry,
                employees: form.employees,
                country: form.country,
                tax_id: form.taxId,
            },
            needs: {
                product: "Trading Grid Enterprise",
                erp: form.erp,
                trading_partners: partners,
                key_partners: form.keyPartners,
                documents_per_month: form.volume,
                trade_regions: form.tradeRegions,
                data_centre: REGIONS[region].dataCentre,
                region,
                term_years: years,
                start_date: form.startDate,
                managed_services: form.managedServices,
            },
            billing_contact: billing,
            billing_address: {
                line1: form.addressLine1,
                city: form.city,
                state: form.state,
                postcode: form.postcode,
                country: form.billingCountry,
            },
            technical_contact: { name: form.techName, email: form.techEmail },
            po_required: form.poRequired,
            po_number: form.poNumber,
            tax_exempt: form.taxExempt,
            comments: form.comments,
            currency,
            // The plan is the parent line; the add-ons hang off it, as in a Limio quote.
            lines: [
                {
                    path: pathOf(basePlan),
                    quantity: 1,
                    addOns: lines.filter((l) => l.kind === "addon").map((l) => ({ path: pathOf(l.item), quantity: l.quantity })),
                },
            ],
            estimate: { annual, one_time: oneTime, contract_value: contractValue, term_years: years, currency },
            valid_until: validUntil,
            page: typeof window !== "undefined" ? window.location.pathname : "",
        }
        try {
            let token
            try {
                token = await getRecaptchaToken("dataCaptureForm")
            } catch (err) {
                token = undefined
            }
            const res = await sendOrder({ order_type: "data_capture", data }, token ? { "x-limio-recaptcha": token } : {})
            if (res && res.error) throw new Error(res.error)
            setSent({ ref, lines, annual, oneTime, contractValue, years, currency, validUntil, company: form.company })
            window.scrollTo({ top: 0, behavior: "smooth" })
        } catch (err) {
            console.error("ot-quote-builder: submit failed", err)
            setError("We couldn't create your quote just now. Please try again in a moment.")
        }
        setBusy(false)
    }

    if (!offers.length && !isInPageBuilder) return null

    const summary = (s) => (
        <div className="ot-qb__summary">
            <table className="ot-qb__lines">
                <tbody>
                    {s.lines.map((l, i) => (
                        <tr key={i}>
                            <td>{l.label}</td>
                            <td className="ot-qb__amt">
                                {money(priceOf(l.item) * l.quantity, s.currency)}
                                <small>{l.oneTime ? " one-off" : " /yr"}</small>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="ot-qb__totals">
                <div>
                    <span>Annual subscription</span>
                    <strong>{money(s.annual, s.currency)}</strong>
                </div>
                {s.oneTime > 0 && (
                    <div>
                        <span>One-off onboarding</span>
                        <strong>{money(s.oneTime, s.currency)}</strong>
                    </div>
                )}
                <div className="ot-qb__tcv">
                    <span>
                        Total over {s.years} year{s.years > 1 ? "s" : ""}
                    </span>
                    <strong>{money(s.contractValue, s.currency)}</strong>
                </div>
            </div>
        </div>
    )

    if (sent) {
        return (
            <div className="ot-qb">
                <div className="ot-qb__inner ot-qb__inner--done">
                    <div className="ot-qb__main">
                        <p className="ot-qb__kicker">Quote {sent.ref}</p>
                        <h1 className="ot-qb__title">{successTitle}</h1>
                        <div className="ot-qb__intro" dangerouslySetInnerHTML={{ __html: sanitize(successBody) }} />
                        <dl className="ot-qb__meta">
                            <div>
                                <dt>Prepared for</dt>
                                <dd>{sent.company}</dd>
                            </div>
                            <div>
                                <dt>Quote reference</dt>
                                <dd>{sent.ref}</dd>
                            </div>
                            <div>
                                <dt>Valid until</dt>
                                <dd>{longDate(sent.validUntil)}</dd>
                            </div>
                        </dl>
                        {summary(sent)}
                        <div className="ot-qb__actions">
                            <button type="button" className="ot-qb__btn" onClick={() => window.print()}>
                                Download PDF
                            </button>
                            {backLabel && (
                                <a className="ot-qb__btn ot-qb__btn--ghost" href={backHref}>
                                    {backLabel}
                                </a>
                            )}
                        </div>
                        <div className="ot-qb__small" dangerouslySetInnerHTML={{ __html: sanitize(termsNote) }} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="ot-qb">
            <div className="ot-qb__inner">
                <form className="ot-qb__main" onSubmit={submit}>
                    {kicker && <p className="ot-qb__kicker">{kicker}</p>}
                    <h1 className="ot-qb__title">{title}</h1>
                    <div className="ot-qb__intro" dangerouslySetInnerHTML={{ __html: sanitize(intro) }} />

                    <Section n="1" title="About you">
                        <Field label="First name">
                            <input required value={form.firstName} onChange={set("firstName")} autoComplete="given-name" />
                        </Field>
                        <Field label="Last name">
                            <input required value={form.lastName} onChange={set("lastName")} autoComplete="family-name" />
                        </Field>
                        <Field label="Work email">
                            <input required type="email" value={form.email} onChange={set("email")} autoComplete="email" />
                        </Field>
                        <Field label="Phone" optional>
                            <input value={form.phone} onChange={set("phone")} autoComplete="tel" />
                        </Field>
                        <Field label="Job title" optional wide>
                            <input value={form.jobTitle} onChange={set("jobTitle")} autoComplete="organization-title" />
                        </Field>
                    </Section>

                    <Section n="2" title="Your company">
                        <Field label="Company name">
                            <input required value={form.company} onChange={set("company")} autoComplete="organization" />
                        </Field>
                        <Field label="Website" optional>
                            <input value={form.website} onChange={set("website")} placeholder="example.com" />
                        </Field>
                        <Field label="Industry">
                            <select required value={form.industry} onChange={set("industry")}>
                                <option value="">Choose…</option>
                                {INDUSTRIES.map((x) => (
                                    <option key={x}>{x}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Employees">
                            <select required value={form.employees} onChange={set("employees")}>
                                <option value="">Choose…</option>
                                {EMPLOYEES.map((x) => (
                                    <option key={x}>{x}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Country">
                            <select required value={form.country} onChange={set("country")}>
                                {COUNTRIES.map(([code, name]) => (
                                    <option key={code} value={code}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Tax / VAT ID" optional>
                            <input value={form.taxId} onChange={set("taxId")} />
                        </Field>
                    </Section>

                    <Section n="3" title="Your trading network" hint="This sizes your Trading Grid plan.">
                        <Field label="Main ERP">
                            <select required value={form.erp} onChange={set("erp")}>
                                <option value="">Choose…</option>
                                {ERPS.map((x) => (
                                    <option key={x}>{x}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Number of trading partners">
                            <input required type="number" min="1" max="5000" value={form.partners} onChange={set("partners")} />
                        </Field>
                        <Field label="Document volume">
                            <select value={form.volume} onChange={set("volume")}>
                                {VOLUMES.map((x) => (
                                    <option key={x}>{x}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="ERP adapters needed">
                            <input type="number" min="0" max="20" value={form.erpAdapters} onChange={set("erpAdapters")} />
                        </Field>
                        <div className="ot-qb__field ot-qb__wide">
                            <span>Where do you trade?</span>
                            <div className="ot-qb__chips">
                                {TRADE_REGIONS.map((x) => (
                                    <button
                                        type="button"
                                        key={x}
                                        className={`ot-qb__chip${form.tradeRegions.includes(x) ? " ot-qb__chip--on" : ""}`}
                                        onClick={() => toggleTradeRegion(x)}
                                        aria-pressed={form.tradeRegions.includes(x)}
                                    >
                                        {x}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Field label="Key trading partners" optional wide>
                            <input value={form.keyPartners} onChange={set("keyPartners")} placeholder="e.g. Walmart, Target, Home Depot" />
                        </Field>
                    </Section>

                    <Section n="4" title="Term and services">
                        <Field label="Commitment">
                            <select value={form.termYears} onChange={set("termYears")}>
                                <option value="1">1 year</option>
                                <option value="2">2 years</option>
                                <option value="3">3 years</option>
                            </select>
                        </Field>
                        <Field label="Preferred start date">
                            <input type="date" value={form.startDate} onChange={set("startDate")} />
                        </Field>
                        <label className="ot-qb__check ot-qb__wide">
                            <input type="checkbox" checked={form.premiumSupport} onChange={set("premiumSupport")} />
                            <span>
                                Premium support <small>24/7, 1-hour response</small>
                            </span>
                        </label>
                        <label className="ot-qb__check ot-qb__wide">
                            <input type="checkbox" checked={form.guidedOnboarding} onChange={set("guidedOnboarding")} />
                            <span>
                                Guided onboarding <small>we map and test your first partners</small>
                            </span>
                        </label>
                        {managedServicesLabel && (
                            <label className="ot-qb__check ot-qb__wide">
                                <input type="checkbox" checked={form.managedServices} onChange={set("managedServices")} />
                                <span>{managedServicesLabel}</span>
                            </label>
                        )}
                    </Section>

                    <Section n="5" title="Billing and contacts">
                        <label className="ot-qb__check ot-qb__wide">
                            <input type="checkbox" checked={form.billingSame} onChange={set("billingSame")} />
                            <span>I'm the billing contact</span>
                        </label>
                        {!form.billingSame && (
                            <>
                                <Field label="Billing contact name">
                                    <input required value={form.billingName} onChange={set("billingName")} />
                                </Field>
                                <Field label="Billing contact email">
                                    <input required type="email" value={form.billingEmail} onChange={set("billingEmail")} />
                                </Field>
                            </>
                        )}
                        <Field label="Billing address" wide>
                            <input required value={form.addressLine1} onChange={set("addressLine1")} autoComplete="address-line1" />
                        </Field>
                        <Field label="City">
                            <input required value={form.city} onChange={set("city")} autoComplete="address-level2" />
                        </Field>
                        <Field label="State / province" optional>
                            <input value={form.state} onChange={set("state")} autoComplete="address-level1" />
                        </Field>
                        <Field label="ZIP / postcode">
                            <input required value={form.postcode} onChange={set("postcode")} autoComplete="postal-code" />
                        </Field>
                        <Field label="Billing country">
                            <select value={form.billingCountry} onChange={set("billingCountry")}>
                                {COUNTRIES.map(([code, name]) => (
                                    <option key={code} value={code}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Technical contact name" optional>
                            <input value={form.techName} onChange={set("techName")} />
                        </Field>
                        <Field label="Technical contact email" optional>
                            <input type="email" value={form.techEmail} onChange={set("techEmail")} />
                        </Field>
                        <label className="ot-qb__check ot-qb__wide">
                            <input type="checkbox" checked={form.poRequired} onChange={set("poRequired")} />
                            <span>We need a purchase order number on the invoice</span>
                        </label>
                        {form.poRequired && (
                            <Field label="PO number" optional wide>
                                <input value={form.poNumber} onChange={set("poNumber")} />
                            </Field>
                        )}
                        <Field label="Tax exemption details" optional wide>
                            <textarea rows={2} value={form.taxExempt} onChange={set("taxExempt")} />
                        </Field>
                    </Section>

                    <Section n="6" title="Anything else?">
                        <Field label="Comments" optional wide>
                            <textarea rows={3} value={form.comments} onChange={set("comments")} />
                        </Field>
                    </Section>

                    {error && <p className="ot-qb__error">{error}</p>}
                    <button className="ot-qb__btn ot-qb__btn--submit" type="submit" disabled={busy || !basePlan}>
                        {busy ? "Creating your quote…" : submitLabel}
                    </button>
                </form>

                <aside className="ot-qb__aside">
                    <h2>{asideTitle}</h2>
                    <p className="ot-qb__aside-sub">
                        {partners} trading partner{partners > 1 ? "s" : ""} · {REGIONS[region].dataCentre} data centre · {currency}
                    </p>
                    {summary({ lines, annual, oneTime, contractValue, years, currency })}
                    <div className="ot-qb__small" dangerouslySetInnerHTML={{ __html: sanitize(termsNote) }} />
                </aside>
            </div>
        </div>
    )
}

const Wrapped = () => (
    <ErrorBoundary fallback={<div className="ot-qb" />}>
        <OtQuoteBuilder />
    </ErrorBoundary>
)

export default Wrapped
