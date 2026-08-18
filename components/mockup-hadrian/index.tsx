import React from "react";
import "./index.css";

const LOGO_SVG = `<svg width="122" height="20" viewBox="0 0 122 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M24.5582 15.9708L23.1552 20H19.5807L26.8518 4.45783e-05H30.8045L38.0512 20H34.5011L33.0981 15.9708H24.5582ZM32.0123 12.8911L28.8282 3.85884L25.644 12.8911H32.0123Z" fill="#FF003C"></path> <path d="M58.3639 9.99396C58.3639 15.5691 54.2892 20 48.7627 20H40.8938V4.45783e-05H48.7627C54.2892 4.45783e-05 58.3639 4.39445 58.3639 9.99396ZM55.1798 9.99396C55.1798 6.02561 52.569 3.14064 48.7627 3.14064H44.1877V16.8595H48.7627C52.569 16.8595 55.1798 13.938 55.1798 9.99396Z" fill="#FF003C"></path> <path d="M68.441 12.7085H64.537V20H61.2431V4.64647e-05H69.2706C70.1174 -0.0031724 70.9564 0.16088 71.7394 0.482741C72.5224 0.804601 73.2338 1.27791 73.8326 1.87537C74.4314 2.47284 74.9057 3.18266 75.2283 3.96391C75.5509 4.74515 75.7153 5.58237 75.7121 6.42731C75.7121 8.99578 74.0773 11.2843 71.7349 12.2338L76.2854 20H72.6743L68.441 12.7085ZM64.537 9.77485H69.2706C71.0151 9.77485 72.4181 8.28976 72.4181 6.42731C72.4181 4.56487 71.0151 3.07978 69.2706 3.07978H64.537V9.77485Z" fill="#FF003C"></path> <path d="M90.303 15.9708L88.9 20H85.3255L92.5966 4.45783e-05H96.5493L103.796 20H100.246L98.8429 15.9708H90.303ZM97.7571 12.8911L94.573 3.85884L91.3888 12.8911H97.7571Z" fill="#FF003C"></path> <path d="M121.998 4.45783e-05V20H119.424L109.969 6.42731V20H106.675V4.45783e-05H109.262L118.704 13.5728V4.45783e-05H121.998Z" fill="#FF003C"></path> <path d="M82.4585 4.60643e-05H79.1158V20.0049H82.4585V4.60643e-05Z" fill="#FF003C"></path> <path d="M16.7376 20H11.7163V4.60643e-05H16.7376V3.33541H15.072V16.6647H16.7376V20Z" fill="#FF003C"></path> <path d="M5.02127 8.33845V4.60643e-05H0V3.33541H1.67376V16.6647H0V20H5.02127V11.6738H10.0425V8.33845H5.02127Z" fill="#FF003C"></path> </svg>`;

const ICONS: Record<string, string> = {
  ic0: `<svg width="100%" height="100%" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="12" height="12" rx="2" fill="#CC82FA"></rect> </svg>`,
  ic1: `<svg width="100%" height="100%" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="12" height="12" rx="2" fill="#73D182"></rect> </svg>`,
  ic2: `<svg width="100%" height="100%" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="12" height="12" rx="2" fill="#85778F"></rect> </svg>`,
  ic3: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 12L16 16L13.1829 16L16.1721 13L3.99998 13L4 11.0048L16.1721 11.0048L13.1829 8L16 8L20 12Z" fill="currentColor"></path> </svg>`,
  ic4: `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M4 12.9844L8 8.9844H10.8171L7.82794 11.9844L20 11.9844L20 13.9795L7.82794 13.9795L10.8171 16.9844L8 16.9844L4 12.9844Z" fill="currentColor"></path> </svg>`,
  ic5: `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 12.9843L16 16.9843L13.1829 16.9843L16.1721 13.9844L3.99998 13.9844L4 11.9892L16.1721 11.9892L13.1829 8.98437L16 8.98438L20 12.9843Z" fill="currentColor"></path> </svg>`,
  ic6: `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_1734_29989)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99999 4.57764e-05H3.99999V24H7.99999L24 14V10L7.99999 4.57764e-05Z" fill="currentColor"></path> </g> </svg>`,
  ic7: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" fill="currentColor" viewBox="0 0 256 256" class="button_icon"><path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path></svg>`,
  ic8: `<svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.99997 0L7.99997 4V6.81708L5 3.82794L5 16L3.00485 16L3.00485 3.82794L0 6.81708L1.74846e-07 4L3.99997 0Z" fill="currentColor"></path> </svg>`,
  ic9: `<svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M4 16L2.46277e-07 12L0 9.18293L2.99997 12.1721L2.99997 0L4.99512 1.69917e-05L4.99513 12.1721L7.99997 9.18293V12L4 16Z" fill="currentColor"></path> </svg>`,
  ic10: `<svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M5.66669 0.984375V9.32278H10.6667V12.6581H5.66669V20.9844H0.666687V17.649H2.33335V4.31974H0.666687V0.984375H5.66669Z" fill="#FF003C"></path> <path d="M12.3334 20.9844H17.3334V17.649H15.6748V4.31974H17.3334V0.984375H12.3334V20.9844Z" fill="#FF003C"></path> </svg>`,
  ic11: `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M19.0155 3.50781H4.98449C2.23163 3.50781 0 5.73944 0 8.4923V15.5063C0 18.2592 2.23163 20.4908 4.98449 20.4908H19.0155C21.7684 20.4908 24 18.2592 24 15.5063V8.4923C24 5.73944 21.7684 3.50781 19.0155 3.50781ZM15.6445 12.3406L9.08177 15.4706C8.9069 15.554 8.7049 15.4265 8.7049 15.2328V8.77708C8.7049 8.5806 8.91221 8.45326 9.08744 8.54208L15.6502 11.8678C15.8453 11.9666 15.8419 12.2464 15.6445 12.3406Z" fill="currentColor"></path> </svg>`,
  ic12: `<svg width="100%" height="100%" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_2081_3230)"> <path d="M0 2.70338C0 1.75388 0.789 0.984375 1.7625 0.984375H22.2375C23.211 0.984375 24 1.75388 24 2.70338V23.2654C24 24.2149 23.211 24.9844 22.2375 24.9844H1.7625C0.789 24.9844 0 24.2149 0 23.2654V2.70338ZM7.4145 21.0754V10.2379H3.813V21.0754H7.4145ZM5.6145 8.75738C6.87 8.75738 7.6515 7.92637 7.6515 6.88538C7.629 5.82187 6.8715 5.01338 5.6385 5.01338C4.4055 5.01338 3.6 5.82337 3.6 6.88538C3.6 7.92637 4.3815 8.75738 5.5905 8.75738H5.6145ZM12.9765 21.0754V15.0229C12.9765 14.6989 13.0005 14.3749 13.0965 14.1439C13.356 13.4974 13.9485 12.8269 14.9445 12.8269C16.248 12.8269 16.7685 13.8199 16.7685 15.2779V21.0754H20.37V14.8594C20.37 11.5294 18.594 9.98138 16.224 9.98138C14.313 9.98138 13.4565 11.0314 12.9765 11.7709V11.8084H12.9525L12.9765 11.7709V10.2379H9.3765C9.4215 11.2549 9.3765 21.0754 9.3765 21.0754H12.9765Z" fill="currentColor"></path> </g> <defs> <clipPath id="clip0_2081_3230"> <rect width="24" height="24" fill="white" transform="translate(0 0.984375)"></rect> </clipPath> </defs> </svg>`,
};

const Icon = ({ id, className }: { id: string; className?: string }) => (
  <span
    className={className}
    dangerouslySetInnerHTML={{ __html: ICONS[id] || "" }}
  />
);

const Logo = () => (
  <span dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
);

const MARQUEE_LOGO =
  "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/69a82112c2616576cde7e545_Breeze_Airways-logo.webp";

const SOLUTIONS = [
  {
    href: "/solutions/agentic-penetration-testing",
    img: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/674431f7b0d971a2147341d0_image-heading-automated-penetration-testing.avif",
    title: "Agentic Penetration Testing",
  },
  {
    href: "/solutions/adversarial-exposure-validation",
    img: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/686e2b4f9e2444d80b1e25ad_Banner%20Illustration%3DAEV.webp",
    title: "Adversarial Exposure Validation",
  },
  {
    href: "/solutions/continuous-asset-discovery",
    img: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6743f447e5cf62d73a325178_image-solutions-heading.avif",
    title: "Continuous Attack Surface Management",
  },
  {
    href: "/solutions/continuous-asset-discovery",
    img: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6743f447e5cf62d73a325178_image-solutions-heading.avif",
    title: "Continuous Attack Surface Management",
  },
  {
    href: "/solutions/continuous-asset-discovery",
    img: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6743f447e5cf62d73a325178_image-solutions-heading.avif",
    title: "Continuous Attack Surface Management",
  },
  {
    href: "/solutions/continuous-asset-discovery",
    img: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6743f447e5cf62d73a325178_image-solutions-heading.avif",
    title: "Continuous Attack Surface Management",
  },
  {
    href: "/solutions/continuous-asset-discovery",
    img: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6743f447e5cf62d73a325178_image-solutions-heading.avif",
    title: "Continuous Attack Surface Management",
  },
];

const STORIES = [
  {
    video: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6945745822d2dda064d5634e_video169.webp",
    logo: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6a0ae3c1692a49b2190d588b_Damen_logo%201.svg",
    quote: "Hadrian enables us to pinpoint the real security issues that we should be working on.",
    name: "Hans Quivooij",
    role: "CISO",
  },
  {
    video: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/674eb2e106b0c29f43a28530_Danny%201920%20x%201080.avif",
    logo: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/671fb513623f3f41c24b208e_Logo_LBS.svg",
    quote: "Event-driving testing saved time and energy with tests that leveraged insight",
    name: "Danny Attias",
    role: "LBS Chief Digital & Information Officer",
  },
  {
    video: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/674eb312b97bc71bd71f0028_Mahdi%20Abdulrazak.avif",
    logo: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/671fb3fe8a9cb9193051b1ab_Logo_SHVEnergy.svg",
    quote: "It's not often that you find a tool that homes in on the risks that truly matter",
    name: "Mahdi Abdulrazak",
    role: "Group Information Security & Risk Officer",
  },
];

const ARTICLES = [
  {
    href: "/resources/is-agentic-pentesting-right-for-you",
    img: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6a71b52da90a974c89f12353_Datasheet.%20Is%20Agentic%20Pentesting%20%20Right%20for%20You_%20EN.png",
    tag: "Guides",
    title: "Is Agentic Pentesting Right for You?",
  },
  {
    href: "/resources/what-to-look-for-in-ai-powered-pentesting",
    img: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6a71b546ee996b52ae8066d0_Datasheet.%20What%20to%20Look%20for%20in%20%20AI-Powered%20Pentesting%20EN.png",
    tag: "Guides",
    title: "What to Look for in AI-Powered Pentesting",
  },
  {
    href: "/resources/exposure-management-for-the-financial-services",
    img: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6a631916a7c3e824760ca6d9_Datasheet.%201.webp",
    tag: "Guides",
    title: "Exposure Management for the Financial Services",
  },
];

const FOOTER_SOLUTIONS = Array.from({ length: 7 }, () => ({
  href: "/solutions/agentic-penetration-testing",
  label: "Agentic Penetration Testing",
}));

const FOOTER_PLATFORM = Array.from({ length: 7 }, () => ({
  href: "/technology",
  label: "Technology",
}));

const FOOTER_CUSTOMERS = Array.from({ length: 13 }, () => ({
  href: "/case-study/how-worldstream-operationalized-continuous-exposure-management-across-a-critical-infrastructure-environment",
  label: "Worldstream",
}));

const FOOTER_RESOURCES = Array.from({ length: 6 }, () => ({
  href: "/blog",
  label: "Blog",
}));

const FOOTER_COMPANY = [
  { href: "/company", label: "About us" },
  { href: "https://careers.hadrian.io/", label: "Careers" },
  { href: "/events", label: "Events" },
];

const FOOTER_PARTNERSHIP = [
  { href: "/partnerships", label: "Become a partner" },
  { href: "https://hadrian.amp.vg/wp/signup", label: "Partner login" },
];

const FOOTER_LEGAL = Array.from({ length: 5 }, () => ({
  href: "https://hadrian.io/terms-conditions/general",
  label: "EULA",
}));

export default function HadrianMockup() {
  return (
    <div className="hadrian-mock">
      {/* ===== Header (from 00b-realnav.spec.md) ===== */}
      <header className="h-header">
        <div className="h-header_utility">
          <a href="https://hadrian.io/nova-request">REQUEST AN AGENTIC PENTEST</a>
          <span className="h-header_lang">
            <span>English</span> | <span>Français</span> | <span>Italiano</span> | <span>Deutsch</span>
          </span>
          <a href="/contact">CONTACT</a>
          <a href="https://app.hadrian.io/">LOGIN</a>
        </div>
        <div className="h-header_main">
          <a href="/" className="h-header_logo">
            <Logo />
          </a>
          <nav className="h-header_nav">
            <a href="/platform">PRODUCTS</a>
            <a href="/platform">SOLUTIONS</a>
            <a href="/platform">PLATFORM</a>
            <a href="/resources">RESOURCES</a>
            <a href="/company">COMPANY</a>
          </nav>
          <a href="/contact" className="h-header_cta">
            Get in touch
          </a>
        </div>
      </header>

      {/* ===== 01 Hero ===== */}
      <section className="hero">
        <div className="hero_wrap">
          <h1>
            <a href="#">The AI that hacks you should be working for you.</a>
          </h1>
          <p>
            Hadrian&apos;s autonomous AI continuously discovers exposures, validates what attackers can exploit, and delivers pentest-level insights.
          </p>
          <div className="btn-row">
            <a href="/contact" className="btn-primary">
              Get in touch
            </a>
            <a href="/nova-request" className="btn-secondary">
              Request an agentic pentest
            </a>
          </div>
        </div>
      </section>

      {/* ===== 02 Media (lottie animation placeholder) ===== */}
      <section className="media-section">
        <div className="media-placeholder" />
      </section>

      {/* ===== 03 Marquee ===== */}
      <section className="marquee-section">
        <div className="marquee-track">
          {Array.from({ length: 25 }).map((_, i) => (
            <img key={i} src={MARQUEE_LOGO} alt="Customer logo" />
          ))}
        </div>
      </section>

      {/* ===== 04 Continuous Asset Discovery ===== */}
      <section className="sec sec-dark">
        <div className="heading-block">
          <div className="tag-row">
            <span className="tag-icon">
              <Icon id="ic0" />
            </span>
            <span className="tag-label">discover</span>
          </div>
          <h2>Continuous Asset Discovery</h2>
        </div>
        <div className="feature-grid">
          <div className="feature-card wide">
            <div className="feature-card_text">
              <h4>Automate discovery</h4>
              <p>
                Reduce workload, Hadrian&apos;s automated asset inventory saves customers over 10 hours per week on average.
              </p>
            </div>
            <img
              src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/6750819dedd8bdaa6e17ef3e_2.1%20Home%20-%20Discovery%20-%20Automate%20Discovery.avif"
              alt="Automate discovery"
            />
          </div>
          <div className="feature-card">
            <div className="feature-card_text">
              <h4>Enrich assets</h4>
              <p>Enrich your understanding of every asset with real-time reconnaissance and contextualization.</p>
            </div>
            <img
              src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/675081a6ddd5664bcab3b848_2.2%20Home%20-%20Discovery%20-%20Enrich%20assets.avif"
              alt="Enrich assets"
            />
          </div>
          <div className="feature-card">
            <div className="feature-card_text">
              <h4>Gain visibility</h4>
              <p>Gain the most complete visibility of all of your exposed assets and reveal how they are interconnected.</p>
            </div>
            <img
              src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/67520e2f1f62646d3bbaea3e_2.3%20Home%20-%20Discovery%20-%20Gain%20Visibility.avif"
              alt="Gain visibility"
            />
          </div>
        </div>
      </section>

      {/* ===== 05 Streamlined Exposure Management ===== */}
      <section className="sec sec-dark">
        <div className="heading-block">
          <div className="tag-row">
            <span className="tag-icon">
              <Icon id="ic1" />
            </span>
            <span className="tag-label">secure</span>
          </div>
          <h2>Streamlined Exposure Management</h2>
        </div>
        <div className="feature-grid">
          <div className="feature-card wide">
            <div className="feature-card_text">
              <h4>Shorten Mean Time to Remediate</h4>
              <p>Reduce MTTR by 80% with streamlined workflows and step-by-step remediation recommendations.</p>
            </div>
            <img
              src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/67508294e372ce772e703ca6_4.1%20Home%20-%20Secure%20-%20Shorten%20Mean%20Time%20to%20Remediate.avif"
              alt="Shorten Mean Time to Remediate"
            />
          </div>
          <div className="feature-card">
            <div className="feature-card_text">
              <h4>Contextualize</h4>
              <p>Prioritize the highest-impact risks with complete context including exploitability, business importance, and threat intel.</p>
            </div>
            <img
              src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/6a44ebcbb97d50cc14927d61_Contextualize.webp"
              alt="Contextualize"
            />
          </div>
          <div className="feature-card">
            <div className="feature-card_text">
              <h4>Drive remediation</h4>
              <p>Track risks from discovery to resolution and share information with 3rd party remediators with built-in collaboration tools.</p>
            </div>
            <img
              src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/675223c33561ee0902bb326c_4.3%20Home%20-%20Secure%20-%20Drive%20remediation.avif"
              alt="Drive remediation"
            />
          </div>
        </div>
      </section>

      {/* ===== 06 AI-driven. Battle-tested. (Technology) ===== */}
      <section className="sec tech-section">
        <div className="tech-grid">
          <div>
            <div className="tag-row">
              <span className="tag-icon">
                <Icon id="ic2" />
              </span>
              <span className="tag-label">Technology</span>
            </div>
            <h2>
              AI-driven.
              <br />
              Battle-tested.
            </h2>
            <p>
              Our agentic AI platform is trained by elite hackers, trusted by enterprise security teams, and continuously improved by machine learning. Hadrian combines technical depth with automation speed so you can act faster and smarter.
            </p>
            <a href="/technology" className="btn-secondary">
              Learn more
            </a>
          </div>
          <div className="tech-video-wrap">
            <img
              src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/6722913a569b416b93213d6a_video_rectangles-poster-00001.jpg"
              alt="Hadrian technology"
            />
          </div>
        </div>
      </section>

      {/* ===== 07 Scalable solutions ===== */}
      <section className="sec sec-light">
        <div className="section-title-row">
          <h2>Scalable solutions</h2>
          <a href="/platform" className="btn-third">
            All solutions
          </a>
        </div>
        <div className="cards-scroll">
          {SOLUTIONS.map((s, i) => (
            <a key={i} href={s.href} className="solution-card">
              <img src={s.img} alt={s.title} />
              <div>
                <h5>{s.title}</h5>
                <div className="solution-card_footer">
                  <span>View solution</span>
                  <Icon id="ic3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== 08 Trusted by SOC teams globally ===== */}
      <section className="stories-section">
        <div className="section-title-row">
          <h2>Trusted by SOC teams globally</h2>
          <a href="https://hadrian.io/resources?tag=case+study" className="btn-third">
            All case studies
          </a>
        </div>
        {STORIES.map((s, i) => (
          <div key={i} className="stories-slide">
            <div className="stories-slide_video">
              <img src={s.video} alt={s.name} />
              <div className="play-btn">
                <Icon id="ic6" />
              </div>
            </div>
            <div className="stories-slide_content">
              <img src={s.logo} alt="Customer logo" />
              <p className="stories-quote">&#8220;{s.quote}&#8221;</p>
              <div>
                <p className="stories-author">{s.name}</p>
                <p className="stories-role">{s.role}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ===== 09 Leading the pack (GigaOm) ===== */}
      <section className="gigaom-section">
        <div className="gigaom-grid">
          <div className="gigaom-content">
            <h2>Leading the pack</h2>
            <p>
              Hadrian is at the frontier of agentic AI-driven offensive security with recognition in Gartner® Market Guide for Adversarial Exposure Validation. Hadrian has also been recognized as a Leader in the GigaOm Radar Report for the second year in a row, and received Frost &amp; Sullivan&apos;s New Product Innovation.
            </p>
            <a
              href="https://hadrian.io/resources/2026-gartner-r-market-guide-for-adversarial-exposure-validation"
              className="btn-primary"
            >
              Read Gartner Report
            </a>
          </div>
          <div className="gigaom-image">
            <img
              src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/69e0ca7a490a78fbb3948b39_logos-leading-the-pack.webp"
              alt="Analyst recognition logos"
            />
          </div>
        </div>
      </section>

      {/* ===== 10 Sharpen your offensive security strategy (Resources) ===== */}
      <section className="articles-section">
        <div className="section-title-row">
          <h2 className="dark-title">Sharpen your offensive security strategy</h2>
          <a href="/resources" className="btn-third">
            All resources
          </a>
        </div>
        <div className="articles-grid">
          {ARTICLES.map((a, i) => (
            <a key={i} href={a.href} className="article-card">
              <img src={a.img} alt={a.title} />
              <div className="article-card_text">
                <p className="article-tag">{a.tag}</p>
                <h4>{a.title}</h4>
                <div className="article-read-more">
                  <span>Read more</span>
                  <Icon id="ic3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== 11 Take the first step CTA ===== */}
      <section className="cta-section">
        <div className="cta-wrap">
          <h2>Take the first step in the shoes of your adversary</h2>
          <p>Hadrian provides you with the hacker&apos;s perspective to fortify your cybersecurity posture. Curious to know what they see?</p>
          <a href="/demo" className="btn-primary">
            Get in touch
          </a>
        </div>
      </section>

      {/* ===== 12 Footer ===== */}
      <footer className="footer">
        <div className="footer_top">
          <div className="footer_logo">
            <Logo />
          </div>
          <div className="footer_grid">
            <div className="footer_col">
              <h2>Solutions</h2>
              {FOOTER_SOLUTIONS.map((l, i) => (
                <a key={i} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
            <div className="footer_col">
              <h2>Platform</h2>
              {FOOTER_PLATFORM.map((l, i) => (
                <a key={i} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
            <div className="footer_col">
              <h2>Customers</h2>
              {FOOTER_CUSTOMERS.map((l, i) => (
                <a key={i} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
            <div className="footer_col">
              <h2>Resources</h2>
              {FOOTER_RESOURCES.map((l, i) => (
                <a key={i} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
            <div className="footer_col">
              <h2>Company</h2>
              {FOOTER_COMPANY.map((l, i) => (
                <a key={i} href={l.href}>
                  {l.label}
                </a>
              ))}
              <h2 style={{ marginTop: "24px" }}>Partnership</h2>
              {FOOTER_PARTNERSHIP.map((l, i) => (
                <a key={i} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
            <div className="footer_col">
              <h2>Legal</h2>
              {FOOTER_LEGAL.map((l, i) => (
                <a key={i} href={l.href}>
                  {l.label}
                </a>
              ))}
              <div className="footer_soc">
                <img
                  src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/67b6ef326254b39dc4993c5a_soc-badge-hadrian.svg"
                  alt="SOC 2 Type 2"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer_divider" />
        <div className="footer_meta">
          <div className="footer_meta_copy">© 2026 Hadrian</div>
          <a href="#" aria-label="Back to top">
            <Icon id="ic10" />
          </a>
          <div className="footer_social">
            <a href="https://www.youtube.com/@HadrianSecurity" aria-label="YouTube">
              <Icon id="ic11" />
            </a>
            <a href="https://www.linkedin.com/authwall" aria-label="LinkedIn">
              <Icon id="ic12" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
