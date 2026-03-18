import * as React from "react"
import { useBasket, useCampaign } from "@limio/sdk"
import { stripHTMLtags, stripPathToProductName, formatCurrency } from "../helpers"
import * as R from "ramda"

function PreviewBasket({ selectedProduct, selectedOffer, basketDescText }) {
  const { offers = [] } = useCampaign()
  const { addToBasket } = useBasket()

  const selectedOfferObj = offers.find(offer => offer.id === selectedOffer)

  const displayName = selectedOfferObj
    ? stripPathToProductName(selectedProduct)
    : "—"

  const displayPrice = selectedOfferObj
    ? stripHTMLtags(selectedOfferObj.data?.attributes?.display_price__limio || "")
    : ""

  const handleClick = () => {
    if (selectedOfferObj) {
      addToBasket(selectedOfferObj, { quantity: 1 })
    }
  }

  return (
    <div className="inset">
      <div>
        <h3>Your Plan</h3>
        <div className="flex space-between center">
          <h5 className="bold">{displayName}</h5>
        </div>
        {displayPrice && <p>{displayPrice}</p>}
      </div>

      <div className="row-border" />

      {basketDescText && (
        <div dangerouslySetInnerHTML={{ __html: basketDescText }} />
      )}

      <div className="flex" style={{ marginTop: "1rem" }}>
        <button className="add-btn add-remove-btns ml-auto mr-4 w-6 pt-1 pb-1" onClick={handleClick}>
          Continue
        </button>
      </div>
    </div>
  )
}

export default PreviewBasket
