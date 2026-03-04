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
  // remaining props accepted but not used (match standard cart-items prop signature)
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

  // Current item comes from the basket (added on pricing page)
  const currentBasketItem = basketItems[0]
  const currentOffer = currentBasketItem?.offer

  // Derive selected product path from basket item — used to find matching upsell terms
  const basketProductPath = currentOffer?.data?.products?.[0]?.path || null

  // Fall back to campaign offers if basket is empty (e.g. in page builder / Storybook)
  const offerGroups = offers.length > 0 ? R.groupBy(offer => groupPath(offer), offers) : {}
  const firstCampaignProduct = Object.keys(offerGroups)[0] || null

  const selectedProduct = basketProductPath || firstCampaignProduct
  const firstOffer = selectedProduct && offerGroups[selectedProduct] ? offerGroups[selectedProduct][0] : null

  // Selected term: start from the basket item's current term
  const initialTerm = currentOffer?.data?.attributes?.term__limio
    || firstOffer?.data?.attributes?.term__limio
    || null

  const [selectedTerm, setSelectedTerm] = useState(initialTerm)
  const [selectedOffer, setSelectedOffer] = useState(currentOffer?.id || firstOffer?.id || null)

  const displayName = currentOffer?.data?.attributes?.display_name__limio
    || firstOffer?.data?.attributes?.display_name__limio
    || ""

  const displayPrice = stripHTMLtags(
    currentOffer?.data?.attributes?.display_price__limio
    || firstOffer?.data?.attributes?.display_price__limio
    || ""
  )

  const handleTermChange = React.useCallback(
    term => {
      if (!selectedProduct || !offerGroups[selectedProduct]) return
      const possibleOptions = offerGroups[selectedProduct].filter(o =>
        R.equals(o.data.attributes.term__limio, term)
      )
      if (possibleOptions.length > 0) {
        setSelectedTerm(term)
        setSelectedOffer(possibleOptions[0].id)
      }
    },
    [selectedProduct, offerGroups]
  )

  const upsellLayout = showAsCards ? "card" : "radio"

  if (!currentBasketItem && !firstOffer) {
    return (
      <div className="mci-container">
        <p className="mci-empty">{emptyCartMessage}</p>
        {emptyCTALabel && (
          <a className="mci-continue-btn" href={emptyCartUrl}>{emptyCTALabel}</a>
        )}
      </div>
    )
  }

  return (
    <div className="mci-container">
      <div className="mci-cart-item">
        <span className="mci-cart-item__name">{displayName}</span>
        <span className="mci-cart-item__price">{displayPrice}</span>
      </div>

      {displayUpsellOffers && selectedProduct && (
        <BillingPlan
          selectedTerm={selectedTerm}
          handleTermChange={handleTermChange}
          selectedProduct={selectedProduct}
          upsellLayout={upsellLayout}
          showPrice={showPriceInUpsellOffers}
        />
      )}
    </div>
  )
}

export default MaltegoCartItems
