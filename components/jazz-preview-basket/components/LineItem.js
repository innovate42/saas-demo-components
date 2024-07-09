//@flow
import * as React from "react";
import {Input} from "@limio/design-system";
import { changeQuantityAction } from "@limio/shop-redux/src/shop/redux"
import {useSelector, useDispatch} from "@limio/shop";

const LineItem = ({lineItem }) => {
    const orderItem = useSelector(state => state.order.orderItems[0]);
    const {quantity, id} = orderItem;
    const dispatch = useDispatch();

    const {name, multibuy, amountWithoutTax, chargeName, productName, taxAmount, isOffer = false} =
        lineItem;

    const formatAmount = () => {
        const total = amountWithoutTax + taxAmount;
        return total.toFixed(2);
    };

    const handleChange = (e) => {
        if (e.target.value < 1) {
            return;
        }
        dispatch(changeQuantityAction(id, e.target.value));
    }

    return (
        <tr className={`basket-item-container`}>
            <td>
                <div className="basket-item-description">
                    <h4>{name || productName}</h4>
                    <p className="display-price">{`$${amountWithoutTax}`}</p>
                    <p className="detailed-display-price">{chargeName}</p>
                </div>
            </td>
            <td>
                <div className="basket-item-quantity">
                    <Input
                        name="quantity"
                        placeholder={quantity.toString()}
                        min={1}
                        max={100}
                        type="number"
                        step="1"
                        disabled={!multibuy && !isOffer}
                        value={quantity || 1}
                        onChange={(e) => handleChange(e)}
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
