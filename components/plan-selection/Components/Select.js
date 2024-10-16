// @flow
import * as React from "react"
import { useCampaign } from "@limio/sdk"
import * as R from "ramda"
import { stripPathToProductName } from "../helpers"
import { usePreview } from "@limio/ui-preview-context"
import { groupPath } from "../helpers"

type Props = {
  selectedProduct: string,
  setSelectedProduct: string => void
}

function Select({ selectedProduct, setSelectedProduct }: Props): React.Node {
  const { offers = [] } = useCampaign()

  const { loadingPreview } = usePreview()

  const offerGroups = R.groupBy(offer => groupPath(offer), offers)
  const offerKeys = Object.keys(offerGroups)

  return (
    <>
      <p className="plan-title">CHOOSE A PLAN</p>
      <div className="flex gap-4 center">
        <select className="selection__select" value={selectedProduct} onChange={e => setSelectedProduct(e)} disabled={loadingPreview}>
          {offerKeys.map((offerKey, i) => (
            <option key={i} value={offerKey}>
              {stripPathToProductName(offerKey)}
            </option>
          ))}
        </select>
        <a href="">Compare</a>
      </div>
      <div className="row-border" />
    </>
  )
}

export default Select
