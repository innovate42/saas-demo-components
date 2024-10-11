// @flow
import React from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import AddOn from "./components/AddOn"
import "./index.css"

type Props = {
  heading: string,
  subheading: string
}

export const AddOnCards = ({ heading, subheading, ctaText }: Props) => {
  const { addOns = [] } = useCampaign()
  const { basketItems = [] } = useBasket()
  const currentOffer = basketItems[0]?.offer

  const filteredAddOns = addOns.filter(addOn => {
    const { data } = addOn
    const { compatibleLabel } = data.attributes
    return compatibleLabel.some(label => currentOffer.data.attributes.compatibleLabel.includes(label))
  })

  return (
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
            <p>No add-ons to display...</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default AddOnCards
