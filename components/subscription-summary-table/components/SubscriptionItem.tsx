import * as React from "react";
import { SubscriptionDetails } from "./SubscriptionDetails";
import { useComponentStaticProps } from "../componentStaticProps";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ExtensionIcon from "@mui/icons-material/Extension";
import CancelIcon from "@mui/icons-material/Cancel";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Box,
  Stack,
  Card,
  CardContent,
  Divider,
  Chip,
  Typography,
  Button,
} from "@mui/material";
import { checkActiveOffersAndAddOns, isOneTimePriceOffer } from "../helpers/OfferDetails";
import { CancellationNoticeModal } from "./CancellationNoticeModal";
import { useButtonActions } from "../helpers/ButtonActions";
import type { Subscription } from "@limio/types";
import "../styles/index.css";

type SubscriptionItemProps = {
  subscription: Subscription;
  onToast: (
    key: string,
    message: string,
    variant?: "success" | "error" | "warning" | "info",
  ) => void;
};

export function SubscriptionItem({
  subscription,
  onToast,
}: SubscriptionItemProps): React.JSX.Element {
  const {
    showNoticeModal,
    setShowNoticeModal,
    cancelError,
    isNavigating,
    handleCancelClick,
    handleUpdateClick,
    handleEditAddOnsClick,
  } = useButtonActions(subscription, onToast);

  const {
    subscriptionIdLabel,
    showCancelButton,
    cancelButtonText,
    requestCancellationLink,
    insufficientNoticeModalTitle,
    insufficientNoticeModalBody,
    insufficientNoticeConfirmText,
    insufficientNoticeCancelText,
    showCancellationModal,
    showUpdateButton,
    updateButtonText,
    showEditAddOnsButton,
    editAddOnsButtonText,
    renewalDateLabel,
    offerChipColor,
  } = useComponentStaticProps();

  const termEndDate =
    subscription?.data?.termEndDate || subscription?.termEndDate;

  const status = subscription?.status || "";

  const currentOffers = checkActiveOffersAndAddOns(subscription.offers);
  const currentAddOns = checkActiveOffersAndAddOns(subscription.addOns);
  const isOneTimeSubscription = currentOffers.length > 0 && currentOffers.every(isOneTimePriceOffer);

  return (
    <Card variant="outlined" sx={{ borderRadius: 1, p: 0.75, width: "100%" }}>
      {/* Card Header */}
      <Box
        sx={{
          px: 1.5,
          pt: 1.5,
          pb: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* Row 1: Sub ID (left) + chips stacked (far right) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {subscriptionIdLabel}
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              {subscription.name}
            </Typography>
          </Box>
          <Stack direction="column" alignItems="flex-end" spacing={0.5}>
            <Chip
              label={status}
              size="small"
              className={`status-chip ${status.toLowerCase() === "active" ? "status-chip-active" : "status-chip-cancelled"}`}
            />
            {termEndDate && !isOneTimeSubscription && (
              <Chip
                icon={
                  <CalendarTodayIcon
                    sx={{ color: "#fff !important", fontSize: "0.7rem" }}
                  />
                }
                label={`${renewalDateLabel}: ${new Date(termEndDate).toLocaleDateString()}`}
                size="small"
                sx={{
                  backgroundColor: offerChipColor,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  height: 28,
                  borderRadius: "4px",
                  px: 0.5,
                }}
              />
            )}
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ mx: 1 }} />

      <CardContent
        sx={{
          pt: 0.5,
          "&:last-child": { paddingBottom: "12px" },
          overflow: "hidden",
        }}
      >
        <SubscriptionDetails
          subscription={subscription}
          currentOffers={currentOffers}
          currentAddOns={currentAddOns}
        />
      </CardContent>

      <Divider sx={{ mx: 1 }} />

      {/* Bottom: Action buttons (right-aligned) */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="flex-end"
        sx={{ flexWrap: "wrap", px: 1.5, py: 1 }}
      >
        {showUpdateButton && !isOneTimeSubscription && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AutorenewIcon />}
            onClick={handleUpdateClick}
            disabled={isNavigating}
            className="btn-dark"
          >
            {updateButtonText}
          </Button>
        )}
        {showEditAddOnsButton && !isOneTimeSubscription && (
          <Button
            variant="contained"
            size="small"
            startIcon={<ExtensionIcon />}
            onClick={handleEditAddOnsClick}
            disabled={isNavigating}
            className="btn-dark"
          >
            {editAddOnsButtonText}
          </Button>
        )}
        {showCancelButton && !isOneTimeSubscription && (
          <>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CancelIcon />}
              onClick={handleCancelClick}
              className="btn-cancel"
            >
              {cancelButtonText}
            </Button>
            {cancelError && (
              <Typography variant="caption" color="error">
                {cancelError}
              </Typography>
            )}
            {showCancellationModal && (
              <CancellationNoticeModal
                open={showNoticeModal}
                onClose={() => setShowNoticeModal(false)}
                onConfirmRequest={() => {
                  window.location.href = `${requestCancellationLink}?subId=${encodeURIComponent(subscription.id)}`;
                }}
                modalTitle={insufficientNoticeModalTitle}
                modalBody={insufficientNoticeModalBody}
                confirmButtonText={insufficientNoticeConfirmText}
                cancelButtonText={insufficientNoticeCancelText}
              />
            )}
          </>
        )}
      </Stack>
    </Card>
  );
}
