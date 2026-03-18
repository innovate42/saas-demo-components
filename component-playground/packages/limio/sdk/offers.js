export function checkActiveOffers(offers = []) {
    const now = new Date()
    const sorted = [...offers].sort((a, b) => new Date(a.data?.start) - new Date(b.data?.start))

    let active = sorted.filter(o => {
        const end = o.data?.end ? new Date(o.data.end) : null
        return !end || end >= now
    })

    active = active.filter(o => {
        const start = o.data?.start ? new Date(o.data.start) : null
        return !start || start <= now
    })

    return active
}
