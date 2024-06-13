// @flow
import * as React from "react"
import { useBasket } from "@limio/sdk"

export function AddToBasketButton({ offer, primaryColor }): React.Node {
  const { addToBasket, removeFromBasket, basketItems } = useBasket()
  const  { cta_text__limio } = offer.data.attributes
  const offerInBasket = basketItems?.find(basketItem => basketItem.offer?.id === offer.id)

  return (
      <>
          {
            !offerInBasket
                ? <button type="button"
                          onClick={() => addToBasket(offer)}
                          className="mt-auto text-white  hover:bg-white f font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 add-to-basket-button"
                          style={{backgroundColor: `${primaryColor}`}}
                >
                  {cta_text__limio}
                </button>
                : <button type="button"
                          onClick={() => removeFromBasket(offer)}
                          className="mt-auto  text-white  hover:text-white border   font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 add-to-basket-button"
                          style={{backgroundColor: `${primaryColor}`}}
                >
                  {"Remove"}
                </button>
          }
      </>
    )

}
