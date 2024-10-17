import React from "react"
import { Button } from "@limio/component-library"
import { useBasket } from "@limio/sdk"

function InitiateCheckoutButton({ buttonLabel, checkoutLink }): JSX.Element {
  const { basketItems, goToCheckout } = useBasket()

  const buttonIsDisabled = !basketItems || basketItems.length === 0

  const handleGoToCheckout = () => {
    if (buttonIsDisabled) return

    const checkout = basketItems[0].offer?.data?.attributes?.checkout__limio

    const options = {
      journey: {
        checkout: {
          ...checkout,
          ...(checkoutLink && { external_url: checkoutLink })
        }
      }
    }

    goToCheckout(null, options)
  }

  return (
    <Button onClick={handleGoToCheckout} disabled={buttonIsDisabled} className="tw-w-full tw-my-1" variant="primary">
      {buttonLabel}
    </Button>
  )
}

export default InitiateCheckoutButton
