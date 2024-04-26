// @flow
import * as React from "react"
import { useCampaign, useSubscriptions } from "@limio/sdk"
import * as R from "ramda"
import { stripPathToProductName } from "./helpers"
import { Alert } from "@limio/design-system"
import { DateTime } from "@limio/date"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { groupPath } from "./helpers"

type Props = {
  selectedProduct: string,
  compareLink: string,
  handleBaseProductChange: string => void
}

function Select({ selectedProduct, handleBaseProductChange, compareLink }: Props): React.Node {
  const { offers = [], addOns: addOnsFromCampaign } = useCampaign()
  let addOns
  if (Array.isArray(addOnsFromCampaign)) {
    addOns = addOnsFromCampaign
  } else {
    addOns = addOnsFromCampaign === null || addOnsFromCampaign === undefined ? [] : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign))
  }
  const { subscriptions } = useSubscriptions() // returns a subscription[]
  const subscription = subscriptions[0]

  const termEndDate = R.pathOr("N/A", ["data", "termEndDate"], subscription)
  const renewDate = DateTime.fromISO(termEndDate).toFormat("MMMM d, yyyy")
  const offerGroups = R.groupBy(offer => groupPath(offer), offers)
  const offerKeys = Object.keys(offerGroups)

  return (
    <>
      <div className="plan-title">CHOOSE A PLAN</div>
      <div className="flex gap-4 center">
        <select className="selection__select" value={selectedProduct} onChange={e => handleBaseProductChange(e)}>
          {offerKeys.map((offerKey, i) => (
            <option key={i} value={offerKey}>
              {stripPathToProductName(offerKey)}
            </option>
          ))}
        </select>
        <a href={compareLink}>Compare</a>
      </div>
      <Alert color={"primary"} className={"grid-stretch"}>
        <FontAwesomeIcon icon={faCircleInfo} />
        <p className={"mb-0 alert-blue inline pl-2"}>{`Your plan is set to remove ${renewDate}.`}</p>
      </Alert>
      <div className="row-border" />
    </>
  )
}

export default Select
