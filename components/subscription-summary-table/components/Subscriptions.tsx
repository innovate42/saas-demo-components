import React from "react"
import { useState } from "react"
import { SubscriptionItem } from "./SubscriptionItem"
import { useComponentStaticProps } from "../componentStaticProps"
import { Box, Typography, Stack, Chip, TextField, MenuItem, Button, Skeleton } from "@mui/material"
import TableRowsIcon from "@mui/icons-material/TableRows"
import AddIcon from "@mui/icons-material/Add"
import type { Subscription } from "@limio/types"
import "../styles/index.css"

type SubscriptionsProps = {
  subscriptions: Subscription[]
  onToast: (key: string, message: string, variant?: "success" | "error" | "warning" | "info") => void
}

export function Subscriptions({ subscriptions, onToast }: SubscriptionsProps) {
  const [statusFilter, setStatusFilter] = useState("all")

  const { pageTitle, pageSubtitle, showAddNewSubscriptionButton, addNewSubscriptionButtonText, addNewSubscriptionLink } = useComponentStaticProps()

  const filteredSubscriptions =
    subscriptions?.filter((sub) => {
      if (statusFilter === "all") return true
      return sub?.status?.toLowerCase() === statusFilter
    }) ?? []

  return (
    <Box>
      {/* Page Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <TableRowsIcon sx={{ color: "#2D3135" }} />
            <Typography variant="h4" fontWeight={600} color="#2D3135">
              {pageTitle}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {pageSubtitle}
          </Typography>
        </Box>

        {/* Add New Subscription button */}
        {showAddNewSubscriptionButton && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="btn-dark"
            onClick={() => {
              window.location.href = addNewSubscriptionLink
            }}
          >
            {addNewSubscriptionButtonText}
          </Button>
        )}
      </Stack>

      {/* Filter Bar */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems="center">
        <Chip label={`Total Subscriptions: ${subscriptions?.length ?? 0}`} color="default" />
        <TextField size="small" select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>
      </Stack>

      {/* Subscription Cards */}
      <Stack spacing={2}>
        {filteredSubscriptions.map((subscription) => (
          <SubscriptionItem key={subscription.id} subscription={subscription} onToast={onToast} />
        ))}
      </Stack>
    </Box>
  )
}

Subscriptions.Skeleton = () => <Skeleton variant="rounded" width="100%" height={232} />
