// @flow
import { stripAdd_on_id, stripHTMLtags, stripPathToProductName } from "./helpers"
import { useSubscriptions } from "@limio/sdk"
import { v4 as uuid } from "uuid"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import * as R from "ramda"
import { usePreview } from "@limio/ui-preview-context"
import { ModalBody, ModalHeader } from "@limio/design-system"

const hasDesc = addOn => {
  return addOn.data.attributes.description__limio !== undefined
}

function VolumeAddOn({ addOn, owned, handleQuantityChange, subscribedAddOns, updates }: Props): React.Node {
  const [expanded, setExpanded] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const addOnPriceImgLink = R.pathOr(
    "https://www.jazzhr.com/wp-content/uploads/2023/11/jazzhr_home-hero-img-2312.png",
    ["data", "attributes", "volume_price_link"],
    addOn
  )
  const { subscriptions } = useSubscriptions() // returns a subscription[]
  const { loadingPreview } = usePreview()
  const subId = new URLSearchParams(window.location.search).get("subId")
  const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0]
  let update
  let updateQuantity = ""
  let origQuantity = ""
  const quantityText = addOn.data.attributes.quantity_text

  const isSubscribed = !R.isNil(subscribedAddOns) ? subscribedAddOns.find(id => id === addOn.id) : false
  const subscriptionAddOn = subscription.addOns.find(addOn => stripAdd_on_id(addOn.data.add_on.id) === isSubscribed)
  const id = subscriptionAddOn ? subscriptionAddOn.id : addOn.id

  // set quantity if it is a subscribed add on
  if (subscriptionAddOn) {
    origQuantity = subscriptionAddOn.data.quantity
    updateQuantity = subscriptionAddOn.data.quantity
  }

  // handles if the new add on has a quantity change
  if (!R.isNil(updates)) {
    update = updates.find(update => update.id === id)
    if (!R.isNil(update)) {
      updateQuantity = update.quantity
    }
  }

  return (
    <div key={addOn.id} className={"border-add-on add-on-grid"}>
      <div key={addOn.id} className={"flex center mb-10 "}>
        <div className={"w-6"}>{owned}</div>
        <div className={"flex col ml-2r mb-0"}>
          <div className={"flex space-between"}>
            <p className={"bold"}>{stripPathToProductName(addOn.data.products[0].path)}</p>
            <button className={"dialog-btn"} onClick={() => setDialogOpen(true)}>
              Click here to see pricing
            </button>
          </div>
          <p className={"mb-0"}>{hasDesc(addOn) ? stripHTMLtags(addOn.data.attributes.description__limio) : "no description is available for this product."}</p>
        </div>
      </div>
      {expanded ? (
        <div className={"flex col ml-2r grid-stretch"}>
          <table>
            <tr>
              <th>{""}</th>
              <th>PLAN</th>
              <th>PRICE</th>
            </tr>
            {addOn.data.attributes.quantities
              .sort((a, b) => a - b)
              .map(quantity => {
                let checked = false
                if (Number(quantity) === Number(updateQuantity)) {
                  checked = true
                }
                const version = R.pathOr("", ["version"], addOn)
                return (
                  <tr key={uuid()}>
                    <input
                      type={"radio"}
                      id={id}
                      value={quantity}
                      data-original={origQuantity}
                      onChange={handleQuantityChange}
                      checked={Number(quantity) === Number(updateQuantity)}
                      disabled={loadingPreview}
                      data-version={version}
                    ></input>
                    <td className={"bold"}>{`${quantity} ${quantityText}`}</td>
                    <td>See above for price</td>
                  </tr>
                )
              })}
          </table>
          <div className={"flex justify-end"}>
            <button onClick={() => setExpanded(false)} className={"toggle-btn"}>
              <FontAwesomeIcon icon={faChevronUp}/>
            </button>
          </div>
        </div>
      ) : (
        <div className={"flex justify-end"}>
          <button onClick={() => setExpanded(true)} className={"toggle-btn"}>
            <FontAwesomeIcon icon={faChevronDown}/>
          </button>
        </div>
      )}

      {dialogOpen ? (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show" role="dialog" tabIndex="-1" style={{ display: "block" }}>
            {/*<Modal isOpen={dialogOpen} toggle={() => setDialogOpen(false)} fullscreen>*/}
            <ModalHeader toggle={() => setDialogOpen(false)}></ModalHeader>
            <ModalBody>
              <img src={addOnPriceImgLink} alt="pricing for the add on" style={{ maxHeight: "100%", maxWidth: "100%" }}/>
            </ModalBody>
            {/*</Modal>*/}
          </div>
        </>
      ) : (
        <> </>
      )}
    </div>
  )
}

export default VolumeAddOn
