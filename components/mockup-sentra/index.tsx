import React from "react";
import "./index.css";

const Logo = ({ className = "sm-logo" }: { className?: string }) => (
  <span className={className}>
    <svg height="26" viewBox="0 0 257 52" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sentra">
      <path fill="#ffffff" d="M91.516 43.988q-4.079 0-7.318-1.44-3.24-1.499-5.158-4.018-1.86-2.52-2.04-5.578h8.458q.24 1.92 1.86 3.179 1.679 1.26 4.138 1.26 2.4 0 3.719-.96 1.38-.96 1.38-2.46 0-1.62-1.68-2.4-1.62-.839-5.219-1.799-3.718-.9-6.118-1.86-2.34-.959-4.079-2.938-1.68-1.98-1.68-5.339 0-2.76 1.56-5.039 1.62-2.28 4.559-3.599 3-1.32 7.018-1.32 5.938 0 9.477 3 3.54 2.94 3.899 7.978h-8.038q-.18-1.98-1.68-3.12-1.438-1.2-3.898-1.2-2.28 0-3.54.84-1.199.84-1.199 2.34 0 1.68 1.68 2.58 1.68.84 5.218 1.739 3.6.9 5.939 1.86t4.019 2.999q1.739 1.98 1.799 5.278 0 2.88-1.62 5.159-1.559 2.28-4.558 3.599-2.94 1.26-6.898 1.26M139.978 26.113q0 1.8-.24 3.24h-24.293q.3 3.597 2.519 5.638t5.459 2.04q4.678 0 6.658-4.02h9.057q-1.439 4.8-5.518 7.918-4.08 3.06-10.017 3.06-4.799 0-8.638-2.1-3.779-2.16-5.938-6.058-2.1-3.9-2.1-8.998 0-5.158 2.1-9.057t5.878-5.999 8.698-2.099q4.739 0 8.457 2.04 3.78 2.04 5.819 5.818 2.099 3.72 2.099 8.577m-8.698-2.399q-.059-3.24-2.339-5.159-2.279-1.98-5.578-1.98-3.12 0-5.279 1.92-2.099 1.86-2.579 5.219zM162.123 9.738q5.938 0 9.598 3.779 3.658 3.72 3.658 10.437v19.495h-8.397V25.094q0-3.96-1.98-6.059-1.98-2.16-5.398-2.159-3.48 0-5.519 2.16-1.98 2.098-1.979 6.058v18.355h-8.398V10.218h8.398v4.139q1.679-2.16 4.258-3.36 2.64-1.26 5.759-1.26M190.743 17.116V33.19q0 1.68.78 2.46.84.72 2.759.72h3.899v7.078h-5.279q-10.616 0-10.617-10.318V17.116h-3.958v-6.898h3.958V2h8.458v8.218h7.438v6.898zM210.22 15.376q1.619-2.64 4.198-4.139 2.639-1.5 5.998-1.5v8.818h-2.218q-3.96 0-6 1.86-1.978 1.86-1.978 6.478V43.45h-8.399V10.218h8.399zM221.513 26.713q0-5.038 1.981-8.937 2.038-3.9 5.457-5.999 3.48-2.1 7.739-2.099 3.719 0 6.478 1.5 2.819 1.5 4.498 3.778v-4.738h8.459v33.23h-8.459V38.59q-1.619 2.34-4.498 3.899-2.819 1.5-6.538 1.5-4.2 0-7.679-2.16-3.418-2.16-5.457-6.059-1.98-3.959-1.981-9.057m26.153.12q0-3.06-1.199-5.218-1.2-2.22-3.239-3.36-2.04-1.2-4.378-1.2-2.34 0-4.32 1.14-1.979 1.14-3.239 3.36-1.2 2.16-1.199 5.158 0 3 1.199 5.278 1.26 2.22 3.239 3.42 2.04 1.2 4.32 1.2 2.338 0 4.378-1.14 2.04-1.2 3.239-3.36 1.2-2.219 1.199-5.278" />
      <path fill="#5e5" d="M0 11C0 4.925 4.925 0 11 0h8v26a4 4 0 0 1-4 4H0zM56 41c0 6.075-4.925 11-11 11h-8V26a4 4 0 0 1 4-4h15zM52 0a4 4 0 0 1 4 4v13H28a4 4 0 0 1-4-4V0zM4 52a4 4 0 0 1-4-4V35h28a4 4 0 0 1 4 4v13z" />
    </svg>
  </span>
);

const problems = [
  { icon: "https://site-assets.plasmic.app/6ed57ce11d4708eec7436096eec09465.svg", title: "No Visibility", body: "Most organizations don’t know what AI can see and what AI can do." },
  { icon: "https://site-assets.plasmic.app/e821984d7a8e1a6664c63ce0839d8df1.svg", title: "Data Sprawl", body: "Years of sprawl meet AI that sees everything your users see and synthesizes it instantly." },
  { icon: "https://sentra.io/_next/image?url=https%3A%2F%2Fsite-assets.plasmic.app%2F9ea334192064a578390f32d2d9a47388.png&w=750&q=75", title: "Overpermissioning", body: "One wrong permission, and AI does the rest—surfacing the wrong content to the wrong person, instantly." },
  { icon: "https://site-assets.plasmic.app/67059fd93198938d87938a36609d3944.svg", title: "Ungoverned Data", body: "What was dormant is now dangerous. AI can reach it, synthesize it, and serve it up on demand." },
  { icon: "https://site-assets.plasmic.app/c2149ebd1342df5ab394e69ca2592809.svg", title: "Agentic AI", body: "Agents traverse environments, execute workflows, and act on inherited access before humans can notice." },
];

const platform = [
  { k: "Discover", h: "Autonomous Data Discovery", p: "Find and inventory every dataset across cloud, SaaS, and on-prem — including shadow and abandoned data." },
  { k: "Classify", h: "AI-Powered Classification", p: "Accurately classify sensitive data at petabyte scale, with rich business and security context." },
  { k: "Govern", h: "Access & Posture Governance", p: "See who and what can reach sensitive data, and fix overpermissioning before AI exploits it." },
  { k: "Detect", h: "Data Detection & Response", p: "Detect risky data movement and exposure in real time, and respond before it becomes a breach." },
];

const architecture = [
  { h: "Runs in your environment", p: "Sentra scans data where it lives — your data never leaves your cloud account." },
  { h: "Petabyte-scale, low cost", p: "A cloud-native engine that classifies massive estates efficiently, without moving or duplicating data." },
  { h: "Context-rich by design", p: "Combines data sensitivity, access, and movement into a single view of real risk." },
];

const integrations = ["AWS", "Microsoft Azure", "Google Cloud", "Microsoft 365 Copilot", "Data Warehouse", "On-Premises"];

const stats = [
  { cap: "ROI", big: "~6x", lbl: "Return on investment", p: "$5.76M in quantified 3-year benefits against ~$955K in total costs — before NPV is finalized." },
  { cap: "Labor savings", big: "90%", lbl: "Less manual governance work", p: "7 FTEs reclaimed from manual oversight. $3M saved over 3 years. Risk focus, not data wrangling." },
  { cap: "Compliance", big: "94%", lbl: "Reduction in DLP coverage scope", p: "DLP scope drops from 3,500 to 210 employees. $329K saved annually, plus 1 FTE freed from false-positive triage." },
  { cap: "Cloud costs", big: "$375K", lbl: "Avoided cloud spend per year", p: "Shadow data visibility reclaims 1.5% of cloud spend. One customer cut 110 databases worth $1.1M/year." },
];

const testimonials = [
  { co: "SoFi", h: "How SoFi Raises the Bar on Data Security With Sentra", thumb: "https://sentra.io/_next/image?url=https%3A%2F%2Fimage.mux.com%2FQLXOYJxaBdYmWPY9LzpTmW7IdaVUajKBwla62RuPvWA%2Fthumbnail.jpg%3Ftime%3D15&w=1200&q=75" },
  { co: "Global-e", h: "Global-e's Path to Stronger\nData Security with Sentra", thumb: "https://sentra.io/_next/image?url=https%3A%2F%2Fimage.mux.com%2FSPXHuZguWJ6j00OOaW005mhCAhCIEDzBt6E6ILo39XIAU%2Fthumbnail.jpg%3Ftime%3D25&w=1200&q=75" },
  { co: "Valēnz Health", h: "How Valēnz Health Scaled PHI Protection Post-Merger", thumb: "https://sentra.io/_next/image?url=https%3A%2F%2Fimage.mux.com%2FUruGF8wUbUzphcNB1uOFuHWKOtA01iOW98Qg01oIqci3A%2Fthumbnail.jpg%3Ftime%3D15&w=1200&q=75" },
];

const footerCols = [
  { h: "Product", links: ["Platform Overview", "Sentra for AI and ML", "Sentra for Microsoft 365 Copilot", "Sentra for AWS", "Sentra for Azure", "Sentra for GCP", "Sentra for Data Warehouse", "Sentra for On-Premises"] },
  { h: "Resources", links: ["Cloud Data Security", "DSPM Guide", "What is DDR?", "Videos", "Events", "Blog", "Reports", "Glossary", "Learning Center"] },
  { h: "Use Cases", links: ["Unstructured Data Classification", "Data Privacy and Compliance", "Data Loss Prevention", "Prevent Sensitive Data Exposure", "Data Sprawl Reduction", "Secure and Responsible AI", "M365 Copilot Adoption", "Cyber Resiliency"] },
  { h: "Comparisons", links: ["Cyera", "Varonis", "Securiti", "Wiz DSPM", "BigID", "Concentric"] },
  { h: "Industries", links: ["Financial Services", "Healthcare", "Retail"] },
  { h: "Company", links: ["About Us", "AWS Partnership", "Careers", "Contact Us", "Trust Center", "News", "Pricing"] },
];

export default function SentraMockup() {
  return (
    <div className="sentra-mock">
      {/* NAV */}
      <header className="sm-nav">
        <div className="sm-wrap sm-nav-inner">
          <a href="#" className="sm-logo" aria-label="Sentra home"><Logo /></a>
          <nav className="sm-nav-links">
            <a href="#">Product</a>
            <a href="#">Solutions</a>
            <a href="#">What is DSPM?</a>
            <a href="#">Resources</a>
            <a href="#">Company</a>
            <a href="#">Blog</a>
          </nav>
          <span className="sm-nav-spacer" />
          <a className="sm-pill sm-pill-lime" href="#">Get a Demo</a>
        </div>
      </header>

      {/* HERO */}
      <section className="sm-hero">
        <div className="sm-wrap">
          <div className="sm-eyebrow">AI ready data is the new competitive advantage.</div>
          <h1 className="sm-h1">AI is Live.<br />Your data readiness and governance <span className="lime">isn’t.</span></h1>
          <p className="sm-sub">Sentra discovers, classifies, and governs every dataset AI can touch—from Copilot to Bedrock—at petabyte scale.</p>
          <div className="sm-hero-cta">
            <a className="sm-pill sm-pill-lime" href="#">Make my data AI ready</a>
          </div>
          <div className="sm-trusted">
            <div className="sm-trusted-label">Trusted by</div>
            <div className="sm-trust-row">
              <span>SoFi</span><span>Global-e</span><span>Valēnz Health</span><span>InstaDeep</span><span>Roku</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="sm-section">
        <div className="sm-wrap">
          <div className="sm-problem-head">
            <div className="sm-section-label">The new reality</div>
            <h2 className="sm-h2">AI is a Data Problem.</h2>
          </div>
          <div className="sm-problem-grid">
            {problems.map((p) => (
              <div className="sm-prob-card" key={p.title}>
                <img className="sm-prob-ico" src={p.icon} alt={p.title} />
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section className="sm-section sm-band">
        <div className="sm-wrap sm-center">
          <div className="sm-section-label">The platform</div>
          <h2 className="sm-h2">The Sentra Platform for Continuous AI Data Readiness and Governance</h2>
          <div className="sm-platform-grid">
            {platform.map((c) => (
              <div className="sm-plat-card" key={c.h} style={{ textAlign: "left" }}>
                <div className="k">{c.k}</div>
                <h4>{c.h}</h4>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="sm-section">
        <div className="sm-wrap sm-arch">
          <div className="sm-arch-visual">
            <div className="sm-arch-node"><span className="dot" /><span>Your Cloud Account · AWS · Azure · GCP</span></div>
            <div className="sm-arch-node"><span className="dot" /><span>Sentra scanning engine (data never leaves)</span></div>
            <div className="sm-arch-node"><span className="dot" /><span>Sensitivity + Access + Movement → Risk</span></div>
            <div className="sm-arch-node"><span className="dot" /><span>Alerts, posture &amp; DDR in your SOC tools</span></div>
          </div>
          <div>
            <div className="sm-section-label">Architecture</div>
            <h2 className="sm-h2">Sentra’s Breakthrough Data Security Architecture</h2>
            <p className="sm-section-lead" style={{ marginBottom: 24 }}>Data security that lives in your environment — not ours.</p>
            <div className="sm-arch-list">
              {architecture.map((a) => (
                <div className="sm-arch-item" key={a.h}>
                  <h4>{a.h}</h4>
                  <p>{a.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="sm-section sm-band">
        <div className="sm-wrap sm-center">
          <div className="sm-section-label">Integrations</div>
          <h2 className="sm-h2">Works with your existing stack</h2>
          <div className="sm-integ-grid">
            {integrations.map((i) => (
              <div className="sm-integ-cell" key={i}>{i}</div>
            ))}
          </div>
          <div className="sm-integ-actions">
            <a className="sm-pill sm-pill-ghost" href="#">See All Integrations</a>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="sm-section">
        <div className="sm-wrap sm-center">
          <div className="sm-section-label">The ROI numbers that matter</div>
          <h2 className="sm-h2">Data security with measurable business impact.</h2>
          <div className="sm-stats-grid">
            {stats.map((s) => (
              <div className="sm-stat" key={s.cap} style={{ textAlign: "left" }}>
                <div className="cap">{s.cap}</div>
                <div className="big">{s.big}</div>
                <div className="lbl">{s.lbl}</div>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARTNER */}
      <section className="sm-section sm-band">
        <div className="sm-wrap sm-gartner">
          <div>
            <div className="sm-section-label">Recognition</div>
            <h2 className="sm-h2">Gartner Peer Insights Highest Recommended DSPM Platform</h2>
            <p className="sm-section-lead" style={{ marginBottom: 24 }}>Security teams rank Sentra at the top for data security posture management.</p>
            <a className="sm-pill sm-pill-lime" href="#">Learn More</a>
          </div>
          <div className="sm-gartner-badge">
            <div className="star">★★★★★</div>
            <div className="rating">4.8</div>
            <div className="src">Gartner Peer Insights · DSPM</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sm-section">
        <div className="sm-wrap sm-center">
          <div className="sm-section-label">Case studies</div>
          <h2 className="sm-h2">Customers Love Us</h2>
          <div className="sm-tst-grid">
            {testimonials.map((t) => (
              <div className="sm-tst-card" key={t.co}>
                <div className="sm-tst-thumb" style={{ backgroundImage: `url(${t.thumb})` }} />
                <div className="sm-tst-body">
                  <div className="co">{t.co}</div>
                  <h3>{t.h}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="sm-cta-band">
        <div className="sm-wrap">
          <h2>Make your data AI ready.</h2>
          <div className="sm-hero-cta" style={{ marginBottom: 0 }}>
            <a className="sm-pill sm-pill-lime" href="#">Get a Demo</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sm-footer">
        <div className="sm-wrap">
          <div className="sm-footer-grid">
            {footerCols.map((c) => (
              <div className="sm-footer-col" key={c.h}>
                <h5>{c.h}</h5>
                {c.links.map((l) => (
                  <a href="#" key={l}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="sm-footer-bottom">
            <Logo />
            <span className="spacer" />
            <span>101 Avenue of the Americas, New York, NY 10013</span>
            <span>info@sentra.io</span>
            <span>© Sentra 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
