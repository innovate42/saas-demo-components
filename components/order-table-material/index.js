import * as React from "react"
import { useState } from "react"
import { ErrorBoundary } from "@limio/sdk"
import { Error } from "./helpers/Error.js"
import { Subscriptions } from "./components/Subscriptions.js"
import { Box, Typography, Button, Snackbar, Container, Stack, Paper } from "@mui/material"
import { Alert } from "@limio/design-system"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import ViewListIcon from "@mui/icons-material/ViewList"
import { useSubscriptions } from "@limio/sdk"

export function OrdersTable(props) {
  const {
    notFoundText__limio_richtext,
    showNewSubscriptionButton,
    newSubscriptionLink,
    newSubscriptionHeading,
    showGoBackButton,
    goBackLink,
    goBackHeading,
    subscriptionsHeading,
    subscriptionsSubheading,
    componentId
  } = props

  const [toasts, setToasts] = useState({})
  let params = new URL(window.location).searchParams
  const ownerId = params.get("ownerId")
  const subRef = params.get("subRef")
  const { subscriptions: allSubscriptions = [] } = useSubscriptions({ ownerId })
  const subscriptions = subRef ? allSubscriptions.filter((subscription) => subscription.name === subRef) : allSubscriptions

  return (
    <Box sx={{ backgroundColor: "#fcf6fe", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg" id={componentId}>
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <ErrorBoundary fallback={<Error text={notFoundText__limio_richtext} />}>
            {/* Toasts */}
            <Box sx={{ position: "relative", zIndex: 10 }}>
              {Object.keys(toasts).map((notification) => {
                const { show, message, variant = "success" } = toasts[notification]
                return (
                  <Snackbar
                    key={notification}
                    open={show}
                    autoHideDuration={6000}
                    onClose={() =>
                      setToasts({
                        ...toasts,
                        [notification]: {
                          ...toasts[notification],
                          show: false
                        }
                      })
                    }
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <Alert severity={variant}>{message}</Alert>
                  </Snackbar>
                )
              })}
            </Box>

            {/* Back & Header */}
            {showGoBackButton && (
              <Box sx={{ mb: 3 }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => (window.location.href = goBackLink)}>
                  {goBackHeading}
                </Button>
              </Box>
            )}

            {/* Page Header */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3} justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <ViewListIcon fontSize="large" />
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {subscriptionsHeading}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {subscriptionsSubheading}
                  </Typography>
                </Box>
              </Stack>
              {showNewSubscriptionButton && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => (window.location.href = newSubscriptionLink)}>
                  {newSubscriptionHeading}
                </Button>
              )}
            </Stack>

            {/* Subscriptions */}
            <Subscriptions updateNotification={(notification) => setToasts({ ...toasts, ...notification })} subscriptions={subscriptions} propsObject={props} />
          </ErrorBoundary>
        </Paper>
      </Container>
    </Box>
  )
}
//test comment

export default OrdersTable
