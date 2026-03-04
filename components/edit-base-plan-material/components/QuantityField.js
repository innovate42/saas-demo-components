// @flow
import * as React from "react";
import { TextField, FormControl } from "@mui/material";

type Props = {
  quantity: number,
  setQuantity: (quantity: number) => void,
  onlyIncrease: boolean,
  subQuantity: number,
  quantityFieldLabel: string,
  theme: Object,
};

function QuantityField({ quantity, setQuantity, onlyIncrease, subQuantity = 1, quantityFieldLabel, theme }: Props): React.Node {
  const [localQuantity, setLocalQuantity] = React.useState(quantity.toString());
  const debounceTimeout = React.useRef<?TimeoutID>(null);

  const handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
      console.log(onlyIncrease && parseInt(e.target.value, 10) < subQuantity)
    if (onlyIncrease && parseInt(e.target.value, 10) < subQuantity) return;

    const inputValue = e.target.value;
    setLocalQuantity(inputValue);

    const numericValue = parseInt(inputValue, 10);
    if (!isNaN(numericValue)) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        setQuantity(numericValue);
      }, 500);
    }
  };

  return (
      <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
              variant="outlined"
              label="Quantity"
              type="number"
              value={localQuantity}
              onChange={handleChange}
              fullWidth
              sx={{
                  backgroundColor: theme.cardBackground,
                  '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                          borderColor: theme.borderColor,
                      },
                      '&:hover fieldset': {
                          borderColor: theme.primary,
                      },
                      '&.Mui-focused fieldset': {
                          borderColor: theme.primary,
                          boxShadow: `0 0 0 2px ${theme.background}`, // subtle inner highlight
                      },
                      input: {
                          color: theme.text,
                      },
                  },
                  '& .MuiInputLabel-root': {
                      color: theme.text,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.primary,
                  },
                  '& .MuiInputBase-input::placeholder': {
                      color: theme.text,
                      opacity: 0.6,
                  },
              }}
          />

      </FormControl>
  );
}

export default QuantityField;
