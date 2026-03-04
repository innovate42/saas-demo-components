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
  const { basketItems = [] } = useBasket()

  const currentBasketItem = basketItems[0]
  const currentOffer = currentBasketItem?.offer

  // Debug: log full basket item so we can see the real data structure
  console.log('[MCI] basketItem keys:', JSON.stringify(Object.keys(currentBasketItem || {})))
  console.log('[MCI] offer attr keys:', JSON.stringify(Object.keys(currentOffer?.data?.attributes || {})))
  console.log('[MCI] upsell_offers__limio:', JSON.stringify(currentOffer?.data?.attributes?.upsell_offers__limio))

  // Upsell offers are embedded in the basket item's offer data
  const upsellOffers = currentOffer?.data?.attributes?.upsell_offers__limio || []

  // Selected term: the current basket item's term
  const initialTerm = currentOffer?.data?.attributes?.term__limio || null
  const [selectedTerm, setSelectedTerm] = useState(initialTerm)

  // Display name from offer attributes
  const displayName = currentOffer?.data?.attributes?.display_name__limio || ""

  // Price from basket item's price object — gives correct currency format e.g. US$3,450.00
  const displayPrice = currentBasketItem?.price
    ? formatCurrency(currentBasketItem.price.amount, currentBasketItem.price.currency)
    : ""

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
          selectedTerm={selectedTerm}
          handleTermChange={setSelectedTerm}
          upsellLayout={showAsCards ? "card" : "radio"}
          showPrice={showPriceInUpsellOffers}
        />
      )}
    </div>
  )
}

export default MaltegoCartItems
