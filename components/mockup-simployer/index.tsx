import React from "react";
import "./index.css";

/**
 * Simployer homepage look-alike — visual replica only.
 * Assets are hot-linked from Simployer's own CDN.
 */

const LOGO = "https://www.simployer.com/hubfs/Web%202024/Logotype%20-%20Text.svg";
const HERO = "https://www.simployer.com/hs-fs/hubfs/dashboard_new.gif?width=960&height=720&name=dashboard_new.gif";
const SIA = "https://www.simployer.com/hs-fs/hubfs/Website%20Sia%20(6).png?width=420&height=453&name=Website%20Sia%20(6).png";

const CUSTOMER_LOGOS = [
  "https://www.simployer.com/hubfs/Opak_logo_26..png",
  "https://www.simployer.com/hubfs/SartorDrange_logo_26..png",
  "https://www.simployer.com/hubfs/HRL_logo_26..png",
  "https://www.simployer.com/hubfs/Logos/Altrad.png",
  "https://www.simployer.com/hubfs/Repstadanlegg_logo_26..png",
];

type Props = {
  heading?: string;
};

export default function MockupSimployer({ heading }: Props) {
  const headingText =
    heading || "Finally. The HR system that lets you spend more time with people.";

  return (
    <div className="smp-root">
      {/* Header */}
      <header className="smp-header">
        <img className="smp-logo" src={LOGO} alt="Simployer" />
        <nav className="smp-nav">
          <a href="#">Products</a>
          <a href="#">Solutions</a>
          <a href="#">Knowledge Hub</a>
          <a href="#">About Us</a>
          <a href="#">Pricing</a>
        </nav>
        <div className="smp-header-actions">
          <button className="smp-btn smp-btn-login">Log In</button>
          <button className="smp-btn smp-btn-demo">Book demo</button>
        </div>
      </header>

      {/* Hero */}
      <section className="smp-hero">
        <div>
          <h1 className="smp-serif">
            Finally. The HR system that lets you{" "}
            <span className="smp-em">spend more time</span> with people.
          </h1>
          <p>
            Simployer One does the routine HR work for you, and puts you in
            contact with a real, local HR expert when it&rsquo;s serious.
            Designed to do the work. Built to have your back.
          </p>
          <div className="smp-hero-cta">
            <button className="smp-btn-solid">Book demo</button>
            <button className="smp-btn-outline">See how it works</button>
          </div>
        </div>
        <div className="smp-hero-visual">
          <img src={HERO} alt="Simployer dashboard" loading="lazy" />
        </div>
      </section>

      {/* Trust bar */}
      <div className="smp-trust">
        <h3>Trusted by 12,000+ ambitious companies across the Nordics</h3>
        <div className="smp-logos">
          {CUSTOMER_LOGOS.map((src) => (
            <img key={src} src={src} alt="Customer logo" loading="lazy" />
          ))}
        </div>
      </div>

      {/* Problem section */}
      <section className="smp-section">
        <div className="smp-section-head">
          <h2 className="smp-serif">The HR work grows. The teams don&rsquo;t.</h2>
          <p>
            More rules, more requests, same headcount. Something has to carry the
            extra load. It shouldn&rsquo;t be you.
          </p>
        </div>
        <div className="smp-cards">
          <div className="smp-card">
            <h4>Routine overwrites every other priority.</h4>
            <p>
              More rules, more requests, and each one becomes a process to run.
              5+ new employer requirements land every year.
            </p>
          </div>
          <div className="smp-card">
            <h4>HR becomes everyone&rsquo;s bottleneck.</h4>
            <p>
              Every question, approval and signature waits on you. Most
              organisations don&rsquo;t add more headcount.
            </p>
          </div>
          <div className="smp-card">
            <h4>No time left for the people part.</h4>
            <p>
              You came to HR to build culture. Now admin eats over half your time
              and the people part gets what&rsquo;s left.
            </p>
          </div>
        </div>
      </section>

      {/* Feature — Sia AI assistant */}
      <section className="smp-feature">
        <div className="smp-feature-inner">
          <div>
            <p className="smp-eyebrow">AI Assistant</p>
            <h2 className="smp-serif">It answers. Instantly, with sources.</h2>
            <p>
              Ask Sia about policy, law or your own numbers, in plain language.
              It answers with sources and live charts, in seconds.
            </p>
            <p>
              Employees get instant answers without emailing HR. You get peace of
              mind.
            </p>
          </div>
          <div className="smp-feature-visual">
            <img src={SIA} alt="Sia AI assistant" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Four ways */}
      <section className="smp-section">
        <div className="smp-section-head">
          <h2 className="smp-serif">One system. Four ways it helps.</h2>
        </div>
        <div className="smp-ways">
          <div className="smp-way">
            <div className="smp-num">1</div>
            <h4>It answers.</h4>
            <p>Instant, sourced answers on policy, law and your own numbers.</p>
          </div>
          <div className="smp-way">
            <div className="smp-num">2</div>
            <h4>It routes.</h4>
            <p>
              Approvals, signatures and reminders go to the right person on their
              own. No chasing, no missed steps.
            </p>
          </div>
          <div className="smp-way">
            <div className="smp-num">3</div>
            <h4>It acts.</h4>
            <p>
              Tell it to run onboarding for a new starter and it runs, start to
              finish. Whole processes, not just tasks.
            </p>
          </div>
          <div className="smp-way">
            <div className="smp-num">4</div>
            <h4>A human steps in when it matters.</h4>
            <p>A real, local HR expert has your back when it&rsquo;s serious.</p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="smp-band">
        <h2 className="smp-serif">Imagine HR that&rsquo;s about people again.</h2>
        <p>Designed to do the work. Built to have your back.</p>
        <button className="smp-btn-solid">Book demo</button>
      </section>

      {/* Footer */}
      <footer className="smp-footer">
        <img
          className="smp-logo"
          src={LOGO}
          alt="Simployer"
          style={{ filter: "brightness(0) invert(1)", marginBottom: 12 }}
        />
        <div>&copy; Simployer &mdash; visual mockup for demonstration purposes.</div>
      </footer>
    </div>
  );
}
