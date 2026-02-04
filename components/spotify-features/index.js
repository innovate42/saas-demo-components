import React from "react"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const FeatureIcon = ({ icon, color }) => {
    const icons = {
        ads: (
            <svg viewBox="0 0 24 24" fill={color}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                <line x1="4" y1="4" x2="20" y2="20" stroke={color} strokeWidth="2"/>
            </svg>
        ),
        offline: (
            <svg viewBox="0 0 24 24" fill={color}>
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
            </svg>
        ),
        shuffle: (
            <svg viewBox="0 0 24 24" fill={color}>
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
        ),
        quality: (
            <svg viewBox="0 0 24 24" fill={color}>
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
        ),
        download: (
            <svg viewBox="0 0 24 24" fill={color}>
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
        ),
        devices: (
            <svg viewBox="0 0 24 24" fill={color}>
                <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"/>
            </svg>
        )
    }

    return (
        <div className="spotify-features__icon">
            {icons[icon] || icons.quality}
        </div>
    )
}

const SpotifyFeatures = () => {
    const props = useStaticProps() || {}

    const {
        headline = "Why go Premium?",
        subheadline = "",
        features = [],
        backgroundColor__limio_color: backgroundColor = "#121212",
        cardBackgroundColor__limio_color: cardBackgroundColor = "#242424",
        textColor__limio_color: textColor = "#FFFFFF",
        mutedTextColor__limio_color: mutedTextColor = "#A7A7A7",
        accentColor__limio_color: accentColor = "#1ED760"
    } = props

    if (!features || features.length === 0) {
        return null
    }

    return (
        <section className="spotify-features" style={{ backgroundColor }}>
            <div className="spotify-features__container">
                <header className="spotify-features__header">
                    <h2 className="spotify-features__headline" style={{ color: textColor }}>
                        {headline}
                    </h2>
                    {subheadline && (
                        <p className="spotify-features__subheadline" style={{ color: mutedTextColor }}>
                            {subheadline}
                        </p>
                    )}
                </header>

                <div className="spotify-features__grid">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id || index}
                            className="spotify-features__card"
                            style={{ backgroundColor: cardBackgroundColor }}
                        >
                            <FeatureIcon icon={feature.icon} color={accentColor} />
                            <h3 className="spotify-features__title" style={{ color: textColor }}>
                                {feature.title}
                            </h3>
                            <p className="spotify-features__description" style={{ color: mutedTextColor }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SpotifyFeatures
