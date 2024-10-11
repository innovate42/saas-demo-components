// @flow
import * as React from "react"
import { useState } from "react"
import { useCampaign } from "@limio/sdk"
import Select from "./Components/Select"
import BillingFrequency from "./Components/BillingFrequency"
import BillingPlan from "./Components/BillingPlan"
import AddOnOptions from "./Components/AddOnOptions"
import PreviewBasket from "./Components/PreviewBasket"
import QuantityField from "./Components/QuantityField"
import "./index.css"
import * as R from "ramda"
import { PreviewProvider } from "@limio/ui-preview-context"
import { groupPath } from "./helpers"

type Props = {
  monthlyTermLabel: string,
  oneYearTermLabel: string,
  twoYearTermLabel: string,
  threeYearTermLabel: string,
  basketDescText: string
}

function PlanSelection({ monthlyTermLabel, oneYearTermLabel, twoYearTermLabel, threeYearTermLabel, basketDescText }: Props): React.Node {
  const { offers = [], addOns: addOnsFromCampaign } = useCampaign()

  let addOns
  if (Array.isArray(addOnsFromCampaign)) {
    addOns = addOnsFromCampaign
  } else {
    addOns = addOnsFromCampaign === null || addOnsFromCampaign === undefined ? [] : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign))
  }

  const termLabels = {
    monthlyTermLabel,
    oneYearTermLabel,
    twoYearTermLabel,
    threeYearTermLabel
  }

  const offerGroups = R.groupBy(offer => groupPath(offer), offers)

  // select first product as default
  const [selectedProduct, setSelectedProduct] = useState(Object.keys(offerGroups)[0]) // "/productPath"

  // select first offer as of first product as default
  const [selectedOffer, setSelectedOffer] = useState(offerGroups[selectedProduct][0].id) // offer id "vgjh321v3jgh21g312g3y21"
  const [selectedTerm, setSelectedTerm] = useState(offerGroups[selectedProduct][0].data.attributes.term__limio) // object { length: Number, renewal_trigger:
  // str, renewal_type: str, type: "months" |
  // "years" etc }
  const [selectedAddOnProducts, setSelectedAddOnProducts] = useState<
    Array<{
      product: string,
      quantity?: number
    }>
  >([]) // add on product path
  const [selectedBillingPlan, setSelectedBillingPlan] = useState(offerGroups[selectedProduct][0].data.attributes.billing_plan[0])
  const [quantity, setQuantity] = useState(1)

  const handleOfferSelection = (ratePlan, term) => {
    const offers = offerGroups[selectedProduct]
    const offer = offers.find(offer => {
      const offerTerm = offer.data.attributes.term__limio
      const offerRatePlan = offer.data.productBundles[0].rate_plan
      return (
        term.length === offerTerm.length &&
        term.renewal_trigger === offerTerm.renewal_trigger &&
        term.renewal_type === offerTerm.renewal_type &&
        term.type === offerTerm.type &&
        ratePlan === offerRatePlan
      )
    })
    if (offer) {
      setSelectedOffer(offer.id)
    }
  }
  // these handlers are through onChange so React batch updates them automatically.
  const handleBaseProductChange = React.useCallback(event => {
    const { value } = event.target
    setSelectedProduct(value)
    setSelectedAddOnProducts([])
    setSelectedOffer(offerGroups[value][0].id)
    setSelectedBillingPlan(offerGroups[selectedProduct][0].data.attributes.billing_plan[0])
    setSelectedTerm(offerGroups[value][0].data.attributes.term__limio)
  }, [])

  const handleTermChange = React.useCallback(
    term => {
      const possibleOptions = offerGroups[selectedProduct].filter(offer => R.equals(offer.data.attributes.term__limio, term))
      const ratePlan = possibleOptions[0].data.productBundles[0].rate_plan
      setSelectedBillingPlan(possibleOptions[0].data.attributes.billing_plan[0])
      setSelectedTerm(term)
      handleOfferSelection(ratePlan, term)
    },
    [selectedProduct]
  )

  const handleFrequencyChange = React.useCallback(
    ratePlan => {
      setSelectedBillingPlan(ratePlan)
      handleOfferSelection(ratePlan, selectedTerm)
    },
    [selectedProduct, selectedTerm]
  )

  return (
    <PreviewProvider>
      <div className={"component-container"}>
        <div className="plan-page">
          <div className="left-side-plan-page border-pp">
            <h2 className="grid-stretch text-left">Purchase</h2>
            {/* column 1 */}
            <Select selectedProduct={selectedProduct} setSelectedProduct={handleBaseProductChange} />
            <BillingPlan selectedTerm={selectedTerm} handleTermChange={handleTermChange} selectedProduct={selectedProduct} termLabels={termLabels} />
            <BillingFrequency
              selectedBillingPlan={selectedBillingPlan}
              selectedProduct={selectedProduct}
              selectedTerm={selectedTerm}
              handleFrequencyChange={handleFrequencyChange}
            />
            <QuantityField quantity={quantity} setQuantity={setQuantity} selectedOffer={selectedOffer} />

            <AddOnOptions
              selectedAddOnProducts={selectedAddOnProducts}
              setSelectedAddOnProducts={setSelectedAddOnProducts}
              selectedProduct={selectedProduct}
              selectedOffer={selectedOffer}
            />
          </div>
          {/* column 2 */}
          <PreviewBasket
            quantity={quantity}
            selectedProduct={selectedProduct}
            selectedOffer={selectedOffer}
            selectedAddOnProducts={selectedAddOnProducts}
            selectedBillingPlan={selectedBillingPlan}
            basketDescText={basketDescText}
          />
        </div>
      </div>
    </PreviewProvider>
  )
}

export default PlanSelection
