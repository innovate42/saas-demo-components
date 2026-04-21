// Helpers ported from upstream cart-items + QuantityControl.
// These intentionally avoid depending on @limio/shop or @limio/component-library
// so the component can run in this demo repo.

export function formatCurrency(value, currency = "USD") {
  const amount = Number(value)
  if (Number.isNaN(amount)) return ""
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount)
  } catch (e) {
    return `${currency} ${amount}`
  }
}

export function formatNumber(value) {
  const num = Number(value)
  if (Number.isNaN(num)) return String(value ?? "")
  return new Intl.NumberFormat().format(num)
}

// Minimal {placeholder} / {{placeholder}} template — enough for the demo.
export function parseTemplate(template, variables = {}) {
  if (!template) return ""
  return String(template).replace(/\{\{?([a-zA-Z0-9_.]+)\}?\}/g, (match, key) => {
    const parts = key.split(".")
    let current = variables
    for (const part of parts) {
      if (current == null) return match
      current = current[part]
    }
    return current == null ? "" : String(current)
  })
}

// ---- volume-tier helpers (ported from @limio/cart/QuantityControl/helper.ts) ----

function getVolumePrice(offer) {
  const prices = offer?.data?.attributes?.price__limio
  if (!Array.isArray(prices)) return null
  return prices.find((p) => p && p.type === "recurringVolume") || null
}

export function offerHasVolumePricing(offer) {
  return Boolean(getVolumePrice(offer))
}

export function offerHasMultibuy(offer) {
  return Boolean(offer?.data?.attributes?.allow_multibuy__limio)
}

export function getOfferQuantityMinMax(offer) {
  const volumePrice = getVolumePrice(offer)
  if (volumePrice?.tiers?.length) {
    const first = volumePrice.tiers[0]
    const last = volumePrice.tiers[volumePrice.tiers.length - 1]
    return {
      min: first.starting_unit,
      max: last.ending_unit
    }
  }
  const defaults = offer?.data?.attributes?.default_quantity_options__limio || {}
  return {
    min: defaults.minimum_quantity || 1,
    max: defaults.maximum_quantity || 1
  }
}

// Returns the list of tiers we'll map slider stops onto.
// Each stop = { id (= ending_unit, or starting_unit for the open-ended last tier),
//               label (range string, e.g. "15001 - 30000"),
//               startingUnit, endingUnit, isOpenEnded }
export function getTierStopsForOffer(offer) {
  const volumePrice = getVolumePrice(offer)
  if (!volumePrice?.tiers?.length) return []

  return volumePrice.tiers.map((tier, index) => {
    const isLast = index === volumePrice.tiers.length - 1
    const isOpenEnded = isLast && (tier.ending_unit === undefined || tier.ending_unit === null)
    const id = isOpenEnded ? tier.starting_unit : tier.ending_unit
    const label = isOpenEnded
      ? `${formatNumber(tier.starting_unit)}+`
      : `${formatNumber(tier.starting_unit)} - ${formatNumber(tier.ending_unit)}`
    return {
      id,
      label,
      startingUnit: tier.starting_unit,
      endingUnit: tier.ending_unit,
      isOpenEnded,
      price: tier.price,
      priceFormat: tier.price_format
    }
  })
}

// Given a current quantity, pick the tier stop whose range contains it.
export function findTierStopForQuantity(stops, quantity) {
  if (!stops.length) return -1
  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]
    const withinStart = quantity >= stop.startingUnit
    const withinEnd = stop.isOpenEnded || quantity <= stop.endingUnit
    if (withinStart && withinEnd) return i
  }
  // fall back to nearest by id
  if (quantity < stops[0].startingUnit) return 0
  return stops.length - 1
}

// ---- discount note helpers ----

export function getDiscountMessage(orderItem) {
  const orderLineItem = orderItem?.orderLineItem
  if (orderLineItem?.lineItemDiscount) {
    return {
      className: "cis-discount-strike",
      content: formatCurrency(orderLineItem.lineItemSubtotal, orderLineItem.currency)
    }
  }
  return null
}

export function getDiscountNote(orderItem) {
  const note = orderItem?.offer?.data?.attributes?.discount_note__limio
  if (note) return { className: "", content: note }
  return null
}
