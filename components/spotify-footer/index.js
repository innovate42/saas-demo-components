import React from "react"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const SpotifyIcon = ({ color }) => (
    <svg className="spotify-footer__logo-icon" viewBox="0 0 24 24" fill={color}>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
)

const SocialIcon = ({ platform, color }) => {
    const icons = {
        instagram: (
            <svg className="spotify-footer__social-icon" viewBox="0 0 24 24" fill={color}>
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
            </svg>
        ),
        twitter: (
            <svg className="spotify-footer__social-icon" viewBox="0 0 24 24" fill={color}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        ),
        facebook: (
            <svg className="spotify-footer__social-icon" viewBox="0 0 24 24" fill={color}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        )
    }

    return icons[platform] || null
}

const SpotifyFooter = () => {
    const props = useStaticProps() || {}
    const currentYear = new Date().getFullYear()

    const {
        logoUrl = "",
        logoText = "Spotify",
        companyLinks = [],
        supportLinks = [],
        legalLinks = [],
        socialLinks = [],
        copyrightText = "Spotify AB",
        backgroundColor__limio_color: backgroundColor = "#121212",
        textColor__limio_color: textColor = "#FFFFFF",
        mutedTextColor__limio_color: mutedTextColor = "#A7A7A7",
        accentColor__limio_color: accentColor = "#1ED760"
    } = props

    return (
        <footer className="spotify-footer" style={{ backgroundColor }}>
            <div className="spotify-footer__container">
                <div className="spotify-footer__main">
                    <div className="spotify-footer__brand">
                        <a href="/" className="spotify-footer__logo" style={{ color: textColor }}>
                            {logoUrl ? (
                                <img src={logoUrl} alt={logoText} />
                            ) : (
                                <>
                                    <SpotifyIcon color={accentColor} />
                                    {logoText}
                                </>
                            )}
                        </a>

                        <div className="spotify-footer__social">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={social.id || index}
                                    href={social.url}
                                    className="spotify-footer__social-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.platform}
                                >
                                    <SocialIcon platform={social.platform} color={textColor} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {companyLinks.length > 0 && (
                        <nav>
                            <h3 className="spotify-footer__nav-title" style={{ color: mutedTextColor }}>
                                Company
                            </h3>
                            <ul className="spotify-footer__nav-list">
                                {companyLinks.map((link, index) => (
                                    <li key={link.id || index}>
                                        <a
                                            href={link.url}
                                            className="spotify-footer__nav-link"
                                            style={{ color: textColor }}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    {supportLinks.length > 0 && (
                        <nav>
                            <h3 className="spotify-footer__nav-title" style={{ color: mutedTextColor }}>
                                Support
                            </h3>
                            <ul className="spotify-footer__nav-list">
                                {supportLinks.map((link, index) => (
                                    <li key={link.id || index}>
                                        <a
                                            href={link.url}
                                            className="spotify-footer__nav-link"
                                            style={{ color: textColor }}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    {legalLinks.length > 0 && (
                        <nav>
                            <h3 className="spotify-footer__nav-title" style={{ color: mutedTextColor }}>
                                Legal
                            </h3>
                            <ul className="spotify-footer__nav-list">
                                {legalLinks.map((link, index) => (
                                    <li key={link.id || index}>
                                        <a
                                            href={link.url}
                                            className="spotify-footer__nav-link"
                                            style={{ color: textColor }}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>

                <div className="spotify-footer__bottom">
                    <p className="spotify-footer__copyright" style={{ color: mutedTextColor }}>
                        © {currentYear} {copyrightText}
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default SpotifyFooter
