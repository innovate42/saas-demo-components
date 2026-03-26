import React, { useEffect, useState } from "react"
import "./index.css"
import { Button } from "@limio/design-system"
import { useCheckout } from "@limio/internal-checkout-sdk"
import { useLimioContext } from "@limio/sdk"
import { sanitiseHTML } from "@limio/sdk"

type Props = {
  heading: string
  body: string
  showButton: boolean
  buttonLabel: string
  buttonUrl: string
}

const BlockInvalid = ({ heading, body, showButton, buttonLabel, buttonUrl }: Props) => {
  const [blocked, setBlocked] = useState(false)
  const { useCheckoutSelector } = useCheckout({ allowEmptyBasketSession: true })
  const orderItems = useCheckoutSelector((state) => state.order.orderItems)
  const { isInPageBuilder } = useLimioContext()

  useEffect(() => {
    if (!orderItems?.length) return

    const now = new Date()

    const hasInvalidOffer = orderItems.some((item) => {
      const dateRange = item?.offer?.data?.attributes?.valid_date_range__limio
      if (!dateRange) return false

      const from = new Date(dateRange.from)
      const to = new Date(dateRange.to)

      return now < from || now > to
    })

    setBlocked(hasInvalidOffer)
  }, [orderItems])

  const goToUrl = (url: string) => {
    if (url && window.location) {
      window.location = url
    }
  }

  return (
    <div className={`block-container block-invalid-container ${blocked || isInPageBuilder ? "show" : ""}`}>
      {(blocked || isInPageBuilder) && (
        <div className="block-invalid-modal">
          <h3 className="block-invalid-heading">{heading}</h3>
          <div className="block-invalid-body" dangerouslySetInnerHTML={{ __html: sanitiseHTML(body) }} />
          {showButton && <Button onClick={() => goToUrl(buttonUrl)}>{buttonLabel}</Button>}
        </div>
      )}
    </div>
  )
}

export default BlockInvalid
