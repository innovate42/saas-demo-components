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
                ? <div 
                          onClick={() => addToBasket(offer)}
                          className="font-medium text-sm px-5 py-2.5 add-to-basket-button text-center"
                >
                  {cta_text__limio}
                </div>
                : <div 
                          onClick={() => removeFromBasket(offer)}
                          className="border font-medium text-sm px-5 py-2.5 text-center add-to-basket-button"
                >
                  {"Remove"}
                </div>
          }
      </>
    )

}
