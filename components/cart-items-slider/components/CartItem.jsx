import * as React from "react"
import { useBasket } from "@limio/sdk"
import QuantitySlider from "./QuantitySlider"
import AddOnRow from "./AddOnRow"
import Upsell from "./Upsell"
import {
  formatCurrency,
  getDiscountMessage,
  getDiscountNote,
  offerHasMultibuy,
  parseTemplate
} from "../helpers"

function CartItem({ orderItem, componentProps, addOnItems = [] }) {
  const {
    showIcons,
    offerInformation,
    lineItemInformation,
    addOnInformation,
    perUnitLabel,
    displayUpsellOffers,
    showUpsellPrice,
    readOnly,
    showDiscountNote,
    tierPrefix,
    tierUnit
  } = componentProps

  const basket = useBasket() || {}
  const { removeFromBasket, swapOffer, updateItemQuantity, basketLoading } = basket

  const quantity = orderItem.quantity || 1
  const shouldDisplayUpsellOffers =
    displayUpsellOffers && !readOnly && (orderItem.upsell?.length || 0) > 0

  const { orderLineItem = {}, offer } = orderItem
  const offerAttributes = offer?.data?.attributes
  const product = offer?.data?.products?.[0]

  if (!offerAttributes || !product) {
    return (
      <div className="cis-banner cis-banner--error">
        Something went wrong when displaying this offer. Please try refreshing, and contact us if the issue persists.
      </div>
    )
  }

  const hasMultibuy = offerHasMultibuy(offer)
  const isLineItem = offer?.data?.record_subtype === "line_item"
  const itemInformation = isLineItem ? lineItemInformation : offerInformation

  const attachment = offer?.data?.attachments?.[0]
  const hasOfferThumbnail =
    showIcons && attachment && String(attachment.type || "").includes("image") && attachment.url

  const discountInfo = getDiscountMessage(orderItem) || (showDiscountNote && getDiscountNote(orderItem))

  const onQuantityChange = async (q) => {
    if (updateItemQuantity) await updateItemQuantity(orderItem.id, Number(q))
  }

  const onRemove = async () => {
    if (removeFromBasket) await removeFromBasket({ id: orderItem.id })
  }

  const onUpsell = async (upsellOffer) => {
    if (swapOffer) await swapOffer(orderItem.id, upsellOffer)
  }

  const formattedUnitPrice =
    orderLineItem.unitPriceTotal != null
      ? formatCurrency(orderLineItem.unitPriceTotal, orderLineItem.currency)
      : ""
  const formattedTotal =
    orderLineItem.lineItemTotal != null
      ? formatCurrency(orderLineItem.lineItemTotal, orderLineItem.currency)
      : ""

  return (
    <div className="cis-item">
      <div className="cis-item__main">
        <div className="cis-item__info">
          {hasOfferThumbnail && (
            <div className="cis-item__thumb">
              <img src={attachment.url} alt="" />
            </div>
          )}
          <div className="cis-item__description" data-testid="item-description">
            <span className="cis-item__name">
              {product.attributes?.display_name__limio} - {offerAttributes.display_name__limio}
            </span>
            {itemInformation && (
              <span
                className="cis-item__detail"
                dangerouslySetInnerHTML={{ __html: parseTemplate(itemInformation, offer) }}
              />
            )}
          </div>
          {!readOnly && (
            <button
              type="button"
              className="cis-icon-button cis-icon-button--mobile"
              onClick={onRemove}
              aria-label={`Remove Item ${offerAttributes.display_name__limio}`}
            >
              ×
            </button>
          )}
        </div>
        <div className="cis-item__controls">
          <div className="cis-price-block">
            {discountInfo && (
              <span className={`cis-price-block__discount ${discountInfo.className || ""}`} data-testid="discount-note">
                {discountInfo.content}
              </span>
            )}
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
              className="cis-icon-button cis-icon-button--desktop"
              onClick={onRemove}
              aria-label={`Remove Item ${offerAttributes.display_name__limio}`}
            >
              ×
            </button>
          )}
        </div>
      </div>
      {!readOnly && (
        <div className="cis-item__slider-row">
          <QuantitySlider
            offer={offer}
            quantity={quantity}
            onChange={onQuantityChange}
            disabled={basketLoading}
            tierPrefix={tierPrefix}
            tierUnit={tierUnit}
          />
        </div>
      )}
      {addOnItems.map((addOnItem) => (
        <div
          key={addOnItem.id}
          className={`cis-addon-wrapper${hasOfferThumbnail ? " cis-addon-wrapper--indent" : ""}`}
          data-testid="cart-item"
        >
          <AddOnRow
            addOnItem={addOnItem}
            addOnInformation={addOnInformation}
            perUnitLabel={perUnitLabel}
            readOnly={readOnly}
            tierPrefix={tierPrefix}
            tierUnit={tierUnit}
          />
        </div>
      ))}
      {shouldDisplayUpsellOffers && (
        <div className={`cis-upsell-wrapper${hasOfferThumbnail ? " cis-upsell-wrapper--indent" : ""}`}>
          <hr className="cis-separator" />
          <Upsell
            offers={orderItem.upsell}
            currentOffer={orderItem.offer}
            onUpsell={onUpsell}
            showUpsellPrice={showUpsellPrice}
          />
        </div>
      )}
    </div>
  )
}

export default CartItem
