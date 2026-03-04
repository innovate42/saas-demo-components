// @flow
import * as React from "react"
import { Suspense, useState } from "react"
import { useCampaign, useSubscriptions, useLimioContext } from "@limio/sdk"
import * as R from "ramda"
import { Container, Typography, Grid, Divider, Alert, Box, Stack, Paper } from "@mui/material"
import Select from "./components/Select"
import EditBasePlanBasket from "./components/EditBasePlanBasket"
import BillingPlan from "./components/BillingPlan"
import BillingFrequency from "./components/BillingFrequency"
import QuantityField from "./components/QuantityField"
import { PreviewProvider } from "@limio/ui-preview-context"
import { checkActiveSubscriptionOffer, groupPath } from "./components/helpers"
import PersonIcon from "@mui/icons-material/Person"
import ScheduleIcon from "@mui/icons-material/Schedule"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import "./index.css"

const themeStyles = {
  orange: {
    primary: "#E16A00",
    background: "#FEF1E9",
    cardBackground: "#FFFBF7",
    pillBackground: "#FBE9D8",
    pillText: "#B84C00",
    borderColor: "#EFEAE3",
    text: "#6B3E26",
    buttonHover: "rgba(225, 106, 0, 0.9)",
    cardShadow: "0px 4px 6px rgba(16, 24, 40, 0.08), 0px 2px 4px rgba(16, 24, 40, 0.06)"
  },
  blue: {
    primary: "#005C99",
    background: "#EAF3FB",
    cardBackground: "#F4F9FD",
    pillBackground: "#D0E7F8",
    pillText: "#004A80",
    borderColor: "#EFEAE3",
    text: "#003355",
    buttonHover: "rgba(0, 92, 153, 0.9)",
    cardShadow: "0px 4px 6px rgba(16, 24, 40, 0.08), 0px 2px 4px rgba(16, 24, 40, 0.06)"
  },
  red: {
    primary: "#C62828",
    background: "#FDECEA",
    cardBackground: "#FEF6F6",
    pillBackground: "#F9D3D3",
    pillText: "#8B0000",
    borderColor: "#EFEAE3",
    text: "#5C1C1C",
    buttonHover: "rgba(198, 40, 40, 0.9)",
    cardShadow: "0px 4px 6px rgba(16, 24, 40, 0.08), 0px 2px 4px rgba(16, 24, 40, 0.06)"
  },
  green: {
    primary: "#2E7D32",
    background: "#E7F5EC",
    cardBackground: "#F3FAF5",
    pillBackground: "#D2EBDD",
    pillText: "#1B5E20",
    borderColor: "#EFEAE3",
    text: "#1B3D1B",
    buttonHover: "rgba(46, 125, 50, 0.9)",
    cardShadow: "0px 4px 6px rgba(16, 24, 40, 0.08), 0px 2px 4px rgba(16, 24, 40, 0.06)"
  },
  black: {
    primary: "#333333",
    background: "#F6F6F6",
    cardBackground: "#FDFDFD",
    pillBackground: "#DCDCDC",
    pillText: "#111111",
    borderColor: "#EFEAE3",
    text: "#111111",
    buttonHover: "rgba(51, 51, 51, 0.9)",
    cardShadow: "0px 4px 6px rgba(16, 24, 40, 0.08), 0px 2px 4px rgba(16, 24, 40, 0.06)"
  },
  grey: {
    primary: "#6E6E6E",
    background: "#FAFAFA",
    cardBackground: "#FFFFFF",
    pillBackground: "#ECECEC",
    pillText: "#5C5C5C",
    borderColor: "#EFEAE3",
    text: "#3C3C3C",
    buttonHover: "rgba(110, 110, 110, 0.9)",
    cardShadow: "0px 4px 6px rgba(16, 24, 40, 0.08), 0px 2px 4px rgba(16, 24, 40, 0.06)"
  }
}

function mapTermObjectToDisplayStr(termObj: LimioTermObject): string {
  if (termObj === null) {
    return ""
  }
  const { length, type } = termObj
  if (type === "months") {
    return `${length} month${length > 1 ? "s" : ""}`
  }
  if (type === "years") {
    return `${length} year${length > 1 ? "s" : ""}`
  }
  return `${length} ${type}`
}

const stripPathToProductName = (path: string): string => {
  // "/products/Hero Plan" => "Hero Plan")
  if (typeof path !== "string") {
    return console.log(path, "is not a string")
  }
  return path.split("/").pop()
}

function EditBasePlan(props): React.Node {
  const themeColor = props.themeColor || "orange"
  const theme = themeStyles[themeColor]

  const { subscriptions } = useSubscriptions()
  const subId = new URLSearchParams(window.location.search).get("subId")
  const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0]

  console.log({ subscription, subscriptions })

  const { offers = [] } = useCampaign()
  const currentOffer = checkActiveSubscriptionOffer(subscription.offers)
  currentOffer.data.offer.id = currentOffer.data.offer.id?.replace("offer-", "") || ""
  const currentProduct = currentOffer?.data?.offer?.data?.productBundles?.[0]
  const offerGroups = R.groupBy(offer => groupPath(offer), offers)

  const [selectedProduct, setSelectedProduct] = useState(currentProduct?.product_path || Object.keys(offerGroups)?.[0])
  const [selectedBillingPlan, setSelectedBillingPlan] = useState(
    currentProduct?.rate_plan || offerGroups?.[selectedProduct]?.[0]?.data?.productBundles?.[0]?.rate_plan
  )
  const [selectedTerm, setSelectedTerm] = useState(
    currentOffer?.data?.offer?.data?.attributes?.term__limio || offerGroups?.[selectedProduct]?.[0]?.data?.attributes?.term__limio
  )
  const [selectedOffer, setSelectedOffer] = useState(currentOffer?.data?.offer?.id || offerGroups[selectedProduct]?.[0].id)
  const [quantity, setQuantity] = useState(currentOffer?.data?.quantity || 1)
  const [success, setSuccess] = useState(false)

  const billingPlan = currentOffer.data.offer.data.productBundles[0].rate_plan
  const termObject = currentOffer.data.offer.data.attributes.term__limio
  const term = mapTermObjectToDisplayStr(termObject)

  const baseProductWithPlanSuffix = stripPathToProductName(currentOffer.data.offer.data.products[0].path)
  const subName = currentOffer.data.name ?? baseProductWithPlanSuffix ?? "No name"

  const handleOfferSelection = (ratePlan, term) => {
    const offers = offerGroups[selectedProduct]
    const offer = offers.find(offer => R.equals(offer.data.attributes.term__limio, term) && ratePlan === offer.data.productBundles[0].rate_plan)
    if (offer) setSelectedOffer(offer.id)
  }

  const handleBaseProductChange = event => {
    const { value } = event.target
    setSelectedProduct(value)
    setSelectedOffer(offerGroups[value][0].id)
    setSelectedBillingPlan(offerGroups[value][0].data.productBundles[0].rate_plan)
    setSelectedTerm(offerGroups[value][0].data.attributes.term__limio)
  }

  const handleTermChange = term => {
    const options = offerGroups[selectedProduct].filter(offer => R.equals(offer.data.attributes.term__limio, term))
    setSelectedBillingPlan(options[0].data.productBundles[0].rate_plan)
    setSelectedTerm(term)
    handleOfferSelection(options[0].data.productBundles[0].rate_plan, term)
  }

  const handleFrequencyChange = ratePlan => {
    setSelectedBillingPlan(ratePlan)
    handleOfferSelection(ratePlan, selectedTerm)
  }

  const onSuccess = () => {
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)

      if (props.successLink) {
        window.location = props.successLink
      } else {
        window.location.reload()
      }
    }, 2000)
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewProvider>
        <Box sx={{ backgroundColor: "#fff", py: 6, fontFamily: "Inter, sans-serif" }}>
          <Container maxWidth="lg" sx={{ p: 3 }}>
            <Box
              sx={{
                p: 4,
                backgroundColor: theme.cardBackground,
                border: `1px solid ${theme.borderColor}`,
                boxShadow: theme.cardShadow,
                borderRadius: 2
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: theme.text }}>
                {props.titleText}
              </Typography>

              <Stack direction="row" spacing={2} mb={2}>
                <PersonIcon />
                <Typography variant="body2">
                  Subscription ID: <strong>{subscription.reference}</strong>
                </Typography>
                <Typography variant="body2">
                  Account #: <strong>{subscription?.zuoraAccount?.basicInfo?.accountNumber}</strong>
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} mb={3}>
                <CreditCardIcon />
                <Typography variant="body2">
                  Plan: <strong>{subName}</strong>
                </Typography>
                <Typography variant="body2">
                  Billing: <strong>{billingPlan}</strong>
                </Typography>
                <ScheduleIcon />
                <Typography variant="body2">
                  Frequency: <strong>{term}</strong>
                </Typography>
              </Stack>

              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Select
                    selectedProduct={selectedProduct}
                    handleBaseProductChange={handleBaseProductChange}
                    productSelectLabel={props.productSelectLabel}
                    theme={theme}
                  />
                  <Divider sx={{ my: 2, borderColor: theme.borderColor }} />
                  <BillingPlan
                    selectedTerm={selectedTerm}
                    selectedProduct={selectedProduct}
                    handleTermChange={handleTermChange}
                    billingTermSelectLabel={props.billingTermSelectLabel}
                    theme={theme}
                  />
                  <Divider sx={{ my: 2, borderColor: theme.borderColor }} />
                  <BillingFrequency
                    selectedBillingPlan={selectedBillingPlan}
                    selectedProduct={selectedProduct}
                    handleFrequencyChange={handleFrequencyChange}
                    selectedTerm={selectedTerm}
                    ratePlanSelectLabel={props.ratePlanSelectLabel}
                    theme={theme}
                  />
                  <Divider sx={{ my: 2, borderColor: theme.borderColor }} />
                  <QuantityField
                    quantity={quantity}
                    setQuantity={setQuantity}
                    onlyIncrease={props.onlyIncrease}
                    subQuantity={currentOffer?.data?.quantity || 1}
                    quantityFieldLabel={props.quantityFieldLabel}
                    theme={theme}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <EditBasePlanBasket
                    selectedOffer={selectedOffer}
                    quantity={quantity}
                    yourPlanTitle={props.yourPlanTitle}
                    toPayText={props.toPayText}
                    longTexts={props.longTexts}
                    continueButtonText={props.continueButtonText}
                    yourNewPlanCopy={props.yourNewPlanCopy}
                    yourOldPlanCopy={props.yourOldPlanCopy}
                    onSuccess={onSuccess}
                    themeColor={props.themeColor}
                    theme={theme}
                  />
                </Grid>
              </Grid>
              {success && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  Your plan has been successfully updated.
                </Alert>
              )}
            </Box>
          </Container>
        </Box>
      </PreviewProvider>
    </Suspense>
  )
}

export default EditBasePlan
