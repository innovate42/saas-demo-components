// @flow


export function filterOffers(offerItems, subData)  {
  let offers = offerItems

  let discounts = offerItems.filter(offerItem => offerItem?.data?.record_subtype === "discount")
  let standard = offerItems.filter(offerItem => offerItem?.data?.record_subtype !== "discount")

  const term = subData?.data?.attributes?.term__limio

  if (term) {
    const { length: subTermLength, type: subTermType } = term

    standard = standard.filter(offerItem => {
      const { length: termLength, type: termType } = offerItem.data.attributes.term__limio
      const sameTerm = parseInt(termLength) === parseInt(subTermLength) && termType === subTermType
      const sameGroup = offerItem?.data?.attributes?.group__limio === subData?.data?.offer?.data?.attributes?.group__limio

      return !sameGroup || !sameTerm
    })

    discounts = discounts.filter(offerItem => {
      const { termLength: defaultTermLength, termType: defaultTermType } = offerItem.data.attributes.discount__limio
      const { length: termLength = defaultTermLength, type: termType = defaultTermType } = offerItem.data.attributes.term__limio || {}
      const sameTerm = parseInt(termLength) === parseInt(subTermLength) && termType === subTermType
      return sameTerm
    })
  }

  offers = [...discounts, ...standard]
  // This prevents some Discount from appearing for the time being
  // if (R.any(offer => offer?.data?.attributes?.sales_channel__limio, offers)) {
  //   offers = offers.filter(
  //     offer => R.isNil(offer?.data?.attributes?.sales_channel__limio) || R.includes("Online", offer?.data?.attributes?.sales_channel__limio)
  //   )
  // }

  return offers
}
