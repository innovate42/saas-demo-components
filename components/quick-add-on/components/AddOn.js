// @flow
import * as React from "react"
import * as R from "ramda"
import { useBasket, useLimioContext } from "@limio/sdk"
import { useDispatch } from "@limio/shop-redux"
import { useSelector } from "@limio/shop"
import { setBasketAction } from "@limio/shop-redux/src/shop/redux"
import { sanitizeString } from "@limio/shop/src/shop/offers/helpers"

const AddOn = ({ addOn, ctaText }) => {
  const { display_name__limio, description__limio, price__limio, display_external_price } = addOn.data.attributes
  const dispatch = useDispatch()
  const state = useSelector(state => state)
  const basketItems = useSelector(state => state.basket.basketItems)
  const { addToBasket } = useBasket()
  const { isInPageBuilder } = useLimioContext()

  const offer = basketItems && basketItems.length > 0 ? basketItems[0].offer : null
  const offerGroup = offer && offer.data.attributes.group__limio
  const addOnGroup = R.pathOr(null, ["data", "attributes", "term_group"], addOn)
  const basketItemAddOnsIds = R.pathOr([], ["0", "addOns"], basketItems).map(item => item.addOn.id)

  if (addOnGroup && !isInPageBuilder) {
    if (offerGroup !== addOnGroup) {
      return null
    }
  }

  if (basketItemAddOnsIds.includes(addOn.id) && !isInPageBuilder) {
    return null
  }

  const basketAddOns = R.pathOr([], ["0", "addOns"], basketItems)

  const addToBasketHandler = addOn => {
    const newState = R.clone(state)
    newState.basket.basketItems = []
    newState.order.orderItems = []

    dispatch(setBasketAction(newState))

    const defaultQuantity = addOn.data.attributes.default_quantity_options__limio?.quantity || 1
    const newAddOn = { addOn: addOn, quantity: defaultQuantity }

    const newBasketAddOns = basketAddOns ? [...basketAddOns, newAddOn] : [newAddOn]

    const { offer, quantity } = basketItems[0]
    addToBasket(offer, { addOns: newBasketAddOns, quantity: quantity })
  }

  const formatCurrency = (amount = 0, currency = "GBP") => {
    if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency
      }).format(amount)
    } else {
      return `${currency} ${amount}`
    }
  }

  const handleAddOnPrice = () => {
    if (display_external_price) {
      return display_external_price
    } else {
      console.error("Config missing for display_external_price")
      return formatCurrency(price__limio[0].value, price__limio[0].currencyCode)
    }
  }

  return (
    <div className="add-on">
      <h3 className="add-on-title">{display_name__limio}</h3>
      <div className="price-container">
        <span
          className="price"
          dangerouslySetInnerHTML={{
            __html: sanitizeString(handleAddOnPrice())
          }}
        ></span>
      </div>
      <p className="subtext"></p>
      <p className="description" dangerouslySetInnerHTML={{ __html: description__limio }}></p>

      <button className="cta-button" onClick={() => addToBasketHandler(addOn)}>
        {ctaText}
      </button>
    </div>
  )
}

export default AddOn
