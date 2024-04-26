// @flow
type Ref = { $ref: string }

export type Product = {|
    name: string,
    attributes: {
        product_code__limio: string,
        [string]: any
    },
    entitlements?: Array<Ref> // legacy products won't have this, nor will products where entitlements are not selected
|}
