import React from "react"
import { sanitiseHTML, useLimioContext } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const PricingHero = () => {
  const props = useStaticProps() || {}
  const {
    headline,
    subheadline,
    backgroundColor__limio_color: bgColor,
    textColor__limio_color: textColor,
    componentId,
  } = props

  const { isInPageBuilder } = useLimioContext() || {}

  return (
    <section
      id={componentId}
      className="pricing-hero"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {headline && <h1 className="pricing-hero__headline">{sanitiseHTML(headline)}</h1>}
      {subheadline && <p className="pricing-hero__subheadline">{sanitiseHTML(subheadline)}</p>}
    </section>
  )
}

export default PricingHero
