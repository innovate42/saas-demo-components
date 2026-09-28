import React, { useEffect, useRef, useState } from "react"
import * as Sentry from "@sentry/browser"
import { useBasket, useLimioContext, sanitiseHTML } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import { formatNotice, getChildren, getItemLabel, getItemsToRemove } from "./helpers"
import type { BasketItem } from "./helpers"
import "./index.css"

interface StaticProps {
  notice: string
  dismissLabel: string
}

const SAMPLE_LABELS = ["Sample item"]

/**
 * Headless component: when a product with the standalone_in_basket attribute is
 * in the basket, only the last-added item stays. The item enters the basket
 * first; this component removes the other items right after and shows a notice.
 */
const StandaloneBasketRule: React.FC = () => {
  const props = useStaticProps() as StaticProps | undefined
  const { orderItems, basketLoading, removeFromBasket } = useBasket() || {}
  const { isInPageBuilder } = useLimioContext() || {}
  const [removedLabels, setRemovedLabels] = useState<string[]>([])
  const [recheck, setRecheck] = useState(0)
  const isRemoving = useRef(false)
  // Items whose removal failed are not retried, so a failing API call cannot loop
  const failedIds = useRef(new Set<string>())

  const { notice = "", dismissLabel = "Dismiss" } = props || {}

  useEffect(() => {
    if (isInPageBuilder || isRemoving.current || basketLoading || !orderItems?.length || !removeFromBasket) return

    const extras = getItemsToRemove(orderItems)
    if (extras.length === 0 || extras.some((item) => failedIds.current.has(item.id))) return

    isRemoving.current = true

    const enforce = async () => {
      const labels: string[] = []
      let current: BasketItem | undefined
      try {
        for (const parent of extras) {
          current = parent
          for (const child of getChildren(orderItems, parent)) {
            await removeFromBasket({ id: child.id })
          }
          await removeFromBasket({ id: parent.id })
          labels.push(getItemLabel(parent))
        }
        // The effect skipped any basket change made while removals ran, so check once more
        setRecheck((count) => count + 1)
      } catch (error) {
        if (current) failedIds.current.add(current.id)
        console.error("StandaloneBasketRule: failed to remove basket item:", error)
        Sentry.captureException(error)
      } finally {
        isRemoving.current = false
        if (labels.length) setRemovedLabels(labels)
      }
    }

    enforce()
  }, [orderItems, basketLoading, removeFromBasket, isInPageBuilder, recheck])

  const labels = isInPageBuilder ? SAMPLE_LABELS : removedLabels
  if (labels.length === 0) return null

  return (
    <div className={`sbr-notice${isInPageBuilder ? " sbr-notice--inline" : ""}`} role="status">
      <div className="sbr-notice__text" dangerouslySetInnerHTML={{ __html: sanitiseHTML(formatNotice(notice, labels)) }} />
      <button type="button" className="sbr-notice__dismiss" aria-label={dismissLabel} onClick={() => setRemovedLabels([])}>
        ×
      </button>
    </div>
  )
}

export default StandaloneBasketRule
