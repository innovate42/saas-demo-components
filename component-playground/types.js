// @flow
// note that these are imported via .flowconfig to avoid having a dependency on @i42/shared
import type { Offer, Order, OrderItem, Product, Subscription, CatalogItem } from "@limio/types"

export type CatalogItemOffer = CatalogItem<Offer>

export type CampaignInfo = {
    name: string,
    path: string,
    attributes: { [string]: any }
}

type LandingInfo = {
    inlineStyle: ?string,
    customTranslations: { [string]: string },
    favicon: ?string,
    shop_title: ?string,
    domain_url: ?string
}

type OfferGroup = {
    id: string,
    label: string
}

export type PageContext = {
    endpoint?: string,
    authProvider: ?string,
    landing: LandingInfo,
    campaign: CampaignInfo,
    offers: Array<CatalogItemOffer>,
    groupValues: Array<OfferGroup>,
    publicKey__limio: string,
    tag__limio: string,
    pageMasterLayout: string,
    prevent_mixed_rates: boolean
}

export type AddToBasket = (item: CatalogItemOffer, selectedProducts: ?(Product[]), quantity: ?number, redirectUrl: ?string) => void
export type AddGiftToBasket = (offerItems: Array<CatalogItemOffer>, giftCode: string, hasDeliver: boolean) => void
export type RemoveFromBasket = (item: CatalogItemOffer) => void
export type UpdateOrder = (order: Order) => void
export type GoToCheckout = (basketId?: string) => Promise<void>

export type User = {
    token: ?string,
    loaded?: boolean,
    attributes?: { [string]: any },
    loginStatus?: "logged-out" | "logged-in",
    subscriptions?: Subscription[],
    refreshUser?: () => Promise<void>
}

export type LimioContextShop = {
    location: {
        pathname: string,
        search: string
    },
    language: {
        mode: string,
        value: string
    },
    addToBasket: AddToBasket,
    addGiftToBasket: AddGiftToBasket,
    removeFromBasket: RemoveFromBasket,
    updateOrder: UpdateOrder,
    goToCheckout: GoToCheckout,
    basketItems: OrderItem[],
    basketOpen: boolean,
    setBasketOpen: boolean => void,
    formattedTotal: ?string,
    campaign: CampaignInfo,
    offers: CatalogItemOffer[],
    tag: string,
    customTranslations: { [string]: any },
    updateCheckoutDisabled: boolean => {
        type: "SET_CHECKOUT_DISABLED",
        disabled: boolean
    },
    groupValues: Array<OfferGroup>
};

export type LimioContext = {
    endpoint: ?string,
    shop: LimioContextShop,
    pageBuilder__limio?: boolean,
    isInPageBuilder?: boolean,
    user: User,
    key: {
        limio: string
    }
}

export type LimioComponentContext = Object; // TODO: define this type
