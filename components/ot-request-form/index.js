import React, { useEffect, useState } from "react"
import { ErrorBoundary, sanitiseHTML, useUser } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

// Posts straight to Salesforce Web-to-Lead / Web-to-Case, so an Enterprise
// enquiry becomes a Lead and a cancellation request becomes a Case in the same
// org that runs Limio for Salesforce. Salesforce's servlet does not send CORS
// headers, so the post is fire-and-forget (no-cors) and we confirm locally.
const ENDPOINT = {
    lead: "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
    case: "https://webto.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8",
}

const sanitize = (s) => sanitiseHTML(s || "")

const userEmail = (user) =>
    user?.attributes?.email || user?.email || user?.customer?.email || user?.data?.email || ""

const OtRequestForm = () => {
    const props = useStaticProps() || {}
    const {
        mode = "lead",
        orgId = "",
        kicker = "",
        title = "",
        intro = "",
        reasonLabel = "",
        reasons = [],
        leadSource = "Web",
        caseOrigin = "Web",
        caseType = "",
        caseSubject = "",
        submitLabel = "Submit",
        successTitle = "",
        successBody = "",
        backLabel = "",
        backHref = "",
        asideTitle = "",
        asideBody = "",
    } = props

    let user = null
    try {
        user = useUser()
    } catch (e) {
        user = null
    }

    const [form, setForm] = useState({ first: "", last: "", email: "", company: "", phone: "", country: "", partners: "", reason: "", details: "", subscription: "" })
    const [sent, setSent] = useState(false)
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        let selection = {}
        try {
            selection = JSON.parse(window.sessionStorage.getItem("ot-selection") || "{}")
        } catch (e) {
            selection = {}
        }
        setForm((f) => ({
            ...f,
            email: f.email || userEmail(user) || params.get("email") || "",
            subscription: params.get("subscription") || f.subscription,
            reason: params.get("reason") || f.reason,
            partners: f.partners || selection.OT_PartnerCount || "",
        }))
    }, [user])

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

    const submit = async (e) => {
        e.preventDefault()
        if (busy) return
        setBusy(true)
        const body = new URLSearchParams()
        // Web-to-Lead names the org parameter "oid"; Web-to-Case names it "orgid".
        body.append(mode === "case" ? "orgid" : "oid", orgId)
        body.append("retURL", window.location.href)
        const detail = [
            form.reason && `${reasonLabel || "Reason"}: ${form.reason}`,
            form.partners && `Trading partners: ${form.partners}`,
            form.subscription && `Subscription: ${form.subscription}`,
            form.details,
            "Submitted from the OpenText Business Network store (Limio).",
        ]
            .filter(Boolean)
            .join("\n")
        if (mode === "case") {
            body.append("name", `${form.first} ${form.last}`.trim())
            body.append("email", form.email)
            body.append("company", form.company)
            body.append("phone", form.phone)
            body.append("subject", caseSubject || title)
            body.append("description", detail)
            body.append("origin", caseOrigin)
            if (caseType) body.append("type", caseType)
            if (form.reason) body.append("reason", "Other")
            body.append("priority", "Medium")
        } else {
            body.append("first_name", form.first)
            body.append("last_name", form.last)
            body.append("email", form.email)
            body.append("company", form.company)
            body.append("phone", form.phone)
            body.append("country", form.country)
            body.append("lead_source", leadSource)
            body.append("description", detail)
        }
        try {
            await fetch(ENDPOINT[mode] || ENDPOINT.lead, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: body.toString(),
            })
        } catch (err) {
            console.error("ot-request-form: post failed", err)
        }
        setSent(true)
        setBusy(false)
    }

    return (
        <div className="ot-form">
            <div className="ot-form__inner">
                <div className="ot-form__main">
                    {kicker && <p className="ot-form__kicker">{kicker}</p>}
                    <h1 className="ot-form__title">{sent ? successTitle : title}</h1>
                    {sent ? (
                        <>
                            <div className="ot-form__intro" dangerouslySetInnerHTML={{ __html: sanitize(successBody) }} />
                            {backLabel && (
                                <a className="ot-form__btn" href={backHref}>
                                    {backLabel}
                                </a>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="ot-form__intro" dangerouslySetInnerHTML={{ __html: sanitize(intro) }} />
                            <form className="ot-form__form" onSubmit={submit}>
                                <label>
                                    First name
                                    <input required value={form.first} onChange={set("first")} autoComplete="given-name" />
                                </label>
                                <label>
                                    Last name
                                    <input required value={form.last} onChange={set("last")} autoComplete="family-name" />
                                </label>
                                <label>
                                    Work email
                                    <input required type="email" value={form.email} onChange={set("email")} autoComplete="email" />
                                </label>
                                <label>
                                    Company
                                    <input required value={form.company} onChange={set("company")} autoComplete="organization" />
                                </label>
                                <label>
                                    Phone
                                    <input value={form.phone} onChange={set("phone")} autoComplete="tel" />
                                </label>
                                {mode === "lead" ? (
                                    <label>
                                        Country
                                        <input value={form.country} onChange={set("country")} autoComplete="country-name" />
                                    </label>
                                ) : (
                                    <label>
                                        Subscription number (optional)
                                        <input value={form.subscription} onChange={set("subscription")} />
                                    </label>
                                )}
                                {mode === "lead" && (
                                    <label>
                                        How many trading partners?
                                        <input value={form.partners} onChange={set("partners")} inputMode="numeric" />
                                    </label>
                                )}
                                {(reasons || []).length > 0 && (
                                    <label className={mode === "lead" ? "" : "ot-form__wide"}>
                                        {reasonLabel}
                                        <select value={form.reason} onChange={set("reason")} required>
                                            <option value="">Choose…</option>
                                            {reasons.map((r, i) => (
                                                <option key={i} value={r.label}>
                                                    {r.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                )}
                                <label className="ot-form__wide">
                                    Anything else we should know?
                                    <textarea rows={4} value={form.details} onChange={set("details")} />
                                </label>
                                <button className="ot-form__btn" type="submit" disabled={busy}>
                                    {busy ? "Sending…" : submitLabel}
                                </button>
                            </form>
                        </>
                    )}
                </div>
                {asideTitle && (
                    <aside className="ot-form__aside">
                        <h2>{asideTitle}</h2>
                        <div dangerouslySetInnerHTML={{ __html: sanitize(asideBody) }} />
                    </aside>
                )}
            </div>
        </div>
    )
}

const Wrapped = () => (
    <ErrorBoundary fallback={<div className="ot-form" />}>
        <OtRequestForm />
    </ErrorBoundary>
)

export default Wrapped
