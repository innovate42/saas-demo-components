import React, { useState, useCallback, useEffect, useRef } from "react"
import { addons, types, useStorybookApi } from "@storybook/manager-api"

const ADDON_ID = "claude-prompt"
const PANEL_ID = `${ADDON_ID}/panel`

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
}

const STATE_CONFIG = {
    idle: { icon: "○", bg: "#f0f2f5", color: "#697386", label: "Idle" },
    listening: { icon: "●", bg: "#ecfdf5", color: "#0d9f6e", label: "Listening" },
    queued: { icon: "◷", bg: "#fffbeb", color: "#d97706", label: "Queued" },
    received: { icon: "⟳", bg: "#eef0ff", color: "#635BFF", label: "Working" },
    working: { icon: "⟳", bg: "#eef0ff", color: "#635BFF", label: "Working" },
    permission_needed: { icon: "!", bg: "#fffbeb", color: "#d97706", label: "Needs input" },
    completed: { icon: "✓", bg: "#ecfdf5", color: "#0d9f6e", label: "Done" },
    error: { icon: "✕", bg: "#fef2f2", color: "#df1b41", label: "Error" },
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
    const pollRef = useRef(null)
    const lastPromptTs = useRef(null)

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

    const stateConfig = STATE_CONFIG[liveStatus.state] || STATE_CONFIG.idle
    const showBanner = liveStatus.state && liveStatus.state !== "idle"
    const isWorking = liveStatus.state === "queued" || liveStatus.state === "received" || liveStatus.state === "working"

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
            </div>

            <div style={styles.hint}>
                <strong>Cmd+Enter</strong> to send. Claude Code will modify the component and Storybook will hot-reload.
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

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: "Claude Prompt",
        render: ({ active }) => (active ? <PromptPanel /> : null),
    })
})
