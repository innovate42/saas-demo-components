import React, { useState } from "react";
import "./index.css";

const LOGO_WHITE =
  "https://sprinto.com/wp-content/uploads/2026/07/Sprinto-white-logo-1.webp";
const LOGO_MULBERRY =
  "https://sprinto.com/wp-content/uploads/2026/07/Sprinto-mulberry-logo-1.webp";

const NAV_ITEMS = [
  "Platform",
  "Frameworks",
  "Resources",
  "Features",
  "Pricing",
  "Company",
];

const FRAMEWORK_BADGES = [
  {
    alt: "SOC 2",
    src: "https://sprinto.com/wp-content/uploads/2026/08/SOC-2-banner-badge.webp",
  },
  {
    alt: "ISO 27001",
    src: "https://sprinto.com/wp-content/uploads/2026/08/ISO-banner-badge.webp",
  },
  {
    alt: "GDPR",
    src: "https://sprinto.com/wp-content/uploads/2026/08/GDPR-banner-badge.webp",
  },
  {
    alt: "HIPAA",
    src: "https://sprinto.com/wp-content/uploads/2026/08/HIPAA-banner-badge.webp",
  },
  {
    alt: "PCI DSS",
    src: "https://sprinto.com/wp-content/uploads/2026/08/PCI-banner-badge.webp",
  },
  {
    alt: "HITRUST",
    src: "https://sprinto.com/wp-content/uploads/2026/08/HITRUST-banner-badge.webp",
  },
  {
    alt: "CCPA",
    src: "https://sprinto.com/wp-content/uploads/2026/08/CCPA-banner-badge.webp",
  },
];

const CUSTOMER_LOGOS = [
  { alt: "Whatfix", src: "https://sprinto.com/wp-content/uploads/2026/03/what-fix.webp" },
  { alt: "Toolkitaki", src: "https://sprinto.com/wp-content/uploads/2026/03/tool-kit-aki.webp" },
  { alt: "Turtlemint", src: "https://sprinto.com/wp-content/uploads/2026/03/turtlemint.webp" },
  { alt: "Synaptic", src: "https://sprinto.com/wp-content/uploads/2026/03/synaptic.webp" },
  { alt: "HackerRank", src: "https://sprinto.com/wp-content/uploads/2026/03/hacker-rank.webp" },
  { alt: "SmartWinnr", src: "https://sprinto.com/wp-content/uploads/2026/03/SmartWinnr-White.webp" },
  { alt: "Wework", src: "https://sprinto.com/wp-content/uploads/2026/03/wework-logo.webp" },
  { alt: "BuyerAssist", src: "https://sprinto.com/wp-content/uploads/2026/03/buyer-assist.webp" },
  { alt: "Anaconda", src: "https://sprinto.com/wp-content/uploads/2026/03/anaconda.webp" },
  { alt: "CometChat", src: "https://sprinto.com/wp-content/uploads/2026/03/CometChat.webp" },
  { alt: "CodeRabbit", src: "https://sprinto.com/wp-content/uploads/2026/03/code-rabbit.webp" },
  { alt: "Docsumo", src: "https://sprinto.com/wp-content/uploads/2026/03/docusumo.webp" },
  { alt: "Shipsy", src: "https://sprinto.com/wp-content/uploads/2026/03/shipsy.webp" },
  { alt: "Nium", src: "https://sprinto.com/wp-content/uploads/2026/03/nium.webp" },
  { alt: "Giga", src: "https://sprinto.com/wp-content/uploads/2026/03/giga.webp" },
];

const STAGE_TABS = [
  {
    key: "startups",
    tab: "Startups",
    heading: "Your first compliance operator.",
    body:
      "No one owns compliance at your startup. That's fine, until it isn't. Sprinto steps in as your compliance team: scopes your SOC 2, ISO 27001, or HIPAA program, connects to your systems, closes the gaps, and gets you to audit readiness.",
    img: "https://sprinto.com/wp-content/uploads/2026/03/startups-img-1.webp",
  },
  {
    key: "growing",
    tab: "Growing companies",
    heading: "Trust ops on autopilot.",
    body:
      "You passed SOC 2. Now there's ISO 27001, a HIPAA requirement, five enterprise customers with different questionnaires, and three overlapping audit cycles. Sprinto runs it as a continuous program, not a recurring fire drill.",
    img: "https://sprinto.com/wp-content/uploads/2026/03/growing-companies-img.webp",
  },
  {
    key: "enterprises",
    tab: "Enterprises",
    heading: "A defensible trust posture. Always.",
    body:
      "At your scale, the risk surface never stops growing. New vendors, shadow AI, regulatory change, regional nuance. Sprinto maintains a live, continuously validated trust posture across compliance, regulatory requirements, AI governance, and vendor risk.",
    img: "https://sprinto.com/wp-content/uploads/2026/03/enterprises-img.webp",
  },
];

const PRODUCT_BLOCKS = [
  {
    label: "Unified Commitments",
    body:
      "Frameworks. Regulations. Contracts. Internal policies. Sprinto interprets them, structures them into machine-readable controls, maps them to your environment, and keeps them continuously updated. You stay current with every rule you're accountable for. Always and automatically.",
    links: ["Learn more"],
    img: "https://sprinto.com/wp-content/uploads/2026/07/unified_commitments.webp",
  },
  {
    label: "Continuous Compliance",
    body:
      "Compliance that runs itself. Sprinto monitors your controls around the clock. When something drifts, it doesn't alert you and wait. It acts by closing gaps, refreshing evidence, and routing approvals. You approve decisions. Sprinto handles execution.",
    links: [],
    img: "https://sprinto.com/wp-content/uploads/2026/07/continous-compliance.webp",
  },
  {
    label: "Autonomous TPRM",
    body:
      "Vendor risk that doesn't wait for renewal. Sprinto discovers vendors as they enter your environment. Tiers them by risk, launches due diligence automatically and follows up until complete. Every third-party relationship: reviewed, documented, and current.",
    links: [],
    img: "https://sprinto.com/wp-content/uploads/2026/07/autonomous_TPRM.webp",
  },
  {
    label: "AI Governance",
    body:
      "Shadow AI cannot hide from Sprinto. Sprinto detects AI tool adoption across your organization, maintains a live registry, classifies risk by data, and maps your AI footprint to ISO 42001, NIST AI RMF, and the EU AI Act. As AI regulation accelerates, Sprinto keeps pace so you don't have to.",
    links: [],
    img: "https://sprinto.com/wp-content/uploads/2026/07/autonomous_ai_governance.webp",
  },
  {
    label: "Risk Management",
    body:
      "Risk posture that reflects reality, not last quarter. Sprinto continuously recalculates inherent and residual risk from live signals across your systems, vendors, and compliance posture. Leadership gets a risk picture that's true today.",
    links: [],
    img: "https://sprinto.com/wp-content/uploads/2026/07/risk_management.webp",
  },
  {
    label: "Trust Center & Security Questionnaire",
    body:
      "Launch a Trust Center and complete security reviews in minutes. Sprinto autonomously syncs verified compliance data, keeps everything continuously updated, and generates accurate responses, so external trust stays current without manual effort.",
    links: ["Explore Trust Center", "Explore Security Questionnaire"],
    img: "https://sprinto.com/wp-content/uploads/2026/07/trust-center-report.webp",
  },
];

const COVERAGE_CARDS = [
  {
    heading: "200+ Frameworks. And Counting.",
    body:
      "SOC 2, ISO 27001, HIPAA, GDPR, PCI DSS, and 200+ global standards. Upload any additional regulation or contract, Sprinto translates it into controls automatically.",
    link: "Learn more",
    img: "https://sprinto.com/wp-content/uploads/2026/08/infinite-frameworks-beyond.webp",
  },
  {
    heading: "300+ integrations. Connect everything.",
    body:
      "Native connections across cloud, identity, HR, and SaaS. Changes are detected the moment they happen with the ability to add any new system.",
    link: "View all integrations",
    img: "https://sprinto.com/wp-content/uploads/2026/07/integrations-300.webp",
  },
];

const TESTIMONIALS = [
  {
    name: "Andy Wallace",
    title: "Chief Information Officer, Fyxer.ai",
    quote:
      "There isn't another platform I would recommend other than Sprinto. It's low maintenance, low resource, and such a key part of the sales process to advertise your compliance and certifications. With Sprinto, I'm able to engage just on the pieces of the audit feedback which matter.",
    img: "https://sprinto.com/wp-content/uploads/2026/03/Andy-Wallace.webp",
  },
  {
    name: "David Emerson",
    title: "Founder & CEO, SiteRocket Labs",
    quote:
      "The benefit with Sprinto is that it gives us 100% flexibility over the infrastructure setup. We can use any public cloud and tools that we want. We value Sprinto also for its ability to provide continuous monitoring and enable easy vendor security audits.",
    img: "https://sprinto.com/wp-content/uploads/2026/03/David-Emerson.webp",
  },
  {
    name: "Gajenddra Raj",
    title: "Chief Technology Officer, Neopharma",
    quote:
      "One of the best parts about Sprinto is its ease of use. Even the non-technical people in our organization were able to use it effectively. Everything that the auditor needed was already up on the Sprinto dashboard. This was the fastest audit experience we had.",
    img: "https://sprinto.com/wp-content/uploads/2026/03/Gajenddar-Raj.webp",
  },
];

const COMPARISON_ROWS = [
  {
    label: "Multiple frameworks",
    other: "New project every time",
    sprinto: "Auto-mapped, always current",
  },
  {
    label: "Evidence",
    other: "Basic evidence collection",
    sprinto: "AI-powered collection and gap analysis",
  },
  {
    label: "Vendor risk",
    other: "Sends questionnaires",
    sprinto: "Runs diligence end-to-end",
  },
  { label: "Audit prep", other: "Reminds you", sprinto: "AI-powered audit prep" },
  {
    label: "AI governance",
    other: "Policy document",
    sprinto: "Live registry, real-time risk",
  },
  {
    label: "Human role",
    other: "Running the program",
    sprinto: "Leading the decisions",
  },
];

const SHAPES_DIVIDER =
  "https://sprinto.com/wp-content/uploads/2026/03/shapes-image-scaled.webp";

export interface SprintoMockupProps {
  heading?: string;
  ctaLabel?: string;
}

const SprintoMockup: React.FC<SprintoMockupProps> = ({
  heading = "Trust doesn't wait for your next audit. Neither does Sprinto.",
  ctaLabel = "Book a demo",
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const stage = STAGE_TABS[activeTab];

  return (
    <div className="spr">
      {/* HERO */}
      <section className="spr-hero">
        <header className="spr-nav">
          <div className="spr-nav__inner">
            <img className="spr-nav__logo" src={LOGO_WHITE} alt="Sprinto" />
            <nav className="spr-nav__links">
              {NAV_ITEMS.map((item) => (
                <span className="spr-nav__link" key={item}>
                  {item}
                </span>
              ))}
            </nav>
            <div className="spr-nav__actions">
              <span className="spr-nav__link">Login</span>
              <span className="spr-btn spr-btn--white">Book a demo</span>
            </div>
          </div>
        </header>

        <div className="spr-hero__inner">
          <h1 className="spr-hero__title">{heading}</h1>
          <p className="spr-hero__body">
            The world's first Autonomous Trust Platform. Sprinto detects change
            across your posture, determines what's at risk, and acts, across
            compliance, vendor risk, AI governance, and more, so your
            organization stays trustworthy without the operational chaos.
          </p>
          <div className="spr-hero__cta">
            <span className="spr-btn spr-btn--white spr-btn--lg">{ctaLabel}</span>
          </div>
          <div className="spr-hero__badges">
            <span className="spr-hero__eyebrow">200+ FRAMEWORKS AND MORE</span>
            <div className="spr-hero__badgerow">
              {FRAMEWORK_BADGES.map((b) => (
                <img
                  className="spr-hero__badge"
                  key={b.alt}
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER LOGO STRIP */}
      <section className="spr-logos">
        <p className="spr-logos__label">
          Trusted by 3,000+ companies from Series A to enterprise
        </p>
        <div className="spr-logos__grid">
          {CUSTOMER_LOGOS.map((l) => (
            <img
              className="spr-logos__logo"
              key={l.alt}
              src={l.src}
              alt={l.alt}
              loading="lazy"
            />
          ))}
        </div>
      </section>

      {/* BUILT FOR EVERY STAGE (tabbed) */}
      <section className="spr-stage">
        <h2 className="spr-h2">Built for every stage of trust</h2>
        <div className="spr-stage__tabs">
          {STAGE_TABS.map((t, i) => (
            <button
              type="button"
              key={t.key}
              className={
                "spr-stage__tab" + (i === activeTab ? " is-active" : "")
              }
              onClick={() => setActiveTab(i)}
            >
              {t.heading}
            </button>
          ))}
        </div>
        <div className="spr-stage__panel">
          <div className="spr-stage__copy">
            <h3 className="spr-stage__h3">{stage.heading}</h3>
            <p className="spr-stage__body">{stage.body}</p>
            <span className="spr-link">Learn more</span>
          </div>
          <div className="spr-stage__media">
            <img src={stage.img} alt={stage.tab} loading="lazy" />
          </div>
        </div>
      </section>

      <img className="spr-divider" src={SHAPES_DIVIDER} alt="" loading="lazy" />

      {/* UNIFIED PLATFORM */}
      <section className="spr-platform">
        <h2 className="spr-h2">One unified autonomous trust platform.</h2>
        <div className="spr-platform__list">
          {PRODUCT_BLOCKS.map((p) => (
            <article className="spr-product" key={p.label}>
              <div className="spr-product__copy">
                <h3 className="spr-product__label">{p.label}</h3>
                <p className="spr-product__body">{p.body}</p>
                {p.links.length > 0 && (
                  <div className="spr-product__links">
                    {p.links.map((l) => (
                      <span className="spr-link" key={l}>
                        {l}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="spr-product__media">
                <img src={p.img} alt={p.label} loading="lazy" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BUILT TO COVER EVERYTHING */}
      <section className="spr-coverage">
        <h2 className="spr-h2">Built to cover everything</h2>
        <div className="spr-coverage__cards">
          {COVERAGE_CARDS.map((c) => (
            <article className="spr-coverage__card" key={c.heading}>
              <h3 className="spr-coverage__h3">{c.heading}</h3>
              <p className="spr-coverage__body">{c.body}</p>
              <span className="spr-link">{c.link}</span>
              <div className="spr-coverage__media">
                <img src={c.img} alt={c.heading} loading="lazy" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="spr-quotes">
        <h2 className="spr-h2 spr-h2--navy">Here's what our customers say</h2>
        <div className="spr-quotes__grid">
          {TESTIMONIALS.map((t) => (
            <article className="spr-quote" key={t.name}>
              <div className="spr-quote__photo">
                <img src={t.img} alt={t.name} loading="lazy" />
              </div>
              <div className="spr-quote__copy">
                <img
                  className="spr-quote__mark"
                  src="https://sprinto.com/wp-content/uploads/2025/11/block-quote.webp"
                  alt=""
                  loading="lazy"
                />
                <p className="spr-quote__text">{t.quote}</p>
                <p className="spr-quote__name">{t.name}</p>
                <p className="spr-quote__title">{t.title}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="spr-compare">
        <h2 className="spr-h2 spr-h2--navy">Sprinto is categorically different</h2>
        <p className="spr-compare__sub">
          Other tools automate tasks. Sprinto owns outcomes.
        </p>
        <div className="spr-compare__table">
          <div className="spr-compare__head">
            <div className="spr-compare__cell spr-compare__cell--label" />
            <div className="spr-compare__cell spr-compare__cell--other">
              GRC Tools
            </div>
            <div className="spr-compare__cell spr-compare__cell--sprinto">
              <img src={LOGO_MULBERRY} alt="Sprinto" />
            </div>
          </div>
          {COMPARISON_ROWS.map((r) => (
            <div className="spr-compare__row" key={r.label}>
              <div className="spr-compare__cell spr-compare__cell--label">
                {r.label}
              </div>
              <div className="spr-compare__cell spr-compare__cell--other">
                {r.other}
              </div>
              <div className="spr-compare__cell spr-compare__cell--sprinto">
                {r.sprinto}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="spr-final">
        <div className="spr-final__banner">
          <img
            className="spr-final__deco spr-final__deco--tl"
            src="https://sprinto.com/wp-content/uploads/2026/04/banner-bg-top-left.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="spr-final__deco spr-final__deco--tr"
            src="https://sprinto.com/wp-content/uploads/2026/04/banner-bg-top-right.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="spr-final__deco spr-final__deco--cr"
            src="https://sprinto.com/wp-content/uploads/2026/04/banner-bg-center-right.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="spr-final__deco spr-final__deco--bl"
            src="https://sprinto.com/wp-content/uploads/2026/03/banner-color-bg-5.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="spr-final__deco spr-final__deco--br"
            src="https://sprinto.com/wp-content/uploads/2026/04/banner-bg-bottom-right.webp"
            alt=""
            loading="lazy"
          />
          <div className="spr-final__inner">
            <h2 className="spr-final__title">
              The era of autonomous trust starts now.
            </h2>
            <p className="spr-final__body">
              Autonomous trust isn't a feature upgrade. It's a shift in how
              compliance and risk operate.
            </p>
            <div className="spr-final__cta">
              <span className="spr-btn spr-btn--white spr-btn--lg">
                Get started with Sprinto
              </span>
              <span className="spr-btn spr-btn--outline spr-btn--lg">
                Book a demo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="spr-footer">
        <img className="spr-footer__logo" src={LOGO_WHITE} alt="Sprinto" />
      </footer>
    </div>
  );
};

export default SprintoMockup;
