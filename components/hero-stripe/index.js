import React from "react"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const themes = {
    purple: { primary: "#635BFF", gradient: ["#635BFF", "#A855F7", "#EC4899"] },
    blue: { primary: "#0073E6", gradient: ["#0073E6", "#00A3FF", "#00D4FF"] },
    indigo: { primary: "#4F46E5", gradient: ["#4F46E5", "#7C3AED", "#A855F7"] },
    emerald: { primary: "#059669", gradient: ["#059669", "#10B981", "#34D399"] },
    slate: { primary: "#475569", gradient: ["#475569", "#64748B", "#94A3B8"] },
}

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="hero-badge__icon">
        <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="hero-cta__arrow">
        <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const HeroStripe = () => {
    const props = useStaticProps() || {}

    const {
        headline = "The future of subscription management",
        subheadline = "Powerful tools to grow your recurring revenue.",
        primaryCtaText = "Start free trial",
        primaryCtaLink = "#pricing",
        secondaryCtaText = "Contact sales",
        secondaryCtaLink = "#contact",
        showSecondaryBtn = true,
        heroImage = "",
        themeColor = "purple",
        backgroundStyle = "animated",
        trustBadges = [],
    } = props

    const theme = themes[themeColor] || themes.purple
    const isDark = backgroundStyle === "dark"

    return (
        <section className={`hero-stripe hero-stripe--${backgroundStyle}`}>
            {/* Animated Background */}
            <div className="hero-stripe__bg">
                <div
                    className="hero-orb hero-orb--1"
                    style={{ background: `radial-gradient(circle, ${theme.gradient[0]}30 0%, transparent 70%)` }}
                />
                <div
                    className="hero-orb hero-orb--2"
                    style={{ background: `radial-gradient(circle, ${theme.gradient[1]}25 0%, transparent 70%)` }}
                />
                <div
                    className="hero-orb hero-orb--3"
                    style={{ background: `radial-gradient(circle, ${theme.gradient[2]}20 0%, transparent 70%)` }}
                />
            </div>

            <div className="hero-stripe__container">
                <div className="hero-stripe__content">
                    {/* Headline */}
                    <h1 className="hero-stripe__headline">{headline}</h1>

                    {/* Subheadline */}
                    <p className="hero-stripe__subheadline">{subheadline}</p>

                    {/* CTAs */}
                    <div className="hero-stripe__ctas">
                        <a
                            href={primaryCtaLink}
                            className="hero-cta hero-cta--primary"
                            style={{ backgroundColor: theme.primary }}
                        >
                            {primaryCtaText}
                            <ArrowIcon />
                        </a>

                        {showSecondaryBtn && (
                            <a
                                href={secondaryCtaLink}
                                className={`hero-cta hero-cta--secondary ${isDark ? "hero-cta--dark" : ""}`}
                            >
                                {secondaryCtaText}
                            </a>
                        )}
                    </div>

                    {/* Trust Badges */}
                    {trustBadges.length > 0 && (
                        <div className="hero-badges">
                            {trustBadges.map((badge) => (
                                <div key={badge.id} className="hero-badge">
                                    <CheckIcon />
                                    <span>{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hero Image */}
                {heroImage && (
                    <div className="hero-stripe__image">
                        <img src={heroImage} alt="" className="hero-stripe__img" />
                    </div>
                )}
            </div>

            {/* Gradient fade at bottom */}
            <div className="hero-stripe__fade" />
        </section>
    )
}

export default HeroStripe