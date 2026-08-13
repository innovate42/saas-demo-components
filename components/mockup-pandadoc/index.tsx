import React from "react";
import "./index.css";

const LOGO =
  "https://images.ctfassets.net/a4zep9yar86b/66eeRH9nOKsKg51R8HbIFd/9869920f44f45e6e41182ef875a8dfad/pandadoc-logo-desktop.svg";

export interface PandaDocMockProps {
  headline?: string;
}

const NAV = ["Product", "Solutions", "Integrations", "Resources", "API", "Pricing"];
const TRUST = ["salesforce", "Rakuten", "U-HAUL", "hp", "BOSCH", "bonusly", "tomtom"];

const FEATURES = [
  {
    title: "Impress buyers with tailored quotes",
    body: "Automated quotes and proposals built for each recipient, ready to send in minutes.",
  },
  {
    title: "Close deals in a shared space",
    body: "A digital space that makes collaboration and negotiation effortless for both sides.",
  },
  {
    title: "Eliminate errors with set rules",
    body: "Pre-set document creation rules keep every agreement accurate and on-brand.",
  },
  {
    title: "Automate manual, repetitive tasks",
    body: "Save time by letting workflows handle the busywork behind every document.",
  },
];

export default function PandaDocMock({
  headline = "Make proposals that make impressions",
}: PandaDocMockProps) {
  return (
    <div className="pdmock">
      <div className="pdmock__bar">
        PandaDoc is rated #1 in proposals, eSignature, and contract management by G2
        <a href="#">Find out why →</a>
      </div>

      <nav className="pdmock__nav">
        <img className="pdmock__logo" src={LOGO} alt="PandaDoc" />
        <div className="pdmock__navlinks">
          {NAV.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div className="pdmock__navcta">
          <a className="pd-btn" href="#">Start a trial</a>
          <a className="pd-btn pd-btn--primary" href="#">Request a demo</a>
        </div>
      </nav>

      <header className="pdmock__hero">
        <h1>{headline}</h1>
        <p>
          Stand out with the top-rated solution for creating, managing, tracking,
          and eSigning every important document you handle
        </p>
        <a className="pd-btn pd-btn--primary pd-btn--lg" href="#">Get Started</a>
      </header>

      <section className="pdmock__trust">
        <div className="lbl">Trusted by 50,000+ growing businesses</div>
        <div className="pdmock__logos">
          {TRUST.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </section>

      <section className="pdmock__band">
        <h2>The complete document management solution</h2>
        <p>
          Create, approve, track and eSign your documents up to 40% faster — all
          in one place.
        </p>
      </section>

      <section className="pdmock__features">
        <h2>Designed to make every agreement easier</h2>
        <div className="pdmock__grid">
          {FEATURES.map((f) => (
            <div className="pdmock__card" key={f.title}>
              <span className="dot" />
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pdmock__cta">
        <h2>Schedule your free live demo</h2>
        <a className="pd-btn pd-btn--primary pd-btn--lg" href="#">Request a demo</a>
      </section>
    </div>
  );
}
