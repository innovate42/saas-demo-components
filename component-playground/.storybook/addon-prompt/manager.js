import React, { useState, useCallback, useEffect } from "react"
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
        minHeight: "120px",
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
    buttonHover: {
        opacity: 0.9,
    },
    status: {
        fontSize: "12px",
        color: "#697386",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        display: "inline-block",
    },
    hint: {
        fontSize: "11px",
        color: "#a3acb9",
        marginTop: "8px",
        lineHeight: "1.5",
    },
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

const extractComponentFromStory = (story) => {
    if (!story) return null
    // Try to get from importPath: "../../../components/win-back/index"
    const importPath = story.importPath || ""
    const match = importPath.match(/components\/([^/]+)\//)
    if (match) return match[1]
    // Fallback: derive from title
    if (story.title) {
        return story.title.toLowerCase().replace(/\s+/g, "-")
    }
    return null
}

const STATUS_COLORS = {
    idle: "#a3acb9",
    sending: "#d97706",
    sent: "#0d9f6e",
    error: "#df1b41",
}

const STATUS_LABELS = {
    idle: "Ready",
    sending: "Sending...",
    sent: "Sent — waiting for Claude Code",
    error: "Failed to send",
}

const PromptPanel = () => {
    const api = useStorybookApi()
    const [prompt, setPrompt] = useState("")
    const [status, setStatus] = useState("idle")
    const [focused, setFocused] = useState(false)
    const [history, setHistory] = useState([])
    const [component, setComponent] = useState(null)

    useEffect(() => {
        const story = api.getCurrentStoryData()
        setComponent(extractComponentFromStory(story))
    })

    const handleSubmit = useCallback(async () => {
        if (!prompt.trim() || status === "sending") return

        setStatus("sending")
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
                setStatus("sent")
                setHistory(prev => [
                    { prompt: prompt.trim(), time: new Date().toLocaleTimeString(), component: comp },
                    ...prev.slice(0, 4),
                ])
                setPrompt("")
                setTimeout(() => setStatus("idle"), 5000)
            } else {
                setStatus("error")
                setTimeout(() => setStatus("idle"), 3000)
            }
        } catch {
            setStatus("error")
            setTimeout(() => setStatus("idle"), 3000)
        }
    }, [prompt, status, api])

    const handleKeyDown = useCallback((e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault()
            handleSubmit()
        }
    }, [handleSubmit])

    return (
        <div style={styles.panel}>
            <div style={styles.header}>
                <div style={styles.logo}>C</div>
                <h3 style={styles.title}>Claude Code Prompt</h3>
            </div>

            {component && (
                <div style={styles.componentBadge}>
                    <span>Component:</span>
                    <span style={styles.componentName}>{component}</span>
                </div>
            )}

            <textarea
                style={{
                    ...styles.textarea,
                    ...(focused ? styles.textareaFocused : {}),
                }}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Describe changes you want Claude to make to this component..."
                disabled={status === "sending"}
            />

            <div style={styles.footer}>
                <button
                    style={{
                        ...styles.button,
                        ...(!prompt.trim() || status === "sending" ? styles.buttonDisabled : {}),
                    }}
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || status === "sending"}
                >
                    Send to Claude
                </button>
                <div style={styles.status}>
                    <span
                        style={{
                            ...styles.statusDot,
                            background: STATUS_COLORS[status],
                        }}
                    />
                    <span>{STATUS_LABELS[status]}</span>
                </div>
            </div>

            <div style={styles.hint}>
                Press <strong>Cmd+Enter</strong> to send. Claude Code will read this prompt and modify the component files. Storybook will hot-reload with the changes.
            </div>

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
