import * as R from "ramda"
const countryDataJSON = require("./data/country-data.json")

export const addressSummary = (address = {}) => {
    const country = R.find(countryObj => countryObj["alpha-2"] === address.country, countryDataJSON)?.name || address.country
    let line = [address.address1, address.address2, address.state, address.city, address.postalCode, country].filter(item => !!item)
    line = line.filter(item => !!item)
  
    return R.isEmpty(address) ? "N/A" : line.join(", ")
  }

  export const getCurrentAddress = (type, addresses = []) => {
    const activeAddress = addresses.filter(x => x.relationship_type === type && x.status === "active")
    const [mostRecent, ...rest] = activeAddress.sort((a, b) => new Date(b.start) - new Date(a.start))
    return mostRecent || { data: {} }
  }