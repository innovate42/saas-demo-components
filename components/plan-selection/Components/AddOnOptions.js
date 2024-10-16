// @flow
import * as React from "react"
import { useCampaign } from "@limio/sdk"
import * as R from "ramda"
import { stripPathToProductName } from "../helpers"
import { groupPath, stripHTMLtags } from "../helpers"

type Props = {
  setSelectedAddOnProducts: string => void,
  selectedAddOnProducts: Array<string>,
  selectedProduct: string,
  selectedOffer: Object
}

const findAddOnDesc = (addOnGroups, addOnKey) => {
  const matchedGroup = addOnGroups[addOnKey]
  const anyDesc = matchedGroup.find(addOn => addOn.data.attributes.description__limio)
  if (anyDesc) {
    return stripHTMLtags(anyDesc.data.attributes.description__limio)
  } else {
    return "no description is available for this product."
  }
}

const standariseString = str => {
  return str.replace(/\s+/g, "-").toLowerCase()
}

function AddOnOptions({ selectedAddOnProducts, setSelectedAddOnProducts, selectedOffer }: Props): React.Node {
  const { addOns, offers} = useCampaign()

  const compatibleOfferLabel = standariseString(offers.find(offer => offer.id === selectedOffer)?.data?.attributes?.compatibleLabel[0])

  const addOnGroups = R.groupBy(addOn => groupPath(addOn), addOns)

  const filterIncompatibleAddOns = addOnGroups => {
    const keys = Object.keys(addOnGroups)
    if (!keys.length) return {}
    if (!compatibleOfferLabel) return addOnGroups
    const compatible = keys.filter(key => addOnGroups[key].find(addOn => addOn.data.attributes.compatibleLabel[0] === compatibleOfferLabel))
   return R.pick(compatible, addOnGroups)
  }

  const filteredAddOns = filterIncompatibleAddOns(addOnGroups)
  const addOnKeys = Object.keys(R.reject(R.equals([]))(filteredAddOns))

  const handleAdd = key => {
   setSelectedAddOnProducts(prev => prev.concat({ product: key, quantity: 1 }))
  }

  const handleRemove = key => {
    setSelectedAddOnProducts(prev => prev.filter(obj => obj.product !== key))
  }


  return (
    <>
      <p className={"plan-title"}>CUSTOMIZE YOUR ADD-ONS</p>
      <div></div>
      <div className={"grid-stretch"}>
        {addOnKeys.length &&
          addOnKeys.map(addOnKey => {
            return (
              <div className="flex col mb-20 border-add-on" key={addOnKey}>
                <div className={"flex center mb-20"}>
                  <div className={"w-6"}>
                    {selectedAddOnProducts.length > 0 && selectedAddOnProducts.find(obj => obj.product === addOnKey) ? (
                      <button onClick={() => handleRemove(addOnKey)} className={"remove-btn add-remove-btns w-full"}>
                        Remove
                      </button>
                    ) : (
                      <button onClick={() => handleAdd(addOnKey)} className={"add-btn add-remove-btns w-full"}>
                        Add
                      </button>
                    )}
                  </div>
                  <div className={"flex col ml-2r"}>
                    <span className={"flex space-between"}>
                      <p className={"bold font-125"}>{stripPathToProductName(addOnKey)}</p>
                    </span>
                    <p>{findAddOnDesc(addOnGroups, addOnKey)}</p>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default AddOnOptions
