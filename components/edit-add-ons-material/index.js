// @flow
import * as React from "react"
import StaticSection from "./components/StaticSection"
import CustomiseAddOns from "./components/CustomiseAddOns"
import EditAddOnsBasket from "./components/EditAddOnsBasket"
import { DateTime } from "@limio/date"
import { useCampaign, useSubscriptions } from "@limio/sdk"
import { PreviewProvider } from "@limio/ui-preview-context"
import {
  findNextScheduleDate,
  mapTermObjectToDisplayStr,
  stripPathToProductName
} from "./components/helpers"
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
  Stack
} from "@mui/material"
import PersonIcon from '@mui/icons-material/Person'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CreditCardIcon from '@mui/icons-material/CreditCard'

import "./index.css"

const themeStylesOptions = {
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
};

type Props = {
  onlyShowPurchase: boolean,
  title: string,
  cantFindCopy: string,
  basketPayText: string,
  longTexts: string,
  continueWord: string,
  successLink: string,
  themeColor?: string
}

function EditAddOns({
                      onlyShowPurchase,
                      title,
                      customiseAddOnTitle,
                      cantFindCopy,
                      basketPayText,
                      longTexts,
                      continueWord,
                      successLink,
                      themeColor = "orange"
                    }: Props): React.Node {
  const [updates, setUpdates] = React.useState([])
  const { addOns } = useCampaign()
  const { subscriptions } = useSubscriptions()

  const subId = new URLSearchParams(window.location.search).get("subId")
  const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0]
  const themeStyles = themeStylesOptions[themeColor] || themeStylesOptions.orange

  const activeOffer = subscription.offers.find(
      offer => offer.data.end === undefined || offer.data.end > DateTime.local().toISODate()
  )
  const billingPlan = activeOffer.data.offer.data.productBundles[0].rate_plan
  const termObject = activeOffer.data.offer.data.attributes.term__limio
  const term = mapTermObjectToDisplayStr(termObject)

  const baseProductWithPlanSuffix = stripPathToProductName(activeOffer.data.offer.data.products[0].path)
  const baseProduct = baseProductWithPlanSuffix.split(" ")[0]
  const subName = activeOffer.data.name ?? baseProductWithPlanSuffix ?? "No name"
  const nextScheduleDate = React.useMemo(
      () => findNextScheduleDate(subscription.schedule),
      [subscription.schedule]
  )

  const handleAdd = addOn => {
    setUpdates([...updates, {
      type: "add",
      quantity: 1,
      id: addOn.id,
      version: addOn.version,
      effective_date: DateTime.local().toISODate(),
      record_type: "add_on"
    }])
  }

  const handleRemove = addOn => {
    setUpdates([...updates, {
      type: "remove",
      quantity: 1,
      id: addOn.id,
      effective_date: nextScheduleDate,
      record_type: "add_on"
    }])
  }

  const handleFilter = event => {
    setUpdates(updates.filter(update => update.id !== event.target.id))
  }

  const handleQuantityChange = event => {
    const existing = updates.find(update => update.id === event.target.id)
    const value = event.target.value

    if (!existing) {
      const addOnIds = addOns.map(addOn => addOn.id)
      const isAdd = addOnIds.includes(event.target.id)
      setUpdates([
        ...updates,
        {
          type: isAdd ? "add" : "update",
          quantity: value,
          id: event.target.id,
          effective_date: DateTime.local().toISODate(),
          record_type: "add_on",
          version: event.currentTarget.dataset.version
        }
      ])
      return
    }

    if (value === event.currentTarget.dataset.original) {
      setUpdates(updates.filter(update => update.id !== event.target.id))
      return
    }

    setUpdates(updates.map(update =>
        update.id === event.target.id ? { ...update, quantity: value } : update
    ))
  }

  return (
      <PreviewProvider>
        <Box sx={{ backgroundColor: "#fff", py: 4 }}>
          <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, backgroundColor: themeStyles.cardBackground, border: `1px solid ${themeStyles.borderColor}`, boxShadow: themeStyles.cardShadow, borderRadius: 2 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: themeStyles.text }}>
                {title}
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

              <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                  <CustomiseAddOns
                      cantFindCopy={cantFindCopy}
                      customiseAddOnTitle={customiseAddOnTitle}
                      onlyShowPurchase={onlyShowPurchase}
                      updates={updates}
                      handleRemove={handleRemove}
                      handleAdd={handleAdd}
                      handleFilter={handleFilter}
                      billingPlan={billingPlan}
                      handleQuantityChange={handleQuantityChange}
                      baseProduct={baseProduct}
                      themeStyles={themeStyles}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <EditAddOnsBasket
                      updates={updates}
                      basketPayText={basketPayText}
                      longTexts={longTexts}
                      continueWord={continueWord}
                      successLink={successLink}
                      themeStyles={themeStyles}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </PreviewProvider>
  )
}

export default EditAddOns
