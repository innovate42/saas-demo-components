import React from "react";
import "./index.css";

/**
 * Full-page visual replica of the Hallmark Health Care Solutions homepage
 * (https://hallmarkhcs.com/). Visual only, no interactive behaviour.
 * Geometry matched to live measurements taken at a 1280px viewport.
 */

export interface MockupHallmarkProps {
  showAnnouncementBar?: boolean;
  showNav?: boolean;
  showFooter?: boolean;
}

const ASSET = "https://hallmarkhcs.com/wp-content/uploads";

/* -- Section 5 icons: extracted verbatim from the live page -------------- */

const IconConnect = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M91.9997 25.6551L90.7281 23.5964L50.039 48.3308L9.31963 23.5964L8.0481 25.6551L47.7079 49.7537L8.0481 73.8221L9.31963 75.8807L50.039 51.1766L90.7281 75.8807L91.9997 73.8221L52.3399 49.7537L91.9997 25.6551Z"
      fill="#00EADE"
    />
    <path d="M50.1013 13.0913H47.6793V42.488H50.1013V13.0913Z" fill="white" />
    <path d="M50.1013 56.9895H47.6793V86.3862H50.1013V56.9895Z" fill="white" />
  </svg>
);

const IconSee = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M70.8206 67.123C66.0116 67.123 63.4329 58.3762 63.4329 50.1869C63.4329 41.9976 66.0116 33.2507 70.8206 33.2507C75.6297 33.2507 78.2084 41.9976 78.2084 50.1869C78.2084 58.3762 75.6297 67.123 70.8206 67.123ZM70.8206 36.0037C68.9388 36.0037 66.2207 41.5097 66.2207 50.152C66.2207 58.7944 68.9388 64.3004 70.8206 64.3004C72.7024 64.3004 75.4206 58.7944 75.4206 50.152C75.4206 41.5097 72.7024 36.0037 70.8206 36.0037Z"
      fill="white"
    />
    <path
      d="M85.422 50.1868C85.422 39.1748 83.7841 28.7901 80.7872 20.9145L97.7234 14.2236L96.7128 11.6449L79.7418 18.3705C76.6403 11.5752 72.6328 7.84644 68.3116 7.84644C63.9905 7.84644 59.0769 12.4115 55.8709 20.7402C54.93 23.1796 54.1285 25.8977 53.4315 28.7901L2.62305 48.8974V51.4762L53.4663 71.6184C54.1285 74.5107 54.9648 77.194 55.9057 79.6683C59.1117 87.9969 63.5374 92.562 68.3465 92.562C73.1555 92.562 76.71 88.8333 79.8115 82.0379L96.7825 88.7636L97.793 86.1848L80.8569 79.494C83.8538 71.6184 85.4917 61.2685 85.4917 50.2565L85.422 50.1868ZM82.6341 50.1868C82.6341 61.7912 80.8569 71.5138 78.2085 78.4137L55.7663 69.5275C54.5815 63.9518 53.8845 57.4352 53.8845 50.1868C53.8845 42.9384 54.5815 36.387 55.7663 30.8113L78.2085 21.925C80.8569 28.825 82.6341 38.5824 82.6341 50.1868ZM52.6997 32.031C51.6542 37.6415 51.0967 43.8096 51.0967 50.1868C51.0967 56.564 51.6542 62.7321 52.6997 68.3078L6.87451 50.152L52.6997 31.9961V32.031ZM68.2768 10.5994C71.3782 10.5994 74.5494 13.7706 77.1282 19.3463L56.5678 27.5007C59.3557 16.9069 63.9208 10.5994 68.2768 10.5994ZM68.2768 89.7393C63.9208 89.7393 59.3557 83.4319 56.5678 72.838L77.1282 80.9925C74.5494 86.603 71.3434 89.7393 68.2768 89.7393Z"
      fill="#00EADE"
    />
  </svg>
);

const IconAct = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="156"
    height="100"
    viewBox="0 0 156 100"
    fill="none"
    aria-hidden="true"
  >
    <g clipPath="url(#hm_clip_act)">
      <path
        d="M150.25 83.0311L33.6055 52.2525V48.5896L150.25 17.811L151.249 21.474L41.5499 50.4448L151.249 79.3681L150.25 83.0311Z"
        fill="white"
      />
      <path
        d="M107.344 -4.97568L105.06 -7.97266L31.6102 47.3526L6.20724 28.229L3.92383 31.2735L29.3268 50.4447L3.92383 69.5683L6.20724 72.6129L31.6102 53.4893L105.06 108.862L107.344 105.818L33.8461 50.4447L107.344 -4.97568Z"
        fill="#00EADE"
      />
    </g>
    <defs>
      <clipPath id="hm_clip_act">
        <rect width="156" height="100" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/* -- Content ------------------------------------------------------------- */

const NAV_LINKS = ["About Us", "Resources", "News"];

const TRUST_LOGOS = [
  { src: `${ASSET}/Logo-12.png`, alt: "Health system customer logo", square: false },
  { src: `${ASSET}/trinity-health-logo-1.png`, alt: "Trinity Health", square: false },
  { src: `${ASSET}/images-arbit-health.jpg`, alt: "Arbit Health", square: false },
  {
    src: `${ASSET}/United-Health-Services-Logo.jpeg`,
    alt: "United Health Services",
    square: true,
  },
  { src: `${ASSET}/Millennium-PG.png`, alt: "Millennium Physician Group", square: false },
];

const QUOTES = [
  {
    text:
      "Hallmark has given us the ability to come up with solutions quicker and get things done faster. Anything we have asked them to do, they have done and come out with an amazing product in the end.",
    name: "Tonya Leonard",
    role: "System Director, Provider Compensation",
    logo: `${ASSET}/Logo-12.png`,
  },
  {
    text:
      "When our workforce is happy when they're at work, that's how we get the best patient care. Hallmark helps us be flexible and adapt to what our workforce is asking for.",
    name: "",
    role: "",
    logo: `${ASSET}/trinity-health-logo-1.png`,
  },
  {
    text:
      "In less than two years, we reduced contract labor spend by $4M and decreased reliance on travel nurses by nearly 40%. Growing our internal resource pool to over 110 nurses has driven more than $2.3M in cost avoidance to date.",
    name: "Jerikah Gilliland",
    role: "Chief Nursing Officer",
    logo: `${ASSET}/images-arbit-health.jpg`,
  },
  {
    text:
      "We looked at a lot of vendors, but Hallmark I considered the Cadillac of all the ones we looked at. They have all the bells and whistles.",
    name: "Monica Herzing",
    role: "Senior Director, Physician Financial Services",
    logo: `${ASSET}/United-Health-Services-Logo.jpeg`,
  },
  {
    text:
      "Workforce needs are constantly changing, and staying market competitive requires regular adjustments to our compensation strategy. Managing that complexity would be incredibly difficult without Hallmark.",
    name: "Jie Lie",
    role: "Vice President, Provider Compensation",
    logo: `${ASSET}/Millennium-PG.png`,
  },
];

const PROBLEM_CARDS = [
  {
    title: "Systemic workforce shortage",
    body:
      "Reactive utilization exacerbates shortages, while lack of flexibility damages morale and hastens attrition.",
    stat: "The U.S. could face a shortage of up to 124,000 physicians by 2034. (AAMC)",
  },
  {
    title: "Heavy administrative burden",
    body:
      "Outdated processes and manual workflows reduce valuable time at the bedside.",
    stat: "30%+ of nursing time is lost to administrative work. (McKinsey)",
  },
  {
    title: "Pace of change is accelerating",
    body:
      "The industry is changing fast. Manual workflows and status quo IT systems cannot keep up.",
    stat: "80% of leaders cite workforce as a top risk. (ACHE)",
  },
  {
    title: "Limited visibility",
    body:
      "Healthcare environments often struggle with fragmented, biased, or incomplete datasets.",
    stat: "(HIMSS)",
  },
];

const HIW_CARDS = [
  {
    icon: <IconConnect />,
    title: "Connect",
    body:
      "Move from fragmented tools to a unified view by integrating data from systems of record (EHR, ERP, scheduling, HRIS, payroll) into a single operating layer.",
  },
  {
    icon: <IconSee />,
    title: "See",
    body:
      "Real-time industry data is embedded into the platform, and insights into cost, capacity, incentives, preferences, and performance across your workforce become visible.",
  },
  {
    icon: <IconAct />,
    title: "Act",
    body:
      "We pair AI-enabled technology with expert services to give leaders the clarity to anticipate needs, model tradeoffs, and act preemptively.",
  },
];

const MODULES = [
  {
    title: "Flexible Workforce Suite",
    body:
      "Move from reactive decisions to resilient operations by improving workforce agility, reducing premium labor dependence, and optimizing internal capacity.",
    cta: "Learn More About Flexible Workforce",
  },
  {
    title: "Physician Enterprise Suite",
    body:
      "Move from attrition risk to an engaged workforce by aligning physician incentives, productivity, and workforce performance.",
    cta: "Learn More About Physician Enterprise",
  },
];

const STATS = [
  { num: "20-25%", lead: "Reduction in", label: "overtime and premium spend" },
  { num: "10-15%", lead: "Reduction in", label: "labor-driven capacity challenges" },
  { num: "15-25%", lead: "Reduction in", label: "contract labor" },
  { num: "80%+", lead: "Reduction in", label: "compensation errors" },
];

const PERSONAS = [
  {
    name: "The C-Suite",
    img: `${ASSET}/The-C-Suite.png`,
    bullets: [
      "Manage costs before they escalate",
      "Protect and improve operating margins by anticipating demand and managing workforce spend proactively",
      "Gain visibility into all workforce data across departments and locations",
    ],
  },
  {
    name: "Medical group leaders",
    img: `${ASSET}/Medical-group-leaders-home.png`,
    bullets: [
      "Automate physician compensation to reduce manual work and eliminate errors",
      "Model compensation changes to understand impact before implementation",
      "Strengthen compliance with auditable workflows to support fair market value review",
      "Benchmark compensation and performance to spot misalignment and retention risk",
      "Provide physicians with transparency into pay and performance",
    ],
  },
  {
    name: "Nursing leaders",
    img: `${ASSET}/Nursing-Leaders.png`,
    bullets: [
      "Combat workforce shortage problems with a right-mix, better allocation approach",
      "Align incentives with real-time demand with the preferences of the people delivering care",
      "Empower nurses with greater control over when and where they work",
      "Support better patient outcomes by ensuring the right people are in the right place, in the right role, at the right time",
    ],
  },
  {
    name: "HR and workforce teams",
    img: `${ASSET}/HR-and-workforce-teams.png`,
    bullets: [
      "Attract and retain talent to maintain patient access to quality care",
      "Support your workforce to meet them where they are",
      "Ensure compensation is fair and competitive",
      "Engage and retain clinicians through clarity, flexibility, and fair, transparent incentives",
    ],
  },
  {
    name: "Operations and finance teams",
    img: `${ASSET}/Operations-and-finance-teams-.png`,
    bullets: [
      "Improve operating margins through better workforce decisions",
      "Reduce reliance on premium labor spend",
      "Align performance with operational and financial goals",
      "Audit-ready data at your fingertips",
    ],
  },
  {
    name: "Physician compensation teams",
    img: `${ASSET}/Physician-Compensation-Slider-1.png`,
    bullets: [
      "Automate calculations and eliminate manual errors",
      "Align expectations to performance",
      "Increase transparency through physician mobile application",
    ],
  },
];

const FOOTER_LINKS_A = ["Sign in", "Careers", "Integrations"];
const FOOTER_LINKS_B = [
  "Privacy Policy",
  "Terms and Conditions",
  "Do Not Sell or Share My Personal Information",
];

/* -- Component ----------------------------------------------------------- */

export default function MockupHallmark({
  showAnnouncementBar = true,
  showNav = true,
  showFooter = true,
}: MockupHallmarkProps) {
  return (
    <div className="mockup-hallmark">
      {/* S0. Announcement bar */}
      {showAnnouncementBar && (
        <div className="hm-announce">
          <div className="hm-announce-inner">
            <span className="hm-announce-text">
              <strong>Watch Now:</strong> See Through the $900B Black Box
            </span>
            <div className="hm-announce-actions">
              <span className="hm-announce-btn">Watch</span>
              <span className="hm-announce-close">&times;</span>
            </div>
          </div>
        </div>
      )}

      {/* S1. Nav */}
      {showNav && (
        <header className="hm-nav">
          <div className="hm-nav-utility">
            <span className="hm-signin">Sign in</span>
          </div>
          <div className="hm-nav-main">
            <div className="hm-container hm-nav-row">
              <img
                className="hm-logo"
                src={`${ASSET}/2026/05/LogoHallmark.svg`}
                alt="Hallmark Health Care Solutions"
              />
              <nav className="hm-nav-links">
                {NAV_LINKS.map((link) => (
                  <span className="hm-nav-link" key={link}>
                    {link}
                  </span>
                ))}
                <span className="hm-nav-cta">Request a Demo</span>
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* S2. Hero */}
      <section className="hm-hero hm-section">
        <div className="hm-container hm-hero-inner">
          <div className="hm-hero-copy">
            <div className="hm-eyebrow">
              Healthcare&rsquo;s Workforce Operating System
            </div>
            <h1 className="hm-hero-title">
              Eliminate the black box around your greatest asset: your workforce
            </h1>
            <p className="hm-hero-sub">
              Combining Flexible Workforce and Physician Enterprise solutions to
              provide health systems with real-time visibility and control of
              supply, demand, cost, and incentives, across their entire
              workforce.
            </p>
            <div className="hm-hero-actions">
              <span className="hm-btn-cyan">Request a Demo</span>
              <span className="hm-btn-outline-cyan">
                <i className="hm-play-icon" />
                Watch Video
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* S3. Trust / testimonials */}
      <section className="hm-trust hm-section">
        <div className="hm-container hm-trust-inner">
          <div className="hm-trust-cols">
            <div className="hm-trust-left">
              <h2 className="hm-trust-title">
                Trusted by 50+ forward-thinking health systems
              </h2>
              <span className="hm-link-teal">See all news</span>
            </div>
            <div className="hm-trust-right">
              <div className="hm-quote-row">
                {QUOTES.slice(0, 2).map((q) => (
                  <figure className="hm-quote" key={q.text.slice(0, 24)}>
                    <img className="hm-quote-logo" src={q.logo} alt="" />
                    <blockquote className="hm-quote-text">{q.text}</blockquote>
                    {q.name && (
                      <figcaption className="hm-quote-attr">
                        {q.name}
                        <span>{q.role}</span>
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
              <div className="hm-dots">
                <span className="hm-dot" />
                <span className="hm-dot is-active" />
                <span className="hm-dot" />
                <span className="hm-dot" />
              </div>
            </div>
          </div>

          <div className="hm-quote-row" style={{ width: "100%", maxWidth: 1192 }}>
            {QUOTES.slice(2).map((q) => (
              <figure className="hm-quote" key={q.text.slice(0, 24)}>
                <img className="hm-quote-logo" src={q.logo} alt="" />
                <blockquote className="hm-quote-text">{q.text}</blockquote>
                {q.name && (
                  <figcaption className="hm-quote-attr">
                    {q.name}
                    <span>{q.role}</span>
                  </figcaption>
                )}
              </figure>
            ))}
          </div>

          <div className="hm-logo-strip">
            {TRUST_LOGOS.map((logo) => (
              <img
                key={logo.src}
                className={logo.square ? "hm-logo-square" : undefined}
                src={logo.src}
                alt={logo.alt}
              />
            ))}
          </div>
        </div>
      </section>

      {/* S4. Why the healthcare workforce requires an operating system */}
      <section className="hm-why">
        <div className="hm-why-panel">
          <h3 className="hm-why-title">
            Why the healthcare workforce requires an operating system
          </h3>
          <p className="hm-why-intro">
            Healthcare&rsquo;s workforce is both your most critical asset and
            your largest expense at $900 billion annually.
          </p>
          <img
            className="hm-video-cover"
            src={`${ASSET}/Video-Cover-Hallmark.png`}
            alt="Hallmark video cover"
          />
          <div className="hm-problem-grid">
            {PROBLEM_CARDS.map((card) => (
              <div className="hm-problem-card" key={card.title}>
                <h4 className="hm-problem-title">{card.title}</h4>
                <p className="hm-problem-body">{card.body}</p>
                <p className="hm-problem-stat">{card.stat}</p>
              </div>
            ))}
          </div>
          <p className="hm-why-close">
            For most health systems, the data driving workforce decisions lives
            in a black box, creating operational risk that impacts everything
            from financial performance to patient care.
          </p>
          <p className="hm-why-punch">
            Hallmark eliminates the workforce black box.
          </p>
        </div>
      </section>

      {/* S5. How it works */}
      <section className="hm-hiw">
        <div className="hm-hiw-inner">
          <h3 className="hm-hiw-title">How it works</h3>
          <p className="hm-hiw-intro">
            Hallmark is Healthcare&rsquo;s Workforce Operating System, pairing
            intelligent technology with a team of seasoned operators to enable
            health systems to manage their total workforce and its impact on
            patient care and financial performance more strategically.
          </p>
          <div className="hm-hiw-grid">
            {HIW_CARDS.map((card) => (
              <div className="hm-hiw-card" key={card.title}>
                <div className="hm-hiw-icon">{card.icon}</div>
                <h4 className="hm-hiw-card-title">{card.title}</h4>
                <p className="hm-hiw-card-body">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S6. The missing layer in the healthcare tech stack */}
      <section className="hm-section">
        <div className="hm-container hm-diagram-inner">
          <h3 className="hm-h3">
            The missing layer in the healthcare tech stack
          </h3>
          <p className="hm-sub">
            Unifying and building on existing systems of record for real-time
            visibility and AI-enabled capability.
          </p>
          <img
            className="hm-diagram-img"
            src={`${ASSET}/Hallmark_Operating-system.svg`}
            alt="Hallmark operating system layer diagram"
          />
        </div>
      </section>

      {/* S7. Flexible modules */}
      <section className="hm-section">
        <div className="hm-container hm-modules-inner">
          <h3 className="hm-h3">
            Flexible modules for what you need now and as you grow
          </h3>
          <p className="hm-modules-sub">
            Build your operating system at your own pace.
            <br />
            The Hallmark product suite is configurable to meet the urgent needs
            you&rsquo;re facing.
          </p>
          <img
            className="hm-diagram-img"
            src={`${ASSET}/Hallmark_product-suite_pos-OL.svg`}
            alt="Hallmark product suite diagram"
          />
          <div className="hm-modules-cols">
            {MODULES.map((mod) => (
              <div className="hm-module-card" key={mod.title}>
                <h4 className="hm-module-title">{mod.title}</h4>
                <p className="hm-module-body">{mod.body}</p>
                <span className="hm-btn-cyan-lg">{mod.cta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S8. From unmet needs to a strategic workforce partner */}
      <section className="hm-partner hm-section">
        <div className="hm-container hm-partner-inner">
          <div className="hm-partner-cols">
            <div className="hm-partner-left">
              <h3 className="hm-partner-title">
                From unmet needs to a strategic workforce partner
              </h3>
              <p className="hm-partner-body">
                We understand that no two systems have the exact same needs.
                Healthcare&rsquo;s Workforce Operating System comes with a deep
                bench of experts who partner with clients to customize,
                implement, deliver, and optimize each unique solution. Our
                services teams become an extension of yours, remaining actively
                engaged to provide strategic and hands-on support designed to
                maximum ROI.
              </p>
              <span className="hm-btn-cyan-sm">Meet Our Team</span>
            </div>
            <div className="hm-partner-right">
              <img
                className="hm-partner-img"
                src={`${ASSET}/Home-partner.png`}
                alt="Rajiv Bajaj, Chief Technology Officer"
              />
              <div className="hm-partner-caption">
                <h4>Rajiv Bajaj</h4>
                <p>Chief Technology Officer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S9. Stats band */}
      <section className="hm-section">
        <div className="hm-stats-inner">
          <div className="hm-stats-grid">
            {STATS.map((stat) => (
              <div className="hm-stat" key={stat.num + stat.label}>
                <div className="hm-stat-num">{stat.num}</div>
                <div className="hm-stat-label">
                  {stat.lead}
                  <br />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S10. Outcomes band */}
      <section className="hm-outcomes">
        <div className="hm-outcomes-inner">
          <h4 className="hm-outcomes-title">
            Transformational outcomes for the total healthcare workforce
          </h4>
          <p className="hm-outcomes-body">
            What was once a black box becomes visible and actionable. The
            result: healthier operating margins, fewer reactive decisions, an
            engaged workforce, and the conditions for best patient outcomes,
            safeguarded.
          </p>
        </div>
      </section>

      {/* S11. Personas */}
      <section className="hm-personas hm-section">
        <div className="hm-container hm-personas-inner">
          <div className="hm-persona-tabs">
            {PERSONAS.map((persona, i) => (
              <span
                className={
                  i === 0 ? "hm-persona-tab is-active" : "hm-persona-tab"
                }
                key={persona.name}
              >
                {persona.name}
              </span>
            ))}
          </div>
          <div className="hm-persona-list">
            {PERSONAS.map((persona) => (
              <div className="hm-persona" key={persona.name}>
                <div className="hm-persona-figure">
                  <img src={persona.img} alt={persona.name} />
                  <div className="hm-persona-label">{persona.name}</div>
                </div>
                <ul className="hm-persona-bullets">
                  {persona.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S12. CTA */}
      <section className="hm-section">
        <div className="hm-container hm-cta-inner">
          <div className="hm-cta-panel">
            <p className="hm-cta-lead">
              For the typical health system, every 1% improvement in labor
              expense management drives 16% improvement in overall margin
              expansion.
            </p>
            <h3 className="hm-cta-title">
              How much could your health system stand to benefit?
            </h3>
            <div className="hm-cta-actions">
              <span className="hm-btn-outline-dark">
                Read recent case studies
              </span>
              <span className="hm-btn-dark">Talk to an Expert</span>
            </div>
          </div>
        </div>
      </section>

      {/* S13. Footer */}
      {showFooter && (
        <footer className="hm-footer">
          <div className="hm-footer-inner">
            <div className="hm-footer-cols">
              <div className="hm-footer-links">
                <ul>
                  {FOOTER_LINKS_A.map((link) => (
                    <li key={link}>
                      <a href="#hm">{link}</a>
                    </li>
                  ))}
                </ul>
                <ul>
                  {FOOTER_LINKS_B.map((link) => (
                    <li key={link}>
                      <a href="#hm">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hm-footer-logo-col">
                <img
                  className="hm-footer-logo"
                  src={`${ASSET}/2026/05/Logo-footer.svg`}
                  alt="Hallmark"
                />
              </div>

              <div className="hm-footer-address-col">
                <div className="hm-footer-address">
                  <strong>Hallmark</strong>
                  <br />
                  13155 Noel Road
                  <br />
                  Suite 2400
                  <br />
                  Dallas, TX 75240
                  <br />
                  (214) 624-5147
                </div>
                <div className="hm-footer-social">
                  <a href="#hm">Linkedin</a>
                </div>
              </div>
            </div>

            <div className="hm-footer-copy">
              Copyright &copy; 2026 Hallmark Health Care Solutions, Inc. All
              rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
