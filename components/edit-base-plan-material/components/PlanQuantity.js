// @flow
import * as React from "react";
import { usePreview } from "@limio/ui-preview-context";
import { TextField, FormControl } from "@mui/material";

type Props = {
    handleQuantityChange: (quantity: number) => void,
    quantity: number,
    theme: Object,
};

function PlanQuantity({ handleQuantityChange, quantity, theme }: Props): React.Node {
    const { loadingPreview } = usePreview();

    return (
        <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
                label="Number of Seats"
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                disabled={loadingPreview}
                fullWidth
                sx={{
                    backgroundColor: theme.cardBackground,
                    input: { color: theme.text },
                }}
            />
        </FormControl>
    );
}

export default PlanQuantity;
