export * from "./src/context"

export function getPropsFromPackageJson(packageData) {
    const limioProps = packageData.limioProps || []
    const defaults = {}
    limioProps.forEach(prop => {
        if (prop.default !== undefined) {
            defaults[prop.id] = prop.default
        }
    })
    return defaults
}

export function sanitiseHTML(html) {
    if (!html) return ""
    return String(html).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
}

export function getCurrentOffer(subscription) {
    if (!subscription) return undefined
    const offers = subscription?.offers || []
    const now = new Date()

    const active = offers
        .filter(o => o.data?.record_subtype !== "discount")
        .filter(o => {
            const start = o.data?.start ? new Date(o.data.start) : null
            const end = o.data?.end ? new Date(o.data.end) : null
            if (start && start > now) return false
            if (end && end < now) return false
            return true
        })

    const current = active[0]
    return current?.data?.offer || subscription?.data?.offer
}
