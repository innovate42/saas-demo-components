import * as React from "react";
import { getAppConfigValue } from "@limio/shop/src/shop/appConfig.js"

export   const getPrice = (currentPrice, schedule, quantity, country) => {
    let price

    if (schedule) {
     
        price = {
          value: schedule.data.amount || schedule.data.amountWithoutTax,
          currencyCode: schedule.data.currency
        }
      
      
    } else {
      price = { ...currentPrice, value: parseInt(currentPrice?.value * quantity).toFixed(2) }
    }

    if (isNaN(price.value)) {
      return { ...currentPrice, value: 0 }
    } else {
      return price
    }
  }

