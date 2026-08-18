import * as React from "react";
import "./index.css";

/* ------------------------------------------------------------------ */
/* asset constants (all hot-linked from the real site)                 */
/* ------------------------------------------------------------------ */
const CDN = "https://cdn.prod.website-files.com/5f1a8e281bd3433d5faa74f8";
const CDN2 = "https://cdn.prod.website-files.com/5f23ea6573efdd34e5776065";

const LOGO = `${CDN}/6707caba2ca23cc91d7d5563_branding%20new.svg`;
const CAPTERRA = `${CDN}/68ee6f2662f01fd2ecc9eb76_Component%2024%20%E2%80%93%202.svg`;
const SOC2 = `${CDN}/62fcee00d0d01f8276cc205d_21972-312_SOC_NonCPA.png`;
const USERS_LOVE_US = `${CDN}/6a2a5cc294f17b930a3b11b7_users-love-us%20(1).svg`;
const TAG_ICON = `${CDN}/6707de18d89109c672c48ca0_virtuoso%20v3%20sm%20icon%20blue.png`;
const ROI_ARROW = `${CDN}/68ee7bf02e6ba39744b32fb9_Group%2015057.svg`;
const AVATAR = `${CDN}/657894b06be03dcfc575bde0_anonymous-avatar-rorange-fd9203f82b4bce0d014644f4c61011fb28de19a479b95c263fb9561b90995bc9.svg`;
const ARROW = `${CDN}/620fd9a71afbe0e5266bb15b_arrow.svg`;

/* trust-strip logos, cycled across the ×22 marquee row */
const CLIENT_LOGOS = [
  { src: `${CDN}/66b63c4758f3fa7e1f5990d3_Group%203230.png`, alt: "FNZ logo" },
  { src: `${CDN}/66b63c48e37b4fec039d2bc2_Group%203233.png`, alt: "Accenture logo" },
  { src: `${CDN}/66b63c478bae121139cced01_dxc.png`, alt: "DXC Technology logo" },
  { src: `${CDN}/66b63c472d646d01380c5f16_Group%203231.png`, alt: "Zurich logo" },
  { src: `${CDN}/66b639c11b172a6ffca96207_Group%203228.png`, alt: "NetApp logo" },
  { src: `${CDN}/68b6f5d17aec430a832946c5_access..svg`, alt: "The Access Group logo" },
  { src: `${CDN}/68b7061f6757555826ccd891_Group%203241.svg`, alt: "Trupanion logo" },
];

const MARQUEE = Array.from({ length: 22 }, (_, i) => CLIENT_LOGOS[i % CLIENT_LOGOS.length]);

/* ------------------------------------------------------------------ */
/* header                                                              */
/* ------------------------------------------------------------------ */
const NAV_DROPDOWNS = ["Product", "Solutions", "Resources", "Company"];

function Header() {
  return (
    <div className="vq-nav-page-padding">
      <div className="vq-nav-wrapper">
        <a className="vq-logo-link" href="/">
          <img className="vq-logo-main" src={LOGO} alt="Virtuoso logo" width={168} height={33} />
        </a>
        <div className="vq-main-nav-wrapper">
          {NAV_DROPDOWNS.map((label) => (
            <div className="vq-nav-item" key={label}>
              <span>{label}</span>
              <span className="vq-caret" />
            </div>
          ))}
          <a className="vq-nav-item" href="/pricing">
            Pricing
          </a>
        </div>
        <div className="vq-nav-cta-wrapper">
          <a className="vq-button-primary-nav" href="/get-started">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 hero                                                             */
/* ------------------------------------------------------------------ */
const HERO_BADGES: Array<{
  src: string;
  alt?: string;
  title?: string;
  copy: React.ReactNode;
  imgClass?: string;
}> = [
  {
    src: SOC2,
    alt: "Blue circular badge with text AICPA SOC for Service Organizations",
    title: "SOC 2 Type II",
    copy: "Enterprise security and compliance",
  },
  {
    src: `${CDN}/68e6c95e59ef6ccaf4397205_images%20(23)%201.webp`,
    alt: "AWS Partner logo with orange angled border.",
    title: "AWS Partner",
    copy: "Advanced Technology Partner",
  },
  {
    src: `${CDN}/68e6c95b0aabcc62a636d521_Group%202147222085.png`,
    alt: "Forrester badge stating Wave Strong Performer 2024.",
    title: "Forrester Wave",
    copy: "Strong Performer 2024",
  },
  {
    src: USERS_LOVE_US,
    alt: "G2 Users Love Us badge",
    copy: (
      <>
        <img className="vq-capterra-img" src={CAPTERRA} alt="Capterra 4.5 star rating" />
        <p className="vq-text-size-small">
          <strong>4.5</strong> Rated out of 5 by customers on G2
        </p>
      </>
    ),
  },
];

function SectionHero() {
  return (
    <section className="vq-section-hero">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-hero">
          <div className="vq-container-large">
            <div className="vq-hero-grid">
              <div className="vq-hero-content">
                <div className="vq-value-wrapper">
                  <img className="vq-capterra-img" src={CAPTERRA} alt="Capterra 4.5 star rating" />
                  <div className="vq-g2-stars-wrapper">
                    <div className="vq-text-g2-reviews">4.5</div>
                    <div className="vq-text-g2-reviews-reg">100+ Reviews</div>
                  </div>
                </div>
                <div className="vq-hero-content-wrapper">
                  <h1 className="vq-heading-hero">
                    AI Generates Software. Virtuoso Generates The Evidence To Trust It.
                  </h1>
                  <p className="vq-hero-sub">
                    Code now ships faster than any team can verify by hand. Virtuoso tests any
                    browser-based application autonomously, then turns every run into evidence: what
                    ran, what changed, what healed and why.
                  </p>
                  <div className="vq-buttons-container">
                    <a className="vq-primary-button" href="/interactive-demo">
                      See Virtuoso in Action
                    </a>
                    <a className="vq-secondary-button vq-hero-secondary" href="/get-started">
                      Book a Demo
                    </a>
                  </div>
                </div>
              </div>

              <div className="vq-hero-image-wrapper">
                <div className="vq-lottie-wrapper">
                  <img
                    className="vq-hero-visual"
                    src={`${CDN}/6a833251e0ba0934acce5e95_animation%20staticv2.webp`}
                    alt="Virtuoso features in application"
                  />
                  <a className="vq-overlay-link-demo" href="/interactive-demo" aria-label="See Virtuoso in Action">
                    <span className="vq-play-icon-video">
                      <img
                        src={`${CDN}/68ee8eec523be4d7c1ae0566_689e4fca5613d5a4a2aa9d92_play-blue.svg.svg`}
                        alt="Play"
                        width={48}
                        height={48}
                      />
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="vq-container-large">
              <div className="vq-subtext-demo">Trusted by 100+ Leading Organizations</div>
              <div className="vq-clients-section">
                <img
                  className="vq-img-fade vq-img-fade-1"
                  src={`${CDN}/6241a1e677829b911742af0c_shape%20gradient%201.png`}
                  alt=""
                />
                <img
                  className="vq-img-fade vq-img-fade-2"
                  src={`${CDN}/6241a1e5025102fa28508509_shape%20gradient%202.png`}
                  alt=""
                />
                <div className="vq-client-wrapper">
                  {MARQUEE.map((logo, i) => (
                    <div className="vq-block-client" key={`mq-${i}`}>
                      <img className="vq-demo-client" src={logo.src} alt={logo.alt} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="vq-block-card-features">
                <div className="vq-content-title">
                  {HERO_BADGES.map((b) => (
                    <div className="vq-badge-cell" key={b.title || "g2"}>
                      <img className="vq-img-fullwidth" src={b.src} alt={b.alt || ""} />
                      <div>
                        {b.title ? (
                          <>
                            <div className="vq-cms-link-text-default">{b.title}</div>
                            <p className="vq-text-size-small">{b.copy}</p>
                          </>
                        ) : (
                          b.copy
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 02 why now                                                          */
/* ------------------------------------------------------------------ */
const WHY_NOW_POINTS = [
  {
    n: "1",
    kicker: "What changed",
    title: "The volume moved",
    copy:
      "AI writes more code in a day than your team can read in a week. Review was always the constraint. Now it's the only one.",
  },
  {
    n: "2",
    kicker: "The Gap",
    title: "Passing is not proof",
    copy:
      "Your suite goes green. That tells you the code did what the test asked. It doesn't tell you the test asked the right thing.",
  },
  {
    n: "3",
    kicker: "What it costs",
    title: "You cannot answer for it",
    copy:
      'When someone outside your team asks why you shipped, "the suite passed" is not an answer they can use.',
  },
];

function SectionWhyNow() {
  return (
    <section className="vq-section">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-64">
          <div className="vq-container-large">
            <div className="vq-container-medium">
              <div className="vq-margin-xlarge">
                <div className="vq-app-icon-small">
                  <img src={`${CDN}/68e95e8e9524899b2189f40d_Group%202147222094.svg`} alt="Virtuoso icon" />
                </div>
                <h2 className="vq-whynow-heading">Why Now</h2>
              </div>
            </div>

            <div className="vq-capabilities-grid-v4">
              <div className="vq-quote-block">
                <div className="vq-customer-quote">
                  <div className="vq-subheading-quote-v4">
                    <div>Software is no longer the bottleneck. Confidence is.</div>
                  </div>
                  <div className="vq-subheading-quote-v1">
                    <div className="vq-cms-link-text-v6">The bottom line</div>
                    <div className="vq-block-user-content-v4">
                      <div className="vq-subtext-user-v3">
                        <span className="vq-hs4">
                          Virtuoso's Touchstone introduces a new paradigm for enterprise QA.
                        </span>{" "}
                        The agentic loop built for the age of AI-generated software.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="vq-left-layout-content-v3">
                {WHY_NOW_POINTS.map((p) => (
                  <div className="vq-block-card-numbers" key={p.n}>
                    <div className="vq-block-number-horizontal">
                      <div className="vq-circle-wrapper-n">
                        <div>{p.n}</div>
                      </div>
                      <div>
                        <div className="vq-cms-link-text">{p.kicker}</div>
                        <div className="vq-heading-xsmall-faq">{p.title}</div>
                        <p className="vq-text-size-small">{p.copy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 documentation becomes test suite                                 */
/* ------------------------------------------------------------------ */
function SectionDocumentation() {
  return (
    <section className="vq-section vq-section-cyan">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-default">
          <div className="vq-container-large">
            <div className="vq-layout-new-center">
              <div className="vq-yt-vid">
                <div className="vq-yt-embed">
                  <iframe
                    title="Virtuoso Touchstone"
                    src="https://www.youtube.com/embed/videoseries"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="vq-width50">
                <div className="vq-margin-large">
                  <div className="vq-subtitle">
                    <img className="vq-icon-tag" src={TAG_ICON} alt="Blue check mark icon" />
                    <div className="vq-text-subtitle">
                      Touchstone: The standard of proof for AI-generated software
                    </div>
                  </div>
                  <h2 className="vq-heading-doc">
                    Your Documentation Becomes Your Test Suite. You Approve Every Step.
                  </h2>
                  <p className="vq-text-size-regular">
                    Touchstone turns the context you already have (specs, tickets, and process
                    documents) into runnable, maintainable tests. <strong>30+ Specialised agents</strong>{" "}
                    read your knowledge base, propose requirements and journeys as reviewable diffs,
                    and cite the source behind every artefact. Nothing publishes without human
                    approval.
                  </p>
                  <div className="vq-buttons-container" style={{ marginTop: 24 }}>
                    <a className="vq-primary-button" href="/get-started">
                      Watch Touchstone in Action
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="vq-container-large">
              <div className="vq-block-tick-horizontal">
                <img
                  className="vq-tick-asset"
                  src={`${CDN}/695c3d181c7b2f3d20d383c5_Group%2014827.svg`}
                  alt="Codeless Test Automation"
                />
                <p className="vq-tick-text">
                  The result: Velocity without assurance is risk moving faster. Touchstone governs
                  both.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 with evidence or without it                                      */
/* ------------------------------------------------------------------ */
function SectionEvidenceOrWithout() {
  return (
    <section className="vq-section">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-04">
          <div className="vq-gradient-cta">
            <div className="vq-block-card-outline-cyan">
              <div className="vq-container-large">
                <div className="vq-container-medium-center">
                  <div className="vq-subtitle">
                    <div className="vq-text-subtitle">Agentic Testing</div>
                  </div>
                  <div>
                    <h2 className="vq-heading-large vq-text-center" style={{ marginBottom: 16 }}>
                      With Evidence or Without It?
                    </h2>
                    <p className="vq-text-size-large-medium">Same speed. Different outcome.</p>
                  </div>
                  <p className="vq-text-size-regular vq-text-center">
                    The market is racing to sell agentic AI that acts on its own. Touchstone takes a
                    different position: AI reasons, a deterministic engine executes, a person
                    approves what matters, and every decision is recorded.
                  </p>
                </div>

                <div className="vq-container-large">
                  <div className="vq-features-tabs-2">
                    <div className="vq-tabs-menu-v4">
                      <a className="vq-tab-button-active" href="#w-tabs-0-data-w-pane-0">
                        <div>Without Touchestone</div>
                      </a>
                      <a className="vq-tab-button-idle" href="#w-tabs-0-data-w-pane-1">
                        <div>With Touchestone</div>
                      </a>
                    </div>
                    <div className="vq-tabs-content-04">
                      <img
                        className="vq-img-full"
                        src={`${CDN}/6a833251e0ba0934acce5e95_animation%20staticv2.webp`}
                        alt="Virtuoso features in application"
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
  );
}

/* ------------------------------------------------------------------ */
/* 05 every decision leaves evidence                                   */
/* ------------------------------------------------------------------ */
const EVIDENCE_CARDS = [
  {
    icon: `${CDN}/69c30cbfda31c14ebad69727_Group%202147222419.svg`,
    title: "Reasoned execution",
    copy:
      "AI takes a natural language objective, proposes the plan, builds the test, and runs it in a real browser. A person approves what matters at each critical point, that gate isn't a toggle you can switch off.",
    tags: [
      { label: "Plan", tone: "green" },
      { label: "Build", tone: "green" },
      { label: "Run", tone: "green" },
    ],
  },
  {
    icon: `${CDN}/6a840b13ff6d80e2392349aa_Frameghf.svg`,
    title: "Built on your context",
    copy:
      "Touchstone ingests your specifications, policies and business requirements, generating tests that trace back to the source they came from, not a generic guess at intent.",
    tags: [
      { label: "Spec", tone: "green" },
      { label: "Policy", tone: "green" },
      { label: "Requirements", tone: "green" },
    ],
  },
  {
    icon: `${CDN}/69c30cbf19cfb6d36792a8a9_Group%202147222421.svg`,
    title: "Recorded by design",
    copy:
      "Every proposal, decision and test run is logged and traceable. When someone outside the team asks what shipped and why, the answer is already there, not assembled after the fact.",
    tags: [
      { label: "Proposed", tone: "grey" },
      { label: "Approved", tone: "green" },
      { label: "Recorded", tone: "green" },
      { label: "Approved", tone: "green" },
    ],
  },
];

function SectionEveryDecision() {
  return (
    <section className="vq-section">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-default">
          <div className="vq-container-medium-align-center">
            <div className="vq-subtitle">
              <div className="vq-text-subtitle">Evidence</div>
            </div>
            <h2 className="vq-heading-medium vq-text-center" style={{ marginBottom: 24 }}>
              Every Decision Leaves Evidence
            </h2>
            <p className="vq-text-size-regular vq-text-center">
              In insurance, wealth management and other regulated sectors, a passing test isn't
              enough. You need to show which requirement it covers, who approved it, and what
              changed.
            </p>
          </div>

          <div className="vq-container-large">
            <div className="vq-grid-3-card">
              {EVIDENCE_CARDS.map((c) => (
                <div className="vq-block-card-hm" key={c.title}>
                  <div className="vq-icon-wrap">
                    <img className="vq-icon-medium" src={c.icon} alt="Codeless Test Automation" />
                  </div>
                  <div>
                    <p className="vq-subititle-v-new">{c.title}</p>
                    <p className="vq-subtext-medium">{c.copy}</p>
                  </div>
                  <div className="vq-tags-wrapper">
                    {c.tags.map((t, i) => (
                      <div
                        className={t.tone === "grey" ? "vq-tag-grey" : "vq-tag-green"}
                        key={`${c.title}-${t.label}-${i}`}
                      >
                        <div>{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 06 whoever signs off                                                */
/* ------------------------------------------------------------------ */
const PERSONA_CARDS = [
  {
    cls: "vq-v-blue",
    img: `${CDN}/68ef40c6c4e44979f236139c_Group%202147222113.svg`,
    title: "QA & Engineering Leaders",
    copy: "Out of maintenance mode, back to designing the quality strategy, with control intact.",
  },
  {
    cls: "vq-v-green",
    img: `${CDN}/68ef422b62193262919b50f3_Group%202147222120fddf.svg`,
    title: "Technology Leaders",
    copy:
      "The pace of AI-driven delivery, with a decision trail you can explain to anyone who asks.",
  },
  {
    cls: "vq-v-purple",
    img: `${CDN}/68ef41c0bf0ca0aae2a67cc0_Group%202147222120.svg`,
    title: "Regulated Enterprise",
    copy:
      "Every test traces back to rule, policy or requirement, giving you clear accountability and evidence you can trust.",
  },
];

function SectionWhoeverSignsOff() {
  return (
    <section className="vq-section">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-mt2">
          <div className="vq-container-large">
            <div className="vq-layout-new-hz">
              <div className="vq-container-medium-v4">
                <div className="vq-subtitle">
                  <div className="vq-text-subtitle">For those responsible for quality</div>
                </div>
                <h2 className="vq-heading-medium vq-heading-medium-left">
                  Whoever Signs Off, This is Built For Them
                </h2>
              </div>

              <div className="vq-grid-3-card" style={{ width: "100%" }}>
                {PERSONA_CARDS.map((c) => (
                  <div className={`vq-block-card-persona ${c.cls}`} key={c.title}>
                    <div className="vq-img-card-wrapper">
                      <img className="vq-card-img-vsm" src={c.img} alt="Codeless Test Automation" />
                    </div>
                    <div>
                      <p className="vq-subititle-v-new">{c.title}</p>
                      <p className="vq-subtext-medium">{c.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 07 scope                                                            */
/* ------------------------------------------------------------------ */
function SectionScope() {
  return (
    <section className="vq-section vq-section-cyan">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-mt2">
          <div className="vq-container-large">
            <div className="vq-layout-new-hz">
              <div className="vq-container-medium-v4">
                <div className="vq-subtitle">
                  <div className="vq-text-subtitle">Scope</div>
                </div>
                <h2 className="vq-heading-medium vq-text-center" style={{ marginBottom: 24 }}>
                  If Your Team Builds It and Runs It In The Browser, Touchestone Can Test It
                </h2>
                <a className="vq-secondary-button" href="/solutions/applications">
                  Explore Applications
                </a>
              </div>

              <div className="vq-grid-wrapper-cl">
                {Array.from({ length: 7 }, (_, i) => (
                  <div className="vq-subtitle-cl" key={`cl-${i}`}>
                    <img
                      src={`${CDN}/6a841b44830a203c65a2e7ad_Frame%202147228573.png`}
                      alt="Supported application logos"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 08 proven ROI                                                       */
/* ------------------------------------------------------------------ */
const ROI_STATS = [
  {
    logo: `${CDN}/68ef43dc55a032e47347e7df_APG_BIG-80a84082%201.png`,
    logoAlt: "API Group logo text.",
    logoCls: "vq-logo-full-v2",
    stat: "10x",
    copy: "faster execution throughput",
    href: "https://www.virtuosoqa.com/case-studies/transforming-erp-testing",
    lastCol: false,
  },
  {
    logo: `${CDN}/68ef43dcae4675dfb93d27ac_Group%202147222124.png`,
    logoAlt: "WSDOT logo with stylized graphic symbol to the left of the acronym.",
    logoCls: "vq-logo-full-v1",
    stat: "9×",
    copy: "faster test authoring speed compared to traditional frameworks",
    href:
      "https://www.virtuosoqa.com/case-studies/next-generation-testing-for-application-modernization",
    lastCol: false,
  },
  {
    logo: `${CDN}/68ef43dce9d5f95764cde64d_Group%202147222123.png`,
    logoAlt: "Perficient logo.",
    logoCls: "vq-logo-full-v3",
    stat: "85%",
    copy: "less maintenance effort",
    href:
      "https://www.virtuosoqa.com/case-studies/perficient-cuts-test-development-time-by-67-with-virtuoso-qa",
    lastCol: false,
  },
  {
    logo: `${CDN}/68ef43dc21f7535e987b5156_Group%202147222122.png`,
    logoAlt: "iClicker logo with text 'a macmillan learning company' underneath.",
    logoCls: "vq-logo-full-v3",
    stat: "50%+",
    copy: "overall QA cost reduction",
    href: "https://www.virtuosoqa.com/case-studies/implementing-an-automation-first-testing-strategy",
    lastCol: true,
  },
];

function SectionProvenRoi() {
  return (
    <section className="vq-section vq-section-cyan">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-64">
          <div className="vq-container-large">
            <div className="vq-container-medium">
              <div className="vq-margin-large">
                <h2 className="vq-heading-medium vq-text-center" style={{ marginBottom: 24 }}>
                  Proven ROI for Enterprise QA
                </h2>
              </div>
            </div>

            <div className="vq-grid-4-card-pricing">
              {ROI_STATS.map((s) => (
                <div
                  className={`vq-stats-pricing${s.lastCol ? " vq-no-line" : ""}`}
                  key={s.stat + s.copy}
                >
                  <div className="vq-icon-logo">
                    <img className={s.logoCls} src={s.logo} alt={s.logoAlt} />
                  </div>
                  <div className="vq-content-roi-wrapper">
                    <div className="vq-content-block-roi">
                      <div className="vq-subtitle-wrapper">
                        <p className="vq-subititle-large">{s.stat}</p>
                        <img className="vq-icon-medium" src={ROI_ARROW} alt="" />
                      </div>
                      <div className="vq-subtext-small">{s.copy}</div>
                    </div>
                  </div>
                  <a className="vq-secondary-button-medium" href={s.href}>
                    <div>See Full Case Study</div>
                  </a>
                </div>
              ))}
            </div>

            <div className="vq-center-margin-large">
              <a className="vq-primary-button" href="/roi-calculator">
                Calculate Your ROI
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 09 see what your next release will look like                         */
/* ------------------------------------------------------------------ */
function SectionNextRelease() {
  return (
    <section className="vq-section">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-mt2b">
          <div className="vq-container-large">
            <div className="vq-block-card-outline-cyan-v2">
              <div className="vq-grid-2-card">
                <div className="vq-left-layout-center-left">
                  <h3 className="vq-heading-medium-09">
                    See What Your Next Release Will Look Like In{" "}
                    <span className="vq-vs-gradient">Virtuoso QA</span>
                  </h3>
                  <p className="vq-text-size-regular">
                    Book a walkthrough on your own applications and workflows. Bring a requirement, a
                    user journey, or a brittle legacy script, and watch the loop run on something you
                    recognise.
                  </p>
                  <div className="vq-buttons-container-tm">
                    <div className="vq-margin-right-small">
                      <a className="vq-primary-button" href="/get-started">
                        Book a Demo
                      </a>
                    </div>
                    <a className="vq-secondary-button-play" href="/interactive-demo">
                      <img
                        src={`${CDN}/67463f2c1c6c0a1914e770ef_playbtnnew.svg`}
                        alt="Play video button"
                      />
                      <div>See Interactive Demo</div>
                    </a>
                    <div className="vq-video-link">
                      <a className="vq-lightbox-link" href="#">
                        <img
                          className="vq-image-52"
                          src={`${CDN}/6203caff198f018d0e46e647_play%20button.svg`}
                          alt="Play video button"
                        />
                        <div className="vq-text-block-30">See for yourself</div>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="vq-right-image-wrapper">
                  <img
                    className="vq-img-default-square"
                    src={`${CDN}/68ee8b63dd995b9d03a31e3c_Group%2014973ds.webp`}
                    alt="3D blue cube with a white downward-pointing arrow on top"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 10 unlocking potential (tabs)                                       */
/* ------------------------------------------------------------------ */
const CAPABILITY_TABS = [
  {
    tab: "Complete Coverage",
    logo: `${CDN}/66d1d9b94427e9c56d26ee3e_616fc7694fdccc0b7de5ffc2_coaching.png`,
    logoAlt: "coaching.com logo",
    logoCls: "vq-logo-card-large",
    heading: "Robust Testing and Complete Coverage",
    quote:
      "“Before using the platform, we performed a lot of time-consuming manual testing. Once we started running automated tests we felt a huge sense of relief knowing that Virtuoso was testing our core functionality. This enhanced our platform’s reliability and allowed us to focus on building new features.",
    person: "Gina Cross",
    role: "QA and Product, coaching.com",
    href: "https://www.virtuosoqa.com/case-studies/the-journey-to-full-test-automation",
    img: `${CDN}/69160b78cbd8139eb4a29f86_Mask%20groupfddfdfdfdfddf.webp`,
  },
  {
    tab: "Release Faster",
    logo: `${CDN}/66d1d9b96ce806338dfab075_616fc76b4088eba26fc694e2_harbr.png`,
    logoAlt: "Harbr company logo",
    logoCls: "vq-logo-card-large",
    heading: "Lighting-Fast Releases",
    quote:
      "“This is awesome, saves us so much time when performing acceptance testing and ensures we identify issues before our customers do.”",
    person: "Xhenis Alimadhi",
    role: "Technical Support Engineer, Harbr",
    href: "https://www.virtuosoqa.com/case-studies/customer-centric",
    img: `${CDN}/691622e64fa9d1e57a1f45ba_build-and-deploy-dfdfdf.webp`,
  },
  {
    tab: "Seamless Onboarding",
    logo: `${CDN}/66d1d9b939ffc0437e19795f_616fc76bad014f9a1985b762_kidly.png`,
    logoAlt: "Colorful Kidly logo",
    logoCls: "vq-logo-card-large",
    heading: "Tailored Support and Seamless Onboarding",
    quote:
      "“Virtuoso has been fantastic and supportive at onboarding us and getting us up and running with a suite of tests.”",
    person: "Natasha Bates",
    role: "Lead Front-end Engineer, KIDLY",
    href: "https://www.virtuosoqa.com/case-studies/full-test-automation-with-no-qa-team",
    img: `${CDN}/6917406a3ebbf3e41e52ac81_ITSM%20%26%20Operations%20Platforms.webp`,
  },
  {
    tab: "Develop More",
    logo: `${CDN}/66d1d9b988987b70d816613b_toolstation-halo.png`,
    logoAlt: "Toolstation company logo",
    logoCls: "vq-logo-card-large",
    heading: "Spend More Time Developing",
    quote:
      "“It’s freed up lots of time to look at testing strategies as a whole rather than spending the majority of the time test executing. So, we can spend more time assessing test coverage and writing tests to make sure we’ve got everything covered.”",
    person: "Kayleigh Sweet",
    role: "Senior Test Analyst, Toolstation",
    href: "",
    img: `${CDN}/69171c6c9d74aa4a24b004d2_Mask%20groupfdddssds.webp`,
  },
];

function SectionUnlockingPotential() {
  const active = CAPABILITY_TABS[0];
  return (
    <section className="vq-section vq-section-cyan" id="test-authoring">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-capabilities">
          <div className="vq-container-medium">
            <div className="vq-margin-medium">
              <h2 className="vq-heading-medium-alt vq-text-center" style={{ marginBottom: 24 }}>
                Unlocking potential for enterprises worldwide with our AI testing Tool
              </h2>
            </div>
          </div>

          <div className="vq-container-large">
            <div className="vq-features-tabs">
              <div className="vq-tabs-menu-new">
                {CAPABILITY_TABS.map((t, i) => (
                  <a
                    className={i === 0 ? "vq-tab-button-new-active" : "vq-tab-button-new-idle"}
                    href={`#w-tabs-1-data-w-pane-${i}`}
                    key={t.tab}
                  >
                    <div>{t.tab}</div>
                  </a>
                ))}
              </div>

              <div className="vq-tabs-content">
                <div className="vq-capabilities-tabs-grid">
                  <div className="vq-left-layout-content">
                    <img className={active.logoCls} src={active.logo} alt={active.logoAlt} />
                    <h2 className="vq-heading-small-blue">{active.heading}</h2>
                    <p className="vq-text-capabilities">{active.quote}</p>
                    <div className="vq-user-row">
                      <img className="vq-img-user-small" src={AVATAR} alt={`Person, ${active.person}`} />
                      <div className="vq-subtext-user-g2">
                        <span className="vq-text-span-15">{active.person}</span>
                        <br />
                        {active.role}
                      </div>
                    </div>
                    <a className="vq-primary-button" href={active.href}>
                      View Full Case Study
                    </a>
                  </div>

                  <div className="vq-right-image-wrapper">
                    <img
                      className="vq-imgui"
                      src={active.img}
                      alt="Virtuoso features in application"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 11 integrations                                                     */
/* ------------------------------------------------------------------ */
function SectionIntegrations() {
  return (
    <section className="vq-section-integrations">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-align-center">
          <div className="vq-container-medium-vcenter">
            <div className="vq-g-tag-wrapper">
              <div className="vq-subtitle">
                <img
                  className="vq-icon-small-2"
                  src={`${CDN}/66d1e47d0ef1ff5bddf2cd65_Layer%202.svg`}
                  alt=""
                />
                <div className="vq-text-blue-semibold">Integrations</div>
              </div>
            </div>
            <h2 className="vq-heading-medium-alt vq-text-center" style={{ marginBottom: 24 }}>
              Works with what you&rsquo;ve got
            </h2>
            <p className="vq-text-size-regular vq-text-center vq-integrations-copy">
              Seamless integrations with Jira, Jenkins, TestRail, GitHub, Azure DevOps, BrowserStack,
              and more. Plug in and start testing, no friction, no rebuilds.
            </p>
            <a className="vq-secondary-button" href="/integrations">
              <div>View All Our Integrations</div>
            </a>
          </div>

          <div className="vq-integrations-bg-holder">
            <img
              className="vq-img-bg-integrations"
              src={`${CDN}/66d1c66b0bfd9600fcf06037_integrationsnew3.webp`}
              alt="Grid of various software and collaboration tool icons including Azure, Jira, Git"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 12 FAQ                                                              */
/* ------------------------------------------------------------------ */
const FAQ_ICON = `${CDN}/6749c82f1fb5c7ec53d6d490_Vector%20386ds.svg`;

const FAQ_ITEMS = Array.from({ length: 5 }, () => ({
  q: "What makes Virtuoso QA different from other test automation tools?",
  a: (
    <>
      Virtuoso QA is <strong>AI-native</strong>, built from the ground up with NLP, ML, and
      self-healing. Legacy tools bolt on AI; Virtuoso QA was born with it.
    </>
  ),
}));

function SectionFaq() {
  return (
    <section className="vq-section-faq">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-default">
          <div className="vq-container-medium">
            <div>
              <div className="vq-margin-medium">
                <h2 className="vq-heading-small-semi">Frequent Asked Questions</h2>
              </div>
            </div>

            <div className="vq-grid-1-card">
              {FAQ_ITEMS.map((item, i) => (
                <div className="vq-faq-item" key={`faq-${i}`}>
                  <div className="vq-faq-question">
                    <h3 className="vq-faq-q">{item.q}</h3>
                    <div className="vq-faq-icon-wrapper">
                      <img className="vq-faq-icon" src={FAQ_ICON} alt="" />
                    </div>
                  </div>
                  {i === 0 ? (
                    <div className="vq-faq-answer">
                      <div className="vq-faq-answer-content">
                        <div className="vq-faq-a">{item.a}</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 13 other resources                                                  */
/* ------------------------------------------------------------------ */
const RESOURCES = [
  {
    href: "/post/ad-hoc-vs-exploratory-testing",
    img: `${CDN2}/6a7f5a5182e19408f4dc8ad8_Difference%20between%20Adhoc%20Testing%20and%20Exploratory%20Testing.jpg`,
    title: "Ad Hoc Testing vs Exploratory Testing: The Real Differen...",
    alt: "Ad Hoc Testing vs Exploratory Testing: The Real Difference",
  },
  {
    href: "/post/user-journey-testing",
    img: `${CDN2}/6a7ec54da918e9784b0e77c0_Journey%20Testing.jpg`,
    title: "What is User Journey Testing and How to Run it...",
    alt: "What is User Journey Testing and How to Run it",
  },
  {
    href: "/post/preconditions-in-test-cases",
    img: `${CDN2}/6a7b20ea30861c2fd2a1f767_Preconditions%20in%20Test%20Cases.jpg`,
    title: "Preconditions in Test Cases: What They Are, How to Write...",
    alt: "Preconditions in Test Cases: What They Are, How to Write",
  },
];

function SectionResources() {
  return (
    <section className="vq-section-resources">
      <div className="vq-page-padding">
        <div className="vq-padding-vertical-medium">
          <div className="vq-container-large">
            <div className="vq-container-medium">
              <div className="vq-margin-small-vcenter">
                <div className="vq-subtitle">
                  <img className="vq-icon-tag" src={TAG_ICON} alt="Blue check mark icon" />
                  <div className="vq-text-subtitle">Resources</div>
                </div>
              </div>
              <div className="vq-margin-xlarge">
                <h2 className="vq-heading-medium vq-text-center" style={{ marginBottom: 24 }}>
                  Other Resources
                </h2>
              </div>
            </div>

            <div className="vq-margin-xlarge">
              <div className="vq-resources-row">
                {RESOURCES.map((r) => (
                  <div className="vq-collection-item" key={r.href}>
                    <a className="vq-block-resource" href={r.href}>
                      <img className="vq-resource-image" src={r.img} alt={r.alt} />
                      <div className="vq-subtitle-resource">Blog</div>
                      <div className="vq-heading-xsmall-featured">{r.title}</div>
                      <div className="vq-read-more-row">
                        <div className="vq-cms-link-text">Read More</div>
                        <img className="vq-arrow-icon" src={ARROW} alt="Arrow" />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 14 footer                                                           */
/* ------------------------------------------------------------------ */
const SOCIALS = [
  {
    href: "https://www.linkedin.com/company/virtuoso-qa/",
    bg: `${CDN}/636d10afca23fd5ce7ee9e44_LinkedIn_icon_circle.svg`,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com/virtuoso_QA",
    bg: `${CDN}/651a8d3d519d007f13842d96_Group%2014843.svg`,
    label: "X",
  },
  {
    href: "https://www.facebook.com/virtuosoQA",
    bg: `${CDN}/636d10ae48181464c326c218_Facebook_circle_pictogram.svg`,
    label: "Facebook",
  },
  {
    href: "https://discord.gg/DNydwaSReq",
    bg: `${CDN}/636d10ad58f7604db4b27829_discord-v2.svg`,
    label: "Discord",
  },
  {
    href: "https://www.youtube.com/channel/UCMFQdPidQtZf2uSGDnJwy6w",
    bg: `${CDN}/636d10afb8612137500c37ec_YouTube_social_red_circle_(2017).svg`,
    label: "YouTube",
  },
];

const FOOTER_PRODUCT = Array.from({ length: 4 }, () => ({
  label: "Features",
  href: "/product-features",
}));

const FOOTER_SOLUTIONS = Array.from({ length: 4 }, () => ({
  label: "AI-Powered Test Automation",
  href: "/solutions/ai-powered-test-automation",
}));

const FOOTER_TECH = Array.from({ length: 5 }, () => ({
  label: "Business Systems",
  href: "/solutions/business-systems",
}));

const FOOTER_INDUSTRY = Array.from({ length: 4 }, () => ({
  label: "Insurance",
  href: "/solutions/insurtech-test-automation",
}));

const FOOTER_RESOURCES = Array.from({ length: 10 }, () => ({
  label: "Webinars",
  href: "/webinars",
}));

function FooterLinks({
  items,
  extraLast,
}: {
  items: Array<{ label: string; href: string }>;
  extraLast?: boolean;
}) {
  return (
    <>
      {items.map((l, i) => (
        <a
          className={
            extraLast && i === items.length - 1 ? "vq-footer-link vq-footer-link-extra" : "vq-footer-link"
          }
          href={l.href}
          key={`${l.label}-${i}`}
        >
          {l.label}
        </a>
      ))}
    </>
  );
}

function Footer() {
  return (
    <footer className="vq-footer">
      <div className="vq-section-cta">
        <div className="vq-wrapper-cta">
          <div className="vq-container-large">
            <div className="vq-cta-component-wrapper">
              <div className="vq-container-small-left">
                <h2 className="vq-heading-white">
                  Ready to experience 10x faster testing? Talk to our solution experts today.
                </h2>
                <a className="vq-tertiary-button" href="/get-started">
                  Talk to Sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="vq-footer-updated">
        <div className="vq-page-padding">
          <div className="vq-padding-vertical-xxlarge">
            <div className="vq-container-large">
              <div className="vq-footer-custom">
                {/* about column */}
                <div className="vq-footer-block-about">
                  <a className="vq-logo-footer-link" href="/">
                    <img className="vq-logo-main-ft" src={LOGO} alt="Virtuoso logo" />
                  </a>
                  <div className="vq-footer-about-copy">
                    <div className="vq-text-size-small">
                      Virtuoso uses AI, ML, NLP, and Robotic Process Automation to run a test
                      automation tool that gives you the speed of low-code/no-code paired with the
                      power of scripted test steps.
                    </div>
                  </div>
                  <div className="vq-line-asset" />
                  <div className="vq-footer-block-social">
                    {SOCIALS.map((s) => (
                      <a
                        className="vq-social-icon-wrapper"
                        href={s.href}
                        key={s.label}
                        aria-label={s.label}
                        style={{ backgroundImage: `url("${s.bg}")` }}
                      />
                    ))}
                  </div>
                  <div className="vq-g2-footer">
                    <div className="vq-g2-wrapper-small vq-g2-wrapper-soc2">
                      <img src={SOC2} alt="AICPA SOC for Service Organizations badge" />
                    </div>
                    {Array.from({ length: 6 }, (_, i) => (
                      <div className="vq-g2-wrapper-small" key={`g2-${i}`}>
                        <img src={USERS_LOVE_US} alt="G2 Users Love Us badge" />
                      </div>
                    ))}
                  </div>
                  <a className="vq-footer-subtitle-trust" href="https://trust.spotqa.com/">
                    <img className="vq-icon-sm" src={`${CDN}/69f08559cb0a1290300de460_images%20(39).png`} alt="" />
                    <div>Trust Center</div>
                  </a>
                </div>

                {/* product / solutions by role */}
                <div className="vq-footer-block-padded">
                  <div className="vq-footer-subtitle">
                    <div>Product</div>
                  </div>
                  <FooterLinks items={FOOTER_PRODUCT} />
                  <a className="vq-footer-link vq-footer-link-extra" href="https://www.virtuoso.qa/book-a-demo">
                    Get Started
                  </a>
                  <div className="vq-footer-subtitle">
                    <div>Solutions By Role</div>
                  </div>
                  <a className="vq-footer-link" href="/solutions/qa-manager">
                    QA Managers
                  </a>
                  <a className="vq-footer-link" href="/solutions/qa-practitioner">
                    QA Practitioners
                  </a>
                  <a className="vq-footer-link" href="/solutions/qa-manager">
                    Senior Executives
                  </a>
                </div>

                {/* solutions column */}
                <div>
                  <div className="vq-footer-subtitle">
                    <div>Solutions</div>
                  </div>
                  <FooterLinks items={FOOTER_SOLUTIONS} />
                  <a
                    className="vq-footer-link vq-footer-link-extra"
                    href="/solutions/low-code-no-code-test-automation"
                  >
                    Low-Code/No-Code Test Automation
                  </a>
                  <div className="vq-footer-subtitle">
                    <div>Solutions By Technology</div>
                  </div>
                  <FooterLinks items={FOOTER_TECH} />
                  <div className="vq-footer-subtitle">
                    <div>Solutions By Industry</div>
                  </div>
                  <FooterLinks items={FOOTER_INDUSTRY} />
                </div>

                {/* resources column */}
                <div className="vq-footer-block-padded">
                  <div className="vq-footer-subtitle">
                    <div>Resources</div>
                  </div>
                  <FooterLinks items={FOOTER_RESOURCES} />
                </div>

                {/* company column */}
                <div className="vq-footer-block-padded">
                  <div className="vq-footer-subtitle">
                    <div>Company</div>
                  </div>
                  <a className="vq-footer-link" href="/about">
                    About
                  </a>
                  <a className="vq-footer-link" href="/partners">
                    Partners
                  </a>
                  <a className="vq-footer-link" href="/soc-2">
                    Soc2
                  </a>
                  <div>
                    <a className="vq-footer-link" href="https://careers.virtuoso.qa/">
                      Careers
                    </a>
                  </div>
                  <a className="vq-footer-link" href="/press">
                    Press
                  </a>
                  <a className="vq-footer-link" href="/contact">
                    Contact Us
                  </a>
                  <a className="vq-footer-link" href="/terms-of-service">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* root                                                                */
/* ------------------------------------------------------------------ */
export default function ComponentMockupVirtuosoQa(): JSX.Element {
  return (
    <div className="vq-root cc-root">
      <Header />
      <SectionHero />
      <SectionWhyNow />
      <SectionDocumentation />
      <SectionEvidenceOrWithout />
      <SectionEveryDecision />
      <SectionWhoeverSignsOff />
      <SectionScope />
      <SectionProvenRoi />
      <SectionNextRelease />
      <SectionUnlockingPotential />
      <SectionIntegrations />
      <SectionFaq />
      <SectionResources />
      <Footer />
    </div>
  );
}
