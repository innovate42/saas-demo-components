// @flow
import type { Product } from "@limio/types/product"

export type Price = {|
    currency: string,
    amount: number,
    summary?: {
        headline: string,
        subline: string
    }
|}

export type Attachment = {
    name: string,
    path: string,
    type: string,
    url: string
}

// note: this should be the format within the CatalogItem
export type Offer = {|
    products: Array<string> | Array<Product>,
    productBundles?: Array<OfferProductDefn>,
    attachments?: Array<Attachment>,
    record_subtype?: string,
    attributes: {
        display_name__limio: string,
        display_price__limio: string,
        discount__limio: {
            value: number,
            termLength: number,
            termType: string
        },
        trial__limio: boolean,
        [string]: any
    }
|}

export type OfferMetadata = {
    path: string
}

export type { Product }

export type OfferProductDefn = {
    product_path: string,
    revenue_split: string,
    rate_plan: string
}
