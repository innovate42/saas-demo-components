import React, { Suspense, useEffect } from "react"
import { useUser } from "@limio/sdk"
import { useCompleteCheckoutSession } from "@limio/internal-checkout-sdk"
import { useStaticProps } from "./componentStaticProps"

// Order-confirmation hand-off to the Limio onboarding agent. The chat embed
// (bootstrap.js) cannot carry the completed order into the conversation, and
// its JS API has no "send message", so this opens the chat and types the
// order reference + email into the widget's textarea (open shadow root on
// #limio-chat), then presses Send. The agent looks the order up from there.

const SENT_KEY = "ot-onboarding-chat-sent:"

const fillTemplate = (tpl, vars) => String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "")

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Poll until fn() returns something truthy, or give up after timeoutMs.
const waitFor = async (fn, timeoutMs, stepMs = 250) => {
    const end = Date.now() + timeoutMs
    while (Date.now() < end) {
        const value = fn()
        if (value) return value
        await wait(stepMs)
    }
    return null
}

const alreadySent = (key) => {
    try {
        return window.sessionStorage.getItem(SENT_KEY + key) === "1"
    } catch (e) {
        return false
    }
}

const markSent = (key) => {
    try {
        window.sessionStorage.setItem(SENT_KEY + key, "1")
    } catch (e) {
        // private mode: the message may be sent again on reload
    }
}

// React tracks the textarea value itself, so set it through the native setter
// and fire an input event, otherwise the Send button stays disabled.
const sendToWidget = async (text) => {
    const textarea = await waitFor(() => {
        const root = document.getElementById("limio-chat")?.shadowRoot
        const el = root && root.querySelector("textarea")
        return el && !el.disabled ? el : null
    }, 15000)
    if (!textarea) return false

    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set
    setter.call(textarea, text)
    textarea.dispatchEvent(new Event("input", { bubbles: true }))

    const send = await waitFor(() => {
        const button = textarea.getRootNode().querySelector('button[aria-label="Send"]')
        return button && !button.disabled ? button : null
    }, 5000, 100)
    if (!send) return false
    send.click()
    return true
}

const OtOnboardingChat = () => {
    const props = useStaticProps() || {}
    const { autoOpen = true, openDelayMs = 1500, sendOnManualOpen = true, messageTemplate = "", emailOnlyTemplate = "" } = props

    // The just-completed order from the checkout session, as in
    // cafeyn-order-confirmation; the signed-in user's email as a fallback.
    const { useCheckoutSelector } = useCompleteCheckoutSession?.() || {}
    const order = useCheckoutSelector?.((s) => s?.order) || {}
    const user = useUser() || {}

    const orderReference = order.order_reference || ""
    const email = order.customerDetails?.email || user.attributes?.email || ""

    useEffect(() => {
        if (typeof window === "undefined" || (!orderReference && !email)) return undefined

        const key = orderReference || email
        const text = orderReference
            ? fillTemplate(messageTemplate, { orderReference, email })
            : fillTemplate(emailOnlyTemplate, { email })

        let cancelled = false
        let unsubscribe = () => {}
        let sending = false

        const sendOnce = async () => {
            if (cancelled || sending || alreadySent(key)) return
            sending = true
            if (await sendToWidget(text)) markSent(key)
            sending = false
        }

        const start = async () => {
            const chat = await waitFor(() => window.LimioChat, 20000)
            if (!chat || cancelled || alreadySent(key)) return

            if (sendOnManualOpen && typeof chat.on === "function") {
                unsubscribe = chat.on("open", sendOnce) || (() => {})
            }
            if (autoOpen) {
                await wait(Number(openDelayMs) || 0)
                if (cancelled) return
                chat.open()
                sendOnce()
            }
        }

        start()
        return () => {
            cancelled = true
            unsubscribe()
        }
    }, [orderReference, email, autoOpen, openDelayMs, sendOnManualOpen, messageTemplate, emailOnlyTemplate])

    return null
}

// The completed-checkout hook suspends while the order loads; keep that from
// showing a spinner on the page — this component renders nothing anyway.
const Wrapped = () => (
    <Suspense fallback={null}>
        <OtOnboardingChat />
    </Suspense>
)

export default Wrapped
