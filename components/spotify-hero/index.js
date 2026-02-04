import React from "react"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const SpotifyHero = () => {
    const props = useStaticProps() || {}

    const {
        headline = "Listen without limits",
        subheadline = "Try Premium free for 1 month, then just $10.99/month after. Cancel anytime.",
        ctaText = "Get Started",
        ctaUrl = "#offer",
        secondaryCtaText = "See all plans",
        secondaryCtaUrl = "#plans",
        showSecondaryCta = true,
        backgroundImageUrl = "",
        gradientStart__limio_color: gradientStart = "#1ED760",
        gradientEnd__limio_color: gradientEnd = "#121212",
        textColor__limio_color: textColor = "#FFFFFF",
        ctaBackgroundColor__limio_color: ctaBackgroundColor = "#FFFFFF",
        ctaTextColor__limio_color: ctaTextColor = "#000000"
    } = props

    const backgroundStyle = {
        background: `linear-gradient(180deg, ${gradientStart} 0%, ${gradientEnd} 100%)`
    }

    return (
        <section className="spotify-hero" style={backgroundStyle}>
            {backgroundImageUrl && (
                <img
                    src={backgroundImageUrl}
                    alt=""
                    className="spotify-hero__bg-image"
                />
            )}

            <div className="spotify-hero__content">
                <h1 className="spotify-hero__headline" style={{ color: textColor }}>
                    {headline}
                </h1>

                <p className="spotify-hero__subheadline" style={{ color: textColor }}>
                    {subheadline}
                </p>

                <div className="spotify-hero__ctas">
                    <a
                        href={ctaUrl}
                        className="spotify-hero__cta"
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
                            className="spotify-hero__cta spotify-hero__cta--secondary"
                            style={{ color: textColor }}
                        >
                            {secondaryCtaText}
                        </a>
                    )}
                </div>

                <p className="spotify-hero__terms" style={{ color: textColor }}>
                    Terms and conditions apply. Open only to users who haven't already tried Premium.
                </p>
            </div>
        </section>
    )
}

export default SpotifyHero
