import React, { useState } from "react"
import { useLimioContext } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const themes = {
    purple: "#635BFF",
    blue: "#0073E6",
    indigo: "#4F46E5",
    emerald: "#059669",
    slate: "#475569",
}

const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const HeaderStripe = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { isInPageBuilder } = useLimioContext() || {}
    const props = useStaticProps() || {}

    const {
        logoUrl = "",
        logoAlt = "Logo",
        navLinks = [],
        ctaText = "Get Started",
        ctaLink = "#pricing",
        themeColor = "purple",
        transparent = true,
    } = props

    const primaryColor = themes[themeColor] || themes.purple

    // Don't use fixed positioning in Page Builder so it doesn't float over the editor
    const headerClass = [
        "stripe-header",
        transparent && !isInPageBuilder ? "stripe-header--transparent" : "",
        isInPageBuilder ? "stripe-header--static" : "",
    ].filter(Boolean).join(" ")

    return (
        <header className={headerClass}>
            <div className="stripe-header__container">
                {/* Logo */}
                <a href="/" className="stripe-header__logo">
                    {logoUrl ? (
                        <img src={logoUrl} alt={logoAlt} className="stripe-header__logo-img" />
                    ) : (
                        <span className="stripe-header__logo-text">{logoAlt}</span>
                    )}
                </a>

                {/* Desktop Navigation */}
                <nav className="stripe-header__nav">
                    {navLinks.map((link) => (
                        <a key={link.id} href={link.href} className="stripe-header__nav-link">
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* CTA Button */}
                <div className="stripe-header__actions">
                    <a
                        href={ctaLink}
                        className="stripe-header__cta"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {ctaText}
                    </a>

                    {/* Mobile Menu Button */}
                    <button
                        className="stripe-header__mobile-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="stripe-header__mobile-menu">
                    <nav className="stripe-header__mobile-nav">
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.href}
                                className="stripe-header__mobile-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href={ctaLink}
                            className="stripe-header__mobile-cta"
                            style={{ backgroundColor: primaryColor }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {ctaText}
                        </a>
                    </nav>
                </div>
            )}
        </header>
    )
}

export default HeaderStripe
