import React from "react";
import "./index.css";

const A = "https://a.storyblok.com/f/288416513769651";

const LogoWordmark = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 1296 215"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="lighthouse"
    role="img"
  >
    <path d="M239.237 0H220.525V165.65H239.237V0Z" />
    <path d="M289.977 52.686H271.265V165.65H289.977V52.686Z" />
    <path d="M280.448 3.33618C273.675 3.33618 268.969 8.05261 268.969 14.8397C268.969 21.6267 273.675 26.4582 280.448 26.4582C287.221 26.4582 292.158 21.6267 292.158 14.8397C292.158 8.05261 287.336 3.33618 280.448 3.33618Z" />
    <path d="M414.531 71.2066C406.036 59.1279 391.342 50.3853 371.138 50.3853C338.88 50.3853 314.313 75.0027 314.313 108.823C314.313 142.758 338.88 167.951 371.138 167.951C391.342 167.951 406.381 158.863 414.531 147.014V160.243C414.531 183.25 397.886 197.975 371.712 197.975C355.985 197.975 342.209 191.763 331.877 180.605L319.594 192.798C331.763 207.063 350.704 215 371.712 215C409.25 215 433.243 192.568 433.243 157.483V52.6859H414.531V71.2066ZM372.975 151.041C349.441 151.041 332.796 132.175 332.796 108.823C332.796 85.5859 349.441 67.2954 372.975 67.2954C397.082 67.2954 414.761 85.5859 414.761 108.823C414.761 132.175 397.082 151.041 372.975 151.041Z" />
    <path d="M521.178 50.3852C503.27 50.3852 489.838 59.2429 483.524 69.7111V0H464.698V165.65H483.41V101.921C483.41 81.3296 499.022 67.9856 518.308 67.9856C538.512 67.9856 549.992 79.489 549.992 101.461V165.65H568.589V96.9743C568.474 67.8705 550.681 50.3852 521.178 50.3852Z" />
    <path d="M643.207 151.156C631.727 151.156 623.692 144.714 623.692 129.874V68.7908H660.771V52.6859H623.577V16.45H605.209V52.6859H584.316V68.7908H605.095V132.865C605.095 155.872 619.559 167.951 641.256 167.951C650.439 167.951 660.197 165.65 665.019 162.889L662.493 146.784C657.098 149.545 649.406 151.156 643.207 151.156Z" />
    <path d="M747.098 50.3852C729.189 50.3852 715.758 59.2429 709.444 69.7111V0H690.618V165.65H709.33V101.921C709.33 81.3296 724.942 67.9856 744.228 67.9856C764.432 67.9856 775.912 79.489 775.912 101.461V165.65H794.394V96.9743C794.394 67.8705 776.601 50.3852 747.098 50.3852Z" />
    <path d="M876.474 50.3853C842.15 50.3853 816.55 76.153 816.55 109.168C816.55 142.183 842.15 167.951 876.474 167.951C910.798 167.951 936.398 142.183 936.398 109.168C936.283 76.153 910.798 50.3853 876.474 50.3853ZM876.474 150.581C852.711 150.581 835.262 132.405 835.262 109.168C835.262 85.931 852.711 67.7555 876.474 67.7555C900.237 67.7555 917.686 85.931 917.686 109.168C917.686 132.405 900.122 150.581 876.474 150.581Z" />
    <path d="M1039.72 116.53C1039.72 137.122 1024.33 150.351 1004.82 150.351C984.728 150.351 973.363 138.962 973.363 116.99V52.686H954.766V121.477C954.766 150.466 972.444 167.951 1001.83 167.951C1019.97 167.951 1033.29 159.208 1039.6 148.625V165.65H1058.31V52.686H1039.6V116.53H1039.72Z" />
    <path d="M1129.83 100.77C1110.66 96.1691 1101.71 93.2932 1101.71 82.48C1101.71 73.1621 1110.89 67.1803 1125.24 67.1803C1139.82 67.1803 1149.12 73.9674 1154.51 81.9048L1167.25 71.3216C1160.6 60.2782 1145.56 50.3853 1125.24 50.3853C1102.05 50.3853 1083.34 63.0391 1083.34 82.8251C1083.34 104.452 1100.44 111.929 1124.55 117.335C1143.61 121.592 1151.3 124.813 1151.3 135.281C1151.3 144.944 1140.85 151.156 1126.16 151.156C1109.86 151.156 1098.72 143.333 1092.52 132.06L1078.17 142.528C1086.32 158.058 1102.85 167.951 1126.16 167.951C1149.81 167.951 1170.01 155.297 1170.01 135.281C1169.89 114.46 1154.05 106.637 1129.83 100.77Z" />
  </svg>
);

const Chevron = () => (
  <svg className="mlh-chev" viewBox="0 0 12 8" fill="none" aria-hidden="true">
    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = () => (
  <svg className="mlh-check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="8" fill="#333645" />
    <path d="M4.4 8.2L6.8 10.6L11.6 5.8" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV = ["Platform", "Solutions", "Company", "Resources"];

const SETTLE = [
  {
    icon: `${A}/24x24/5e7d19ce15/hotel-data-icon.svg`,
    title: "The most complete view of the market",
    body: "The largest commercial dataset in hospitality. Billions of daily rates plus demand, parity and market signals that only Lighthouse collects.",
    cls: "mlh-settle-card-top",
  },
  {
    icon: `${A}/24x24/378b1b3c41/rates-icon.svg`,
    title: "One platform for the entire revenue journey",
    body: "One platform covering the entire revenue journey. Forecast demand, optimize pricing, increase direct bookings, manage performance.",
    cls: "mlh-settle-card-bl",
  },
  {
    icon: `${A}/24x24/7debad556c/ai-icon.svg`,
    title: "AI that understands hospitality",
    body: "Built by hoteliers, with the collective intelligence of tens of thousands of properties behind it. Your data is yours. Always. The result is AI that thinks the way you do.",
    cls: "mlh-settle-card-br",
  },
];

const PRODUCTS = [
  {
    eyebrow: "Lighthouse Pricing",
    title: "See where you stand",
    body: "Track competitive set positioning and demand signals with rate recommendations in real time.",
    img: `${A}/359x234/65a40f37e8/lighthouse-pricing.svg`,
  },
  {
    eyebrow: "Lighthouse Performance",
    title: "Act on what matters most",
    body: "Business intelligence, forecasting, and portfolio benchmarking in one view.",
    img: `${A}/359x234/5151a864dc/lighthouse-performance.svg`,
  },
  {
    eyebrow: "Lighthouse Direct",
    title: "Increase direct bookings",
    body: "Personalized offers and price matching that convert website visitors on the spot.",
    img: `${A}/538x351/17b8350f64/lighthouse-direct.png/m/700x0/filters:quality(90):format(webp)`,
  },
];

const AI_CAPS = [
  {
    eyebrow: "Ernest",
    title: "Your AI teammate",
    body: "Ask anything about your business. Get a recommendation grounded in clear data. Schedule automated tasks and custom alerts based on your priorities.",
    cta: "Meet Ernest",
  },
  {
    eyebrow: "Connect AI",
    title: "Enable direct booking in ChatGPT",
    body: "Drive direct bookings from ChatGPT. Your hotel appears when travelers search in AI conversations, with a direct path to book.",
    cta: "Learn More",
  },
  {
    eyebrow: "KITT",
    title: "AI receptionist",
    body: "AI front desk agent. Phone calls, guest messages and direct bookings handled around the clock.",
    cta: "Learn More",
  },
];

const TESTIMONIALS = [
  {
    logo: `${A}/500x275/0a87809d0f/name-kingston.svg`,
    logoAlt: "Kingstons Hotel Group",
    quote:
      "“If we didn't have Lighthouse, we would lose a significant portion of our revenue. When demand comes, if we don't adjust quickly, we miss the chance to sell at a higher rate.”",
    name: "Pornthip C.",
    role: "Director of Revenue",
    stat: "20%",
    caption: "revenue gain from faster rate adjustments",
    img: `${A}/900x675/ac72799724/cs-kingstons-hotel-group.png/m/691x0/filters:quality(90):format(webp)`,
  },
  {
    logo: `${A}/500x275/aee1ebcac8/holiday-inn-home.svg`,
    logoAlt: "Holiday Inn Express",
    quote:
      "“Lighthouse helps us monitor the dynamics of bookings, compare with last year's data and adjust our forecasts accordingly... It's an essential tool for understanding market trends.”",
    name: "Arsen Mkrtchyan",
    role: "Sales and Marketing Manager",
    stat: "15 min",
    caption: "instead of two hours preparing reports daily",
    img: `${A}/900x675/6161ff4798/cs-holiday-inn-express-yerevan-cover.png/m/691x0/filters:quality(90):format(webp)`,
  },
  {
    logo: `${A}/500x275/0ee1377582/la-casa-hotel-svg.svg`,
    logoAlt: "La Casa Hotel",
    quote:
      "“Even amidst unavoidable political and economic situations... we significantly increased our D2C sales. Lighthouse contributed greatly to reducing operating costs while boosting profitability.”",
    name: "Louie Shin",
    role: "Cluster Sales Manager",
    stat: "15%",
    caption: "average increase in ADR, up to +22% in low-demand months",
    img: `${A}/1280x628/7ed064276b/cs-la-casa-hotel-cover.png/m/691x0/filters:quality(90):format(webp)`,
  },
];

const INTEGRATIONS: Array<[string, string]> = [
  ["Oracle", `${A}/500x275/26cc8f90b0/oracle-logo.svg`],
  ["Mews", `${A}/500x275/29b15ccabf/mews-logo.svg`],
  ["Agilisys", `${A}/500x275/837c64ae72/agilisys.svg`],
  ["Infor", `${A}/500x275/0ad4931947/infor-logo.svg`],
  ["Cloudbeds", `${A}/500x275/4973f055fc/cloudbeds-logo.svg`],
  ["Shiji", `${A}/500x275/a76b91e182/shiji-logo.svg`],
  ["Maestro", `${A}/500x275/c19166312c/maestro-logo.svg`],
  ["Apaleo", `${A}/500x275/a1f32ae79f/apaleo-logo.svg`],
  ["Protel", `${A}/500x275/4d8898c2e9/protel-logo.svg`],
  ["Clock PMS", `${A}/500x275/08e44ac9bf/clock-pms.svg`],
  ["StayNTouch", `${A}/500x275/97afc7fc28/stayntouch-logo.svg`],
  ["Fairmas", `${A}/500x275/7223d40cf7/fairmas-logo.svg`],
  ["WebRezPro", `${A}/500x275/0bb9e350e1/webrezpro-logo.svg`],
  ["IDS Next", `${A}/500x275/3c3b78d48a/idsnext-logo.svg`],
  ["Visual Matrix", `${A}/500x275/f98c678479/visualmatrix-logo.svg`],
  ["RMS", `${A}/500x275/9f90fdd086/rms-logo.svg`],
  ["SkyTouch", `${A}/500x275/1905122c38/skytouch-logo.svg`],
  ["Sihot", `${A}/500x275/fa269a6f69/sihot.svg`],
  ["HotSoft", `${A}/500x275/d9b752c64c/hotsoft.svg`],
  ["Springer-Miller", `${A}/500x275/271f122435/springer-miller-logo.svg`],
  ["Chorum", `${A}/500x275/6d409dbe1a/chorum-logo.svg`],
  ["Semper", `${A}/500x275/22234b5ae1/semper.svg`],
  ["Yanolja", `${A}/500x275/9a1ca75843/yanolja.svg`],
  ["Erbon", `${A}/500x275/d50eb5cd1e/erbon-logo.svg`],
];

const RESOURCES = [
  {
    img: `${A}/2800x1576/910ad1c176/ernest-pr-banner.jpg/m/700x348/filters:quality(90):format(webp)`,
    date: "9 June, 2026",
    title:
      "Lighthouse Launches Ernest, the AI Teammate That Transforms General AI into Hospitality Performance",
  },
  {
    img: `${A}/5771x4062/a5841d6c8b/blog-geo-explainer.jpg/m/700x348/filters:quality(90):format(webp)`,
    date: "1 June, 2026",
    title: "You track your Google rank every week. Why aren't you tracking your AI rank?",
  },
];

const BADGES = [
  `${A}/830x1088/92b21cd332/parity-management-htr-award.png/m/130x160/filters:quality(90):format(webp)`,
  `${A}/830x1088/8b9eaff025/business-intelligence-htr-award.png/m/130x160/filters:quality(90):format(webp)`,
  `${A}/830x1088/d7e2a621ec/rate-shopping-market-intelligence-htr-award.png/m/130x160/filters:quality(90):format(webp)`,
  `${A}/828x1006/ea643eaf02/best-direct-booking-tool-htr-award.png/m/130x160/filters:quality(90):format(webp)`,
];

const FOOTER_GROUPS: Array<{ heading: string; links: string[] }> = [
  {
    heading: "PLATFORM",
    links: [
      "Chains & Groups - Lighthouse Pricing",
      "Chains & Groups - Lighthouse Performance",
      "Chains & Groups - Lighthouse Direct",
      "Chains & Groups - Lighthouse Distribution",
      "Independents - Pricing Optimization",
      "Independents - Channel Management",
      "Independents - Direct Bookings",
      "Independents - Payments",
      "Independents - Reservation Management",
      "Data & Services - Data Solutions",
      "Data & Services - Commercial Strategy Services",
      "Lighthouse AI - Connect AI",
      "Lighthouse AI - KITT",
    ],
  },
  {
    heading: "SOLUTIONS",
    links: [
      "Revenue Manager",
      "General Manager",
      "Sales & Marketing Manager",
      "Independent Hotel Owner",
      "Group & Chain Hotel",
      "Independent Hotel",
      "Hotel Management Company",
      "Short-Term Rental for Enterprise",
      "DMO & Destinations",
    ],
  },
  {
    heading: "COMPANY",
    links: ["About", "Careers", "Partnerships", "Customer Care", "Contact", "Security", "Marketplace"],
  },
  {
    heading: "RESOURCES",
    links: [
      "Resource Hub",
      "Blog",
      "Events",
      "Insights",
      "Customer Stories",
      "Free Data Tools",
      "Podcast",
      "Lighthouse Live",
    ],
  },
];

const SOCIAL_PATHS = [
  // facebook
  "M13.5 8.5h-2v6h-2.4v-6H7.6V6.6h1.5V5.4c0-1.3.6-2.4 2.5-2.4h1.9v2h-1.3c-.5 0-.6.2-.6.6v1h1.9l-.2 1.9z",
  // linkedin
  "M4.5 6.4h2.3v7.2H4.5V6.4zm1.2-3.5c.8 0 1.3.5 1.3 1.2 0 .7-.5 1.2-1.3 1.2S4.4 4.8 4.4 4.1c0-.7.5-1.2 1.3-1.2zM8.3 6.4h2.2v1h.03c.3-.6 1.1-1.2 2.2-1.2 2 0 2.4 1.3 2.4 3v4.4h-2.3v-3.9c0-.9-.3-1.5-1.1-1.5s-1.2.6-1.2 1.5v3.9H8.3V6.4z",
  // youtube
  "M15.3 5.7c-.2-.8-.7-1.3-1.5-1.5C12.5 3.9 9 3.9 9 3.9s-3.5 0-4.8.3c-.8.2-1.3.7-1.5 1.5C2.4 7 2.4 9 2.4 9s0 2 .3 3.3c.2.8.7 1.3 1.5 1.5 1.3.3 4.8.3 4.8.3s3.5 0 4.8-.3c.8-.2 1.3-.7 1.5-1.5.3-1.3.3-3.3.3-3.3s0-2-.3-3.3zM7.5 11.2V6.8L11.3 9l-3.8 2.2z",
];

export default function MockupMyLighthouse() {
  return (
    <div className="mockup-my-lighthouse">
      {/* ---------- STICKY HEADER ---------- */}
      <header className="mlh-header">
        <div className="mlh-header-bar">
          <a className="mlh-logo-link" href="#">
            <LogoWordmark className="mlh-logo" />
          </a>
          <nav className="mlh-nav">
            <a className="mlh-nav-link" href="#">
              Ernest
            </a>
            {NAV.map((n) => (
              <button key={n} className="mlh-nav-link mlh-nav-toggle" type="button">
                {n}
                <Chevron />
              </button>
            ))}
          </nav>
          <div className="mlh-header-right">
            <span className="mlh-lang">EN</span>
            <a className="mlh-login" href="#">
              Login
            </a>
            <a className="mlh-btn-contact" href="#">
              Contact sales
            </a>
          </div>
        </div>
      </header>

      {/* ---------- SECTION 1: HERO ---------- */}
      <div className="mlh-hero-wrap">
        <div className="mlh-hero">
          <div className="mlh-hero-inner">
            <p className="mlh-hero-eyebrow">COMMERCIAL OPERATING PLATFORM</p>
            <h1 className="mlh-hero-headline">
              <span className="mlh-hero-line">We help</span>
              <span className="mlh-hero-line">
                hoteliers act<span className="mlh-hero-period">.</span>
                <span className="mlh-hero-cursor" />
              </span>
            </h1>
            <h2 className="mlh-hero-subhead">
              Unite your commercial team with one AI workspace that turns billions of daily signals into
              your next best move.
            </h2>
          </div>
        </div>

        {/* Showcase: app frame with product video + tab pills + CTA */}
        <section className="mlh-showcase">
          <div className="mlh-showcase-inner">
            <div className="mlh-app-frame">
              <div className="mlh-video-zone">
                <video
                  className="mlh-video"
                  src={`${A}/x/a61e214e85/website_01_ask_desktop_final.mp4`}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={`${A}/359x234/65a40f37e8/lighthouse-pricing.svg`}
                />
                <span className="mlh-play-btn" aria-hidden="true">
                  <span className="mlh-pause-bar" />
                  <span className="mlh-pause-bar" />
                </span>
              </div>
              <div className="mlh-button-zone">
                <span className="mlh-tab-btn mlh-tab-active">Ask</span>
                <span className="mlh-tab-btn">Decide</span>
                <span className="mlh-tab-btn">Act</span>
              </div>
            </div>
            <div className="mlh-showcase-cta-row">
              <a className="mlh-btn-primary" href="#">
                Meet Ernest <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* ---------- SECTION 2: DON'T SETTLE ---------- */}
      <section className="mlh-settle">
        <div className="mlh-settle-wrapper">
          <div className="mlh-settle-grid">
            <div className="mlh-settle-headline-col">
              <h2 className="mlh-settle-headline">Don't settle for good enough</h2>
            </div>
            {SETTLE.map((c) => (
              <div key={c.title} className={`mlh-settle-card ${c.cls}`}>
                <span className="mlh-settle-icon">
                  <img src={c.icon} alt="" width={28} height={28} />
                </span>
                <h3 className="mlh-settle-card-title">{c.title}</h3>
                <p className="mlh-settle-card-body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 3: BUILT FOR HOTELS OF EVERY SIZE ---------- */}
      <div className="mlh-ernest-bg">
        <section className="mlh-builtfor">
          <div className="mlh-builtfor-inner">
            <h2 className="mlh-builtfor-heading">Built for hotels of every size</h2>
            <p className="mlh-builtfor-sub">
              Global chains, regional groups and leading independents rely on Lighthouse.
            </p>
            <div className="mlh-builtfor-tabs">
              <span className="mlh-bf-tab mlh-bf-tab-active">GROUPS, CHAINS, LARGE HOTELS</span>
              <span className="mlh-bf-tab">INDEPENDENT &amp; SMALLER HOTELS</span>
            </div>
            <div className="mlh-product-grid">
              {PRODUCTS.map((p) => (
                <div key={p.eyebrow} className="mlh-product-card">
                  <p className="mlh-product-eyebrow">{p.eyebrow}</p>
                  <h4 className="mlh-product-title">{p.title}</h4>
                  <p className="mlh-product-body">{p.body}</p>
                  <span className="mlh-pill-dark">Learn More</span>
                  <img className="mlh-product-img" src={p.img} alt="" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3b: AI CAPABILITIES */}
        <section className="mlh-aicaps">
          <div className="mlh-aicaps-inner">
            <h3 className="mlh-aicaps-headline">AI CAPABILITIES FOR EVERY HOTEL</h3>
            <div className="mlh-aicaps-grid">
              {AI_CAPS.map((c) => (
                <div key={c.eyebrow} className="mlh-aicap-card">
                  <div className="mlh-aicap-text">
                    <p className="mlh-aicap-eyebrow">{c.eyebrow}</p>
                    <h4 className="mlh-aicap-title">{c.title}</h4>
                    <p className="mlh-aicap-body">{c.body}</p>
                    <span className="mlh-aicap-cta">{c.cta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ---------- SECTION 4: TESTIMONIALS ---------- */}
      <section className="mlh-testi">
        <div className="mlh-testi-header">
          <h3 className="mlh-testi-heading">Results from commercial teams like yours</h3>
          <div className="mlh-testi-arrows">
            <span className="mlh-arrow-btn mlh-arrow-muted" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="mlh-arrow-btn" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
        <div className="mlh-testi-track">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="mlh-testi-slide">
              <div className="mlh-testi-main">
                <img className="mlh-testi-logo" src={t.logo} alt={t.logoAlt} />
                <p className="mlh-testi-quote">{t.quote}</p>
                <p className="mlh-testi-name">{t.name}</p>
                <p className="mlh-testi-role">{t.role}</p>
                <span className="mlh-btn-story">Read customer story</span>
              </div>
              <div className="mlh-testi-side">
                <p className="mlh-testi-stat">{t.stat}</p>
                <p className="mlh-testi-caption">{t.caption}</p>
                <img className="mlh-testi-cover" src={t.img} alt="" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- SECTION 5: INTEGRATIONS ---------- */}
      <section className="mlh-integrations">
        <h3 className="mlh-integ-heading">Integrations made easy</h3>
        <p className="mlh-integ-intro">
          We integrate with 400+ hospitality technology partners. If you have existing technology, we can
          make it even more powerful.
        </p>
        <ul className="mlh-integ-tabs">
          <li className="mlh-integ-tab mlh-integ-tab-active">PROPERTY MANAGEMENT SYSTEMS</li>
          <li className="mlh-integ-tab">BOOKING CHANNELS</li>
          <li className="mlh-integ-tab">OPERATIONS</li>
        </ul>
        <div className="mlh-logo-wall">
          {INTEGRATIONS.map(([name, src]) => (
            <div key={name} className="mlh-logo-cell">
              <img className="mlh-logo-img" src={src} alt={name} />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- SECTION 6: RESOURCES ---------- */}
      <section className="mlh-resources">
        <div className="mlh-resources-inner">
          <div className="mlh-resources-header">
            <h2 className="mlh-resources-heading">
              Unlock industry insights: Your daily dose of inspiration
            </h2>
            <a className="mlh-resources-cta" href="#">
              See all resources
            </a>
          </div>
          <div className="mlh-resources-grid">
            {RESOURCES.map((r) => (
              <article key={r.date} className="mlh-resource-card">
                <img className="mlh-resource-img" src={r.img} alt="" />
                <p className="mlh-resource-date">{r.date}</p>
                <h4 className="mlh-resource-title">{r.title}</h4>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 7: COMBINED CTA ---------- */}
      <section className="mlh-cta">
        <div className="mlh-cta-inner">
          <div className="mlh-cta-card">
            <h3 className="mlh-cta-headline">Contact Sales</h3>
            <ul className="mlh-cta-bullets">
              <li>
                <Check />
                Receive a personalized platform demo
              </li>
              <li>
                <Check />
                Determine the right solution for your property
              </li>
              <li>
                <Check />
                Get answers for pricing and packaging questions
              </li>
            </ul>
            <span className="mlh-cta-btn">Contact Sales</span>
          </div>
          <div className="mlh-cta-card">
            <h3 className="mlh-cta-headline">Meet Ernest</h3>
            <ul className="mlh-cta-bullets">
              <li>
                <Check />
                Priority access when Ernest launches
              </li>
              <li>
                <Check />
                Exclusive previews and product updates
              </li>
              <li>
                <Check />
                A direct line to shape the future of hospitality AI
              </li>
            </ul>
            <span className="mlh-cta-btn mlh-cta-btn-pink">Sign Up for Early Access</span>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="mlh-footer">
        <div className="mlh-footer-container">
          <div className="mlh-footer-top">
            <div className="mlh-footer-brand">
              <LogoWordmark className="mlh-footer-logo" />
              <div className="mlh-socials">
                {SOCIAL_PATHS.map((d, i) => (
                  <span key={i} className="mlh-social" aria-hidden="true">
                    <svg viewBox="0 0 18 18" fill="currentColor">
                      <path d={d} />
                    </svg>
                  </span>
                ))}
              </div>
            </div>
            <div className="mlh-footer-links">
              {FOOTER_GROUPS.map((g) => (
                <div key={g.heading} className="mlh-footer-group">
                  <p className="mlh-footer-group-heading">{g.heading}</p>
                  <ul className="mlh-footer-list">
                    {g.links.map((l) => (
                      <li key={l}>
                        <a href="#">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mlh-footer-mid">
            <div className="mlh-footer-badges">
              {BADGES.map((b) => (
                <img key={b} className="mlh-badge" src={b} alt="" />
              ))}
            </div>
            <div className="mlh-signup">
              <div className="mlh-signup-row">
                <label className="mlh-field">
                  <span className="mlh-field-label">
                    First name <span className="mlh-req">*</span>
                  </span>
                  <span className="mlh-input" />
                </label>
                <label className="mlh-field">
                  <span className="mlh-field-label">
                    Last name <span className="mlh-req">*</span>
                  </span>
                  <span className="mlh-input" />
                </label>
              </div>
              <label className="mlh-field mlh-field-wide">
                <span className="mlh-field-label">
                  Business Email <span className="mlh-req">*</span>
                </span>
                <span className="mlh-input" />
              </label>
              <p className="mlh-signup-note">
                Sign up to our mailing list for regular updates on the Hospitality industry
              </p>
              <label className="mlh-field mlh-field-wide">
                <span className="mlh-field-label">
                  Company/Hotel Name <span className="mlh-req">*</span>
                </span>
                <span className="mlh-input" />
              </label>
              <p className="mlh-consent">
                By submitting your details, you confirm that you would like to receive marketing emails
                from Lighthouse and you agree to the storing and processing of your personal data by
                Lighthouse as described in our <a href="#">privacy policy</a>.
              </p>
            </div>
          </div>

          <div className="mlh-footer-bottom">
            <div className="mlh-footer-submenu">
              <span>&copy; Lighthouse 2026</span>
              <a href="#">Terms &amp; Conditions</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Cookie Policy</a>
              <a href="#">Statement on modern slavery</a>
            </div>
            <div className="mlh-footer-lang">English (US)</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
