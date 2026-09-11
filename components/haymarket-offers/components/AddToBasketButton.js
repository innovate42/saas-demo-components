// @flow
import * as React from "react";
import { useBasket } from "@limio/sdk";

export function AddToBasketButton({ offer, primaryColor, quantity }): React.Node {
  const { addToBasket, removeFromBasket, basketItems } = useBasket();
  const { cta_text__limio } = offer.data.attributes;
  const offerInBasket = basketItems?.find(
    (basketItem) => basketItem.offer?.id === offer.id
  );

  const handleAdd = () => {
    if (quantity) {
      addToBasket(offer, { quantity });
    } else {
      addToBasket(offer);
    }
  };

  return (
    <>
      {!offerInBasket ? (
        <button
          type="button"
          onClick={handleAdd}
          className="hm-cta mt-auto font-semibold"
          style={{ backgroundColor: primaryColor }}
        >
          {cta_text__limio || "Build your licence"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => removeFromBasket(offer)}
          className="hm-cta hm-cta-remove mt-auto font-semibold"
          style={{ color: primaryColor, borderColor: primaryColor }}
        >
          Remove
        </button>
      )}
    </>
  );
}

export default AddToBasketButton;
