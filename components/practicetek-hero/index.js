import React from "react"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const sanitizeString = (str) => xss(str || "")

const PracticeTekHero = () => {
    const props = useStaticProps() || {}

    const {
        headline = "Revolutionizing healthcare practices effortlessly.",
        subheadline__limio_richtext: subheadline = "<p>We empower healthcare professionals with innovative software solutions.</p>",
        ctaText = "Get in Touch",
        ctaUrl = "/contact",
        secondaryCtaText = "Learn More",
        secondaryCtaUrl = "/about",
        showSecondaryCta = true,
        backgroundImageUrl = "",
        backgroundColor__limio_color: backgroundColor = "#FFFFFF",
        headlineColor__limio_color: headlineColor = "#1A1A2E",
        textColor__limio_color: textColor = "#4A4A5A",
        ctaBackgroundColor__limio_color: ctaBackgroundColor = "#1A1A2E",
        ctaTextColor__limio_color: ctaTextColor = "#FFFFFF",
        layout = "centered",
        heroImageUrl = "",
        partnerLogos = [],
        showPartnerLogos = false
    } = props

    const heroClasses = [
        "practicetek-hero",
        `practicetek-hero--${layout}`
    ].join(" ")

    const heroStyle = {
        backgroundColor,
        ...(backgroundImageUrl && { backgroundImage: `url(${backgroundImageUrl})` })
    }

    return (
        <section className={heroClasses} style={heroStyle}>
            <div className="practicetek-hero__container">
                <div className="practicetek-hero__content">
                    <h1
                        className="practicetek-hero__headline"
                        style={{ color: headlineColor }}
                    >
                        {headline}
                    </h1>

                    <div
                        className="practicetek-hero__subheadline"
                        style={{ color: textColor }}
                        dangerouslySetInnerHTML={{ __html: sanitizeString(subheadline) }}
                    />

                    <div className="practicetek-hero__ctas">
                        <a
                            href={ctaUrl}
                            className="practicetek-hero__cta"
                            style={{
                                backgroundColor: ctaBackgroundColor,
                                color: ctaTextColor
                            }}
                        >
                            {ctaText}
                        </a>

                        {showSecondaryCta && (
                            <a
                                href={secondaryCtaUrl}
                                className="practicetek-hero__cta practicetek-hero__cta--secondary"
                                style={{ color: headlineColor }}
                            >
                                {secondaryCtaText}
                            </a>
                        )}
                    </div>
                </div>

                {layout === "split" && heroImageUrl && (
                    <div className="practicetek-hero__image-container">
                        <img
                            src={heroImageUrl}
                            alt=""
                            className="practicetek-hero__image"
                        />
                    </div>
                )}
            </div>

            {showPartnerLogos && partnerLogos.length > 0 && (
                <div className="practicetek-hero__partners">
                    <div className="practicetek-hero__container">
                        <p className="practicetek-hero__partners-label" style={{ color: textColor }}>
                            Trusted by leading healthcare brands
                        </p>
                        <div className="practicetek-hero__partners-grid">
                            {partnerLogos.map((partner, index) => (
                                <img
                                    key={partner.id || index}
                                    src={partner.logoUrl}
                                    alt={partner.name || "Partner logo"}
                                    className="practicetek-hero__partner-logo"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default PracticeTekHero