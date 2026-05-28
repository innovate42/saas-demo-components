// @flow
import * as React from "react";
import {groupedOffers, groupedAddOns} from "../../data/offers";

import {basketItems} from "../../data/basket";
import {docUser} from "../../data/user";

const LimioContext = React.createContext({});
export const ComponentContext = React.createContext({});


export function useCampaign() {
    const context = React.useContext(LimioContext);
    if (context === undefined) {
        throw new Error("useCampaign must be used within a LimioProvider");
    }
    const shop = (context && context.shop) || dummyContext.shop;
    const {campaign, offers, addOns} = shop;
    return {campaign, offers, addOns};
}


export function useBasket() {
    const context = React.useContext(LimioContext);
    if (context === undefined) {
        throw new Error("useBasket must be used within a LimioProvider");
    }
    const shop = (context && context.shop) || dummyContext.shop;
    return {
        orderItems: shop.basketItems || [],
        basketItems: shop.basketItems || [],
        basketLoading: Boolean(shop.basketLoading),
        pageOptions: shop.campaign?.attributes || { pushToCheckout: false },
        addToBasket: shop.addToBasket || ((offer) => console.log("[Storybook] addToBasket", offer)),
        addOfferToBasket: shop.addOfferToBasket || (async (data) => console.log("[Storybook] addOfferToBasket", data)),
        initiateCheckout: shop.initiateCheckout || (async (data) => console.log("[Storybook] initiateCheckout", data)),
        navigateToCheckout: shop.navigateToCheckout || (async () => console.log("[Storybook] navigateToCheckout")),
        removeFromBasket: shop.removeFromBasket || (({id} = {}) => console.log("[Storybook] removeFromBasket", id)),
        swapOffer: shop.swapOffer || ((itemId, offer) => console.log("[Storybook] swapOffer", itemId, offer)),
        updateItemQuantity: shop.updateItemQuantity || ((id, q) => console.log("[Storybook] updateItemQuantity", id, q)),
        clearOrderItems: shop.clearOrderItems || (() => console.log("[Storybook] clearOrderItems")),
    };
}


export function useLimioContext() {
    const context = React.useContext(LimioContext);
    if (context === undefined) {
        throw new Error("useLimioContext must be used within a LimioProvider");
    }
    const {pageBuilder__limio: isInPageBuilder} = dummyContext;
    return {isInPageBuilder};
}

// Selection of LimioContextShop properties

export function useSubscriptions() {
    const context = React.useContext(LimioContext);
    if (context === undefined) {
        throw new Error("useSubscriptions must be used within a LimioProvider");
    }
    return {subscriptions: context?.subscriptions || docUser.subscriptions};
}

export function useUser() {
    const context = React.useContext(LimioContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a LimioProvider");
    }
    return docUser;
}


export function LimioProvider({
                                  children, // $FlowIssue[prop-missing]
                                  value = dummyContext,
                              }) {
    return (
        <LimioContext.Provider value={value}>{children}</LimioContext.Provider>
    );
}

export function useComponentProps(defaultProps) {
    const context = React.useContext(ComponentContext);
    console.log("context", context);
    console.log("defaultProps", defaultProps);
    if (context === undefined) {
        throw new Error("useComponentProps must be used within a ComponentContext");
    }

    // limit changes - both context and defaultProps should be static objects
    return React.useMemo(() => {
        return {...defaultProps, ...context};
    }, [context, defaultProps]);
}

export function groupOffers(offers = [], groupLabels = []) {
    let groups = {}

    for (const offer of offers) {
        const group = offer?.data?.attributes?.group__limio || "other"
        groups[group] = groups[group] || []
        groups[group].push(offer)
    }

    return Object.keys(groups).map(groupId => {
        const group = groupLabels.find(group => group.id === groupId) || {
            id: "_other",
            label: "Other",
            thumbnail: ""
        }
        const {label, thumbnail} = group
        return {
            groupId,
            id: groupId,
            label: label,
            offers: groups[groupId],
            thumbnail: thumbnail
        }
    })
}

export function ErrorBoundary({children}) {
    return <>{children}</>;
}

const dummyContext = {
    pageBuilder__limio: false,
    shop: {
        campaign: {
            name: "Dummy Campaign",
            path: "/offers/Dummy Campaign",
            attributes: {
                push_to_checkout__limio: true,
            },
        },
        offers: groupedOffers,
        addOns: groupedAddOns,
        tag: "/tags/limio",
        location: {pathname: "/default"},
        basketItems: basketItems,
        addToBasket: (offer) => {
            console.log("Item added to basket:", offer);
        },
        swapOffer: (itemId, offer) => {
            console.log("[Storybook] swapOffer called:", { itemId, offer });
        },
    },
    user: docUser
};
