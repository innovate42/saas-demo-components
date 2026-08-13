import React from "react";
import "./index.css";

const LOGO = "https://xcures.com/wp-content/themes/website-theme/assets/images/logo.svg";

const powers = [
  "Patient's medical history and medications review",
  "Test Requisition Form (TRF) processing",
  "HEDIS® reporting and HCC capture workflows",
  "Prior authorization",
  "Revenue Cycle Management (RCM)",
  "Comorbidity and risk assessment",
  "Care gap analysis and chart prep",
];

const users = [
  "Clinicians",
  "Operations teams",
  "Telehealth providers",
  "Coding and CDI teams",
  "Quality teams",
];

const metrics = [
  { value: "99.7%", label: "Combined accuracy across 200+ comorbidity assessments" },
  { value: "98.6%", label: "Sensitivity on recent colonoscopy date" },
  { value: "99.4%", label: "Sensitivity on cancer diagnosis details" },
  { value: "<20 sec.", label: "Median per checklist extraction" },
];

const steps = [
  {
    title: "Configure to the workflow",
    body: "The client defines the required data elements, document types, and output schema, specifying exactly what the decision demands. Checklists can be configured for any clinical workflow.",
  },
  {
    title: "Retrieve exactly what is requested",
    body: "The engine retrieves the requested information directly from the medical record. For example, diagnosis details, tumor characteristics, biomarker status, and related findings from pathology reports and oncologist notes.",
  },
  {
    title: "Return structured, justified output",
    body: "The system delivers structured, source-linked outputs with supporting justification, ensuring traceability and consistency. Access is configurable through both the UI and API.",
  },
];

const faqs = [
  "What types of decisions can checklists be configured for?",
  "Which healthcare teams use Decision-Ready Checklists?",
  "How does a checklist link back to the source document?",
  "Can checklists be customized to our specific payer or workflow requirements?",
  "Is checklist output accessible via API?",
];

export default function MockupXCures() {
  return (
    <div className="xc">
      {/* Nav */}
      <header className="xc-nav">
        <img className="xc-logo" src={LOGO} alt="xCures Logo" />
        <nav className="xc-nav-links">
          <span>Get Clarity ⌄</span>
          <span>Use Cases ⌄</span>
          <span>Publications</span>
          <span>Company</span>
        </nav>
        <a className="xc-btn xc-btn--dark xc-nav-cta">Request a Demo</a>
      </header>

      {/* Hero */}
      <section className="xc-hero">
        <div className="xc-badge">
          <span className="xc-badge-icon" />
          <span>DECISION READY CHECKLISTS</span>
        </div>
        <h1 className="xc-h1">
          Answers, <span className="xc-italic">not summaries.</span>
        </h1>
        <p className="xc-lead">
          Most clinical data products stop at retrieval or context. Decision Ready
          Checklists go further. Built around the data requirements your workflows
          demand, they retrieve exactly what you need for the decision at hand and
          return it as a structured, decision-ready output with justification and
          direct links to the source record.
        </p>
      </section>

      {/* How it works */}
      <section className="xc-section xc-cream">
        <span className="xc-eyebrow">HOW IT WORKS</span>
        <h2 className="xc-h2">Configured to return the needed information.</h2>
        <div className="xc-steps">
          {steps.map((s, i) => (
            <div className="xc-step" key={s.title}>
              <div className="xc-step-num">{i + 1}</div>
              <h3 className="xc-step-title">{s.title}</h3>
              <p className="xc-step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What it powers / who it's for */}
      <section className="xc-section xc-two">
        <div className="xc-col">
          <span className="xc-eyebrow">USE</span>
          <h2 className="xc-h2-sm">What it powers</h2>
          <ul className="xc-list">
            {powers.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="xc-col">
          <span className="xc-eyebrow">USERS</span>
          <h2 className="xc-h2-sm">Who it is for</h2>
          <ul className="xc-list">
            {users.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* By the numbers */}
      <section className="xc-section xc-dark">
        <span className="xc-eyebrow xc-eyebrow--light">BY THE NUMBERS</span>
        <h2 className="xc-h2 xc-h2--light">Clarifying metrics</h2>
        <div className="xc-metrics">
          {metrics.map((m) => (
            <div className="xc-metric" key={m.value}>
              <div className="xc-metric-value">{m.value}</div>
              <div className="xc-metric-label">{m.label}</div>
            </div>
          ))}
        </div>
        <p className="xc-fine">
          Results based on a retrospective analysis of a defined historical dataset
          and do not guarantee future performance
        </p>
      </section>

      {/* Evidence / quote */}
      <section className="xc-section xc-blue">
        <span className="xc-eyebrow">EVIDENCE</span>
        <h2 className="xc-h2">What people say.</h2>
        <blockquote className="xc-quote">
          "xCures gives our teams a complete patient picture without forcing them to
          read through endless charts. It helps clinicians make higher-quality
          decisions faster, with more confidence and less manual work."
        </blockquote>
        <p className="xc-cite">
          Sr. Director of Product Operations, Healthcare Technology Organization
        </p>
      </section>

      {/* Demo CTA */}
      <section className="xc-section xc-cta-section">
        <h2 className="xc-h2">See a checklist built on a patient record.</h2>
        <p className="xc-lead xc-lead--center">
          A 30-minute demo with our team. No prep required. We will use a sample
          patient record and show you exactly how it works.
        </p>
        <a className="xc-btn xc-btn--dark xc-btn--lg">Request a demo</a>
      </section>

      {/* FAQ */}
      <section className="xc-section xc-cream">
        <h2 className="xc-h2">Frequently asked.</h2>
        <ul className="xc-faq">
          {faqs.map((q) => (
            <li className="xc-faq-item" key={q}>
              <span>{q}</span>
              <span className="xc-faq-plus">+</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="xc-footer">
        <div className="xc-footer-brand">
          <img className="xc-logo" src={LOGO} alt="xCures Logo" />
          <p>Clinical Clarity for Confident Decisions.</p>
        </div>
        <div className="xc-footer-cols">
          <div>
            <h4>The Engine</h4>
            <span>Decision-Ready Checklists</span>
            <span>Automated Patient History</span>
            <span>Evidence Grade Data</span>
            <span>API Documentation</span>
          </div>
          <div>
            <h4>Use Cases</h4>
            <span>Providers</span>
            <span>Diagnostics</span>
            <span>Value-Based Care</span>
            <span>Channel Partnerships</span>
          </div>
          <div>
            <h4>Company</h4>
            <span>About</span>
            <span>Team</span>
            <span>Careers</span>
            <span>Contact Us</span>
          </div>
        </div>
        <div className="xc-footer-legal">© 2026 xCures, Inc. All rights reserved.</div>
      </footer>
    </div>
  );
}
