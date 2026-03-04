// @flow
import * as React from "react";
import { useCampaign } from "@limio/sdk";
import * as R from "ramda";
import { usePreview } from "@limio/ui-preview-context";
import { groupPath } from "./helpers";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

type Props = {
    handleFrequencyChange: string => void,
    selectedBillingPlan: string,
    selectedProduct: string,
    ratePlanSelectLabel: string,
    selectedTerm: Object,
    theme: Object,
};

function BillingFrequency({ selectedProduct, ratePlanSelectLabel, handleFrequencyChange, selectedBillingPlan, selectedTerm, theme }: Props): React.Node {
    const { offers = [] } = useCampaign();
    const { loadingPreview } = usePreview();

    const offerGroups = R.groupBy(offer => groupPath(offer), offers);
    const selectedProductOffers = offerGroups[selectedProduct] || [];
    const validOffers = selectedProductOffers.filter(offer => R.equals(offer.data.attributes.term__limio, selectedTerm));

    const selectedRatePlans = R.groupBy(offer => offer.data.productBundles[0].rate_plan, validOffers);

    return (
        <FormControl fullWidth sx={{ mt: 2 }}>
            <FormLabel sx={{ color: theme.text }}>{ratePlanSelectLabel}</FormLabel>
            <RadioGroup value={selectedBillingPlan} onChange={(e) => handleFrequencyChange(e.target.value)}>
                {Object.keys(selectedRatePlans).map((ratePlan, i) => (
                    <FormControlLabel
                        key={i}
                        value={ratePlan}
                        control={<Radio sx={{ color: theme.primary }} />}
                        label={ratePlan.split("-")[0]}
                        disabled={loadingPreview}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}

export default BillingFrequency;
