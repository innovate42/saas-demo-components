// @flow
import React from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import AddOn from "./components/AddOn"
import "./index.css"
import { useCheckout } from "@limio/internal-checkout-sdk"

type Props = {
  heading: string,
  subheading: string
}

export const AddOnCards = ({ heading, subheading, ctaText, noAddOnsText }: Props) => {
  const { addOns = [] } = useCampaign()
  const { useCheckoutSelector } = useCheckout()
  const basketItems = useCheckoutSelector(state => state.order.orderItems)
  const currentOffer = basketItems[0]?.offer

  const filteredAddOns = addOns.filter(addOn => {
    const { data } = addOn
    const { compatibleLabel } = data.attributes
    const labelExists = compatibleLabel && currentOffer.data?.attributes?.compatibleLabel
    if (!labelExists) {
      return
    }
    return compatibleLabel.some(label => currentOffer.data.attributes.compatibleLabel.includes(label))
  })

  return (
    <React.Suspense fallback={<div></div>}>
      <section className="add-on-section">
        <div className="add-on-container">
          {heading || subheading ? (
            <div className="add-on-heading-container">
              {heading && <h2 className="add-on-heading">Heading Text</h2>}
              {subheading && <p className="add-on-subheading">Subheading Text</p>}
            </div>
          ) : (
            <> </>
          )}
          <div className="add-on-grid">
            {filteredAddOns.length > 0 ? (
              filteredAddOns.map(addOn => <AddOn key={addOn.path + "/parent"} addOn={addOn} ctaText={ctaText} />)
            ) : (
              <p>{noAddOnsText}</p>
            )}
          </div>
        </div>
      </section>
    </React.Suspense>
  )
}

export default AddOnCards
