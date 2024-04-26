// @flow
import * as React from "react"
import { usePreview } from "@limio/ui-preview-context"
import { v4 as uuid } from "uuid"

type Props = {
  selectedProduct: string,
  selectedTerm: Object,
  handleQuantityChange: (quantity: number) => void,
  quantity: number,
  setQuantity: (quantity: number) => void
}

function PlanQuantity({ handleQuantityChange, quantity }: Props): React.Node {
  const { loadingPreview } = usePreview()

  return (
    <>
      <p className="plan-title">Number of Seats</p>
      <div>
        <div className="plan-quantity" key={uuid()}>
          <label className={"plan-quantity-input"} />
          <input
            type="number"
            id={"quantity"}
            value={quantity}
            onChange={e => handleQuantityChange(e.target.value)}
            className="plan-quantity-input gap"
            disabled={loadingPreview}
          />
        </div>
      </div>
      <div className="row-border" />
    </>
  )
}

export default PlanQuantity
