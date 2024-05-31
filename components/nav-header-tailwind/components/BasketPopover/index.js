// @flow
import React, { useState, useEffect } from "react"
import "./BasketPopover.css"
import { sanitizeString } from "@limio/shop/src/shop/offers/helpers"
import { Col, Row, ListGroup, ListGroupItem, PopoverBody, PopoverHeader, Input } from "@limio/design-system"
import { useDispatch, useStore } from "@limio/shop"
import { changeQuantityAction } from "@limio/shop-redux/src/shop/redux"
import { getAppConfigValue } from "@limio/shop/src/shop/appConfig.js"
import { initiateOrUpdateBasket } from "@limio/shop/src/shop/checkout/basket"
import { useBasket,} from "@limio/sdk"
import { useCheckout } from "@limio/internal-checkout-sdk"

type Props = {
  buttonColor: string,
  setBasketOpen: boolean,
  basketOpen: boolean
}
function BasketPopover({ buttonColor, setBasketOpen, basketOpen }: Props): React.Node {
  const { formattedTotal, removeFromBasket, goToCheckout, basketItems } = useBasket()
  const preventMixedRates = getAppConfigValue(["shop", "prevent_mixed_rates"])
  const [isBasketValid, setIsBasketValid] = useState(true)
  const { validateBasket } = useBasket()
  const toggleOpen = () => setBasketOpen(!basketOpen)
  const dispatch = useDispatch()
  const store = useStore()

  const { useCheckoutSelector } = useCheckout({ allowEmptyBasketSession: true })

  useEffect(() => {
    setIsBasketValid(validateBasket("preventMixedRates"))
  }, [basketItems, validateBasket])


  const externalPriceAnyOffer = useCheckoutSelector(state =>
    state.order.orderItems.map(item => item.offer?.data?.attributes?.price__limio?.[0]?.use_external_price)
  ).includes(true)

  const getName = offer => {
    const { attributes = {}, products = [] } = offer.data

    const offerName = attributes?.display_name__limio || offer.name
    const productName = products?.[0]?.attributes?.display_name__limio

    return productName ? (
      <>
        <span>{productName}</span> {offerName}
      </>
    ) : (
      offerName
    )
  }

  const handleRemoveOnClick = async (id, offer) => {
    await removeFromBasket({ ...offer, id })

    const { order, basket, locale, country } = store.getState()
    const { tracking } = order

    initiateOrUpdateBasket({ order, basket, tracking, country, locale })
  }

  return (
    <div data-popover id="popover-default" role="tooltip" class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
       
        <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700 flex">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="times"
          className="svg-inline--fa fa-times fa-w-11 "
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 352 512"
          style={{ width: "1.125em", height: "1em" }}
          onClick={toggleOpen}
        >
          <path
            fill="currentColor"
            d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
          />
        </svg>
        <h3 class="font-semibold text-gray-900 dark:text-white">My Basket</h3>
    </div>

    
    
      <div>
          {basketItems?.length ? (
            basketItems?.map(({ id, details, offer, price, quantity }) => (
              <div key={id}>
                <div>
                  <div className="basket-popover-item" md={12}>
                    <div>
                      <h4>{getName(offer)}</h4>
                      {details}
                      <div className="price-details">
                        <p className="display-price" dangerouslySetInnerHTML={{ __html: sanitizeString(price?.summary?.headline) }} />
                        <p className="detailed-display-price" dangerouslySetInnerHTML={{ __html: sanitizeString(price?.summary?.subline) }} />
                        {offer?.data?.attributes?.allow_multibuy__limio && (
                          <div className="basket-quantity">
                            <div className="basket-quantity-label">Quantity:</div>
                            <Input
                              name="number"
                              min={offer.data.attributes.default_quantity_options__limio?.minimum_quantity || 1}
                              max={offer.data.attributes.default_quantity_options__limio?.maximum_quantity}
                              type="number"
                              step={offer.data.attributes.default_quantity_options__limio?.increment}
                              value={quantity}
                              onChange={e => dispatch(changeQuantityAction(id, Number(e.target.value)))}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <span data-testid="removeItem" style={{ color: buttonColor }} className="remove" onClick={() => handleRemoveOnClick(id, offer)}>
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="times"
                        className="svg-inline--fa fa-times fa-w-11 "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 352 512"
                        style={{ width: "1.125em", height: "1em" }}
                      >
                        <path
                          fill="currentColor"
                          d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <span className="break"></span>
              </div>
            ))
          ) : (
            <p>No items in basket</p>
          )}
        {basketItems?.length ? (
          <>
            <div className="basket-total">
              {!externalPriceAnyOffer && (
                <>
                  <p style={{ marginTop: "0.2rem", marginBottom: "0.2rem" }}>Total:</p>
                  <h4>{formattedTotal}</h4>
                </>
              )}
            </div>
            <button
              onClick={() => goToCheckout()}
              className="checkout btn btn-primary"
              style={{ backgroundColor: buttonColor, border: buttonColor, width: "100%" }}
              disabled={preventMixedRates && !isBasketValid}
            >
              {"Checkout"}
            </button>
          </>
        ) : null}
        {preventMixedRates && !isBasketValid && (
          <div className="alert alert-danger basket-validation-error-label">
            {"You can only buy products with the same payment terms, please edit your basket and try again."}
          </div>
        )}
      </div>
    </div>
  )
}

export default BasketPopover
