/*
 * millwall-landing — static replica of
 * https://www.eticketing.co.uk/millwallfc/Memberships/List
 *
 * Everything on this page is presentational by design. The ONLY interactive
 * element is the ADD TO BASKET button on the "26/27 Official Membership"
 * card, whose destination is set via the `ctaUrl` prop. Every other nav
 * item, CTA, level picker, footer link and card control renders as an inert
 * <span> so nothing else can be clicked through during a demo.
 *
 * Please don't "fix" the spans into working links.
 */

import React from "react"
import { useStaticProps } from "./componentStaticProps"
import {
  BRAND,
  FEES,
  FOOTER_LINKS,
  GROUP_TITLE,
  IMAGES,
  MEMBERSHIPS,
  NAV,
  TOP_BAR,
} from "./data"
import {
  BasketIcon,
  ChevronIcon,
  ExternalIcon,
  SignInIcon,
  TicketmasterWordmark,
} from "./icons"
import "./index.css"

/* Inert stand-ins, so the only real anchor is the one CTA. */
const Inert = ({ className, children }) => <span className={className}>{children}</span>

const MembershipCard = ({ m, ctaUrl }) => (
  <div className="mwl-card">
    {m.mostPopular && (
      <span className="mwl-card__flag">
        <span>MOST POPULAR</span>
      </span>
    )}
    <div className="mwl-card__body">
      <img className="mwl-card__img" src={m.image} alt={m.imageAlt} />
      <div className="mwl-card__text">
        <h3 className="mwl-card__title">{m.title}</h3>
        {m.subtitle && <h3 className="mwl-card__subtitle">{m.subtitle}</h3>}

        <div className="mwl-card__desc">
          {m.sections.map((s, i) => (
            <React.Fragment key={s.heading}>
              {m.boldHeadings ? <strong>{s.heading}</strong> : s.heading}
              <ul>
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {i < m.sections.length - 1 && <br />}
            </React.Fragment>
          ))}
          {m.footnotes.map((f, i) => (
            <React.Fragment key={f}>
              {f}
              {i < m.footnotes.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>

        <div className="mwl-card__buttons">
          <div className="mwl-card__price-desc" />

          {/* Inert stand-in for the real <select> of available levels. */}
          <div className="mwl-select">
            <span className="mwl-select__value">{m.levels[0]}</span>
            <span className="mwl-select__arrow">
              <ChevronIcon size={13} />
            </span>
          </div>

          <div className="mwl-card__fees">
            <div>
              {FEES.booking}
              <span className="mwl-bold">{FEES.bookingValue}</span>
            </div>
            <div className="mwl-card__fees-delivery">
              {FEES.delivery}
              <span className="mwl-bold">{FEES.deliveryValue}</span>
            </div>
          </div>

          {/* The one live control on the page. */}
          {m.mostPopular ? (
            <a className="mwl-btn mwl-btn--primary" href={ctaUrl}>
              ADD TO BASKET
            </a>
          ) : (
            <Inert className="mwl-btn mwl-btn--primary">ADD TO BASKET</Inert>
          )}

          <Inert className="mwl-btn mwl-btn--link">Learn More</Inert>
        </div>
      </div>
    </div>
  </div>
)

const MillwallLanding = () => {
  const props = useStaticProps() || {}
  const { ctaUrl = "/millwall" } = props

  return (
    <div className="mwl-root">
      {/* ── Top utility bar ─────────────────────────────────────── */}
      <header className="mwl-topbar">
        <div className="mwl-topbar__block">
          <Inert className="mwl-topbar__link">
            {TOP_BAR.backLabel}
            <span className="mwl-topbar__ext">
              <ExternalIcon size={13} />
            </span>
          </Inert>
          <span className="mwl-topbar__mode">{TOP_BAR.mode}</span>
        </div>
      </header>

      {/* ── Main header: logo, nav, account icons ───────────────── */}
      <div className="mwl-header">
        <div className="mwl-header__inner">
          <div className="mwl-header__home">
            <Inert className="mwl-header__logo">
              <img src={IMAGES.logo} alt="Millwall-FC-Logo" />
            </Inert>
            <div className="mwl-header__logotext">
              <h1 className="mwl-header__title">{BRAND.title}</h1>
              <h2 className="mwl-header__desc">{BRAND.description}</h2>
            </div>
          </div>

          <nav className="mwl-nav" aria-label="Navigation">
            {NAV.map((item) => (
              <div className="mwl-nav__item" key={item.label}>
                <Inert className="mwl-nav__link">
                  {item.label}
                  {item.sub && (
                    <span className="mwl-nav__chev">
                      <ChevronIcon size={11} />
                    </span>
                  )}
                </Inert>
                {item.sub && (
                  <div className="mwl-nav__submenu">
                    {item.sub.map((s) => (
                      <Inert className="mwl-nav__subitem" key={s}>
                        {s}
                      </Inert>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mwl-header__icons">
            <Inert className="mwl-header__icon">
              <SignInIcon size={23} />
            </Inert>
            <Inert className="mwl-header__icon">
              <BasketIcon size={23} />
            </Inert>
          </div>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <article className="mwl-hero">
        <img src={IMAGES.hero} alt="Membership_heroimage_desktop.jpg" />
      </article>

      {/* ── Membership cards ────────────────────────────────────── */}
      <main className="mwl-main">
        <section className="mwl-group">
          <h2 className="mwl-group__title">{GROUP_TITLE}</h2>
          {MEMBERSHIPS.map((m) => (
            <MembershipCard key={m.id} m={m} ctaUrl={ctaUrl} />
          ))}
        </section>
      </main>

      {/* ── Fees strip ──────────────────────────────────────────── */}
      <section className="mwl-fees">
        <div className="mwl-fees__inner">
          <div>{FEES.note}</div>
          <Inert className="mwl-btn mwl-btn--link mwl-fees__link">{FEES.link}</Inert>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="mwl-footer">
        <div className="mwl-footer__logos">
          <div className="mwl-footer__row">
            {IMAGES.sponsors.map((s) => (
              <Inert className="mwl-footer__sponsor" key={s.alt}>
                <img src={s.src} alt={s.alt} />
              </Inert>
            ))}
          </div>
        </div>
        <div className="mwl-footer__legal" />
        <div className="mwl-footer__links">
          <div className="mwl-footer__col">
            <p className="mwl-footer__poweredby">
              Powered by{" "}
              <span className="mwl-footer__tm">
                <TicketmasterWordmark width={130} />
              </span>
            </p>
          </div>
          <div className="mwl-footer__col">
            <ul className="mwl-footer__nav">
              {FOOTER_LINKS.map((l) => (
                <li className="mwl-footer__nav-item" key={l}>
                  <Inert className="mwl-footer__nav-link">{l}</Inert>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MillwallLanding
