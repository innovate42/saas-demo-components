import * as React from "react"
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

  const handleOfferChange = async (basketItemId, upsellOffer) => {
    if (swapOffer && basketItemId) {
      await swapOffer(basketItemId, upsellOffer)
    }
  }

  if (!basketItems.length || !basketItems[0]?.offer) {
    return (
      <div className="mci-container">
        <p className="mci-empty">{emptyCartMessage}</p>
        {emptyCTALabel && <a className="mci-continue-btn" href={emptyCartUrl}>{emptyCTALabel}</a>}
      </div>
    )
  }

  return (
    <div className="mci-container">
      {basketItems.map((basketItem, index) => {
        const offer = basketItem.offer
        if (!offer) return null
        const displayName = offer.data?.attributes?.display_name__limio || ""
        const displayPrice = basketItem.price
          ? formatCurrency(basketItem.price.amount, basketItem.price.currency)
          : ""
        const upsellOffers = basketItem.upsell || []

        return (
          <React.Fragment key={basketItem.id || index}>
            <div className="mci-cart-item">
              <span className="mci-cart-item__name">{displayName}</span>
              <span className="mci-cart-item__price">{displayPrice}</span>
            </div>
            {displayUpsellOffers && upsellOffers.length > 0 && (
              <BillingPlan
                upsellOffers={upsellOffers}
                selectedOfferId={offer.id}
                handleOfferChange={(upsellOffer) => handleOfferChange(basketItem.id, upsellOffer)}
                upsellLayout={showAsCards ? "card" : "radio"}
                showPrice={showPriceInUpsellOffers}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default MaltegoCartItems
