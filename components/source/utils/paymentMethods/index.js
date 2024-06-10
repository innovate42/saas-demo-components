import * as R from "ramda"
import { getPaymentIcon } from "./paymentIcons"

export function getCurrentPayment(payments) {
    const [mostRecent, ...rest] = payments.sort((a, b) => new Date(b.start) - new Date(a.start))
    // If we didn't find any payment method in the array, we retrieve an object with data attribute (legacy) and a boolean indicating there is no data
    return mostRecent || { data: {}, noPaymentMethod: true }
  }


  function generatePaymentDescription(
    last4,
    paymentMethodData,
    paymentIsDirectDebit,
    paymentIsInvoice,
    paymentIsTwikey,
    paymentIsApplePay,
    paymentIsPaypal,
    paymentIsACH,
    paymentIsBankTransfer,
    paymentIsExternalIntegration,
    paymentIsNexi,
  ) {
    if (paymentIsNexi && paymentIsPaypal) {
      return "PayPal"
    }
  
    // For external payment methods that didn't set last4, we don't want to display anything
    if (paymentIsInvoice || paymentIsTwikey || paymentIsPaypal || (paymentIsExternalIntegration && !last4)) {
      return ""
    }
  
    if (paymentIsACH || paymentIsBankTransfer) {
      return `••••  ${last4 ? last4 : "••••"}`
    }
  
    if (paymentIsApplePay) {
      return "Apple Pay"
    }
  
    return `•••• •••• •••• ${last4 || "••••"}`
  }

  function extractLast4Digits(maskedNumber) {
    return maskedNumber?.substr(-4) || "••••"
  }

  export function processPaymentMethod(paymentMethod) {
    const paymentMethodData = R.path(["data", paymentMethod.type, "result"], paymentMethod)
    const integrationData = R.path(["data", "integrationData"], paymentMethod)
    const paymentIsExternalIntegration = R.path(["data", "isExternalIntegration"], paymentMethod) || false
  
    const zuoraPaymentMethod = paymentMethod?.data?.zuora?.result || {}
  
    const paymentIsNexi = paymentMethod.type === "nexi"
    let paymentIsPaypal = zuoraPaymentMethod?.Type === "PayPal"
    const paymentIsDirectDebit = zuoraPaymentMethod?.Type === "DirectDebit"
    const paymentIsApplePay = zuoraPaymentMethod?.CreditCardType?.includes("Apple")
    const paymentIsInvoice = paymentMethod.type === "invoice"
    const paymentIsTwikey = paymentMethod.type === "twikey"
    const paymentIsACH = ["ACH"].includes(paymentMethodData?.Type)
    const paymentIsBankTransfer = ["BankTransfer"].includes(paymentMethodData?.Type)
  
    //default the brand and last4 before setting specifically for certain payment methods
    let brand = zuoraPaymentMethod.CreditCardType
    let last4 = zuoraPaymentMethod.CreditCardMaskNumber?.substr(zuoraPaymentMethod?.CreditCardMaskNumber?.length - 4)
    let secondaryPaymentIcon = null
  
    // This means this is a external payment method integration. We use the data from the integrationData
    // We are aligning data in the integration process to match the self_service data structure requirements
    if (paymentIsExternalIntegration) {
      brand = integrationData?.self_service?.brand
      last4 = integrationData?.self_service?.last4
    }
  
    if (paymentIsNexi) {
      brand = paymentMethod?.data?.nexi?.result.brand?.toLowerCase() // nexi provides this in all caps, so format brand to match options in getPaymentIcon()
      const cardNumber = paymentMethod?.data?.nexi?.result.pan
      last4 = extractLast4Digits(cardNumber)
      const allowedBrands = ["visa", "mastercard", "paypal"]
      const verifiedBrand = allowedBrands.find(type => type === brand)
      brand = verifiedBrand ? brand : "card" // if brand is not an option in getPaymentIcon() we display the generic cc logo
      // We add a PayPal identifier to the payment description if the payment method is a PayPal account
      paymentIsPaypal = brand === "paypal"
    }
  
    if (paymentIsACH) {
      const achMask = paymentMethodData?.AchAccountNumberMask
      last4 = extractLast4Digits(achMask)
    }
  
    if (paymentIsBankTransfer) {
      const bankMask = paymentMethodData?.BankTransferAccountNumberMask
      last4 = extractLast4Digits(bankMask)
    }
  
    let paymentIcon = getPaymentIcon(brand || paymentMethodData?.Type)
  
    let paymentDescription = generatePaymentDescription(
      last4,
      paymentMethodData,
      paymentIsDirectDebit,
      paymentIsInvoice,
      paymentIsTwikey,
      paymentIsApplePay,
      paymentIsPaypal,
      paymentIsACH,
      paymentIsBankTransfer,
      paymentIsExternalIntegration,
      paymentIsNexi
    )
  
    if (paymentIsPaypal) {
      paymentIcon = getPaymentIcon("paypal")
    }
  
    if (paymentIsApplePay) {
      paymentIcon = getPaymentIcon("apple_pay")
      secondaryPaymentIcon = getPaymentIcon(brand.replace("Apple", ""))
    }
  
    if (paymentIsInvoice) {
      brand = "invoice"
      paymentIcon = getPaymentIcon("invoice")
    }
  
    if (paymentIsTwikey) {
      brand = "twikey"
      paymentIcon = getPaymentIcon("Twikey")
    }
  
    return { paymentDescription, paymentIcon, secondaryPaymentIcon }
  }

  export function getPaymentLabel(paymentMethod) {
    const paymentMethodData = R.path(["data", paymentMethod.type, "result"], paymentMethod)
    const integrationData = R.path(["data", "integrationData"], paymentMethod)
    const paymentIsExternalIntegration = R.path(["data", "isExternalIntegration"], paymentMethod)
  
    // This means this is a external payment method integration. We use the label from the integrationData
    if (paymentIsExternalIntegration) {
      return integrationData?.self_service?.label || ""
    }
  
    if (paymentMethod.type === "zuora") {
      if (paymentMethodData.Type === "CreditCard") {
        if (paymentMethodData.Type.includes("Apple")) {
          return "Apple Pay"
        }
  
        const creditCardTypes = {
          AmericanExpress: "American Express",
          Visa: "Visa",
          MasterCard: "MasterCard"
        }
  
        return creditCardTypes[paymentMethodData.CreditCardType]
      }
  
      const paymentTypes = {
        PayPal: "PayPal",
        BankTransfer: "Direct Debit"
      }
  
      return paymentTypes[paymentMethodData.Type] || paymentMethodData.Type
    }
    return capitaliseFirstLetter(paymentMethod.type)
  }