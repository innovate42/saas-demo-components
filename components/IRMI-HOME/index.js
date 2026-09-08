import React from "react"
import { useStaticProps } from "./componentStaticProps"
import {
    ASSETS, NAV_LINKS, BANNER_CARDS, TOPIC_CARDS, INDUSTRY_CARDS,
    PATH_CARDS, TESTIMONIALS, FOOTER_COLUMNS
} from "./data"
import {
    BarsIcon, SearchIcon, CartIcon, ArrowRight, PlayIcon,
    FacebookIcon, TwitterIcon, LinkedInIcon, YouTubeIcon
} from "./icons"
import "./index.css"

/*
 * IRMI-HOME — static replica of the irmi.com landing page.
 *
 * Everything on this page is presentational by design: the ONLY interactive
 * element is the LOG IN button in the top-right of the header, whose
 * destination is set via the `loginUrl` prop. Every other nav item, CTA,
 * card link and carousel control renders as an inert <span> so nothing else
 * can be clicked through during a demo.
 */

const Btn = ({ children }) => <span className="irmi-btn">{children}</span>

const CtaLink = ({ children }) => (
    <span className="irmi-cta">
        {children}
        <span className="irmi-cta__icon"><ArrowRight /></span>
    </span>
)

const VideoFrame = ({ poster, label }) => (
    <div className="irmi-video">
        <img src={poster} alt={label} loading="lazy" />
        <span className="irmi-video__play"><PlayIcon /></span>
        <span className="irmi-video__bar">
            <span className="irmi-video__progress" />
        </span>
    </div>
)

const IconCard = ({ card, cta }) => (
    <div className="irmi-icard">
        <div className="irmi-icard__head">
            <div className="irmi-icard__img">
                <img src={card.icon} alt="" width="60" height="60" loading="lazy" />
            </div>
            <h3>{card.title}</h3>
        </div>
        <div className="irmi-icard__cta"><CtaLink>{cta}</CtaLink></div>
    </div>
)

const IrmiHome = () => {
    const props = useStaticProps() || {}
    const {
        loginUrl = "/leemeeo-billing",
        loginLabel = "Log In",
        openLoginInNewTab = false
    } = props

    return (
        <div className="irmi-home">
            {/* ── Header ─────────────────────────────────────────────── */}
            <header className="irmi-header">
                <div className="irmi-container irmi-header__inner">
                    <span className="irmi-header__menu" aria-hidden="true"><BarsIcon /></span>
                    <span className="irmi-header__logo">
                        <img src={ASSETS.logo} alt="IRMI logo" width="150" height="50" />
                    </span>
                    <div className="irmi-header__links">
                        <span className="irmi-header__icon" aria-hidden="true"><SearchIcon /></span>
                        <span className="irmi-header__icon irmi-header__cart" aria-hidden="true">
                            <CartIcon />
                            <span className="irmi-header__badge">0</span>
                        </span>
                        <a
                            className="irmi-pill"
                            href={loginUrl}
                            target={openLoginInNewTab ? "_blank" : undefined}
                            rel={openLoginInNewTab ? "noopener noreferrer" : undefined}
                            title={loginLabel}
                        >
                            {loginLabel}
                        </a>
                        <span className="irmi-pill irmi-pill--outline">Explore Resources</span>
                    </div>
                </div>
            </header>

            {/* ── Sub navigation ─────────────────────────────────────── */}
            <nav className="irmi-nav">
                <div className="irmi-container">
                    <ul className="irmi-nav__list">
                        {NAV_LINKS.map((link) => (
                            <li className="irmi-nav__item" key={link.label}>
                                <span className="irmi-nav__link">{link.label}</span>
                                <div className="irmi-nav__menu">
                                    <span className="irmi-nav__menu-title">{link.label}</span>
                                    <ul>
                                        {link.items.map((item) => (
                                            <li key={item}><span>{item}</span></li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="irmi-hero">
                <img className="irmi-hero__bg" src={ASSETS.heroBackground} alt="" />
                <div className="irmi-hero__content">
                    <div className="irmi-container">
                        <div className="irmi-hero__copy">
                            <h1>Become an IRMI Member</h1>
                            <p>Start making smarter risk management decisions for your company or clients.</p>
                            <p><Btn>Join Now</Btn></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Three overlapping membership cards ─────────────────── */}
            <section className="irmi-banner-cards">
                <div className="irmi-container">
                    <div className="irmi-banner-cards__row">
                        {BANNER_CARDS.map((card) => (
                            <div className="irmi-bcard" key={card.title}>
                                <h3 className="irmi-bcard__title">{card.title}</h3>
                                <div className="irmi-bcard__img">
                                    <img src={card.image} alt="" width="600" height="400" loading="lazy" />
                                </div>
                                <p className="irmi-bcard__text">{card.body}</p>
                                <p><CtaLink>{card.cta}</CtaLink></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="irmi-spacer-60" />

            {/* ── Product Wizard promo ───────────────────────────────── */}
            <section className="irmi-promo">
                <div className="irmi-container">
                    <div className="irmi-promo__wrap">
                        <div className="irmi-promo__card">
                            <img src={ASSETS.promoCard} alt="" width="600" height="400" loading="lazy" />
                        </div>
                        <div className="irmi-promo__copy">
                            <h2>Ask the IRMI Product Wizard</h2>
                            <p>
                                Get product recommendations tailored to your professional needs.
                                Answer three simple questions about your job, lines of coverage you
                                focus on, and industry verticals you serve, and the IRMI Product
                                Wizard will return the best matches.
                            </p>
                            <p><Btn>Try the IRMI Product Wizard</Btn></p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="irmi-spacer-60" />
            <section className="irmi-text-tray irmi-text-tray--empty" />

            {/* ── Meet IRMI IQ ───────────────────────────────────────── */}
            <section className="irmi-text-tray">
                <div className="irmi-container">
                    <hr />
                    <h2 className="irmi-center">Meet IRMI IQ.</h2>
                    <div className="irmi-narrow">
                        <p className="irmi-center">
                            IRMI IQ is an AI‑powered research and guidance tool trained exclusively
                            on IRMI&apos;s trusted human-generated insurance and risk management
                            content. Unlike general AI tools, IRMI IQ is built for insurance
                            professionals who need answers they can rely on—backed by authoritative
                            sources, written in clear language, and ready to use in real‑world
                            scenarios.
                        </p>
                        <h4 className="irmi-center irmi-linkish">Ask IRMI IQ</h4>
                        <VideoFrame poster={ASSETS.videoIQ} label="Meet IRMI IQ" />
                    </div>
                </div>
            </section>

            {/* ── Choose Your Specialty ──────────────────────────────── */}
            <section className="irmi-text-tray">
                <div className="irmi-container">
                    <div className="irmi-specialty">
                        <div className="irmi-specialty__copy">
                            <p className="irmi-topic">Choose Your Specialty</p>
                            <h3 className="irmi-h1">
                                <strong>
                                    What does it take to achieve success in your risk management
                                    and insurance career?&nbsp;
                                </strong>
                            </h3>
                            <p>
                                Credibility and specialized knowledge are certainly two of the keys,
                                and an efficient way to gain both is with an IRMI certification. You
                                can choose from&nbsp;six&nbsp;insurance certification programs, and
                                we make earning them both fast and painless with a convenient online
                                learning platform.
                            </p>
                            <p><CtaLink>Visit the IRMI Learning Center</CtaLink></p>
                        </div>
                        <div className="irmi-specialty__img">
                            <img src={ASSETS.certificationBadges} alt="" width="300" height="200" loading="lazy" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Get the Answers You Need ───────────────────────────── */}
            <section className="irmi-icon-cards">
                <div className="irmi-container">
                    <div className="irmi-heading">
                        <h2 className="irmi-center">Get the Answers You Need</h2>
                    </div>
                    <div className="irmi-intro">
                        <p>
                            Whether you buy, sell, or write general lines or your needs are more
                            specialized, IRMI&apos;s researchers have put together resources that
                            will make it easier to do your job.
                        </p>
                    </div>
                    <div className="irmi-grid irmi-grid--3">
                        {TOPIC_CARDS.map((card) => (
                            <IconCard card={card} cta="Go to Topic" key={card.title} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How Can IRMI Help You? ─────────────────────────────── */}
            <section className="irmi-text-tray">
                <div className="irmi-container">
                    <hr />
                    <h2 className="irmi-center">How Can IRMI Help You?</h2>
                    <div className="irmi-narrow irmi-narrow--wide">
                        <VideoFrame poster={ASSETS.videoWhyIRMI} label="How Can IRMI Help You?" />
                    </div>
                    <hr />
                </div>
            </section>

            {/* ── Choose Your Path ───────────────────────────────────── */}
            <section className="irmi-path">
                <div className="irmi-container">
                    <div className="irmi-heading">
                        <h2 className="irmi-center">Choose Your Path</h2>
                    </div>
                    <div className="irmi-intro">
                        <div>Become a better insurance professional with IRMI.</div>
                    </div>
                    <div className="irmi-grid irmi-grid--2">
                        {PATH_CARDS.map((card) => (
                            <div className="irmi-lcard" key={card.title}>
                                <h3>{card.title}</h3>
                                <p>{card.body}</p>
                                <p><CtaLink>{card.cta}</CtaLink></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Industry-Specific Expertise ────────────────────────── */}
            <section className="irmi-icon-cards">
                <div className="irmi-container">
                    <div className="irmi-heading">
                        <h2 className="irmi-center">Industry-Specific Expertise</h2>
                    </div>
                    <div className="irmi-intro">
                        <p>
                            The risks faced by certain industries—such as construction,
                            transportation, and energy—are extremely complex and unique. IRMI gives
                            you access to industry-specific information to help you properly
                            identify and insure these nuanced exposures.
                        </p>
                    </div>
                    <div className="irmi-grid irmi-grid--4">
                        {INDUSTRY_CARDS.map((card) => (
                            <IconCard card={card} cta="Explore Resources" key={card.title} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why IRMI? ──────────────────────────────────────────── */}
            <section className="irmi-text-tray">
                <div className="irmi-container">
                    <h2 className="irmi-center">Why IRMI?</h2>
                    <div className="irmi-intro">
                        <p>
                            Thousands of your peers in the insurance industry already use IRMI
                            resources to do their jobs better. Hear from them how IRMI has helped
                            them succeed.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Testimonial (first slide of the source carousel) ───── */}
            <section className="irmi-testimonial">
                <div className="irmi-container irmi-testimonial__inner">
                    <div className="irmi-testimonial__mark">“</div>
                    <blockquote>
                        <span className="irmi-testimonial__quote">
                            “ <span>{TESTIMONIALS[0].quote}</span> ”
                        </span>
                        <cite>
                            {TESTIMONIALS[0].name}
                            <br />
                            {TESTIMONIALS[0].title}
                        </cite>
                    </blockquote>
                    <div className="irmi-testimonial__mark">”</div>
                </div>
                <div className="irmi-dots">
                    {TESTIMONIALS.map((t, i) => (
                        <span
                            key={t.name}
                            className={`irmi-dot${i === 0 ? " irmi-dot--active" : ""}`}
                        >
                            {i + 1}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <footer className="irmi-footer">
                <div className="irmi-container irmi-footer__top">
                    <div className="irmi-footer__cols">
                        {FOOTER_COLUMNS.slice(0, 2).map((col) => (
                            <div className="irmi-footer__col" key={col.heading}>
                                <span className="irmi-footer__heading">{col.heading}</span>
                                <ul>
                                    {col.links.map((l) => <li key={l}><span>{l}</span></li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="irmi-footer__brand">
                        <img src={ASSETS.logo} alt="IRMI logo" width="150" height="50" loading="lazy" />
                        <p className="irmi-footer__tagline">
                            Your Trusted Source for risk management and insurance information,
                            education, and training
                        </p>
                    </div>
                    <div className="irmi-footer__cols">
                        {FOOTER_COLUMNS.slice(2).map((col) => (
                            <div className="irmi-footer__col" key={col.heading}>
                                <span className="irmi-footer__heading">{col.heading}</span>
                                <ul>
                                    {col.links.map((l) => <li key={l}><span>{l}</span></li>)}
                                    {col.social && (
                                        <li className="irmi-footer__social">
                                            <span><FacebookIcon /></span>
                                            <span><TwitterIcon /></span>
                                            <span><LinkedInIcon /></span>
                                            <span><YouTubeIcon /></span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="irmi-container irmi-footer__bottom">
                    <p>
                        <span>IRMI Headquarters</span>
                        <span className="irmi-pipe" />
                        <span className="irmi-nowrap">12222 Merit Drive, Suite 1600,</span>{" "}
                        <span className="irmi-nowrap">Dallas, TX 75251</span>
                        <span className="irmi-pipe" />
                        <span className="irmi-nowrap irmi-linkish">(800) 827-4242</span>
                    </p>
                    <p className="irmi-footer__copyright">
                        © 2000–2026 International Risk Management Institute, Inc (IRMI).
                        All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default IrmiHome
