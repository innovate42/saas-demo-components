import React from "react";
import { formatCurrency, getCookie } from "@limio/sdk";
import { getBillThroughDate } from "../helpers/Schedule";
import { mapOfferToRow, mapAddOnToRow } from "../helpers/OfferDetails";
import type { SubscriptionRowData } from "../helpers/OfferDetails";
import { useComponentStaticProps } from "../componentStaticProps";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Chip,
} from "../mui";
import type {
  Subscription,
  LimioObject,
  SubscriptionOffer,
  AddOn,
} from "@limio/types";
import "../styles/index.css";

const TOTAL_COLS = 8;

function formatPrice(
  rawPrice: { amount: number; currency?: string } | undefined,
  locale: string,
): string {
  return rawPrice?.amount != null
    ? formatCurrency(rawPrice.amount, rawPrice.currency ?? "USD", locale)
    : "N/A";
}

type TableItem = SubscriptionRowData & {
  key: string;
  rowColor: string;
  chipLabel: string;
  chipColor: string;
};

export function SubscriptionDetails({
  subscription,
  currentOffers,
  currentAddOns,
}: {
  subscription: Subscription;
  currentOffers: LimioObject<SubscriptionOffer>[];
  currentAddOns: AddOn[];
}): React.JSX.Element {
  const locale = getCookie("limio-country");
  const {
    offerRowColor,
    offerChipColor,
    addOnRowColor,
    addOnChipColor,
    primaryTextColor,
    unitPriceColumnLabel,
    existingQuantityColumnLabel,
    billingPlanColumnLabel,
    billThroughDateColumnLabel,
  } = useComponentStaticProps();

  const billThroughDate = getBillThroughDate(subscription.schedule ?? []);

  const priceFormatter = (
    rawPrice: { amount: number; currency?: string } | undefined,
  ) => formatPrice(rawPrice, locale);

  const offerItems: TableItem[] = currentOffers.map((offer, i) => {
    const { displayName, unitPrice, quantity, billingPlan } = mapOfferToRow(
      offer,
      priceFormatter,
    );
    return {
      key: offer.id || `offer-${i}`,
      displayName,
      unitPrice,
      quantity,
      billingPlan,
      rowColor: offerRowColor,
      chipLabel: "Offer",
      chipColor: offerChipColor,
    };
  });

  const addOnItems: TableItem[] = currentAddOns.map((addOn, i) => {
    const { displayName, unitPrice, quantity, billingPlan } = mapAddOnToRow(
      addOn,
      priceFormatter,
    );
    return {
      key: addOn.id || `addon-${i}`,
      displayName,
      unitPrice,
      quantity,
      billingPlan,
      rowColor: addOnRowColor,
      chipLabel: "Add-On",
      chipColor: addOnChipColor,
    };
  });

  const tableItems: TableItem[] = offerItems.concat(addOnItems);

  return (
    <Box sx={{ width: "100%" }}>
      <Table
        className="subscription-details-table"
        size="small"
        sx={{
          width: "100%",
          tableLayout: "auto",
          "& td": { borderBottom: "none" },
          borderCollapse: "collapse",
        }}
      >
        <TableBody>
          {tableItems.map(
            (
              {
                key,
                displayName,
                unitPrice,
                quantity,
                billingPlan,
                rowColor,
                chipLabel,
                chipColor,
              },
              idx,
            ) => (
              <React.Fragment key={key}>
                <TableRow>
                  <TableCell
                    colSpan={TOTAL_COLS}
                    sx={{
                      backgroundColor: rowColor,
                      borderBottom: "none",
                      borderTop:
                        idx > 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                      px: 1.5,
                      py: 0.875,
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={primaryTextColor}
                      >
                        {displayName}
                      </Typography>
                      <Chip
                        label={chipLabel}
                        size="small"
                        sx={{
                          backgroundColor: chipColor,
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 20,
                          borderRadius: "4px",
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow sx={{ backgroundColor: "#fff" }}>
                  <TableCell className="cell-base label-cell">
                    {unitPriceColumnLabel}
                  </TableCell>
                  <TableCell className="cell-base value-cell">
                    {unitPrice}
                  </TableCell>
                  <TableCell className="cell-base label-cell">
                    {existingQuantityColumnLabel}
                  </TableCell>
                  <TableCell className="cell-base value-cell">
                    {quantity}
                  </TableCell>
                  <TableCell className="cell-base label-cell">
                    {billingPlanColumnLabel}
                  </TableCell>
                  <TableCell className="cell-base value-cell">
                    {billingPlan}
                  </TableCell>
                  <TableCell className="cell-base label-cell">
                    {billThroughDateColumnLabel}
                  </TableCell>
                  <TableCell className="cell-base value-cell">
                    {billThroughDate}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ),
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
