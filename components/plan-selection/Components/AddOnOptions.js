// @flow
import * as React from "react"
import { useCampaign } from "@limio/sdk"
import * as R from "ramda"
import { stripPathToProductName } from "../helpers"
import { usePreview } from "@limio/ui-preview-context"
import { ModalBody, ModalHeader } from "@limio/design-system"
import { groupPath } from "../helpers"

type Props = {
  setSelectedAddOnProducts: string => void,
  selectedAddOnProducts: Array<string>,
  selectedProduct: string
}

export const stripHTMLtags = (str: string): string => {
  let removedTags = str.replace(/(<([^>]+)*>)/gi, "")
  removedTags = removedTags.replace(/&nbsp;/gi, " ")
  return removedTags
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

const isVolumeAddOn = (addOnGroups, addOnKey) => {
  const hasVolume = R.pathOr(false, ["data", "attributes", "volume_plan"])
  const matchedGroup = addOnGroups[addOnKey]
  const anyVolume = matchedGroup.find(addOn => hasVolume(addOn)) ?? false
  return anyVolume
}

const standariseString = str => {
  return str.replace(/\s+/g, "-").toLowerCase()
}

function AddOnOptions({ selectedAddOnProducts, setSelectedAddOnProducts, selectedProduct }: Props): React.Node {
  const { offers = [], addOns: addOnsFromCampaign } = useCampaign()
  let addOns
  if (Array.isArray(addOnsFromCampaign)) {
    addOns = addOnsFromCampaign
  } else {
    addOns = addOnsFromCampaign === null || addOnsFromCampaign === undefined ? [] : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign))
  }
  const { loadingPreview } = usePreview()
  const [expandedAddOn, setExpandedAddOn] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const productName = standariseString(stripPathToProductName(selectedProduct).split(" ")[0])

  const addOnGroups = R.groupBy(addOn => groupPath(addOn), addOns)

  // filter add on groups by compatibility which is stored in addOn.data.attributes.compatible_products
  const filterIncompatibleAddOns = R.map(
    R.filter(addOn => {
      return R.any(R.includes(R.__, R.path(["data", "attributes", "compatible_products"], addOn)), [productName, "base"])
    })
  )
  const filteredAddOns = filterIncompatibleAddOns(addOnGroups)
  const addOnKeys = Object.keys(R.reject(R.equals([]))(filteredAddOns))

  const handleAdd = key => {
    const isVolume = isVolumeAddOn(addOnGroups, key)
    if (isVolume) {
      setExpandedAddOn(key)
      // get base volume and set that as default
      const addOn = addOns.find(addOn => addOn.data.products[0].path === key)
      const baseVolume = addOn.data.attributes.quantities.sort((a, b) => a - b)[0]
      setSelectedAddOnProducts(prev => prev.concat({ product: key, quantity: baseVolume }))
    } else setSelectedAddOnProducts(prev => prev.concat({ product: key, quantity: 1 }))
  }

  const handleRemove = key => {
    setSelectedAddOnProducts(prev => prev.filter(obj => obj.product !== key))
    isVolumeAddOn(addOnGroups, key) ? setExpandedAddOn("") : null
  }

  const getVolumeOptions = (addOnGroups, addOnKey) => {
    const matchedGroup = addOnGroups[addOnKey]
    const options = matchedGroup[0].data.attributes.quantities
    const quantityText = matchedGroup[0].data.attributes.quantity_text

    return options.map((option, i) => {
      return (
        <tr key={i} className={"w-inherit"}>
          <td>
            <input
              type="radio"
              name={addOnKey}
              value={option}
              checked={selectedAddOnProducts.find(obj => obj.product === addOnKey && obj.quantity === option)}
              onChange={() => setSelectedAddOnProducts(prev => prev.map(obj => (obj.product === addOnKey ? { ...obj, quantity: option } : obj)))}
            />
          </td>
          <td>
            {option} {quantityText}
          </td>
          <td>See above for price</td>
        </tr>
      )
    })
  }

  return (
    <>
      <p className={"plan-title"}>CUSTOMIZE YOUR ADD-ONS</p>
      <div></div>
      <div className={"grid-stretch"}>
        {addOnKeys.length &&
          addOnKeys.map(addOnKey => {
            const volumeAddOn = isVolumeAddOn(addOnGroups, addOnKey)
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
                      {volumeAddOn ? (
                        <button className={"dialog-btn"} onClick={() => setDialogOpen(true)}>
                          Click here to see pricing
                        </button>
                      ) : (
                        <></>
                      )}
                    </span>
                    <p>{findAddOnDesc(addOnGroups, addOnKey)}</p>
                  </div>
                </div>
                {/* logic for expanding volume add on and driving quantity selection*/}
                {volumeAddOn && expandedAddOn.includes(addOnKey) ? (
                  <table className={"w-inherit"}>
                    <thead>
                      <tr className={"w-inherit"}>
                        <th>{""}</th>
                        <th>PLAN</th>
                        <th>PRICE</th>
                      </tr>
                    </thead>
                    <tbody>{getVolumeOptions(addOnGroups, addOnKey)}</tbody>
                  </table>
                ) : null}
                {dialogOpen ? (
                  <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show" role="dialog" tabIndex="-1" style={{ display: "block" }}>
                      <ModalHeader toggle={() => setDialogOpen(false)}></ModalHeader>
                      <ModalBody>
                        <img
                          src={R.pathOr(
                            "https://www.jazzhr.com/wp-content/uploads/2023/11/jazzhr_home-hero-img-2312.png",
                            ["data", "attributes", "volume_price_link"],
                            volumeAddOn
                          )}
                          alt="pricing for the add on"
                          style={{ maxHeight: "100%", maxWidth: "100%" }}
                        />
                      </ModalBody>
                    </div>
                  </>
                ) : (
                  <> </>
                )}
              </div>
            )
          })}
      </div>
    </>
  )
}

export default AddOnOptions
