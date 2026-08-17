import React from "react";
import "./index.css";

const ASSETS = {
  logo: "https://www.bonterratech.com/wp-content/uploads/2026/04/Logo_Bonterra.svg",
  search:
    "https://www.bonterratech.com/wp-content/themes/bonterra-v3/_images/search-icon.svg",
  heroTexture:
    "https://www.bonterratech.com/wp-content/themes/bonterra-v3/_images/hero-bg-texture.jpg",
  heroImg:
    "https://www.bonterratech.com/wp-content/uploads/2026/05/hero-volunteer-img.png",
  arrow:
    "https://www.bonterratech.com/wp-content/themes/bonterra-v3/_images/arrow.svg",
};

const NAV = [
  "Products",
  "Solutions",
  "Why Us",
  "Pricing",
  "Resources",
  "Login",
];

const HERO_CARDS = [
  {
    title: "Corporate Social Responsibility",
    copy: "Empower employees to give, volunteer, and create change.",
  },
  {
    title: "Fundraising and Engagement",
    copy: "Raise more, retain donors, and grow giving year after year.",
  },
  {
    title: "Case Management",
    copy: "Spend less time on admin, more time changing lives.",
  },
  {
    title: "Grant Management",
    copy: "Manage grants from application to impact with confidence.",
  },
];

const TRUST_LOGOS = [
  {
    src: "https://www.bonterratech.com/wp-content/uploads/2024/12/White__Audubon.svg",
    alt: "Audubon",
    wide: true,
  },
  {
    src: "https://www.bonterratech.com/wp-content/uploads/2024/12/White__Special_Olympics.svg",
    alt: "Special Olympics",
    wide: false,
  },
  {
    src: "https://www.bonterratech.com/wp-content/uploads/2024/12/White__NAACP.svg",
    alt: "NAACP",
    wide: false,
  },
  {
    src: "https://www.bonterratech.com/wp-content/uploads/2024/12/White__Feeding_america.svg",
    alt: "Feeding America",
    wide: false,
  },
  {
    src: "https://www.bonterratech.com/wp-content/uploads/2024/12/White__Toys_for_tots.svg",
    alt: "Toys for Tots",
    wide: false,
  },
  {
    src: "https://www.bonterratech.com/wp-content/uploads/2024/12/White__Covenant_house.svg",
    alt: "Covenant House",
    wide: false,
  },
];

const AUDIENCE = [
  {
    title: "For nonprofits",
    src: "https://www.bonterratech.com/wp-content/uploads/2026/05/Nonprofits_web.jpg",
    alt: "An adult guides young children as they build with colorful blocks in a classroom or childcare setting.",
    active: true,
    link: "Explore solutions for nonprofits",
  },
  {
    title: "For foundations",
    src: "https://www.bonterratech.com/wp-content/uploads/2026/05/Foundations_web.jpg",
    alt: "A caregiver kneels on grass at an animal shelter, interacting with several dogs in an outdoor kennel area.",
    active: false,
    link: null,
  },
  {
    title: "For government",
    src: "https://www.bonterratech.com/wp-content/uploads/2026/05/Government_web.jpg",
    alt: "Community members and volunteers prepare food together in a shared kitchen as part of a public service or community support program.",
    active: false,
    link: null,
  },
  {
    title: "For corporations",
    src: "https://www.bonterratech.com/wp-content/uploads/2026/05/Corporations_web.jpg",
    alt: "A group of volunteers wearing matching shirts collect litter in a wooded park during a community cleanup effort.",
    active: false,
    link: null,
  },
];

const STATS = [
  { prefix: "", number: "46M", suffix: "+", label: "Donors" },
  { prefix: "", number: "216K", suffix: "+", label: "Nonprofits in our network" },
  { prefix: "$", number: "22B", suffix: "+", label: "Annual giving supported" },
];

const FEATURES = [
  {
    title: "First agentic AI for social good",
    copy: "Built responsibly for mission-driven work, Bonterra Que learns from millions of interactions and over $28B in annual giving to deliver tailored insights and recommend confident, accurate action, always under human guidance.",
    link: "Explore Bonterra Que",
    img: "https://www.bonterratech.com/wp-content/uploads/2026/05/img-AI-built-for-social-good.svg",
  },
  {
    title: "Innovative, ethical software",
    copy: "Connecting nonprofits, funders, volunteers, and partners, our technology turns isolated efforts into shared progress. Built with transparency and integrity at its core, our software helps mission-driven teams work smarter, move faster, and create meaningful change, together.",
    link: "Explore Cybergrants",
    img: "https://www.bonterratech.com/wp-content/uploads/2026/05/img-Ethical-software.png",
  },
  {
    title: "Largest data network in social good, supporting every mission",
    copy: "Backed by the most expansive data network in the industry, Bonterra offers end-to-end tools for fundraising, CSR, grantmaking, and case management, giving doers of good everything they need to take action with accuracy and impact.",
    link: "Explore Apricot",
    img: "https://www.bonterratech.com/wp-content/uploads/2026/06/img-Built-to-support-4.svg",
  },
];

const QUOTES = [
  {
    statNumber: "30",
    statLabel: "Years in service",
    quote:
      "Through the metrics on [Bonterra], we are able to demonstrate how every bit of additional funding would translate into enhanced outputs for our programs.",
    name: "Dipika Shrestha",
    role: "Director of Impact and Evaluation, Arab-American Family Support Center",
    product: "Bonterra Apricot",
    photo:
      "https://www.bonterratech.com/wp-content/uploads/2026/05/img-Arab-American-family-support-center.jpg",
    logo: "https://www.bonterratech.com/wp-content/uploads/2026/05/AAFSC-logo-dark.svg",
    logoAlt: "Arab-American Family Support Center",
  },
  {
    statNumber: "800%",
    statLabel: "More sustainers",
    quote:
      "I wish we had the technology 10 years ago... Anything that is going to improve first-year retention that dramatically, that's like magic.",
    name: "Steven Abrahamson",
    role: "Vice President of Direct Response, Audubon Society",
    product: "Bonterra EveryAction",
    photo:
      "https://www.bonterratech.com/wp-content/uploads/2026/05/img-Bonterra-Audubon-Society-photo.jpg",
    logo: "https://www.bonterratech.com/wp-content/uploads/2026/05/lAudubon-logo-dark.svg",
    logoAlt: "Audubon Society",
  },
  {
    statNumber: "223,013",
    statLabel: "Veterans Served",
    quote:
      "You've got to pay employees with grants, you've got to give veterans and spouses independent services with grants. So, it's just huge to have Bonterra.",
    name: "Justin Verhulst",
    role: "Operations Manager, Mt. Caramel Veterans Service Center",
    product: "Bonterra Apricot",
    photo:
      "https://www.bonterratech.com/wp-content/uploads/2026/05/img-Bonterra-Mt-Caramel-Veterans-Support-Center-photo.jpg",
    logo: "https://www.bonterratech.com/wp-content/uploads/2026/05/MCVSC-logo-dark.svg",
    logoAlt: "Mt. Caramel Veterans Service Center",
  },
  {
    statNumber: "70+",
    statLabel: "Countries",
    quote:
      "Bonterra Grants Management created a one-stop location where we can easily view every step of the process and centrally manage all of our data.",
    name: "Bill Schwarz",
    role: "Digital Product Owner and Program Manager, Sanofi",
    product: "Bonterra CyberGrants",
    photo:
      "https://www.bonterratech.com/wp-content/uploads/2026/05/img-Bonterra-Sanofi-photo.jpg",
    logo: "https://www.bonterratech.com/wp-content/uploads/2026/05/sanofi-logo-dark.svg",
    logoAlt: "Sanofi",
  },
];

const RESOURCE_CARDS = [
  {
    eyebrow: "Resources",
    title:
      "How Bonterra Que in EveryAction powers your year-end fundraising: A practical guide",
    img: "https://www.bonterratech.com/wp-content/uploads/2026/08/How-Bonterra-Que-in-EveryAction-powers-your-year-end-fundraising_Hero-240x196.png",
  },
  {
    eyebrow: "Resources",
    title:
      "How Bonterra Que and Network for Good power your year-end fundraising",
    img: "https://www.bonterratech.com/wp-content/uploads/2026/08/MOFU-anchor_Fundraising-Solutions_FS-Small_MOFU-anchor-asset_Using-Que-in-NFG-for-year-end_NCA_thumbnail-v1-240x196.png",
  },
  {
    eyebrow: "Resources",
    title: "The 30 days before GivingTuesday checklist",
    img: "https://www.bonterratech.com/wp-content/uploads/2026/08/NCA_CSR_MOFU_Checklist_GivingTuesday-Readiness-Checklist-Thumbnail-240x196.png",
  },
];

const FOOTER_COLS: { heading: string; links: string[] }[] = [
  {
    heading: "Products",
    links: [
      "EveryAction",
      "Network for Good",
      "DonorDrive",
      "Mobilize",
      "GiveGab",
      "Nonprofit Hub",
      "Deed",
      "CyberGrants",
      "Apricot",
      "Apricot for Government",
      "Jumpstart",
    ],
  },
  {
    heading: "Solutions by Organization",
    links: ["Nonprofits", "Foundations", "Corporations", "Government"],
  },
  {
    heading: "Solutions by Need",
    links: [
      "Fundraising",
      "Donor Management",
      "Peer-to-Peer Fundraising",
      "Events",
      "Auctions",
      "CSR Software",
      "Employee Engagement",
      "Employee Resource Group (ERG)",
      "Nonprofit CRM",
      "Volunteer Management",
      "Grant Management",
      "Advocacy",
      "Case Management",
      "Bonterra Que: Nonprofit AI",
    ],
  },
  {
    heading: "Solutions by Industry",
    links: [
      "Health + Human Services",
      "Education",
      "Banks + Financial Institutions",
      "Disaster Relief + Response",
      "Medical Affairs + Research",
      "Arts + Cultural Organizations",
    ],
  },
  {
    heading: "Resources",
    links: [
      "Resource Hub",
      "Insights & Learnings",
      "Blog",
      "Events and Webinars",
      "Case Studies",
      "Bonterra Academy",
    ],
  },
  {
    heading: "About Bonterra",
    links: [
      "Why Us",
      "Culture Values + DEIB",
      "Our Responsible AI Commitment",
      "Bonterra Network",
      "Leadership",
      "Careers",
      "News and Press",
      "Partner with Us",
      "Contact",
      "Awards",
    ],
  },
  {
    heading: "Support",
    links: [
      "Community",
      "Get Support",
      "Bonterra Newsletter",
      "Mobilize",
      "NGP VAN",
    ],
  },
];

const SOCIALS = ["Instagram", "LinkedIn", "Facebook", "YouTube", "X"];

const BOTTOM_LINKS = [
  "Privacy Notice",
  "Cookie settings",
  "Accessibility Commitment",
  "Terms of Use",
];

export interface BonterraMockupProps {
  ctaLabel?: string;
}

export default function BonterraMockup({
  ctaLabel = "Request a demo",
}: BonterraMockupProps) {
  return (
    <div className="mk-bonterra">
      {/* ---------- header ---------- */}
      <header className="mk-header">
        <div className="mk-container mk-header__inner">
          <img className="mk-header__logo" src={ASSETS.logo} alt="Bonterra" />
          <nav className="mk-nav">
            {NAV.map((item) => (
              <a key={item} href="#">
                {item}
              </a>
            ))}
          </nav>
          <div className="mk-header__right">
            <a className="mk-btn" href="#">
              {ctaLabel}
            </a>
            <img className="mk-header__search" src={ASSETS.search} alt="Search" />
          </div>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section className="mk-hero">
        <img
          className="mk-hero__bg"
          src={ASSETS.heroTexture}
          alt="Hero Background Texture"
        />

        <div className="mk-container mk-hero__inner">
          <div className="mk-hero__row">
            <div className="mk-hero__col-text">
              <div className="mk-eyebrow mk-hero__eyebrow">
                Powering fundraising, CSR, and case management
              </div>
              <h1 className="mk-h1">
                Social good technology
                <br />
                built for{" "}
                <span className="mk-typewriter">
                  corporations
                  <span className="mk-typewriter__cursor" />
                </span>
              </h1>
              <a className="mk-btn" href="#">
                Get a demo
              </a>
            </div>
            <div className="mk-hero__col-img">
              <img src={ASSETS.heroImg} alt="Hero Illustration" />
            </div>
          </div>
        </div>

        <div className="mk-container mk-hero__cards-wrap">
          <div className="mk-hero__cards">
            {HERO_CARDS.map((card) => (
              <div className="mk-hero__card-col" key={card.title}>
                <div className="mk-card">
                  <span className="mk-card__brand">Bonterra</span>
                  <h2 className="mk-card__title">{card.title}</h2>
                  <p>{card.copy}</p>
                  <span className="mk-link-arrow">Explore solution</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mk-container mk-hero__foot">
          <p>Not sure which fits your mission?</p>
          <a href="#">Talk to an expert.</a>
        </div>
      </section>

      {/* ---------- trust logos ---------- */}
      <section className="mk-logos">
        <div className="mk-container">
          <h2 className="mk-h2">
            Trusted by over 170,000 nonprofits, foundations, and corporate teams
          </h2>
          <div className="mk-logos__row">
            {TRUST_LOGOS.map((logo) => (
              <img
                key={logo.src}
                className={logo.wide ? "mk-logo--tall" : undefined}
                src={logo.src}
                alt={logo.alt}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- audience cards ---------- */}
      <section className="mk-audience">
        <div className="mk-audience__row">
          {AUDIENCE.map((card) => (
            <div
              key={card.title}
              className={
                "mk-aud " + (card.active ? "mk-aud--active" : "mk-aud--collapsed")
              }
            >
              <img src={card.src} alt={card.alt} />
              <div className="mk-aud__scrim" />
              <div className="mk-aud__body">
                <div className="mk-aud__head">
                  <span className="mk-aud__title">{card.title}</span>
                  <img className="mk-aud__arrow" src={ASSETS.arrow} alt="" />
                </div>
                {card.link ? (
                  <span className="mk-link-arrow mk-link-arrow--light">
                    {card.link}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- stats ---------- */}
      <section className="mk-stats">
        <div className="mk-container">
          <h2 className="mk-h2">The network powering social good</h2>
          <div className="mk-stats__row">
            {STATS.map((stat) => (
              <div className="mk-stats__col" key={stat.label}>
                <p className="mk-stats__stat">
                  {stat.prefix ? (
                    <span className="mk-stats__affix">{stat.prefix}</span>
                  ) : null}
                  <span className="mk-stats__number">{stat.number}</span>
                  <span className="mk-stats__affix">{stat.suffix}</span>
                </p>
                <p className="mk-stats__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- feature rows ---------- */}
      <section className="mk-features">
        <div className="mk-container">
          {FEATURES.map((feature) => (
            <div className="mk-feature" key={feature.title}>
              <div className="mk-feature__text">
                <h3 className="mk-h3">{feature.title}</h3>
                <p>{feature.copy}</p>
                <span className="mk-link-arrow">{feature.link}</span>
              </div>
              <div className="mk-feature__media">
                <img src={feature.img} alt={feature.title} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- customer quotes ---------- */}
      <section className="mk-quotes">
        <div className="mk-container">
          {QUOTES.map((quote) => (
            <div className="mk-quote" key={quote.name}>
              <div className="mk-quote__left">
                <img src={quote.photo} alt="" />
                <div className="mk-quote__stat">
                  <div className="mk-quote__stat-number">
                    {quote.statNumber}
                  </div>
                  <div className="mk-quote__stat-label">{quote.statLabel}</div>
                </div>
              </div>
              <div className="mk-quote__right">
                <blockquote>{quote.quote}</blockquote>
                <p className="mk-quote__attr">
                  <strong>{quote.name}</strong>
                  {quote.role}
                </p>
                <div className="mk-quote__products">
                  <span className="mk-chip">Products</span>
                  <span className="mk-quote__product-name">
                    {quote.product}
                  </span>
                </div>
                <img
                  className="mk-quote__logo"
                  src={quote.logo}
                  alt={quote.logoAlt}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- text ticker ---------- */}
      <section className="mk-ticker">
        <div className="mk-ticker__wrap">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div className="mk-ticker__text" key={i}>
              For the{" "}
              <span className="mk-underline-greatest">greatest</span> good
            </div>
          ))}
        </div>
      </section>

      {/* ---------- featured resources ---------- */}
      <section className="mk-resources">
        <div className="mk-container">
          <h2>The latest from our social good ecosystem</h2>
          <div className="mk-resources__grid">
            <article className="mk-res-feature">
              <img
                src="https://www.bonterratech.com/wp-content/uploads/2026/08/NCA_CSR_MOFU_Checklist_GivingTuesday-Readiness-Checklist-Thumbnail-669x320.png"
                alt="The 30 days before GivingTuesday: A CSR readiness checklist"
              />
              <div className="mk-res-feature__body">
                <span className="mk-eyebrow">Blog</span>
                <h3>
                  The 30 days before GivingTuesday: A CSR readiness checklist
                </h3>
              </div>
            </article>

            <div className="mk-res-list">
              {RESOURCE_CARDS.map((card) => (
                <article className="mk-res-card" key={card.title}>
                  <img src={card.img} alt={card.title} />
                  <div className="mk-res-card__body">
                    <span className="mk-eyebrow">{card.eyebrow}</span>
                    <h3>{card.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="mk-resources__foot">
            <span className="mk-link-arrow">Browse resources</span>
          </div>
        </div>
      </section>

      {/* ---------- footer CTA ---------- */}
      <section className="mk-cta">
        <div className="mk-container">
          <p className="mk-eyebrow">Ready to get started?</p>
          <h2 className="mk-h2">Move your mission forward.</h2>
          <a className="mk-btn" href="#">
            {ctaLabel}
          </a>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="mk-footer">
        <div className="mk-container">
          <div className="mk-footer__top">
            <div className="mk-footer__brand">
              <img src={ASSETS.logo} alt="Bonterra" />
              <div className="mk-footer__social">
                {SOCIALS.map((social) => (
                  <a key={social} href="#">
                    {social}
                  </a>
                ))}
              </div>
              <p className="mk-footer__address">
                Austin, TX
                <br />
                10901 Stonelake Blvd.
                <br />
                Suite 199
                <br />
                Texas 78759
              </p>
            </div>

            <div className="mk-footer__blurbs">
              <div className="mk-footer__blurb">
                <h3>Partner with us</h3>
                <p>
                  Together, we can drive more impact for communities around the
                  world.
                </p>
                <span className="mk-link-arrow mk-link-arrow--light">
                  Become a partner
                </span>
              </div>
              <div className="mk-footer__blurb">
                <h3>Let&apos;s get started</h3>
                <p>
                  Get answers from Bonterra experts about the best tools for
                  your teams.
                </p>
                <span className="mk-link-arrow mk-link-arrow--light">
                  Request a demo
                </span>
              </div>
            </div>
          </div>

          <div className="mk-footer__cols">
            {FOOTER_COLS.map((col) => (
              <div className="mk-footer__col" key={col.heading}>
                <h4>{col.heading}</h4>
                <ul>
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mk-footer__bottom">
            {BOTTOM_LINKS.map((link) => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
