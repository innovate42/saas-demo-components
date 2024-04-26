import { DateTime } from "@limio/date"
import * as R from "ramda"

export const stripPathToProductName = (path: string): string => {
  // "/products/Hero Plan" => "Hero Plan")
  if (typeof path !== "string") {
    return console.log(path, "is not a string")
  }
  return path.split("/").pop()
}

export function formatCurrency(amount = 0, currency = "GBP"): string {
  if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amount)
  } else {
    return `${currency} ${amount}`
  }
}

export const displayDate = date => DateTime.fromISO(date).toFormat("MM/dd/yyyy")

export function getOrderItems(order) {
  const { orderItems = {} } = order

  // check if is example data
  const exampleData = R.pathOr("", ["customerDetails", "email"], order)
  if (exampleData === "customer@example.com") {
    return exampleOrder.orderItems
  }

  return orderItems
}

const exampleOrder = {
  __spec_version: "2",
  orderState: "submitting",
  external_id: "8890c8c0-3d58-469f-9625-7eb86eb876df",
  orderItems: [
    {
      offer: {
        mode: "production",
        path: "/offers2/Saas - Per Seat Annual",
        data: {
          baseTemplate: "/config/templates/offers/default",
          lastSynced: "2024-03-04T14:25:32.589Z",
          synced: true,
          created: "2024-02-29T14:08:13+00:00",
          syncedFrom: "8ad09c9f8dd04644018de4c9e8927cb9",
          modified: "2024-03-04T19:40:10+00:00",
          attributes: {
            allow_multibuy__limio: true,
            price__limio: [
              {
                use_external_price: true,
                currencyCode: "USD",
                currency: {
                  symbol: "$",
                  id: "USD",
                  label: "USD - US Dollar"
                }
              }
            ],
            default_quantity_options__limio: {},
            allowed_countries__limio: ["US"],
            label__limio: ["saas"],
            term__limio: {
              renewal_type: "TERMED",
              length: 1,
              renewal_trigger: "EXTERNAL",
              type: "years"
            },
            billing_plan: ["annual"],
            display_price__limio: "<p>$1000 per user per year</p>",
            is_gift__limio: false,
            payment_types__limio: ["zuora_card"],
            rate_plan__zuora: "Per Seat Annual",
            detailed_display_price__limio: "",
            display_name__limio: "Per Seat Annual",
            best_value__limio: true,
            checkout__limio: {
              checkout_type: "standard"
            },
            initial_term__limio: {
              renewal_type: "TERMED",
              length: 1,
              renewal_trigger: "EXTERNAL",
              type: "years"
            },
            push_to_checkout__limio: true,
            ltm_Product_Type: "BasePlan",
            is_redeem_gift__limio: false,
            autoRenew__limio: true
          },
          record_type: "offer",
          productBundles: [
            {
              revenue_split: "100",
              product_path: "/products/Saas",
              rate_plan: "Per Seat Annual"
            }
          ],
          products: [
            {
              baseTemplate: "/config/templates/products/default",
              entitlements: [
                {
                  $ref: "/entitlements/Accurate"
                },
                {
                  $ref: "/entitlements/All-Access Support"
                }
              ],
              path: "/products/Saas",
              lastSynced: "2024-03-04T14:29:10.964Z",
              synced: true,
              created: "2024-02-29T14:08:06+00:00",
              syncedFrom: "8ad0877b83f1cbfa0183f5b89ef619f3",
              modified: "2024-03-05T15:45:38+00:00",
              attributes: {
                display_name__limio: "Saas",
                has_delivery__limio: false,
                product_code__limio: "SKU-00000122"
              },
              record_type: "product"
            }
          ]
        },
        service: "limio",
        created: "2024-03-05T15:46:55.090Z",
        name: "Saas - Per Seat Annual",
        id: "c45f9ea9aa30c4d0b0021cfaddd217c7ec0392e7",
        type: "item",
        updated: "2024-03-05T15:46:55.090Z",
        version: "a4a0ae99647e8f5eb3165e60ac3fab65f0f334c1",
        record_type: "offer",
        status: "active"
      },
      quantity: 1,
      price: {
        summary: {
          headline: "<p>$1000 per user per year</p>",
          subline: ""
        },
        currency: "USD",
        amount: 0
      },
      addOns: [
        {
          addOn: {
            name: "Account Management Add-On - Annual Plan",
            path: "/add_ons/Account Management Add-On - Annual Plan",
            id: "9a859516765675c2ee55b83bac8a5e2403c818c9",
            type: "item",
            data: {
              baseTemplate: "/config/templates/add_ons/Add On Product",
              lastSynced: "2024-03-04T14:29:14.740Z",
              synced: true,
              created: "2024-03-04T14:29:14+00:00",
              syncedFrom: "8ad08ad58e094969018e09d9fc9b71a6",
              modified: "2024-03-04T14:39:41+00:00",
              attributes: {
                allow_multibuy__limio: false,
                price__limio: [
                  {
                    use_external_price: true,
                    currency: {
                      symbol: "$",
                      id: "USD",
                      label: "USD - US Dollar"
                    }
                  }
                ],
                description__limio:
                  "<p>Partner with your account manager for quarterly account review, customized training for your team, and the first look at new features.</p>",
                label__limio: ["saas"],
                term__limio: {
                  length: 1,
                  type: "years"
                },
                display_price__limio: "",
                is_gift__limio: false,
                payment_types__limio: ["zuora_card"],
                rate_plan__zuora: "Annual Plan",
                detailed_display_price__limio: "",
                display_name__limio: "Annual Plan",
                billing_option: ["annual"],
                initial_term__limio: {
                  length: 1,
                  type: "years"
                },
                compatible_products: ["base"],
                is_redeem_gift__limio: false,
                autoRenew__limio: true
              },
              record_type: "add_on",
              productBundles: [
                {
                  revenue_split: "100",
                  product_path: "/products/Account Management Add-On",
                  rate_plan: "Annual Plan"
                }
              ],
              products: [
                {
                  baseTemplate: "/config/templates/products/default",
                  path: "/products/Account Management Add-On",
                  lastSynced: "2024-03-04T14:29:10.947Z",
                  synced: true,
                  created: "2024-03-04T14:25:26+00:00",
                  syncedFrom: "8ad08f068e094963018e09d91c641922",
                  modified: "2024-03-04T14:29:10+00:00",
                  attributes: {
                    display_name__limio: "Account Management Add-On",
                    has_delivery__limio: false,
                    product_code__limio: "SKU-00000138"
                  },
                  record_type: "product"
                }
              ]
            },
            version: "397d211ceb20b3d5dcd1f4d562bfff7f8c4bcf2c"
          },
          quantity: 1
        }
      ],
      name: "Per Seat Annual",
      details: "",
      id: "d8dcbd63-3c55-4f00-9ab2-c75a7ef0c93f",
      products: [
        {
          baseTemplate: "/config/templates/products/default",
          path: "/products/Account Management Add-On",
          lastSynced: "2024-03-04T14:29:10.947Z",
          synced: true,
          created: "2024-03-04T14:25:26+00:00",
          syncedFrom: "8ad08f068e094963018e09d91c641922",
          modified: "2024-03-04T14:29:10+00:00",
          attributes: {
            display_name__limio: "Account Management Add-On",
            has_delivery__limio: false,
            product_code__limio: "SKU-00000138"
          },
          record_type: "product"
        },
        {
          baseTemplate: "/config/templates/products/default",
          entitlements: [
            {
              $ref: "/entitlements/Accurate"
            },
            {
              $ref: "/entitlements/All-Access Support"
            }
          ],
          path: "/products/Saas",
          lastSynced: "2024-03-04T14:29:10.964Z",
          synced: true,
          created: "2024-02-29T14:08:06+00:00",
          syncedFrom: "8ad0877b83f1cbfa0183f5b89ef619f3",
          modified: "2024-03-05T15:45:38+00:00",
          attributes: {
            display_name__limio: "Saas",
            has_delivery__limio: false,
            product_code__limio: "SKU-00000122"
          },
          record_type: "product"
        }
      ]
    }
  ],
  userDetails: {
    issuer: "https://saas-dev-shop.prod.limio.com",
    iat: 1713251395,
    exp: 1713252793,
    sub: "id-780ee5ab9783f8dc0cc35d6bed0616a8",
    email: "steven+160424@limio.com",
    email_verified: true,
    "https://saas-dev-shop.prod.limio.com/aut": {
      iss: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_wayGDTcIn",
      sub: "e83bf9cc-bf1f-4f53-bc58-304a2f5f7085"
    },
    userSubscriptionType: "New"
  },
  customerDetails: {
    firstName: "steven",
    lastName: "letts",
    email: "steven+160424@limio.com",
    marketingPrefs: {},
    newField: "on"
  },
  recipientDetails: {
    sendEmail: true,
    startNow: false
  },
  studentDetails: {
    university: "",
    course: "",
    graduationYear: "2020"
  },
  deliveryDetails: {},
  billingDetails: {
    address1: "37 Saddle Dr",
    address2: "",
    city: "Hazlehurst",
    state: "GA",
    postalCode: "31539-5863",
    country: "US",
    streetName: "Saddle Dr",
    buildingNumber: "37",
    company: ""
  },
  total: {
    amount: 0,
    currency: "USD"
  },
  tracking: {
    campaign: "/pages2/Pricing Page",
    tag: "/tags/default",
    offers: ["/offers2/Saas - Per Seat Annual"],
    lmo_offer: "/offers2/Saas+-+Per+Seat+Annual",
    referrer: "https://saas-dev.prod.limio.com/",
    ltm_Product_Type: "BasePlan"
  },
  country: "US",
  allowedCountries: ["US"],
  source: "shop",
  paymentType: "zuora_card",
  redirectUrl: null,
  recaptchaPayload: null,
  order_reference: "2I2IG4P6R7O0",
  student: false,
  hasDelivery: false,
  isTrial: false,
  mode: "production",
  isRedeem: false,
  variant: "standard",
  isGift: false,
  autoRenew: true,
  payment: {
    type: "zuora",
    zuora: {
      tenantId: "39825",
      responseFrom: "Response_From_Submit_Page",
      refId: "8ad09c9f8ee1d319018ee5bdea650258",
      signature:
        "HonhwpnBhpNwuxfc%2FriLpJp02YlYU%2BFYfZE8C1sfRhlvqiS%2FHCecXYpE17FUwbgEGyLkHm0m7cYU4uhx46twvc5a6cFCN%2BSrijmSOORolU7GBTFjemmVcL9oG0dlykZaunAuDrscHxwdWhGv4uWK71RPAp6yL%2FWPC49KUa%2BHFNqj2Dw53FPhk4ieVx1D8xP%2BR1dNL2lZGMWLTUCBzgDXIwttZ6DLPaMpp8fjw95Ty%2B2YNPKqOznqAe3lLFNayNmxWKcSiC12X498jxV2IRV1KPpwNJt9pozt8PCZnjDj1d03atOBHbia7Zhuk7Y5QcheKnQo44wjdf%2BSHRCS3%2BJ9fw%3D%3D",
      success: true,
      token: "UTcicUvFvIVek7fnGapefsfv0Pu2xLZk"
    },
    timing: {
      delta: 577
    }
  },
  initiated_source: "shop",
  order_type: "new",
  redirectState: null,
  subRef: null,
  requestCompany: false,
  process_immediately: true,
  subId: null,
  subscriptionReference: null,
  chooseDate: false,
  sub_reference: "6BD2OFB0JIE0",
  checkoutId: "basket-8890c8c0-3d58-469f-9625-7eb86eb876df",
  orderDate: "2024-04-16T07:10:13.055Z"
}
