import React from "react"
import "./index.css"

type Props = {
  componentId?: string
}

const CDN = "https://cdn.prod.website-files.com/601fab1cb6249b3cc9f592f0"

const ZuddlWordmark = () => (
  <svg
    className="mz-wordmark"
    xmlns="http://www.w3.org/2000/svg"
    width="77"
    height="24"
    viewBox="0 0 77 24"
    fill="none"
    aria-label="Zuddl"
    role="img"
  >
    <g clipPath="url(#mz_clip)">
      <path d="M45.8119 9.09237V0.0126953H50.296C50.296 0.0126953 50.3473 11.2079 50.2572 16.7407C50.1277 20.7998 46.5489 23.8372 42.4914 23.992C38.1108 24.1604 35.2925 21.7045 34.3377 19.2208C33.0319 15.8333 33.4198 12.6537 35.7846 9.83596C37.7742 7.43326 42.4392 6.23055 45.8119 9.09237ZM45.6823 15.6973C45.6823 13.4873 44.1579 11.9227 42.0261 11.9101C39.8547 11.8975 38.2269 13.5134 38.2143 15.6847C38.2017 17.8561 39.8161 19.5107 41.9614 19.5368C44.1319 19.5458 45.6959 17.9299 45.6823 15.6928V15.6973Z" fill="#320972" />
      <path d="M64.6663 9.11298V0H69.2053V0.801203C69.2053 5.88208 69.2178 10.9485 69.2053 16.0294C69.1927 20.4405 65.7426 23.8245 61.3232 23.9793C56.5934 24.1477 53.5185 21.1616 52.7303 17.7488C51.709 13.353 53.9703 8.94554 57.9766 7.75634C60.3505 7.05777 62.6244 7.27742 64.6663 9.11298ZM57.1469 15.6801C57.1334 17.8911 58.71 19.5061 60.8805 19.5322C63.0258 19.5583 64.641 17.9037 64.6285 15.7062C64.6159 13.5088 63.0645 11.9181 60.9453 11.9181C58.7604 11.8929 57.1586 13.4827 57.1469 15.6801Z" fill="#320972" />
      <path d="M14.2959 19.5197C14.2959 20.5279 14.2832 22.4409 14.2832 23.5914H12.7067C9.86401 23.5914 7.02131 23.604 4.17861 23.5914C2.13679 23.5788 0.714994 22.6219 0.211064 20.9672C-0.344158 19.1056 0.184967 17.4645 1.92983 16.3761C3.57119 15.3553 5.34125 14.5279 7.0465 13.6097C7.48655 13.3775 7.95178 13.2091 8.35222 12.9256C8.40549 12.8844 8.45328 12.8366 8.4944 12.7833C8.55161 12.7036 8.58634 12.6099 8.595 12.5121C8.60366 12.4143 8.58591 12.316 8.54362 12.2274C8.50133 12.1389 8.43603 12.0633 8.35457 12.0086C8.27309 11.9538 8.17843 11.922 8.08046 11.9164H8.06786C5.87127 11.8912 3.65848 11.9038 1.45199 11.9038H0.469327V7.82129H9.69574C10.1596 7.82516 10.6223 7.86823 11.0789 7.95002C12.4611 8.18228 13.5202 8.88085 13.9729 10.2636C14.4642 11.7373 14.2185 13.1722 13.0297 14.1679C11.8924 15.1248 10.574 15.8873 9.29529 16.6498C8.22264 17.2799 7.0861 17.7877 5.99995 18.4079C5.95829 18.4339 5.91939 18.464 5.88386 18.4979C5.79586 18.5758 5.73338 18.6784 5.70458 18.7924C5.67577 18.9063 5.68199 19.0263 5.72243 19.1366C5.76285 19.247 5.83562 19.3426 5.9312 19.4109C6.02679 19.4793 6.14075 19.5172 6.25822 19.5197L6.79814 19.5323C8.507 19.5584 12.6158 19.5062 14.2959 19.5197Z" fill="#320972" />
      <path d="M26.8568 7.87198H31.3922C31.3796 8.05202 31.4957 14.8658 31.224 18.2003C30.9656 21.406 28.149 23.7466 24.8663 23.9401C22.2828 24.0949 19.8918 23.6295 18.083 21.5482C17.1831 20.5012 16.5838 19.2733 16.5452 17.9293C16.4552 14.5985 16.5191 11.2586 16.5191 7.85938H20.977V8.7641C20.9896 11.3748 20.951 13.9854 21.0032 16.5961C21.0418 18.7566 22.8506 20.0169 24.9185 19.3751C26.055 19.0258 26.7794 18.1724 26.8082 16.9445C26.8568 14.2582 26.882 10.5736 26.8568 7.87198Z" fill="#320972" />
      <path d="M75.7906 23.5913H71.3975V0H75.7906V23.5913Z" fill="#320972" />
    </g>
    <defs>
      <clipPath id="mz_clip">
        <rect width="76.5" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const NAV_LINKS = ["Platform", "Solutions", "Resources", "Pricing"]

const PARTNER_LOGOS = [
  { src: `${CDN}/6a797850c07c88928a9d4b9c_Logo_Clay.png`, alt: "Clay" },
  { src: `${CDN}/6a79785187bc33859b7bdd8d_Logo_Check%20Point.png`, alt: "Check Point" },
  { src: `${CDN}/6a7978522e5bff50f48a64bd_Logo_Postman.png`, alt: "Postman" },
  { src: `${CDN}/6a797852f641989f0a7e2412_Logo_Five9.png`, alt: "Five9" },
  { src: `${CDN}/6a7978552e71ebc0cafe2e62_Logo_Zillow.png`, alt: "Zillow" },
  { src: `${CDN}/6a7978520df2e59edbc97351_Logo_Mistral%20AI.png`, alt: "Mistral AI" },
  { src: `${CDN}/6a7978553e97bb5bd4e68cb0_Logo_Tik%20Tok.png`, alt: "TikTok" },
  { src: `${CDN}/6a7978503189e2190a98cfa9_Logo_Anaconda.png`, alt: "Anaconda" },
]

const FEATURES = [
  "Landing Page Builder",
  "Embeddable Widgets",
  "Branding",
  "Communications",
  "Ticketing & Discounting",
  "Flow Builder",
  "Approval Flows",
  "Sourcing & Room Management",
]

const TESTIMONIALS = [
  {
    name: "Brad Brown",
    title: "Senior Director of Marketing and Sales Ops",
    quote: "No other tool can provide the same opportunity and results as Zuddl",
    body:
      "It would have taken a herculean manual lift to accomplish the things that Zuddl made possible for us through the platform. Nobody is doing it remotely close to how Zuddl is doing it.",
    stat: "46%",
    statLabel: "Growth in new pipeline from user conference SaaSMe'23 as compared to 2022",
  },
  {
    name: "Asher Mathew",
    title: "Co-Founder & Chief Executive Officer",
    quote: "Catalyst '23 was an attendee-centric, world-class conference",
    body:
      "Every bit of our in-person conference was made seamless, easy, and personalized for attendees, from the conference app to check-in (which took less than 60 seconds per person!), thanks to Zuddl.",
    stat: "98%",
    statLabel: "Attendees used the app to navigate the venue, receive updates, and network",
  },
  {
    name: "Hillary Foster",
    title: "Global Events & Sponsorship Lead",
    quote: "Zuddl is the one tool in my tool chain that works every single time",
    body:
      "With Zuddl, we are able to make our webinars look better, be more interactive, and get access to better data. It lets us really take our program to the next level and stand out in our industry.",
    stat: "10%",
    statLabel: "Increase in webinar registrations MoM",
  },
]

const MockupZuddl = ({ componentId = "mockup-zuddl-limio" }: Props) => {
  return (
    <div className="mz-root" id={componentId}>
      {/* NAV */}
      <header className="mz-nav">
        <div className="mz-nav-inner">
          <a className="mz-brand" href="#" aria-label="Zuddl home">
            <ZuddlWordmark />
          </a>
          <nav className="mz-nav-links">
            {NAV_LINKS.map((l) => (
              <span className="mz-nav-link" key={l}>
                {l}
                {l !== "Pricing" && <span className="mz-caret">▾</span>}
              </span>
            ))}
          </nav>
          <div className="mz-nav-actions">
            <span className="mz-login">Login</span>
            <button className="mz-btn mz-btn-primary mz-btn-sm" type="button">
              Book a Demo
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mz-hero">
        <div className="mz-container mz-hero-inner">
          <p className="mz-eyebrow">Ticketing and Registration</p>
          <h1 className="mz-hero-title">
            The World&rsquo;s Most Flexible Registration and Ticketing System
          </h1>
          <p className="mz-hero-sub">
            Kick off your attendee&rsquo;s journey with a beautifully branded event registration
            experience that is personalized, easy to use, scalable, and reliable.
          </p>
          <div className="mz-hero-cta">
            <button className="mz-btn mz-btn-primary mz-btn-lg" type="button">
              Book a Demo <span className="mz-arrow">›</span>
            </button>
          </div>
          <div className="mz-hero-widget">
            <div className="mz-widget-tabs">
              <span className="mz-widget-brand">FrontEX</span>
              <span className="mz-widget-brand">Tech Converge</span>
              <span className="mz-widget-nav">All</span>
              <span className="mz-widget-nav">Sessions</span>
              <span className="mz-widget-nav">FAQ</span>
              <button className="mz-btn mz-btn-teal mz-btn-sm" type="button">
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO STRIP */}
      <section className="mz-logos">
        <div className="mz-container">
          <p className="mz-logos-title">Used by event teams from</p>
          <div className="mz-logos-row">
            {PARTNER_LOGOS.map((logo) => (
              <img className="mz-logo-img" key={logo.alt} src={logo.src} alt={logo.alt} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mz-features">
        <div className="mz-container">
          <h2 className="mz-section-title">
            All your Registration and Ticketing Needs in One Platform
          </h2>
          <p className="mz-section-sub">
            Only Zuddl lets you build complex registration and ticketing flows that work perfectly
            for any event type
          </p>
          <div className="mz-feature-grid">
            <ul className="mz-feature-list">
              {FEATURES.map((f, i) => (
                <li className={`mz-feature-item${i === 0 ? " is-active" : ""}`} key={f}>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mz-feature-panel">
              <div className="mz-feature-panel-inner">
                <h3 className="mz-feature-panel-title">Dream It. Build It.</h3>
                <p className="mz-feature-panel-text">
                  Stand out from the very first point of contact with your audience by using our
                  easy-to-use and customized landing page builder.
                </p>
                <button className="mz-btn mz-btn-outline mz-btn-sm" type="button">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mz-testimonials">
        <div className="mz-container">
          <h2 className="mz-section-title">Don&rsquo;t just take our word for it!</h2>
          <div className="mz-testimonial-grid">
            {TESTIMONIALS.map((t) => (
              <figure className="mz-testimonial-card" key={t.name}>
                <blockquote className="mz-testimonial-quote">{t.quote}</blockquote>
                <p className="mz-testimonial-body">{t.body}</p>
                <div className="mz-testimonial-stat">
                  <span className="mz-stat-num">{t.stat}</span>
                  <span className="mz-stat-label">{t.statLabel}</span>
                </div>
                <figcaption className="mz-testimonial-author">
                  <span className="mz-author-name">{t.name}</span>
                  <span className="mz-author-title">{t.title}</span>
                </figcaption>
                <span className="mz-read-case">Read Case Study ›</span>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="mz-cta">
        <div className="mz-container mz-cta-inner">
          <h2 className="mz-cta-title">Ready to build your dream event?</h2>
          <button className="mz-btn mz-btn-primary mz-btn-lg" type="button">
            Book a Demo <span className="mz-arrow">›</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mz-footer">
        <div className="mz-container mz-footer-inner">
          <ZuddlWordmark />
          <span className="mz-footer-copy">©2026 Joyn Experiences Inc</span>
        </div>
      </footer>
    </div>
  )
}

export default MockupZuddl
