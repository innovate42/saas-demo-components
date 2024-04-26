export const basketItems = [
  {
    "name": "Quarterly",
    "offer": {
      "name": "Bundle Quarterly",
      "path": "/offers/Limio Subscription - UK/Bundle Quarterly",
      "id": "39973a9e11fae78be40d0ebfae991620eebbb48a",
      "type": "item",
      "data": {
        "associations": {
          "exchange": []
        },
        "price__limio": [],
        "attachments": [
          {
            "name": "Limio Image",
            "path": "/assets/Limio Image",
            "type": "image/png",
            "url": "/public/3554e394-c561-4488-a1d2-9b7722790a23/oux4dwxmt95boll00bma.png"
          }
        ],
        "created": "2021-03-09T14:17:00+00:00",
        "validFrom": "2019-07-27T03:30:00.000Z",
        "type": "item",
        "duplicatedFrom": "/offers/Limio Subscription - US/Bundle Quarterly",
        "record_type": "offer",
        "products": [
          {
            "baseTemplate": "/config/templates/products/default",
            "entitlements": [
              {
                "$ref": "/entitlements/Test two"
              }
            ],
            "path": "/products/Limio/Physical",
            "created": "2021-02-15T18:16:01+00:00",
            "familyName": null,
            "name": "Physical",
            "modified": "2023-02-01T14:53:33+00:00",
            "attributes": {
              "Product Family": "Print",
              "display_name__limio": "Physical",
              "has_delivery__limio": true,
              "product_code__limio": "LI.PHYSICAL",
              "block_multiple__limio": false,
              "Product description": "<p>Physical product</p>"
            },
            "record_subtype": null,
            "type": "item",
            "record_type": "product"
          }
        ],
        "segments": [],
        "productBundles": [
          {
            "revenue_split": "100",
            "product_path": "/products/Limio/Physical",
            "rate_plan": "UK Quarterly"
          }
        ],
        "baseTemplate": "/config/templates/offers/OfferBase",
        "path": "/offers/Limio Student Subscription - UK/Bundle Quarterly",
        "priceReference": "/offers/Limio Student Subscription - UK/Bundle Quarterly",
        "price": [],
        "name": "Limio Subscription - UK",
        "modified": "2021-03-09T14:17:00+00:00",
        "attributes": {
          "price__limio": [
            {
              "delay_interval_type": "weeks",
              "subscription_start_day": "",
              "delay_interval": null,
              "label": "Charge 1",
              "trigger": "subscription_start",
              "repeat_count": 1,
              "type": "recurring",
              "name": "charge_1",
              "repeat_interval": 12,
              "attributes": [],
              "repeat_interval_type": "weeks",
              "value": "20.00",
              "currencyCode": "GBP"
            }
          ],
          "description__limio": "",
          "term__limio": {
            "type": "weeks",
            "length": 12
          },
          "page_inject_code__limio": "",
          "display_price__limio": "<p>12 weeks for <s>£50.00</s> £20.00</p>",
          "cta_text__limio": "Subscribe",
          "cta__limio": "Subscribe",
          "secondary_color__limio": "#0e4f1b",
          "primary_color__limio": "#f47373",
          "disable_index__limio": true,
          "payment_types__limio": [
            "zuora_card",
            "zuora_paypal"
          ],
          "detailed_display_price__limio": "<p>Auto-renewing at £50.00 quarterly.</p>",
          "rate_plan__zuora": "UK Quarterly",
          "display_name__limio": "Quarterly",
          "group__limio": "bundle",
          "meta_title__limio": "Subscribe to The Economist",
          "best_value__limio": false,
          "checkout__limio": {
            "checkout_type": "standard"
          },
          "tertiary_color__limio": "#020109",
          "push_to_checkout__limio": true,
          "student__limio": true,
          "display_description__limio": "",
          "autoRenew__limio": false,
          "offer_type__limio": "trial"
        },
        "parent_path": "/offers/Limio Student Subscription - UK",
        "validTo": "2019-07-31T12:30:00.000Z"
      },
      "version": "7979f55fe31d419b23ac0532fb17110ad55ba4e2"
    },
    "details": "",
    "id": "98cc5a4f-860f-4170-8e67-7fe467628b4e",
    "price": {
      "summary": {
        "headline": "<p>12 weeks for <s>£50.00</s> £20.00</p>",
        "subline": "<p>Auto-renewing at £50.00 quarterly.</p>"
      },
      "currency": "GBP",
      "amount": 20
    },
    "products": [
      {
        "baseTemplate": "/config/templates/products/default",
        "entitlements": [
          {
            "$ref": "/entitlements/Test two"
          }
        ],
        "path": "/products/Limio/Physical",
        "created": "2021-02-15T18:16:01+00:00",
        "familyName": null,
        "name": "Physical",
        "modified": "2023-02-01T14:53:33+00:00",
        "attributes": {
          "Product Family": "Print",
          "display_name__limio": "Physical",
          "has_delivery__limio": true,
          "product_code__limio": "LI.PHYSICAL",
          "block_multiple__limio": false,
          "Product description": "<p>Physical product</p>"
        },
        "record_subtype": null,
        "type": "item",
        "record_type": "product"
      }
    ]
  }
]