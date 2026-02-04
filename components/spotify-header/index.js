import React from "react"
import { useUser, useBasket, useLimioContext } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const SpotifyIcon = ({ color }) => (
    <svg className="spotify-header__logo-icon" viewBox="0 0 24 24" fill={color}>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
)

const CartIcon = ({ color }) => (
    <svg className="spotify-header__cart-icon" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
)

const SpotifyHeader = () => {
    const props = useStaticProps() || {}
    const { isInPageBuilder } = useLimioContext() || {}
    const { attributes, loginStatus } = useUser() || {}
    const { orderItems } = useBasket() || {}

    const {
        logoUrl = "",
        logoText = "Spotify",
        navLinks = [],
        showUserInfo = true,
        showCart = true,
        loginUrl = "/login",
        signupUrl = "/signup",
        loginText = "Log in",
        signupText = "Sign up",
        backgroundColor__limio_color: backgroundColor = "#000000",
        textColor__limio_color: textColor = "#FFFFFF",
        accentColor__limio_color: accentColor = "#1ED760"
    } = props

    const isLoggedIn = loginStatus === "logged-in"
    const userEmail = attributes?.email || ""
    const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "U"
    const cartItemCount = orderItems?.length || 0

    const headerClasses = [
        "spotify-header",
        isInPageBuilder ? "spotify-header--static" : ""
    ].filter(Boolean).join(" ")

    return (
        <header className={headerClasses} style={{ backgroundColor }}>
            <div className="spotify-header__left">
                <a href="/" className="spotify-header__logo" style={{ color: textColor }}>
                    {logoUrl ? (
                        <img src={logoUrl} alt={logoText} />
                    ) : (
                        <>
                            <SpotifyIcon color={accentColor} />
                            {logoText}
                        </>
                    )}
                </a>

                <nav className="spotify-header__nav">
                    {navLinks.map((link, index) => (
                        <a
                            key={link.id || index}
                            href={link.url}
                            className="spotify-header__nav-link"
                            style={{ color: textColor }}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>

            <div className="spotify-header__right">
                {showCart && (
                    <button className="spotify-header__cart" aria-label="Cart">
                        <CartIcon color={textColor} />
                        {cartItemCount > 0 && (
                            <span
                                className="spotify-header__cart-badge"
                                style={{ backgroundColor: accentColor, color: "#000" }}
                            >
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                )}

                {showUserInfo && isLoggedIn ? (
                    <div className="spotify-header__user">
                        <div
                            className="spotify-header__user-avatar"
                            style={{ backgroundColor: accentColor, color: "#000" }}
                        >
                            {userInitial}
                        </div>
                        <span className="spotify-header__user-name" style={{ color: textColor }}>
                            {userEmail.split("@")[0]}
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="spotify-header__divider" />
                        <div className="spotify-header__auth">
                            <a
                                href={signupUrl}
                                className="spotify-header__auth-link spotify-header__auth-link--secondary"
                                style={{ color: textColor }}
                            >
                                {signupText}
                            </a>
                            <a
                                href={loginUrl}
                                className="spotify-header__auth-link spotify-header__auth-link--primary"
                            >
                                {loginText}
                            </a>
                        </div>
                    </>
                )}

                <button className="spotify-header__mobile-toggle" aria-label="Menu">
                    <span style={{ backgroundColor: textColor }}></span>
                    <span style={{ backgroundColor: textColor }}></span>
                    <span style={{ backgroundColor: textColor }}></span>
                </button>
            </div>
        </header>
    )
}

export default SpotifyHeader
