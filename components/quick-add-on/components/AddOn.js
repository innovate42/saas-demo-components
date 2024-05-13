// @flow
import * as React from "react";
import * as R from "ramda";
import {useBasket} from "@limio/sdk";
import {useDispatch} from "@limio/shop-redux"
import { useSelector } from "@limio/shop"
import {addToBasketAction, removeFromBasketAction, setBasketAction} from "@limio/shop-redux/src/shop/redux"
import {sanitizeString} from "@limio/shop/src/shop/offers/helpers"

const AddOn = ({addOn}) => {
    const {
        display_name__limio,
        description__limio,
        price__limio,
    } = addOn.data.attributes;
    const dispatch = useDispatch()
    const state = useSelector(state => state);
    const basketItems = useSelector(state => state.basket.basketItems);
    const offer = basketItems && basketItems.length > 0 ? basketItems[0].offer : null;
    const offerGroup = offer && offer.data.attributes.group__limio;
    const addOnGroup = R.pathOr(null, ["data", "attributes", "term_group"], addOn);
    const basketItemAddOnsIds = R.pathOr([], ["0", "addOns"], basketItems).map(addOn => addOn.id);

    if (addOnGroup) {
        if (offerGroup !== addOnGroup) {
            return null;
        }
    }

    if (basketItemAddOnsIds.includes(addOn.id)) {
        return null;
    }

    const basketAddOns = R.pathOr([], ["0", "addOns"], basketItems);

    const addOnInBasket = (addOn) => basketAddOns && basketAddOns.find(basketAddOn => basketAddOn.id === addOn.id);

    const addToBasket = (addOn) => {
        if (addOnInBasket(addOn)) {
            return ;
        }

        const newState = R.clone(state);
        newState.basket.basketItems = [];
        newState.order.orderItems = []

        dispatch(setBasketAction(newState))
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
