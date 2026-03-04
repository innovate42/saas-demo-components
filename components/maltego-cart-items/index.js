import * as React from "react"
import { useState } from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import BillingPlan from "./components/BillingPlan"
import "./index.css"
import * as R from "ramda"
import { groupPath, formatCurrency } from "./helpers"

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
  const { offers = [] } = useCampaign()

  console.log('[MCI] basketItems:', JSON.stringify(basketItems?.length), 'offers:', JSON.stringify(offers?.length), 'offer keys:', offers?.[0] ? Object.keys(offers[0]?.data?.attributes || {}).slice(0, 5) : 'none')

  const currentBasketItem = basketItems[0]
  const currentOffer = currentBasketItem?.offer

  // Campaign offers grouped by product — same as standard cart-items
  const offerGroups = R.groupBy(offer => groupPath(offer), offers)
  const firstProduct = Object.keys(offerGroups)[0] || null
  const firstOffer = firstProduct ? offerGroups[firstProduct][0] : null

  // Selected term: prefer basket item's current term, fall back to first campaign offer
  const initialTerm = currentOffer?.data?.attributes?.term__limio
    || firstOffer?.data?.attributes?.term__limio
    || null

  const [selectedTerm, setSelectedTerm] = useState(initialTerm)

  // Display name from offer attributes
  const displayName = currentOffer?.data?.attributes?.display_name__limio
    || firstOffer?.data?.attributes?.display_name__limio
    || ""

  // Price from basket item's price object — gives correct currency format e.g. US$3,450.00
  const displayPrice = currentBasketItem?.price
    ? formatCurrency(currentBasketItem.price.amount, currentBasketItem.price.currency)
    : ""

  if (!currentOffer && !firstOffer) {
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

      {displayUpsellOffers && (
        <BillingPlan
          selectedProduct={firstProduct}
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
