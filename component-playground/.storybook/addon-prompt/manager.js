import React, { useState, useCallback, useEffect, useRef } from "react"
import { addons, types, useStorybookApi } from "@storybook/manager-api"

const ADDON_ID = "claude-prompt"
const PANEL_ID = `${ADDON_ID}/panel`
const SETTINGS_PANEL_ID = `${ADDON_ID}/settings`

const styles = {
    panel: {
        padding: "20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f8f9fb",
        overflow: "auto",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "16px",
    },
    logo: {
        width: "28px",
        height: "28px",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #d4a574 0%, #c4956a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "700",
        flexShrink: 0,
    },
    title: {
        fontSize: "15px",
        fontWeight: "700",
        color: "#1a1f36",
        margin: 0,
        flex: 1,
    },
    connectionBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 8px",
        borderRadius: "12px",
        fontSize: "10px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    componentBadge: {
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "6px",
        background: "#eef0f6",
        fontSize: "12px",
        fontWeight: "600",
        color: "#697386",
        marginBottom: "12px",
        gap: "6px",
    },
    componentName: {
        color: "#635BFF",
        fontFamily: '"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    },
    textarea: {
        width: "100%",
        minHeight: "100px",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e3e8ee",
        fontFamily: "inherit",
        fontSize: "13px",
        lineHeight: "1.6",
        resize: "vertical",
        outline: "none",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        background: "#fff",
        color: "#1a1f36",
        flex: 1,
        boxSizing: "border-box",
    },
    textareaFocused: {
        borderColor: "#635BFF",
        boxShadow: "0 0 0 3px rgba(99, 91, 255, 0.1)",
    },
    footer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "12px",
    },
    button: {
        padding: "8px 20px",
        borderRadius: "8px",
        border: "none",
        background: "#635BFF",
        color: "#fff",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "opacity 0.15s ease, transform 0.1s ease",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
    },
    buttonDisabled: {
        opacity: 0.5,
        cursor: "not-allowed",
    },
    buttonSecondary: {
        padding: "8px 16px",
        borderRadius: "8px",
        border: "1px solid #e3e8ee",
        background: "#fff",
        color: "#1a1f36",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
    },
    buttonDeploy: {
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        background: "#0d9f6e",
        color: "#fff",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
    },
    hint: {
        fontSize: "11px",
        color: "#a3acb9",
        marginTop: "8px",
        lineHeight: "1.5",
    },
    // Status banner
    statusBanner: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderRadius: "8px",
        marginBottom: "12px",
        fontSize: "13px",
        fontWeight: "500",
        lineHeight: "1.4",
    },
    statusIcon: {
        fontSize: "16px",
        flexShrink: 0,
    },
    statusMessage: {
        flex: 1,
    },
    // History
    historySection: {
        marginTop: "16px",
        borderTop: "1px solid #e3e8ee",
        paddingTop: "12px",
    },
    historyTitle: {
        fontSize: "11px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "#a3acb9",
        margin: "0 0 8px",
    },
    historyItem: {
        fontSize: "12px",
        color: "#697386",
        padding: "6px 0",
        borderBottom: "1px solid #f0f2f5",
        lineHeight: "1.5",
    },
    historyTime: {
        fontSize: "10px",
        color: "#a3acb9",
        marginLeft: "6px",
    },
    // Deploy status
    deployBanner: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: "8px",
        marginBottom: "12px",
        fontSize: "12px",
        fontWeight: "500",
    },
    // Settings panel
    settingsPanel: {
        padding: "20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f8f9fb",
        overflow: "auto",
    },
    formGroup: {
        marginBottom: "16px",
    },
    label: {
        display: "block",
        fontSize: "12px",
        fontWeight: "600",
        color: "#1a1f36",
        marginBottom: "6px",
    },
    input: {
        width: "100%",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #e3e8ee",
        fontSize: "13px",
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.15s ease",
    },
    select: {
        width: "100%",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #e3e8ee",
        fontSize: "13px",
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box",
        background: "#fff",
    },
    urlPreview: {
        fontSize: "12px",
        color: "#697386",
        padding: "8px 12px",
        background: "#eef0f6",
        borderRadius: "6px",
        marginBottom: "16px",
        fontFamily: '"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    },
    statusConnected: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        borderRadius: "8px",
        background: "#ecfdf5",
        color: "#0d9f6e",
        fontSize: "13px",
        fontWeight: "500",
        marginBottom: "16px",
    },
    statusError: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        borderRadius: "8px",
        background: "#fef2f2",
        color: "#df1b41",
        fontSize: "13px",
        fontWeight: "500",
        marginBottom: "16px",
    },
}

const STATE_CONFIG = {
    idle: { icon: "\u25CB", bg: "#f0f2f5", color: "#697386", label: "Idle" },
    listening: { icon: "\u25CF", bg: "#ecfdf5", color: "#0d9f6e", label: "Listening" },
    queued: { icon: "\u25F7", bg: "#fffbeb", color: "#d97706", label: "Queued" },
    received: { icon: "\u27F3", bg: "#eef0ff", color: "#635BFF", label: "Working" },
    working: { icon: "\u27F3", bg: "#eef0ff", color: "#635BFF", label: "Working" },
    permission_needed: { icon: "!", bg: "#fffbeb", color: "#d97706", label: "Needs input" },
    completed: { icon: "\u2713", bg: "#ecfdf5", color: "#0d9f6e", label: "Done" },
    error: { icon: "\u2715", bg: "#fef2f2", color: "#df1b41", label: "Error" },
}

const extractComponentFromStory = (story) => {
    if (!story) return null
    const importPath = story.importPath || ""
    const match = importPath.match(/components\/([^/]+)\//)
    if (match) return match[1]
    if (story.title) return story.title.toLowerCase().replace(/\s+/g, "-")
    return null
}

const PromptPanel = () => {
    const api = useStorybookApi()
    const [prompt, setPrompt] = useState("")
    const [focused, setFocused] = useState(false)
    const [history, setHistory] = useState([])
    const [component, setComponent] = useState(null)
    const [liveStatus, setLiveStatus] = useState({ state: "idle", message: "" })
    const [sending, setSending] = useState(false)
    const [deploying, setDeploying] = useState(false)
    const [deployStatus, setDeployStatus] = useState(null)
    const [limioConfigured, setLimioConfigured] = useState(false)
    const pollRef = useRef(null)
    const lastPromptTs = useRef(null)
    const buildPollRef = useRef(null)

    // Check Limio config on mount
    useEffect(() => {
        fetch("/api/limio/status")
            .then(r => r.json())
            .then(data => setLimioConfigured(data.configured === true))
            .catch(() => {})
    }, [])

    // Update component from current story
    useEffect(() => {
        const story = api.getCurrentStoryData()
        setComponent(extractComponentFromStory(story))
    })

    // Poll status endpoint
    useEffect(() => {
        const poll = async () => {
            try {
                const res = await fetch("/api/prompt-status")
                if (res.ok) {
                    const data = await res.json()
                    setLiveStatus(data)

                    // If completed or error, slow down polling
                    if (data.state === "completed" || data.state === "error") {
                        clearInterval(pollRef.current)
                        pollRef.current = setInterval(poll, 5000)
                    }
                }
            } catch {}
        }

        pollRef.current = setInterval(poll, 1500)
        poll() // Initial fetch

        return () => {
            if (pollRef.current) clearInterval(pollRef.current)
        }
    }, [])

    // Speed up polling when a prompt is in-flight
    useEffect(() => {
        if (sending || liveStatus.state === "queued" || liveStatus.state === "received" || liveStatus.state === "working") {
            clearInterval(pollRef.current)
            const poll = async () => {
                try {
                    const res = await fetch("/api/prompt-status")
                    if (res.ok) setLiveStatus(await res.json())
                } catch {}
            }
            pollRef.current = setInterval(poll, 800)
        }
    }, [sending, liveStatus.state])

    // Cleanup build poll on unmount
    useEffect(() => {
        return () => {
            if (buildPollRef.current) clearInterval(buildPollRef.current)
        }
    }, [])

    const handleSubmit = useCallback(async () => {
        if (!prompt.trim() || sending) return

        setSending(true)
        try {
            const story = api.getCurrentStoryData()
            const comp = extractComponentFromStory(story)

            const res = await fetch("/api/prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    component: comp || "unknown",
                    storyId: story?.id || "",
                }),
            })

            if (res.ok) {
                lastPromptTs.current = new Date().toISOString()
                setHistory(prev => [
                    { prompt: prompt.trim(), time: new Date().toLocaleTimeString(), component: comp },
                    ...prev.slice(0, 4),
                ])
                setPrompt("")
            }
        } catch {}
        setSending(false)
    }, [prompt, sending, api])

    const handleKeyDown = useCallback((e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault()
            handleSubmit()
        }
    }, [handleSubmit])

    const handleNewComponent = useCallback(() => {
        setPrompt("Create a new Limio component called ")
    }, [])

    const handleDeploy = useCallback(async () => {
        if (!component || deploying) return
        setDeploying(true)
        setDeployStatus({ state: "deploying", message: `Deploying ${component}...` })
        try {
            const res = await fetch("/api/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ component }),
            })
            const data = await res.json()
            if (!res.ok) {
                setDeployStatus({ state: "error", message: data.error || "Deploy failed" })
                setDeploying(false)
                return
            }
            setDeployStatus({ state: "pushed", message: `Pushed. Tracking build...`, commitHash: data.commitHash })

            // Poll build status if we have Limio configured
            if (data.commitHash && limioConfigured) {
                let attempts = 0
                buildPollRef.current = setInterval(async () => {
                    attempts++
                    try {
                        const bRes = await fetch(`/api/build-status?commitHash=${data.commitHash}`)
                        const bData = await bRes.json()
                        if (bData.found) {
                            const status = (bData.buildStatus || "").toUpperCase()
                            if (bData.buildComplete) {
                                clearInterval(buildPollRef.current)
                                buildPollRef.current = null
                                if (status === "SUCCEEDED") {
                                    setDeployStatus({ state: "success", message: `Build succeeded for ${component}` })
                                } else {
                                    setDeployStatus({ state: "error", message: `Build ${status.toLowerCase()}: ${bData.logErrors || "Check Limio dashboard"}` })
                                }
                                setDeploying(false)
                            } else {
                                setDeployStatus({ state: "building", message: `Building ${component}... (${status})` })
                            }
                        }
                    } catch {}
                    if (attempts > 60) {
                        clearInterval(buildPollRef.current)
                        buildPollRef.current = null
                        setDeployStatus({ state: "unknown", message: "Build status check timed out. Check Limio dashboard." })
                        setDeploying(false)
                    }
                }, 5000)
            } else {
                setDeployStatus({ state: "success", message: `Deployed ${component} (pushed to git)` })
                setDeploying(false)
            }
        } catch (err) {
            setDeployStatus({ state: "error", message: err.message })
            setDeploying(false)
        }
    }, [component, deploying, limioConfigured])

    const stateConfig = STATE_CONFIG[liveStatus.state] || STATE_CONFIG.idle
    const showBanner = liveStatus.state && liveStatus.state !== "idle"
    const isWorking = liveStatus.state === "queued" || liveStatus.state === "received" || liveStatus.state === "working"

    const deployBg = deployStatus?.state === "success" ? "#ecfdf5" : deployStatus?.state === "error" ? "#fef2f2" : "#fffbeb"
    const deployColor = deployStatus?.state === "success" ? "#0d9f6e" : deployStatus?.state === "error" ? "#df1b41" : "#d97706"

    return (
        <div style={styles.panel}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.logo}>C</div>
                <h3 style={styles.title}>Claude Code</h3>
                <div
                    style={{
                        ...styles.connectionBadge,
                        background: liveStatus.state === "listening" ? "#ecfdf5" : liveStatus.state === "idle" ? "#f0f2f5" : "#eef0ff",
                        color: liveStatus.state === "listening" ? "#0d9f6e" : liveStatus.state === "idle" ? "#697386" : "#635BFF",
                    }}
                >
                    <span style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "currentColor",
                        display: "inline-block",
                        animation: (liveStatus.state === "listening") ? "none" : undefined,
                    }} />
                    {stateConfig.label}
                </div>
            </div>

            {/* Status Banner */}
            {showBanner && liveStatus.message && (
                <div
                    style={{
                        ...styles.statusBanner,
                        background: stateConfig.bg,
                        color: stateConfig.color,
                    }}
                >
                    <span style={{
                        ...styles.statusIcon,
                        animation: isWorking ? "spin 1s linear infinite" : "none",
                    }}>
                        {stateConfig.icon}
                    </span>
                    <span style={styles.statusMessage}>{liveStatus.message}</span>
                </div>
            )}

            {/* Deploy Status Banner */}
            {deployStatus && (
                <div style={{ ...styles.deployBanner, background: deployBg, color: deployColor }}>
                    <span>{deployStatus.state === "success" ? "\u2713" : deployStatus.state === "error" ? "\u2715" : "\u27F3"}</span>
                    <span style={{ flex: 1 }}>{deployStatus.message}</span>
                    {!deploying && (
                        <button
                            style={{ background: "none", border: "none", cursor: "pointer", color: deployColor, fontSize: "14px", padding: "0 4px" }}
                            onClick={() => setDeployStatus(null)}
                        >{"\u2715"}</button>
                    )}
                </div>
            )}

            {/* Component badge */}
            {component && (
                <div style={styles.componentBadge}>
                    <span>Component:</span>
                    <span style={styles.componentName}>{component}</span>
                </div>
            )}

            {/* Textarea */}
            <textarea
                style={{
                    ...styles.textarea,
                    ...(focused ? styles.textareaFocused : {}),
                    ...(isWorking ? { opacity: 0.6 } : {}),
                }}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={isWorking
                    ? "Claude Code is working on your previous prompt..."
                    : "Describe changes you want Claude to make to this component..."
                }
                disabled={sending || isWorking}
            />

            {/* Footer */}
            <div style={styles.footer}>
                <button
                    style={{
                        ...styles.button,
                        ...(!prompt.trim() || sending || isWorking ? styles.buttonDisabled : {}),
                    }}
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || sending || isWorking}
                >
                    {sending ? "Sending..." : isWorking ? "Working..." : "Send to Claude"}
                </button>
                <button
                    style={styles.buttonSecondary}
                    onClick={handleNewComponent}
                    disabled={isWorking}
                >
                    + New
                </button>
                <button
                    style={{
                        ...styles.buttonDeploy,
                        ...(!component || deploying || !limioConfigured ? styles.buttonDisabled : {}),
                    }}
                    onClick={handleDeploy}
                    disabled={!component || deploying || !limioConfigured}
                    title={!limioConfigured ? "Configure Limio in Settings tab first" : !component ? "Select a component story first" : `Deploy ${component}`}
                >
                    {deploying ? "Deploying..." : "Deploy"}
                </button>
            </div>

            <div style={styles.hint}>
                <strong>Cmd+Enter</strong> to send. Claude Code will modify the component and Storybook will hot-reload.
                {!limioConfigured && <span style={{ display: "block", marginTop: "4px", color: "#d97706" }}>Configure Limio in the Settings tab to enable deploy.</span>}
            </div>

            {/* History */}
            {history.length > 0 && (
                <div style={styles.historySection}>
                    <h4 style={styles.historyTitle}>Recent prompts</h4>
                    {history.map((item, i) => (
                        <div key={i} style={styles.historyItem}>
                            {item.prompt}
                            <span style={styles.historyTime}>{item.time}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const SettingsPanel = () => {
    const [tenant, setTenant] = useState("")
    const [region, setRegion] = useState("eu")
    const [clientId, setClientId] = useState("")
    const [clientSecret, setClientSecret] = useState("")
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState(null) // { type: "success"|"error", message }
    const [loading, setLoading] = useState(true)

    // Auto-detect existing config on mount
    useEffect(() => {
        fetch("/api/limio/status")
            .then(r => r.json())
            .then(data => {
                if (data.configured) {
                    setTenant(data.tenant || "")
                    setRegion(data.region || "eu")
                    setStatus({ type: "success", message: `Connected to ${data.baseUrl}` })
                } else if (data.error) {
                    setStatus({ type: "error", message: data.error })
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const handleSave = useCallback(async () => {
        if (!tenant || !clientId || !clientSecret || saving) return
        setSaving(true)
        setStatus(null)
        try {
            const res = await fetch("/api/limio/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tenant, region, clientId, clientSecret }),
            })
            const data = await res.json()
            if (res.ok) {
                setStatus({ type: "success", message: `Connected to ${data.baseUrl}` })
                setClientSecret("")
            } else {
                setStatus({ type: "error", message: data.error || "Setup failed" })
            }
        } catch (err) {
            setStatus({ type: "error", message: err.message })
        }
        setSaving(false)
    }, [tenant, region, clientId, clientSecret, saving])

    const urlPreview = tenant
        ? region === "us" ? `${tenant}.prod-us.limio.com` : region === "dev" ? `${tenant}.dev.limio.com` : `${tenant}.prod.limio.com`
        : "your-tenant.prod.limio.com"

    if (loading) {
        return <div style={styles.settingsPanel}><p style={{ color: "#697386" }}>Loading...</p></div>
    }

    return (
        <div style={styles.settingsPanel}>
            <div style={styles.header}>
                <div style={{ ...styles.logo, background: "linear-gradient(135deg, #635BFF 0%, #4b45c6 100%)" }}>L</div>
                <h3 style={styles.title}>Limio Settings</h3>
            </div>

            {status && (
                <div style={status.type === "success" ? styles.statusConnected : styles.statusError}>
                    <span>{status.type === "success" ? "\u2713" : "\u2715"}</span>
                    <span>{status.message}</span>
                </div>
            )}

            <div style={styles.formGroup}>
                <label style={styles.label}>Tenant</label>
                <input
                    style={styles.input}
                    value={tenant}
                    onChange={(e) => setTenant(e.target.value.trim())}
                    placeholder="your-tenant"
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Region</label>
                <select style={styles.select} value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="eu">EU (Europe)</option>
                    <option value="us">US (United States)</option>
                    <option value="dev">Dev (Development)</option>
                </select>
            </div>

            <div style={styles.urlPreview}>
                {urlPreview}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Client ID</label>
                <input
                    style={styles.input}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value.trim())}
                    placeholder="client-id"
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Client Secret</label>
                <input
                    style={styles.input}
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder={status?.type === "success" ? "(saved)" : "client-secret"}
                />
            </div>

            <button
                style={{
                    ...styles.button,
                    ...(!tenant || !clientId || !clientSecret || saving ? styles.buttonDisabled : {}),
                    width: "100%",
                    marginTop: "8px",
                }}
                onClick={handleSave}
                disabled={!tenant || !clientId || !clientSecret || saving}
            >
                {saving ? "Connecting..." : "Save & Connect"}
            </button>

            <div style={styles.hint}>
                Credentials are saved to <code>.limio.json</code> in the project root. Client secret is validated against the Limio API before saving.
            </div>
        </div>
    )
}

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: "Claude Prompt",
        render: ({ active }) => (active ? <PromptPanel /> : null),
    })
    addons.add(SETTINGS_PANEL_ID, {
        type: types.PANEL,
        title: "Limio Settings",
        render: ({ active }) => (active ? <SettingsPanel /> : null),
    })
})
