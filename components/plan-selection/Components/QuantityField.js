// @flow
import React from "react"
import { useCampaign } from "@limio/sdk"
import * as R from "ramda"

type Props = {
  quantity: number,
  setQuantity: (quantity: number) => void,
  selectedOffer: string
}

function QuantityField({ quantity, setQuantity, selectedOffer }: Props): React.Node {
  const { offers = [], addOns: addOnsFromCampaign } = useCampaign()
  let addOns
  if (Array.isArray(addOnsFromCampaign)) {
    addOns = addOnsFromCampaign
  } else {
    addOns = addOnsFromCampaign === null || addOnsFromCampaign === undefined ? [] : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign))
  }
  const [localQuantity, setLocalQuantity] = React.useState(quantity.toString())
  const selectedMultiBuy = offers.find(offer => offer.id === selectedOffer).data.attributes.allow_multibuy__limio

  const handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setLocalQuantity(inputValue)

    const numericValue = parseInt(inputValue, 10)
    if (!isNaN(numericValue)) {
      setQuantity(numericValue)
    }
  }

  if (!selectedMultiBuy) return null

  return (
    <>
      <p className="plan-title">QUANTITY</p>
      <div>
        <div className="billing-option">
          <label className="billing-option-label" htmlFor="quantity">
            <input type="number" id="quantity" value={localQuantity} onInput={handleChange} className="billing-option-input gap" />
          </label>
        </div>
      </div>
      <div className="row-border" />
    </>
  )
}

export default QuantityField
