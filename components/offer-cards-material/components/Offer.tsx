import React from "react"
import { sanitiseHTML } from "@limio/sdk"
import { AddToBasketButton } from "./AddToBasketButton"
import { Card, CardContent, Typography, Box, Divider } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"

interface Attachment {
  type: string
  url: string
}

interface OfferAttributes {
  display_name__limio?: string
  display_price__limio?: string
  detailed_display_price__limio?: string
  offer_features__limio?: string
  best_value__limio?: boolean
  display_description__limio?: string
  cta_text__limio?: string
  [key: string]: unknown
}

interface OfferData {
  attachments?: Attachment[]
  attributes: OfferAttributes
}

interface Offer {
  path: string
  data: OfferData
}

interface OfferProps {
  offer: Offer
  showImage?: boolean
  offerWidth?: number
  primaryColor?: string
  freeTrialLink?: string
  pillTextColor?: string
  borderColor?: string
  textColor?: string
  cardBackground?: string
  ctaGradient?: string
  ctaGradientHover?: string
  ctaTextColor?: string
}

const Offer: React.FC<OfferProps> = ({
  offer,
  showImage,
  offerWidth = 30,
  primaryColor,
  freeTrialLink,
  pillTextColor,
  borderColor,
  textColor,
  cardBackground,
  ctaGradient,
  ctaGradientHover,
  ctaTextColor,
}: OfferProps) => {
  const attachments = offer.data.attachments?.filter((x) => x.type.includes("image")) || []
  const hasAttachments = attachments.length > 0

  const { display_name__limio, display_price__limio, detailed_display_price__limio, offer_features__limio, best_value__limio, display_description__limio } =
    offer.data.attributes

  const bestValueText = display_description__limio || "Most popular"

  const formatFeatures = () => {
    if (!offer_features__limio) return null
    if (typeof document === "undefined") return null

    const sanitized = sanitiseHTML(offer_features__limio)
    const container = document.createElement("div")
    container.innerHTML = sanitized

    const listItems = Array.from(container.querySelectorAll("li")).map((li, i) => (
      <Box
        component="li"
        key={i}
        display="flex"
        alignItems="flex-start"
        gap={1.5}
        sx={{
          fontSize: "14px",
          color: textColor,
          mb: 1.25,
          lineHeight: 1.6,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <CheckIcon sx={{ fontSize: 18, color: primaryColor, mt: "2px" }} />
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            color: textColor,
            fontWeight: 400,
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {li.innerText}
        </Typography>
      </Box>
    ))

    return (
      <>
        <Divider sx={{ my: 3, borderColor: borderColor, opacity: 0.3 }} />
        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
          {listItems}
        </Box>
      </>
    )
  }

  return (
    <Card
      sx={{
        position: "relative",
        backgroundColor: cardBackground,
        borderRadius: "12px",
        px: 3,
        pt: 7,
        pb: 4,
        mx: 1.5,
        my: 2,
        minWidth: `${offerWidth * 10}em`,
        maxWidth: `${offerWidth * 10}em`,
        ".offer-cards-material &": {
          border: best_value__limio ? `1.5px solid ${borderColor}` : "1px solid #EFEAE3",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Inter', sans-serif",
        boxShadow: "none"
      }}
    >
      {best_value__limio && (
        <Box
          sx={{
            position: "absolute",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: textColor,
            color: pillTextColor,
            fontSize: "12px",
            fontWeight: 700,
            px: 2.5,
            py: 0.5,
            borderRadius: "999px",
            fontFamily: "'Ginto', sans-serif",
            letterSpacing: 0.5,
            textTransform: "uppercase",
            boxShadow: "none"
          }}
        >
          {bestValueText}
        </Box>
      )}

      <CardContent sx={{ p: 0 }}>
        <Typography
          align="center"
          sx={{
            fontWeight: 700,
            fontSize: "17px",
            color: textColor,
            mb: 1,
            fontFamily: "'Ginto', sans-serif"
          }}
        >
          {display_name__limio}
        </Typography>

        <Box textAlign="center" mb={1.5}>
          <Typography
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: "26px",
              lineHeight: 1.2,
              color: textColor,
              fontFamily: "'Ginto', sans-serif",
              mb: 1
            }}
            dangerouslySetInnerHTML={{
              __html: sanitiseHTML(display_price__limio || "")
            }}
          />
          {detailed_display_price__limio && (
            <Typography
              variant="body2"
              sx={{
                color: textColor,
                opacity: 0.6,
                fontSize: "13px",
                fontWeight: 400,
                fontFamily: "'Inter', sans-serif"
              }}
              dangerouslySetInnerHTML={{
                __html: sanitiseHTML(detailed_display_price__limio)
              }}
            />
          )}
        </Box>

        {showImage && hasAttachments && (
          <Box display="flex" justifyContent="center" my={2}>
            <Box component="img" src={attachments[0]?.url} alt={display_name__limio || ""} sx={{ maxWidth: "60%", objectFit: "contain", borderRadius: 2 }} />
          </Box>
        )}

        <Box mt={4}>
          <AddToBasketButton
            offer={offer}
            ctaGradient={ctaGradient}
            ctaGradientHover={ctaGradientHover}
            ctaTextColor={ctaTextColor}
          />
        </Box>

        {freeTrialLink && (
          <Typography
            variant="caption"
            align="center"
            display="block"
            sx={{
              color: "#999",
              fontSize: "12px",
              mt: 2,
              fontFamily: "Inter, sans-serif"
            }}
            dangerouslySetInnerHTML={{
              __html: sanitiseHTML(freeTrialLink)
            }}
          />
        )}

        {formatFeatures()}
      </CardContent>
    </Card>
  )
}

export default Offer
