// @flow
import * as React from "react";
import { emptyOrNil, formatCurrency, stripPathToProductName } from "./helpers";
import { LoadingSpinner } from "@limio/design-system";
import * as R from "ramda";
import { Typography, Card, CardContent } from "@mui/material";

type Props = {
  selectedOfferObj: Object,
  price: Object,
  processToday: Object,
  yourNewPlanCopy: string,
  yourOldPlanCopy: string,
  currentOffer: Object,
  theme: Object,
};

function PlanAndPricing({ selectedOfferObj, price, processToday, yourNewPlanCopy, yourOldPlanCopy, currentOffer, theme }: Props) {
  const currentOfferId = R.pathOr(null, ["data", "offer", "id"], currentOffer);
  const currency = R.pathOr("USD", ["data", "offer", "attributes", "price__limio", "0", "currency"], currentOffer);

  if (!selectedOfferObj || currentOfferId === selectedOfferObj?.id) return null;

  return (
      <Card sx={{ mt: 2, p: 2, backgroundColor: theme.cardBackground, border: `1px solid ${theme.borderColor}`, boxShadow: theme.cardShadow }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: theme.text }}>
            {stripPathToProductName(selectedOfferObj.data.attributes.display_name__limio)}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.text }}>{yourNewPlanCopy}</Typography>
          <Typography variant="h6" sx={{ color: theme.primary }}>
            {processToday.current ? (!emptyOrNil(price.add) && !emptyOrNil(price.remove) ? formatCurrency(price.add.amountWithoutTax, currency) : <LoadingSpinner />) : "--"}
          </Typography>
        </CardContent>
      </Card>
  );
}

export default PlanAndPricing;
