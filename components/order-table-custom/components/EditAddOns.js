// @flow
import * as React from "react"
import { Button, Table } from "@limio/design-system"
import type { AddOn } from "../types"



type Props = {
  addOns: Array<AddOn>,
  reviewChangesLink: string,
  nextSchedule: string,
  subscription,
  setEditAddOns: () => void
}

// The design only handles removal of add ons and has a review changes button as per the design
const EditAddOns = ({ addOns, reviewChangesLink, nextSchedule, subscription, setEditAddOns }: Props): React.Node => {
  const [selectedAddOns, setSelectedAddOns] = React.useState([])

  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      setSelectedAddOns(prevSelected => [...prevSelected, id])
    } else {
      setSelectedAddOns(prevSelected => prevSelected.filter(item => item !== id))
    }
  }

  const cancelChanges = () => {
    // clear selection for checkboxes for clarity
    setSelectedAddOns([])
    setEditAddOns(false)
  }

  const handleRemoveSelected = () => {
    // ask for help on how to pass the selected add-ons list around - not using the window.location.href would be better as there could be n links
    const req = requestBodyBuilder()
    console.log(req)
    // window.location.href = reviewChangesLink + "?remove_addons=" + selectedAddOns.join("|")
  }

  const requestBodyBuilder = () => {
    // initial draft not sure if this will need to be in another page or not.
    const effectiveDate = nextSchedule?.data?.date || new Date()
    const removeList = selectedAddOns.map(id => {
      return {
        "type": "remove",
        "quantity": "1",
        "id": id,
        "effective_date": effectiveDate
      }
    })
    return {
      "order_type": "update_subscription",
      "forSubscription": {
        "name": subscription.name
      },
      "updates": removeList,
      "owner": subscription.owner,
      "external_id": "string", // subscription.external_id
      "source": "online", // source is ???
      "process_immediately": true
    }
  }

  return (
    <div className="add-on-list">
      <h3>Edit Add-ons</h3>
      <Table borderless>
        <thead>
        <tr className="border-bottom border-dark">
          <th></th>
          <th>Add-Ons</th>
          <th>Price</th>
          <th>Description</th>
        </tr>
        </thead>
        <tbody>
        {addOns.map((addOn) => (
          <tr key={addOn.id}>
            <td>
              <input
                type="checkbox"
                checked={!selectedAddOns.includes(addOn.id)}
                onChange={(e) => handleCheckboxChange(addOn.id, e.target.checked)}
              />
            </td>
            <td>{addOn.name}</td>
            <td>
              {addOn.data.price__limio[0]?.amount || "N/A"}
            </td>
            <td>
              {addOn.data.attributes.description__limio}
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
      <div className={"edit-add-on-btns"}>
        <Button onClick={handleRemoveSelected} className={"edit-AO-btn"}>Review Changes</Button>
        <Button onClick={cancelChanges}>Cancel Changes</Button>
      </div>
    </div>
  )
}


export default EditAddOns
