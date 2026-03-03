import React from "react"
import { sanitiseHTML, useLimioContext } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const CTABanner = () => {
  const props = useStaticProps() || {}
  const {
    headline,
    "description__limio_richtext": descriptionHtml,
    ctaText,
    ctaUrl,
    backgroundColor__limio_color: bgColor,
    textColor__limio_color: textColor,
    ctaBackgroundColor__limio_color: ctaBgColor,
    ctaTextColor__limio_color: ctaTextColor,
    layout,
    componentId,
  } = props

  const { isInPageBuilder } = useLimioContext() || {}

  const layoutClass = `cta-banner cta-banner--${layout || "center"}`

  return (
    <section
      id={componentId}
      className={layoutClass}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="cta-banner__inner">
        <div className="cta-banner__content">
          {headline && (
            <h2 className="cta-banner__headline">{sanitiseHTML(headline)}</h2>
          )}
          {descriptionHtml && (
            <div
              className="cta-banner__description"
              dangerouslySetInnerHTML={{ __html: sanitiseHTML(descriptionHtml) }}
            />
          )}
        </div>
        {ctaText && ctaUrl && (
          <a
            className="cta-banner__cta"
            href={ctaUrl}
            style={{ backgroundColor: ctaBgColor, color: ctaTextColor }}
          >
            {sanitiseHTML(ctaText)}
          </a>
        )}
      </div>
    </section>
  )
}

export default CTABanner
