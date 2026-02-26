import React from "react"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const sanitize = (str) => xss(str || "")

const CTABanner = () => {
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
  } = useStaticProps()

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
            <h2 className="cta-banner__headline">{sanitize(headline)}</h2>
          )}
          {descriptionHtml && (
            <div
              className="cta-banner__description"
              dangerouslySetInnerHTML={{ __html: sanitize(descriptionHtml) }}
            />
          )}
        </div>
        {ctaText && ctaUrl && (
          <a
            className="cta-banner__cta"
            href={ctaUrl}
            style={{ backgroundColor: ctaBgColor, color: ctaTextColor }}
          >
            {sanitize(ctaText)}
          </a>
        )}
      </div>
    </section>
  )
}

export default CTABanner
