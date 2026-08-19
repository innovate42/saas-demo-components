import React from "react";
import "./index.css";

/* ---------------------------------------------------------------------------
 * Detectify homepage replica (visual only).
 * Authored from captured section specs. No configuration / props.
 * ------------------------------------------------------------------------- */

const CaretIcon = () => (
  <svg viewBox="0 0 10 10" fill="currentColor" width={9} height={9} aria-hidden="true">
    <path d="M5 7L1 3h8z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width={14} height={14} aria-hidden="true">
    <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M2.5 14c0-2.5 2.5-4.5 5.5-4.5s5.5 2 5.5 4.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={20}
    height={20}
    aria-hidden="true"
  >
    <path d="M5 7.5l5 5 5-5" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    width={14}
    height={14}
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="8" />
    <path d="M6.5 10.5l2.2 2.2L14 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={18} height={18} aria-hidden="true">
    <path d="M16 3H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zM7 15H5V8h2v7zM6 7a1 1 0 110-2 1 1 0 010 2zm9 8h-2v-3.5c0-.8-.3-1.4-1.1-1.4-.6 0-.9.4-1.1.8-.1.1-.1.3-.1.5V15h-2V8h2v.9c.3-.4.8-1 2-1 1.5 0 2.4 1 2.4 3V15z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={18} height={18} aria-hidden="true">
    <path d="M14 3h2.5l-5.5 6.3L17.5 17h-5l-3.9-5.1L4.5 17H2l5.9-6.7L2 3h5.1l3.5 4.6L14 3zm-1 12.5h1.4L6 4.4H4.5L13 15.5z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={18} height={18} aria-hidden="true">
    <path d="M10 2C5.6 2 2 5.6 2 10c0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4v-1.5c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.4.7.1-.5.3-.9.5-1.1-1.8-.2-3.7-.9-3.7-4 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1 .1 1.8.1 2 .5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.7 4 .3.2.5.7.5 1.4v2c0 .2.1.5.5.4 3.2-1.1 5.5-4.1 5.5-7.6 0-4.4-3.6-8-8-8z" />
  </svg>
);

/* Arrow glyph used by the "Read more" style links (Font Awesome arrow-right). */
const Arrow = ({ size = 14 }: { size?: number }) => (
  <i className="dtf-arrow" aria-hidden="true" style={{ width: size * 1.25, height: size }}>
    <svg viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth={1.6} width={size * 1.25} height={size}>
      <path d="M2 8h15" strokeLinecap="round" />
      <path d="M12 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </i>
);

/* ---------------------------------- data --------------------------------- */

const NAV_ITEMS = ["Platform", "Solutions", "Customers", "Resources", "Company", "Pricing"];

const TRUST_LOGO = "https://d177qf5ebwbrnj.cloudfront.net/client-logos/trustly.svg";
const TRUST_CELLS = 10;

type Product = {
  icon: string;
  title: string;
  blurb: string;
  bullets: string[];
  href: string;
  linkLabel: string;
  dark?: boolean;
};

const PRODUCTS: Product[] = [
  {
    icon: "https://d35ayjp87i0qx4.cloudfront.net/symbol.svg",
    title: "API Scanning",
    blurb:
      "API Scanning actively tests your APIs the way an attacker would, using 100% payload-based techniques and our Dynamic AI Fuzzing engine.",
    bullets: [
      "Probes endpoints, auth flows, and exploitable vulnerabilities",
      "Covers REST and GraphQL",
      "New APIs discovered and tested automatically",
    ],
    href: "/product/api-scanning",
    linkLabel: "Explore API Scanning",
  },
  {
    icon: "https://d35ayjp87i0qx4.cloudfront.net/symbol-1.svg",
    title: "Surface Monitoring",
    blurb:
      "Surface Monitoring continuously discovers and maps every asset across your external attack surface, running payload-based testing across all of it.",
    bullets: [
      "Maps domains, subdomains, IPs, technologies, ports, protocols",
      "Payload-based vulnerability testing on every asset",
      "New assets scanned the moment they appear",
    ],
    href: "/product/surface-monitoring",
    linkLabel: "Explore Surface Monitoring",
    dark: true,
  },
  {
    icon: "https://d35ayjp87i0qx4.cloudfront.net/symbol-2.svg",
    title: "Application Scanning",
    blurb:
      "Application Scanning goes beyond the surface with deep, authenticated DAST testing at scale.",
    bullets: [
      "Advanced crawling reaches deep application logic",
      "AI-powered fuzzing finds what signatures miss",
      "Finds the vulnerabilities others overlook",
    ],
    href: "/product/application-scanning",
    linkLabel: "Explore Application Scanning",
  },
];

const ALSO_CARDS = Array.from({ length: 5 }, () => ({
  icon: "https://d35ayjp87i0qx4.cloudfront.net/internal-scanning.svg",
  title: "Internal Scanning",
  desc: "Extend coverage beyond the perimeter to internal systems and services.",
  href: "/product/internal-scanning",
}));

const FEATURE_CARDS = Array.from({ length: 4 }, () => ({
  icon: "https://detectify.com/homev2-icons/feature-1.svg",
  title: "600+ subdomain takeover discovery methods",
  body:
    "The most comprehensive subdomain takeover detection available anywhere. Proprietary, continuously updated by our crowdsource hacker community, and built to find the exposures that generic scanners don't even look for.",
}));

const PROOF_CARDS = Array.from({ length: 4 }, () => ({
  logo: "https://d35ayjp87i0qx4.cloudfront.net/client-logos/abc-fitness-logo-gray.svg",
  alt: "ABC Fitness",
  quote:
    "“ Surface Monitoring shows us exactly what tech each acquisition runs so we can align across the enterprise. ”",
  href: "/resources/case-studies/abc-fitness",
}));

const CROWD_STATS = Array.from({ length: 4 }, () => ({
  num: "400+",
  label: "Ethical hackers",
}));

const NEWS = [
  {
    href:
      "https://blog.detectify.com/best-practices/operationalizing-secure-by-design-a-cisos-guide-to-closing-the-gap-between-pol",
    img:
      "https://blogadmin.detectify.com/app/uploads/2026/08/operationalizing-secure-by-design-768x480.png",
    cat: "Best Practices",
    title:
      "Operationalizing Secure by Design: a CISO’s guide to closing the gap between policy and reality",
    body:
      "Close the gap between security policy and production reality. Discover 5 operational shifts top CISOs use to operationalize Secure by Design principles.",
  },
  {
    href: "https://blog.detectify.com/product-updates/apex-discovery-to-secure-every-domain/",
    img: "https://blogadmin.detectify.com/app/uploads/2026/07/apex-discovery-768x480.png",
    cat: "Product Updates",
    title: "Introducing Apex Discovery to secure every domain you actually own",
    body:
      "Apex Discovery provides insights into unmonitored domains, ensuring your organization has complete security coverage to reduce risks.",
  },
  {
    href: "https://blog.detectify.com/best-practices/why-legacy-dast-tools-fail-modern-appsec/",
    img: "https://blogadmin.detectify.com/app/uploads/2026/07/DAST-Tools-768x480.png",
    cat: "Best Practices",
    title: "Why traditional DAST Tools fail modern AppSec teams (and how to fix it)",
    body:
      "Stop alert fatigue. Discover how modern DAST tools use payload-based verification to eliminate false positives and secure your evolving attack surface.",
  },
];

const FAQS = Array.from({ length: 7 }, () => "What is Detectify?");

const FOOTER_COLS = Array.from({ length: 4 }, () => ({
  title: "Platform",
  links: Array.from({ length: 9 }, () => ({
    label: "Surface Monitoring",
    href: "/product/surface-monitoring",
  })),
}));

const FOOTER_LEGAL = Array.from({ length: 5 }, () => ({
  label: "Privacy",
  href: "/privacy-policy",
}));

/* -------------------------------- component ------------------------------- */

export default function ComponentMockupDetectify() {
  return (
    <div className="dtf-root">
      {/* ---------------- 00 header ---------------- */}
      <nav className="dtf-nav">
        <div className="dtf-nav-inner dtf-container">
          <a className="dtf-nav-logo" href="/">
            <img
              src="https://d177qf5ebwbrnj.cloudfront.net/logos/detectify_logo_black.svg"
              alt="Detectify"
              width={100}
              height={26}
            />
          </a>
          <ul className="dtf-nav-primary">
            {NAV_ITEMS.map((label, i) => (
              <li className="dtf-nav-primary-item" key={`nav-${i}`}>
                <button type="button" className="dtf-nav-primary-link">
                  {label}
                  <span className="dtf-nav-caret">
                    <CaretIcon />
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="dtf-nav-actions">
            <div className="dtf-nav-login-wrap">
              <button type="button" className="dtf-nav-login-btn">
                <UserIcon />
                Log in
                <span className="dtf-nav-caret">
                  <CaretIcon />
                </span>
              </button>
            </div>
            <a className="dtf-btn-outline-sm" href="/createaccount">
              Start a trial
            </a>
            <a className="dtf-btn-yellow-sm" href="/book-demo">
              Book a demo
            </a>
          </div>
        </div>
      </nav>

      {/* ---------------- 01 hero ---------------- */}
      <section className="dtf-hero">
        <div className="dtf-container">
          <div className="dtf-hero-grid">
            <div>
              <h1 className="dtf-hero-h1">Application security built and trusted by hackers</h1>
              <p className="dtf-hero-sub">
                Understand your real attack surface. Secure your domains, IPs, apps, and APIs with
                real-world hacker research at machine speed.
              </p>
              <div className="dtf-hero-ctas">
                <a className="dtf-btn-yellow-lg" href="/book-demo">
                  Book a demo
                </a>
                <a className="dtf-btn-dark-lg" href="/createaccount">
                  Start a trial
                </a>
              </div>
            </div>
            <div>
              <div className="dtf-hero-video">
                <img
                  className="dtf-orbit dtf-orbit-tr"
                  src="https://detectify.com/homev2-icons/hero-symbol-1.svg"
                  alt=""
                />
                <img
                  className="dtf-orbit dtf-orbit-bl"
                  src="https://detectify.com/homev2-icons/hero-symbol-2.svg"
                  alt=""
                />
                <img
                  className="dtf-orbit dtf-orbit-ml"
                  src="https://detectify.com/homev2-icons/hero-symbol-3.svg"
                  alt=""
                />
                <div className="dtf-hero-media">
                  <img src="https://d35ayjp87i0qx4.cloudfront.net/agentic_hero.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 02 trusted by ---------------- */}
      <section className="dtf-trust">
        <div className="dtf-container">
          <p className="dtf-trust-eyebrow">Trusted by 2,100+ global organizations worldwide</p>
          <div className="dtf-trust-grid">
            {Array.from({ length: TRUST_CELLS }).map((_, i) => (
              <div className="dtf-trust-cell" key={`trust-${i}`}>
                <img src={TRUST_LOGO} alt="Trustly" />
              </div>
            ))}
          </div>
          <div className="dtf-trust-more">
            <a href="/resources/customers">Read their stories &rarr;</a>
          </div>
        </div>
      </section>

      {/* ---------------- 03 products ---------------- */}
      <section className="dtf-products">
        <div className="dtf-container">
          <div className="dtf-products-head">
            <p className="dtf-eyebrow-lg">Discover our products</p>
            <h2 className="dtf-h2">Every asset, tested for what&apos;s exploitable</h2>
            <p className="dtf-products-lede">
              Turn a resource-limited program into one that autonomously scales to 100% of the attack
              surface. We handle discovery, testing, and coverage, you focus on the fixes.
            </p>
          </div>
        </div>
        <div className="dtf-products-cardsouter">
          <div className="dtf-container">
            <div className="dtf-products-grid">
              {PRODUCTS.map((p) => (
                <div
                  className={`dtf-product-card${p.dark ? " dtf-product-card--dark" : ""}`}
                  key={p.title}
                >
                  <img className="dtf-product-icon" src={p.icon} alt="" />
                  <h3 className="dtf-product-h3">{p.title}</h3>
                  <p className="dtf-product-p">{p.blurb}</p>
                  <ul className="dtf-product-list">
                    {p.bullets.map((b, i) => (
                      <li key={`${p.title}-b-${i}`}>{b}</li>
                    ))}
                  </ul>
                  <a className="dtf-link-row" href={p.href}>
                    <span className="dtf-underline">{p.linkLabel}</span>
                    <Arrow size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 04 also part of the platform ---------------- */}
      <section className="dtf-also">
        <div className="dtf-container">
          <div className="dtf-also-head">
            <p className="dtf-eyebrow-xs">Also part of the platform</p>
            <p className="dtf-also-lede">
              Extra coverage where you need it. Internal systems, compliance, AI agents.
            </p>
          </div>
          <div className="dtf-also-grid">
            {ALSO_CARDS.map((c, i) => (
              <a className="dtf-also-card" href={c.href} key={`also-${i}`}>
                <img src={c.icon} alt="" />
                <div className="dtf-also-body">
                  <span className="dtf-also-title">{c.title}</span>
                  <span className="dtf-also-desc">{c.desc}</span>
                </div>
                <span className="dtf-also-more">
                  <span className="dtf-underline">Read more</span>
                  <Arrow size={12} />
                </span>
              </a>
            ))}
          </div>
          <div className="dtf-also-foot">
            <a href="/product/platform-overview">
              <span className="dtf-underline">Explore the full platform</span>
              <Arrow size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- 05 not all scanners ---------------- */}
      <section className="dtf-scanners">
        <div className="dtf-container">
          <div className="dtf-scanners-head">
            <h2 className="dtf-h2">Not all scanners are built the same</h2>
            <p className="dtf-scanners-lede">
              The technical capabilities behind every scan, built by us, owned by us, matched by no
              one.
            </p>
          </div>
          <div className="dtf-scanners-stack">
            <div className="dtf-anchor-card">
              <div className="dtf-anchor-illo">
                <img src="https://detectify.com/homev2-icons/deckan.svg" alt="" />
              </div>
              <div>
                <h3 className="dtf-anchor-h3">Dynamic AI Fuzzing</h3>
                <p className="dtf-anchor-p">
                  Our next-gen ML fuzzing engine generates 922 quintillion payload possibilities per
                  test. Legacy scanners use static signatures. We use adaptive, intelligent payloads
                  that find what signatures miss.
                </p>
              </div>
            </div>
            <div className="dtf-feature-grid">
              {FEATURE_CARDS.map((f, i) => (
                <div className="dtf-feature-card" key={`feature-${i}`}>
                  <div className="dtf-feature-head">
                    <img src={f.icon} alt="" />
                    <h3 className="dtf-feature-h3">{f.title}</h3>
                  </div>
                  <p className="dtf-feature-p">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 06 agentic ai security ---------------- */}
      <section className="dtf-agentic">
        <div className="dtf-container">
          <div className="dtf-agentic-grid">
            <div>
              <p className="dtf-eyebrow-yellow">Agentic AI Security</p>
              <h2 className="dtf-agentic-h2">
                Giving humans and agents the tools they need to secure their work
              </h2>
              <p className="dtf-agentic-p">
                Detectify gives security engineers and AI agents the DAST tools needed to validate
                agentic deployments, detecting real vulnerabilities without hallucinating security
                postures.
              </p>
              <div>
                <a className="dtf-btn-yellow-md" href="/product/agentic-ai-security">
                  Explore Agentic AI Security
                </a>
              </div>
            </div>
            <div className="dtf-agentic-media">
              <img src="https://d35ayjp87i0qx4.cloudfront.net/agentic_hero.png" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 07 what security teams do ---------------- */}
      <section className="dtf-proof">
        <div className="dtf-container">
          <div className="dtf-proof-head">
            <h2 className="dtf-h2">What security teams do with Detectify</h2>
            <p className="dtf-proof-lede">
              2,100+ organizations use Detectify to secure their attack surface without adding
              friction to engineering.
            </p>
          </div>
          <div className="dtf-proof-panel">
            <div className="dtf-proof-panel-grid">
              <div>
                <div className="dtf-proof-logo">
                  <img
                    src="https://d35ayjp87i0qx4.cloudfront.net/evroc-logo.svg"
                    alt="evroc"
                  />
                </div>
                <blockquote className="dtf-proof-quote">
                  &ldquo; If you have a cumbersome manual process or don&apos;t have enough insight
                  into your attack surface, Detectify can really help. &rdquo;
                </blockquote>
                <div className="dtf-proof-attrib">
                  <p className="dtf-proof-name">Felix Rooke</p>
                  <p className="dtf-proof-role">DevSecOps Engineer , evroc</p>
                </div>
                <a className="dtf-proof-link" href="/resources/case-studies/evroc">
                  <span className="dtf-underline">Read case study</span>
                  <Arrow size={16} />
                </a>
              </div>
              <div>
                <div className="dtf-proof-media">
                  <img
                    src="https://blogadmin.detectify.com/app/uploads/2026/07/apex-discovery-768x480.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="dtf-proof-cards">
            {PROOF_CARDS.map((c, i) => (
              <a className="dtf-proof-card" href={c.href} key={`proof-${i}`}>
                <div className="dtf-proof-card-logo">
                  <img src={c.logo} alt={c.alt} />
                </div>
                <p className="dtf-proof-card-quote">{c.quote}</p>
                <div className="dtf-proof-card-more">
                  <span className="dtf-underline">Read case study</span>
                  <Arrow size={14} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 08 crowdsource ---------------- */}
      <section className="dtf-crowd">
        <div className="dtf-crowd-glow" />
        <div className="dtf-container">
          <div className="dtf-crowd-grid">
            <div>
              <p className="dtf-crowd-eyebrow">Detectify Crowdsource</p>
              <h2 className="dtf-crowd-h2">The power of ethical hackers</h2>
              <p className="dtf-crowd-kicker">Real-world attack intelligence. At machine speed.</p>
              <div className="dtf-crowd-body">
                <p>
                  Most scanners pull from the same public CVE databases, which means if an attacker
                  already knows about a vulnerability, you&apos;re already behind. Detectify&apos;s
                  global community of 400+ elite ethical hackers finds vulnerabilities before
                  they&apos;re publicly known. If they ever are.
                </p>
                <p>
                  That&apos;s why 75% of the vulnerabilities we find have no CVE assigned. We find
                  them before the databases do, or we find the ones that never make it to a database
                  at all. Our AI-enhanced engines take that research and generate near-infinite
                  payload variations to test every asset you own.
                </p>
              </div>
              <div className="dtf-crowd-stats">
                {CROWD_STATS.map((s, i) => (
                  <div className="dtf-crowd-stat" key={`stat-${i}`}>
                    <p className="dtf-crowd-stat-num">{s.num}</p>
                    <p className="dtf-crowd-stat-label">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="dtf-crowd-ctas">
                <a className="dtf-btn-purple" href="/crowdsource/what-is-crowdsource">
                  Read more about Crowdsource
                </a>
              </div>
            </div>
            <div className="dtf-crowd-globe">
              <img
                src="https://d177qf5ebwbrnj.cloudfront.net/other-imagery/globe_dark_desktop.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 09 what's new ---------------- */}
      <section className="dtf-news">
        <div className="dtf-container">
          <div className="dtf-news-head">
            <h2 className="dtf-h2">What&apos;s new from Detectify?</h2>
          </div>
          <div className="dtf-news-grid">
            {NEWS.map((n) => (
              <a className="dtf-news-card" href={n.href} key={n.title}>
                <div className="dtf-news-thumb">
                  <img src={n.img} alt="" />
                </div>
                <div className="dtf-news-body">
                  <p className="dtf-news-cat">{n.cat}</p>
                  <h3 className="dtf-news-h3">{n.title}</h3>
                  <p className="dtf-news-p">{n.body}</p>
                  <span className="dtf-news-more">
                    <span className="dtf-underline">Read more</span>
                    <Arrow size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 10 faq ---------------- */}
      <section className="dtf-faq">
        <div className="dtf-container dtf-container--narrow">
          <h2 className="dtf-faq-h2">Frequently asked questions</h2>
          <div>
            {FAQS.map((q, i) => (
              <div className="dtf-faq-row" key={`faq-${i}`}>
                <button type="button" className="dtf-faq-btn">
                  <span className="dtf-faq-q">{q}</span>
                  <span className="dtf-faq-chev">
                    <ChevronIcon />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 11 closing cta ---------------- */}
      <section className="dtf-cta">
        <span className="dtf-cta-bracket dtf-cta-bracket-tl" />
        <span className="dtf-cta-bracket dtf-cta-bracket-tr" />
        <span className="dtf-cta-bracket dtf-cta-bracket-bl" />
        <span className="dtf-cta-bracket dtf-cta-bracket-br" />
        <div className="dtf-cta-inner">
          <h2 className="dtf-cta-h2">Know what&apos;s exposed. Fix what matters</h2>
          <p className="dtf-cta-p">
            Start scanning to find exploitable vulnerabilities across your entire attack surface.
          </p>
          <div className="dtf-cta-btns">
            <a className="dtf-btn-yellow-lg" href="/book-demo">
              Book a demo
            </a>
            <a className="dtf-btn-outline-lg" href="/createaccount">
              Start a trial
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- 12 footer ---------------- */}
      <footer className="dtf-footer">
        <div className="dtf-footer-grid-outer">
          <div className="dtf-footer-grid dtf-container">
            <div className="dtf-footer-brand-col">
              <img
                className="dtf-footer-logo"
                src="https://d35ayjp87i0qx4.cloudfront.net/logos/detectify_logo_white.svg"
                alt="Detectify"
                width={106}
                height={28}
              />
              <p className="dtf-footer-tagline">
                Application security built and trusted by hackers.
              </p>
              <div className="dtf-footer-aws">
                <img
                  src="https://d35ayjp87i0qx4.cloudfront.net/detectify_aws_partner.png"
                  alt="Available on AWS Marketplace"
                />
              </div>
            </div>
            {FOOTER_COLS.map((col, ci) => (
              <div className="dtf-footer-nav-col" key={`fcol-${ci}`}>
                <h4 className="dtf-footer-col-title">{col.title}</h4>
                <ul className="dtf-footer-col-list">
                  {col.links.map((l, li) => (
                    <li key={`fcol-${ci}-${li}`}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="dtf-footer-newsletter-outer">
          <div className="dtf-footer-newsletter dtf-container">
            <div className="dtf-footer-newsletter-copy">
              <h3>Get security research in your inbox</h3>
              <p>Product updates, industry insight, and best practices.</p>
            </div>
            <form className="dtf-footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <label className="dtf-sr-only" htmlFor="dtf-footer-newsletter-email">
                Email
              </label>
              <input id="dtf-footer-newsletter-email" type="email" name="email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="dtf-footer-signoff-band">
          <svg viewBox="0 0 1100 146" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
            <text
              x="550"
              y="112"
              textAnchor="middle"
              fill="currentColor"
              fontFamily='"Averta Standard", sans-serif'
              fontSize="140"
              fontWeight="800"
              letterSpacing="6"
            >
              DETECTIFY
            </text>
          </svg>
        </div>

        <div className="dtf-footer-baseline-outer">
          <div className="dtf-footer-baseline dtf-container">
            <div className="dtf-footer-compliance">
              <a
                className="dtf-footer-comp-item"
                href="https://support.detectify.com/support/solutions/48000450473"
              >
                <CheckCircleIcon />
                ISO 27001
              </a>
              <a
                className="dtf-footer-comp-item"
                href="https://support.detectify.com/support/solutions/48000450473"
              >
                <CheckCircleIcon />
                GDPR
              </a>
            </div>
            <div className="dtf-footer-baseline-center">
              <div className="dtf-footer-baseline-legal">
                {FOOTER_LEGAL.map((l, i) => (
                  <a href={l.href} key={`legal-${i}`}>
                    {l.label}
                  </a>
                ))}
              </div>
              <p className="dtf-footer-copyright">
                &copy; 2026 Detectify AB. All rights reserved.
              </p>
            </div>
            <div className="dtf-footer-socials">
              <a href="https://www.linkedin.com/company/detectify" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://x.com/detectify" aria-label="X">
                <XIcon />
              </a>
              <a href="https://github.com/detectify" aria-label="GitHub">
                <GitHubIcon />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
