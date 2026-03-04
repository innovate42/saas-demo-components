import * as React from "react"
import { useState } from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import BillingPlan from "./components/BillingPlan"
import AddOnOptions from "./components/AddOnOptions"
import QuantityField from "./components/QuantityField"
import "./index.css"
import * as R from "ramda"
import { groupPath, stripPathToProductName, stripHTMLtags } from "./helpers"

function MaltegoCartItems({
  showOfferIcons,
  offerAdditionalInfo,
  addOnAdditionalInfo,
  lineItemAdditionalInfo,
  addOnAdditionalInfo2,
  unitPriceLabel,
  emptyCartMessage = "Your cart is empty, view offers to go to offers",
  emptyCTALabel = "See offers",
  emptyCartUrl = "/default",
  displayUpsellOffers = true,
  showPriceInUpsellOffers = true,
  readOnly = false,
  showDiscountNote = false,
  showAsCards = false,
}) {
  // Basket items — what the user actually has in their cart
  const { basketItems = [], addToBasket } = useBasket()

  // Campaign offers — used only for term upsell options (may be empty on checkout pages)
  const { offers = [] } = useCampaign()

  // Derive upsell term groups from campaign offers
  const offerGroups = offers.length > 0 ? R.groupBy(offer => groupPath(offer), offers) : {}
  const firstProduct = Object.keys(offerGroups)[0] || null
  const firstOffer = firstProduct ? offerGroups[firstProduct][0] : null

  // State for term upsell selection — safe defaults if no campaign offers
  const [selectedOffer, setSelectedOffer] = useState(firstOffer?.id || null)
  const [selectedTerm, setSelectedTerm] = useState(firstOffer?.data?.attributes?.term__limio || null)
  const [selectedAddOnProducts, setSelectedAddOnProducts] = useState([])
  const [selectedBillingPlan, setSelectedBillingPlan] = useState(firstOffer?.data?.attributes?.billing_plan?.[0] || null)
  const [quantity, setQuantity] = useState(1)

  // Current basket item — the offer the user added from the pricing page
  const currentBasketItem = basketItems[0]
  const currentOffer = currentBasketItem?.offer

  // Display name + price: prefer basket item, fall back to campaign offer
  const displayName = currentOffer?.data?.attributes?.display_name__limio
    || (firstProduct ? stripPathToProductName(firstProduct) : "")
  const displayPrice = stripHTMLtags(
    currentOffer?.data?.attributes?.display_price__limio
    || firstOffer?.data?.attributes?.display_price__limio
    || ""
  )

  const hasContent = currentBasketItem || firstOffer

  const handleOfferSelection = (ratePlan, term) => {
    if (!firstProduct) return
    const productOffers = offerGroups[firstProduct]
    const offer = productOffers.find(o => {
      const offerTerm = o.data.attributes.term__limio
      const offerRatePlan = o.data.productBundles[0].rate_plan
      return (
        term.length === offerTerm.length &&
        term.renewal_trigger === offerTerm.renewal_trigger &&
        term.renewal_type === offerTerm.renewal_type &&
        term.type === offerTerm.type &&
        ratePlan === offerRatePlan
      )
    })
    if (offer) setSelectedOffer(offer.id)
  }

  const handleTermChange = React.useCallback(
    term => {
      if (!firstProduct) return
      const possibleOptions = offerGroups[firstProduct].filter(o => R.equals(o.data.attributes.term__limio, term))
      setSelectedBillingPlan(possibleOptions[0].data.attributes.billing_plan[0])
      setSelectedTerm(term)
      handleOfferSelection(possibleOptions[0].data.productBundles[0].rate_plan, term)
    },
    [firstProduct]
  )

  const handleContinue = () => {
    if (readOnly) return
    const offerToAdd = offers.find(o => o.id === selectedOffer) || currentOffer
    if (offerToAdd) addToBasket(offerToAdd, { quantity })
  }

  const upsellLayout = showAsCards ? "card" : "radio"

  if (!hasContent) {
    return (
      <div className="mci-container">
        <p className="mci-empty">{emptyCartMessage}</p>
        {emptyCTALabel && (
          <div className="mci-actions">
            <a className="mci-continue-btn" href={emptyCartUrl}>{emptyCTALabel}</a>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mci-container">
      <h2 className="mci-heading">Your Cart</h2>

      <div className="mci-cart-item">
        <span className="mci-cart-item__name">{displayName}</span>
        <span className="mci-cart-item__price">{displayPrice}</span>
      </div>

      <div className="mci-divider" />

      {displayUpsellOffers && firstProduct && (
        <BillingPlan
          selectedTerm={selectedTerm}
          handleTermChange={handleTermChange}
          selectedProduct={firstProduct}
          upsellLayout={upsellLayout}
          showPrice={showPriceInUpsellOffers}
        />
      )}

      {firstProduct && (
        <QuantityField
          quantity={quantity}
          setQuantity={setQuantity}
          selectedOffer={selectedOffer}
          unitPriceLabel={unitPriceLabel}
        />
      )}

      {firstProduct && (
        <AddOnOptions
          selectedAddOnProducts={selectedAddOnProducts}
          setSelectedAddOnProducts={setSelectedAddOnProducts}
          selectedProduct={firstProduct}
          selectedOffer={selectedOffer}
        />
      )}

      <div className="mci-divider" />

      <div className="mci-totals">
        <div className="mci-total-row">
          <span>Subtotal</span>
          <span>{displayPrice}</span>
        </div>
        <div className="mci-total-row mci-total-row--total">
          <span>Total</span>
          <span>{displayPrice}</span>
        </div>
      </div>

      {!readOnly && (
        <div className="mci-actions">
          <button className="mci-continue-btn" onClick={handleContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

export default MaltegoCartItems
