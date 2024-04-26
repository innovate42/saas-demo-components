import xss from "xss";
import currencyList from "@limio/currency/currency.json";
import * as R from "ramda";

export function sanitizeString(string: string): string {
  const xssOptions = {
    whitelist: [],
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"],
  };

  return xss(string, xssOptions);
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
