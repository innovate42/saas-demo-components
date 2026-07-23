import { basketItems } from "../data/basket";

function useCheckout() {
  const basket = {
    order: {
      orderDate: "2023-10-30T23:54:08.374Z",
      sub_reference: "777JPLJO1550",
      checkoutId: "basket-83e91b5a-edde-4394-88eb-80f59e2d7506",
      basketItems,
      orderItems: basketItems,
      isGift: false,
      order_type: "new",
      customerDetails: {
        firstName: "Test",
        lastName: "User",
        email: "support@limio.com"
      },
      payment: {
        type: "zuora",
        zuora: {
          "success": true,
          "paymentGateway": "Test Gateway",
        }
      }
    },
    paidSchedule: {
      date: "2023-10-30T00:00:00.000",
      amountWithoutTax: "20.00",
      lineItems: [
        {
          amountWithoutTax: "20.00",
          processingType: "Charge",
          quantity: 1,
          taxAmount: "0",
          chargeName: "Physical All Access ",
          productName: "Physical - All Access",
        }
      ],
      amount: "20.00",
      quantity: 1,
      description: "Physical All Access Now ",
      currency: "GBP",
      unit_amount: "20.00",
      schedule_date: "2023-10-30T00:00:00.000",
      type: "payment",
      taxAmount: 0
    },
    schedule: {
      date: "2023-11-27T00:00:00.000",
      amountWithoutTax: "50.00",
      lineItems: [
        {
          amountWithoutTax: "50.00",
          processingType: "Charge",
          quantity: 1,
          taxAmount: "0",
          chargeName: "Physical All Access ",
          productName: "Physical - All Access",
        }
      ],
      amount: "50.00",
      quantity: 1,
      description: "Physical All Access Now ",
      currency: "CAD",
      unit_amount: "50.00",
      schedule_date: "2023-11-27T00:00:00.000",
      type: "payment",
      taxAmount: 0
    },
    paymentMethod: "CreditCard",
    termEndDate: "2024-10-28",
    termStartDate: "2023-10-30",

  }

  function useCheckoutSelector(callback) {
    return callback(basket)
  }

  return { useCheckoutSelector }
}

export { useCheckout }

export function useLimioUserCustomer() {
  return {
    customer: {
      id: "cus-mock-123",
      data: {
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        defaultPaymentMethodId: "pm-mock-456"
      }
    },
    revalidate: () => {},
    mutate: () => {}
  }
}

export function useLimioUserPaymentMethods() {
  return {
    paymentMethods: [
      {
        id: "pm-mock-456",
        type: "zuora",
        data: {
          type: "zuora",
          method: "CreditCard",
          brand: "Visa",
          last4: "1234",
          expirationMonth: "12",
          expirationYear: "2027",
          holderName: "Test User",
          email: "test@example.com",
          zuora: {
            refId: "mock-zuora-ref-id",
            result: {
              PaymentGateway: "Test Gateway",
              Type: "CreditCard",
              CreditCardType: "Visa",
              CreditCardMaskNumber: "************1234"
            }
          }
        }
      },
      {
        id: "pm-mock-789",
        type: "zuora",
        data: {
          type: "zuora",
          method: "CreditCard",
          brand: "MasterCard",
          last4: "5678",
          expirationMonth: "03",
          expirationYear: "2026",
          holderName: "Test User",
          email: "test@example.com",
          zuora: {
            refId: "mock-zuora-ref-mc",
            result: {
              PaymentGateway: "Test Gateway",
              Type: "CreditCard",
              CreditCardType: "MasterCard",
              CreditCardMaskNumber: "************5678"
            }
          }
        }
      }
    ],
    revalidate: () => {},
    mutate: () => {}
  }
}

// Mirrors the shop's completed-checkout session hook: same selector interface
// as useCheckout, but for the order that was just placed (order-confirmation
// components read customer, items and references from here).
export function useCompleteCheckoutSession() {
  const order = {
    order_reference: "ORD-2026-000123",
    sub_reference: "SUB-2026-000456",
    currency: "EUR",
    customerDetails: {
      firstName: "Julia",
      lastName: "Schneider",
      email: "julia.schneider@example.de",
      companyName: "Schneider & Partner GmbH"
    },
    orderItems: [
      {
        id: "item-1",
        quantity: 5,
        offer: {
          data: {
            attributes: {
              display_name__limio: "Team",
              display_price__limio: "<p>10 € pro Nutzer/Monat</p>"
            }
          }
        },
        crossSell: [
          {
            offer: {
              data: {
                attributes: { display_name__limio: "Audio & Podcasts" }
              }
            }
          }
        ]
      }
    ]
  }

  function useCheckoutSelector(callback) {
    return callback({ order, completed: true })
  }

  return { useCheckoutSelector }
}

export function useLimioUserSubscriptionPaymentMethods() {
  return useLimioUserPaymentMethods()
}
