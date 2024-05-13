// @flow
import * as React from "react";
import * as R from "ramda";
import {useBasket} from "@limio/sdk";
import {useDispatch} from "@limio/shop-redux"
import {addToBasketAction} from "@limio/shop-redux/src/shop/redux"
import {sanitizeString} from "@limio/shop/src/shop/offers/helpers"

const AddOn = ({addOn}) => {
    const {
        display_name__limio,
        description__limio,
        price__limio,
    } = addOn.data.attributes;


    const {basketItems = []} = useBasket();
    const dispatch = useDispatch()

    const basketAddOns = R.pathOr([], ["0", "addOns"], basketItems);

    const addOnInBasket = (addOn) => basketAddOns && basketAddOns.find(basketAddOn => basketAddOn.id === addOn.id);

    const addToBasket = (addOn) => {
        if (addOnInBasket(addOn)) {
            return ;
        }

        // clear the basket here

        const newBasketAddOns = basketAddOns ? [...basketAddOns, {addOn: addOn, quantity: 1}] : [{
            addOn: addOn,
            quantity: 1
        }];
        const {offer, quantity} = basketItems[0];
        dispatch(addToBasketAction({offer: offer, addOns: newBasketAddOns, quantity: quantity, pushToCheckout: false}))
    };

    const formatCurrency = (amount = 0, currency = "GBP") => {
        if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
            return new Intl.NumberFormat("en-US", {style: "currency", currency: currency}).format(amount)
        } else {
            return `${currency} ${amount}`
        }
    }


    return (
        <div className="add-on">
            <h3 className="add-on-title">{display_name__limio}</h3>
            <div className="price-container">
                <span className="price" dangerouslySetInnerHTML={{
                    __html: sanitizeString(formatCurrency(price__limio[0].value, price__limio[0].currencyCode))
                }}></span>
            </div>
            <p className="subtext"></p>
            <p className="description" dangerouslySetInnerHTML={{__html: description__limio}}></p>
            <button className="cta-button" onClick={() => addToBasket(addOn)}>Call to Action</button>
        </div>
    );
};

export default AddOn;
