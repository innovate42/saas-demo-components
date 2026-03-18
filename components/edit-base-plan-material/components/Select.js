// @flow
import * as React from "react";
import { useCampaign } from "@limio/sdk";
import * as R from "ramda";
import { stripPathToProductName, groupPath } from "./helpers";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";

type Props = {
    selectedProduct: string,
    handleBaseProductChange: (event: SyntheticInputEvent<HTMLSelectElement>) => void,
    productSelectLabel: string,
    theme: Object,
};

function Select({ selectedProduct, handleBaseProductChange, productSelectLabel, theme }: Props): React.Node {
    const { offers = [] } = useCampaign();
    const offerGroups = R.groupBy(offer => groupPath(offer), offers);
    const offerKeys = Object.keys(offerGroups);

    return (
        <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ color: theme.text }}>{productSelectLabel}</InputLabel>
            <MuiSelect
                value={selectedProduct}
                onChange={handleBaseProductChange}
                label={productSelectLabel}
                sx={{
                    backgroundColor: theme.cardBackground,
                    color: theme.text,
                    borderColor: theme.borderColor,
                }}
            >
                {offerKeys.map((offerKey, i) => (
                    <MenuItem key={i} value={offerKey}>
                        {stripPathToProductName(offerKey)}
                    </MenuItem>
                ))}
            </MuiSelect>
        </FormControl>
    );
}

export default Select;
