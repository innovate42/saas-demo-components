// @flow
import React, { useState, useEffect } from "react"
import { useLimioContext, useBasket } from "@limio/sdk"
import BasketPopover from "../BasketPopover"

type Props = {
  mobile: boolean
}

function BasketButton({ mobile, basketColor__limio_color }: Props): React.Node {
  const { isInPageBuilder } = useLimioContext()
  const { basketItems } = useBasket()
  const [basketOpen, setBasketOpen] = useState(false)


  useEffect(() => {
    if (basketItems?.length > 0) {
      setBasketOpen(true)
    }
  }, [basketItems])

  console.log("basket open", basketOpen)

  console.log("basketColor__limio_color", basketColor__limio_color)
  return (
    <div className="relative" style={{border:"1px red solid"}}>
      <button
        id="basketButton"
        aria-label="show basket"
        style={{
          color: basketColor__limio_color
          
        }}
        className="px-2 py-2 text-center relative"
        onClick={() => {
          setBasketOpen(!basketOpen)
        }}
        data-popover-target="popover-default"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="shopping-cart"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          className="svg-inline--fa fa-shopping-cart fa-w-18"
          style={{ width: "1.125em", height: "1em" }}
        >
          <path
            fill="currentColor"
            d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"
          />
        </svg>
      
        <div className="absolute bottom-0 left-0" style={{color: basketColor__limio_color}}>
        {basketItems?.length ? <span className="">{basketItems?.length}</span> : null}
        </div>
      </button>
     
      {!isInPageBuilder && <BasketPopover buttonColor={basketColor__limio_color} basketOpen={basketOpen} setBasketOpen={setBasketOpen} />}
    </div>
  )
}

export default BasketButton
