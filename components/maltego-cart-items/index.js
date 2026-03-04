import * as React from "react"
import { useState } from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import BillingPlan from "./components/BillingPlan"
import "./index.css"
import * as R from "ramda"
import { groupPath, stripHTMLtags } from "./helpers"

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

  // Campaign offers grouped by product — same as standard cart-items
  const offerGroups = R.groupBy(offer => groupPath(offer), offers)
  const firstProduct = Object.keys(offerGroups)[0] || null
  const firstOffer = firstProduct ? offerGroups[firstProduct][0] : null

  // Selected term initialised from basket item's current term, falling back to first campaign offer
  const currentOffer = basketItems[0]?.offer
  const initialTerm = currentOffer?.data?.attributes?.term__limio
    || firstOffer?.data?.attributes?.term__limio
    || null

  const [selectedTerm, setSelectedTerm] = useState(initialTerm)

  // Display name + price from basket item (what the user actually added to cart)
  const displayName = currentOffer?.data?.attributes?.display_name__limio
    || firstOffer?.data?.attributes?.display_name__limio
    || ""
  const displayPrice = stripHTMLtags(
    currentOffer?.data?.attributes?.display_price__limio
    || firstOffer?.data?.attributes?.display_price__limio
    || ""
  )

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

      {displayUpsellOffers && firstProduct && (
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
