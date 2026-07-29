import React from "react"
import { useStaticProps } from "./componentStaticProps"

// Layout-only layer for the @limio/chat widget (see /ai/agents). The widget
// mounts in an open shadow root (#limio-chat) and keeps its DEFAULT theme —
// this component adds NO brand styling and NO teaser/questions popup. Its one
// job is the desktop **side-panel dock**: a right rail that pushes the page
// instead of floating over it (Qualified-style), so a page can offer an
// alternate layout without touching the widget's defaults. On narrow
// viewports it is inert and the floating bubble / mobile sheet are untouched.
//
// Ported from limio-chat-brand with the brand CSS layer, teaser card and
// menu-hiding stripped out; only the dock geometry + page-push remain.

// Geometry injected into the widget's shadow root — no colours, fonts or
// tokens, only the shape change that turns the floating panel into a
// full-height rail. Gated by the .lmo-dock class on the host (#limio-chat).
const DOCK_SHADOW_CSS = `
:host(.lmo-dock) div[role="dialog"][aria-label="Chat"] {
  position: fixed !important;
  top: 0 !important; right: 0 !important; bottom: 0 !important; left: auto !important;
  width: var(--lmo-dock-w, 400px) !important;
  max-width: var(--lmo-dock-w, 400px) !important;
  height: 100vh !important;
  max-height: 100vh !important;
  border-radius: 0 !important;
  box-shadow: -12px 0 40px -16px rgba(16, 24, 40, 0.28) !important;
}
`

const DOCK_SHADOW_STYLE_ID = "limio-chat-dock-shadow"
const DOCK_STYLE_ID = "limio-chat-dock"
const DOCK_MIN_WIDTH = 1200
// Side-panel auto-open: the panel opens itself shortly after load (no click),
// once per session — if the visitor closes it, it stays closed for the rest
// of the session. Delay is a prop (seconds); this is the fallback default.
const DOCK_AUTOOPEN_DEFAULT_MS = 2000
const DOCK_DISMISS_KEY = "limio-chat-dock-dismissed"

// Light-DOM page push. The rail is fixed to the right edge; this shifts the
// page's content container left by the panel width while the panel is open,
// so nothing sits under the rail. `contentSelector` is a prop (defaults to
// the Limio shop's mount point, #root) so it can be pointed at whatever
// wraps the page. --lmo-dock-w is set on :root and inherited across the
// shadow boundary into the rail rule above.
function dockPushCss(contentSelector) {
  return `
:root { --lmo-dock-w: 400px; }
${contentSelector} { transition: margin-right .32s cubic-bezier(.22, 1, .36, 1); }
html.lmo-docked ${contentSelector} { margin-right: var(--lmo-dock-w, 400px); }
@media (prefers-reduced-motion: reduce) {
  ${contentSelector} { transition: none; }
}
`
}

// Wires the dock: injects the shadow geometry + the light-DOM push, toggles
// the host class for the rail and the <html> class for the page shift, both
// re-evaluated on resize so shrinking below the desktop threshold falls back
// cleanly to the floating panel. When `autoOpen`, the panel opens itself once
// after `autoOpenMs` (desktop, unless dismissed this session).
function setupDock(panelWidth, autoOpen, autoOpenMs, contentSelector) {
  const host = document.getElementById("limio-chat")
  if (!host || !host.shadowRoot || !window.LimioChat) return () => {}
  const mq = window.matchMedia(`(min-width: ${DOCK_MIN_WIDTH}px)`)

  if (panelWidth) document.documentElement.style.setProperty("--lmo-dock-w", panelWidth)

  if (!host.shadowRoot.getElementById(DOCK_SHADOW_STYLE_ID)) {
    const shadowStyle = document.createElement("style")
    shadowStyle.id = DOCK_SHADOW_STYLE_ID
    shadowStyle.textContent = DOCK_SHADOW_CSS
    host.shadowRoot.appendChild(shadowStyle)
  }
  if (!document.getElementById(DOCK_STYLE_ID)) {
    const style = document.createElement("style")
    style.id = DOCK_STYLE_ID
    style.textContent = dockPushCss(contentSelector)
    document.head.appendChild(style)
  }

  let dismissed = false
  try { dismissed = window.sessionStorage.getItem(DOCK_DISMISS_KEY) === "1" } catch (e) {}

  let open = false
  const sync = () => {
    const wide = mq.matches
    host.classList.toggle("lmo-dock", wide)
    document.documentElement.classList.toggle("lmo-docked", wide && open)
  }
  // .on returns an unsubscribe fn (see bootstrap.js)
  const offOpen = window.LimioChat.on("open", () => { open = true; sync() }) || (() => {})
  const offClose = window.LimioChat.on("close", () => {
    open = false
    sync()
    // a close is a dismissal — don't auto-reopen on later pages this session
    dismissed = true
    try { window.sessionStorage.setItem(DOCK_DISMISS_KEY, "1") } catch (e) {}
  }) || (() => {})
  const onMq = () => sync()
  mq.addEventListener ? mq.addEventListener("change", onMq) : mq.addListener(onMq)
  sync()

  // auto-open once after a beat (desktop only, unless already open/dismissed)
  let autoTimer = null
  if (autoOpen && mq.matches && !dismissed) {
    autoTimer = setTimeout(() => { if (!open) window.LimioChat.open() }, autoOpenMs)
  }

  return () => {
    autoTimer && clearTimeout(autoTimer)
    offOpen(); offClose()
    mq.removeEventListener ? mq.removeEventListener("change", onMq) : mq.removeListener(onMq)
    host.classList.remove("lmo-dock")
    document.documentElement.classList.remove("lmo-docked")
    document.documentElement.style.removeProperty("--lmo-dock-w")
    const s = document.getElementById(DOCK_STYLE_ID)
    s && s.remove()
    const ss = host.shadowRoot && host.shadowRoot.getElementById(DOCK_SHADOW_STYLE_ID)
    ss && ss.remove()
  }
}

// Poll for the widget (host shadow root + LimioChat global), then run `fn`.
// Returns a disposer that cancels the poll and any setup `fn` returned.
function whenWidgetReady(fn) {
  let tries = 0
  let timer = null
  let dispose = null
  const tick = () => {
    const host = document.getElementById("limio-chat")
    if (host && host.shadowRoot && window.LimioChat) {
      dispose = fn()
      return
    }
    if (tries++ > 120) return
    timer = setTimeout(tick, 250)
  }
  tick()
  return () => {
    timer && clearTimeout(timer)
    dispose && dispose()
  }
}

const LimioChatSidePanel = () => {
  const {
    layout = "side-panel",
    panelWidth = "400px",
    autoOpen = true,
    autoOpenDelay = 2,
    contentSelector = "#root",
  } = useStaticProps() || {}
  // prop is in seconds; guard against blank/negative/NaN
  const autoOpenMs = Number(autoOpenDelay) >= 0 ? Number(autoOpenDelay) * 1000 : DOCK_AUTOOPEN_DEFAULT_MS
  const pushSelector = (contentSelector || "").trim() || "#root"

  // Side-panel dock: set up (and torn down) whenever the layout props change.
  // "floating" (or anything other than "side-panel") leaves the widget in its
  // default floating layout and injects nothing.
  React.useEffect(() => {
    if (layout !== "side-panel") return undefined
    return whenWidgetReady(() => setupDock(panelWidth, autoOpen, autoOpenMs, pushSelector))
  }, [layout, panelWidth, autoOpen, autoOpenMs, pushSelector])

  return null
}

export default LimioChatSidePanel
