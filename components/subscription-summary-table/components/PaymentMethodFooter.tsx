import * as React from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "@limio/sdk";
import * as checkoutSdk from "@limio/internal-checkout-sdk";
import { Stack, Typography, Button } from "../mui";
import { ReceiptIcon, CreditCardIcon } from "../mui-icons";
import { getPaymentMethodInfo } from "../helpers/PaymentMethod";
import type { PaymentMethodRecord } from "../helpers/PaymentMethod";
import "../styles/index.css";

type PaymentMethodsResult = { payment_methods?: PaymentMethodRecord[] };

/**
 * Payment methods live on @limio/internal-checkout-sdk (not @limio/sdk) — the
 * same import the shop's payments table uses.
 *
 * Resolved once at module scope so the hook identity is stable across renders,
 * and falls back to an empty result rather than throwing if the export moves.
 * The fallback warns, so a hidden payment method is diagnosable from the console
 * instead of looking like "no payment method on this subscription".
 */
const useSubscriptionPaymentMethods: (subscriptionId: string) => PaymentMethodsResult =
  (checkoutSdk as unknown as Record<string, any>).useLimioUserSubscriptionPaymentMethods ??
  (() => {
    console.warn(
      "[subscription-summary-table] useLimioUserSubscriptionPaymentMethods not found on @limio/internal-checkout-sdk — payment method hidden",
    );
    return {};
  });

type Props = {
  subscriptionId: string;
  label: string;
  showPayInvoiceButton: boolean;
  payInvoiceButtonText: string;
  payInvoiceLink: string;
};

function PaymentMethodContent({
  subscriptionId,
  label,
  showPayInvoiceButton,
  payInvoiceButtonText,
  payInvoiceLink,
}: Props): React.JSX.Element | null {
  const { payment_methods: paymentMethods } =
    useSubscriptionPaymentMethods(subscriptionId) ?? {};

  const paymentMethod = getPaymentMethodInfo(paymentMethods);

  // Nothing to describe: render nothing rather than guess at a payment state.
  if (!paymentMethod) {
    console.debug(
      "[subscription-summary-table] no payment method for",
      subscriptionId,
      paymentMethods,
    );
    return null;
  }

  const showPayInvoice = Boolean(
    paymentMethod.isInvoice && showPayInvoiceButton && payInvoiceLink,
  );

  return (
    <>
      <Typography variant="body2" className="payment-method-text">
        {paymentMethod.isInvoice ? (
          <ReceiptIcon fontSize="small" />
        ) : (
          <CreditCardIcon fontSize="small" />
        )}
        <span className="payment-method-label">{label}:</span>
        <span className="payment-method-value">{paymentMethod.label}</span>
      </Typography>
      {showPayInvoice && (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            window.location.href = payInvoiceLink;
          }}
          className="btn-pay-invoice"
        >
          {payInvoiceButtonText}
        </Button>
      )}
    </>
  );
}

/**
 * The payment method comes from its own SDK call, so it gets its own Suspense and
 * error boundary: a slow or failed lookup leaves the rest of the card intact.
 */
export function PaymentMethodFooter(props: Props): React.JSX.Element {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      className="payment-method-summary"
    >
      <ErrorBoundary ErrorUI={() => null}>
        <Suspense fallback={null}>
          <PaymentMethodContent {...props} />
        </Suspense>
      </ErrorBoundary>
    </Stack>
  );
}
