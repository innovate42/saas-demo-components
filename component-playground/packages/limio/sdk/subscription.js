export function useSubInfo(subscription) {
    if (!subscription) return { status: "unknown", isGift: false, hasLapsed: false, hasPendingChange: false }

    const status = subscription.status || "unknown"
    const isGift = !!subscription.gift_recipient_email
    const hasLapsed = ["expired", "lapsed", "cancelled"].includes(status)

    const now = new Date()
    const hasPendingChange = subscription.offers?.some(o => {
        const start = o.data?.start ? new Date(o.data.start) : null
        return start && start > now
    }) || false

    return { status, isGift, hasLapsed, hasPendingChange }
}

export function useSchedule(subscription) {
    if (!subscription?.schedule || !Array.isArray(subscription.schedule)) {
        return { nextPaymentAmount: null, nextPaymentDate: null, renewalPrice: null, termEndDate: null }
    }

    const now = new Date()
    const future = subscription.schedule
        .filter(s => ["active", "pending", "pending-external"].includes(s.status))
        .filter(s => new Date(s.data?.date) > now)
        .sort((a, b) => new Date(a.data.date) - new Date(b.data.date))

    const next = future[0]
    if (!next) {
        return { nextPaymentAmount: null, nextPaymentDate: null, renewalPrice: null, termEndDate: null }
    }

    const amount = next.data?.amount
    const currency = next.data?.currency
    const formatted = amount && currency ? `${currency} ${amount}` : null

    return {
        nextPaymentAmount: formatted,
        nextPaymentDate: next.data?.date || null,
        renewalPrice: formatted,
        termEndDate: subscription.offers?.[0]?.termEndDate || null
    }
}
