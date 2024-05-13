import * as React from "react";
import * as R from "ramda";
import {useBasket, useCampaign} from "@limio/sdk";
import {useDispatch} from "@limio/shop-redux"
import {addToBasketAction} from "@limio/shop-redux/src/shop/redux"

import "./index.css";

type Props = {};

function QuickAddOn({includeDesc, ctaText}: Props): React.Node {
    const {addOns = []} = useCampaign();
    const {basketItems = []} = useBasket();
    const basketAddOns = R.pathOr([], ["0", "addOns"], basketItems);
    const dispatch = useDispatch()

    const addOnInBasket = (addOn) => basketAddOns && basketAddOns.find(basketAddOn => basketAddOn.id === addOn.id);

    const addToBasket = (addOn) => {
        if (addOnInBasket(addOn)) {
            return;
        }

        const newBasketAddOns = basketAddOns ? [...basketAddOns, {addOn: addOn, quantity: 1}] : [{
            addOn: addOn,
            quantity: 1
        }];

        const {offer, quantity} = basketItems;

        dispatch(addToBasketAction({offer: offer, addOns: newBasketAddOns, quantity: quantity, pushToCheckout: false}))
    };

    return (
        <div className="quick-add-container">
            {addOns.map(addOn => (
                <div className="quick-add-item" key={addOn.id}>
                    <div className="quick-add-item-content">
                        <div className="quick-add-item-name">{addOn.name}</div>
                        <div className="quick-add-item-price">{addOn.price}</div>

                        {includeDesc &&
                            <div dangerouslySetInnerHTML={{__html: addOn.data.attributes.description__limio}}></div>}
                        <button className="quick-add-to-basket" onClick={() => addToBasket(addOn)}>
                            {ctaText || "Add to basket"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default QuickAddOn;
