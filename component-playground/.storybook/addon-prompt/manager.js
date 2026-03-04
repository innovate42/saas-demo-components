import React, { useState, useEffect, useCallback, useRef } from "react"
import { addons, types } from "@storybook/manager-api"
import { AddonPanel } from "@storybook/components"

const ADDON_ID = "claude-prompt"
const PANEL_ID = `${ADDON_ID}/panel`
const SETTINGS_PANEL_ID = `${ADDON_ID}/settings`

// ===== Prompt Panel =====

function PromptPanel({ active, api }) {
    const [prompt, setPrompt] = useState("")
    const [sending, setSending] = useState(false)
    const [status, setStatus] = useState({ state: "listening", message: "" })
    const [component, setComponent] = useState("")
    const [deployStatus, setDeployStatus] = useState(null)
    const textareaRef = useRef(null)

    // Detect current story's component
    useEffect(() => {
        if (!api) return
        const updateComponent = () => {
            const story = api.getCurrentStoryData()
            if (story?.title) {
                const parts = story.title.split("/")
                const name = parts[parts.length - 1]
                const kebab = name.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/gi, "").toLowerCase()
                setComponent(kebab)
            }
        }
        updateComponent()
        const channel = api.getChannel()
        channel.on("storyChanged", updateComponent)
        return () => channel.off("storyChanged", updateComponent)
    }, [api])

    // Poll prompt status
    useEffect(() => {
        if (!active) return
        let mounted = true
        const poll = async () => {
            try {
                const res = await fetch("/api/prompt-status")
                if (res.ok && mounted) setStatus(await res.json())
            } catch {}
        }
        poll()
        const id = setInterval(poll, 1500)
        return () => { mounted = false; clearInterval(id) }
    }, [active])

    const handleSend = useCallback(async () => {
        if (!prompt.trim() || sending) return
        setSending(true)
        try {
            const res = await fetch("/api/prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt.trim(), component, storyId: api?.getCurrentStoryData()?.id || "", mode: "edit" }),
            })
            if (res.ok) setPrompt("")
        } catch {}
        setSending(false)
    }, [prompt, component, sending, api])

    const handleKeyDown = useCallback((e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault()
            handleSend()
        }
    }, [handleSend])

    const handleDeploy = useCallback(async () => {
        if (!component || deployStatus === "deploying") return
        setDeployStatus("deploying")
        try {
            // Signal overlay
            await fetch("/api/deploy-overlay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: "pushing", message: "Pushing to repository...", component, progress: 20 }),
            })
            const res = await fetch("/api/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ component }),
            })
            const data = await res.json()
            if (!res.ok) {
                setDeployStatus("error")
                await fetch("/api/deploy-overlay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ state: "error", message: data.error || "Deploy failed", component, progress: 0 }),
                })
                return
            }
            // Start polling build status
            await fetch("/api/deploy-overlay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: "building", message: "Building components in Limio...", component, progress: 50 }),
            })
            const deployedAfter = new Date().toISOString()
            let attempts = 0
            const maxAttempts = 60
            const pollBuild = async () => {
                attempts++
                try {
                    const buildRes = await fetch(`/api/build-status?deployedAfter=${encodeURIComponent(deployedAfter)}`)
                    const buildData = await buildRes.json()
                    if (buildData.found && buildData.buildComplete) {
                        const success = buildData.buildStatus.toUpperCase() === "SUCCEEDED"
                        setDeployStatus(success ? "success" : "error")
                        await fetch("/api/deploy-overlay", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                state: success ? "success" : "error",
                                message: success ? "Component deployed successfully!" : `Build failed: ${buildData.logErrors || buildData.buildStatus}`,
                                component,
                                progress: 100,
                            }),
                        })
                        return
                    }
                } catch {}
                const progress = Math.min(90, 50 + (attempts / maxAttempts) * 40)
                await fetch("/api/deploy-overlay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ state: "building", message: "Building components in Limio...", component, progress }),
                }).catch(() => {})
                if (attempts < maxAttempts) {
                    setTimeout(pollBuild, 5000)
                } else {
                    setDeployStatus("timeout")
                    await fetch("/api/deploy-overlay", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ state: "timeout", message: "Build timed out — check Limio dashboard", component, progress: 90 }),
                    })
                }
            }
            setTimeout(pollBuild, 5000)
        } catch (err) {
            setDeployStatus("error")
            await fetch("/api/deploy-overlay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: "error", message: err.message, component, progress: 0 }),
            }).catch(() => {})
        }
    }, [component, deployStatus])

    const navigateToNewComponent = useCallback(() => {
        if (api) api.selectStory("tools-new-component", "builder")
    }, [api])

    if (!active) return null

    const statusColor = {
        listening: "#10B981", queued: "#F59E0B", received: "#8B5CF6",
        working: "#8B5CF6", completed: "#10B981", error: "#EF4444",
        permission_needed: "#F59E0B",
    }[status.state] || "#9CA3AF"

    return (
        <div style={{ padding: "16px", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: "13px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: statusColor }} />
                    <span style={{ fontWeight: "600", color: "#1a1f36", textTransform: "capitalize" }}>{status.state}</span>
                    {component && <span style={{ color: "#697386" }}>| {component}</span>}
                </div>
                <button
                    onClick={navigateToNewComponent}
                    style={{
                        padding: "4px 10px", borderRadius: "6px", border: "1px solid #e3e8ee",
                        background: "#fff", color: "#635BFF", fontSize: "12px", fontWeight: "600",
                        cursor: "pointer", fontFamily: "inherit",
                    }}
                >
                    + New
                </button>
            </div>

            {/* Status message */}
            {status.message && status.state !== "listening" && (
                <div style={{
                    padding: "8px 12px", borderRadius: "8px", marginBottom: "12px", fontSize: "12px", fontWeight: "500",
                    background: status.state === "error" ? "#FEF2F2" : status.state === "completed" ? "#F0FDF4" : "#F5F3FF",
                    color: status.state === "error" ? "#991B1B" : status.state === "completed" ? "#166534" : "#5B21B6",
                    border: `1px solid ${status.state === "error" ? "#FECACA" : status.state === "completed" ? "#BBF7D0" : "#DDD6FE"}`,
                }}>
                    {status.message}
                </div>
            )}

            {/* Prompt input */}
            <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe changes to the component..."
                style={{
                    width: "100%", minHeight: "80px", padding: "10px", borderRadius: "8px",
                    border: "1px solid #e3e8ee", fontSize: "13px", fontFamily: "inherit",
                    color: "#1a1f36", resize: "vertical", outline: "none", boxSizing: "border-box",
                }}
            />

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px", marginTop: "10px", alignItems: "center" }}>
                <button
                    onClick={handleSend}
                    disabled={!prompt.trim() || sending}
                    style={{
                        padding: "8px 16px", borderRadius: "8px", border: "none",
                        background: !prompt.trim() || sending ? "#E5E7EB" : "#635BFF",
                        color: !prompt.trim() || sending ? "#9CA3AF" : "#fff",
                        fontSize: "13px", fontWeight: "600", cursor: !prompt.trim() || sending ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                    }}
                >
                    {sending ? "Sending..." : "Send to Claude"}
                </button>
                <button
                    onClick={handleDeploy}
                    disabled={!component || deployStatus === "deploying"}
                    style={{
                        padding: "8px 16px", borderRadius: "8px",
                        border: "1px solid #e3e8ee", background: "#fff",
                        color: !component || deployStatus === "deploying" ? "#9CA3AF" : "#0d9f6e",
                        fontSize: "13px", fontWeight: "600",
                        cursor: !component || deployStatus === "deploying" ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                    }}
                >
                    {deployStatus === "deploying" ? "Deploying..." : "Deploy"}
                </button>
                <span style={{ fontSize: "11px", color: "#a3acb9", marginLeft: "auto" }}>Cmd+Enter to send</span>
            </div>
        </div>
    )
}

// ===== Settings Panel =====

function SettingsPanel({ active }) {
    const [tenant, setTenant] = useState("")
    const [region, setRegion] = useState("eu")
    const [clientId, setClientId] = useState("")
    const [clientSecret, setClientSecret] = useState("")
    const [status, setStatus] = useState(null) // null | "checking" | "connected" | "error"
    const [message, setMessage] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!active) return
        setStatus("checking")
        fetch("/api/limio/status")
            .then(r => r.json())
            .then(data => {
                if (data.configured) {
                    setTenant(data.tenant || "")
                    setRegion(data.region || "eu")
                    setStatus("connected")
                    setMessage(`Connected to ${data.baseUrl}`)
                } else {
                    setStatus(data.error ? "error" : null)
                    setMessage(data.error || "")
                }
            })
            .catch(() => { setStatus(null); setMessage("") })
    }, [active])

    const handleSave = useCallback(async () => {
        if (!tenant || !clientId || !clientSecret || saving) return
        setSaving(true)
        setStatus("checking")
        setMessage("Connecting...")
        try {
            const res = await fetch("/api/limio/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tenant, region, clientId, clientSecret }),
            })
            const data = await res.json()
            if (res.ok) {
                setStatus("connected")
                setMessage(`Connected to ${data.baseUrl}`)
                setClientSecret("")
            } else {
                setStatus("error")
                setMessage(data.error || "Connection failed")
            }
        } catch (err) {
            setStatus("error")
            setMessage(err.message)
        }
        setSaving(false)
    }, [tenant, region, clientId, clientSecret, saving])

    if (!active) return null

    const urlPreview = tenant
        ? region === "us" ? `${tenant}.prod-us.limio.com` : region === "dev" ? `${tenant}.dev.limio.com` : `${tenant}.prod.limio.com`
        : ""

    return (
        <div style={{ padding: "16px", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: "13px", maxWidth: "480px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700", color: "#1a1f36" }}>Limio Settings</h3>
            <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#697386" }}>Connect your Limio account to deploy components.</p>

            {/* Status banner */}
            {status === "connected" && (
                <div style={{ padding: "8px 12px", borderRadius: "8px", marginBottom: "14px", fontSize: "12px", fontWeight: "500", background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}>
                    {message}
                </div>
            )}
            {status === "error" && (
                <div style={{ padding: "8px 12px", borderRadius: "8px", marginBottom: "14px", fontSize: "12px", fontWeight: "500", background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}>
                    {message}
                </div>
            )}

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#1a1f36", marginBottom: "4px" }}>Tenant</label>
                    <input
                        value={tenant} onChange={(e) => setTenant(e.target.value)}
                        placeholder="your-tenant"
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e3e8ee", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
                    />
                    {urlPreview && <div style={{ fontSize: "11px", color: "#697386", marginTop: "3px" }}>{urlPreview}</div>}
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#1a1f36", marginBottom: "4px" }}>Region</label>
                    <select
                        value={region} onChange={(e) => setRegion(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e3e8ee", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
                    >
                        <option value="eu">EU (Europe)</option>
                        <option value="us">US (United States)</option>
                        <option value="dev">Dev (Development)</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#1a1f36", marginBottom: "4px" }}>Client ID</label>
                    <input
                        value={clientId} onChange={(e) => setClientId(e.target.value)}
                        placeholder="client-id"
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e3e8ee", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
                    />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#1a1f36", marginBottom: "4px" }}>Client Secret</label>
                    <input
                        type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)}
                        placeholder={status === "connected" ? "••••••••" : "client-secret"}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e3e8ee", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={!tenant || !clientId || !clientSecret || saving}
                    style={{
                        padding: "8px 16px", borderRadius: "8px", border: "none", marginTop: "4px",
                        background: !tenant || !clientId || !clientSecret || saving ? "#E5E7EB" : "#0d9f6e",
                        color: !tenant || !clientId || !clientSecret || saving ? "#9CA3AF" : "#fff",
                        fontSize: "13px", fontWeight: "600", cursor: !tenant || !clientId || !clientSecret || saving ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                    }}
                >
                    {saving ? "Connecting..." : status === "connected" ? "Reconnect" : "Connect"}
                </button>
            </div>
        </div>
    )
}

// ===== Register =====

addons.register(ADDON_ID, (api) => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: "Claude Prompt",
        render: ({ active }) => (
            <AddonPanel active={active}>
                <PromptPanel active={active} api={api} />
            </AddonPanel>
        ),
    })

    addons.add(SETTINGS_PANEL_ID, {
        type: types.PANEL,
        title: "Limio Settings",
        render: ({ active }) => (
            <AddonPanel active={active}>
                <SettingsPanel active={active} />
            </AddonPanel>
        ),
    })
})
