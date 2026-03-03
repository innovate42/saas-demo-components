import React, { useState, useEffect } from "react"

const STEPS = { WELCOME: 0, CREDENTIALS: 1, CONNECTED: 2 }

const styles = {
    container: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        maxWidth: 520,
        margin: "60px auto",
        padding: "0 24px",
        color: "#1a1f36",
        WebkitFontSmoothing: "antialiased",
    },
    card: {
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e3e8ee",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: 32,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 10,
        background: "linear-gradient(135deg, #635BFF 0%, #8B83FF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: 18,
        marginBottom: 20,
    },
    h1: { fontSize: 22, fontWeight: 600, margin: "0 0 8px" },
    subtitle: { fontSize: 14, color: "#697386", margin: "0 0 24px", lineHeight: 1.5 },
    label: { display: "block", fontSize: 13, fontWeight: 500, color: "#1a1f36", marginBottom: 6 },
    input: {
        width: "100%",
        padding: "10px 12px",
        fontSize: 14,
        border: "1px solid #e3e8ee",
        borderRadius: 8,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.15s",
    },
    select: {
        width: "100%",
        padding: "10px 12px",
        fontSize: 14,
        border: "1px solid #e3e8ee",
        borderRadius: 8,
        outline: "none",
        boxSizing: "border-box",
        background: "#fff",
        cursor: "pointer",
    },
    fieldGroup: { marginBottom: 16 },
    urlPreview: {
        fontSize: 12,
        color: "#697386",
        marginTop: 6,
        padding: "6px 10px",
        background: "#f6f9fc",
        borderRadius: 6,
        fontFamily: "monospace",
    },
    primaryBtn: {
        width: "100%",
        padding: "12px 20px",
        fontSize: 14,
        fontWeight: 600,
        color: "#fff",
        background: "#635BFF",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        transition: "background 0.15s",
    },
    secondaryBtn: {
        padding: "10px 20px",
        fontSize: 14,
        fontWeight: 500,
        color: "#635BFF",
        background: "#f6f9fc",
        border: "1px solid #e3e8ee",
        borderRadius: 8,
        cursor: "pointer",
        marginRight: 8,
    },
    error: {
        padding: "10px 14px",
        background: "#FEF2F2",
        color: "#DC2626",
        borderRadius: 8,
        fontSize: 13,
        marginBottom: 16,
    },
    success: {
        padding: "10px 14px",
        background: "#F0FDF4",
        color: "#16A34A",
        borderRadius: 8,
        fontSize: 13,
        marginBottom: 16,
    },
    stepper: {
        display: "flex",
        gap: 8,
        marginBottom: 24,
    },
    stepDot: (active) => ({
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: active ? "#635BFF" : "#e3e8ee",
        transition: "background 0.2s",
    }),
    divider: {
        height: 1,
        background: "#e3e8ee",
        margin: "20px 0",
    },
}

function LimioSetup() {
    const [step, setStep] = useState(STEPS.WELCOME)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [tenant, setTenant] = useState("")
    const [region, setRegion] = useState("eu")
    const [clientId, setClientId] = useState("")
    const [clientSecret, setClientSecret] = useState("")
    const [connectedInfo, setConnectedInfo] = useState(null)

    useEffect(() => {
        fetch("/api/limio/status")
            .then(r => r.json())
            .then(data => {
                if (data.configured) {
                    setConnectedInfo(data)
                    setStep(STEPS.CONNECTED)
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const getUrlPreview = () => {
        const t = tenant || "your-tenant"
        if (region === "us") return `${t}.prod-us.limio.com`
        if (region === "dev") return `${t}.dev.limio.com`
        return `${t}.prod.limio.com`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)
        try {
            const res = await fetch("/api/limio/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tenant, region, clientId, clientSecret }),
            })
            const data = await res.json()
            if (!res.ok || data.error) {
                setError(data.error || "Connection failed")
                return
            }
            setConnectedInfo(data)
            setStep(STEPS.CONNECTED)
        } catch (err) {
            setError(err.message || "Network error")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <p style={{ textAlign: "center", color: "#697386" }}>Checking connection...</p>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.stepper}>
                    <div style={styles.stepDot(step >= STEPS.WELCOME)} />
                    <div style={styles.stepDot(step >= STEPS.CREDENTIALS)} />
                    <div style={styles.stepDot(step >= STEPS.CONNECTED)} />
                </div>

                {step === STEPS.WELCOME && (
                    <>
                        <div style={styles.logo}>L</div>
                        <h1 style={styles.h1}>Connect to Limio</h1>
                        <p style={styles.subtitle}>
                            Link your Limio account to deploy components directly from Storybook.
                            You'll need your tenant name and API credentials.
                        </p>
                        <button
                            style={styles.primaryBtn}
                            onClick={() => setStep(STEPS.CREDENTIALS)}
                            onMouseOver={e => e.target.style.background = "#4B44E0"}
                            onMouseOut={e => e.target.style.background = "#635BFF"}
                        >
                            Get Started
                        </button>
                    </>
                )}

                {step === STEPS.CREDENTIALS && (
                    <form onSubmit={handleSubmit}>
                        <h1 style={styles.h1}>Enter Credentials</h1>
                        <p style={styles.subtitle}>
                            Find these in your Limio admin panel under Settings &gt; API Credentials.
                        </p>

                        {error && <div style={styles.error}>{error}</div>}

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Tenant Name</label>
                            <input
                                style={styles.input}
                                placeholder="e.g. acme-corp"
                                value={tenant}
                                onChange={e => setTenant(e.target.value)}
                                required
                                onFocus={e => e.target.style.borderColor = "#635BFF"}
                                onBlur={e => e.target.style.borderColor = "#e3e8ee"}
                            />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Region</label>
                            <select
                                style={styles.select}
                                value={region}
                                onChange={e => setRegion(e.target.value)}
                            >
                                <option value="eu">EU (Europe)</option>
                                <option value="us">US (United States)</option>
                                <option value="dev">Dev (Development)</option>
                            </select>
                            <div style={styles.urlPreview}>
                                https://{getUrlPreview()}
                            </div>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Client ID</label>
                            <input
                                style={styles.input}
                                placeholder="Client ID"
                                value={clientId}
                                onChange={e => setClientId(e.target.value)}
                                required
                                onFocus={e => e.target.style.borderColor = "#635BFF"}
                                onBlur={e => e.target.style.borderColor = "#e3e8ee"}
                            />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Client Secret</label>
                            <input
                                style={styles.input}
                                type="password"
                                placeholder="Client Secret"
                                value={clientSecret}
                                onChange={e => setClientSecret(e.target.value)}
                                required
                                onFocus={e => e.target.style.borderColor = "#635BFF"}
                                onBlur={e => e.target.style.borderColor = "#e3e8ee"}
                            />
                        </div>

                        <button
                            style={{
                                ...styles.primaryBtn,
                                opacity: submitting ? 0.7 : 1,
                                cursor: submitting ? "not-allowed" : "pointer",
                            }}
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "Connecting..." : "Connect"}
                        </button>
                    </form>
                )}

                {step === STEPS.CONNECTED && (
                    <>
                        <div style={{ ...styles.logo, background: "linear-gradient(135deg, #16A34A 0%, #4ADE80 100%)" }}>
                            <span style={{ fontSize: 20 }}>&check;</span>
                        </div>
                        <h1 style={styles.h1}>Connected</h1>
                        <div style={styles.success}>
                            Connected to <strong>{connectedInfo?.tenant}</strong> ({(connectedInfo?.region || "eu").toUpperCase()})
                        </div>
                        <p style={styles.subtitle}>
                            Your Limio account is linked. You can now deploy components directly from Storybook.
                        </p>
                        <div style={styles.divider} />
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                style={styles.primaryBtn}
                                onClick={() => {
                                    const base = window.location.origin
                                    window.location.href = base
                                }}
                                onMouseOver={e => e.target.style.background = "#4B44E0"}
                                onMouseOut={e => e.target.style.background = "#635BFF"}
                            >
                                Browse Components
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default {
    title: "Tools/Limio Setup",
    component: LimioSetup,
    parameters: {
        layout: "fullscreen",
        previewTabs: { "storybook/docs/panel": { hidden: true } },
    },
}

export const Default = {}
