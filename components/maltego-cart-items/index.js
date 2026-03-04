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
  const { offers = [] } = useCampaign()
  const { addToBasket } = useBasket()

  const offerGroups = R.groupBy(offer => groupPath(offer), offers)
  const firstProduct = Object.keys(offerGroups)[0] || null
  const firstOffer = firstProduct ? offerGroups[firstProduct][0] : null

  const [selectedProduct] = useState(firstProduct)
  const [selectedOffer, setSelectedOffer] = useState(firstOffer?.id || null)
  const [selectedTerm, setSelectedTerm] = useState(firstOffer?.data?.attributes?.term__limio || null)
  const [selectedAddOnProducts, setSelectedAddOnProducts] = useState([])
  const [selectedBillingPlan, setSelectedBillingPlan] = useState(firstOffer?.data?.attributes?.billing_plan?.[0] || null)
  const [quantity, setQuantity] = useState(1)

  if (!firstProduct || !selectedOffer) {
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

  const selectedOfferObj = offers.find(o => o.id === selectedOffer)
  const displayName = stripPathToProductName(selectedProduct)
  const displayPrice = selectedOfferObj ? stripHTMLtags(selectedOfferObj.data?.attributes?.display_price__limio || "") : ""

  const handleOfferSelection = (ratePlan, term) => {
    const productOffers = offerGroups[selectedProduct]
    const offer = productOffers.find(offer => {
      const offerTerm = offer.data.attributes.term__limio
      const offerRatePlan = offer.data.productBundles[0].rate_plan
      return (
        term.length === offerTerm.length &&
        term.renewal_trigger === offerTerm.renewal_trigger &&
        term.renewal_type === offerTerm.renewal_type &&
        term.type === offerTerm.type &&
        ratePlan === offerRatePlan
      )
    })
    if (offer) {
      setSelectedOffer(offer.id)
    } else {
      console.error("Offer not found", ratePlan, term)
    }
  }

  const handleTermChange = React.useCallback(
    term => {
      const possibleOptions = offerGroups[selectedProduct].filter(offer => R.equals(offer.data.attributes.term__limio, term))
      const ratePlan = possibleOptions[0].data.productBundles[0].rate_plan
      setSelectedBillingPlan(possibleOptions[0].data.attributes.billing_plan[0])
      setSelectedTerm(term)
      handleOfferSelection(ratePlan, term)
    },
    [selectedProduct]
  )

  const handleContinue = () => {
    if (selectedOfferObj && !readOnly) {
      addToBasket(selectedOfferObj, { quantity })
    }
  }

  const upsellLayout = showAsCards ? "card" : "radio"

  return (
    <div className="mci-container">
      <h2 className="mci-heading">Your Cart</h2>

      <div className="mci-cart-item">
        <span className="mci-cart-item__name">{displayName}</span>
        <span className="mci-cart-item__price">{displayPrice}</span>
      </div>

      <div className="mci-divider" />

      {displayUpsellOffers && (
        <BillingPlan
          selectedTerm={selectedTerm}
          handleTermChange={handleTermChange}
          selectedProduct={selectedProduct}
          upsellLayout={upsellLayout}
          showPrice={showPriceInUpsellOffers}
        />
      )}

      <QuantityField
        quantity={quantity}
        setQuantity={setQuantity}
        selectedOffer={selectedOffer}
        unitPriceLabel={unitPriceLabel}
      />

      <AddOnOptions
        selectedAddOnProducts={selectedAddOnProducts}
        setSelectedAddOnProducts={setSelectedAddOnProducts}
        selectedProduct={selectedProduct}
        selectedOffer={selectedOffer}
      />

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
