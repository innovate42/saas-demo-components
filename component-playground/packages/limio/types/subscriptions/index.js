// @flow
import type { Offer } from "../offers"
import type { Price } from "../offers"
import type { LimioObject } from "../catalog"


export type Subscription = {
    id: string,
    name: string,
    tracking: {
        offers: Array<string>,
        campaign: string,
        tag: string
    },
    offer: LimioObject<Offer>,
    startDate: string,
    termStartDate: string,
    termEndDate: string,
    price: Price,
    attributes: {
        [string]: any
    },
    purchaseCountry: string,
    quantity?: number

    // This should not be used?
    //products: Array<Product>
}

export type SubscriptionSummary = {
    ...Subscription
}
