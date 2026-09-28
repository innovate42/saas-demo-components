import React, { useEffect, useMemo, useState } from "react"
import { useCampaign } from "@limio/sdk"
import OfferCard from "./components/Offer"
import { Button, Box } from "@mui/material"
import { groupOffers } from "./helpers"

interface GroupLabel {
  id: string
  label: string
  thumbnail?: string
}

interface OfferGroup {
  groupId: string
  id: string
  label: string
  offers: OfferItem[]
  thumbnail?: string
}

interface OfferItem {
  path: string
  data: {
    attributes: {
      group__limio?: string
      best_value__limio?: boolean
      [key: string]: unknown
    }
  }
}

interface OfferCardsProps {
  heading: string
  subheading: string
  offerWidth: number
  componentId: string
  showImage: boolean
  groupLabels: GroupLabel[]
  showGroupedOffers: boolean
  freeTrialLink: string
  offers?: OfferItem[]
  primaryColor?: string
  accentColor?: string
  backgroundColor?: string
  cardBackgroundColor?: string
  ctaGradient?: string
  ctaGradientHover?: string
}

export const OfferCards: React.FC<OfferCardsProps> = (props: OfferCardsProps) => {
  const {
    heading,
    subheading,
    showImage,
    componentId,
    offerWidth,
    groupLabels,
    showGroupedOffers,
    freeTrialLink,
    offers: offersProp,
    primaryColor,
    accentColor,
    backgroundColor,
    cardBackgroundColor,
    ctaGradient,
    ctaGradientHover
  } = props

  const campaignData = useCampaign()
  const offers = offersProp ?? campaignData.offers

  const offerGroups = useMemo(() => {
    return groupOffers(offers, groupLabels).filter((group): group is OfferGroup => group !== undefined)
  }, [offers, groupLabels])

  const [selectedGroup, setSelectedGroup] = useState<string | undefined>()
  const selectedGroupItem = offerGroups.find((offerGroup) => offerGroup.id === selectedGroup)
  const selectedGroupOffers = selectedGroupItem?.offers || []

  const hasBestValue = selectedGroupOffers.some((offer) => offer.data.attributes.best_value__limio)

  useEffect(() => {
    if (!selectedGroup || !offerGroups.find((g: OfferGroup) => g.id === selectedGroup)) {
      setSelectedGroup(offerGroups[0]?.id)
    }
  }, [offerGroups, selectedGroup])

  useEffect(() => {
    typeof performance !== "undefined" && performance?.mark?.("offers-init")
  }, [])

  return (
    <section id={componentId} className="offer-cards-material" style={{ backgroundColor }}>
      <Box
        sx={{
          py: { xs: 8, lg: 16 },
          px: { xs: 4, lg: 6 },
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Box sx={{ textAlign: "center", mx: "auto", mb: 8 }}>
          <Box
            component="h2"
            sx={{
              fontSize: "2.25rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              color: primaryColor,
              mb: 2,
              fontFamily: "'Ginto', sans-serif",
            }}
          >
            {heading}
          </Box>
          <Box
            component="p"
            sx={{
              fontSize: "1.125rem",
              fontWeight: 400,
              color: primaryColor,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6,
              opacity: 0.8
            }}
          >
            {subheading}
          </Box>
        </Box>

        {showGroupedOffers ? (
          <>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9999px",
                backgroundColor: cardBackgroundColor,
                border: `1px solid ${primaryColor}`,
                boxShadow: "0 1px 5px rgba(0, 0, 0, 0.05)",
                p: 0.5,
                mb: hasBestValue ? "60px" : 4,
                mx: "auto"
              }}
            >
              {offerGroups.map((offerGroup: OfferGroup, i: number) => {
                const selected = selectedGroup === offerGroup.id
                return (
                  <Button
                    key={`${offerGroup.id}-${i}`}
                    onClick={() => setSelectedGroup(offerGroup.id)}
                    sx={{
                      ".offer-cards-material &": {
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        verticalAlign: "middle",
                        textAlign: "center",
                        lineHeight: "1.75",
                        userSelect: "none",
                        cursor: "pointer",
                        boxSizing: "border-box",
                        outline: "none",
                        transition: "background-color 250ms, box-shadow 250ms, border-color 250ms, color 250ms",
                        WebkitTapHighlightColor: "transparent",
                        textTransform: "none",
                        fontSize: "14px",
                        fontWeight: 600,
                        borderRadius: "9999px",
                        padding: "10px 24px",
                        minWidth: "auto",
                        backgroundColor: selected ? primaryColor : cardBackgroundColor,
                        color: selected ? accentColor : primaryColor,
                        border: selected ? `1.5px solid ${primaryColor}` : "1px solid transparent",
                        fontFamily: "'Inter', sans-serif",
                        "&:hover": {
                          backgroundColor: selected ? cardBackgroundColor : "#F3F3F3",
                          color: primaryColor,
                          borderColor: primaryColor
                        }
                      }
                    }}
                  >
                    {offerGroup.label}
                  </Button>
                )
              })}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1rem",
                width: "100%",
                margin: "0 auto"
              }}
            >
              {selectedGroupOffers.length > 0 ? (
                selectedGroupOffers.map((offer: OfferItem, i: number) => (
                  <OfferCard
                    key={`${offer.path}/parent-${i}`}
                    offer={offer}
                    showImage={showImage}
                    offerWidth={offerWidth}
                    primaryColor={primaryColor}
                    freeTrialLink={freeTrialLink}
                    pillTextColor={accentColor}
                    borderColor={primaryColor}
                    textColor={primaryColor}
                    cardBackground={cardBackgroundColor}
                    ctaGradient={ctaGradient}
                    ctaGradientHover={ctaGradientHover}
                    ctaTextColor={primaryColor}
                  />
                ))
              ) : (
                <p>No offers to display...Please add a label to view offers</p>
              )}
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem",
              width: "100%",
              margin: "0 auto"
            }}
          >
            {offers.length > 0 ? (
              offers.map((offer: OfferItem, i: number) => (
                <OfferCard
                  key={`${offer.path}/parent-${i}`}
                  offer={offer}
                  showImage={showImage}
                  offerWidth={offerWidth}
                  primaryColor={primaryColor}
                  freeTrialLink={freeTrialLink}
                  pillTextColor={accentColor}
                  borderColor={primaryColor}
                  textColor={primaryColor}
                  cardBackground={cardBackgroundColor}
                  ctaGradient={ctaGradient}
                  ctaGradientHover={ctaGradientHover}
                  ctaTextColor={primaryColor}
                />
              ))
            ) : (
              <p>No offers to display...</p>
            )}
          </Box>
        )}
      </Box>
    </section>
  )
}

export default OfferCards
