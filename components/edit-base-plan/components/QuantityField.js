// @flow
import React from "react"

type Props = {
  quantity: number,
  setQuantity: (quantity: number) => void,
  onlyIncrease: boolean,
  subQuantity: number,
}

function QuantityField({ quantity, setQuantity , onlyIncrease, subQuantity = 1 }: Props): React.Node {
  const [localQuantity, setLocalQuantity] = React.useState(quantity.toString())

  const handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    if (onlyIncrease && parseInt(e.target.value) < subQuantity) {
      return
    }
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
