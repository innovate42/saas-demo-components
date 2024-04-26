// @flow
import * as R from "ramda"
import VolumeAddOn from "./VolumeAddOn"
import { hasDesc, stripHTMLtags, stripPathToProductName } from "./helpers"
import React from "react"

type Props = {
  addOn: Object,
  owned: boolean,
  handleQuantityChange: Function,
  updates: Object,
  subscribedAddOns: Array<Object>
}

function CustomiseAddOn({ addOn, owned, handleQuantityChange, updates, subscribedAddOns } : Props): React.Node {
  const hasVolume = R.pathOr(false, ["data", "attributes", "volume_plan"], addOn)

  return (
    <div>
      <div className={"flex col plr-0"}>
        {hasVolume ? (
          <VolumeAddOn owned={owned} addOn={addOn} handleQuantityChange={handleQuantityChange} updates={updates} subscribedAddOns={subscribedAddOns} />
        ) : (
          <div key={addOn.id} className={"flex center mb-20 border-add-on"}>
            <div className={"w-6"}>{owned}</div>
            <div className={"flex col ml-2r"}>
              <p className={"bold r-125"}>{stripPathToProductName(addOn.data.products[0].path)}</p>
              <p>{hasDesc(addOn) ? stripHTMLtags(addOn.data.attributes.description__limio) : "no description is available for this product."}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomiseAddOn
