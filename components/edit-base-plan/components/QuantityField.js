// @flow
import React from "react"

type Props = {
  quantity: number,
  setQuantity: (quantity: number) => void
}

function QuantityField({ quantity, setQuantity }: Props): React.Node {
  const [localQuantity, setLocalQuantity] = React.useState(quantity.toString())

  const handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setLocalQuantity(inputValue)

    const numericValue = parseInt(inputValue, 10)
    if (!isNaN(numericValue)) {
      setQuantity(numericValue)
    }
  }

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
