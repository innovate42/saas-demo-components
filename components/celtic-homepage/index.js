import React, { useCallback, useEffect, useRef, useState } from "react"
import { useStaticProps } from "./componentStaticProps"
import { CREST_SVG, CREST_SVG_MONO } from "./crest"
import { Icon } from "./icons"
import {
  additionalArticles,
  adModule,
  advert,
  asset,
  darkPromos,
  footerMenu,
  footerSponsorRows,
  globalNavLinks,
  headerSponsors,
  hero,
  honours,
  latestResult,
  lightPromos,
  playerProfile,
  primaryNavLinks,
  products,
  signForCeltic,
  socialChannels,
  socialCustomPaths,
  videos,
} from "./data"
import "./index.css"

const Crest = ({ svg, className }) => (
  <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />
)

/* ------------------------------------------------------------------ *
 * Global nav — the green strip. This is where the extra MEMBERSHIPS
 * tab is appended, styled and hovered identically to the club's own
 * tabs, with its target driven by the membershipsHref prop.
 * ------------------------------------------------------------------ */
const GlobalNav = ({ membershipsLabel, membershipsHref, membershipsNewTab, showMembershipsTab }) => (
  <nav className="cel-global-nav">
    <div className="cel-global-nav__inner">
      <div className="cel-global-nav__links">
        {globalNavLinks.map((link) => (
          <a key={link.label} className="cel-global-nav__link" href={link.href}>
            {link.label}
          </a>
        ))}

        {showMembershipsTab && (
          <a
            className="cel-global-nav__link cel-global-nav__link--memberships"
            href={membershipsHref}
            target={membershipsNewTab ? "_blank" : undefined}
            rel={membershipsNewTab ? "noopener noreferrer" : undefined}
          >
            {membershipsLabel}
          </a>
        )}
      </div>

      <div className="cel-profile-button">
        <button type="button" className="cel-button cel-button--label-dark cel-profile-button__button">
          <Icon name="signIn-a" className="cel-button__icon cel-button__icon--left" />
          Sign in here
        </button>
      </div>
    </div>
  </nav>
)

/* ------------------------------------------------------------------ *
 * Primary nav — transparent crest header sitting over the hero.
 * ------------------------------------------------------------------ */
const PrimaryNav = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className="cel-header-container">
      <section className="cel-primary-nav">
        <div className="cel-primary-nav__logo-wrapper">
          <a className="cel-primary-nav__logo" href={globalNavLinks[0].href} aria-label="Celtic FC">
            <Crest svg={CREST_SVG} className="cel-crest" />
          </a>
        </div>

        <div className="cel-primary-nav__wrapper">
          <div className="cel-primary-nav__container">
            <p className="cel-primary-nav__title">Official Celtic FC Website</p>
            <div className="cel-primary-nav__button-wrapper">
              <section className="cel-language-selector">
                <Icon name="country-a" className="cel-language-selector__icon" />
                <span className="cel-language-selector__choice">EN</span>
                <Icon name="chevronright-a" className="cel-language-selector__toggle" />
              </section>
            </div>
          </div>

          <nav className="cel-primary-nav__link-wrapper">
            <div className="cel-primary-nav__link-left">
              {primaryNavLinks.map((link) => (
                <a key={link.label} className="cel-primary-nav__link" href={link.href}>
                  {link.label}
                </a>
              ))}
              <a className="cel-primary-nav__logo-mobile" href={globalNavLinks[0].href} aria-label="Celtic FC">
                <Crest svg={CREST_SVG} className="cel-crest" />
              </a>
            </div>

            <div className="cel-primary-nav__link-right">
              <div className="cel-header-sponsors">
                {headerSponsors.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    className="cel-header-sponsors__link"
                    href={sponsor.href}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                  >
                    <img className="cel-header-sponsors__logo" src={sponsor.logo} alt={sponsor.name} />
                  </a>
                ))}
              </div>

              <button type="button" className="cel-icon-button" aria-label="Search">
                <Icon name="Union" className="cel-icon-button__svg" />
              </button>

              <button
                type="button"
                className="cel-icon-button"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <Icon name="burger-a" className="cel-icon-button__svg" />
              </button>
            </div>
          </nav>
        </div>
      </section>
    </section>
  )
}

const ArticleMeta = ({ icon, dateTime, date, category, block }) => (
  <div className={`cel-${block}__meta`}>
    <Icon name={icon} className={`cel-${block}__icon`} />
    <time dateTime={dateTime} className={`cel-${block}__date`}>
      {date}
    </time>
    <p className={`cel-${block}__category`}>{category}</p>
  </div>
)

const Hero = () => (
  <section className="cel-hero">
    <article className="cel-featured-article cel-radial-overlay">
      <div
        className="cel-featured-article__image cel-featured-article__image--large"
        style={{ backgroundImage: `url('${hero.imageLarge}')` }}
      />
      <div
        className="cel-featured-article__image cel-featured-article__image--small"
        style={{ backgroundImage: `url('${hero.imageSmall}')` }}
      />

      <div className="cel-featured-article__inner">
        <ArticleMeta
          block="featured-article"
          icon={hero.icon}
          dateTime={hero.dateTime}
          date={hero.date}
          category={hero.category}
        />
        <h1 className="cel-featured-article__title">{hero.title}</h1>
        <p className="cel-featured-article__summary">{hero.summary}</p>
        <div className="cel-featured-article__cta">
          <a className="cel-button cel-button--ghost-dark" href={hero.href}>
            Continue Reading
          </a>
        </div>
      </div>
    </article>

    <div className="cel-additional-featured">
      {additionalArticles.map((article) => (
        <article key={article.title} className="cel-small-featured-article">
          <a className="cel-small-featured-article__link" href={article.href}>
            <div className="cel-small-featured-article__image-wrap">
              <div
                className="cel-small-featured-article__image"
                style={{ backgroundImage: `url('${article.thumb}')` }}
              />
            </div>
            <div className="cel-small-featured-article__content">
              <ArticleMeta
                block="small-featured-article"
                icon={article.icon}
                dateTime={article.dateTime}
                date={article.date}
                category={article.category}
              />
              <h2 className="cel-small-featured-article__title">{article.title}</h2>
            </div>
          </a>
        </article>
      ))}

      <div className="cel-additional-featured__inner">
        {additionalArticles.map((article) => (
          <article
            key={article.title}
            className="cel-article-card cel-linear-overlay cel-additional-featured__item"
            style={{ backgroundImage: `url(${article.image})` }}
          >
            <div className="cel-article-card__wrap">
              <a className="cel-article-card__inner" href={article.href}>
                <ArticleMeta
                  block="article-card"
                  icon={article.icon}
                  dateTime={article.dateTime}
                  date={article.date}
                  category={article.category}
                />
                <h3 className="cel-article-card__title">{article.title}</h3>
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="cel-additional-featured__view-all-wrapper">
        <a className="cel-button cel-button--primary-dark cel-additional-featured__view-all" href={primaryNavLinks[0].href}>
          View all news
        </a>
      </div>
    </div>
  </section>
)

const ButtonSlice = ({ label, href, variant = "primary-light" }) => (
  <div className="cel-button-slice">
    <a className={`cel-button cel-button--${variant}`} href={href}>
      {label}
    </a>
  </div>
)

const LatestResult = () => (
  <div className="cel-highlight__item">
    <h3 className="cel-highlight__title">Latest Result</h3>
    <article className="cel-next-match" style={{ backgroundImage: `url('${latestResult.background}')` }}>
      <div className="cel-next-match__competition">
        <img
          className="cel-next-match__competition-icon"
          src={latestResult.competitionIcon}
          alt={latestResult.competition}
        />
      </div>

      <time className="cel-next-match__kickoff">
        <span className="cel-next-match__kickoff-time">{latestResult.kickoffTime}</span>
        <span className="cel-next-match__kickoff-date">{latestResult.kickoffDate}</span>
      </time>
      <p className="cel-next-match__venue">{latestResult.venue}</p>

      <div className="cel-next-match__crests cel-next-match__crests--home">
        <span className="cel-next-match__crest" style={{ backgroundImage: `url('${latestResult.homeCrest}')` }} />
        <span className="cel-next-match__crest" style={{ backgroundImage: `url('${latestResult.awayCrest}')` }} />
      </div>

      <h3 className="cel-next-match__teams">
        <span className="cel-next-match__home-team">{latestResult.homeTeam}</span>
        <span className="cel-next-match__teams-divider"> v </span>
        <span className="cel-next-match__away-team">{latestResult.awayTeam}</span>
      </h3>

      <div className="cel-next-match__score">{latestResult.score}</div>

      <a className="cel-button cel-button--ghost-dark cel-next-match__match-center" href={latestResult.matchCentreHref}>
        <Icon name="match-a" className="cel-button__icon cel-button__icon--left" />
        Match Centre
      </a>
    </article>

    <div className="cel-highlight__button-wrap">
      <ButtonSlice label="View All Fixtures" href={primaryNavLinks[3].href} />
    </div>
  </div>
)

const PlayerProfile = () => (
  <div className="cel-highlight__item">
    <h3 className="cel-highlight__title">Player Profile</h3>
    <article className="cel-player-highlight">
      <span
        className="cel-player-highlight__image"
        style={{ backgroundImage: `url('${playerProfile.image}')` }}
      />
      <div className="cel-player-highlight__info">
        <h3 className="cel-player-highlight__name">
          <span className="cel-player-highlight__first-name">{playerProfile.firstName}</span>
          {playerProfile.lastName}
        </h3>
        <p className="cel-player-highlight__position">{playerProfile.position}</p>
      </div>
      <p className="cel-player-highlight__number">{playerProfile.number}</p>

      <div className="cel-player-highlight__footer">
        <a className="cel-button cel-button--primary-dark" href={playerProfile.shirtHref}>
          <Icon name="shirt-a" className="cel-button__icon cel-button__icon--left" />
          Buy Shirt
        </a>
        <a className="cel-button cel-button--ghost-dark" href={playerProfile.profileHref}>
          <Icon name="player-a" className="cel-button__icon cel-button__icon--left" />
          Full Profile
        </a>
      </div>
    </article>

    <div className="cel-highlight__button-wrap">
      <ButtonSlice label="View all players" href={primaryNavLinks[4].href} />
    </div>
  </div>
)

/* Horizontally scrolling carousel with the club's arrow controls and
 * progress indicator. */
const Carousel = ({ children, className }) => {
  const trackRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const scrollable = track.scrollWidth - track.clientWidth
    setProgress(scrollable > 0 ? track.scrollLeft / scrollable : 0)
    setAtStart(track.scrollLeft <= 1)
    setAtEnd(scrollable <= 1 || track.scrollLeft >= scrollable - 1)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener("resize", sync)
    return () => window.removeEventListener("resize", sync)
  }, [sync])

  const scrollBy = (direction) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * Math.round(track.clientWidth * 0.8), behavior: "smooth" })
  }

  return (
    <section className={`cel-carousel ${className || ""}`}>
      <div className="cel-carousel__track" ref={trackRef} onScroll={sync}>
        {children}
      </div>

      <div className="cel-carousel__arrows">
        <button
          type="button"
          className={`cel-carousel__button${atStart ? " cel-carousel__button--disabled" : ""}`}
          aria-label="Previous"
          onClick={() => scrollBy(-1)}
        >
          <Icon name="chevronleft-a" className="cel-carousel__arrow" />
        </button>
        <button
          type="button"
          className={`cel-carousel__button${atEnd ? " cel-carousel__button--disabled" : ""}`}
          aria-label="Next"
          onClick={() => scrollBy(1)}
        >
          <Icon name="chevronright-a" className="cel-carousel__arrow" />
        </button>
      </div>

      <span className="cel-carousel__position-indicator-wrap">
        <span className="cel-carousel__position-indicator" style={{ width: `${progress * 100}%` }} />
      </span>
    </section>
  )
}

const VideoCarousel = () => (
  <section className="cel-video-carousel">
    <div className="cel-max-width-container">
      <h2 className="cel-video-carousel__title">Latest Videos</h2>

      <Carousel className="cel-video-carousel__carousel">
        {videos.map((video) => (
          <a
            key={video.id}
            className="cel-video-carousel-card"
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="cel-video-carousel-card__image-wrap">
              <img
                className="cel-video-carousel-card__featured-image"
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt=""
              />
              <img className="cel-video-carousel-card__play" src={asset("/vimeo_play@3x.png")} alt="" />
            </div>
            <h4 className="cel-video-carousel-card__title">{video.title}</h4>
          </a>
        ))}
      </Carousel>

      <div className="cel-video-carousel__button-wrapper">
        <a
          className="cel-button cel-button--primary-dark"
          href="https://player.celticfc.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to CelticPlayer
        </a>
      </div>
    </div>
  </section>
)

const ProductCarousel = () => (
  <section className="cel-product-carousel">
    <div className="cel-max-width-container">
      <h2 className="cel-product-carousel__heading">Celtic FC Store</h2>

      <ul className="cel-product-carousel__list">
        {products.map((product) => (
          <li key={product.name} className="cel-product-carousel__item">
            <a
              className="cel-product-carousel__link-wrap"
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="cel-product-carousel__image" src={product.image} alt={`Image of ${product.name}`} />
              <h4 className="cel-product-carousel__item-name">{product.name}</h4>
            </a>
          </li>
        ))}
      </ul>

      <div className="cel-product-carousel__button-row">
        <a
          className="cel-button cel-button--primary-light cel-product-carousel__button"
          href="https://store.celticfc.com/?utm_source=club&utm_medium=referral&utm_campaign=celtic_fc_store_link"
        >
          Visit Celtic FC Store
          <Icon name="chevronright-a" className="cel-button__icon cel-button__icon--right" />
        </a>
      </div>
    </div>
  </section>
)

const SocialMark = ({ channel, size }) => {
  if (channel.custom) {
    const mark = socialCustomPaths[channel.custom]
    const clipId = `cel-clip-${channel.custom}-${size}`
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox={mark.viewBox} style={{ height: size, width: size }}>
        <g clipPath={`url(#${clipId})`}>
          <path fill="currentColor" d={mark.d} />
        </g>
        <defs>
          <clipPath id={clipId}>
            <path fill="currentColor" d={mark.clip} />
          </clipPath>
        </defs>
      </svg>
    )
  }
  return <Icon name={channel.icon} style={{ height: size, width: size }} />
}

const Social = ({ size }) => (
  <section className="cel-social">
    <ul className="cel-social__channels">
      {socialChannels.map((channel) => (
        <li key={channel.name} className="cel-social__channel">
          <a href={channel.href} target="_blank" rel="noopener noreferrer" aria-label={channel.name}>
            <SocialMark channel={channel} size={size} />
          </a>
        </li>
      ))}
    </ul>
  </section>
)

const Footer = () => (
  <footer className="cel-footer">
    <div className="cel-footer__inner">
      <div className="cel-footer-sponsors">
        <div className="cel-footer-sponsors__inner">
          {footerSponsorRows.map((row, index) => (
            <div key={index} className="cel-footer-sponsors__row">
              {row.title && <h6 className="cel-footer-sponsors__row-title">{row.title}</h6>}
              <ol className="cel-footer-sponsors__sponsor-wrapper">
                {row.sponsors.map((sponsor) => (
                  <li key={sponsor.name} className="cel-footer-sponsors__sponsor">
                    <a
                      className="cel-footer-sponsors__logo"
                      href={sponsor.href}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      aria-label={sponsor.name}
                      style={{ backgroundImage: `url('${sponsor.logo}')` }}
                    />
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <div className="cel-footer-logo-block">
        <Crest svg={CREST_SVG_MONO} className="cel-crest cel-crest--mono" />
      </div>

      <section className="cel-footer-social">
        <h6 className="cel-footer-social__heading">The celts are here</h6>
        <div className="cel-footer-social__large">
          <Social size="48px" />
        </div>
        <div className="cel-footer-social__small">
          <Social size="24px" />
        </div>
      </section>

      <section className="cel-footer-custom">
        <img className="cel-footer-custom__logo" src={signForCeltic.logo} alt="" />
        <div className="cel-footer-custom__column">
          <h4 className="cel-footer-custom__title">{signForCeltic.title}</h4>
          <p className="cel-footer-custom__text">{signForCeltic.text}</p>
          <a className="cel-button cel-button--label-dark cel-button--inline" href={signForCeltic.href}>
            <Icon name="chevronright-a" className="cel-button__icon cel-button__icon--left" />
            Sign for Celtic
          </a>
        </div>
      </section>

      <section className="cel-footer-content">
        <nav className="cel-footer-menu">
          <div className="cel-footer-menu__row">
            {footerMenu.map((column, index) => (
              <ul key={index} className="cel-footer-menu__list">
                {column.heading && <h3 className="cel-footer-menu__list-heading">{column.heading}</h3>}
                {column.links.map((link) => (
                  <li key={link.label} className="cel-footer-menu__link">
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </nav>
      </section>

      <div className="cel-footer-copyright">
        <p className="cel-footer-copyright__notice">©Celtic Football Club</p>
      </div>
    </div>
  </footer>
)

const CelticHomepage = () => {
  const props = useStaticProps() || {}
  const {
    membershipsLabel = "Memberships",
    membershipsHref = "/memberships",
    membershipsNewTab = false,
    showMembershipsTab = true,
  } = props

  return (
    <div className="cel-site-wrap">
      <GlobalNav
        membershipsLabel={membershipsLabel}
        membershipsHref={membershipsHref}
        membershipsNewTab={membershipsNewTab}
        showMembershipsTab={showMembershipsTab}
      />

      <div className="cel-site-wrap__inner">
        <PrimaryNav />

        <main className="cel-main">
          <Hero />

          <div className="cel-max-width-container">
            <ButtonSlice label="View all news" href={primaryNavLinks[0].href} />
          </div>

          <section className="cel-advertising-slot">
            <div className="cel-max-width-container cel-advertising-slot__container">
              <a className="cel-advertising-slot__ad-link" href={advert.href}>
                <img className="cel-advertising-slot__ad" src={advert.image} alt="Advert" />
              </a>
            </div>
          </section>

          <section className="cel-highlight-wrapper">
            <div className="cel-highlight cel-max-width-container">
              <LatestResult />
              <PlayerProfile />
            </div>
          </section>

          <VideoCarousel />
          <ProductCarousel />

          <section className="cel-promo-section cel-promo-section--light">
            <div className="cel-promo-section__inner cel-max-width-container">
              {lightPromos.map((image) => (
                <article key={image} className="cel-promo cel-promo-section__item">
                  <img className="cel-promo__image" src={image} alt="" />
                </article>
              ))}
            </div>
          </section>

          <section className="cel-featured-stats">
            <div className="cel-max-width-container">
              <h2 className="cel-featured-stats__heading">Club Honours</h2>
              <div className="cel-featured-stats__content">
                {honours.map((honour) => (
                  <div key={honour.name} className="cel-stat">
                    <p className="cel-stat__name">{honour.name}</p>
                    <div className="cel-stat__stat-wrapper">
                      <div className="cel-stat__image" style={{ backgroundImage: `url('${honour.image}')` }} />
                      <p className="cel-stat__stat">{honour.stat}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cel-featured-stats__button-wrapper">
                <a className="cel-button cel-button--primary-dark cel-featured-stats__button" href={`${globalNavLinks[0].href}history`}>
                  View all club history
                </a>
              </div>
            </div>
          </section>

          <section className="cel-promo-section">
            <div className="cel-promo-section__inner cel-max-width-container">
              {darkPromos.map((promo) => (
                <div key={promo.heading} className="cel-promo-section__item">
                  <h3 className="cel-promo-section__heading">{promo.heading}</h3>
                  <article className="cel-promo">
                    <img className="cel-promo__image" src={promo.image} alt="" />
                  </article>
                </div>
              ))}
            </div>
          </section>

          <section className="cel-admodule">
            <div className="cel-admodule__container cel-max-width-container">
              {adModule.map((ad) => (
                <a
                  key={ad.image}
                  className="cel-admodule__advert"
                  href={ad.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className="cel-admodule__image" src={ad.image} alt="Sponsor ad" />
                </a>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default CelticHomepage
