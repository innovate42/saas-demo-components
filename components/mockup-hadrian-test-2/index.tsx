import * as React from "react";
import "./index.css";

/* ------------------------------------------------------------------ */
/* Captured inline SVG icons (index.json -> icons[])                   */
/* ------------------------------------------------------------------ */

const IcArrowRight16 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 12L16 16L13.1829 16L16.1721 13L3.99998 13L4 11.0048L16.1721 11.0048L13.1829 8L16 8L20 12Z"
      fill="currentColor"
    />
  </svg>
);

const IcGlobe = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.1215 10.8138C10.6197 11.6989 9.81911 12.3703 8.86918 12.706C9.17985 12.1139 9.41883 11.4791 9.58611 10.8138L9.41882 10.5819L8.73775 9.75178H6.30619C6.25242 9.40386 6.22255 9.04985 6.22255 8.68972C6.22255 8.3296 6.25242 7.97558 6.30619 7.62767H7.17845C6.7005 6.96236 6.43763 6.15056 6.43763 5.33265C6.43763 4.64903 6.61088 3.99593 6.9335 3.42218C4.34063 3.72126 2.33325 5.97355 2.33325 8.68972C2.33325 10.0997 2.88289 11.4486 3.85671 12.4435C4.34063 12.9379 4.91417 13.3286 5.54148 13.5972C6.16878 13.8657 6.84986 14 7.53093 14C8.91101 14 10.2313 13.4385 11.2052 12.4435C12.179 11.4486 12.7286 10.0997 12.7286 8.68972L11.2888 10.5758L11.1275 10.8077L11.1215 10.8138ZM3.50422 9.75178C3.42058 9.40997 3.36681 9.05595 3.36681 8.68972C3.36681 8.3235 3.42058 7.96948 3.50422 7.62767H5.26068C5.21886 7.97558 5.18899 8.3296 5.18899 8.68972C5.18899 9.04985 5.21886 9.40386 5.26068 9.75178H3.50422ZM3.9284 10.8138H5.44589C5.62512 11.4791 5.86409 12.1139 6.17476 12.706C5.23081 12.3703 4.43025 11.6989 3.9284 10.8138ZM5.44589 6.56561H3.9284C4.42427 5.68057 5.22483 5.00305 6.17476 4.67345C5.86409 5.26551 5.63109 5.9003 5.44589 6.56561ZM7.52496 12.9135C7.0948 12.2787 6.74829 11.5707 6.53322 10.8138H8.5167C8.30162 11.5707 7.95511 12.2787 7.52496 12.9135Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.66615 5.50358C8.66615 4.5697 9.42489 3.81283 10.3569 3.81283C11.2889 3.81283 12.0476 4.5697 12.0476 5.50358C12.0476 6.43745 11.2889 7.19432 10.3569 7.19432C9.42489 7.19432 8.66615 6.43745 8.66615 5.50358ZM9.68776 5.50358C9.68776 5.8637 9.98648 6.16278 10.3569 6.16278C10.7273 6.16278 11.026 5.8637 11.026 5.50358C11.026 5.14345 10.7273 4.84437 10.3569 4.84437C9.98648 4.84437 9.68776 5.14345 9.68776 5.50358Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.3568 2.00001C11.241 2.00001 12.0715 2.34792 12.6928 2.97661C13.3201 3.6053 13.6666 4.44151 13.6666 5.33266C13.6666 6.0407 13.4396 6.73653 13.0214 7.30418L10.8109 10.2035H9.8968L7.81176 7.46898C7.79981 7.45677 7.71019 7.3347 7.71019 7.3347C7.28004 6.76094 7.04106 6.05291 7.04106 5.33266C7.04106 4.44151 7.38758 3.6053 8.01488 2.97661C8.64219 2.34792 9.47262 2.00001 10.3568 2.00001ZM10.4883 8.93388L12.1671 6.70601L12.1611 6.69991C12.4598 6.30316 12.6211 5.82096 12.6211 5.32656C12.6211 4.71008 12.3821 4.13633 11.952 3.70296C11.5218 3.26959 10.9483 3.03154 10.3449 3.03154C9.7355 3.03154 9.16793 3.26959 8.73778 3.70296C8.30763 4.13633 8.06865 4.71008 8.06865 5.32656C8.06865 5.82096 8.22996 6.30927 8.52868 6.69991L8.54063 6.71822L8.5705 6.76094L8.67206 6.88912L10.2075 8.93388H10.4883Z"
      fill="currentColor"
    />
  </svg>
);

const IcCaretDown = () => (
  <svg width="7px" height="5px" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1L5 6H3L0 1L1.49012e-06 0H8V1Z" fill="currentColor" />
  </svg>
);

const IcTagPurple = () => (
  <svg width="100%" height="100%" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="12" height="12" rx="2" fill="#CC82FA" />
  </svg>
);

const IcTagGreen = () => (
  <svg width="100%" height="100%" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="12" height="12" rx="2" fill="#73D182" />
  </svg>
);

const IcTagGrey = () => (
  <svg width="100%" height="100%" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="12" height="12" rx="2" fill="#85778F" />
  </svg>
);

const IcArrowRight24 = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 12L16 16L13.1829 16L16.1721 13L3.99998 13L4 11.0048L16.1721 11.0048L13.1829 8L16 8L20 12Z"
      fill="currentColor"
    />
  </svg>
);

const IcArrowLeft25 = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 12.9844L8 8.9844H10.8171L7.82794 11.9844L20 11.9844L20 13.9795L7.82794 13.9795L10.8171 16.9844L8 16.9844L4 12.9844Z"
      fill="currentColor"
    />
  </svg>
);

const IcArrowRight25 = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 12.9843L16 16.9843L13.1829 16.9843L16.1721 13.9844L3.99998 13.9844L4 11.9892L16.1721 11.9892L13.1829 8.98437L16 8.98438L20 12.9843Z"
      fill="currentColor"
    />
  </svg>
);

const IcPlay = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#hdr_clip_play)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.99999 4.57764e-05H3.99999V24H7.99999L24 14V10L7.99999 4.57764e-05Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="hdr_clip_play">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const IcClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    fill="currentColor"
    viewBox="0 0 256 256"
    className="button_icon"
  >
    <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" />
  </svg>
);

const IcArrowUp = () => (
  <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.99997 0L7.99997 4V6.81708L5 3.82794L5 16L3.00485 16L3.00485 3.82794L0 6.81708L1.74846e-07 4L3.99997 0Z"
      fill="currentColor"
    />
  </svg>
);

const IcArrowDown = () => (
  <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 16L2.46277e-07 12L0 9.18293L2.99997 12.1721L2.99997 0L4.99512 1.69917e-05L4.99513 12.1721L7.99997 9.18293V12L4 16Z"
      fill="currentColor"
    />
  </svg>
);

const IcHadrianMark = () => (
  <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.66669 0.984375V9.32278H10.6667V12.6581H5.66669V20.9844H0.666687V17.649H2.33335V4.31974H0.666687V0.984375H5.66669Z"
      fill="#FF003C"
    />
    <path
      d="M12.3334 20.9844H17.3334V17.649H15.6748V4.31974H17.3334V0.984375H12.3334V20.9844Z"
      fill="#FF003C"
    />
  </svg>
);

const IcYoutube = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.0155 3.50781H4.98449C2.23163 3.50781 0 5.73944 0 8.4923V15.5063C0 18.2592 2.23163 20.4908 4.98449 20.4908H19.0155C21.7684 20.4908 24 18.2592 24 15.5063V8.4923C24 5.73944 21.7684 3.50781 19.0155 3.50781ZM15.6445 12.3406L9.08177 15.4706C8.9069 15.554 8.7049 15.4265 8.7049 15.2328V8.77708C8.7049 8.5806 8.91221 8.45326 9.08744 8.54208L15.6502 11.8678C15.8453 11.9666 15.8419 12.2464 15.6445 12.3406Z"
      fill="currentColor"
    />
  </svg>
);

const IcLinkedIn = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#hdr_clip_li)">
      <path
        d="M0 2.70338C0 1.75388 0.789 0.984375 1.7625 0.984375H22.2375C23.211 0.984375 24 1.75388 24 2.70338V23.2654C24 24.2149 23.211 24.9844 22.2375 24.9844H1.7625C0.789 24.9844 0 24.2149 0 23.2654V2.70338ZM7.4145 21.0754V10.2379H3.813V21.0754H7.4145ZM5.6145 8.75738C6.87 8.75738 7.6515 7.92637 7.6515 6.88538C7.629 5.82187 6.8715 5.01338 5.6385 5.01338C4.4055 5.01338 3.6 5.82337 3.6 6.88538C3.6 7.92637 4.3815 8.75738 5.5905 8.75738H5.6145ZM12.9765 21.0754V15.0229C12.9765 14.6989 13.0005 14.3749 13.0965 14.1439C13.356 13.4974 13.9485 12.8269 14.9445 12.8269C16.248 12.8269 16.7685 13.8199 16.7685 15.2779V21.0754H20.37V14.8594C20.37 11.5294 18.594 9.98138 16.224 9.98138C14.313 9.98138 13.4565 11.0314 12.9765 11.7709V11.8084H12.9525L12.9765 11.7709V10.2379H9.3765C9.4215 11.2549 9.3765 21.0754 9.3765 21.0754H12.9765Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="hdr_clip_li">
        <rect width="24" height="24" fill="white" transform="translate(0 0.984375)" />
      </clipPath>
    </defs>
  </svg>
);

/* Brand logo (index.json -> logoSvg) */
const HadrianLogo = () => (
  <svg width="122" height="20" viewBox="0 0 122 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24.5582 15.9708L23.1552 20H19.5807L26.8518 4.45783e-05H30.8045L38.0512 20H34.5011L33.0981 15.9708H24.5582ZM32.0123 12.8911L28.8282 3.85884L25.644 12.8911H32.0123Z"
      fill="#FF003C"
    />
    <path
      d="M58.3639 9.99396C58.3639 15.5691 54.2892 20 48.7627 20H40.8938V4.45783e-05H48.7627C54.2892 4.45783e-05 58.3639 4.39445 58.3639 9.99396ZM55.1798 9.99396C55.1798 6.02561 52.569 3.14064 48.7627 3.14064H44.1877V16.8595H48.7627C52.569 16.8595 55.1798 13.938 55.1798 9.99396Z"
      fill="#FF003C"
    />
    <path
      d="M68.441 12.7085H64.537V20H61.2431V4.64647e-05H69.2706C70.1174 -0.0031724 70.9564 0.16088 71.7394 0.482741C72.5224 0.804601 73.2338 1.27791 73.8326 1.87537C74.4314 2.47284 74.9057 3.18266 75.2283 3.96391C75.5509 4.74515 75.7153 5.58237 75.7121 6.42731C75.7121 8.99578 74.0773 11.2843 71.7349 12.2338L76.2854 20H72.6743L68.441 12.7085ZM64.537 9.77485H69.2706C71.0151 9.77485 72.4181 8.28976 72.4181 6.42731C72.4181 4.56487 71.0151 3.07978 69.2706 3.07978H64.537V9.77485Z"
      fill="#FF003C"
    />
    <path
      d="M90.303 15.9708L88.9 20H85.3255L92.5966 4.45783e-05H96.5493L103.796 20H100.246L98.8429 15.9708H90.303ZM97.7571 12.8911L94.573 3.85884L91.3888 12.8911H97.7571Z"
      fill="#FF003C"
    />
    <path
      d="M121.998 4.45783e-05V20H119.424L109.969 6.42731V20H106.675V4.45783e-05H109.262L118.704 13.5728V4.45783e-05H121.998Z"
      fill="#FF003C"
    />
    <path d="M82.4585 4.60643e-05H79.1158V20.0049H82.4585V4.60643e-05Z" fill="#FF003C" />
    <path
      d="M16.7376 20H11.7163V4.60643e-05H16.7376V3.33541H15.072V16.6647H16.7376V20Z"
      fill="#FF003C"
    />
    <path
      d="M5.02127 8.33845V4.60643e-05H0V3.33541H1.67376V16.6647H0V20H5.02127V11.6738H10.0425V8.33845H5.02127Z"
      fill="#FF003C"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const MARQUEE_LOGO =
  "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/69a82112c2616576cde7e545_Breeze_Airways-logo.webp";

const MARQUEE_COUNT = 25;

type Solution = {
  href: string;
  img: string;
  title: string;
};

const SOLUTIONS: Solution[] = [
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

type Story = {
  cover: string;
  logo: string;
  quote: string;
  name: string;
  role: string;
  active?: boolean;
};

const STORIES: Story[] = [
  {
    cover:
      "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6945745822d2dda064d5634e_video169.webp",
    logo: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/6a0ae3c1692a49b2190d588b_Damen_logo%201.svg",
    quote: "Hadrian enables us to pinpoint the real security issues that we should be working on.",
    name: "Hans Quivooij",
    role: "CISO",
    active: true,
  },
  {
    cover:
      "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/674eb2e106b0c29f43a28530_Danny%201920%20x%201080.avif",
    logo: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/671fb513623f3f41c24b208e_Logo_LBS.svg",
    quote: "Event-driving testing saved time and energy with tests that leveraged insight",
    name: "Danny Attias",
    role: "LBS Chief Digital & Information Officer",
  },
  {
    cover:
      "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/674eb312b97bc71bd71f0028_Mahdi%20Abdulrazak.avif",
    logo: "https://cdn.prod.website-files.com/671fb08c85a0ca2b95fe78eb/671fb3fe8a9cb9193051b1ab_Logo_SHVEnergy.svg",
    quote: "It's not often that you find a tool that homes in on the risks that truly matter",
    name: "Mahdi Abdulrazak",
    role: "Group Information Security & Risk Officer",
  },
];

type Article = {
  href: string;
  img: string;
  tag: string;
  title: string;
};

const ARTICLES: Article[] = [
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
  label: "Agentic Penetration Testing",
  href: "/solutions/agentic-penetration-testing",
}));

const FOOTER_PLATFORM = Array.from({ length: 7 }, () => ({
  label: "Technology",
  href: "/technology",
}));

const FOOTER_CUSTOMERS = Array.from({ length: 13 }, () => ({
  label: "Worldstream",
  href: "/case-study/how-worldstream-operationalized-continuous-exposure-management-across-a-critical-infrastructure-environment",
}));

const FOOTER_RESOURCES = Array.from({ length: 6 }, () => ({
  label: "Blog",
  href: "/blog",
}));

const FOOTER_LEGAL = Array.from({ length: 5 }, () => ({
  label: "EULA",
  href: "https://hadrian.io/terms-conditions/general",
}));

/* ------------------------------------------------------------------ */
/* Reusable pieces                                                     */
/* ------------------------------------------------------------------ */

const GridItem: React.FC<{
  wide?: boolean;
  title: string;
  body: string;
  img: string;
  wideBody?: boolean;
}> = ({ wide, title, body, img, wideBody }) => (
  <div className={"hdr-grid_item" + (wide ? " is-wide" : "")}>
    <div className="hdr-grid_text-wrapper">
      <div className="hdr-margin-small">
        <h4 className="hdr-h4-dark">{title}</h4>
      </div>
      {wideBody ? (
        <div className="hdr-max-width-custom3">
          <p className="hdr-text-body-lg hdr-text-subdued-dark">{body}</p>
        </div>
      ) : (
        <p className="hdr-text-body-lg hdr-text-subdued-dark" style={{ maxWidth: 524 }}>
          {body}
        </p>
      )}
    </div>
    <div className="hdr-grid_image-wrapper">
      <img className="hdr-grid_image" src={img} alt="" loading="lazy" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const ComponentMockupHadrian: React.FC = () => {
  return (
    <div className="hdr-root">
      {/* ============ 00 header ============ */}
      <div className="hdr-navbar">
        <div className="hdr-nav-banner_wrap">
          <div className="hdr-nav-banner_container">
            <div className="hdr-announcement_outer-wrap">
              <p className="hdr-mono hdr-nova-tag">NOVA</p>
              <div className="hdr-announcement_item">
                <p className="hdr-announcement_text">
                  Upgrade your manual pentest with agentic-powered testing
                </p>
                <a
                  className="hdr-announcement_text-link hdr-mono"
                  href="https://hadrian.io/nova-request"
                >
                  <div className="hdr-u-weight-medium">Request an agentic pentest</div>
                  <div className="hdr-icon-16">
                    <IcArrowRight16 />
                  </div>
                </a>
              </div>
            </div>
            <div className="hdr-nav-banner-menu_wrap hdr-mono">
              <div className="hdr-nav-locale-switch_button">
                <div className="hdr-icon-16">
                  <IcGlobe />
                </div>
                <div>English</div>
                <div className="hdr-dropdown_icon-wrapper">
                  <IcCaretDown />
                </div>
              </div>
              <a className="hdr-nav-banner_link" href="/contact">
                <div>Contact</div>
              </a>
              <a className="hdr-nav-banner_link" href="https://app.hadrian.io/">
                <div>Login</div>
              </a>
            </div>
          </div>
        </div>

        <div className="hdr-navbar_container">
          <div className="hdr-navbar_menu-wrapper">
            <a className="hdr-navbar_logo-link" href="/">
              <div className="hdr-navbar_logo">
                <HadrianLogo />
              </div>
            </a>
          </div>

          <nav className="hdr-navbar_menu">
            <div className="hdr-navbar_menu-links">
              <div className="hdr-navbar_dropdown-toggle">
                <div>Products</div>
                <div className="hdr-dropdown_icon-wrapper">
                  <IcCaretDown />
                </div>
              </div>
              <div className="hdr-navbar_dropdown-toggle">
                <div>Solutions</div>
                <div className="hdr-dropdown_icon-wrapper">
                  <IcCaretDown />
                </div>
              </div>
              <div className="hdr-navbar_dropdown-toggle">
                <div>Platform</div>
                <div className="hdr-dropdown_icon-wrapper">
                  <IcCaretDown />
                </div>
              </div>
              <a className="hdr-navbar_link" href="/pricing">
                <div>Pricing</div>
              </a>
              <div className="hdr-navbar_dropdown-toggle">
                <div>Resources</div>
                <div className="hdr-dropdown_icon-wrapper">
                  <IcCaretDown />
                </div>
              </div>
              <div className="hdr-navbar_dropdown-toggle">
                <div>About</div>
                <div className="hdr-dropdown_icon-wrapper">
                  <IcCaretDown />
                </div>
              </div>
            </div>
          </nav>

          <div className="hdr-header-buttons">
            <a className="hdr-btn-secondary-sm" href="/external-security-report">
              Get a free scan
            </a>
            <a className="hdr-btn-primary-sm" href="/demo">
              <div>Book a demo</div>
            </a>
          </div>
        </div>
      </div>

      {/* ============ 01 hero ============ */}
      <section className="hdr-section_heading" id="section_heading">
        <div className="hdr-padding-global hdr-padding-section-large">
          <div className="hdr-container-large">
            <div className="hdr-hero_wrapper">
              <h1 className="hdr-heading-h1">
                <a href="#">The AI that hacks you should be working for you.</a>
              </h1>
              <div className="hdr-max-width-medium">
                <p className="hdr-text-body-lead">
                  Hadrian&rsquo;s autonomous AI continuously discovers exposures, validates what
                  attackers can exploit, and delivers pentest-level insights.
                </p>
              </div>
              <div className="hdr-button-group">
                <a className="hdr-btn-primary" href="/contact">
                  <div>Get in touch</div>
                </a>
                <a className="hdr-btn-secondary" href="/nova-request">
                  Request an agentic pentest
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 media ============ */}
      <section className="hdr-section_media" id="section_media">
        <div className="hdr-padding-global">
          <div className="hdr-container-large">
            <div className="hdr-home_lottie">
              <div className="hdr-lottie_grid" />
              <div className="hdr-lottie_ring r4" />
              <div className="hdr-lottie_ring r3" />
              <div className="hdr-lottie_ring r2" />
              <div className="hdr-lottie_ring r1" />
              <div className="hdr-lottie_core">
                <IcHadrianMark />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 03 marquee ============ */}
      <section className="hdr-section_marquee">
        <div className="hdr-padding-section-medium">
          <div className="hdr-marquee">
            <div className="hdr-marquee_list-wrapper">
              <div className="hdr-marquee_list">
                {Array.from({ length: MARQUEE_COUNT }).map((_, i) => (
                  <div className="hdr-marquee_item" key={"m1-" + i}>
                    <img className="hdr-marquee_logo" src={MARQUEE_LOGO} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
            <div className="hdr-marquee_list-wrapper">
              <div className="hdr-marquee_list">
                {Array.from({ length: MARQUEE_COUNT }).map((_, i) => (
                  <div className="hdr-marquee_item" key={"m2-" + i}>
                    <img className="hdr-marquee_logo" src={MARQUEE_LOGO} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 04 continuous asset discovery ============ */}
      <section className="hdr-section_grid-band">
        <div className="hdr-pointer-events-none">
          <img
            className="hdr-image-background"
            src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/6722154d26c58b11a9812a9c_132bc4d789b2fc0b94a50c4a46c19504_background-glow-pink.webp"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="hdr-padding-global hdr-padding-section-large hdr-z-index-3">
          <div className="hdr-container-large">
            <div className="hdr-margin-xxlarge">
              <div className="hdr-section_heading-title">
                <div className="hdr-text-tag_wrapper">
                  <div className="hdr-text-tag_icon">
                    <IcTagPurple />
                  </div>
                  <div className="hdr-text-tag hdr-mono">discover</div>
                </div>
                <h2 className="hdr-h2-dark">Continuous Asset Discovery</h2>
              </div>
            </div>
            <div className="hdr-asset-discovery_grid">
              <GridItem
                wide
                wideBody
                title="Automate discovery"
                body={"Reduce workload, Hadrian’s automated asset inventory saves customers over 10 hours per week on average."}
                img="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/6750819dedd8bdaa6e17ef3e_2.1%20Home%20-%20Discovery%20-%20Automate%20Discovery.avif"
              />
              <GridItem
                title="Enrich assets"
                body="Enrich your understanding of every asset with real-time reconnaissance and contextualization."
                img="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/675081a6ddd5664bcab3b848_2.2%20Home%20-%20Discovery%20-%20Enrich%20assets.avif"
              />
              <GridItem
                title="Gain visibility"
                body="Gain the most complete visibility of all of your exposed assets and reveal how they are interconnected."
                img="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/67520e2f1f62646d3bbaea3e_2.3%20Home%20-%20Discovery%20-%20Gain%20Visibility.avif"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 05 streamlined exposure management ============ */}
      <section className="hdr-section_grid-band">
        <div className="hdr-pointer-events-none">
          <img
            className="hdr-image-background"
            src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/672216017c8f96e04a829717_4d720b9d0bcf534b3f0e617df2d33456_background-glow-green.webp"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="hdr-padding-global hdr-padding-section-large hdr-z-index-3">
          <div className="hdr-container-large">
            <div className="hdr-margin-xxlarge">
              <div className="hdr-section_heading-title">
                <div className="hdr-text-tag_wrapper">
                  <div className="hdr-text-tag_icon">
                    <IcTagGreen />
                  </div>
                  <div className="hdr-text-tag hdr-mono">secure</div>
                </div>
                <h2 className="hdr-h2-dark">Streamlined Exposure Management</h2>
              </div>
            </div>
            <div className="hdr-asset-discovery_grid">
              <GridItem
                wide
                wideBody
                title="Shorten Mean Time to Remediate"
                body="Reduce MTTR by 80% with streamlined workflows and step-by-step remediation recommendations."
                img="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/67508294e372ce772e703ca6_4.1%20Home%20-%20Secure%20-%20Shorten%20Mean%20Time%20to%20Remediate.avif"
              />
              <GridItem
                title="Contextualize"
                body="Prioritize the highest-impact risks with complete context including exploitability, business importance, and threat intel."
                img="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/6a44ebcbb97d50cc14927d61_Contextualize.webp"
              />
              <GridItem
                title="Drive remediation"
                body="Track risks from discovery to resolution and share information with 3rd party remediators with built-in collaboration tools."
                img="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/675223c33561ee0902bb326c_4.3%20Home%20-%20Secure%20-%20Drive%20remediation.avif"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 06 technology ============ */}
      <section className="hdr-section_technology">
        <div className="hdr-technology_background-video" />
        <div className="hdr-padding-global hdr-padding-section-large hdr-z-index-3">
          <div className="hdr-container-large">
            <div className="hdr-grid_technology">
              <div className="hdr-max-width-custom1">
                <div className="hdr-section_heading-title">
                  <div className="hdr-text-tag_wrapper">
                    <div className="hdr-text-tag_icon">
                      <IcTagGrey />
                    </div>
                    <div className="hdr-text-tag hdr-mono">Technology</div>
                  </div>
                  <h2 className="hdr-h2-dark">
                    AI-driven.
                    <br />
                    <span className="hdr-break-line">Battle-tested.</span>
                  </h2>
                  <div className="hdr-margin-small">
                    <p className="hdr-text-subdued-dark">
                      Our agentic AI platform is trained by elite hackers, trusted by enterprise
                      security teams, and continuously improved by machine learning. Hadrian
                      combines technical depth with automation speed so you can act faster and
                      smarter.
                    </p>
                  </div>
                  <div className="hdr-button-group-wrap">
                    <a className="hdr-btn-secondary" href="/technology">
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
              <div />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 07 scalable solutions ============ */}
      <section className="hdr-section-light">
        <div className="hdr-padding-global hdr-padding-section-large">
          <div className="hdr-container-large">
            <div className="hdr-margin-xxlarge">
              <div className="hdr-section_title-wrapper">
                <h2 className="hdr-h2-light">Scalable solutions</h2>
                <a className="hdr-btn-third" href="/platform">
                  All solutions
                </a>
              </div>
            </div>
            <div className="hdr-solutions_list-wrapper">
              <div className="hdr-solutions_list">
                {SOLUTIONS.map((s, i) => (
                  <div className="hdr-solutions_item" key={"sol-" + i}>
                    <a className="hdr-solutions_item-wrapper" href={s.href}>
                      <div className="hdr-solutions_background-gradient" />
                      <div className="hdr-solutions_image-wrapper">
                        <img className="hdr-solutions_image" src={s.img} alt="" loading="lazy" />
                      </div>
                      <div className="hdr-solutions_text-wrapper">
                        <div className="hdr-margin-small">
                          <h5 className="hdr-h5-dark">{s.title}</h5>
                        </div>
                        <div className="hdr-view-solution">
                          <div className="hdr-text-weight-medium">View solution</div>
                          <div className="hdr-arrow-24">
                            <IcArrowRight24 />
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="hdr-margin-custom2">
              <div className="hdr-slider_arrows-wrapper">
                <div className="hdr-arrow-button is-disabled">
                  <IcArrowLeft25 />
                </div>
                <div className="hdr-arrow-button">
                  <IcArrowRight25 />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 08 trusted by SOC teams globally ============ */}
      <section className="hdr-case-study-slider_wrap">
        <div className="hdr-case-study-top-pad" />
        <div className="hdr-u-container">
          <div className="hdr-case-study-slider_header">
            <h2 className="hdr-h2-on-dark">Trusted by SOC teams globally</h2>
            <a className="hdr-button_wrap-light" href="https://hadrian.io/resources?tag=case+study">
              <div className="hdr-button_label">All case studies</div>
            </a>
          </div>

          <div className="hdr-slider-main_component">
            <div className="hdr-slider-wrap">
              {STORIES.filter((s) => s.active).map((s, i) => (
                <div className="hdr-slide_item" key={"story-" + i}>
                  <div className="hdr-slider_video">
                    <img className="hdr-video-pro_cover" src={s.cover} alt="" loading="lazy" />
                    <button className="hdr-play-button_wrap" type="button" aria-label="Play">
                      <span style={{ width: 24, height: 24, display: "flex" }}>
                        <IcPlay />
                      </span>
                    </button>
                    <span style={{ display: "none" }}>
                      <IcClose />
                    </span>
                  </div>
                  <div className="hdr-slider-content">
                    <img src={s.logo} alt="" loading="lazy" />
                    <p className="hdr-stories_quote">
                      <span>&ldquo;</span>
                      <span>{s.quote}</span>
                      <span>&rdquo;</span>
                    </p>
                    <div>
                      <p className="hdr-text-body-lg" style={{ color: "#fdfcfe" }}>
                        {s.name}
                      </p>
                      <p className="hdr-text-body-lg hdr-text-subdued-dark">{s.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hdr-swiper-bottom">
              <div className="hdr-swiper-bullet-wrapper">
                <div className="hdr-swiper-bullet is-active" />
                <div className="hdr-swiper-bullet" />
                <div className="hdr-swiper-bullet" />
              </div>
              <div className="hdr-slider-main_button-wrapper">
                <div className="hdr-stories_pagination-wrapper hdr-mono">
                  <div className="hdr-slider-number">01</div>
                  <div className="hdr-text-number-lg">/</div>
                  <div className="hdr-slider-number">03</div>
                </div>
                <div className="hdr-arrow-button-dark is-disabled">
                  <IcArrowUp />
                </div>
                <div className="hdr-arrow-button-dark">
                  <IcArrowDown />
                </div>
              </div>
            </div>

            <div className="hdr-swiper-drag-wrapper">
              <div className="hdr-swiper-drag" />
            </div>
          </div>
        </div>
        <div className="hdr-case-study-top-pad" />
      </section>

      {/* ============ 09 leading the pack ============ */}
      <section className="hdr-section-light">
        <div className="hdr-padding-global hdr-padding-section-large">
          <div className="hdr-container-large">
            <div className="hdr-feature_component">
              <div className="hdr-feature_content-wrapper">
                <div className="hdr-margin-medium">
                  <h2 className="hdr-h2-light">Leading the pack</h2>
                </div>
                <div className="hdr-max-width-custom">
                  <p className="hdr-text-body-lg hdr-text-subdued-light">
                    Hadrian is at the frontier of agentic AI-driven offensive security with
                    recognition in Gartner&reg; Market Guide for Adversarial Exposure Validation.
                    Hadrian has also been recognized as a Leader in the GigaOm Radar Report for the
                    second year in a row, and received Frost &amp; Sullivan&rsquo;s New Product
                    Innovation award.
                  </p>
                </div>
                <div className="hdr-spacer-custom2" />
                <div className="hdr-button-holder">
                  <a
                    className="hdr-btn-primary"
                    href="https://hadrian.io/resources/2026-gartner-r-market-guide-for-adversarial-exposure-validation"
                  >
                    <div>Read Gartner Report</div>
                  </a>
                </div>
              </div>
              <div className="hdr-feature_image-wrapper">
                <img
                  className="hdr-feature_image"
                  src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/69e0ca7a490a78fbb3948b39_logos-leading-the-pack.webp"
                  alt=""
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 10 sharpen your offensive security strategy ============ */}
      <section className="hdr-section-light">
        <div className="hdr-padding-global hdr-padding-section-large">
          <div className="hdr-container-large">
            <div className="hdr-margin-xxlarge">
              <div className="hdr-section_title-wrapper">
                <h2 className="hdr-h2-light">Sharpen your offensive security strategy</h2>
                <a className="hdr-btn-third" href="/resources">
                  All resources
                </a>
              </div>
            </div>
            <div className="hdr-articles_list">
              {ARTICLES.map((a, i) => (
                <div key={"art-" + i}>
                  <a className="hdr-articles_link" href={a.href}>
                    <div className="hdr-articles_image-wrapper">
                      <img className="hdr-articles_image" src={a.img} alt="" loading="lazy" />
                    </div>
                    <div className="hdr-articles_text-wrapper">
                      <h3 className="hdr-articles_tag hdr-mono">{a.tag}</h3>
                      <div className="hdr-articles_text">
                        <h4 className="hdr-h4-light">{a.title}</h4>
                        <div className="hdr-read-more">
                          <div className="hdr-text-weight-medium">Read more</div>
                          <div className="hdr-arrow-24">
                            <IcArrowRight24 />
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 11 CTA ============ */}
      <section className="hdr-section_cta">
        <div className="hdr-cta_background" />
        <div className="hdr-padding-global hdr-padding-section-large hdr-z-index-3">
          <div className="hdr-container-large">
            <div className="hdr-cta_text-wrapper">
              <h2 className="hdr-h2-dark">Take the first step in the shoes of your adversary</h2>
              <div className="hdr-max-width-large">
                <div className="hdr-margin-custom1">
                  <p className="hdr-text-body-lg hdr-text-subdued-dark">
                    Hadrian provides you with the hacker&rsquo;s perspective to fortify your
                    cybersecurity posture. Curious to know what they see?
                  </p>
                </div>
              </div>
              <a className="hdr-btn-primary" href="/demo">
                <div>Get in touch</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 12 footer ============ */}
      <footer className="hdr-footer_wrap">
        <div className="hdr-footer-top-pad" />
        <div className="hdr-u-container">
          <div className="hdr-footer_layout">
            <div className="hdr-navbar_menu-wrapper">
              <a className="hdr-navbar_logo-link" href="/">
                <div className="hdr-navbar_logo">
                  <HadrianLogo />
                </div>
              </a>
            </div>

            <div className="hdr-footer-col_wrap">
              <div className="hdr-footer_col">
                <h2 className="hdr-footer_heading">Solutions</h2>
                <div className="hdr-footer_menu">
                  {FOOTER_SOLUTIONS.map((l, i) => (
                    <a className="hdr-footer_link" href={l.href} key={"fs-" + i}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hdr-footer_col">
                <h2 className="hdr-footer_heading">Platform</h2>
                <div className="hdr-footer_menu">
                  {FOOTER_PLATFORM.map((l, i) => (
                    <a className="hdr-footer_link" href={l.href} key={"fp-" + i}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="hdr-footer-col_wrap">
              <div className="hdr-footer_col">
                <h2 className="hdr-footer_heading">Customers</h2>
                <div className="hdr-footer_menu">
                  {FOOTER_CUSTOMERS.map((l, i) => (
                    <a className="hdr-footer_link" href={l.href} key={"fc-" + i}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hdr-footer_col">
                <h2 className="hdr-footer_heading">Resources</h2>
                <div className="hdr-footer_menu">
                  {FOOTER_RESOURCES.map((l, i) => (
                    <a className="hdr-footer_link" href={l.href} key={"fr-" + i}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="hdr-footer-col_wrap">
              <div className="hdr-footer_col">
                <h2 className="hdr-footer_heading">Company</h2>
                <div className="hdr-footer_menu">
                  <a className="hdr-footer_link" href="/company">
                    About us
                  </a>
                  <a className="hdr-footer_link" href="https://careers.hadrian.io/">
                    Careers
                  </a>
                  <a className="hdr-footer_link" href="/events">
                    Events
                  </a>
                </div>
              </div>
              <div className="hdr-footer_col">
                <h2 className="hdr-footer_heading">Partnership</h2>
                <div className="hdr-footer_menu">
                  <a className="hdr-footer_link" href="/partnerships">
                    Become a partner
                  </a>
                  <a className="hdr-footer_link" href="https://hadrian.amp.vg/wp/signup">
                    Partner login
                  </a>
                </div>
              </div>
              <div className="hdr-footer_col">
                <h2 className="hdr-footer_heading">Legal</h2>
                <div className="hdr-footer_menu">
                  {FOOTER_LEGAL.map((l, i) => (
                    <a className="hdr-footer_link" href={l.href} key={"fl-" + i}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hdr-footer_col is-multi">
                <div className="hdr-footer_logo-container">
                  <img
                    className="hdr-footer_soc-logo"
                    src="https://cdn.prod.website-files.com/671f51f53919b178d92e1c77/67b6ef326254b39dc4993c5a_soc-badge-hadrian.svg"
                    alt="SOC 2 Type 2"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hdr-footer-mid-pad" />
        <div className="hdr-footer_divider" />
        <div className="hdr-u-container">
          <div className="hdr-footer-bottom-pad" />
          <div className="hdr-footer_meta-layout">
            <div>
              <div className="hdr-text-body-md">&copy; 2026 Hadrian</div>
            </div>
            <a className="hdr-footer_logo-mark" href="#section_heading">
              <IcHadrianMark />
            </a>
            <div className="hdr-footer_social-link-wrapper">
              <a
                className="hdr-footer_social-link"
                href="https://www.youtube.com/@HadrianSecurity"
                aria-label="YouTube"
              >
                <IcYoutube />
              </a>
              <a
                className="hdr-footer_social-link"
                href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQGO9oGyQZ-hbAAAAZLjAiqYVQb1R9swLPoZWbEfKOMUZ6WpjOQLaY-_LHv-cJ3rDburoku"
                aria-label="LinkedIn"
              >
                <IcLinkedIn />
              </a>
            </div>
          </div>
          <div className="hdr-footer-bottom-pad" />
        </div>
      </footer>
    </div>
  );
};

export default ComponentMockupHadrian;
