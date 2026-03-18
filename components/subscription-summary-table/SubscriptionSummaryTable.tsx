import * as React from "react"
import { useState, Suspense } from "react"
import { Subscriptions } from "./components/Subscriptions"
import { useSubscriptions } from "@limio/sdk"
import { ErrorBoundary } from "@limio/sdk"
import { ErrorMessage } from "./helpers/ErrorMessage"
import { useComponentStaticProps } from "./componentStaticProps"
import { Box, Snackbar, Alert, Container, createTheme, ThemeProvider } from "@mui/material"
import ErrorIcon from "@mui/icons-material/Error"
import "./styles/index.css"

const theme = createTheme({
  typography: {
    fontFamily: "'Open Sans', sans-serif"
  },
  spacing: 16
})

type Toast = { show: boolean; message: string; variant?: "success" | "error" | "warning" | "info" }

type Props = {
  notFoundText__limio_richtext: string
  componentId: string
}

type SubscriptionContentProps = {
  ownerId: string | null
  subRef: string | null
  notFoundText: string
  onToast: (key: string, message: string, variant?: "success" | "error" | "warning" | "info") => void
}

function SubscriptionContent({ ownerId, subRef, notFoundText, onToast }: SubscriptionContentProps): React.JSX.Element {
  const { subscriptions: allSubscriptions } = useSubscriptions({ ownerId })
  const subscriptions = subRef ? allSubscriptions.filter((sub: { name?: string }) => sub.name === subRef) : allSubscriptions

  if (subscriptions.length < 1) {
    return <ErrorMessage text={notFoundText} icon={<ErrorIcon style={{ height: "50px", width: "50px" }} />} />
  }

  return <Subscriptions subscriptions={subscriptions} onToast={onToast} />
}

export function SubscriptionSummaryTable({ componentId, notFoundText__limio_richtext }: Props): React.JSX.Element {
  const [toasts, setToasts] = useState<Record<string, Toast>>({})
  const { offerChipColor } = useComponentStaticProps()

  const showToast = (key: string, message: string, variant: "success" | "error" | "warning" | "info" = "error") =>
    setToasts(prev => ({ ...prev, [key]: { show: true, message, variant } }))

  const params = new URLSearchParams(window.location.search)
  const ownerId = params.get("ownerId")
  const subRef = params.get("subRef")

  return (
    <ThemeProvider theme={theme}>
      <Box className="subscription-summary" style={{ "--accent-color": offerChipColor } as React.CSSProperties} sx={{ backgroundColor: "#fff", pt: 2, pb: 6 }}>
        <Container sx={{ width: { lg: "1050px" } }} id={componentId}>
          <ErrorBoundary ErrorUI={() => <ErrorMessage text={notFoundText__limio_richtext} icon={<ErrorIcon style={{ height: "50px", width: "50px" }} />} />}>
            <Suspense fallback={<SubscriptionSummaryTable.Skeleton />}>
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
                        setToasts(prev => ({
                          ...prev,
                          [notification]: { ...prev[notification], show: false }
                        }))
                      }
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                      <Alert severity={variant}>{message}</Alert>
                    </Snackbar>
                  )
                })}
              </Box>

              {/* Subscriptions */}
              <SubscriptionContent ownerId={ownerId} subRef={subRef} notFoundText={notFoundText__limio_richtext} onToast={showToast} />
            </Suspense>
          </ErrorBoundary>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

SubscriptionSummaryTable.Skeleton = () => (
  <ThemeProvider theme={theme}>
    <Box
      sx={{
        backgroundColor: "#fff",
        pt: 2,
        pb: 6,
        mx: "auto"
      }}
    >
      <Subscriptions.Skeleton />
    </Box>
  </ThemeProvider>
)

export default SubscriptionSummaryTable
