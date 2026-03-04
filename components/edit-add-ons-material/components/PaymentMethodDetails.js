// @flow
import React from "react";
import { useLimioUserSubscriptionPaymentMethods } from "@limio/internal-checkout-sdk";
import { useSubscriptions } from "@limio/sdk";
import * as R from "ramda";
import { Box, Typography, Stack } from "@mui/material";
import { CreditCard } from "@mui/icons-material"; // Or use FontAwesome icons if preferred

function PaymentMethodDetails(): React.Node {
  const { subscriptions = [] } = useSubscriptions();
  const subId = new URLSearchParams(window.location.search).get("subId");
  const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0];
  const { payment_methods } = useLimioUserSubscriptionPaymentMethods(subscription.id);

  if (!payment_methods || !payment_methods.length) return null;

  const activePaymentMethods = payment_methods.filter(pm => pm.status === "active");
  if (!activePaymentMethods.length) return null;

  const [activePaymentMethod] = activePaymentMethods.sort(
      (a, b) => new Date(b.start) - new Date(a.start)
  );

  const type = activePaymentMethod.type;
  const data = R.path(["data", type, "result"], activePaymentMethod);
  const { CreditCardMaskNumber: mask, CreditCardType = "Card" } = data;

  return (
      <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "#fff",
            border: "1px solid #E0E0E0",
            borderRadius: 2,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            fontFamily: "Inter, sans-serif"
          }}
      >
        <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "#333",
              fontSize: "0.875rem",
              mb: 1
            }}
        >
          Payment Method
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <CreditCard sx={{ fontSize: 20, color: "#666" }} />
          <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#444" }}>
            Charge to your {CreditCardType} <strong>({mask})</strong>
          </Typography>
        </Stack>
      </Box>
  );
}

export default PaymentMethodDetails;
