import * as React from "react";
import "./index.css";

/* ---------------------------------------------------------------
   Globalli homepage replica.
   All copy, imagery and CSS values come from the captured page
   specs (/tmp/pm-globalli/index.json + specs/*.spec.md).
   Visual only, no configuration props.
--------------------------------------------------------------- */

const LOGO = "https://a-us.storyblok.com/f/1021474/139x42/2b6259c13e/globalli-logo.svg?w=256";
const LOGO_FOOTER = "https://a-us.storyblok.com/f/1021474/139x42/c965caa8ce/globalli-logo-2.svg?w=384";
const CHEVRON = "https://globalli.io/_next/static/media/chevron-right-black.9c189f54.svg?w=16";

/* captured inline icon ic0 from index.json */
const IconArrowRight = ({ className }: { className?: string }) => (
  <svg
    width="8"
    height="13"
    viewBox="0 0 8 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.071 7.20772L1.414 12.8647L0 11.4507L4.95 6.50072L0 1.55072L1.414 0.136719L7.071 5.79372C7.25847 5.98125 7.36379 6.23555 7.36379 6.50072C7.36379 6.76588 7.25847 7.02019 7.071 7.20772Z"
      fill="#005148"
    />
  </svg>
);

/* section 02 : plug-and-play marketplace integration logos, in captured order */
const INTEGRATION_LOGOS: { src: string; alt: string }[] = [
  { src: "https://a-us.storyblok.com/f/1018971/128x52/65cfc2cb8b/workday.svg?w=256", alt: "Workday" },
  { src: "https://a-us.storyblok.com/f/1018971/80x40/4a39854f0f/sap.svg?w=256", alt: "SAP" },
  {
    src: "https://a-us.storyblok.com/f/1021474/1080x442/12737df0e3/hibob-logo-png_seeklogo-622918.png/m/256x0/filters:quality(80)",
    alt: "BOB",
  },
  {
    src: "https://a-us.storyblok.com/f/1021474/960x125/fa8b105789/oracle_logo.png/m/256x0/filters:quality(80)",
    alt: "ORACLE",
  },
  {
    src: "https://a-us.storyblok.com/f/1021474/960x205/22cfe6448e/microsoft_logo.png/m/256x0/filters:quality(80)",
    alt: "Microsoft",
  },
  { src: "https://a-us.storyblok.com/f/1018971/101x26/70df36ecd7/slack-logo.svg?w=256", alt: "Slack" },
  { src: "https://a-us.storyblok.com/f/1018971/314x71/a283fc0454/greenhouse.svg?w=256", alt: "Greenhouse" },
  {
    src: "https://a-us.storyblok.com/f/1018971/357x80/7ade6214fa/teams.png/m/256x0/filters:quality(80)",
    alt: "Teams",
  },
  {
    src: "https://a-us.storyblok.com/f/1021474/800x312/c4e051c968/sage-logo.png/m/256x0/filters:quality(80)",
    alt: "Sage",
  },
  {
    src: "https://a-us.storyblok.com/f/1021474/904x276/4260646771/zoho-logo.png/m/256x0/filters:quality(80)",
    alt: "Zoho",
  },
  {
    src: "https://a-us.storyblok.com/f/1021474/957x261/8518bbac11/intuit_quickbooks_logo-nobg.png/m/256x0/filters:quality(80)",
    alt: "Intuit Quickbooks",
  },
  {
    src: "https://a-us.storyblok.com/f/1021474/528x473/79a985d4a4/xero-logo-nobg.png/m/256x0/filters:quality(80)",
    alt: "Xero",
  },
];

/* section 08 : customer logo marquee, in captured order */
const CUSTOMER_LOGOS: string[] = [
  "https://a-us.storyblok.com/f/1021474/300x300/46aca71135/good-news-coffee-shop.webp/m/384x0/filters:quality(80)",
  "https://a-us.storyblok.com/f/1021474/550x367/ff38b9b20d/boundless-life.webp/m/384x0/filters:quality(80)",
  "https://a-us.storyblok.com/f/1021474/300x105/9639b2630d/florbs.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/512x160/f0714482d2/finray.webp/m/384x0/filters:quality(80)",
  "https://a-us.storyblok.com/f/1021474/300x150/6164b91ec3/iblue.webp/m/384x0/filters:quality(80)",
  "https://a-us.storyblok.com/f/1021474/300x130/235500fb1b/novar.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/350x200/4693f3b6de/ima.webp/m/384x0/filters:quality(80)",
  "https://a-us.storyblok.com/f/1021474/300x126/a16fcb4c9b/pacas.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/346x130/cf5cbac6cf/justworks.webp/m/384x0/filters:quality(80)",
  "https://a-us.storyblok.com/f/1021474/300x132/d28e6dc305/ecomplete.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/517x150/4014cb8406/aqurate.webp/m/384x0/filters:quality(80)",
  "https://a-us.storyblok.com/f/1021474/500x187/5973009270/ultragenyx.webp/m/384x0/filters:quality(80)",
  "https://a-us.storyblok.com/f/1021474/300x217/da7c725b36/semi-blocks.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/300x145/3a300b925a/vela.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/205x42/8591a16b2f/cooltra.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/300x118/45fdd62488/pulse4all.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/300x72/7c319611c0/the-sylvan-group.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/300x234/9052360b45/spares-in-motion.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/300x127/5b70733d4e/wood-thilsted.svg?w=384",
  "https://a-us.storyblok.com/f/1021474/740x240/62bbcc6005/travel-cue.webp/m/384x0/filters:quality(80)",
  "https://a-us.storyblok.com/f/1021474/512x512/4a17b553ed/prosur.webp/m/384x0/filters:quality(80)",
  "https://a-us.storyblok.com/f/1021474/300x162/2836b32b41/playroll.svg?w=384",
];

/* section 06 : we simplify global expansion cards */
const SIMPLIFY_CARDS: { icon: string; title: string; body: string }[] = [
  {
    icon: "https://a-us.storyblok.com/f/1021474/69x59/38be613794/formation-icon.svg?w=256",
    title: "Company Formation",
    body: "Start with confidence: We ensure precise, compliant company formation, eliminating costly errors from the outset.",
  },
  {
    icon: "https://a-us.storyblok.com/f/1021474/69x59/23242bfc9c/entitymgmt-icon.svg?w=256",
    title: "Entity Management",
    body: "See the whole picture: Access a unified view of all of your entities to enable greater management and optimization.",
  },
  {
    icon: "https://a-us.storyblok.com/f/1021474/69x59/715dfe1978/secretarial-icon.svg?w=256",
    title: "Corporate Secretarial",
    body: "Govern your global entities with ease and confidence: We provide expert support for seamless corporate secretarial management worldwide.",
  },
  {
    icon: "https://a-us.storyblok.com/f/1021474/69x59/e9fd231b48/accounting-icon.svg?w=256",
    title: "Accounting & Tax",
    body: "Navigate global accounting and tax regulations with confidence: We ensure compliance, optimize your finances, and minimize risk.",
  },
  {
    icon: "https://a-us.storyblok.com/f/1021474/69x59/cc1b0b9daa/reporting-icon.svg?w=256",
    title: "Corporate Compliance & Reporting",
    body: "Transform compliance into a clear advantage: Gain transparency, control, and peace of mind with our streamlined reporting solutions.",
  },
];

/* section 04 : the 7 real tab labels with their panel heading + body, in order */
const AIO_TABS: { label: string; heading: string; body: string }[] = [
  {
    label: "Onboard",
    heading: "Pick and configure your country's requirements",
    body: "Empower your business with the all-in-one global payroll and HR management solution to accelerate growth, streamline operations, and simplify workforce management from onboarding to offboarding in 125+ Countries.",
  },
  {
    label: "Manage",
    heading: "Manage teams efficiently and compliantly",
    body: "Effortlessly consolidate employee data worldwide into one global HRIS, where everything is localized compliantly based on location and local labor laws, ensuring a top-notch and personalized experience for global teams working with your organization.",
  },
  {
    label: "Benefits",
    heading: "Centralize Employee Benefits In One Global View",
    body: "Experience the power of a unified global view for all your employee benefits on our workforce management platform. Simplify and streamline benefits administration by consolidating all employee benefits into one cohesive and centralized hub. Enhance efficiency, accessibility and control with a comprehensive global perspective on your workforce benefits.",
  },
  {
    label: "Pay",
    heading: "Payroll Flexibility",
    body: "Simplify currency management, transfer times, and local compliance requirements. Plus, ensure you have complete visibility and reporting. Globalli turns your global payroll into a hyperlocal solution, so employees get paid the way they want.",
  },
  {
    label: "Communities",
    heading: "Create Communities With Your Global Teams",
    body: "Unite diverse perspectives, foster collaboration and drive innovation across borders. Together, let's build a connected and empowered network that transcends geographical boundaries, creating a shared sense of purpose and success.",
  },
  {
    label: "Genius AI",
    heading: "The future of work with Genius AI",
    body: "Maximize the power of AI in workforce management to enhance your people operations, make informed strategic choices, and manage global teams.",
  },
  {
    label: "Connect",
    heading: "Creating A World of Possibilities",
    body: "Connect your day-to-day business apps in your Globalli workflow and manage everything, all in one place.",
  },
];

/* section 07 : the three real "teams connected" cards */
const CONNECTED_CARDS: { title: string; body: string; img: string; alt: string }[] = [
  {
    title: "Reach and Engage your entire workforce with Communities",
    body: "Our all-in-one employee app that combines internal communication, engagement, recognition, intranet and measurement.",
    img: "https://a-us.storyblok.com/f/1021474/960x884/d7e27844fa/home-blurb-img01.png/m/1080x0/filters:quality(80)",
    alt: "Communities",
  },
  {
    title: "Identify and stop employee burnout before it happens",
    body: 'Tracks employee states from "Engaged" to "Burned Out," spots burnout risks early, nudges time off, and helps you understand the causes.',
    img: "https://a-us.storyblok.com/f/1021474/960x884/2b7b975e81/home-blurb-img02.png/m/1080x0/filters:quality(80)",
    alt: "Employee burnout tracking",
  },
  {
    title: "Power Up Teams with Performance Tools, increase productivity",
    body: "Transform your global people strategy by connecting performance management, employee engagement, and goal management into one unified solution.",
    img: "https://a-us.storyblok.com/f/1021474/960x884/ff191f956a/home-blurb-img03.png/m/1080x0/filters:quality(80)",
    alt: "Performance tools",
  },
];

/* section 08 : the 6 real testimonials. Attributions use a comma, never a dash. */
const TESTIMONIALS: { quote: string; attribution: string; logo: string }[] = [
  {
    quote:
      "We really enjoyed partnering with Isidro. His genuine care, combined with his knowledge and expertise, make him a joy to work with! Always asking the question behind the question, and going the extra mile to find a solution that is suitable to our needs, allowing us to achieve our business results, and make more impact.",
    attribution: "Marieke van Iperen, Settly",
    logo: "https://a-us.storyblok.com/f/1021474/550x367/ff38b9b20d/boundless-life.webp/m/384x0/filters:quality(80)",
  },
  {
    quote:
      "We expanded Cooltra to many countries in Europe, but we've never had such a brilliant support as we got from Globalli. They gave us various options per country and helped us choose the partner that was the best fit for us. It was perfect!",
    attribution: "Timo Buetefisch, Cooltra",
    logo: "https://a-us.storyblok.com/f/1021474/205x42/8591a16b2f/cooltra.svg?w=384",
  },
  {
    quote:
      "Globalli greatly helped us find the perfect solution to strengthen our presence in the European market.",
    attribution: "Mar Albiol, Gusta",
    logo: "https://a-us.storyblok.com/f/1021474/300x145/3a300b925a/vela.svg?w=384",
  },
  {
    quote:
      "Globalli has been a valuable partner in our softlanding journey. They connected us with Corpag and other key players, streamlining our international expansion to the Netherlands. A special thanks to Isidro Helder, whose strong network and hands-on support were crucial throughout the process.",
    attribution: "Rafael D'Alessandro, iblue consulting",
    logo: "https://a-us.storyblok.com/f/1021474/300x150/6164b91ec3/iblue.webp/m/384x0/filters:quality(80)",
  },
  {
    quote:
      "The team helped us find great service providers throughout Europe who were able to deliver within the extreme deadlines. We loved the personal touch!",
    attribution: "Shlomi Yosefian, SMB Capital",
    logo: "https://a-us.storyblok.com/f/1021474/512x160/f0714482d2/finray.webp/m/384x0/filters:quality(80)",
  },
  {
    quote:
      "We had an amazing Commercial Awareness session in Warsaw and are grateful for the guidance Isidro gave around our local/regional Value Proposition and Go To Market / Regional Expansion strategy. Highly recommendable!",
    attribution: "Bela Kakuk",
    logo: "https://a-us.storyblok.com/f/1021474/300x162/2836b32b41/playroll.svg?w=384",
  },
];

/* section 09 : footer nav columns, real headings with their real link lists */
const FOOTER_NAV: { label: string; links: string[] }[][] = [
  [
    {
      label: "HCM",
      links: [
        "Core HR",
        "Benefits Administration",
        "Communities",
        "Employee Onboarding",
        "Contractor Onboarding",
        "Time & Attendance",
        "Org Chart",
        "Localization",
        "Task & Notifications",
      ],
    },
    {
      label: "Entity Formation & Compliance",
      links: [
        "International Expansion",
        "Company Formation",
        "Accounting Tax",
        "Entity Management",
        "Corporate Compliance",
        "Financial Services",
        "Corporate Secretarial",
      ],
    },
  ],
  [
    {
      label: "Payroll & Tax",
      links: [
        "Global Payroll",
        "YDT/Bulk Data Upload",
        "Country Configuration",
        "Contractor Pay",
        "Agent of Record",
        "Payroll Calendar",
        "Gross to Net Engine",
      ],
    },
    {
      label: "Capabilities",
      links: [
        "Automation & Workflows",
        "Employer Cost Calculator",
        "Background Checks",
        "Hire Anywhere With Flexibility",
        "People Directory & Org Chart",
        "Reporting & Analytics",
        "Genius AI",
        "Insights",
      ],
    },
  ],
  [
    {
      label: "Employer Exp",
      links: [
        "User Access Management",
        "Add New Hire",
        "Expansion",
        "Hire Anyone, Anywhere",
        "Certifications",
        "Help Desk",
        "Global Workforce Management",
        "Country Overviews",
      ],
    },
    {
      label: "Solutions",
      links: [
        "BY BUSINESS SIZE",
        "Startup and Growup",
        "SMB",
        "Enterprise",
        "FOR TEAM",
        "Finance Teams",
        "Legal Teams",
        "People Managers",
      ],
      },
  ],
  [
    {
      label: "Employee Exp",
      links: [
        "Onboarding",
        "Employee Profile",
        "My Benefits",
        "Localization",
        "Timesheet Reporting",
        "Communities",
        "Virtual Wallets",
        "Identity & Access Management",
        "Inventory Management",
      ],
    },
    { label: "IT Compliance", links: ["Identity & Access Management", "Inventory Management"] },
  ],
  [
    {
      label: "Company",
      links: ["About Us", "Leadership", "Governance & Compliance", "Become A Partner", "Why Globalli"],
    },
    {
      label: "Partnership Integrations",
      links: ["Workday", "HiBob", "Kota", "Veremark", "Oracle", "SAP"],
    },
  ],
  [
    {
      label: "Resources",
      links: [
        "RESOURCE LIBRARY",
        "Blog",
        "eBooks",
        "Features",
        "FAQ",
        "Glossary",
        "News",
        "Podcast",
        "Press Releases",
        "Webinars",
        "Events",
        "Whitepapers",
        "Videos",
      ],
    },
  ],
];

/* group labels rendered as headings inside a link list, not as links */
const GROUP_LABELS = new Set(["BY BUSINESS SIZE", "FOR TEAM", "RESOURCE LIBRARY"]);

const LEGAL_LINKS = [
  "Disclaimer",
  "Privacy Notice",
  "Terms of Service",
  "Cookie Policy",
  "Copyright Policy",
];

/* header: real main nav items */
const NAV_ITEMS = ["Products", "Resources", "Company"];

/* header: real Products mega-menu items */
const MEGA_MENU_ITEMS = [
  "HCM",
  "Payroll & Tax",
  "IT Compliance",
  "Partnership Integrations",
  "Employer Experience",
  "Employee Experience",
  "Entity Formation & Compliance",
  "Speak With Sales",
  "View all",
];

/* header: real "Popular locations" mega-menu column */
const POPULAR_LOCATIONS = [
  "Australia",
  "China",
  "Hong Kong",
  "India",
  "Japan",
  "Singapore",
  "Switzerland",
  "Romania",
  "Denmark",
  "Norway",
  "Sweden",
  "Turkey",
  "Argentina",
  "Mexico",
  "Brazil",
  "Colombia",
  "Kenya",
  "Arabia",
  "Nigeria",
  "South Africa",
];

/* section 01 : the three real stat-row labels */
const HERO_STATS = [
  "Hire & manage in 125+ countries",
  "Streamline your operations",
  "Scale faster with ease",
];

export default function ComponentMockupGloballi() {
  return (
    <div className="gl-root">
      {/* ============ 00 header ============ */}
      <header className="gl-header">
        <div className="gl-header-inner">
          <div className="gl-announce">
            <p>
              Globalli Obtains SOC2 Type II Certification, Strengthening Global Data Security Standards
              <span>.</span>
              <a className="gl-announce-pill" href="#">
                <span>Read more</span>
              </a>
            </p>
          </div>

          <div className="gl-header-mid">
            <div className="gl-container">
              <div className="gl-header-utility">
                <div className="gl-header-utility-item">+1 888 263 5517</div>
                <div className="gl-header-utility-item">Contact Us</div>
                <div className="gl-header-utility-item">Get Started Now</div>
                <div className="gl-header-utility-globe">
                  <span />
                </div>
                <div className="gl-header-utility-item">ENG</div>
              </div>

              <div className="gl-nav">
                <a className="gl-nav-logo" href="#">
                  <img src={LOGO} alt="Globalli" width={78} height={25} />
                </a>

                <div className="gl-nav-menu">
                  {NAV_ITEMS.map((item, i) => (
                    <span className="gl-nav-menu-item" key={item}>
                      {item}
                      <i className="gl-nav-caret" />
                      {i === 0 ? (
                        <div className="gl-mega-menu">
                          <div className="gl-mega-col">
                            <div className="gl-mega-col-title">Featured</div>
                            {MEGA_MENU_ITEMS.slice(0, 4).map((m) => (
                              <a className="gl-mega-link" href="#" key={m}>
                                {m}
                              </a>
                            ))}
                          </div>
                          <div className="gl-mega-col">
                            <div className="gl-mega-col-title">Solutions</div>
                            {MEGA_MENU_ITEMS.slice(4, 7).map((m) => (
                              <a className="gl-mega-link" href="#" key={m}>
                                {m}
                              </a>
                            ))}
                          </div>
                          <div className="gl-mega-col">
                            <div className="gl-mega-col-title">Capabilities</div>
                            {MEGA_MENU_ITEMS.slice(7).map((m) => (
                              <a className="gl-mega-link" href="#" key={m}>
                                {m}
                              </a>
                            ))}
                          </div>
                          <div className="gl-mega-col gl-mega-col-locations">
                            <div className="gl-mega-col-title">Popular locations</div>
                            <div className="gl-mega-locations">
                              {POPULAR_LOCATIONS.map((loc) => (
                                <a className="gl-mega-link" href="#" key={loc}>
                                  {loc}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </span>
                  ))}
                </div>

                <div className="gl-nav-actions">
                  <a className="gl-nav-signin" href="#">
                    Sign In
                  </a>
                  <a className="gl-nav-cta" href="#">
                    Book a Time
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ 01 hero ============ */}
      <section className="gl-hero">
        <div className="gl-container">
          <div className="gl-hero-row">
            <div className="gl-hero-left">
              <div className="gl-hero-eyebrow">Workforce Management</div>
              <h1 className="gl-hero-h1">Global Workforce HR Management Solutions</h1>
              <p className="gl-hero-sub">
                Empower your business with the all-in-one global payroll and HR management solution to
                accelerate growth, streamline operations, and simplify workforce management from onboarding
                to offboarding in 125+ Countries.
              </p>

              <a className="gl-linkedin-pill" href="#">
                <img
                  src="https://a-us.storyblok.com/f/1021474/130x46/efe5ba70cc/follow-us-linkedin.png/m/256x0/filters:quality(80)"
                  alt="Follow us on LinkedIn"
                  width={65}
                  height={23}
                />
                <span className="gl-linkedin-pill-text">
                  <div>Join 50,000+ and Follow Us On LinkedIn</div>
                  <IconArrowRight />
                </span>
              </a>

              <div className="gl-hero-stats">
                {HERO_STATS.map((label) => (
                  <div className="gl-hero-stat" key={label}>
                    <span className="gl-hero-stat-tick" aria-hidden="true" />
                    <span className="gl-hero-stat-label">{label}</span>
                  </div>
                ))}
              </div>

              <div className="gl-hero-ctas">
                <a className="gl-btn-black gl-hero-cta-primary" href="#">
                  Get Started Today!
                </a>
                <div>
                  <a className="gl-btn-transparent" href="#">
                    See how it works
                  </a>
                </div>
              </div>
            </div>

            <div className="gl-hero-right">
              <div className="gl-hero-figure-wrap">
                <figure className="gl-hero-figure">
                  <img
                    src="https://a-us.storyblok.com/f/1021474/732x566/211dee02a5/hero-section-image.png/m/3840x0/filters:quality(80)"
                    alt="Globalli platform"
                    width={604}
                    height={467}
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 plug-and-play marketplace integrations ============ */}
      <section className="gl-marquee-section">
        <div className="gl-container gl-marquee-inner">
          <div className="gl-marquee-title">
            <h2>Plug-and-Play</h2>
            <h2>Marketplace Integrations</h2>
          </div>
          <div className="gl-marquee-viewport">
            <div className="gl-marquee-track">
              {[...INTEGRATION_LOGOS, ...INTEGRATION_LOGOS].map((logo, i) => (
                <div className="gl-marquee-item" key={`${logo.alt}-${i}`}>
                  <div>
                    <img src={logo.src} alt={logo.alt} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 03 workforce management platform ============ */}
      <section className="gl-wmp">
        <div className="gl-container">
          <h2>Workforce Management Platform powered by AI and Localized Automation Workflows</h2>

          <div className="gl-wmp-grid">
            {/* HRIS Platform : split card, 804.992 x 685 */}
            <div className="gl-wmp-span2">
              <div className="gl-card-split">
                <div className="gl-card-split-text">
                  <div>
                    <div>
                      <h3 className="gl-card-h3">HRIS Platform</h3>
                    </div>
                    <div>
                      <p className="gl-card-p">
                        Simplify HR for everything from hire to retire for global teams:
                      </p>
                      <ul className="gl-card-list">
                        <li>Employee database and reporting</li>
                        <li>Scheduling, Payroll, Time and Benefits</li>
                        <li>Goals, Performance and Communication</li>
                      </ul>
                    </div>
                  </div>
                  <a className="gl-learn-more" href="#">
                    Learn more
                  </a>
                </div>

                <div className="gl-card-split-media">
                  <img
                    src="https://a-us.storyblok.com/f/1021474/1016x1289/1466640a5f/blurb-11.png/m/3840x0/filters:quality(80)"
                    alt="HRIS Platform"
                  />
                </div>
              </div>
            </div>

            {/* Global Payroll : stacked card */}
            <div>
              <div className="gl-card-stack">
                <div className="gl-card-stack-media">
                  <img
                    src="https://a-us.storyblok.com/f/1021474/457x334/0d888ff54a/blurb-12.jpg/m/3840x0/filters:quality(80)"
                    alt="Global Payroll"
                  />
                </div>
                <div className="gl-card-stack-body">
                  <div>
                    <h3 className="gl-card-h3">Global Payroll</h3>
                  </div>
                  <div>
                    <p className="gl-card-p">
                      Experience a unified and harmonized realm of employee pay. Explore global payroll,
                      salary disbursements, and on-demand payment services, all provided as managed
                      services within a seamless, unified, global, cloud-based infrastructure.
                    </p>
                  </div>
                  <a className="gl-learn-more" href="#">
                    Learn more
                  </a>
                </div>
              </div>
            </div>

            {/* Flexible Employment Solutions : stacked card */}
            <div>
              <div className="gl-card-stack">
                <div className="gl-card-stack-media">
                  <img
                    src="https://a-us.storyblok.com/f/1021474/1552x1013/35c6f3ec08/blurb-13-mod.png/m/3840x0/filters:quality(80)"
                    alt="Flexible Employment Solutions"
                  />
                </div>
                <div className="gl-card-stack-body">
                  <div>
                    <h3 className="gl-card-h3">
                      <span>Flexible Employment Solutions</span>
                    </h3>
                  </div>
                  <div>
                    <p className="gl-card-p">
                      <span>
                        NO ENTITY, NO PROBLEM! Quickly expand your global teams by taking advantage of our
                        full suite of localized integrated solutions to hire who you want, wherever you
                        want, without setting up new entities.
                      </span>
                    </p>
                  </div>
                  <a className="gl-learn-more" href="#">
                    Learn more
                  </a>
                </div>
              </div>
            </div>

            {/* Contractor Pay : wide stacked card */}
            <div className="gl-wmp-span2">
              <div className="gl-card-stack">
                <div className="gl-card-stack-media gl-card-stack-media-raised">
                  <img
                    src="https://a-us.storyblok.com/f/1021474/944x332/28e655ebfe/home-blurb-image04.png/m/3840x0/filters:quality(80)"
                    alt="Contractor Pay"
                  />
                </div>
                <div className="gl-card-stack-body">
                  <div>
                    <h3 className="gl-card-h3">Contractor Pay</h3>
                  </div>
                  <div>
                    <p className="gl-card-p">
                      <span>
                        Streamline contractor management and payments effortlessly with our cutting-edge
                        solutions. Reduce misclassification risks with our innovative Contractor Pay plus
                        solution, Agent of Record. Enjoy automated onboarding, invoicing, vendor
                        management, and payment processes in just minutes. Elevate your contractor
                        experience today!
                      </span>
                    </p>
                  </div>
                  <a className="gl-learn-more" href="#">
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 04 all-in-one global people platform ============ */}
      <section className="gl-aio">
        <div className="gl-container">
          <div>
            <h2 className="gl-h2-big">Globalli Is Your All-in-One Global People Platform</h2>
          </div>

          <div className="gl-aio-body">
            <div className="gl-aio-tabs">
              <div className="gl-aio-tabs-inner">
                {AIO_TABS.map((tab, i) => (
                  <div className={`gl-aio-tab${i === 0 ? " is-active" : ""}`} key={tab.label}>
                    {tab.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="gl-aio-panel">
              <div className="gl-aio-panel-inner">
                <div className="gl-aio-panel-copy">
                  <h3 className="gl-aio-panel-heading">{AIO_TABS[0].heading}</h3>
                  <p className="gl-aio-panel-body">{AIO_TABS[0].body}</p>
                  <a className="gl-btn-black" href="#">
                    Learn More
                  </a>
                </div>
                <div className="gl-aio-panel-media">
                  <img
                    src="https://a-us.storyblok.com/f/1021474/1016x1289/1466640a5f/blurb-11.png/m/3840x0/filters:quality(80)"
                    alt="Globalli platform screens"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 05 industry leader (deep green band) ============ */}
      <section className="gl-leader">
        <div className="gl-container gl-leader-top">
          <div className="gl-leader-copy">
            <h2>Globalli Is Recognized As An Industry Leader</h2>
            <p>
              Download and Read whitepaper, blogs and reports from top global analyst firms on Globalli.
            </p>
            <a className="gl-btn-black" href="#">
              View all resources
            </a>
          </div>

          <div className="gl-leader-badge">
            <img
              src="https://a-us.storyblok.com/f/1021474/784x477/74ce1d2825/soctype-img.png/m/640x0/filters:quality(80)"
              alt="SOC2 Type2 &amp; ISO 27001"
              width={300}
              height={95}
            />
            <span>SOC2 Type2 &amp; ISO 27001</span>
          </div>
        </div>

        <img
          className="gl-leader-wide"
          src="https://a-us.storyblok.com/f/1021474/3454x1796/db04553236/home-section05-img.png/m/3840x0/filters:quality(80)"
          alt="Built for global teams"
        />
      </section>

      {/* ============ 06 we simplify global expansion ============ */}
      <section className="gl-simplify">
        <div className="gl-container">
          <div>
            <h2 className="gl-h2-big">We Simplify Global Expansion</h2>
          </div>

          <div className="gl-simplify-grid">
            {SIMPLIFY_CARDS.map((card) => (
              <div className="gl-simple-card" key={card.title}>
                <div className="gl-simple-card-icon">
                  <img src={card.icon} alt="Icon" width={68} height={59} />
                </div>
                <h3>{card.title}</h3>
                <div>
                  <p>
                    <span>{card.body}</span>
                  </p>
                </div>
              </div>
            ))}

            <div className="gl-simple-card gl-simple-card-cta">
              <h3>Let’s make global growth easy.</h3>
              <div />
              <a className="gl-btn-black" href="#">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 07 make your global teams feel connected ============ */}
      <section className="gl-connected">
        <div className="gl-container">
          <div className="gl-connected-title">
            <span>
              <h2>Make Your Global</h2>
              <h2>Teams Feel Connected</h2>
            </span>
          </div>

          <div className="gl-connected-grid">
            {CONNECTED_CARDS.map((card, i) => (
              <div className={`gl-connected-card gl-connected-card-${i + 1}`} key={card.title}>
                <div className="gl-connected-card-inner">
                  <div className="gl-connected-card-top">
                    <div>
                      <h3 className="gl-connected-card-h3">{card.title}</h3>
                      <p className="gl-connected-card-p">{card.body}</p>
                    </div>
                    <div className="gl-connected-card-link">
                      Learn More
                      <IconArrowRight />
                    </div>
                  </div>
                  <figure className="gl-connected-card-figure">
                    <img src={card.img} alt={card.alt} />
                  </figure>
                </div>
              </div>
            ))}
          </div>

          <div className="gl-connected-footer">
            <div className="gl-connected-footer-inner">
              <p>
                Hyper-localized dashboards and internal social networks help create a sense of teamwork,
                whether workers are in the office or at home, across states, continents or oceans.
              </p>
              <a className="gl-btn-black" href="#">
                See our Employee Experience
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 08 what our customers are saying ============ */}
      <section className="gl-testi">
        <div className="gl-container">
          <div className="gl-testi-wrapper">
            <h2>What Our Customers Are Saying</h2>

            <div className="gl-testi-body">
              <div className="gl-testi-photo">
                <img
                  src="https://a-us.storyblok.com/f/1021474/394x466/b3efa6ea79/testimonials-01.png/m/828x0/filters:quality(80)"
                  alt="Customer testimonial"
                  width={386}
                  height={460}
                />
              </div>

              <div className="gl-testi-quote">
                <span className="gl-testi-quote-mark">“</span>
                <p className="gl-testi-quote-text">{TESTIMONIALS[0].quote}</p>
                <div className="gl-testi-attribution">{TESTIMONIALS[0].attribution}</div>
                <div className="gl-testi-logo">
                  <img src={TESTIMONIALS[0].logo} alt="Company logo" />
                </div>
                <div className="gl-testi-line" />
                <div className="gl-testi-arrows">
                  <div className="gl-testi-arrow is-prev">
                    <img src={CHEVRON} alt="Previous" width={7} height={12} />
                  </div>
                  <div className="gl-testi-arrow">
                    <img src={CHEVRON} alt="Next" width={7} height={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="gl-testi-footer">
            <span className="gl-testi-footer-lead">Global Companies Grow with Globalli</span>
            <div className="gl-testi-footer-marquee">
              <div className="gl-testi-footer-track">
                {[...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS].map((src, i) => (
                  <div className="gl-testi-footer-logo" key={`${src}-${i}`}>
                    <img src={src} alt="Company logo" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 09 footer ============ */}
      <footer className="gl-footer">
        <div className="gl-footer-panel">
          <div className="gl-footer-bg" />

          <div className="gl-footer-main">
            <div className="gl-footer-grid">
              <div className="gl-footer-brand">
                <div className="gl-footer-brand-top">
                  <a href="#">
                    <img src={LOGO_FOOTER} alt="Globalli" width={160} height={48} />
                  </a>
                  <div className="gl-footer-tagline">Scale Worldwide. Thrive Globalli</div>
                </div>

                <div className="gl-footer-contact">
                  <div className="gl-footer-contact-title">Contact Us</div>
                  <div>
                    <a className="gl-footer-link-sm" href="#">
                      Speak to sales
                    </a>
                    <a className="gl-footer-link-sm" href="#">
                      Request A Quote Online
                    </a>
                    <a className="gl-footer-link-sm" href="#">
                      Get Support
                    </a>
                  </div>
                  <div className="gl-footer-rule" />
                  <div className="gl-footer-account">
                    <a className="gl-footer-link-accent" href="#">
                      Sign In
                    </a>
                    <a className="gl-footer-link-accent" href="#">
                      Get Started
                    </a>
                  </div>
                </div>
              </div>

              <div className="gl-footer-nav">
                {FOOTER_NAV.map((col, ci) => (
                  <div className="gl-footer-nav-col" key={`col-${ci}`}>
                    {col.map((group) => (
                      <div className="gl-footer-nav-group" key={group.label}>
                        <label className="gl-footer-nav-label">{group.label}</label>
                        <ul className="gl-footer-nav-list">
                          {group.links.map((link) =>
                            GROUP_LABELS.has(link) ? (
                              <li className="gl-footer-nav-sublabel" key={link}>
                                {link}
                              </li>
                            ) : (
                              <li key={link}>
                                <a className="gl-footer-nav-link" href="#">
                                  {link}
                                </a>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="gl-footer-certs-row" />

          <div className="gl-footer-bottom">
            <div className="gl-footer-certs">
              <img
                src="https://a-us.storyblok.com/f/1021474/280x97/6834dc925a/certification-1.png/m/384x0/filters:quality(80)"
                alt="certification-1"
                height={48}
              />
              <img
                src="https://a-us.storyblok.com/f/1021474/280x97/47e530e1eb/certification-2.png/m/384x0/filters:quality(80)"
                alt="certification-2"
                height={48}
              />
              <img
                src="https://a-us.storyblok.com/f/1021474/811x290/d8e8632f90/soc2-type2.png/m/384x0/filters:quality(80)"
                alt="soc 2 type 2"
                height={48}
              />
            </div>

            <ul className="gl-footer-legal">
              {LEGAL_LINKS.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gl-footer-copyright">
          © Copyright 2026 All Rights Reserved to Globalli Workforce Technology Solutions Inc.
        </div>
      </footer>
    </div>
  );
}
