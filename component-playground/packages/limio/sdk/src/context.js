// @flow
import * as React from "react";
import {groupedOffers} from "../../data/offers";
import {basketItems} from "../../data/basket";
import {docUser} from "../../data/user";

const LimioContext = React.createContext({});
export const ComponentContext = React.createContext({});


export function useCampaign() {
    const context = React.useContext(LimioContext);
    if (context === undefined) {
        throw new Error("useBasket must be used within a LimioProvider");
    }
    const {campaign, offers} = dummyContext.shop;
    return {campaign, offers};
}


export function useBasket() {
    const context = React.useContext(LimioContext);
    if (context === undefined) {
        throw new Error("useBasket must be used within a LimioProvider");
    }
    const {basketItems, addToBasket} = dummyContext.shop;
    return {basketItems, addToBasket};
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
    return {subscriptions: docUser.subscriptions};
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
        tag: "/tags/limio",
        location: {pathname: "/default"},
        basketItems: basketItems,
        addToBasket: (offer) => {
            console.log("Item added to basket:", offer);
        },
    },
    user: docUser
};
