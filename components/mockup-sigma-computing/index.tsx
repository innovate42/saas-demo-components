import React from "react";
import "./index.css";

type Props = {
  heading?: string;
  subheading?: string;
};

const NAV = [
  "Platform",
  "Solutions",
  "App Library",
  "Customers",
  "Resources",
  "More",
];

const TABS = [
  "Month end close",
  "Budget Variance Analysis",
  "Cashflow Forecasting",
  "Budget vs Actuals",
  "Revenue Forecasting",
  "Headcount Planning",
];

const FUNCTIONS = [
  {
    title: "Month-end close",
    body: "Replace manual month-end cycles with real-time financial intelligence into variance drivers.",
  },
  {
    title: "Headcount planning",
    body: "Adjust workforce investments to meet growth and productivity targets.",
  },
  {
    title: "Expense forecasting",
    body: "Intervene on department-level spend using operational business drivers.",
  },
  {
    title: "Cashflow forecasting",
    body: "Model cash inflows and outflows to forecast liquidity and optimize working capital.",
  },
];

const PILLARS = [
  {
    title: "AI Apps",
    body: "Purpose-built finance apps that turn live warehouse data into decisions your team can act on.",
  },
  {
    title: "Dashboards & Analysis",
    body: "Go beyond the “what” and master the “why” with self-serve, spreadsheet-familiar analysis.",
  },
  {
    title: "Pixel-Perfect Reports",
    body: "Board-ready reporting with the precision and formatting finance leaders expect.",
  },
  {
    title: "Embedded Analytics",
    body: "Deliver governed, interactive analytics right inside the tools your teams already use.",
  },
];

const SigmaLogo = ({ className }: { className?: string }) => (
  <svg
    width="104"
    height="32"
    viewBox="0 0 104 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Sigma Computing"
  >
    <path d="M14.4523 15.3524L0 0.833252L21.4587 7.77987L14.4523 15.3524Z" fill="currentColor" />
    <path d="M15.2997 16.1905L26.9131 30.6246L22.2956 8.60604L15.2997 16.1905Z" fill="currentColor" />
    <path d="M25.4971 30.751L9.08954 23.5399L19.6969 23.5435L25.4971 30.751Z" fill="currentColor" />
    <path d="M27.84 0.988769L22.4184 6.85587L17.1924 5.16107L27.84 0.988769Z" fill="currentColor" />
    <path d="M25.9213 4.64943L28.9927 1.49197L34.2844 4.80138L25.9213 4.64943Z" fill="currentColor" />
    <path d="M47.7862 9.6079C48.8888 9.6079 49.7826 8.66864 49.7826 7.51C49.7826 6.35137 48.8888 5.41211 47.7862 5.41211C46.6837 5.41211 45.7899 6.35137 45.7899 7.51C45.7899 8.66864 46.6837 9.6079 47.7862 9.6079Z" fill="currentColor" />
    <path d="M89.5356 16.7473V24.3486H86.2425V17.0082C86.2425 14.8323 85.1254 13.7586 83.5789 13.7586C81.6604 13.7586 80.4576 15.2093 80.601 17.6465L80.5722 17.5305V24.3486H77.2493V17.0082C77.2493 14.8323 76.1326 13.7586 74.7007 13.7586C73.1543 13.7586 71.6079 14.629 71.6079 17.2115V24.3486H68.285V10.7991H71.6079V13.1203C72.0945 11.4086 73.9277 10.5068 75.5866 10.5068C77.5339 10.5068 79.1376 11.437 79.9106 13.1761C80.3367 12.3479 80.9845 11.6583 81.7798 11.1861C82.5751 10.714 83.4857 10.4785 84.407 10.5068C87.7596 10.509 89.5356 12.8013 89.5356 16.7473Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M65.5838 22.4329V10.7992L62.3409 10.7966V12.5684C61.4184 11.1757 59.6572 10.5082 57.9801 10.5082C54.5413 10.5082 51.5783 13.2068 51.5783 17.5589C51.5783 21.8818 54.5693 24.638 58.0081 24.638C59.6013 24.638 61.4184 23.9416 62.3409 22.5494V22.7523C62.3409 26.6109 60.7757 28.1197 58.2595 28.1197C57.5338 28.1103 56.8246 27.8998 56.2086 27.5111C55.5927 27.1224 55.0935 26.5703 54.7652 25.9146L52.0815 27.1912C52.6241 28.3862 53.4957 29.3971 54.5916 30.1023C55.6876 30.8074 56.9612 31.177 58.2595 31.1664C62.7322 31.1664 65.5838 28.5259 65.5838 22.4329ZM62.0113 16.0522C62.1978 16.5221 62.2908 17.0246 62.285 17.531V17.5323C62.3014 18.0433 62.2159 18.5537 62.0337 19.0319C61.8515 19.5102 61.5761 19.9465 61.2241 20.3149C60.872 20.6832 60.4504 20.976 59.9844 21.1758C59.5183 21.3757 59.0174 21.4786 58.5113 21.4783C56.4983 21.4783 54.8491 19.7954 54.8491 17.5323C54.8291 17.0312 54.9087 16.5312 55.0835 16.062C55.2582 15.5928 55.5243 15.164 55.8661 14.8012C56.2078 14.4384 56.6181 14.149 57.0726 13.9503C57.527 13.7515 58.0163 13.6475 58.5113 13.6444C59.0116 13.6468 59.5065 13.7494 59.9674 13.9464C60.4284 14.1435 60.8463 14.431 61.1971 14.7924C61.5479 15.1538 61.8246 15.582 62.0113 16.0522Z" fill="currentColor" />
    <path d="M49.4591 10.7992H46.1363V24.3487H49.4591V10.7992Z" fill="currentColor" />
    <path d="M36.1091 20.144H32.8076C32.8684 23.045 35.6867 24.6698 38.5037 24.6711C41.3806 24.6711 44.2579 23.2191 44.2579 20.463C44.2579 19.2151 43.6826 17.3006 40.5027 16.517L38.2291 15.9367C37.4115 15.7626 36.715 15.3564 36.715 14.6601C36.715 13.8189 37.4719 13.2386 38.5623 13.2386C39.5618 13.2386 40.4402 13.8189 40.4402 14.7761H43.8019C43.8325 11.7298 40.9854 10.54 38.4714 10.54C35.382 10.54 33.2016 12.397 33.2016 14.5152C33.2016 16.2277 34.0192 17.8516 37.1995 18.664L39.0773 19.1283C40.1372 19.3604 40.7431 19.7099 40.7431 20.463C40.7431 21.3334 39.8342 21.9424 38.4412 21.9424C36.9573 21.9424 36.1091 21.0742 36.1091 20.144Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M104 24.3488V16.2536C104 12.5397 101.437 10.5087 97.9204 10.5078C95.4668 10.5078 93.2042 11.4943 92.1138 12.9743L93.9129 14.8892C94.5945 14.048 96.0937 13.4385 97.7023 13.4385C99.5832 13.4385 100.728 14.6283 100.728 16.3399V17.1523C99.4592 16.5097 98.0577 16.1816 96.639 16.1951C93.6947 16.1951 91.3775 17.7034 91.3775 20.4307C91.3775 22.9849 93.3677 24.6389 96.1484 24.6389C97.9204 24.6389 99.8289 23.7973 100.728 22.5499V24.3488H104ZM100.728 19.4163V19.9674C99.9378 21.1572 98.2204 21.8823 96.7754 21.8832C95.3597 21.8832 94.4852 21.2475 94.4852 20.2885C94.4852 19.3295 95.385 18.5167 97.2117 18.5167C98.4411 18.5022 99.653 18.8123 100.728 19.4163Z" fill="currentColor" />
  </svg>
);

export default function MockupSigmaComputing({
  heading = "Sigma for Finance Teams",
  subheading = "Act on rising risk. Optimize FTEs with AI. Maximize margin.",
}: Props) {
  return (
    <div className="sig-root">
      {/* Nav */}
      <header className="sig-nav">
        <div className="sig-nav-inner">
          <div className="sig-nav-left">
            <SigmaLogo className="sig-logo" />
            <nav className="sig-nav-links">
              {NAV.map((n) => (
                <span key={n} className="sig-nav-link">
                  {n}
                  <svg className="sig-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ))}
            </nav>
          </div>
          <div className="sig-nav-right">
            <span className="sig-login">Log in</span>
            <a className="sig-btn sig-btn-primary sig-nav-cta" href="#">Get Started</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="sig-hero">
        <div className="sig-hero-blob" aria-hidden="true" />
        <div className="sig-hero-inner">
          <h1 className="sig-hero-title">{heading}</h1>
          <p className="sig-hero-sub">{subheading}</p>
          <a className="sig-btn sig-btn-primary sig-hero-cta" href="#">Get a demo</a>
        </div>

        {/* Product frame */}
        <div className="sig-product">
          <div className="sig-product-bar">
            <span className="sig-dot sig-dot-r" />
            <span className="sig-dot sig-dot-y" />
            <span className="sig-dot sig-dot-g" />
            <div className="sig-tabs">
              {TABS.map((t, i) => (
                <span key={t} className={"sig-tab" + (i === 0 ? " sig-tab-active" : "")}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="sig-product-body">
            <div className="sig-panel-head">
              <div>
                <div className="sig-panel-kicker">FP&amp;A · Live warehouse data</div>
                <div className="sig-panel-title">Month-End Close &mdash; Variance Drivers</div>
              </div>
              <span className="sig-pill">SOX-ready audit trail</span>
            </div>
            <div className="sig-kpis">
              {[
                { l: "Actuals to Budget", v: "+2.4%", d: "on track" },
                { l: "Days to Close", v: "3.1", d: "−1.4 vs Q3" },
                { l: "Open Variances", v: "6", d: "explained: 5" },
                { l: "Cash Position", v: "$48.2M", d: "+$3.1M" },
              ].map((k) => (
                <div key={k.l} className="sig-kpi">
                  <div className="sig-kpi-label">{k.l}</div>
                  <div className="sig-kpi-value">{k.v}</div>
                  <div className="sig-kpi-delta">{k.d}</div>
                </div>
              ))}
            </div>
            <div className="sig-chart">
              {[62, 48, 74, 55, 83, 69, 91, 60].map((h, i) => (
                <div key={i} className="sig-bar" style={{ height: h + "%" }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro band */}
      <section className="sig-band">
        <p className="sig-band-lead">
          Finance runs on numbers that must be current, reconciled, and explainable. Sigma helps FP&amp;A,
          accounting, and treasury teams move away from spreadsheet-heavy planning and close workflows by
          working directly on live warehouse data &mdash; with governance and a SOX-ready audit trail.
        </p>
      </section>

      {/* Functions grid */}
      <section className="sig-section">
        <h2 className="sig-h2">From Disparate Data to Financial Certainty</h2>
        <p className="sig-section-sub">
          Achieve finance transformation on a modern, composable AI architecture. Go beyond the &ldquo;what&rdquo;
          and master the &ldquo;why,&rdquo; so finance finds and acts on opportunities ASAP.
        </p>
        <div className="sig-grid">
          {FUNCTIONS.map((f) => (
            <div key={f.title} className="sig-card">
              <div className="sig-card-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 15L7 9L11 12L17 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="17" cy="4" r="1.6" fill="currentColor" />
                </svg>
              </div>
              <div className="sig-card-title">{f.title}</div>
              <div className="sig-card-body">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="sig-section sig-section-alt">
        <h2 className="sig-h2">Everything you need to analyze, report, and act</h2>
        <div className="sig-pillars">
          {PILLARS.map((p) => (
            <div key={p.title} className="sig-pillar">
              <div className="sig-pillar-title">{p.title}</div>
              <div className="sig-pillar-body">{p.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="sig-trust">
        <h2 className="sig-trust-title">Enterprise-Grade Trust for Finance Data</h2>
        <p className="sig-trust-sub">
          Trusted by finance and corporate strategy teams at leading global enterprises.
        </p>
        <div className="sig-badges">
          {["SOC 2 Type II", "SOX-ready", "GDPR", "Live governance", "Full audit trail"].map((b) => (
            <span key={b} className="sig-badge">{b}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="sig-cta">
        <h2 className="sig-cta-title">Ready to give finance certainty?</h2>
        <a className="sig-btn sig-btn-primary sig-cta-btn" href="#">Get a demo</a>
      </section>

      <footer className="sig-footer">
        <SigmaLogo className="sig-logo sig-footer-logo" />
        <span className="sig-footer-copy">Financial analytics, reporting and forecasting at scale.</span>
      </footer>
    </div>
  );
}
