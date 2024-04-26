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
