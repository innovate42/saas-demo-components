//@flow
import * as React from "react";
import { Input } from "@limio/design-system";

const LineItem = ({ lineItem }) => {
  const { amountWithoutTax, chargeName, productName, quantity, taxAmount } =
    lineItem;

  const formatAmount = () => {
      //
    const total = amountWithoutTax + taxAmount;
    return total.toFixed(2);
  };

  return (
    <tr className={`basket-item-container`}>
      <td>
        <div className="basket-item-description">
          <h4>{productName}</h4>
          <p className="display-price">{`$${amountWithoutTax}`}</p>
          <p className="detailed-display-price">{chargeName}</p>
        </div>
      </td>
      <td>
        <div className="basket-item-quantity">
          <Input
            name="quantity"
            placeholder="1"
            min={1}
            max={100}
            type="number"
            step="1"
            disabled={true}
            value={quantity}
          />
        </div>
      </td>
      <td>
        <div className={"basket-item-total"}>
          <p className="basket-item-total-amount">{`$${amountWithoutTax}`}</p>
        </div>
      </td>
    </tr>
  );
};

export default LineItem;
