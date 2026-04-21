import * as React from "react"
import { useBasket } from "@limio/sdk"
import { useCheckout } from "@limio/internal-checkout-sdk"
import CartItem from "./components/CartItem"
import "./index.css"

function CartItemsSlider(props) {
  const {
    showIcons = true,
    offerInformation = "{{data.attributes.display_description__limio}}",
    lineItemInformation = "",
    addOnInformation = "{{data.attributes.description__limio}}",
    perUnitLabel = "{quantity} x {formattedPrice} each",
    tierPrefix = "",
    tierUnit = "",
    emptyText = "Your cart is empty, view offers to get started",
    emptyCta = "See offers",
    emptyUrl = "/default",
    displayUpsellOffers = false,
    showUpsellPrice = true,
    readOnly = false,
    showDiscountNote = false
  } = props

  const componentProps = {
    showIcons,
    offerInformation,
    lineItemInformation,
    addOnInformation,
    perUnitLabel,
    tierPrefix,
    tierUnit,
    displayUpsellOffers,
    showUpsellPrice,
    readOnly,
    showDiscountNote
  }

  const basket = useBasket() || {}
  const { useCheckoutSelector } = useCheckout({ redirectOnFailure: false }) || {}

  // Prefer basketItems (overridable via LimioProvider value), fall back to
  // checkout order.orderItems which is what the upstream cart-items reads.
  const orderItems =
    (Array.isArray(basket.basketItems) && basket.basketItems.length && basket.basketItems) ||
    (useCheckoutSelector && useCheckoutSelector((s) => s.order?.orderItems)) ||
    []

  const parents = orderItems.filter((i) => !i.parentId)

  if (!parents.length) {
    return (
      <div className="cis-root cis-root--empty">
        <p className="cis-empty-text">{emptyText}</p>
        {emptyCta && (
          <a className="cis-empty-cta" href={emptyUrl}>{emptyCta}</a>
        )}
      </div>
    )
  }

  return (
    <div className="cis-root">
      {parents.map((orderItem, index) => {
        const addOns = orderItems.filter((i) => i.parentId === orderItem.id)
        return (
          <div key={orderItem.id || index}>
            <CartItem orderItem={orderItem} componentProps={componentProps} addOnItems={addOns} />
            <hr className="cis-separator cis-separator--section" />
          </div>
        )
      })}
    </div>
  )
}

export default CartItemsSlider
