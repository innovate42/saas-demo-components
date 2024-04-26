// @flow
import * as React from "react"
import { Suspense, useState } from "react"
import "./index.css"
import { useCampaign, useSubscriptions } from "@limio/sdk"
import * as R from "ramda"
import Select from "./components/Select"
import EditBasePlanBasket from "./components/EditBasePlanBasket"
import BillingPlan from "./components/BillingPlan"
import BillingFrequency from "./components/BillingFrequency"
import QuantityField from "./components/QuantityField"
import { Alert } from "@limio/design-system"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { PreviewProvider } from "@limio/ui-preview-context"
import { checkActiveSubscriptionOffer, groupPath } from "./components/helpers"

type Props = {
  defaultToBase: boolean,
  compareLink: string
}

function EditBasePlan(props: Props): React.Node {
  const { subscriptions } = useSubscriptions() // returns a subscription[]
  const subscription = subscriptions[0]
  const { offers = [], addOns: addOnsFromCampaign } = useCampaign()
  let addOns
  if (Array.isArray(addOnsFromCampaign)) {
    addOns = addOnsFromCampaign
  } else {
    addOns = addOnsFromCampaign === null || addOnsFromCampaign === undefined ? [] : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign))
  }
  const currentOffer = checkActiveSubscriptionOffer(subscription.offers)

  console.log("subscription", subscription)

  const offerGroups = R.groupBy(offer => groupPath(offer), offers)

  const [selectedProduct, setSelectedProduct] = useState(Object.keys(offerGroups)[0])

  const [selectedBillingPlan, setSelectedBillingPlan] = useState(offerGroups[selectedProduct][0].data.productBundles[0].rate_plan) // rate plan "Monthly -
  // Annual Agreement" |
  // "Monthly"
  const [selectedTerm, setSelectedTerm] = useState(offerGroups[selectedProduct][0].data.attributes.term__limio) // object { length: Number, renewal_trigger:
  // str, renewal_type: str, type: "months" |
  // "years" etc }
  const [selectedOffer, setSelectedOffer] = useState(offerGroups[selectedProduct][0].id) // offer id "vgjh321v3jgh21g312g3y21"

  const [quantity, setQuantity] = useState(subscription.data.quantity || 1)

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
  // when the billing plan changes possible terms changes
  const handleBaseProductChange = React.useCallback(event => {
    const { value } = event.target
    setSelectedProduct(value)
    setSelectedOffer(offerGroups[value][0].id)
    setSelectedBillingPlan(offerGroups[value][0].data.productBundles[0].rate_plan)
    setSelectedTerm(offerGroups[value][0].data.attributes.term__limio)
  }, [])

  const handleTermChange = React.useCallback(
    term => {
      const possibleOptions = offerGroups[selectedProduct].filter(offer => R.equals(offer.data.attributes.term__limio, term))
      const ratePlan = possibleOptions[0].data.productBundles[0].rate_plan
      setSelectedBillingPlan(possibleOptions[0].data.productBundles[0].rate_plan)
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
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewProvider>
        <div className={"grey m-all p-all h-100"}>
          <div className="plan-page">
            <div className="left-side-plan-page border-pp">
              <h3 className="grid-stretch f-32">Change your Base Plan</h3>
              <Select selectedProduct={selectedProduct} handleBaseProductChange={handleBaseProductChange} compareLink={props.compareLink} />
              <BillingPlan
                selectedTerm={selectedTerm}
                setSelectedTerm={setSelectedTerm}
                selectedProduct={selectedProduct}
                handleTermChange={handleTermChange}
              />
              <BillingFrequency
                selectedBillingPlan={selectedBillingPlan}
                selectedProduct={selectedProduct}
                handleFrequencyChange={handleFrequencyChange}
                selectedTerm={selectedTerm}
              />
              <QuantityField quantity={quantity} setQuantity={setQuantity} />
              <div className={"grid-stretch"}>
                <Alert color={"primary"}>
                  <FontAwesomeIcon icon={faCircleInfo} />
                  <p
                    className={"mb-0 alert-blue inline pl-2"}
                  >{`Need to manage your subscription add-ons? Please visit your subscription page and choose 'Edit Add-ons' to make your changes.`}</p>
                </Alert>
              </div>
            </div>
            {/* column 2 */}
            <EditBasePlanBasket selectedOffer={selectedOffer} quantity={quantity} />
          </div>
        </div>
      </PreviewProvider>
    </Suspense>
  )
}

export default EditBasePlan
