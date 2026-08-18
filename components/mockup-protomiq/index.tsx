import React from "react";
import "./index.css";

/* ------------------------------------------------------------------ icons -- */
/* Captured from the live page (index.json icons[]) */

const IconLinkedIn = () => (
  <svg
    aria-hidden="true"
    className="e-font-icon-svg e-fab-linkedin-in"
    viewBox="0 0 448 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
  </svg>
);

const IconCog = () => (
  <svg
    aria-hidden="true"
    className="e-font-icon-svg e-fas-cog"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
  </svg>
);

const IconEnvelope = () => (
  <svg
    aria-hidden="true"
    className="e-font-icon-svg e-fas-envelope"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path>
  </svg>
);

/* -------------------------------------------------------------- page data -- */

const NAV: { label: string; href: string }[] = [
  { label: "Products", href: "https://protomiq.com/" },
  { label: "Platform", href: "https://protomiq.com/platform/" },
  { label: "News & Insights", href: "https://protomiq.com/resources/" },
  { label: "Pricing", href: "https://protomiq.com/pricing/" },
  {
    label: "Careers",
    href:
      "https://recruiting.paylocity.com/recruiting/jobs/All/ca88dd1a-74e2-4c43-82b5-043b766fa3f2/Protomiq",
  },
];

const DEALER_LOGOS: string[] = Array.from({ length: 22 }, (_, i) =>
  `https://protomiq.com/wp-content/uploads/2026/06/dealer-${(i % 12) + 1}.png`
);

const AUDIENCE_TABS: string[] = [
  "General Manager/Dealer Principal",
  "General Sales Manager",
  "Marketing/BDC Director",
  "Service Director",
];

const PRODUCT_TABS: string[] = [
  "tradeIQ",
  "paymentsIQ",
  "offerIQ",
  "AutoBio",
  "Service Offers",
  "Value Watch",
];

const PRODUCT_LINKS: { label: string; href: string }[] = [
  { label: "tradeIQ", href: "https://protomiq.com/trade/" },
  { label: "paymentsIQ", href: "https://protomiq.com/payments/" },
  { label: "offerIQ", href: "https://protomiq.com/offer/" },
  { label: "AutoBio", href: "https://protomiq.com/autobio/" },
  { label: "Service Offers", href: "https://protomiq.com/service-offers/" },
  { label: "Value Watch", href: "https://protomiq.com/value-watch/" },
];

const POSTS: {
  href: string;
  img: string;
  badge: string;
  title: string;
}[] = [
  {
    href: "https://protomiq.com/resources/protomiq-named-no-3165-on-the-2026/",
    img: "https://protomiq.com/wp-content/uploads/2026/08/inc-5000-300x160.png",
    badge: "Press Releases",
    title: "Protomiq Named No. 3165 on the 2026 Inc. 5000 List",
  },
  {
    href:
      "https://protomiq.com/resources/protomiq-launches-tradeiq-offeriq-and-paymentsiq/",
    img:
      "https://protomiq.com/wp-content/uploads/2026/07/Protomiq-Product-Lineup-Featured-Image-300x144.webp",
    badge: "Press Releases",
    title:
      "Protomiq Launches tradeIQ, offerIQ, and paymentsIQ, Bringing New Shopper Intelligence Tools to Auto Dealership Sales Teams",
  },
  {
    href: "https://protomiq.com/resources/2026-dealership-intelligence-report/",
    img:
      "https://protomiq.com/wp-content/uploads/2026/07/Protomiq-Dealership-Report-Cover-Mockup-300x213.webp",
    badge: "Resources",
    title: "2026 Dealership Intelligence Report",
  },
  {
    href:
      "https://protomiq.com/resources/morgan-automotive-group-sees-triple-digit-lead-growth/",
    img:
      "https://protomiq.com/wp-content/uploads/2026/07/Protomiq-Blog-Post-Image-Car-Dealership-Stock-300x200.webp",
    badge: "Case Study",
    title: "Morgan Automotive Group Sees Triple Digit Lead Growth",
  },
];

/* ------------------------------------------------------------- component --- */

export default function ComponentMockupProtomiq() {
  return (
    <div className="pmq-root">
      {/* ============================================================ header */}
      <header className="pmq-header">
        <div className="pmq-header__inner">
          <a className="pmq-header__logo" href="https://protomiq.com/">
            <img
              src="https://protomiq.com/wp-content/uploads/2026/07/Protomiq-Primary-Logo-tealeye.svg"
              alt="Protomiq"
            />
          </a>
          <nav className="pmq-header__nav">
            <ul className="pmq-menu">
              {NAV.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="pmq-header__actions">
            <a className="pmq-btn pmq-btn--demo" href="https://protomiq.com/demo/">
              Request a Demo
            </a>
            <a className="pmq-btn pmq-btn--login" href="https://protomiq.com/login/">
              Login
            </a>
          </div>
          <button className="pmq-header__toggle" type="button" aria-label="Menu">
            <span className="pmq-bars" />
            <span className="pmq-bars" />
            <span className="pmq-bars" />
          </button>
        </div>
      </header>

      {/* ============================================================== hero */}
      <div className="pmq-hero">
        <div className="pmq-hero__inner" />
      </div>

      <div className="pmq-herocard">
        <div className="pmq-herocard__inner">
          <div className="pmq-herocard__left">
            <div className="pmq-eyebrow">
              The Conversion and Experience Platform for Auto Dealers
            </div>
            <h1 className="pmq-h1">
              Turn car shopping behavior into{" "}
              <span className="pmq-grad">closed deals.</span>
            </h1>
          </div>
          <div className="pmq-herocard__right">
            <p>
              Every click, valuation, payment calculation, service inquiry, and
              vehicle search a shopper makes reveals buying intent. Protomiq
              tells you who is ready to buy.
            </p>
            <a className="pmq-cta" href="https://protomiq.com/demo/">
              <span className="pmq-cta__wrap">
                <span>Request a Demo</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ====================================================== logo marquee */}
      <div className="pmq-logos">
        <div className="pmq-marquee">
          <div className="pmq-marquee__track">
            {DEALER_LOGOS.map((src, i) => (
              <img key={`a-${i}`} src={src} alt="Dealer logo" />
            ))}
            {DEALER_LOGOS.map((src, i) => (
              <img key={`b-${i}`} src={src} alt="Dealer logo" />
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================= testimonial */}
      <div className="pmq-testimonials">
        <div className="pmq-swiper">
          <div className="pmq-slide">
            <div className="pmq-testimonial">
              <div className="pmq-testimonial__footer" />
              <div className="pmq-testimonial__content">
                <div className="pmq-testimonial__text">
                  “Protomiq(IQ) turns that thin lead into a real picture of the
                  customer, so my reps stop guessing and start selling to a
                  person and situation they actually understand.”
                </div>
                <cite className="pmq-testimonial__cite">
                  <span className="pmq-testimonial__name">Jeremy Nowling</span>
                  <span className="pmq-testimonial__title">
                    Sales &amp; Digital Retail Director, Rohrman AutoGroup
                  </span>
                </cite>
              </div>
            </div>
          </div>
          <div className="pmq-bullets">
            <span className="pmq-bullet pmq-bullet--active" />
            <span className="pmq-bullet" />
          </div>
        </div>
        <div className="pmq-dotcluster">
          <img
            src="https://protomiq.com/wp-content/uploads/2026/07/homepage-dot-cluster-animated.svg"
            alt=""
          />
        </div>
      </div>

      {/* ================================================== audience tabs === */}
      <div className="pmq-audience">
        <div className="pmq-audience__card">
          <h2 className="pmq-h2">
            The right shopper insights delivered to{" "}
            <span className="pmq-grad">the right team.</span>
          </h2>
          <div className="pmq-lede">
            <p>
              Most dealership tools generate activity. Protomiq turns that
              activity into something your team can use to sell better. Every
              product captures behavioral data and buying intent, then delivers
              it to the department.
            </p>
          </div>
          <div className="pmq-tabs">
            <div className="pmq-tabs__strip">
              {AUDIENCE_TABS.map((label, i) => (
                <div
                  key={label}
                  className={
                    i === 0 ? "pmq-tab pmq-tab--active" : "pmq-tab"
                  }
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="pmq-tabpanel">
              <div className="pmq-audience__panel">
                <div className="pmq-audience__copy">
                  <p>
                    You’re paying for traffic that doesn’t convert while your
                    team works leads blind. Protomiq turns that traffic into
                    leads and arms your team with the buyer intelligence to
                    close them.
                  </p>
                </div>
                <div className="pmq-audience__photo">
                  <img
                    src="https://protomiq.com/wp-content/uploads/2026/07/Mask-group-2.png"
                    alt="Dealer principal standing with crossed arms inside dealership"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== product tabs == */}
      <div className="pmq-products">
        <div className="pmq-products__inner">
          <h2 className="pmq-h2--light">
            <span className="pmq-grad--teal">Context</span> powers every stage of
            the customer lifecycle.
          </h2>
          <div className="pmq-products__lede">
            <p>
              Each Protomiq experience delivers value on its own, and together,
              they create a platform that helps you understand your customers
              better.
            </p>
          </div>
          <div className="pmq-products__card">
            <div className="pmq-tabs__strip">
              {PRODUCT_TABS.map((label, i) => (
                <div
                  key={label}
                  className={i === 0 ? "pmq-tab pmq-tab--active" : "pmq-tab"}
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="pmq-tabpanel">
              <div className="pmq-products__panel">
                <div className="pmq-products__copy">
                  <p className="pmq-products__name">tradeIQ</p>
                  <p className="pmq-products__blurb">
                    See where every trade deal stands before the first call.
                  </p>
                  <p>
                    <a className="pmq-learn" href="https://protomiq.com/trade/">
                      Learn more →
                    </a>
                  </p>
                </div>
                <div className="pmq-video-wrap">
                  <button className="pmq-vpause" type="button" aria-label="Pause">
                    <span />
                    <span />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================== counters */}
      <div className="pmq-stats">
        <h2 className="pmq-h2--stats">
          Buyer intelligence, <span className="pmq-grad">activated.</span>
        </h2>
        <div className="pmq-stats__row">
          <div className="pmq-stat">
            <div className="pmq-stat__num">
              <span>2000</span>
              <span>+</span>
            </div>
            <div className="pmq-stat__label">dealerships served</div>
          </div>
          <div className="pmq-stat">
            <div className="pmq-stat__num">
              <span>0</span>
              <span>M+</span>
            </div>
            <div className="pmq-stat__label">trade leads captured</div>
          </div>
          <div className="pmq-stat">
            <div className="pmq-stat__num">
              <span>0</span>
              <span>%</span>
            </div>
            <div className="pmq-stat__label">average trade conversion to lead</div>
          </div>
        </div>
      </div>

      {/* ============================================================= posts */}
      <div className="pmq-news">
        <div className="pmq-news__inner">
          <h2 className="pmq-h2--news">News &amp; Insights</h2>
          <div className="pmq-news__grid">
            {POSTS.map((post) => (
              <article className="pmq-post" key={post.href}>
                <a className="pmq-post__thumb" href={post.href}>
                  <img src={post.img} alt="" />
                </a>
                <div className="pmq-post__badge">{post.badge}</div>
                <h3 className="pmq-post__title">
                  <a href={post.href}>{post.title}</a>
                </h3>
                <a className="pmq-post__more" href={post.href}>
                  Read more →
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= final CTA */}
      <div className="pmq-final">
        <h2 className="pmq-h2--final">
          Ready to see what{" "}
          <span className="pmq-grad--teal">car shoppers</span> are actually
          telling you?
        </h2>
        <a className="pmq-cta--ghost" href="https://protomiq.com/demo/">
          <span className="pmq-cta__wrap">
            <span>Request a Demo</span>
          </span>
        </a>
      </div>

      {/* ============================================================ footer */}
      <footer className="pmq-footer">
        <div className="pmq-footer__outer">
          <div className="pmq-footer__inner">
            <div className="pmq-footer__cluster">
              <img
                src="https://protomiq.com/wp-content/uploads/2026/07/footer-dot-cluster-animated-1.svg"
                alt=""
              />
            </div>
            <div className="pmq-divider">
              <span />
            </div>
            <div className="pmq-footer__cols">
              <div className="pmq-footer__brand">
                <div className="pmq-footer__logo">
                  <a href="https://protomiq.com/">
                    <img
                      src="https://protomiq.com/wp-content/uploads/2026/06/Protomiq-Primary-Light-Logo.svg"
                      alt="Protomiq light logo"
                    />
                  </a>
                </div>
                <div className="pmq-social">
                  {[0, 1, 2, 3].map((i) => (
                    <span className="pmq-social__item" key={i}>
                      <a
                        className="pmq-social__link"
                        href="https://www.linkedin.com/company/tradepending/"
                      >
                        <span
                          style={{
                            position: "absolute",
                            width: 1,
                            height: 1,
                            overflow: "hidden",
                            clip: "rect(0,0,0,0)",
                          }}
                        >
                          Linkedin-in
                        </span>
                        <IconLinkedIn />
                      </a>
                    </span>
                  ))}
                </div>
                <div className="pmq-contact">
                  <ul>
                    <li>
                      <a href="mailto:support@protomiq.com">
                        <span className="pmq-contact__icon">
                          <IconCog />
                        </span>
                        <span className="pmq-contact__text">
                          support@protomiq.com
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="mailto:sales@protomiq.com">
                        <span className="pmq-contact__icon">
                          <IconEnvelope />
                        </span>
                        <span className="pmq-contact__text">
                          sales@protomiq.com
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pmq-footer__col">
                <div className="pmq-footer__heading">Products</div>
                <ul className="pmq-footer__links">
                  {PRODUCT_LINKS.map((item) => (
                    <li key={item.label}>
                      <a href={item.href}>
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pmq-footer__col">
                <div className="pmq-footer__heading">
                  <a href="https://protomiq.com/platform/">Platform</a>
                </div>
              </div>

              <div className="pmq-footer__col">
                <div className="pmq-footer__heading">
                  <a href="https://protomiq.com/pricing/">Pricing</a>
                </div>
              </div>

              <div className="pmq-footer__col">
                <div className="pmq-footer__heading">
                  <a href="https://protomiq.com/resources/">News &amp; Insights</a>
                </div>
              </div>
            </div>

            <div className="pmq-footer__legal">
              <div>
                <ul>
                  <li>
                    <a href="https://protomiq.com/privacy-policy/">
                      <span>Privacy Policy</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="pmq-footer__copy">
                <p>©2026 Protomiq. All rights reserved</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
