// @flow
import React from "react";
import { useBasket } from "@limio/sdk";
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket";

export const AddToBasketButton = ({ offer, quantity = 1 }) => {
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, pageOptions } =
    useBasket();

  async function addSelectionToBasket() {
    const checkoutId = getCurrentBasketId();

    if (!checkoutId) {
      await initiateCheckout({ order: { orderItems: [{ offer, quantity }] } });
    } else {
      await addOfferToBasket({ offer, quantity });
    }

    if (pageOptions && pageOptions.pushToCheckout) {
      await navigateToCheckout();
    }
  }

  return (
    <button
      type="button"
      className="soc2-select"
      onClick={addSelectionToBasket}
    >
      {offer.data.attributes.cta_text__limio || "Select"}
    </button>
  );
};

export default AddToBasketButton;
