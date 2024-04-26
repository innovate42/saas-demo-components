// @flow
import { Offer } from "../offers"
import { Product } from "../products"
import { LimioObject, Address } from "../catalog"

export type Price = {|
    currency: string,
    amount: number,
    summary?: {
        headline: string,
        subline: string
    }
|}

export type IntervalType = "days" | "months" | "years"

export type LimioPrice = {
    delay_interval_type: IntervalType,
    subscription_start_day: string,
    label: string,
    trigger: "order_date",
    repeat_count: number,
    type: "onetime" | "recurring",
    name: string,
    repeat_interval: number,
    repeat_interval_type: IntervalType,
    value: string,
    currencyCode: string
}

export type OrderItem = {|
    id: string,
    qty?: number,
    quantity?: number, // not sure which one of these is correct
    price: Price,
    name: string,
    offer: LimioObject<Offer>,
    products: Array<Product>
|}

export type CustomerDetails = {|
    marketingPrefs: { [string]: any },
    firstName: string,
    lastName: string,
    email: string,
    fullName: string,
    companyName?: string,
    phone: string
|}

export type UserDetails = {|
    issuer: string,
    iat: string,
    exp: string,
    sub: string,
    email: string,
    userSubscriptionType?: string
|}

export type OrderPayment = {|
    type: "stripe" | "direct_debit" | "paypal" | "zuora",
    paypal?: {
        result: any
    },
    stripe?: {
        result: any
    },
    direct_debit?: {
        sort_code: string,
        acc_number: string
    },
    zuora?: {
        refId: string,
        paymentGateway: string,
        ...
    },
    gift_code: string
|}

export type OrderAddress = {|
    address1: string,
    address2: string,
    city: string,
    state: string,
    postalCode: string,
    country: string
|}

export type Tracking = {|
    tag: string,
    campaign: string,
    customerId: string,
    contactId: string,
    accountId: string,
    caseId: string
|}

export type LimioTerm = {
    length: number,
    type: "days" | "weeks" | "months" | "years"
}

// we need to add the rest
export type Order =
    | NewSubOrder
    | ChangeOfferOrder
    | AddOfferOrder
    | PaymentUpdateOrder
    | UpdateSubOrder
    | CancelOrder
    | UpdateAddress
    | PayInvoice
    | GiftRefundOrder

export type LimioOrder = {
    sourceDetails?: {
        instance: string
    },
    tracking?: {
        [string]: any
    },
    order_type: "new" | "cancel_subscription" | "change_offer" | "add_charge" | "change_payment" | "add_offer" | "change_address" | "renew" | "gift_refund",
    external_id: string,
    orderDate: string,
    __spec_version?: "2" // dont think we really need this any more
}

export type GiftRefundOrder = {
    ...LimioOrder,
    subscriptionId: string,
    order_type: "gift_refund"
}

export type CancelOrder = {
    ...LimioOrder,
    subscriptionId: string,
    subscriptionRef?: string,
    order_type: "cancel_subscription",
    cancelDate: string
}

export type NewSubOrder = {|
    ...LimioOrder,
    order_type: "new",
    orderItems: Array<OrderItem>,
    payment_method: string,
    payment_status: string,
    deliveryDetails?: OrderAddress,
    billingDetails: OrderAddress,
    recipientDetails?: OrderAddress,
    order_reference: string,
    customer_id?: string,
    customerDetails: CustomerDetails,
    userDetails: UserDetails,
    email: string,
    payment: OrderPayment,
    total: Price,
    tracking: Tracking,
    isGift: boolean,
    giftCode: string,
    redeemCode: string,
    country: string
|}

export type ChangeOfferOrder = {
    ...LimioOrder,
    order_type: "change_offer" | "add_charge",
    subscriptionId: string,
    offer: LimioObject<Offer>,
    effectiveDate: string
}

export type AddOfferOrder = {
    ...LimioOrder,
    order_type: "add_offer",
    subscriptionId: string,
    change_type: string,
    offer: LimioObject<Offer>,
    effectiveDate: string,
    payment: OrderPayment
}

export type PaymentUpdateOrder = {
    ...LimioOrder,
    order_type: "change_payment",
    payment: OrderPayment,
    customerId: string,
    owner: string,
    subscriptionId: string,
    billingDetails: OrderAddress
}

export type UpdateSubOrder = {
    ...LimioOrder,
    order_type: "add_offer",
    subscriptionId: string,
    offer: LimioObject<Offer>,
    effectiveDate: string
}

export type UpdateAddress = {
    ...LimioOrder,
    order_type: "change_address",
    subscriptionId: string,
    offer: Offer,
    effectiveDate: string,
    address: Address
}

export type PayInvoice = {
    ...LimioOrder,
    order_type: "pay_invoice",
    subscriptionId: string,
    invoice: {
        id: string,
        items: {
            id: string,
            amount: number
        }
    }
}
