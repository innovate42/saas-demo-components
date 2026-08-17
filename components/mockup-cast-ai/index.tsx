import React from "react";
import "./index.css";

/* ------------------------------------------------------------------ *
 * Cast AI homepage replica (visual only)
 * All imagery hot-links the real assets on cast.ai.
 * ------------------------------------------------------------------ */

const UP = "https://cast.ai/wp-content/uploads";
const THEME = "https://cast.ai/wp-content/themes/cx/assets/images";
const INTEG =
  "https://cast.ai/wp-content/plugins/cx-ex/assets/blocks/platform-integrations-scroll/images";

const NAV: { label: string; trigger?: boolean }[] = [
  { label: "Platform", trigger: true },
  { label: "Customers", trigger: true },
  { label: "Pricing" },
  { label: "Resources", trigger: true },
  { label: "Company", trigger: true },
];

const CUSTOMER_LOGOS = [
  [`${UP}/2025/01/logo-akamai-black.svg`, "Akamai"],
  [`${UP}/2024/06/Yotpo.svg`, "Yotpo"],
  [`${UP}/2022/08/Iterable.svg`, "Iterable"],
  [`${UP}/2023/09/NIQ.svg`, "NIQ"],
  [`${UP}/2026/02/logo-swisscom-black.svg`, "Swisscom"],
  [`${UP}/2026/07/logo-kakao-000.svg`, "Kakao"],
  [`${UP}/2025/01/logo-fico-black.svg`, "FICO"],
  [`${UP}/2025/01/logo-bmw-group-black.svg`, "BMW Group"],
  [`${UP}/2025/01/logo-huggingface-black.svg`, "Hugging Face"],
  [`${UP}/2025/01/logo-sharechat-black.svg`, "ShareChat"],
  [`${UP}/2026/02/logo-wework-black.svg`, "WeWork"],
  [`${UP}/2026/02/logo-cisco-black.svg`, "Cisco"],
  [`${UP}/2026/02/logo-playplay-black.svg`, "PlayPlay"],
  [`${UP}/2026/02/logo-roku-black.svg`, "Roku"],
];

const NODE_LABELS = [
  "OOM kills",
  "Errors rates",
  "Unscheduled pod",
  "Vulnerabilities",
  "OOM kills",
  "OOM kills",
  "Unscheduled pod",
  "Vulnerabilities",
  "OOM kills",
  "Latency increasing",
  "Unscheduled pod",
  "Misconfig",
];

const WarningTriangle = () => (
  <svg
    className="ca-warn"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
  >
    <path
      fill="#D80E53"
      d="M29.6 23.511 18.667 4.527a3.095 3.095 0 0 0-5.337 0L2.399 23.511a2.939 2.939 0 0 0 0 2.965A3.044 3.044 0 0 0 5.07 28h21.86a3.045 3.045 0 0 0 2.666-1.524 2.94 2.94 0 0 0 .002-2.965ZM15 13a1 1 0 1 1 2 0v5a1 1 0 0 1-2 0v-5Zm1 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
    />
  </svg>
);

const Chevron = () => (
  <svg
    className="ca-chev"
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M1 1l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PLATFORM_TABS = [
  "Application performance automation",
  "Kubernetes monitoring",
  "Workload optimization",
  "AutoScaler",
  "Karpenter",
  "GPU",
];

const PLATFORM_FEATURES = [
  {
    h: "Self-healing operations",
    p: "Use agentic runbooks to remediate drift, image issues, policy violations, and operational failures with approval workflows.",
    img: `${UP}/2026/02/platform-slider-1.svg`,
  },
  {
    h: "Kubernetes cost and performance intelligence",
    p: "See actual, requested, and provisioned usage by cluster, namespace, workload, team, CPU, memory, and GPU.",
    img: `${UP}/2026/02/platform-slider-2.svg`,
  },
  {
    h: "Workload rightsizing",
    p: "Automatically tune CPU, memory, requests, limits, and replicas based on real workload behavior. Reduce overprovisioning without starving applications.",
    img: `${UP}/2026/02/platform-slider-3.svg`,
  },
  {
    h: "Infrastructure automation",
    p: "Provision the right compute, improve bin packing, predict spot interruptions, and extend Karpenter with workload-aware decisions.",
    img: `${UP}/2026/02/platform-slider-4.svg`,
  },
];

const ENGINE_CARDS = [
  {
    h: "App-aware reliability",
    p: "Predicts spot interruptions up to 30 minutes before they happen, migrating workloads gracefully before your users feel a slowdown.",
  },
  {
    h: "Precision rightsizing for stability",
    p: 'Adjusts CPU and memory at the millicore level to prevent resource starvation and "noisy neighbor" issues.',
  },
  {
    h: "Intelligent workload placement",
    p: "Instantly matches every pod to its optimal instance type, ensuring high-demand AI and data workloads run on the best possible hardware.",
  },
];

const STEPS = [
  {
    h: "Connect",
    p: "Deploy to your Kubernetes clusters in minutes. Start in read-only mode. No infrastructure changes required.",
  },
  {
    h: "Analyze",
    p: "The platform observes real workload behavior, not static configurations, and identifies optimization opportunities.",
  },
  {
    h: "Optimize",
    p: "Cast AI automatically scales, rightsizes, and rebalances based on real-time signals, not scheduled jobs.",
  },
  {
    h: "Fix",
    p: "Use agentic runbooks to fix operational and security issues for you. You approve every change before it ships.",
  },
];

const INTEGRATIONS = [
  ["azure", "Azure"],
  ["aws", "AWS"],
  ["gcp", "Google Cloud"],
  ["k8s", "Kubernetes"],
  ["grafana", "Grafana"],
  ["terraform", "Terraform"],
  ["crossplane", "Crossplane"],
  ["postgresql", "PostgreSQL"],
  ["prometheus", "Prometheus"],
  ["jira", "Jira"],
  ["rancher", "Rancher"],
  ["opentelemetry", "OpenTelemetry"],
  ["mysql", "MySQL"],
  ["ibm", "IBM"],
  ["helm", "Helm"],
  ["openshift", "OpenShift"],
  ["vmware", "VMware"],
  ["oracle", "Oracle"],
  ["kops", "kOps"],
  ["alicloud", "Alibaba Cloud"],
  ["pulumi", "Pulumi"],
  ["onprem", "On-prem"],
];

const CASE_STUDIES = [
  {
    h: "Akamai achieves 40-70% cloud savings, boosts engineer productivity",
    q: '"I had an aha moment, an iPhone moment, with Cast. Literally two minutes into the integration, we saw the cost analytics, and I had an insight into something I had never had before and had tried to get for a very long time."',
    name: "Dekel Shavit",
    role: "Sr. Director of Engineering",
    photo: `${UP}/2025/01/profile-dekel-shavit-alt-1.jpg`,
    logo: `${UP}/2025/01/logo-akamai-white.svg`,
    logoAlt: "Akamai",
  },
  {
    h: "Yotpo automates Spot Instances, cuts 40% in cloud costs and saves time",
    q: '"And with Cast AI, we didn\'t do anything. Like, we didn\'t do the move before, we didn\'t do the move after. So there was a lot of human resources and time saved here. That was a very good experience. And again, from a cost perspective, it was highly optimized."',
    name: "Achi Solomon",
    role: "Director of DevOps",
    photo: `${UP}/2025/01/profile-achi-solomon-alt-1.jpg`,
    logo: `${UP}/2025/01/logo-yotpo-white.svg`,
    logoAlt: "Yotpo",
  },
  {
    h: "Bede Gaming automatically optimizes K8s workloads with no risk to performance",
    q: '"In my mind, it\'s one less thing to worry about, and therefore teams can be focused on other things of potentially higher value. So having [Cast AI] just run in the background with a good level of confidence that we\'re running as efficiently as we can, balancing the service that we\'re providing, that\'s great."',
    name: "Dan Whiteley",
    role: "Chief Technology Officer",
    photo: `${UP}/2025/01/profile-dan-whiteley-alt-1.jpg`,
    logo: `${UP}/2025/01/logo-bede-gaming-white.svg`,
    logoAlt: "Bede Gaming",
  },
];

const G2_SYMBOL_NO_BG = `${THEME}/g2-symbol-no-bg.svg`;
const FIVE_STARS = `${THEME}/five-stars.svg`;
const CAST_BLUE_SYMBOL = `${THEME}/logo-cast-ai-blue-40x40.svg`;

const TESTIMONIALS = [
  {
    q: "\"I don't have to do anything manually and we're close to 98% commitment utilization. I used to do capacity planning twice a week for CUD management, now I do that once every two months.\"",
    name: "Abhiroop Soni",
    role: "Staff Engineer, DevOps at ShareChat",
    avatar: `${UP}/2025/01/profile-abhiroop-soni-96x96-1.jpg`,
    source: CAST_BLUE_SYMBOL,
    sourceAlt: "Cast AI",
  },
  {
    q: '"Cast AI gets the perfect machine for the workload every time."',
    name: "Nicolas Hug",
    role: "Lead SRE at Voggt",
    avatar: `${UP}/2025/01/profile-nicolas-hug-96x96-1.jpg`,
    source: CAST_BLUE_SYMBOL,
    sourceAlt: "Cast AI",
  },
  {
    q: '"It was very easy for us to switch from AWS EKS Karpenter to CastAI. There Terraform Modules enabled us to integrate it perfectly into our Infrastructure as Code workflows."',
    name: "Johannes G.",
    role: "Expert Lead Cloud and DevOps",
    avatar: `${UP}/2025/01/profile-johannes-g-96x96-1.jpg`,
    source: G2_SYMBOL_NO_BG,
    sourceAlt: "G2",
  },
  {
    q: '"After integrating Cast, we didn\'t have to do anything during Black Friday, which is amazing. We gained not just compute cost reduction but also a reduction in engineer workload."',
    name: "Achi Solomon",
    role: "Director of DevOps at Yotpo",
    avatar: `${UP}/2025/01/profile-achi-solomon-96x96-1.jpg`,
    source: CAST_BLUE_SYMBOL,
    sourceAlt: "Cast AI",
  },
  {
    q: '"The team is very engaged and really care about our success. they are always there to answer questions and do deep dives when changes are made"',
    name: "Ron G.",
    role: "VP R&D",
    avatar: `${UP}/2025/01/profile-ron-g-96x96-1.jpg`,
    source: G2_SYMBOL_NO_BG,
    sourceAlt: "G2",
  },
  {
    q: '"For our use case, CAST was not two times better or five times better. It was immeasurably better."',
    name: "Dekel Shavit",
    role: "Senior Director of Engineering at Akamai",
    avatar: `${UP}/2025/01/profile-dekel-shavit-96x96-1.jpg`,
    source: CAST_BLUE_SYMBOL,
    sourceAlt: "Cast AI",
  },
];

const FOOTER_COLUMNS: { h: string; items: string[] }[] = [
  {
    h: "Solutions",
    items: [
      "Kubernetes workload optimization",
      "Standard cluster optimization",
      "Karpenter cluster optimization",
      "Database optimization",
      "Kubernetes cost monitoring",
      "Enterprise AI coding & inference",
    ],
  },
  {
    h: "GPU Optimization",
    items: [
      "GPU Sharing",
      "GPU Workload Scaling Policies",
      "GPU Cost Visibility",
      "Cross-cloud GPU Access",
      "Custom GPU Edge Location",
    ],
  },
  {
    h: "Resources",
    items: [
      "Blog",
      "Events",
      "Webinars",
      "Reports",
      "Customer stories",
      "Documentation",
      "Release notes",
      "Kubernetes Glossary",
      "Pricing",
    ],
  },
  {
    h: "Company",
    items: [
      "About us",
      "Careers",
      "Contact us",
      "Slack community",
      "Newsroom",
      "Brand assets",
      "Partner program",
      "APA Hero program",
      "Referral program",
    ],
  },
];

const FOOTER_BADGES = [
  [`${THEME}/certificate-iso-27001-fff.svg`, "ISO 27001"],
  [`${THEME}/certificate-aicpa-soc2-fff.svg`, "AICPA SOC 2"],
  [`${THEME}/badge-cncf.svg`, "CNCF"],
  [`${THEME}/badge-finops-foundation.svg`, "FinOps Foundation"],
  [`${THEME}/partner-aws.svg`, "AWS Partner"],
  [`${THEME}/partner-google.svg`, "Google Cloud Partner"],
];

const BOTTOM_LINKS = [
  "Privacy policy",
  "Terms of service",
  "Customer data processing",
  "EU Projects",
  "Information security policy",
];

export default function MockupCastAi() {
  return (
    <div className="mockup-cast-ai">
      {/* ================= HEADER ================= */}
      <header className="ca-header">
        <div className="ca-container ca-header-inner">
          <a className="ca-logo" href="https://cast.ai/">
            <img
              src={`${UP}/2025/01/logo-cast-ai-black.svg`}
              alt="Cast AI"
              width={124}
              height={26}
            />
          </a>
          <nav className="ca-nav">
            {NAV.map((n) => (
              <a className="ca-nav-link" href="#" key={n.label}>
                {n.label}
                {n.trigger ? <Chevron /> : null}
              </a>
            ))}
          </nav>
          <div className="ca-header-ctas">
            <a className="ca-btn ca-btn-ghost" href="https://console.cast.ai/">
              Sign in
            </a>
            <a className="ca-btn ca-btn-dark" href="https://cast.ai/get-started/">
              Start free trial
            </a>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="ca-sec ca-hero">
        <div className="ca-container ca-hero-inner">
          <div className="ca-hero-copy">
            <p className="ca-eyebrow">Automation for cloud-native teams</p>
            <h1 className="ca-h1">
              Application Performance and Kubernetes Automation. On autopilot.
            </h1>
            <p className="ca-lede">
              Cast AI turns Kubernetes workload, infrastructure, cost, and SLO
              signals into safe automated actions: rightsizing pods, scaling
              nodes, optimizing GPUs and Spot, and fixing issues without manual
              tuning.
            </p>
            <a className="ca-btn ca-btn-dark" href="https://cast.ai/get-started/">
              Start free trial
            </a>
            <p className="ca-note">
              Connects in minutes. Zero changes to your EKS, AKS, GKE or on-prem
              cluster
            </p>
          </div>
          <div className="ca-hero-media">
            <img
              src={`${UP}/2026/02/hp-hero.svg`}
              alt="Cast AI platform"
              width={580}
              height={500}
            />
          </div>
        </div>
      </section>

      {/* ================= LOGO WALL ================= */}
      <section className="ca-sec ca-logowall">
        <div className="ca-container">
          <p className="ca-logowall-caption">Trusted by 2100+ companies globally</p>
          <div className="ca-logowall-row">
            {CUSTOMER_LOGOS.map(([src, alt]) => (
              <img className="ca-logowall-logo" src={src} alt={alt} key={src} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROBLEM ================= */}
      <section className="ca-sec ca-problem">
        <div className="ca-container">
          <div className="ca-sec-head ca-center">
            <p className="ca-eyebrow">Problem</p>
            <h2 className="ca-h2">Kubernetes complexity</h2>
            <p className="ca-lede ca-lede-lg">
              Every workload has shifting CPU, memory, replica, latency, and cost
              needs. Karpenter, HPA, VPA, Spot, requests, limits, and node pools
              all help, but they still leave platform teams stitching together
              recommendations, tickets, dashboards, and manual YAML changes.
            </p>
            <p className="ca-lede ca-lede-lg">
              Cast AI closes the loop between Kubernetes signals and reliable
              automated action.
            </p>
          </div>

          <div className="ca-wam">
            <div className="ca-wam-hud">
              <span className="ca-switch" aria-hidden="true">
                <span className="ca-switch-slider" />
              </span>
              <span className="ca-wam-hud-label">CAST Automation</span>
            </div>
            <div className="ca-node-grid">
              {NODE_LABELS.map((label, i) => (
                <div className="ca-node-item critical" key={`${label}-${i}`}>
                  <span className="ca-critical-pulse" />
                  <div className="ca-node-content critical">
                    <WarningTriangle />
                    <span className="ca-issue-name">{label}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="ca-wam-caption">
              Manual intervention required. Click nodes to fix.
            </p>
          </div>
        </div>
      </section>

      {/* ================= RECOGNITION (DARK) ================= */}
      <section className="ca-sec ca-recognition">
        <div className="ca-container ca-center">
          <p className="ca-eyebrow ca-eyebrow-dark">Recognition</p>
          <h2 className="ca-h2 ca-h2-light">
            Recognized for Kubernetes optimization and application performance
            automation
          </h2>
          <p className="ca-lede ca-lede-dark ca-lede-lg">
            Platform, SRE, and FinOps teams use Cast AI to automate Kubernetes
            workload rightsizing, GPU and AI infrastructure optimization, and
            cost control without trading away reliability.
          </p>
          <div className="ca-badges">
            <img src={`${UP}/2026/04/medal.png`} alt="Award medal" />
            <img
              src={`${UP}/2026/04/g2-full-2026spring.svg`}
              alt="G2 Spring 2026 badge"
            />
            <img src={`${UP}/2026/04/medal-png.webp`} alt="Award medal" />
          </div>
          <p className="ca-badges-caption">Ranked #1 out of 223 Solutions</p>
        </div>
      </section>

      {/* ================= PLATFORM / TABS ================= */}
      <section className="ca-sec ca-platform">
        <div className="ca-container">
          <div className="ca-sec-head">
            <p className="ca-eyebrow">application performance automation platforM</p>
            <h2 className="ca-h2">
              One Kubernetes and application control loop for performance,
              reliability, and cost
            </h2>
            <p className="ca-lede ca-lede-lg">
              Cast AI continuously learns how your Kubernetes applications
              behave, then safely optimizes your entire stack, in real time.
            </p>
          </div>

          <div className="ca-tabs" role="tablist">
            {PLATFORM_TABS.map((t, i) => (
              <span className={`ca-tab${i === 0 ? " is-active" : ""}`} key={t}>
                {t}
              </span>
            ))}
          </div>

          <div className="ca-features">
            {PLATFORM_FEATURES.map((f, i) => (
              <div
                className={`ca-feature${i % 2 === 1 ? " is-reverse" : ""}`}
                key={f.h}
              >
                <div className="ca-feature-copy">
                  <h3 className="ca-h3">{f.h}</h3>
                  <p className="ca-body">{f.p}</p>
                  <div className="ca-sec-tag">
                    <img
                      className="ca-cert-icons"
                      src={`${UP}/2026/02/cert-icons.svg`}
                      alt="Security certifications"
                    />
                    <span>Enterprise-grade security</span>
                  </div>
                </div>
                <div className="ca-feature-media">
                  <img src={f.img} alt={f.h} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CAST ENGINE ================= */}
      <section className="ca-sec ca-engine">
        <div className="ca-container">
          <div className="ca-sec-head">
            <p className="ca-eyebrow">Cast Engine</p>
            <h2 className="ca-h2">
              The performance engine for your cloud-native applications
            </h2>
            <p className="ca-lede ca-lede-lg">
              Infrastructure that adapts to your code, not the other way around.
            </p>
            <p className="ca-body ca-engine-body">
              Most automation relies on static rules. The Cast AI Engine is
              different. We&rsquo;ve built an advanced predictive model for
              Kubernetes, trained on a massive dataset from thousands of clusters
              and millions of real-world workloads. By analyzing the DNA of
              application demand, our engine moves beyond &ldquo;if-then&rdquo;
              logic:
            </p>
          </div>
          <div className="ca-engine-cards">
            {ENGINE_CARDS.map((c) => (
              <div className="ca-card" key={c.h}>
                <h3 className="ca-h3">{c.h}</h3>
                <p className="ca-body">{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="ca-sec ca-how">
        <div className="ca-container">
          <div className="ca-sec-head">
            <p className="ca-eyebrow">How it works</p>
            <h2 className="ca-h2">From connect to optimized in minutes</h2>
          </div>
          <div className="ca-steps">
            {STEPS.map((s, i) => (
              <div className="ca-step" key={s.h}>
                <span className="ca-step-num">{i + 1}</span>
                <h3 className="ca-h3">{s.h}</h3>
                <p className="ca-body">{s.p}</p>
              </div>
            ))}
          </div>
          <div className="ca-how-cta">
            <a className="ca-btn ca-btn-dark" href="https://cast.ai/get-started/">
              Start free trial
            </a>
          </div>
        </div>
      </section>

      {/* ================= INTEGRATIONS ================= */}
      <section className="ca-sec ca-integrations">
        <div className="ca-container">
          <div className="ca-sec-head ca-center">
            <p className="ca-eyebrow">Integrations</p>
            <h2 className="ca-h2">Works with the tools you already use</h2>
          </div>
          <div className="ca-integ-grid">
            {INTEGRATIONS.map(([slug, alt]) => (
              <div className="ca-integ-tile" key={slug}>
                <img src={`${INTEG}/integration-${slug}.svg`} alt={alt} />
              </div>
            ))}
          </div>
          <div className="ca-integ-ctas">
            <a className="ca-btn ca-btn-ghost" href="#">
              Explore integrations
            </a>
            <a className="ca-btn ca-btn-dark" href="#">
              Book a demo
            </a>
          </div>
        </div>
      </section>

      {/* ================= CASE STUDIES ================= */}
      <section className="ca-sec ca-cases">
        <div className="ca-container">
          <div className="ca-case-grid">
            {CASE_STUDIES.map((c) => (
              <article className="ca-case-card" key={c.name}>
                <p className="ca-eyebrow ca-eyebrow-dark">Case study</p>
                <h3 className="ca-case-h">{c.h}</h3>
                <p className="ca-case-q">{c.q}</p>
                <div className="ca-case-person">
                  <img className="ca-avatar" src={c.photo} alt={c.name} />
                  <div>
                    <p className="ca-case-name">{c.name}</p>
                    <p className="ca-case-role">{c.role}</p>
                  </div>
                </div>
                <div className="ca-case-foot">
                  <img className="ca-case-logo" src={c.logo} alt={c.logoAlt} />
                  <a className="ca-case-link" href="#">
                    Read the case study
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="ca-sec ca-testimonials">
        <div className="ca-container">
          <div className="ca-sec-head ca-center">
            <p className="ca-eyebrow">TESTIMONIALS</p>
            <h2 className="ca-h2">See what people say about Cast AI</h2>
          </div>
          <div className="ca-review-grid">
            {TESTIMONIALS.map((t) => (
              <article className="ca-review-card" key={t.name + t.role}>
                <div className="ca-review-top">
                  <img className="ca-stars" src={FIVE_STARS} alt="5 out of 5 stars" />
                  <img className="ca-source" src={t.source} alt={t.sourceAlt} />
                </div>
                <p className="ca-review-q">{t.q}</p>
                <div className="ca-review-person">
                  <img className="ca-avatar" src={t.avatar} alt={t.name} />
                  <div>
                    <p className="ca-review-name">{t.name}</p>
                    <p className="ca-review-role">{t.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="ca-testimonials-foot">
            <a className="ca-btn ca-btn-ghost" href="#">
              Load more
            </a>
            <p className="ca-body">2100+ companies choose Cast AI.</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER CTA BAND ================= */}
      <section className="ca-sec ca-ctaband">
        <div className="ca-container ca-center">
          <h3 className="ca-ctaband-h">
            Go from overprovisioned to fully optimized today
          </h3>
          <div className="ca-ctaband-btns">
            <a className="ca-btn ca-btn-white" href="https://cast.ai/get-started/">
              Start free trial
            </a>
            <a className="ca-btn ca-btn-outline-white" href="#">
              Book a demo
            </a>
          </div>
          <div className="ca-g2-chip">
            <img src={`${THEME}/g2-symbol.svg`} alt="G2" />
            <span>4.8/5 50+ reviews</span>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="ca-footer">
        <div className="ca-container">
          <div className="ca-footer-top">
            <div className="ca-footer-brand">
              <img
                className="ca-footer-logo"
                src={`${THEME}/logo-cast-ai-white.svg`}
                alt="Cast AI"
              />
              <p className="ca-footer-tagline">
                Cast AI is the leading APA&reg; (Application Performance
                Automation) platform, enabling customers to cut cloud costs,
                improve performance, and boost productivity.
              </p>
              <div className="ca-footer-social">
                {["Facebook", "GitHub", "Slack Community", "LinkedIn", "X"].map(
                  (s) => (
                    <a href="#" key={s}>
                      {s}
                    </a>
                  )
                )}
              </div>
            </div>
            <div className="ca-footer-cols">
              {FOOTER_COLUMNS.map((col) => (
                <div className="ca-footer-col" key={col.h}>
                  <p className="ca-footer-col-h">{col.h}</p>
                  <ul>
                    {col.items.map((it) => (
                      <li key={it}>
                        <a href="#">{it}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="ca-footer-badges">
            {FOOTER_BADGES.map(([src, alt]) => (
              <img src={src} alt={alt} key={src} />
            ))}
          </div>

          <div className="ca-footer-bottom">
            <p>&copy; 2026 CAST AI Group Inc.</p>
            <div className="ca-footer-bottom-links">
              {BOTTOM_LINKS.map((l) => (
                <a href="#" key={l}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
