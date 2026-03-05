import * as React from "react"
import { useState } from "react"
import { useBasket } from "@limio/sdk"
import BillingPlan from "./components/BillingPlan"
import "./index.css"
import { formatCurrency } from "./helpers"

function MaltegoCartItems({
  emptyCartMessage = "Your cart is empty, view offers to go to offers",
  emptyCTALabel = "See offers",
  emptyCartUrl = "/default",
  displayUpsellOffers = true,
  showPriceInUpsellOffers = true,
  showAsCards = false,
  // accepted but unused — match standard cart-items prop signature
  showOfferIcons,
  offerAdditionalInfo,
  addOnAdditionalInfo,
  lineItemAdditionalInfo,
  addOnAdditionalInfo2,
  unitPriceLabel,
  readOnly,
  showDiscountNote,
}) {
  const { basketItems = [], swapOffer } = useBasket()

  const currentBasketItem = basketItems[0]
  const currentOffer = currentBasketItem?.offer

  // Upsell offers live at the top level of the basket item under "upsell"
  const upsellOffers = currentBasketItem?.upsell || []

  // Track selected offer by ID — initialise to the current offer in the basket
  const [selectedOfferId, setSelectedOfferId] = useState(currentOffer?.id || null)

  // Display name from offer attributes
  const displayName = currentOffer?.data?.attributes?.display_name__limio || ""

  // Price from basket item's price object — gives correct currency format e.g. US$3,450.00
  const displayPrice = currentBasketItem?.price
    ? formatCurrency(currentBasketItem.price.amount, currentBasketItem.price.currency)
    : ""

  const handleOfferChange = async (upsellOffer) => {
    setSelectedOfferId(upsellOffer.id)
    if (swapOffer && currentBasketItem?.id) {
      await swapOffer(currentBasketItem.id, upsellOffer)
    }
  }

  if (!currentOffer) {
    return (
      <div className="mci-container">
        <p className="mci-empty">{emptyCartMessage}</p>
        {emptyCTALabel && <a className="mci-continue-btn" href={emptyCartUrl}>{emptyCTALabel}</a>}
      </div>
    )
  }

  return (
    <div className="mci-container">
      <div className="mci-cart-item">
        <span className="mci-cart-item__name">{displayName}</span>
        <span className="mci-cart-item__price">{displayPrice}</span>
      </div>

      {displayUpsellOffers && upsellOffers.length > 0 && (
        <BillingPlan
          upsellOffers={upsellOffers}
          selectedOfferId={selectedOfferId}
          handleOfferChange={handleOfferChange}
          upsellLayout={showAsCards ? "card" : "radio"}
          showPrice={showPriceInUpsellOffers}
        />
      )}
    </div>
  )
}

export default MaltegoCartItems
