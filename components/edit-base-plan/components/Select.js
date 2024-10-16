// @flow
import * as React from "react";
import { useCampaign, useSubscriptions } from "@limio/sdk";
import * as R from "ramda";
import { stripPathToProductName } from "./helpers";
import { DateTime } from "@limio/date";
import { groupPath } from "./helpers";

type Props = {
  selectedProduct: string,
  compareLink: string,
  handleBaseProductChange: (string) => void,
};

function Select({
  selectedProduct,
  handleBaseProductChange,
  compareLink,
}: Props): React.Node {
  const { offers = [] } = useCampaign();

  const offerGroups = R.groupBy((offer) => groupPath(offer), offers);
  const offerKeys = Object.keys(offerGroups);

  return (
    <>
      <div className="plan-title">CHOOSE A PLAN</div>
      <div className="flex gap-4 center">
        <select
          className="selection__select"
          value={selectedProduct}
          onChange={(e) => handleBaseProductChange(e)}
        >
          {offerKeys.map((offerKey, i) => (
            <option key={i} value={offerKey}>
              {stripPathToProductName(offerKey)}
            </option>
          ))}
        </select>
        <a href={compareLink}>Compare</a>
      </div>

      <div className="row-border" />
    </>
  );
}

export default Select;
