import { useEffect } from "react"
import { useSubscriptions } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"

/**
 * Limio's stock self-service components resolve which subscription they are
 * acting on from ?subId. Land on one of those pages without it — from the nav,
 * a bookmark, or a demo click — and it renders "there was a problem retrieving
 * your subscription offers". This puts the parameter back and reloads once.
 */
const AbSubIdGuard = () => {
  useStaticProps()
  const { subscriptions } = useSubscriptions() || {}

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("subId")) return

    const list = subscriptions || []
    if (!list.length) return

    const target = list.find((s) => s?.status === "active") || list[0]
    if (!target?.id) return

    params.set("subId", target.id)
    window.location.replace(`${window.location.pathname}?${params.toString()}`)
  }, [subscriptions])

  return null
}

export default AbSubIdGuard
