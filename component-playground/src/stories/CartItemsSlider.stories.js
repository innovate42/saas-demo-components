import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import CartItemsSlider from "../../../components/cart-items-slider"

// Mock offer with a recurringVolume price — matches the shape
// QuantitySlider consumes (see components/cart-items-slider/helpers.js).
const volumeOffer = {
  name: "Core",
  path: "/offers/SaaS/Core",
  id: "offer-core-volume",
  type: "item",
  data: {
    record_type: "offer",
    record_subtype: null,
    attachments: [],
    attributes: {
      display_name__limio: "Core",
      display_description__limio: "Best for startups and growing businesses.",
      allow_multibuy__limio: true,
      price__limio: [
        {
          type: "recurringVolume",
          currencyCode: "USD",
          tiers: [
            { starting_unit: 0, ending_unit: 15000, price: 299, price_format: "FlatFee" },
            { starting_unit: 15001, ending_unit: 30000, price: 499, price_format: "FlatFee" },
            { starting_unit: 30001, ending_unit: 60000, price: 559, price_format: "FlatFee" },
            { starting_unit: 60001, ending_unit: 100000, price: 679, price_format: "FlatFee" },
            { starting_unit: 100001, ending_unit: 150000, price: 799, price_format: "FlatFee" },
            { starting_unit: 150001, ending_unit: 200000, price: 999, price_format: "FlatFee" }
          ]
        }
      ]
    },
    products: [
      {
        attributes: {
          display_name__limio: "SaaS"
        }
      }
    ]
  }
}

const buildOrderItem = (quantity = 15000) => ({
  id: "order-item-1",
  quantity,
  offer: volumeOffer,
  orderLineItem: {
    currency: "USD",
    unitPriceTotal: 299,
    lineItemTotal: 299,
    lineItemSubtotal: 299
  },
  upsell: []
})

const mockShop = (quantity) => ({
  campaign: { name: "Slider Demo", path: "/offers/SaaS", attributes: {} },
  offers: [],
  addOns: [],
  basketItems: [buildOrderItem(quantity)],
  updateItemQuantity: (id, q) => console.log("[Storybook] updateItemQuantity", id, q),
  removeFromBasket: ({ id }) => console.log("[Storybook] removeFromBasket", id),
  swapOffer: (id, offer) => console.log("[Storybook] swapOffer", id, offer),
  basketLoading: false
})

export default {
  title: "Cart Items Slider",
  component: CartItemsSlider,
  parameters: { layout: "padded" },
  decorators: [
    (Story, context) => (
      <LimioProvider value={{ shop: mockShop(context.args.__startingQuantity || 15000) }}>
        <ComponentContext.Provider value={context.args}>
          <Story />
        </ComponentContext.Provider>
      </LimioProvider>
    )
  ]
}

const baseArgs = {
  showIcons: true,
  offerInformation: "{{data.attributes.display_description__limio}}",
  lineItemInformation: "",
  addOnInformation: "{{data.attributes.description__limio}}",
  perUnitLabel: "{quantity} x {formattedPrice} each",
  tierPrefix: "$",
  tierUnit: "in monthly expenses",
  emptyText: "Your cart is empty",
  emptyCta: "See offers",
  emptyUrl: "/default",
  displayUpsellOffers: false,
  showUpsellPrice: true,
  readOnly: false,
  showDiscountNote: false,
  __startingQuantity: 15000
}

export const Default = { args: { ...baseArgs } }

export const StartingMidTier = {
  name: "Starting at tier 3",
  args: { ...baseArgs, __startingQuantity: 60000 }
}

export const ReadOnly = {
  name: "Read-only (no slider)",
  args: { ...baseArgs, readOnly: true }
}
