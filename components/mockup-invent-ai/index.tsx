import React from "react";
import "./index.css";

/* invent.ai homepage replica — visual only, no props. */

const LOGO =
  "https://20797637.fs1.hubspotusercontent-na1.net/hubfs/20797637/invent.ai_Wordmark_Black.svg";

const NAV = [
  "AI-Decisioning Platform",
  "For Retailers",
  "Resources",
  "About",
];

const TRUST_LOGOS = [
  {
    u: "https://www.invent.ai/hs-fs/hubfs/webp%20white%20customer%20logos/jos%20a%20bank%20w.webp?width=400&height=140&name=jos%20a%20bank%20w.webp",
    alt: "Jos A Bank",
    w: 200,
    h: 70,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/Untitled%20design%20(5)-4.png?width=376&height=140&name=Untitled%20design%20(5)-4.png",
    alt: "a.k.a",
    w: 188,
    h: 70,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/Untitled+design+-+2025-11-13T161231.948.webp?width=300&height=150&name=Untitled+design+-+2025-11-13T161231.948.webp",
    alt: "Boots UK",
    w: 150,
    h: 75,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/webp%20white%20customer%20logos/mavi%20w.webp?width=400&height=140&name=mavi%20w.webp",
    alt: "Mavi",
    w: 200,
    h: 70,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/webp%20white%20customer%20logos/five%20below%20w.webp?width=400&height=140&name=five%20below%20w.webp",
    alt: "Five Below",
    w: 200,
    h: 70,
  },
  {
    u: "https://20797637.fs1.hubspotusercontent-na1.net/hubfs/20797637/InventAI-newTheme%20-%202025/alo-cititrends.svg",
    alt: "alo-cititrends",
    w: 319,
    h: 48,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/Untitled+design+-+2025-10-23T230423.368.webp?width=300&height=106&name=Untitled+design+-+2025-10-23T230423.368.webp",
    alt: "GNC",
    w: 150,
    h: 53,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/West+Marine+white+(1).webp?width=400&height=140&name=West+Marine+white+(1).webp",
    alt: "West Marine Logo",
    w: 200,
    h: 70,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/Tecovas%20(1).png?width=400&height=140&name=Tecovas%20(1).png",
    alt: "Tecovas",
    w: 200,
    h: 70,
  },
  {
    u: "https://20797637.fs1.hubspotusercontent-na1.net/hubfs/20797637/InventAI-newTheme%20-%202025/tailored-brands.svg",
    alt: "Tailored Brands",
    w: 200,
    h: 37,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/webp%20white%20customer%20logos/mattress%20firm%20w.webp?width=200&height=70&name=mattress%20firm%20w.webp",
    alt: "Mattress Firm",
    w: 200,
    h: 70,
  },
  {
    u: "https://20797637.fs1.hubspotusercontent-na1.net/hubfs/20797637/InventAI-newTheme%20-%202025/footasylum.svg",
    alt: "Footasylum",
    w: 244,
    h: 34,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/webp%20white%20customer%20logos/academy%20w.webp?width=200&height=70&name=academy%20w.webp",
    alt: "Academy Sports + Outdoors",
    w: 200,
    h: 70,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/webp%20white%20customer%20logos/mens%20wearhouse%20w.webp?width=200&height=70&name=mens%20wearhouse%20w.webp",
    alt: "Men's Wearhouse",
    w: 200,
    h: 70,
  },
  {
    u: "https://20797637.fs1.hubspotusercontent-na1.net/hubfs/20797637/InventAI-newTheme%20-%202025/4f-logo.svg",
    alt: "4F",
    w: 88,
    h: 43,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/Untitled%20design%20-%202025-10-23T225235.258.png?width=200&height=70&name=Untitled%20design%20-%202025-10-23T225235.258.png",
    alt: "BigBrand Tire",
    w: 200,
    h: 70,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/webp%20white%20customer%20logos/ccc%20w.webp?width=200&height=70&name=ccc%20w.webp",
    alt: "CCC",
    w: 200,
    h: 70,
  },
  {
    u: "https://www.invent.ai/hs-fs/hubfs/webp%20white%20customer%20logos/flo%20w.webp?width=400&height=140&name=flo%20w.webp",
    alt: "FLO",
    w: 200,
    h: 70,
  },
];

const PROVEN = [
  {
    icon: "https://www.invent.ai/hs-fs/hubfs/website%20icons/purple%20bg%20arrow%20up%20icon.webp?width=70&height=72&name=purple%20bg%20arrow%20up%20icon.webp",
    alt: "purple bg arrow up icon",
    stat: "8-11%",
    label: "more revenue with less or same inventory",
  },
  {
    icon: "https://www.invent.ai/hs-fs/hubfs/website%20icons/purple%20bg%20arrow%20up%20icon.webp?width=70&height=72&name=purple%20bg%20arrow%20up%20icon.webp",
    alt: "purple bg arrow up icon",
    stat: "6-8%",
    label: "gross margin increase",
  },
  {
    icon: "https://www.invent.ai/hs-fs/hubfs/website%20icons/purple%20bg%20clock%20icon.webp?width=72&height=72&name=purple%20bg%20clock%20icon.webp",
    alt: "purple bg clock icon",
    stat: "80%",
    label: "time savings",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "“We saw strong improvements with invent.ai in just six weeks. Weeks of supply reduced by three weeks while in-stock levels and sales increased by double digits. The results built trust across the organization and have been critical to our rollout.”",
    who: "Casey Hahn, VP, Store Planning, Allocations, S&Op",
    org: "Alo Yoga",
    logo: "https://www.invent.ai/hs-fs/hubfs/Inventai%20Theme%202025%20Files/alo.png?width=109&height=70&name=alo.png",
    logoAlt: "alo",
    logoW: 109,
    logoH: 70,
  },
  {
    quote:
      "“With invent.ai, our replenishment SKUs went from a 60% in-stock in 2024 to 92% in 2025 which drove about $60 million in topline.”",
    who: "Jamie Bragg, EVP, Chief Supply Chain Office",
    org: "Tailored Brands",
    logo: "https://www.invent.ai/hubfs/Inventai%20Theme%202025%20Files/tailored-brands-1.svg",
    logoAlt: "tailored-brands-1",
    logoW: 298,
    logoH: 53,
  },
  {
    quote:
      "“We ran a 42-store pilot with like-for-like comparisons and head-to-head category splits to isolate results. After six weeks, the invent.ai-managed groups delivered a 9.6% revenue lift. At that point, it was a no-brainer.”",
    who: "Kevin Harwood, CTO",
    org: "Tecovas",
    logo: "https://www.invent.ai/hs-fs/hubfs/webp%20black%20customer%20logos/tecovas%20bw.webp?width=550&height=193&name=tecovas%20bw.webp",
    logoAlt: "tecovas bw",
    logoW: 298,
    logoH: 105,
  },
];

const FLOW_STEPS = [
  {
    n: "01",
    h: "Measure, Always-on visibility",
    p: "Continuously capture demand, inventory and performance signals across your network, down to the store × SKU level.",
  },
  {
    n: "02",
    h: "Review, Clear recommendations",
    p: "Understand AI-driven recommendations with full transparency: what’s changing, why and the expected financial effect.",
  },
  {
    n: "03",
    h: "Approve, Control when it matters",
    p: "Stay in control. Approve or adjust decisions with flexibility across categories, regions or channels.",
  },
  {
    n: "04",
    h: "Trust, Automation that earns confidence",
    p: "Let the system optimize continuously, reducing manual work while improving performance over time.",
  },
];

const FAVICON = "https://www.invent.ai/hubfs/Archive/invent.ai%20-%20favicon%20-%20white.svg";

const LIFECYCLE = [
  {
    title: "Forecast demand",
    body:
      "Continuously adapt to changing demand patterns with AI-driven forecasts that learn and improve over time.",
    bullets: [
      "Achieve granular forecasting accuracy",
      "Leverage advanced AI capabilities",
      "Gain regional demand insights",
    ],
    quote:
      "“Invent.ai's AI-driven forecasting and profit-focused algorithms help us hit the most profitable inventory levels, analyzing demand, costs and margin with precision.”",
    attrib: "Chief Merchandising Officer, Large footwear retailer",
  },
  {
    title: "Plan continuously",
    body:
      "Move beyond static plans with AI that continuously adjusts inventory, assortment and targets based on real-time conditions.",
    bullets: [
      "Merchandise financial planning",
      "Assortment planning",
      "Buy optimization",
    ],
    quote:
      "“Invent.ai inventory planning solutions are tailor-fit to our needs. Our implementation resulted in a 5% increase in sales.”",
    attrib: "Chief Supply Chain Officer, Denim retailer",
  },
  {
    title: "Manage inventory",
    body:
      "Place the right products in the right locations, based on real-time demand and performance signals.",
    bullets: [
      "Allocation",
      "Replenishment",
      "Phantom inventory",
      "Transfers",
      "Returns",
    ],
    quote:
      "“This has changed our company! The tools we had were not sufficient for inventory management. We can now focus on core roles.”",
    attrib: "Sr. Manager Inventory, Specialty retailer",
  },
  {
    title: "Price and promote",
    body:
      "Respond to changing demand and inventory conditions to improve sell-through and margins.",
    bullets: ["Dynamic", "Promo", "Markdown"],
    quote:
      "“Invent.ai found price increases we would have never seen, kept us from stale promotions and improved our store traffic and margins without a doubt.”",
    attrib: "CEO, Popular apparel fitness retailer",
  },
];

const RESULTS_CARDS = [
  {
    kicker: "Case Study",
    title:
      "How Tailored Brands anticipates demand and increases revenue with invent.ai in its tuxedo and formal wear rental business",
    img: "https://www.invent.ai/hs-fs/hubfs/Inventai%20Theme%202025%20Files/Cover%20Illo%202%20(4).png?width=436&height=234&name=Cover%20Illo%202%20(4).png",
    alt: "News featured image",
  },
  {
    kicker: "Case Study",
    title:
      "How a leading shoe retailer unlocked $21.4M in sales with AI-powered inventory optimization",
    img: "https://www.invent.ai/hs-fs/hubfs/Inventai%20Theme%202025%20Files/Cover%20Illo%203%20(2).png?width=436&height=234&name=Cover%20Illo%203%20(2).png",
    alt: "Cover Illo 3 (2)",
  },
  {
    kicker: "Case Study",
    title:
      "Fashion retailer reduces lost sales by 6% with AI-powered inventory optimization",
    img: "https://www.invent.ai/hs-fs/hubfs/Inventai%20Theme%202025%20Files/Cover%20Illo%201%20(1).png?width=436&height=234&name=Cover%20Illo%201%20(1).png",
    alt: "Cover Illo 1 (1)",
  },
];

const LIBRARY_CARDS = [
  {
    kicker: "Product spotlight",
    title: "Inside invent.ai’s multi-agentic architecture",
  },
  {
    kicker: "News",
    title:
      "invent.ai recognized in Coresight report on AI-driven retail productivity",
  },
  {
    kicker: "White Paper",
    title: "From planning to execution: 4 changes retailers can't ignore",
  },
];

const REINVENT_ROWS = [
  ["Forecasting", "Demand sensing", "Store × SKU granularity"],
  ["Planning", "Assortment", "Buy optimization"],
  ["Inventory", "Allocation", "Replenishment"],
  ["Pricing", "Promotions", "Markdown"],
];

const FOOTER_COLUMNS: { head: string; items: string[] }[] = [
  {
    head: "Solutions",
    items: [
      "Remi & AI",
      "Planning",
      "Inventory",
      "Pricing",
    ],
  },
  {
    head: "Why invent.ai",
    items: [
      "Customer Success",
      "Implementation",
      "Hub Model",
      "Security Compliance",
      "Case Studies",
    ],
  },
  {
    head: "By Role",
    items: [
      "Planning & Inventory Specialists",
      "Merchandising Experts",
      "Pricing Leaders",
      "Tech & AI Scientists",
    ],
  },
  {
    head: "By Industry",
    items: [
      "Apparel/Fashion",
      "Specialty Retailers",
      "Grocery/Convenience",
    ],
  },
  {
    head: "Resources",
    items: [
      "Resource Library",
      "Blog",
      "Case Studies",
      "White Papers",
      "News",
      "Events",
      "Webinars",
    ],
  },
  {
    head: "About",
    items: [
      "Get in Touch",
      "What Guides Us",
      "About Us",
      "Partners & Awards",
      "Security Compliance",
      "Join invent.ai",
      "Events",
    ],
  },
  {
    head: "Connect",
    items: ["Get in Touch", "LinkedIn", "Instagram", "Meta", "YouTube"],
  },
];

function ArrowCircle() {
  return (
    <span className="ia-arrowcircle" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
        <path
          d="M5 12h13M12.5 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function ComponentMockupInventAi() {
  return (
    <div className="ia-root">
      {/* ---------------- nav ---------------- */}
      <header className="ia-nav">
        <div className="ia-nav-inner">
          <a className="ia-nav-logo" href="#">
            <img src={LOGO} alt="invent.ai" width={128} height={26} />
          </a>
          <nav className="ia-nav-links">
            {NAV.map((t) => (
              <a key={t} href="#">
                {t}
              </a>
            ))}
          </nav>
          <a className="ia-btn ia-btn-primary ia-nav-cta" href="#">
            Talk to us
          </a>
        </div>
      </header>

      {/* ---------------- 0: two-col hero (Meet Remi) ---------------- */}
      <section className="ia-sec ia-hero">
        <div className="ia-wrap ia-hero-grid">
          <div className="ia-hero-copy">
            <h1 className="ia-h1">
              Meet Remi:
              <br />
              AI for retail planning and execution
            </h1>
            <p className="ia-body">
              Remi connects planning, inventory, allocation and pricing into a
              single decisioning flow, so every action reflects the full
              business context.
            </p>
            <p className="ia-body">It doesn&rsquo;t just surface issues, it drives response by:</p>
            <ul className="ia-hero-list">
              <li>Detecting demand shifts before they affect performance</li>
              <li>Flagging stockouts and overstocks as they emerge</li>
              <li>Recommending allocation and replenishment in real conditions</li>
              <li>Identifying margin risk and pricing pressure</li>
              <li>Aligning promotions and pricing with demand and inventory</li>
            </ul>
            <p className="ia-body">
              By coordinating these decisions, Remi ensures business moves in
              one direction, not many.
            </p>
            <a className="ia-btn ia-btn-primary" href="#">
              Learn more about Remi
            </a>
          </div>
          <div className="ia-hero-media">
            <img
              src="https://www.invent.ai/hs-fs/hubfs/Remi%20chat%20interface.webp?width=2070&height=2802&name=Remi%20chat%20interface.webp"
              alt="Remi chat interface"
              width={579}
              height={784}
            />
          </div>
        </div>
      </section>

      {/* ---------------- 1: hero-banner (trust logo marquee) ---------------- */}
      <section className="ia-sec ia-trust">
        <div className="ia-marquee">
          <div className="ia-marquee-track">
            {TRUST_LOGOS.concat(TRUST_LOGOS).map((l, idx) => (
              <img
                key={`${l.alt}-${idx}`}
                className="ia-trust-logo"
                src={l.u}
                alt={l.alt}
                width={l.w}
                height={l.h}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 2: proven-value ---------------- */}
      <section className="ia-sec ia-proven">
        <div className="ia-wrap">
          <h3 className="ia-h3-40 ia-proven-title">
            90 days to
            <br />
            proven value
          </h3>
          <div className="ia-proven-grid">
            {PROVEN.map((p) => (
              <div className="ia-proven-card" key={p.stat}>
                <img
                  className="ia-proven-icon"
                  src={p.icon}
                  alt={p.alt}
                  width={36}
                  height={36}
                />
                <div className="ia-stat">{p.stat}</div>
                <div className="ia-stat-label">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 3: retail-brands (testimonials) ---------------- */}
      <section className="ia-sec ia-brands">
        <div className="ia-wrap ia-brands-grid">
          {TESTIMONIALS.map((t) => (
            <figure className="ia-quote-card" key={t.org}>
              <div className="ia-quote-logo">
                <img
                  src={t.logo}
                  alt={t.logoAlt}
                  width={t.logoW}
                  height={t.logoH}
                />
              </div>
              <blockquote className="ia-quote-text">{t.quote}</blockquote>
              <figcaption className="ia-quote-attrib">
                {t.who}
                <br />
                <span className="ia-quote-org">{t.org}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------------- 4: two-col (faster, better decisions) ---------------- */}
      <section className="ia-sec ia-decisions">
        <div className="ia-wrap">
          <h2 className="ia-h2-70 ia-h2-center ia-decisions-title">
            Retail performance depends on faster, better decisions
          </h2>
          <div className="ia-decisions-grid">
            <div className="ia-decisions-col">
              <p className="ia-body">
                Demand shifts daily. Inventory positions change constantly. But
                most planning systems are still built around static cycles and
                delayed insights.
              </p>
              <ul className="ia-decisions-list">
                <li>Plans are outdated before they&rsquo;re executed</li>
                <li>Teams spend more time analyzing than acting</li>
                <li>
                  Decisions are made without clear visibility into what&rsquo;s
                  changing or why
                </li>
              </ul>
            </div>
            <div className="ia-decisions-col">
              <p className="ia-body">
                Retailers don&rsquo;t need more planning tools. They need a
                better way to make decisions in real time.
              </p>
              <p className="ia-body ia-body-accent">
                That&rsquo;s where invent.ai is different.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5: tab-with-content (decision flow) ---------------- */}
      <section className="ia-sec ia-flow">
        <div className="ia-wrap">
          <h2 className="ia-h2-70 ia-h2-center">
            A simpler way to connect with retail planning data
          </h2>
          <div className="ia-flow-intro">
            <p className="ia-body">
              Invent.ai continuously measures what&rsquo;s happening, highlights
              what matters and helps teams act with clarity, without adding
              complexity.
            </p>
            <p className="ia-body">
              Instead of static plans and manual analysis, decisions move
              through a continuous, transparent system, so teams stay informed,
              stay in control and act when it matters.
            </p>
          </div>
          <div className="ia-flow-steps">
            {FLOW_STEPS.map((s, i) => (
              <div className={`ia-flow-step${i === 0 ? " is-active" : ""}`} key={s.n}>
                <div className="ia-flow-num">{s.n}</div>
                <div className="ia-flow-body">
                  <h3 className="ia-flow-h">{s.h}</h3>
                  <p className="ia-flow-p">{s.p}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="ia-flow-outro">
            This is how decisions flow.
            <br />
            Remi is how teams interact with them.
          </p>
        </div>
      </section>

      {/* ---------------- 6: delighted-customers (lifecycle) ---------------- */}
      <section className="ia-sec ia-lifecycle">
        <div className="ia-wrap">
          <div className="ia-lifecycle-head">
            <div>
              <h3 className="ia-h3-40">
                Seamless planning and execution across your retail lifecycle
              </h3>
              <h4 className="ia-h4-24">
                AI agents continuously analyze demand, inventory and
                performance, so better decisions happen across every part of
                your business.
              </h4>
            </div>
            <a className="ia-lifecycle-link" href="#">
              Learn more about our products.
            </a>
          </div>
          <div className="ia-lifecycle-grid">
            {LIFECYCLE.map((c) => (
              <div className="ia-life-card" key={c.title}>
                <div className="ia-life-top">
                  <img
                    className="ia-life-mark"
                    src={FAVICON}
                    alt="invent.ai - favicon - white"
                    width={17}
                    height={16}
                  />
                  <p className="ia-life-title">{c.title}</p>
                  <p className="ia-life-body">{c.body}</p>
                  <ul className="ia-life-bullets">
                    {c.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <ArrowCircle />
                </div>
                <div className="ia-life-quote">
                  <p className="ia-life-quote-text">{c.quote}</p>
                  <p className="ia-life-quote-attrib">{c.attrib}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 7: library-section (results) ---------------- */}
      <section className="ia-sec ia-library">
        <div className="ia-wrap">
          <h2 className="ia-h2-40 ia-h2-center">
            How better decisions are driving results
          </h2>
          <div className="ia-library-grid">
            {RESULTS_CARDS.map((c) => (
              <article className="ia-lib-card" key={c.title}>
                <div className="ia-lib-img">
                  <img src={c.img} alt={c.alt} width={396} height={213} />
                </div>
                <div className="ia-lib-kicker">{c.kicker}</div>
                <h3 className="ia-lib-title">{c.title}</h3>
                <a className="ia-lib-more" href="#">
                  Read More
                  <ArrowCircle />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 8: reinvent-sec ---------------- */}
      <section className="ia-sec ia-reinvent">
        <div className="ia-wrap ia-reinvent-grid">
          <div className="ia-reinvent-left">
            <h2 className="ia-h2-70">
              AI that supports every step of retail planning
            </h2>
          </div>
          <div className="ia-reinvent-right">
            <p className="ia-body">
              From forecasting and planning to inventory and pricing, invent.ai
              uses AI to turn data into real-time decisions, helping retailers
              move faster, act with confidence and improve revenue and margin.
            </p>
            <div className="ia-reinvent-matrix">
              {REINVENT_ROWS.map((row) => (
                <div className="ia-reinvent-row" key={row[0]}>
                  {row.map((cell, ci) => (
                    <span
                      className={ci === 0 ? "ia-reinvent-cell is-head" : "ia-reinvent-cell"}
                      key={cell}
                    >
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 9: why-choose (light panel) ---------------- */}
      <section className="ia-sec ia-why">
        <div className="ia-why-panel">
          <div className="ia-why-grid">
            <h2 className="ia-h2-70 ia-why-title">Why choose invent.ai?</h2>
            <div className="ia-why-copy">
              <p className="ia-body">
                AI only matters if it leads to better decisions, and real
                business results.
              </p>
              <p className="ia-body">
                Invent.ai brings together AI agents that continuously analyze
                demand, inventory and pricing, guiding decisions across your
                business in real time. Every recommendation is transparent,
                every action is measurable and every decision is aligned to
                revenue, margin and inventory performance.
              </p>
              <p className="ia-body">
                Retailers using invent.ai achieve 8 to 11% revenue growth and 6
                to 8% margin improvement in under 90 days: results proven and
                publicly validated by our customers.
              </p>
              <p className="ia-body">
                With a 100% success rate across pilots and go-lives, invent.ai
                has delivered every implementation, retained every customer and
                remains fully referenceable. Built to scale and designed for
                clarity, invent.ai helps retailers move faster, operate more
                efficiently and make better decisions with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 10: library-section (more resources) ---------------- */}
      <section className="ia-sec ia-library ia-library-alt">
        <div className="ia-wrap">
          <h2 className="ia-h2-40 ia-h2-center">
            More from our resource library
          </h2>
          <div className="ia-library-grid">
            {LIBRARY_CARDS.map((c) => (
              <article className="ia-lib-card" key={c.title}>
                <div className="ia-lib-img ia-lib-img-blank" />
                <div className="ia-lib-kicker">{c.kicker}</div>
                <h3 className="ia-lib-title">{c.title}</h3>
                <a className="ia-lib-more" href="#">
                  Read More
                  <ArrowCircle />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 11: single-column-banner ---------------- */}
      <section className="ia-sec ia-cta">
        <div className="ia-wrap ia-cta-inner">
          <h2 className="ia-h2-70 ia-cta-title">
            Drive revenue. Improve margins.
            <br />
            Move faster with better AI-powered planning.
          </h2>
          <a className="ia-btn ia-btn-dark" href="#">
            Speak with a retail AI expert
          </a>
        </div>
      </section>

      {/* ---------------- footer ---------------- */}
      <footer className="ia-footer">
        <div className="ia-wrap">
          <div className="ia-footer-top">
            <img
              className="ia-footer-logo"
              src={LOGO}
              alt="invent.ai"
              width={150}
              height={30}
            />
            <div className="ia-footer-tag">AI Decisioning Platform</div>
          </div>
          <div className="ia-footer-cols">
            {FOOTER_COLUMNS.map((col) => (
              <div className="ia-footer-col" key={col.head}>
                <div className="ia-footer-head">{col.head}</div>
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
          <div className="ia-footer-legal">
            <span>
              Copyright &copy; 2026, invent.ai Invent Yaz&#305;l&#305;m
              Dan&#305;&#351;manl&#305;k A.&#350;. Tax Number 4780859029
              Commercial Registration Number 848695
            </span>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
