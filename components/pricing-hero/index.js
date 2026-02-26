import React from "react"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const sanitize = (str) => xss(str || "")

const PricingHero = () => {
  const {
    headline,
    subheadline,
    backgroundColor__limio_color: bgColor,
    textColor__limio_color: textColor,
    componentId,
  } = useStaticProps()

  return (
    <section
      id={componentId}
      className="pricing-hero"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <h1 className="pricing-hero__headline">{sanitize(headline)}</h1>
      <p className="pricing-hero__subheadline">{sanitize(subheadline)}</p>
    </section>
  )
}

export default PricingHero
