// @flow

const localeData = require("./locale-data.json")

export function formatCurrency(amount, currency, locale ) {
    if (typeof amount === "undefined" || typeof currency === "undefined" || amount === null || currency === null) {
      return ""
    }


  
    const locales = localeData[locale] || "en-GB"
    if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
      return new Intl.NumberFormat(locales, { style: "currency", currency: currency }).format(amount)
    } else {
      return `${currency} ${amount}`
    }
  }
  