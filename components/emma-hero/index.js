import React from "react"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const EmmaHero = () => {
    const props = useStaticProps() || {}
    const {
        headline = "Flexible plans for teams of all sizes.",
        subheadline = "Prices starting at $99/month.",
        ctaText = "Request a demo",
        ctaLink = "/demo",
        showCta = true,
        primaryColor__limio_color = "#053A5E",
        backgroundColor__limio_color = "#ffffff",
    } = props

    return (
        <section
            className="eh-hero"
            style={{
                "--eh-primary": primaryColor__limio_color,
                "--eh-bg": backgroundColor__limio_color,
            }}
        >
            <div className="eh-container">
                <h1 className="eh-headline">{headline}</h1>
                <p className="eh-subheadline">{subheadline}</p>
                {showCta && (
                    <a href={ctaLink} className="eh-cta">
                        {ctaText}
                    </a>
                )}
            </div>
        </section>
    )
}

export default EmmaHero
