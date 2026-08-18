import * as React from "react";
import "./index.css";

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* The captured page icons are <use href="#icon-..."> sprite refs that  */
/* do not exist outside hook.co, so each is redrawn inline at the       */
/* captured size with markup matching the icon's evident meaning.       */
/* ------------------------------------------------------------------ */

const IconChevronDown = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3.5 6L8 10.5L12.5 6" />
  </svg>
);

const IconArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 8H13" />
    <path d="M8.5 3.5L13 8L8.5 12.5" />
  </svg>
);

const IconHealth = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 13.5S1.75 10 1.75 5.9A3.15 3.15 0 0 1 8 4.6a3.15 3.15 0 0 1 6.25 1.3C14.25 10 8 13.5 8 13.5Z" />
  </svg>
);

const IconUser = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="8" cy="5.5" r="2.75" />
    <path d="M2.75 13.5a5.6 5.6 0 0 1 10.5 0" />
  </svg>
);

const IconChatsCircle = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4.6 11.4a5 5 0 1 1 2 1.9l-2.6.7.6-2.6Z" />
    <path d="M10.6 3.1a4.6 4.6 0 0 1 2.6 8" />
  </svg>
);

const IconQuote = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M6.4 3.2v3.1a3.1 3.1 0 0 0-1.9 2.9h1.9V15H1V9.6c0-3.3 2.1-5.8 5.4-6.4Zm8.6 0v3.1a3.1 3.1 0 0 0-1.9 2.9H15V15H9.6V9.6c0-3.3 2.1-5.8 5.4-6.4Z" />
  </svg>
);

/* Progress ring (ic1) captured verbatim from the page. */
const ProgressDisc = () => (
  <svg width="36" height="36" aria-hidden="true">
    <circle
      cx="18"
      cy="18"
      r="17"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="2"
      fill="none"
      strokeDasharray="106.81415022205297"
      strokeDashoffset="26.7"
      style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = ["Product", "Product", "Product", "Product"];

const USE_CASES: Array<{
  title: string;
  copy: string;
  icon: React.ReactNode;
  active: boolean;
}> = [
  {
    title: "Instant advice on any account",
    copy:
      "Get instant insight on risk, stakeholders, product usage or renewal blockers, and what to do about it. Our agents help you focus where it counts.",
    icon: <IconHealth size={20} />,
    active: true
  },
  {
    title: "Meeting prep in seconds, not hours",
    copy:
      "Step into every meeting with full context. Hook knows who you're meeting, what's changed, and where to focus, no digging required.",
    icon: <IconUser size={20} />,
    active: false
  },
  {
    title: "Answers to every board question in minutes.",
    copy:
      "Understand what's working, what's not, and where revenue risk lives, without chasing. Hook transforms all CS work into clean, executive-ready insights.",
    icon: <IconChatsCircle size={20} />,
    active: false
  }
];

const CAROUSEL_IMAGES = [
  "https://a.storyblok.com/f/330017/1875x2025/c3abe333a6/result-8.jpg/m/1400x0/filters:quality(90):format(webp)",
  "https://a.storyblok.com/f/330017/1875x2025/e9d9d0918d/result-9.jpg/m/1400x0/filters:quality(90):format(webp)",
  "https://a.storyblok.com/f/330017/1875x2025/9eaff9520b/result-13.jpg/m/1400x0/filters:quality(90):format(webp)"
];

const G2_LOGO =
  "https://a.storyblok.com/f/330017/116x150/ab48167a3d/79715ea924aff9cf1915dc2ea767e26e53945ada.png/m/1400x0/filters:quality(90):format(webp)";

const STEPS: Array<{ title: string; copy: string; img: string }> = [
  {
    title: "Connect your data",
    copy:
      "We integrate with your existing systems, from product and revenue data to customer interactions, to build a complete picture of your customer relationships, with minimal lift from your team.",
    img:
      "https://a.storyblok.com/f/330017/1632x1200/8c150168d2/frame-2117132552-1.jpg/m/1400x0/filters:quality(90):format(webp)"
  },
  {
    title: "Agents analyze data and take action",
    copy:
      "Our AI agents start analyzing your data from day one to drive customer activation, and predict and act on risk, renewals and expansion. They can automate actions powered by real-time customer context, and suggest targeted action Plaibooks to drive growth. No in-house data science required.",
    img:
      "https://a.storyblok.com/f/330017/1088x800/5314349e82/frame-2117132553.jpg/m/1400x0/filters:quality(90):format(webp)"
  },
  {
    title: "Humans supervise",
    copy:
      "We use your data to predict your renewals and expansions, automatically suggesting actions to increase revenue. We customise our predictions to you and your customers without expensive data science teams.",
    img:
      "https://a.storyblok.com/f/330017/1632x1440/586f80c28c/frame-2117132553-2.jpg/m/1400x0/filters:quality(90):format(webp)"
  }
];

const FOOTER_PRODUCT_LINKS = [
  { label: "Product Overview", href: "/products" },
  { label: "Product Overview", href: "/products" },
  { label: "Product Overview", href: "/products" },
  { label: "Product Overview", href: "/products" }
];

const FOOTER_ABOUT_LINKS = [
  { label: "Careers", href: "/careers" },
  { label: "Careers", href: "/careers" },
  { label: "Careers", href: "/careers" },
  { label: "Careers", href: "/careers" },
  { label: "Careers", href: "/careers" }
];

const FOOTER_LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" }
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const HookMockup: React.FC = () => {
  return (
    <div className="hk-root">
      {/* ============ 00 Header ============ */}
      <header className="hk-header">
        <div className="hk-header-inner">
          <div className="hk-grid">
            <div className="hk-header-row">
              <div className="hk-header-logo-col">
                <a className="hk-logo" href="/">
                  <span className="hk-logo-word">Hook</span>
                </a>
              </div>
              <div className="hk-header-nav-col">
                <div className="hk-header-navigation">
                  <nav className="hk-nav">
                    <ul className="hk-nav-list">
                      {NAV_ITEMS.map((label, i) => (
                        <li className="hk-nav-item" key={i}>
                          <button className="hk-nav-toggle" type="button">
                            {label}
                            <IconChevronDown size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="hk-header-actions">
                    <a className="hk-btn-blank" href="https://app.hook.co/login">
                      Sign In
                    </a>
                    <a className="hk-btn-dark-filled" href="/contact">
                      Get a demo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ 01 Chat with your data ============ */}
      <section className="hk-sec-chat">
        <div className="hk-grid">
          <div className="hk-row hk-row--pad">
            <div className="hk-chat-col-left">
              <p className="hk-eyebrow-dark">AI Powered</p>
              <h2 className="hk-h2-serif">Chat with your data. Get clarity instantly.</h2>
              <p className="hk-chat-lede">
                Get deep context from intelligent agents analyzing every customer touchpoint,
                product usage, meetings, and support. Act instantly with a single prompt.
              </p>
              <ul className="hk-usecases">
                {USE_CASES.map((uc, i) => (
                  <li key={i}>
                    <div
                      className={
                        uc.active
                          ? "hk-usecase-trigger hk-usecase-trigger--active"
                          : "hk-usecase-trigger"
                      }
                    >
                      <span className="hk-progress-circle">
                        {uc.active ? (
                          <span className="hk-progress-disc">
                            <ProgressDisc />
                          </span>
                        ) : null}
                        <span className="hk-indicator-icon">{uc.icon}</span>
                      </span>
                      <div className="hk-usecase-body">
                        <p className="hk-usecase-title">{uc.title}</p>
                        <p className="hk-usecase-copy">{uc.copy}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hk-chat-col-right">
              <div className="hk-carousel-wrapper">
                <div className="hk-carousel-viewport">
                  <div className="hk-carousel-container">
                    {CAROUSEL_IMAGES.map((src, i) => (
                      <div className="hk-carousel-slide" key={i}>
                        <img src={src} alt="" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              <div className="hk-carousel-dots">
                {CAROUSEL_IMAGES.map((_, i) => (
                  <span
                    key={i}
                    className={
                      i === 0 ? "hk-carousel-dot hk-carousel-dot--active" : "hk-carousel-dot"
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 Go live in 7 days (light band) ============ */}
      <section className="hk-sec-steps">
        <div className="hk-grid">
          <div className="hk-row hk-row--pad">
            <div className="hk-steps-col">
              <header className="hk-steps-header">
                <p className="hk-eyebrow-light">Get started</p>
                <h3 className="hk-steps-title">
                  <span>Go live in 7 days</span>
                  <IconArrowRight size={56} />
                </h3>
                <p className="hk-steps-content">
                  Quickly onboard your first agent. Scale from there, no ramp, no delay.
                </p>
                <div className="hk-steps-actions">
                  <a className="hk-btn-light-filled" href="/contact">
                    Get a demo
                    <IconArrowRight size={16} />
                  </a>
                </div>
                <div className="hk-rated">
                  <h6 className="hk-rated-title">rated 4.7/5 on g2</h6>
                  <div className="hk-rated-logos">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div className="hk-rated-logo" key={i}>
                        <img src={G2_LOGO} alt="" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              </header>
            </div>

            <div className="hk-steps-col">
              <ol className="hk-steps-list">
                {STEPS.map((step, i) => (
                  <li className="hk-step" key={i}>
                    <span className="hk-step-num">{i + 1}</span>
                    <div>
                      <h4 className="hk-step-title">{step.title}</h4>
                      <p className="hk-step-copy">{step.copy}</p>
                      <div className="hk-step-image">
                        <img src={step.img} alt="" loading="lazy" />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 03 Testimonial ============ */}
      <section className="hk-sec-testimonial">
        <div className="hk-grid">
          <div className="hk-row hk-row--pad">
            <div className="hk-testimonial-col">
              <div className="hk-testimonial">
                <div className="hk-grid">
                  <div className="hk-row">
                    <div className="hk-testimonial-left">
                      <div className="hk-testimonial-eyebrow">
                        <span className="hk-quote-icon">
                          <IconQuote size={24} />
                        </span>
                        <p className="hk-testimonial-label">Testimonial</p>
                      </div>
                      <h4 className="hk-testimonial-quote">
                        Hook has become the place my team goes to prepare, prioritise and
                        understand their customers.
                      </h4>
                      <p className="hk-testimonial-attrib">
                        Head of Customer Success, hackajob
                      </p>
                      <div className="hk-testimonial-logo">
                        <img
                          src="https://a.storyblok.com/f/330017/320x153/5086dad097/hackajob.png/m/1400x0/filters:quality(90):format(webp)"
                          alt="hackajob"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="hk-testimonial-right">
                      <div className="hk-testimonial-media">
                        <img
                          src="https://a.storyblok.com/f/330017/1350x1374/d257c0a93e/screenshot-2025-07-15-at-13-04-15-1-1.png/m/1400x0/filters:quality(90):format(webp)"
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 04 Footer ============ */}
      <footer className="hk-footer">
        <div className="hk-footer-outer">
          <div className="hk-footer-container">
            <div className="hk-grid">
              <div className="hk-footer-row">
                <div className="hk-footer-col">
                  <a className="hk-footer-logo" href="/">
                    <span className="hk-footer-logo-word">Hook</span>
                  </a>
                </div>

                <div className="hk-footer-col">
                  <nav>
                    <h5 className="hk-list-title">Product</h5>
                    <ul className="hk-list">
                      {FOOTER_PRODUCT_LINKS.map((l, i) => (
                        <li className="hk-list-item" key={i}>
                          <a href={l.href}>{l.label}</a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                <div className="hk-footer-col">
                  <nav>
                    <h5 className="hk-list-title">About Us</h5>
                    <ul className="hk-list">
                      {FOOTER_ABOUT_LINKS.map((l, i) => (
                        <li className="hk-list-item" key={i}>
                          <a href={l.href}>{l.label}</a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                <div className="hk-footer-col">
                  <address className="hk-footer-address">
                    21 Great Winchester St
                    <br />
                    London, EC2N 2JA
                  </address>
                  <p className="hk-footer-contact">
                    <a href="mailto:contact@hook.co">contact@hook.co</a>
                  </p>
                  <a className="hk-footer-cookies" href="#manage-cookies">
                    Manage Cookies
                  </a>
                </div>
              </div>
            </div>

            <hr className="hk-footer-border" />

            <div className="hk-grid">
              <div className="hk-footer-bottom-row">
                <div className="hk-footer-bottom-col">
                  <nav>
                    <ul className="hk-list-row">
                      {FOOTER_LEGAL_LINKS.map((l, i) => (
                        <li className="hk-list-item" key={i}>
                          <a href={l.href}>{l.label}</a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
                <div className="hk-footer-bottom-col hk-footer-bottom-col--right">
                  <p className="hk-footer-copy">&copy; Hook Technology Ltd 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HookMockup;
