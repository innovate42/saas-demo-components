// @flow
import * as React from "react";
import * as R from "ramda";
import {useBasket} from "@limio/sdk";
import {useDispatch} from "@limio/shop-redux"
import {addToBasketAction} from "@limio/shop-redux/src/shop/redux"
import {formatDisplayPrice, sanitizeString} from "@limio/utils/string";


const AddOn = ({addOn}) => {
    const {
        display_name__limio,
        display_price__limio,
        description__limio,
        price__limio,
    } = addOn.data.attributes;


    const {basketItems = []} = useBasket();
    const dispatch = useDispatch()

    const basketAddOns = R.pathOr([], ["0", "addOns"], basketItems);

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
        <div className="add-on">
            <h3 className="add-on-title">{display_name__limio}</h3>
            <div className="price-container">
                <span className="price" dangerouslySetInnerHTML={{
                    __html: sanitizeString(formatDisplayPrice(display_price__limio, [{
                        currencyCode: price__limio[0].currencyCode,
                        value: price__limio[0].value,
                    }]))
                }}></span>
            </div>
            <p className="subtext"></p>
            <p className="description" dangerouslySetInnerHTML={{__html: description__limio}}></p>
            <button className="cta-button" onClick={() => addToBasket(addOn)}>Call to Action</button>
        </div>
    );
};

export default AddOn;
