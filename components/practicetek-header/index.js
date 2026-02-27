import React, { useState } from "react"
import { useLimioContext } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const PracticeTekHeader = () => {
    const props = useStaticProps() || {}
    const { isInPageBuilder } = useLimioContext() || {}
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const {
        logoUrl = "https://www.practicetek.com/wp-content/uploads/2024/09/practicetek-logo.svg",
        logoAlt = "PracticeTek",
        navLinks = [],
        ctaText = "Get Started",
        ctaUrl = "/subscribe",
        showCta = true,
        backgroundColor__limio_color: backgroundColor = "#FFFFFF",
        textColor__limio_color: textColor = "#1A1A2E",
        ctaBackgroundColor__limio_color: ctaBackgroundColor = "#1A1A2E",
        ctaTextColor__limio_color: ctaTextColor = "#FFFFFF"
    } = props

    const headerClasses = [
        "practicetek-header",
        isInPageBuilder ? "practicetek-header--static" : ""
    ].filter(Boolean).join(" ")

    const navClasses = [
        "practicetek-header__nav",
        mobileMenuOpen ? "practicetek-header__nav--open" : ""
    ].filter(Boolean).join(" ")

    return (
        <header
            className={headerClasses}
            style={{ backgroundColor }}
        >
            <a href="/" className="practicetek-header__logo">
                <img src={logoUrl} alt={logoAlt} />
            </a>

            <button
                className="practicetek-header__mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
            >
                <span style={{ backgroundColor: textColor }}></span>
                <span style={{ backgroundColor: textColor }}></span>
                <span style={{ backgroundColor: textColor }}></span>
            </button>

            <nav className={navClasses} style={{ backgroundColor }}>
                <ul className="practicetek-header__nav-list">
                    {navLinks.map((link, index) => (
                        <li key={link.id || index}>
                            <a
                                href={link.url}
                                className="practicetek-header__nav-link"
                                style={{ color: textColor }}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {showCta && (
                    <a
                        href={ctaUrl}
                        className="practicetek-header__cta"
                        style={{
                            backgroundColor: ctaBackgroundColor,
                            color: ctaTextColor
                        }}
                    >
                        {ctaText}
                    </a>
                )}
            </nav>
        </header>
    )
}

export default PracticeTekHeader