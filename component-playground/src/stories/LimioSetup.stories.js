import React, { useState, useEffect, useCallback } from "react"

const SetupWizard = () => {
    const [step, setStep] = useState(1)
    const [tenant, setTenant] = useState("")
    const [region, setRegion] = useState("eu")
    const [clientId, setClientId] = useState("")
    const [clientSecret, setClientSecret] = useState("")
    const [connecting, setConnecting] = useState(false)
    const [error, setError] = useState(null)
    const [connectedUrl, setConnectedUrl] = useState("")

    // Auto-detect existing config
    useEffect(() => {
        fetch("/api/limio/status")
            .then(r => r.json())
            .then(data => {
                if (data.configured) {
                    setTenant(data.tenant || "")
                    setRegion(data.region || "eu")
                    setConnectedUrl(data.baseUrl || "")
                    setStep(3)
                }
            })
            .catch(() => {})
    }, [])

    const handleConnect = useCallback(async () => {
        if (!tenant || !clientId || !clientSecret || connecting) return
        setConnecting(true)
        setError(null)
        try {
            const res = await fetch("/api/limio/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tenant, region, clientId, clientSecret }),
            })
            const data = await res.json()
            if (res.ok) {
                setConnectedUrl(data.baseUrl)
                setStep(3)
            } else {
                setError(data.error || "Connection failed")
            }
        } catch (err) {
            setError(err.message)
        }
        setConnecting(false)
    }, [tenant, region, clientId, clientSecret, connecting])

    const urlPreview = tenant
        ? region === "us" ? `${tenant}.prod-us.limio.com` : region === "dev" ? `${tenant}.dev.limio.com` : `${tenant}.prod.limio.com`
        : ""

    return (
        <div style={s.page}>
            <div style={s.card}>
                {/* Step 1: Welcome */}
                {step === 1 && (
                    <>
                        <div style={s.logoRow}>
                            <div style={s.logo}>L</div>
                        </div>
                        <h1 style={s.heading}>Welcome to Limio</h1>
                        <p style={s.desc}>Connect your Limio account to build, preview, and deploy subscription components directly from Storybook.</p>
                        <button style={s.primaryBtn} onClick={() => setStep(2)}>Get Started</button>
                    </>
                )}

                {/* Step 2: Credentials */}
                {step === 2 && (
                    <>
                        <h2 style={s.stepTitle}>Enter Credentials</h2>
                        <p style={s.stepDesc}>You can find these in your Limio dashboard under Settings &gt; API Keys.</p>

                        {error && (
                            <div style={s.errorBanner}>{error}</div>
                        )}

                        <div style={s.form}>
                            <div style={s.field}>
                                <label style={s.label}>Tenant</label>
                                <input style={s.input} value={tenant} onChange={e => setTenant(e.target.value)} placeholder="your-tenant" />
                                {urlPreview && <div style={s.urlPreview}>{urlPreview}</div>}
                            </div>
                            <div style={s.field}>
                                <label style={s.label}>Region</label>
                                <select style={s.input} value={region} onChange={e => setRegion(e.target.value)}>
                                    <option value="eu">EU (Europe)</option>
                                    <option value="us">US (United States)</option>
                                    <option value="dev">Dev (Development)</option>
                                </select>
                            </div>
                            <div style={s.field}>
                                <label style={s.label}>Client ID</label>
                                <input style={s.input} value={clientId} onChange={e => setClientId(e.target.value)} placeholder="client-id" />
                            </div>
                            <div style={s.field}>
                                <label style={s.label}>Client Secret</label>
                                <input style={s.input} type="password" value={clientSecret} onChange={e => setClientSecret(e.target.value)} placeholder="client-secret" />
                            </div>
                        </div>

                        <div style={s.actions}>
                            <button style={s.secondaryBtn} onClick={() => setStep(1)}>Back</button>
                            <button
                                style={{ ...s.primaryBtn, ...((!tenant || !clientId || !clientSecret || connecting) ? { opacity: 0.5, cursor: "not-allowed" } : {}) }}
                                onClick={handleConnect}
                                disabled={!tenant || !clientId || !clientSecret || connecting}
                            >
                                {connecting ? "Connecting..." : "Connect"}
                            </button>
                        </div>
                    </>
                )}

                {/* Step 3: Connected */}
                {step === 3 && (
                    <>
                        <div style={s.successIcon}>
                            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                                <circle cx="28" cy="28" r="28" fill="#10B981" />
                                <path d="M18 28.5L24.5 35L38 21.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 style={s.stepTitle}>Connected!</h2>
                        <p style={s.stepDesc}>Your Limio account is configured. You're ready to build and deploy components.</p>
                        {connectedUrl && <div style={s.connectedUrl}>{connectedUrl}</div>}
                        <div style={s.actions}>
                            <button style={s.primaryBtn} onClick={() => {
                                // Navigate to new component story
                                window.parent?.postMessage?.(JSON.stringify({ type: "storybook/navigate", storyId: "tools-new-component--builder" }), "*")
                                window.location.hash = "#/story/tools-new-component--builder"
                            }}>Build a Component</button>
                            <button style={s.secondaryBtn} onClick={() => setStep(2)}>Update Credentials</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const s = {
    page: {
        minHeight: "100vh",
        background: "#f8f9fb",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "60px 20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        WebkitFontSmoothing: "antialiased",
    },
    card: {
        background: "#fff",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "480px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        textAlign: "center",
    },
    logoRow: { marginBottom: "4px" },
    logo: {
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #0d9f6e 0%, #10B981 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "24px",
        fontWeight: "700",
    },
    heading: { fontSize: "24px", fontWeight: "700", color: "#1a1f36", margin: 0 },
    desc: { fontSize: "14px", color: "#697386", lineHeight: 1.6, margin: 0, maxWidth: "360px" },
    stepTitle: { fontSize: "20px", fontWeight: "700", color: "#1a1f36", margin: 0 },
    stepDesc: { fontSize: "13px", color: "#697386", lineHeight: 1.5, margin: 0, maxWidth: "360px" },
    form: { width: "100%", display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" },
    field: { display: "flex", flexDirection: "column", gap: "4px" },
    label: { fontSize: "12px", fontWeight: "600", color: "#1a1f36" },
    input: {
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #e3e8ee",
        fontSize: "14px",
        fontFamily: "inherit",
        color: "#1a1f36",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    },
    urlPreview: { fontSize: "11px", color: "#697386", marginTop: "2px" },
    errorBanner: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "10px",
        background: "#FEF2F2",
        border: "1px solid #FECACA",
        color: "#991B1B",
        fontSize: "12px",
        fontWeight: "500",
        textAlign: "left",
    },
    actions: { display: "flex", gap: "10px", marginTop: "4px" },
    primaryBtn: {
        padding: "10px 24px",
        borderRadius: "10px",
        border: "none",
        background: "#0d9f6e",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    secondaryBtn: {
        padding: "10px 24px",
        borderRadius: "10px",
        border: "1px solid #e3e8ee",
        background: "#fff",
        color: "#697386",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    successIcon: { marginBottom: "4px" },
    connectedUrl: {
        padding: "8px 16px",
        borderRadius: "8px",
        background: "#F0FDF4",
        border: "1px solid #BBF7D0",
        color: "#166534",
        fontSize: "13px",
        fontWeight: "500",
        fontFamily: '"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    },
}

export default {
    title: "Tools/Limio Setup",
    parameters: {
        layout: "fullscreen",
        previewTabs: { "storybook/docs/panel": { hidden: true } },
    },
}

export const Setup = {
    render: () => <SetupWizard />,
}
