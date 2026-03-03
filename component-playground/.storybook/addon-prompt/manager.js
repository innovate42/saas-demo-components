import React, { useState, useEffect, useCallback, useRef } from "react"
import { addons, types } from "@storybook/manager-api"
import { AddonPanel } from "@storybook/components"

const ADDON_ID = "claude-prompt"
const PANEL_ID = `${ADDON_ID}/panel`
const SETTINGS_PANEL_ID = `${ADDON_ID}/settings`

// ===== Prompt Panel =====

const PromptPanel = () => {
    const [prompt, setPrompt] = useState("")
    const [component, setComponent] = useState("")
    const [sending, setSending] = useState(false)
    const [status, setStatus] = useState({ state: "listening", message: "" })
    const [components, setComponents] = useState([])
    const textareaRef = useRef(null)

    // Poll backend status
    useEffect(() => {
        let active = true
        const poll = async () => {
            try {
                const res = await fetch("/api/prompt-status")
                if (res.ok && active) setStatus(await res.json())
            } catch {}
        }
        poll()
        const id = setInterval(poll, 1500)
        return () => { active = false; clearInterval(id) }
    }, [])

    // Detect current story's component
    useEffect(() => {
        const channel = addons.getChannel()
        const onStoryChanged = (storyId) => {
            if (storyId) {
                const parts = storyId.split("--")[0].split("-")
                setComponent(parts.join("-"))
            }
        }
        channel.on("storyChanged", onStoryChanged)
        return () => channel.off("storyChanged", onStoryChanged)
    }, [])

    // Discover available components
    useEffect(() => {
        fetch("/api/deploy")
            .then(r => r.json())
            .then(data => {
                if (data.status) {
                    const matches = data.status.match(/components\/([^/\s]+)\//g)
                    if (matches) {
                        const unique = [...new Set(matches.map(m => m.replace("components/", "").replace("/", "")))]
                        setComponents(unique)
                    }
                }
            })
            .catch(() => {})
    }, [])

    const handleSend = useCallback(async () => {
        if (!prompt.trim() || sending) return
        setSending(true)
        try {
            const res = await fetch("/api/prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    component: component || "unknown",
                    storyId: "",
                    mode: "edit",
                }),
            })
            if (res.ok) {
                setPrompt("")
            }
        } catch (err) {
            console.error("Failed to send prompt:", err)
        }
        setSending(false)
    }, [prompt, component, sending])

    const handleKeyDown = useCallback((e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault()
            handleSend()
        }
    }, [handleSend])

    const handleDeploy = useCallback(async () => {
        if (!component) return
        try {
            // Update deploy overlay
            await fetch("/api/deploy-overlay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: "pushing", message: `Deploying ${component}...`, component, progress: 10 }),
            })
            const res = await fetch("/api/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ component }),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                await fetch("/api/deploy-overlay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ state: "building", message: "Pushed — waiting for build...", component, progress: 40 }),
                })
                // Poll build status
                const deployTime = new Date().toISOString()
                let attempts = 0
                const pollBuild = setInterval(async () => {
                    attempts++
                    try {
                        const buildRes = await fetch(`/api/build-status?deployedAfter=${encodeURIComponent(deployTime)}`)
                        const buildData = await buildRes.json()
                        if (buildData.found && buildData.buildComplete) {
                            clearInterval(pollBuild)
                            const isSuccess = buildData.buildStatus.toUpperCase() === "SUCCEEDED"
                            await fetch("/api/deploy-overlay", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    state: isSuccess ? "success" : "error",
                                    message: isSuccess ? `${component} deployed successfully!` : `Build failed: ${buildData.logErrors || buildData.buildStatus}`,
                                    component,
                                    progress: 100,
                                }),
                            })
                        } else {
                            const progress = Math.min(90, 40 + attempts * 5)
                            await fetch("/api/deploy-overlay", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ state: "building", message: "Building components...", component, progress }),
                            })
                        }
                    } catch {}
                    if (attempts > 60) {
                        clearInterval(pollBuild)
                        await fetch("/api/deploy-overlay", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ state: "timeout", message: "Build timed out — check Limio dashboard", component, progress: 90 }),
                        })
                    }
                }, 5000)
            } else {
                await fetch("/api/deploy-overlay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ state: "error", message: data.error || "Deploy failed", component, progress: 0 }),
                })
            }
        } catch (err) {
            await fetch("/api/deploy-overlay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: "error", message: `Deploy error: ${err.message}`, component, progress: 0 }),
            }).catch(() => {})
        }
    }, [component])

    const statusColor = {
        listening: "#10B981",
        queued: "#F59E0B",
        received: "#8B5CF6",
        working: "#8B5CF6",
        completed: "#10B981",
        error: "#EF4444",
        permission_needed: "#F59E0B",
    }[status.state] || "#6B7280"

    return React.createElement("div", { style: { padding: "16px", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: "13px" } },
        // Header with status + New button
        React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } },
                React.createElement("div", { style: { width: "8px", height: "8px", borderRadius: "50%", background: statusColor } }),
                React.createElement("span", { style: { fontWeight: "600", color: "#1a1f36", fontSize: "13px" } },
                    status.state === "listening" ? "Ready" : status.state.charAt(0).toUpperCase() + status.state.slice(1)
                ),
            ),
            React.createElement("button", {
                onClick: () => {
                    const channel = addons.getChannel()
                    channel.emit("storyChanged", "tools-new-component--builder")
                    // Navigate via URL
                    window.location.href = window.location.origin + "/?path=/story/tools-new-component--builder"
                },
                style: {
                    padding: "4px 10px", borderRadius: "6px", border: "1px solid #e3e8ee",
                    background: "#fff", color: "#635BFF", fontSize: "12px", fontWeight: "600",
                    cursor: "pointer", fontFamily: "inherit",
                },
            }, "+ New"),
        ),
        // Status message
        status.message && React.createElement("div", {
            style: {
                padding: "8px 10px", borderRadius: "8px", marginBottom: "12px", fontSize: "12px",
                background: status.state === "error" ? "#FEF2F2" : status.state === "completed" ? "#F0FDF4" : "#F5F3FF",
                color: status.state === "error" ? "#991B1B" : status.state === "completed" ? "#166534" : "#5B21B6",
                border: `1px solid ${status.state === "error" ? "#FECACA" : status.state === "completed" ? "#BBF7D0" : "#DDD6FE"}`,
            },
        }, status.message),
        // Component selector
        React.createElement("div", { style: { marginBottom: "10px" } },
            React.createElement("label", { style: { display: "block", fontWeight: "600", color: "#1a1f36", marginBottom: "4px", fontSize: "12px" } }, "Component"),
            React.createElement("input", {
                type: "text",
                value: component,
                onChange: (e) => setComponent(e.target.value),
                placeholder: "component-name",
                style: {
                    width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e3e8ee",
                    fontSize: "13px", fontFamily: "inherit", color: "#1a1f36", boxSizing: "border-box",
                    outline: "none",
                },
            }),
        ),
        // Prompt textarea
        React.createElement("div", { style: { marginBottom: "10px" } },
            React.createElement("label", { style: { display: "block", fontWeight: "600", color: "#1a1f36", marginBottom: "4px", fontSize: "12px" } }, "Prompt"),
            React.createElement("textarea", {
                ref: textareaRef,
                value: prompt,
                onChange: (e) => setPrompt(e.target.value),
                onKeyDown: handleKeyDown,
                placeholder: "Describe the changes you want...",
                rows: 5,
                style: {
                    width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #e3e8ee",
                    fontSize: "13px", fontFamily: "inherit", color: "#1a1f36", lineHeight: "1.5",
                    resize: "vertical", boxSizing: "border-box", outline: "none",
                },
            }),
        ),
        // Buttons
        React.createElement("div", { style: { display: "flex", gap: "8px", alignItems: "center" } },
            React.createElement("button", {
                onClick: handleSend,
                disabled: !prompt.trim() || sending,
                style: {
                    padding: "8px 16px", borderRadius: "6px", border: "none",
                    background: !prompt.trim() || sending ? "#a5b4fc" : "#635BFF",
                    color: "#fff", fontSize: "13px", fontWeight: "600", cursor: !prompt.trim() || sending ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                },
            }, sending ? "Sending..." : "Send to Claude"),
            component && React.createElement("button", {
                onClick: handleDeploy,
                style: {
                    padding: "8px 16px", borderRadius: "6px", border: "1px solid #e3e8ee",
                    background: "#fff", color: "#0d9f6e", fontSize: "13px", fontWeight: "600",
                    cursor: "pointer", fontFamily: "inherit",
                },
            }, "Deploy"),
            React.createElement("span", { style: { fontSize: "11px", color: "#a3acb9", marginLeft: "auto" } }, "Cmd+Enter"),
        ),
    )
}

// ===== Settings Panel =====

const SettingsPanel = () => {
    const [tenant, setTenant] = useState("")
    const [region, setRegion] = useState("eu")
    const [clientId, setClientId] = useState("")
    const [clientSecret, setClientSecret] = useState("")
    const [status, setStatus] = useState(null) // null = loading, object = result
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState(null)

    // Check existing config on mount
    useEffect(() => {
        fetch("/api/limio/status")
            .then(r => r.json())
            .then(data => {
                setStatus(data)
                if (data.configured && data.tenant) {
                    setTenant(data.tenant)
                    setRegion(data.region || "eu")
                }
            })
            .catch(() => setStatus({ configured: false }))
    }, [])

    const handleSave = async () => {
        if (!tenant || !clientId || !clientSecret) return
        setSaving(true)
        setMessage(null)
        try {
            const res = await fetch("/api/limio/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tenant, region, clientId, clientSecret }),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setMessage({ type: "success", text: `Connected to ${data.tenant} (${data.baseUrl})` })
                setStatus({ configured: true, tenant: data.tenant, region: data.region, baseUrl: data.baseUrl })
                setClientId("")
                setClientSecret("")
            } else {
                setMessage({ type: "error", text: data.error || "Failed to connect" })
            }
        } catch (err) {
            setMessage({ type: "error", text: `Connection error: ${err.message}` })
        }
        setSaving(false)
    }

    const urlPreview = tenant
        ? (region === "us" ? `${tenant}.prod-us.limio.com` : region === "dev" ? `${tenant}.dev.limio.com` : `${tenant}.prod.limio.com`)
        : ""

    const inputStyle = {
        width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e3e8ee",
        fontSize: "13px", fontFamily: "inherit", color: "#1a1f36", boxSizing: "border-box", outline: "none",
    }
    const labelStyle = { display: "block", fontWeight: "600", color: "#1a1f36", marginBottom: "4px", fontSize: "12px" }

    return React.createElement("div", { style: { padding: "16px", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: "13px" } },
        React.createElement("h3", { style: { fontSize: "15px", fontWeight: "700", color: "#1a1f36", margin: "0 0 4px" } }, "Limio Connection"),
        React.createElement("p", { style: { fontSize: "12px", color: "#697386", margin: "0 0 16px" } }, "Connect to your Limio tenant to deploy components."),

        // Status badge
        status && React.createElement("div", {
            style: {
                padding: "8px 10px", borderRadius: "8px", marginBottom: "16px", fontSize: "12px",
                background: status.configured ? "#F0FDF4" : "#FEF2F2",
                color: status.configured ? "#166534" : "#991B1B",
                border: `1px solid ${status.configured ? "#BBF7D0" : "#FECACA"}`,
            },
        }, status.configured ? `Connected to ${status.tenant} (${status.baseUrl})` : (status.error || "Not configured")),

        // Message
        message && React.createElement("div", {
            style: {
                padding: "8px 10px", borderRadius: "8px", marginBottom: "12px", fontSize: "12px",
                background: message.type === "success" ? "#F0FDF4" : "#FEF2F2",
                color: message.type === "success" ? "#166534" : "#991B1B",
                border: `1px solid ${message.type === "success" ? "#BBF7D0" : "#FECACA"}`,
            },
        }, message.text),

        // Form
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "10px" } },
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "Tenant"),
                React.createElement("input", { type: "text", value: tenant, onChange: (e) => setTenant(e.target.value), placeholder: "my-company", style: inputStyle }),
                urlPreview && React.createElement("div", { style: { fontSize: "11px", color: "#697386", marginTop: "4px" } },
                    React.createElement("code", { style: { color: "#635BFF" } }, urlPreview),
                ),
            ),
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "Region"),
                React.createElement("select", { value: region, onChange: (e) => setRegion(e.target.value), style: inputStyle },
                    React.createElement("option", { value: "eu" }, "EU (Europe)"),
                    React.createElement("option", { value: "us" }, "US (United States)"),
                    React.createElement("option", { value: "dev" }, "Dev (Development)"),
                ),
            ),
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "Client ID"),
                React.createElement("input", { type: "text", value: clientId, onChange: (e) => setClientId(e.target.value), placeholder: "client-id", style: inputStyle }),
            ),
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "Client Secret"),
                React.createElement("input", { type: "password", value: clientSecret, onChange: (e) => setClientSecret(e.target.value), placeholder: "client-secret", style: inputStyle }),
            ),
            React.createElement("button", {
                onClick: handleSave,
                disabled: !tenant || !clientId || !clientSecret || saving,
                style: {
                    padding: "8px 16px", borderRadius: "6px", border: "none", marginTop: "4px",
                    background: (!tenant || !clientId || !clientSecret || saving) ? "#a5b4fc" : "#635BFF",
                    color: "#fff", fontSize: "13px", fontWeight: "600",
                    cursor: (!tenant || !clientId || !clientSecret || saving) ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                },
            }, saving ? "Connecting..." : "Connect"),
        ),
    )
}

// ===== Register Addon =====

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: "Claude Prompt",
        render: ({ active }) =>
            React.createElement(AddonPanel, { active },
                React.createElement(PromptPanel)
            ),
    })

    addons.add(SETTINGS_PANEL_ID, {
        type: types.PANEL,
        title: "Limio Settings",
        render: ({ active }) =>
            React.createElement(AddonPanel, { active },
                React.createElement(SettingsPanel)
            ),
    })
})
