import React from "react"
import { useStaticProps } from "./componentStaticProps"
import {
    ASSETS, UTILITY_LINKS, NAV_LINKS, G2_BADGES, TRUST_LOGOS,
    TESTIMONIALS, FOOTER_COLUMNS, FOOTER_BADGES, LEGAL_LINKS
} from "./data"
import {
    TrustIcon, VisibilityIcon, DeliveryIcon, ComplianceIcon,
    ChevronLeft, ChevronRight, PlayIcon, CheckIcon, CaretDown
} from "./icons"
import "./index.css"

/*
 * SMC-HOME — static replica of the prospect landing page.
 *
 * Everything on this page is presentational by design: the ONLY interactive
 * element is the Login button in the top-right utility bar, whose destination
 * is set via the `loginUrl` prop. All other navigation, CTAs, carousel arrows
 * and form controls render as inert spans so nothing else can be clicked
 * through during a demo.
 */

const Btn = ({ variant = "primary", children }) => (
    <span className={`smc-btn smc-btn--${variant}`}>{children}</span>
)

const BENEFITS = [
    {
        Icon: TrustIcon,
        title: "Trust",
        body: "Stop fake emails being sent from your domain and ensure that all recipients can trust the messages they receive from you, especially important as 3.4B malicious emails are sent daily.",
        note: "Source: AAG IT"
    },
    {
        Icon: VisibilityIcon,
        title: "Visibility",
        body: "Our DMARC reports collect data from servers worldwide, turning it into actionable insights, and give you visibility of who is sending emails from your domain."
    },
    {
        Icon: DeliveryIcon,
        title: "Delivery",
        body: "Strong DMARC compliance and policies ensure that all legitimate emails with your name reach the intended inbox, not Spam or Junk folders."
    },
    {
        Icon: ComplianceIcon,
        title: "Compliance",
        body: "Sendmarc ensures compliance with global regulatory standards, providing compliance with every email service used by every department."
    }
]

const ADD_ONS = [
    {
        title: "Lookalike Domain Defense",
        body: "Prevent cybercriminals from imitating your domain name with our Lookalike Domain Defense solution, that allows you to actively monitor domains that resemble your own, receive alerts on these, and defend against them."
    },
    {
        title: "Breach Detection",
        body: "Monitor various sources, including the dark web, using Breach Detection to discover if your business’s systems or user credentials have been compromised, and set up alerts for new breaches."
    }
]

const PARTNER_BENEFITS = [
    "A multi-tenant solution",
    "On-Demand billing",
    "Sales & implementation enablement",
    "PSA integration",
    "Automation and scalability",
    "Co-branded notifications & collateral"
]

const DomainCheckForm = ({ dark }) => (
    <div className={`smc-domain-form${dark ? " smc-domain-form--dark" : ""}`}>
        <span className="smc-domain-form__field">yourdomain.com</span>
        <span className="smc-btn smc-btn--primary smc-domain-form__submit">Test your domain</span>
    </div>
)

const SmcHome = () => {
    const props = useStaticProps() || {}

    const {
        loginUrl = "",
        loginLabel = "Login",
        openLoginInNewTab = false,
        stickyHeader = true
    } = props

    const loginProps = openLoginInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {}

    return (
        <div className="smc-home">
            {/* ---------------------------------------------------------- header */}
            <header className={`smc-header${stickyHeader ? " smc-header--sticky" : ""}`}>
                <div className="smc-utility">
                    <div className="smc-container smc-utility__inner">
                        <span className="smc-utility__link smc-utility__link--lang">
                            {UTILITY_LINKS[0]} <CaretDown />
                        </span>
                        {UTILITY_LINKS.slice(1).map((label) => (
                            <span key={label} className="smc-utility__link">{label}</span>
                        ))}
                        {/* The single interactive element on the page. */}
                        <a
                            className="smc-utility__link smc-utility__login"
                            href={loginUrl || undefined}
                            {...loginProps}
                        >
                            {loginLabel}
                        </a>
                    </div>
                </div>

                <div className="smc-nav">
                    <div className="smc-container smc-nav__inner">
                        <img className="smc-nav__logo" src={ASSETS.logo} alt="Sendmarc" />
                        <nav className="smc-nav__links">
                            {NAV_LINKS.map(({ label, hasMenu }) => (
                                <span key={label} className="smc-nav__link">
                                    {label}
                                    {hasMenu ? <CaretDown /> : null}
                                </span>
                            ))}
                        </nav>
                        <div className="smc-nav__ctas">
                            <Btn variant="primary">Free trial</Btn>
                            <Btn variant="dark">Book a demo</Btn>
                        </div>
                    </div>
                </div>
            </header>

            <div className="smc-breadcrumb">
                <div className="smc-container">
                    <span>Home</span>
                </div>
            </div>

            {/* ------------------------------------------------------------ hero */}
            <section
                className="smc-hero"
                style={{ backgroundImage: `url(${ASSETS.heroBackground})` }}
            >
                <span className="smc-hero__arrow smc-hero__arrow--prev"><ChevronLeft /></span>
                <span className="smc-hero__arrow smc-hero__arrow--next"><ChevronRight /></span>
                <div className="smc-container smc-hero__inner">
                    <h1 className="smc-hero__title">
                        Leading <b>DMARC</b>
                        <br />
                        management platform
                    </h1>
                    <p className="smc-hero__lead">
                        Take full control of your domain’s email security with a platform
                        created for visibility, automation, and ease of use.
                    </p>
                    <p className="smc-hero__body">
                        Sendmarc simplifies <b>DMARC</b>, <b>SPF</b>, and <b>DKIM</b> management,
                        making it easy to configure, monitor, and enforce authentication across
                        all your domains from a single dashboard.
                    </p>
                    <p className="smc-hero__body">
                        Our platform provides <b>real-time insights</b>, <b>policy enforcement</b>,
                        and <b>proactive threat detection</b> to keep your brand protected.
                    </p>
                    <div className="smc-hero__ctas">
                        <Btn variant="primary">Start for free</Btn>
                        <Btn variant="ghost">Get a demo</Btn>
                    </div>
                </div>
            </section>

            {/* --------------------------------------------------- domain check */}
            <section className="smc-section smc-domain">
                <div className="smc-container smc-domain__inner">
                    <h2 className="smc-h2">
                        Do you need DMARC protection? <b>Check your domain now</b>
                    </h2>
                    <DomainCheckForm />
                    <p className="smc-domain__note">
                        If you’re at risk of impersonation, one of our experts will be in touch to assist.
                    </p>
                </div>
            </section>

            {/* ---------------------------------------------------- award badges */}
            <section className="smc-section smc-awards">
                <div className="smc-container smc-awards__inner">
                    <h3 className="smc-awards__title">
                        Award-winning <b>cybersecurity</b>
                    </h3>
                    <div className="smc-awards__badges">
                        {G2_BADGES.map((badge) => (
                            <img key={badge.src} src={badge.src} alt={badge.alt} />
                        ))}
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------------- benefits */}
            <section className="smc-section smc-section--grey smc-benefits">
                <div className="smc-container smc-benefits__inner">
                    <h2 className="smc-h2 smc-h2--center">
                        Implement DMARC and solve your email delivery,{" "}
                        <b>impersonation &amp; spoofing problems</b>
                    </h2>
                    <div className="smc-benefits__intro">
                        <p>
                            A long-standing weakness in email makes it easy for attackers to spoof
                            trusted domains and land convincing messages in inboxes – fueling{" "}
                            <strong>billions of phishing emails every day</strong>.
                        </p>
                        <p>
                            This causes business damage and impacts the deliverability of the emails
                            you send. Sendmarc mitigates this flaw by ensuring your brand’s domain is
                            secured with DMARC protection.
                        </p>
                        <p>
                            By ensuring your domain is <strong className="smc-link">DMARC compliant</strong>,
                            Sendmarc helps your business achieve the following email benefits:
                        </p>
                    </div>
                    <div className="smc-benefits__grid">
                        {BENEFITS.map(({ Icon, title, body, note }) => (
                            <div key={title} className="smc-benefit">
                                <div className="smc-benefit__icon"><Icon /></div>
                                <h3 className="smc-benefit__title">{title}</h3>
                                <p className="smc-benefit__body">{body}</p>
                                {note ? <p className="smc-benefit__note">{note}</p> : null}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------------- video */}
            <section className="smc-section smc-video">
                <div className="smc-container smc-video__inner">
                    <h2 className="smc-h2 smc-h2--large smc-h2--center">
                        How DMARC compliance <b>ensures domain protection</b>
                    </h2>
                    <div className="smc-video__frame">
                        <img src={ASSETS.videoThumbnail} alt="DMARC Explainer Video | DMARC protection by Sendmarc" />
                        <span className="smc-video__play"><PlayIcon /></span>
                    </div>
                    <div className="smc-video__ctas">
                        <Btn variant="dark">Get a demo</Btn>
                        <Btn variant="outline">Read more</Btn>
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------- trust logos */}
            <section className="smc-section smc-section--grey smc-trust">
                <div className="smc-container smc-trust__inner">
                    <h2 className="smc-h2 smc-h2--large smc-h2--center">
                        Organizations <b>trust Sendmarc</b>
                    </h2>
                    <p className="smc-trust__body">
                        Sendmarc is trusted by enterprises, governments, and SMEs worldwide, and has
                        a tailored solution for MSPs, OEMs, and partners:
                    </p>
                    <div className="smc-trust__logos">
                        {TRUST_LOGOS.map((logo) => (
                            <img key={logo.src} src={logo.src} alt={logo.alt} />
                        ))}
                    </div>
                    <div className="smc-trust__ctas">
                        <Btn variant="primary">Start for free</Btn>
                        <Btn variant="outline">Get a demo</Btn>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------- testimonials */}
            <section className="smc-section smc-testimonials">
                <div className="smc-container smc-testimonials__inner">
                    <h2 className="smc-h2 smc-testimonials__title">
                        What our <b>customers</b> have to say
                    </h2>

                    <div className="smc-testimonials__viewport">
                        <span className="smc-testimonials__arrow"><ChevronLeft /></span>
                        <span className="smc-testimonials__arrow"><ChevronRight /></span>
                        <ul className="smc-testimonials__track">
                            {TESTIMONIALS.map((t, i) => (
                                <li
                                    key={t.id}
                                    className={`smc-testimonial${i === 0 ? " is-active" : ""}`}
                                    aria-hidden={i === 0 ? undefined : "true"}
                                >
                                    <figure className="smc-testimonial__figure">
                                        <div className="smc-testimonial__logo">
                                            <img src={t.logo} alt={t.logoAlt} loading="lazy" />
                                        </div>
                                        <div className="smc-testimonial__content">
                                            <p className="smc-testimonial__headline">{t.headline}</p>
                                            <blockquote className="smc-testimonial__quote">
                                                <p>{t.quote}</p>
                                            </blockquote>
                                            <figcaption className="smc-testimonial__caption">
                                                <span className="smc-testimonial__name">{t.name}</span>
                                                <span>{t.role}</span>
                                            </figcaption>
                                        </div>
                                    </figure>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="smc-testimonials__cta">
                        <Btn variant="outline">Get a demo</Btn>
                    </div>

                    {/* ------------------------------------------------------ BIMI */}
                    <div className="smc-bimi">
                        <div className="smc-bimi__content">
                            <h2 className="smc-bimi__title">
                                Email branding with <b>BIMI</b>
                            </h2>
                            <p className="smc-bimi__body">
                                Brand Indicators for Message Identification (BIMI) works together with
                                DMARC to maximize email impact and build brand recognition by allowing
                                for the display of your logo beside emails in inboxes.
                            </p>
                            <div><Btn variant="ghost">Learn more</Btn></div>
                        </div>
                        <div className="smc-bimi__media">
                            <img
                                src={ASSETS.bimi}
                                alt="Comparison between BIMI and non-BIMI emails in a desktop inbox"
                            />
                        </div>
                    </div>

                    {/* --------------------------------------------------- add-ons */}
                    <h2 className="smc-h2 smc-h2--large smc-h2--center smc-addons__title">
                        Enhance cybersecurity with additional
                        <br />
                        <b>protection from Sendmarc</b>
                    </h2>
                    <div className="smc-addons">
                        {ADD_ONS.map(({ title, body }) => (
                            <div key={title} className="smc-addon">
                                <h3 className="smc-addon__title">{title}</h3>
                                <p className="smc-addon__body">{body}</p>
                            </div>
                        ))}
                    </div>
                    <div className="smc-addons__cta">
                        <Btn variant="dark">Contact us</Btn>
                    </div>
                </div>
            </section>

            {/* --------------------------------------------------------- partner */}
            <section className="smc-section smc-partner">
                <div className="smc-container smc-partner__inner">
                    <img
                        className="smc-partner__media"
                        src={ASSETS.partnerInterface}
                        alt="An example of the desktop interface partners see when they partner with Sendmarc"
                    />
                    <div className="smc-partner__content">
                        <h2 className="smc-partner__title">
                            Partner <b>Program</b>
                        </h2>
                        <p className="smc-partner__body">
                            MSPs, OEMs, and partners use Sendmarc to manage <strong>DMARC</strong>,{" "}
                            <strong>SPF</strong>, <strong>DKIM</strong>, <strong>MTA-STS</strong>,{" "}
                            <strong>TLS-RPT</strong>, and <strong>BIMI</strong> for any-sized customer,
                            with efficient control of diverse client bases, in one place, on our
                            partner-first platform. Partner with us for access to:
                        </p>
                        <ul className="smc-partner__list">
                            {PARTNER_BENEFITS.map((item) => (
                                <li key={item}>
                                    <span className="smc-partner__check"><CheckIcon /></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div><Btn variant="ghost">Apply now</Btn></div>
                    </div>
                </div>
            </section>

            {/* --------------------------------------------------------- offices */}
            <section className="smc-section smc-offices">
                <div className="smc-container smc-offices__inner">
                    <div className="smc-offices__content">
                        <h2 className="smc-h2 smc-h2--large">
                            Our <b>offices</b>
                        </h2>
                        <div><Btn variant="outline">Contact us</Btn></div>
                    </div>
                    <img className="smc-offices__map" src={ASSETS.officesMap} alt="Sendmarc regional map" />
                </div>
            </section>

            {/* ---------------------------------------------------------- footer */}
            <footer className="smc-footer">
                <div className="smc-container smc-footer__cta">
                    <h3 className="smc-footer__cta-title">
                        How secure is your brand name from <b>email scammers?</b>
                    </h3>
                    <DomainCheckForm dark />
                    <p className="smc-footer__cta-note">
                        If you’re at risk of impersonation, one of our experts will be in touch to assist.
                    </p>
                </div>

                <div className="smc-container smc-footer__main">
                    <div className="smc-footer__brand">
                        <img className="smc-footer__logo" src={ASSETS.footerLogo} alt="Sendmarc logo" />
                        <div className="smc-footer__badges">
                            {FOOTER_BADGES.map((badge) => (
                                <div key={badge.src} className={`smc-footer__badge smc-footer__badge--${badge.modifier}`}>
                                    <img src={badge.src} alt={badge.alt} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {FOOTER_COLUMNS.map((column) => (
                        <div key={column.heading} className="smc-footer__column">
                            <h3 className="smc-footer__heading">{column.heading}</h3>
                            <ul className="smc-footer__list">
                                {column.links.map((link) => (
                                    <li key={link}>{link}</li>
                                ))}
                                {column.heading === "Platform & Services" ? (
                                    <li>{loginLabel}</li>
                                ) : null}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="smc-container smc-footer__legal">
                    <span>Copyright © Sendmarc</span>
                    {LEGAL_LINKS.map((link) => (
                        <span key={link}>{link}</span>
                    ))}
                </div>
            </footer>
        </div>
    )
}

export default SmcHome
