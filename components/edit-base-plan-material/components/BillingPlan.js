// @flow
import * as React from "react";
import * as R from "ramda";
import { useCampaign } from "@limio/sdk";
import { usePreview } from "@limio/ui-preview-context";
import { v4 as uuid } from "uuid";
import { groupPath } from "./helpers";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

type Props = {
  selectedProduct: string,
  selectedTerm: Object,
  handleTermChange: string => void,
  billingTermSelectLabel: string,
  theme: Object,
};

function BillingPlan({ selectedProduct, selectedTerm, handleTermChange, billingTermSelectLabel, theme }: Props): React.Node {
  const { offers = [] } = useCampaign();
  const { loadingPreview } = usePreview();

  const offerGroups = R.groupBy(offer => groupPath(offer), offers);
  const possibleTerms = R.uniq(offerGroups[selectedProduct]?.map(offer => offer.data.attributes.term__limio) || []);

  const formatTerm = (term) => {
    switch (term.type) {
      case "years":
        return `${term.length} Year${term.length > 1 ? "s" : ""} Agreement`;
      case "months":
        return term.length === 1 ? "Month-to-Month" : `${term.length} Month${term.length > 1 ? "s" : ""}`;
      default:
        return `${term.length} ${term.type}`;
    }
  };

  const sortedTerms = R.sort((a, b) => a.length - b.length, possibleTerms);

  return (
      <FormControl fullWidth sx={{ mt: 2 }}>
        <FormLabel sx={{ color: theme.text }}>{billingTermSelectLabel}</FormLabel>
        <RadioGroup value={JSON.stringify(selectedTerm)} onChange={(e) => { handleTermChange(JSON.parse(e.target.value)) }}>
          {sortedTerms.map((term) => (
              <FormControlLabel
                  key={uuid()}
                  value={JSON.stringify(term)}
                  control={<Radio sx={{ color: theme.primary }} />}
                  label={formatTerm(term)}
                  disabled={loadingPreview}
              />
          ))}
        </RadioGroup>
      </FormControl>
  );
}

export default BillingPlan;
