import * as React from "react"
import { useBasket } from "@limio/sdk"
import QuantitySlider from "./QuantitySlider"
import {
  formatCurrency,
  offerHasMultibuy,
  parseTemplate
} from "../helpers"

function AddOnRow({ addOnItem, addOnInformation, perUnitLabel, readOnly, tierPrefix, tierUnit }) {
  const { offer: addOn, quantity = 1, id } = addOnItem
  const basket = useBasket() || {}
  const { removeFromBasket, updateItemQuantity, basketLoading } = basket

  const attributes = addOn?.data?.attributes
  if (!attributes) {
    return <div className="cis-banner cis-banner--error">Something went wrong when displaying this add-on.</div>
  }

  const hasMultibuy = offerHasMultibuy(addOn)

  const onQuantityChange = async (q) => {
    if (updateItemQuantity) await updateItemQuantity(id, Number(q))
  }

  const onRemove = async () => {
    if (removeFromBasket) await removeFromBasket({ id })
  }

  const orderLineItem = addOnItem.orderLineItem || {}
  const formattedUnitPrice = orderLineItem.unitPriceTotal != null
    ? formatCurrency(orderLineItem.unitPriceTotal, orderLineItem.currency)
    : ""
  const formattedTotal = orderLineItem.lineItemTotal != null
    ? formatCurrency(orderLineItem.lineItemTotal, orderLineItem.currency)
    : ""

  return (
    <div className="cis-addon-row">
      <div className="cis-addon-row__text" data-testid="item-description">
        <span className="cis-addon-row__name">{attributes.display_name__limio}</span>
        {addOnInformation && (
          <span
            className="cis-addon-row__description"
            dangerouslySetInnerHTML={{ __html: parseTemplate(addOnInformation, addOn) }}
          />
        )}
      </div>
      <div className="cis-addon-row__controls">
        {!readOnly && (
          <QuantitySlider
            offer={addOn}
            quantity={quantity}
            onChange={onQuantityChange}
            disabled={basketLoading}
            tierPrefix={tierPrefix}
            tierUnit={tierUnit}
          />
        )}
        <div className="cis-price-block">
          <span className="cis-price-block__total" data-testid="item-price">{formattedTotal}</span>
          {hasMultibuy && formattedUnitPrice && (
            <span className="cis-price-block__unit" data-testid="item-unit-price">
              {parseTemplate(perUnitLabel, { formattedPrice: formattedUnitPrice, quantity })}
            </span>
          )}
        </div>
        {!readOnly && (
          <button
            type="button"
            className="cis-icon-button"
            onClick={onRemove}
            aria-label={`Remove Add On ${attributes.display_name__limio}`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default AddOnRow
