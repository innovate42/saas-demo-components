//@flow
import * as React from "react";
import {useCampaign} from "@limio/sdk"
type Props = {
}

function QuickAddOn({ }: Props): React.Node {
    const {addOns =[]} = useCampaign();

    console.log(addOns)

  return (
    <div className="quick-add-container">
      {addOns.map(addOn => {
        return (
          <div className="quick-add-item" key={addOn.id}>
            <div className="quick-add-item-content">
              <div className="quick-add-item-name">{addOn.name}</div>
              <div className="quick-add-item-price">{addOn.price}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuickAddOn