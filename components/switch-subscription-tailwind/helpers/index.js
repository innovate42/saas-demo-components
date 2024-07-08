import { formatCurrency } from "../../source/currency"

export function filterOffers(offerItems: ElasticOffer[], subData: LimioObject<Subscription>, filterSameTerm: boolean, filterBySameProduct: boolean, currentProduct: string): ElasticOffer[] {
    let filteredItems = offerItems.filter(
      offerItem => (offerItem.path !== subData?.data.offer.path || subData?.data.offer?.data?.attributes?.allow_multibuy__limio) && offerItem.type === "item"
    ) // This allows to attach a whole directory and only exclude offer already applied

    if (filterBySameProduct) {
        filteredItems = filteredItems.filter(offerItem => offerItem.data.products[0].path !== currentProduct)
    }
    const isDiscount = offerItems.map(offerItem => offerItem?.data?.record_subtype === "discount").includes(true)
  
    // Discounts can only be applied to the same term type
    if (isDiscount) {
      let discounts = offerItems.filter(offerItem => offerItem?.data?.record_subtype === "discount")
      const standard = offerItems.filter(offerItem => offerItem?.data?.record_subtype !== "discount")
  
      const term = subData?.data?.offer?.data?.attributes?.term__limio
  
      if (term) {
        const { length: subTermLength, type: subTermType } = term
  
        discounts = discounts.filter(offerItem => {
          const { termLength, termType } = offerItem.data.attributes.discount__limio
          return parseInt(termLength) === parseInt(subTermLength) && termType === subTermType
        })
      }
  
      filteredItems = [...discounts, ...standard]
    }
  
    // filter any thing that's standard offer and the same term as current offer if setting enabled (enables change term)
    if (filterSameTerm) {
      const discounts = offerItems.filter(offerItem => offerItem?.data?.record_subtype === "discount")
      let standard = offerItems.filter(offerItem => offerItem?.data?.record_subtype !== "discount")
  
      const term = subData?.data?.offer?.data?.attributes?.term__limio
  
      if (term) {
        const { length: subTermLength, type: subTermType } = term
  
        standard = standard.filter(offerItem => {
          const { length: termLength, type: termType } = offerItem.data.attributes.term__limio
          const sameTerm = parseInt(termLength) === parseInt(subTermLength) && termType === subTermType
          const sameGroup = offerItem?.data?.attributes?.group__limio === subData?.data?.offer?.data?.attributes?.group__limio
  
          return !sameGroup || !sameTerm
        })
      }
  
      filteredItems = [...discounts, ...standard]
    }
  
    return filteredItems
  }



