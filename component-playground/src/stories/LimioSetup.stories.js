import React, { useState, useEffect } from "react"

const SetupWizard = () => {
    const [step, setStep] = useState(0) // 0=loading, 1=welcome, 2=credentials, 3=connected
    const [tenant, setTenant] = useState("")
    const [region, setRegion] = useState("eu")
    const [clientId, setClientId] = useState("")
    const [clientSecret, setClientSecret] = useState("")
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [connectedInfo, setConnectedInfo] = useState(null)

    // Auto-detect existing config
    useEffect(() => {
        fetch("/api/limio/status")
            .then(r => r.json())
            .then(data => {
                if (data.configured) {
                    setConnectedInfo(data)
                    setStep(3)
                } else {
                    setStep(1)
                }
            })
            .catch(() => setStep(1))
    }, [])

    const handleConnect = async () => {
        if (!tenant || !clientId || !clientSecret) return
        setSaving(true)
        setError(null)
        try {
            const res = await fetch("/api/limio/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tenant, region, clientId, clientSecret }),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setConnectedInfo({ tenant: data.tenant, region: data.region, baseUrl: data.baseUrl })
                setStep(3)
            } else {
                setError(data.error || "Connection failed")
            }
        } catch (err) {
            setError(`Network error: ${err.message}`)
        }
        setSaving(false)
    }

    const urlPreview = tenant
        ? (region === "us" ? `${tenant}.prod-us.limio.com` : region === "dev" ? `${tenant}.dev.limio.com` : `${tenant}.prod.limio.com`)
        : ""

    if (step === 0) {
        return (
            <div style={s.page}>
                <div style={s.card}>
                    <p style={{ color: "#697386", textAlign: "center" }}>Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div style={s.page}>
            <div style={s.card}>
                {/* Header */}
                <div style={s.header}>
                    <div style={s.logo}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M14 3L25 8.5V19.5L14 25L3 19.5V8.5L14 3Z" fill="white" fillOpacity="0.9" />
                            <path d="M14 3L25 8.5V19.5L14 25L3 19.5V8.5L14 3Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                            <path d="M3 8.5L14 14M14 14L25 8.5M14 14V25" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
                        </svg>
                    </div>
                    <div>
                        <h1 style={s.title}>Limio Setup</h1>
                        <p style={s.subtitle}>Connect your Limio account to deploy components</p>
                    </div>
                </div>

                {/* Step indicator */}
                <div style={s.steps}>
                    {["Welcome", "Credentials", "Connected"].map((label, i) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{
                                width: "24px", height: "24px", borderRadius: "50%", fontSize: "12px", fontWeight: "600",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: (i + 1) <= step ? "#635BFF" : "#e3e8ee",
                                color: (i + 1) <= step ? "#fff" : "#697386",
                                transition: "all 0.2s ease",
                            }}>
                                {(i + 1) < step ? "\u2713" : i + 1}
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: "500", color: (i + 1) === step ? "#1a1f36" : "#697386" }}>
                                {label}
                            </span>
                            {i < 2 && <div style={{ width: "24px", height: "1px", background: "#e3e8ee" }} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Welcome */}
                {step === 1 && (
                    <div style={s.stepContent}>
                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1f36", margin: "0 0 8px" }}>
                                Welcome to Limio
                            </h2>
                            <p style={{ fontSize: "14px", color: "#697386", lineHeight: "1.6", margin: "0 0 24px" }}>
                                Connect your Limio tenant to deploy custom components directly from Storybook.
                                You'll need your tenant name and API credentials.
                            </p>
                            <button onClick={() => setStep(2)} style={s.primaryButton}>
                                Get Started
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Credentials */}
                {step === 2 && (
                    <div style={s.stepContent}>
                        {error && (
                            <div style={s.errorBanner}>
                                <span style={{ fontSize: "14px" }}>{"\u2717"}</span>
                                <span>{error}</span>
                            </div>
                        )}
                        <div style={s.field}>
                            <label style={s.label}>Tenant Name</label>
                            <input
                                type="text" value={tenant}
                                onChange={(e) => setTenant(e.target.value)}
                                placeholder="my-company"
                                style={s.input}
                            />
                            {urlPreview && (
                                <div style={{ fontSize: "12px", color: "#697386", marginTop: "4px" }}>
                                    <code style={{ color: "#635BFF" }}>{urlPreview}</code>
                                </div>
                            )}
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Region</label>
                            <select value={region} onChange={(e) => setRegion(e.target.value)} style={s.input}>
                                <option value="eu">EU (Europe)</option>
                                <option value="us">US (United States)</option>
                                <option value="dev">Dev (Development)</option>
                            </select>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Client ID</label>
                            <input
                                type="text" value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                placeholder="your-client-id"
                                style={s.input}
                            />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Client Secret</label>
                            <input
                                type="password" value={clientSecret}
                                onChange={(e) => setClientSecret(e.target.value)}
                                placeholder="your-client-secret"
                                style={s.input}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                            <button onClick={() => setStep(1)} style={s.secondaryButton}>Back</button>
                            <button
                                onClick={handleConnect}
                                disabled={!tenant || !clientId || !clientSecret || saving}
                                style={{
                                    ...s.primaryButton,
                                    ...(!tenant || !clientId || !clientSecret || saving ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                                }}
                            >
                                {saving ? "Connecting..." : "Connect"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Connected */}
                {step === 3 && connectedInfo && (
                    <div style={s.stepContent}>
                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                            <div style={{
                                width: "56px", height: "56px", borderRadius: "50%", background: "#F0FDF4",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 16px",
                            }}>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <path d="M7 14.5L11.5 19L21 9.5" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1f36", margin: "0 0 4px" }}>
                                Connected!
                            </h2>
                            <p style={{ fontSize: "13px", color: "#697386", margin: "0 0 4px" }}>
                                {connectedInfo.tenant} &mdash; {connectedInfo.baseUrl}
                            </p>
                            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
                                <button
                                    onClick={() => { window.location.href = window.location.origin + "/?path=/story/tools-new-component--builder" }}
                                    style={s.primaryButton}
                                >
                                    Build a Component
                                </button>
                                <button
                                    onClick={() => setStep(2)}
                                    style={s.secondaryButton}
                                >
                                    Reconfigure
                                </button>
                            </div>
                        </div>
                    </div>
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
        maxWidth: "520px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
    },
    logo: {
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #635BFF 0%, #8B5CF6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    title: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#1a1f36",
        margin: 0,
        lineHeight: 1.3,
    },
    subtitle: {
        fontSize: "13px",
        color: "#697386",
        margin: "2px 0 0",
    },
    steps: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        padding: "8px 0",
    },
    stepContent: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    label: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#1a1f36",
    },
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
    primaryButton: {
        padding: "10px 24px",
        borderRadius: "8px",
        border: "none",
        background: "#635BFF",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    secondaryButton: {
        padding: "10px 20px",
        borderRadius: "8px",
        border: "1px solid #e3e8ee",
        background: "#fff",
        color: "#697386",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    errorBanner: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#FEF2F2",
        borderRadius: "10px",
        padding: "10px 14px",
        border: "1px solid #FECACA",
        fontSize: "12px",
        fontWeight: "500",
        color: "#991B1B",
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
