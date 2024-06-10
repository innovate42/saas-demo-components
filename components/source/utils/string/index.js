import React from "react";
import currencyList from "../../currency/currency.json";
import * as R from "ramda";
import { DateTime } from "@limio/date"

export function sanitizeString(string: string): string {
    return string
}

export function formatDisplayPrice(string: string, offerPrice): string {
    let formattedString = string;
    if (offerPrice) {
        const { currencyCode, value } = offerPrice[0];
        const fields =
            string && R.type(string) === "String" ? string.match(/{{(\w+)}}/g) : null;

        const getCorrectFormat = (field) => {
            switch (field) {
                case "{{currencyCode}}":
                    return `${currencyCode}`;
                case "{{currencySymbol}}":
                    return `${currencyList[currencyCode].symbol}`;
                case "{{currencySymbolNative}}":
                    return `${currencyList[currencyCode].symbol_native}`;
                case "{{amount}}":
                    return `${value}`;
                case "{{integerValue}}":
                    return `${value.split(".")[0]}`;
                case "{{decimalValue}}":
                    return `${value.split(".")[1]}`;
                case "{{formattedPrice}}":
                    return `${currencyList[currencyCode].symbol}${value}`;
                case "{{formattedPriceComma}}":
                    return `${value.replace(".", ",")}`;
                default:
                    return field;
            }
        };

        if (fields) {
            fields.map((field) => {
                let formattedValue = "";
                try {
                    formattedValue = getCorrectFormat(field);
                } catch {
                    // We don't want Indexer to fail for this, so if we get an error in the replacement, we just set it empty
                }
                formattedString = R.replace(field, formattedValue, formattedString);
            });
        }
    }

    return formattedString;
}

export function capitaliseFirstLetter(string?: string): string {
    if (!string) {
      return ""
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
}  

export function parseString(message: string = "", state: { [string]: any }, encode?: EncodeFunction): string {


    let string = message
    let placeholder = /{{(.*?)}}/g
    let messageParts
  
    if (typeof message !== "string") {
      throw new Error(`message must be a string, got ${typeof message}: ${JSON.stringify(message)}`)
    }
  

    while ((messageParts = placeholder.exec(message))) {
      const originalPlaceholder = messageParts[0]
      const placeholderName = messageParts[1]
  
      const path = placeholderName.split(".")
      let value = R.path(path, state)

 
  
      if (value) {
        if (encode) {
          value = encode(value)
        }
  
        string = string.replace(originalPlaceholder, value)
      } else {
        string = string.replace(originalPlaceholder, "")
      }
    }
  
    return string
  }
  
// if it looks like an iso date/time then make it look pretty
export function encodeDates(str: string, dateFormat?: DateFormat): string {
    // Using moment to generate date so that we can use its "strict parsing" functionality
    // We will need to find a better solution to this, but I can't find it just yet
    const asDate = DateTime.fromISO(str)
  
    if (asDate.isValid) {
      const date = DateTime.fromJSDate(new Date(str))
      str = formatDate(date, dateFormat)
    }
  
    return str
  }

  export const formatBulletPoints = (string) => {
    const sanitised = sanitizeString(string)

    const features = document.createElement("div")
    features.innerHTML = sanitised

    return [].slice.call(features.children).map((feature, i) => (
        <li className="flex items-center space-x-3" key={`${feature.innerText}-${i}`}>
            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor"
                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"></path>
            </svg>
            <span>{feature.innerText}</span>
        </li>
    ))
}