// @flow
import * as React from "react"
import { useBasket } from "@limio/sdk"

export function AddToBasketButton({ offer }): React.Node {
  const { addToBasket, removeFromBasket, basketItems } = useBasket()
  const  { cta_text__limio } = offer.data.attributes
  const offerInBasket = basketItems?.find(basketItem => basketItem.offer?.id === offer.id)

  return (
      <>
          {
            !offerInBasket
                ? <button type="button"
                          onClick={() => addToBasket(offer)}
                          className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {cta_text__limio}
                </button>
                : <button type="button"
                          onClick={() => removeFromBasket(offer)}
                          className="mt-auto text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                >
                  {"Remove"}
                </button>
          }
      </>
    )

}
