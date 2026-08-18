import React from "react";
import "./index.css";

/* ------------------------------------------------------------------ */
/* Captured inline SVG icons                                           */
/* ------------------------------------------------------------------ */

const IcCaretRight = () => (
  <svg className="svg-icon" viewBox="0 0 20 20">
    <path
      fill="none"
      d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"
    />
  </svg>
);

const IcCaretLeft = () => (
  <svg className="svg-icon" viewBox="0 0 20 20">
    <path
      fill="none"
      d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"
    />
  </svg>
);

const IcAvatar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="#111111" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.37032 13.1999L11.244 13.1883C11.5927 13.1883 11.925 13.0247 12.1451 12.7435C12.365 12.4627 12.4485 12.0947 12.3724 11.7427V11.7419C11.9016 9.60071 10.0346 7.99995 7.80581 7.99995C5.57809 7.99995 3.71153 9.59957 3.22827 11.7364L3.22793 11.7383C3.1507 12.0956 3.23533 12.4675 3.45763 12.7511C3.67966 13.0351 4.01549 13.2 4.37048 13.2L4.37032 13.1999ZM7.82442 2.79996C6.51339 2.79996 5.44917 3.89156 5.44917 5.23583C5.44917 6.58018 6.51335 7.67147 7.82442 7.67147C9.13549 7.67147 10.1999 6.58023 10.1999 5.23583C10.1999 3.89147 9.13535 2.79996 7.82442 2.79996Z"
      fill="white"
    />
  </svg>
);

const IcSparkle = () => (
  <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_552_110)">
      <path
        d="M23.0349 10.1934L24.4781 6.72817L27.872 5.05502L24.3671 3.62768L22.6781 0.273438L21.2349 3.73869L17.841 5.41185L21.3459 6.83919L23.0349 10.1934ZM13.6462 11.1529L10.2682 4.44443L7.37384 11.3749L0.593994 14.7213L7.6038 17.5759L10.9818 24.2844L13.8762 17.3539L20.6639 14.0076L13.6541 11.1529H13.6462ZM23.2966 17.6314L21.8534 21.0967L18.4595 22.7698L21.9644 24.1972L23.6534 27.5514L25.0966 24.0862L28.4905 22.413L24.9856 20.9857L23.2966 17.6314Z"
        fill="#F200FF"
      />
    </g>
    <defs>
      <clipPath id="clip0_552_110">
        <rect
          width="27.8965"
          height="27.2859"
          fill="white"
          transform="translate(0.593994 0.273438)"
        />
      </clipPath>
    </defs>
  </svg>
);

const IcArrowDark = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2L5.295 2.705L8.085 5.5H2V6.5H8.085L5.295 9.295L6 10L10 6L6 2Z" fill="#111111" />
  </svg>
);

const IcArrowCircleWhite = () => (
  <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.726318" y="0.978943" width="33.2" height="33.2" rx="16.6" fill="#ffffff" />
    <path
      d="M17.3261 10.5895L16.0942 11.8214L20.9694 16.7053H10.3367V18.4526H20.9694L16.0942 23.3365L17.3261 24.5684L24.3156 17.579L17.3261 10.5895Z"
      fill="#072CD7"
    />
  </svg>
);

const IcArrowWhiteSmall = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2L5.295 2.705L8.085 5.5H2V6.5H8.085L5.295 9.295L6 10L10 6L6 2Z" fill="#FFFFFF" />
  </svg>
);

const IcCompanyCamMark = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50.66 3.5H149.34C175.386 3.5 196.5 24.6143 196.5 50.66V149.34C196.5 175.386 175.386 196.5 149.34 196.5H50.66C24.6143 196.5 3.5 175.386 3.5 149.34V50.66C3.5 24.6143 24.6143 3.5 50.66 3.5Z"
      stroke="white"
      strokeWidth="7"
    />
    <path
      d="M66.6949 147.64H44.3949C43.1872 147.637 42.0299 147.156 41.1769 146.301C40.3239 145.446 39.8449 144.288 39.8449 143.08V108.74C39.8422 107.8 39.4671 106.9 38.8016 106.236C38.1361 105.573 37.2347 105.2 36.2949 105.2C35.3568 105.203 34.458 105.576 33.7946 106.24C33.1313 106.903 32.7575 107.802 32.7549 108.74V143.08C32.7575 146.166 33.9847 149.125 36.1671 151.308C38.3494 153.49 41.3086 154.717 44.3949 154.72H66.6949V147.64Z"
      fill="white"
    />
    <path
      d="M163.795 88.27H159.795V95.36H160.305V143.08C160.302 144.289 159.821 145.447 158.966 146.302C158.112 147.156 156.954 147.637 155.745 147.64H133.365V154.72H155.745C158.831 154.717 161.79 153.49 163.973 151.308C166.155 149.125 167.382 146.166 167.385 143.08V91.81C167.385 91.3409 167.292 90.8765 167.111 90.4437C166.93 90.0109 166.665 89.6184 166.331 89.289C165.997 88.9596 165.6 88.6999 165.165 88.525C164.73 88.3501 164.264 88.2634 163.795 88.27V88.27Z"
      fill="white"
    />
    <path
      d="M99.795 120.25C97.1383 120.254 94.5068 119.735 92.0513 118.72C89.5958 117.706 87.3644 116.218 85.485 114.34C81.6953 110.542 79.5669 105.395 79.5669 100.03C79.5669 94.6645 81.6953 89.5182 85.485 85.72C89.2832 81.9303 94.4295 79.8019 99.795 79.8019C105.16 79.8019 110.307 81.9303 114.105 85.72C114.764 86.3849 115.135 87.2835 115.135 88.22C115.135 89.1565 114.764 90.0551 114.105 90.72C113.44 91.3795 112.541 91.7496 111.605 91.7496C110.668 91.7496 109.77 91.3795 109.105 90.72C106.637 88.2554 103.293 86.8711 99.805 86.8711C96.3174 86.8711 92.9725 88.2554 90.505 90.72C88.0404 93.1875 86.656 96.5324 86.656 100.02C86.656 103.508 88.0404 106.852 90.505 109.32C92.9751 111.78 96.3191 113.161 99.805 113.161C103.291 113.161 106.635 111.78 109.105 109.32C109.433 108.991 109.823 108.73 110.252 108.552C110.681 108.374 111.14 108.282 111.605 108.282C112.069 108.282 112.529 108.374 112.958 108.552C113.387 108.73 113.777 108.991 114.105 109.32C114.764 109.985 115.135 110.883 115.135 111.82C115.135 112.757 114.764 113.655 114.105 114.32C112.227 116.201 109.997 117.694 107.541 118.711C105.085 119.729 102.453 120.252 99.795 120.25Z"
      fill="white"
    />
    <path
      d="M100.035 163.79C99.4598 163.789 98.8936 163.648 98.385 163.38C97.8763 163.112 97.4405 162.724 97.1149 162.25L69.4849 121.97C64.7901 115.133 62.5287 106.916 63.0637 98.6396C63.5986 90.3629 66.899 82.506 72.4349 76.33C75.9091 72.4466 80.1625 69.3389 84.918 67.2093C89.6735 65.0797 94.8243 63.9759 100.035 63.97C105.243 63.9679 110.392 65.0651 115.146 67.1898C119.901 69.3145 124.153 72.4189 127.625 76.3C133.168 82.4702 136.478 90.3241 137.022 98.6009C137.566 106.878 135.313 115.097 130.625 121.94L102.995 162.25C102.666 162.73 102.223 163.121 101.707 163.389C101.191 163.658 100.617 163.796 100.035 163.79V163.79ZM100.035 71.05C95.8208 71.0557 91.6553 71.9492 87.8095 73.6722C83.9638 75.3951 80.5242 77.909 77.7149 81.05C73.2295 86.0421 70.5547 92.3986 70.1212 99.096C69.6876 105.793 71.5206 112.441 75.3249 117.97L100.035 153.97L124.735 117.97C128.54 112.444 130.374 105.798 129.942 99.102C129.511 92.407 126.838 86.0517 122.355 81.06C119.547 77.9172 116.107 75.4014 112.262 73.6767C108.416 71.952 104.25 71.0569 100.035 71.05Z"
      fill="white"
    />
    <path
      d="M155.695 54.07H133.915C133.039 54.0679 132.182 53.8142 131.447 53.3391C130.711 52.864 130.127 52.1874 129.765 51.39L125.975 42.98C125.05 40.9406 123.558 39.2104 121.677 37.9958C119.795 36.7812 117.604 36.1335 115.365 36.13H84.5549C82.3492 36.1352 80.19 36.7642 78.3267 37.9445C76.4634 39.1247 74.972 40.808 74.0249 42.8L69.9449 51.46C69.5747 52.2397 68.9913 52.8986 68.2622 53.3605C67.533 53.8224 66.688 54.0684 65.8249 54.07H44.3749C41.2894 54.0753 38.3318 55.3033 36.15 57.4851C33.9682 59.6669 32.7402 62.6245 32.7349 65.71V91.81C32.7336 92.2757 32.8242 92.7371 33.0015 93.1678C33.1788 93.5984 33.4393 93.9899 33.7682 94.3196C34.097 94.6494 34.4877 94.911 34.9179 95.0896C35.348 95.2681 35.8092 95.36 36.2749 95.36H40.8149V88.27H39.8149V65.71C39.8175 64.5023 40.2991 63.3451 41.154 62.4921C42.0089 61.6391 43.1672 61.16 44.3749 61.16H65.8249C68.0304 61.1545 70.1893 60.524 72.0512 59.3417C73.9131 58.1595 75.4018 56.4738 76.3449 54.48L80.4349 45.83C80.8027 45.0477 81.3852 44.386 82.1147 43.9221C82.8442 43.4582 83.6904 43.2113 84.5549 43.21H115.365C116.24 43.2145 117.096 43.4692 117.831 43.9441C118.567 44.4189 119.151 45.0941 119.515 45.89L123.305 54.31C124.23 56.3494 125.722 58.0796 127.603 59.2943C129.485 60.5089 131.676 61.1565 133.915 61.16H155.695C156.903 61.16 158.061 61.6391 158.916 62.4921C159.771 63.3451 160.252 64.5023 160.255 65.71V76.83C160.254 77.2957 160.344 77.7571 160.522 78.1878C160.699 78.6184 160.959 79.0098 161.288 79.3396C161.617 79.6694 162.008 79.9311 162.438 80.1096C162.868 80.2881 163.329 80.38 163.795 80.38C164.261 80.38 164.722 80.2881 165.152 80.1096C165.582 79.9311 165.973 79.6694 166.302 79.3396C166.631 79.0098 166.891 78.6184 167.068 78.1878C167.246 77.7571 167.336 77.2957 167.335 76.83V65.71C167.33 62.6245 166.102 59.6669 163.92 57.4851C161.738 55.3033 158.78 54.0753 155.695 54.07V54.07Z"
      fill="white"
    />
    <path
      d="M69.2647 91.81C69.2647 90.8712 68.8917 89.9708 68.2278 89.3069C67.564 88.643 66.6636 88.27 65.7247 88.27H39.8447V95.36H65.7247C66.1904 95.36 66.6516 95.2681 67.0817 95.0896C67.5118 94.9111 67.9025 94.6495 68.2314 94.3197C68.5602 93.9899 68.8208 93.5985 68.9981 93.1678C69.1754 92.7372 69.266 92.2757 69.2647 91.81V91.81Z"
      fill="url(#ocw-logo-paint0_linear)"
    />
    <path
      d="M130.533 91.8097C130.533 90.8708 130.906 89.9704 131.57 89.3065C132.234 88.6426 133.135 88.2697 134.073 88.2697H159.953V95.3597H134.073C133.608 95.3597 133.147 95.2678 132.716 95.0892C132.286 94.9107 131.896 94.6491 131.567 94.3193C131.238 93.9895 130.977 93.5981 130.8 93.1674C130.623 92.7368 130.532 92.2754 130.533 91.8097Z"
      fill="url(#ocw-logo-paint1_linear)"
    />
    <path
      d="M104.2 151.17C104.2 150.231 104.573 149.331 105.237 148.667C105.901 148.003 106.801 147.63 107.74 147.63H133.63V154.71H107.71C106.777 154.699 105.886 154.322 105.229 153.66C104.572 152.997 104.203 152.103 104.2 151.17V151.17Z"
      fill="url(#ocw-logo-paint2_linear)"
    />
    <path
      d="M95.7999 151.19C95.7999 150.251 95.4269 149.351 94.763 148.687C94.0992 148.023 93.1987 147.65 92.2599 147.65H66.3699V154.73H92.2899C93.2227 154.719 94.1139 154.342 94.7708 153.68C95.4276 153.017 95.7973 152.123 95.7999 151.19Z"
      fill="url(#ocw-logo-paint3_linear)"
    />
    <defs>
      <linearGradient
        id="ocw-logo-paint0_linear"
        x1="39.8147"
        y1="91.81"
        x2="69.2347"
        y2="91.81"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.1" stopColor="white" />
        <stop offset="0.85" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="ocw-logo-paint1_linear"
        x1="159.983"
        y1="91.8097"
        x2="130.563"
        y2="91.8097"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.1" stopColor="white" />
        <stop offset="0.85" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="ocw-logo-paint2_linear"
        x1="133.365"
        y1="151.18"
        x2="103.935"
        y2="151.18"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="0.85" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="ocw-logo-paint3_linear"
        x1="66.6949"
        y1="151.18"
        x2="96.1249"
        y2="151.18"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="0.85" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const IcSocial = () => (
  <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 134.18">
    <g id="Layer_1-2">
      <path d="M67.5,0C30.22,0,0,30.22,0,67.5c0,33.69,24.68,61.62,56.95,66.68v-47.17h-17.14v-19.51h17.14v-14.87c0-16.92,10.08-26.26,25.5-26.26,7.39,0,15.11,1.32,15.11,1.32v16.61h-8.51c-8.38,0-11,5.2-11,10.54v12.66h18.72l-2.99,19.51h-15.73v47.17c32.27-5.06,56.95-32.99,56.95-66.68C135,30.22,104.78,0,67.5,0Z" />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: { label: string; href: string; caret: boolean; bold?: boolean }[] = [
  { label: "Who We Serve", href: "#", caret: true },
  { label: "Features", href: "#", caret: true },
  { label: "Pricing", href: "/pricing", caret: true, bold: true },
  { label: "Support", href: "#", caret: true },
  { label: "Resources", href: "#", caret: true },
];

const QUICKLINKS = [
  {
    img: "https://companycam.imgix.net/images/homepage-2025/quicklinks-3.png",
    alt: "Dollare Symbol Icon",
    w: 35,
    h: 35,
    text: "No more expensive delays",
    textW: 142.492,
  },
  {
    img: "https://companycam.imgix.net/images/homepage-2025/quicklinks-4.png",
    alt: "Chat Icon",
    w: 34,
    h: 27,
    text: "No more miscommunications",
    textW: 164.688,
  },
  {
    img: "https://companycam.imgix.net/images/homepage-2025/quicklinks-2.png",
    alt: "Calendar Icon",
    w: 34,
    h: 28,
    text: "No more chasing down project updates",
    textW: 196.508,
  },
];

const FAQ_ITEMS = [
  {
    strong: "Capture",
    rest: " every project detail.",
    body: "Take job site photos and videos, and use AI to add even more context with just your voice. Keep it all organized with unlimited cloud-based storage.",
    open: true,
  },
  {
    strong: "Track",
    rest: " progress in real time.",
    body: "Keep a close eye on your projects and what your team is doing with a steady flow of photos, updates, checklists, and reports coming straight from the field.",
    open: false,
  },
  {
    strong: "Track",
    rest: " progress in real time.",
    body: "Keep a close eye on your projects and what your team is doing with a steady flow of photos, updates, checklists, and reports coming straight from the field.",
    open: false,
  },
  {
    strong: "Track",
    rest: " progress in real time.",
    body: "Keep a close eye on your projects and what your team is doing with a steady flow of photos, updates, checklists, and reports coming straight from the field.",
    open: false,
  },
  {
    strong: "Track",
    rest: " progress in real time.",
    body: "Keep a close eye on your projects and what your team is doing with a steady flow of photos, updates, checklists, and reports coming straight from the field.",
    open: false,
  },
];

const AI_CARDS: {
  before: string;
  em: string;
  after: string;
  href: string;
}[] = [
  {
    before: "Create and complete checklists ",
    em: "with just your voice.",
    after: "",
    href: "https://youtu.be/oqxlJhki3aI?si=KgQOMI89GYk97PBM",
  },
  {
    before: "Break down language barriers with ",
    em: "instant translations",
    after: " of your project communication.",
    href: "https://companycam.com/features/in-app-communication",
  },
  {
    before: "Get brought up to speed in seconds with ",
    em: "instant recaps",
    after: " of your project progress.",
    href: "https://companycam.com/features/pages#progress-recap",
  },
  {
    before: "Say it. Snap it. ",
    em: "Instantly generate",
    after: " a shareable report.",
    href: "https://companycam.com/ai-features/walkthrough-note",
  },
  {
    before: "Add context to photos ",
    em: "with a click",
    after: ", to show and tell the full story.",
    href: "https://companycam.com/features/pages#summary",
  },
  {
    before: "Track what got done and what’s next, ",
    em: "without extra work.",
    after: "",
    href: "https://companycam.com/features/pages#daily-log",
  },
];

const TESTIMONIALS = [
  {
    num: "$50",
    unit: "Thousand",
    author: "Reliant Roofing",
    text: "saved $50k a year in employee costs.",
  },
  { num: "36", unit: "Hours", author: "BK Restoration", text: "saved 36 hours a month." },
  { num: "10", unit: "Times", author: "AHC", text: "says CompanyCam is worth 10x its cost." },
];

const BLOBS = [
  {
    src: "https://companycam.imgix.net/images/homepage-2025/Intuit_QuickBooks_logo-1-2.png",
    alt: "quickbooks logo",
  },
  { src: "https://companycam.imgix.net/images/homepage-2025/Jobber-1-2.png", alt: "jobber logo" },
  { src: "https://companycam.imgix.net/images/homepage-2025/zapier-2-2.png", alt: "zapier logo" },
  {
    src: "https://companycam.imgix.net/images/homepage-2025/hubspot-logo.png",
    alt: "hubspot logo",
  },
  {
    src: "https://companycam.imgix.net/images/homepage-2025/google-drive-logo.png",
    alt: "google drive logo",
  },
];

const FIELD_TABS = ["Small", "Medium", "Enterprise", "Franchise", "50+ Trades"];

const TRADES = [
  "General Contracting",
  "General Contracting",
  "General Contracting",
  "General Contracting",
  "General Contracting",
];

const FOOTER_PRODUCT = [
  { label: "Core Features", href: "/features" },
  { label: "Core Features", href: "/features" },
  { label: "Core Features", href: "/features" },
  { label: "Core Features", href: "/features" },
  { label: "Core Features", href: "/features" },
  { label: "Core Features", href: "/features" },
  { label: "Core Features", href: "/features" },
];

const FOOTER_LEARN = [
  { label: "Resource Hub", href: "/resources" },
  { label: "Resource Hub", href: "/resources" },
  { label: "Resource Hub", href: "/resources" },
  { label: "Resource Hub", href: "/resources" },
  { label: "Resource Hub", href: "/resources" },
  { label: "Resource Hub", href: "/resources" },
  { label: "Resource Hub", href: "/resources" },
];

const FOOTER_ABOUT = [
  { label: "Our Story", href: "/about" },
  { label: "Our Story", href: "/about" },
  { label: "Our Story", href: "/about" },
  { label: "Our Story", href: "/about" },
  { label: "Our Story", href: "/about" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ComponentMockupCompanycam(): JSX.Element {
  return (
    <div className="cc-root">
      {/* ============================ HEADER ============================ */}
      <header className="cc-header">
        <div className="cc-desktop-nav-container">
          <a className="cc-home-link" href="/">
            <div className="cc-header-logo">
              <img
                src="https://companycam.imgix.net/images/global-nav/brand-2025/small.png"
                alt="CompanyCam"
              />
              <span className="cc-wordmark">CompanyCam</span>
            </div>
          </a>

          <nav className="cc-nav-desktop" id="navigationv">
            <ul className="cc-nav-menu">
              {NAV_ITEMS.map((item, i) => (
                <li
                  className={"cc-nav-level-1" + (item.bold ? " cc-nav-pricing" : "")}
                  key={i}
                >
                  <a href={item.href}>
                    {item.label}{" "}
                    <span className="cc-caret">
                      <IcCaretRight />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="cc-app-links">
            <div className="cc-global-login-button">
              <a href="https://app.companycam.com/signin">
                Login{" "}
                <span className="cc-btn-icon-right">
                  <IcAvatar />
                </span>
              </a>
            </div>
            <div className="cc-global-signup-button">
              <a className="cc-signup-btn" href="https://app.companycam.com/signup">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ====================== 01 QUICKLINKS ========================== */}
      <section className="cc-quicklinks-section">
        <div className="cc-container-1200">
          <div className="cc-col-12">
            <nav>
              <ol className="cc-quicklinks-list">
                {QUICKLINKS.map((q, i) => (
                  <li className="cc-subnav-item" key={i}>
                    <div className="cc-subnav-link">
                      <div className="cc-link-title">
                        <img src={q.img} alt={q.alt} width={q.w} height={q.h} />
                        <div className="cc-link-title__text" style={{ width: q.textW }}>
                          {q.text}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* ================= 02 BUILT FOR THE JOB ======================== */}
      <section className="cc-accordion-section">
        <div className="cc-container-1200">
          <div className="cc-col-12">
            <div className="cc-accordion-head">
              <h2 className="cc-headline">
                <span className="cc-accent-circle">Built</span>
                <br /> for the job, from start to finish.
              </h2>
              <p className="cc-faq-top-text">
                From first walkthrough to final payment, CompanyCam tools do it all.
              </p>
            </div>

            <div className="cc-faq-row">
              <div className="cc-faq-list">
                <div className="cc-faq-media">
                  <img
                    src="https://companycam.imgix.net/images/homepage-2025/image-field-slide.png"
                    alt="CompanyCam app on a phone"
                  />
                </div>

                {FAQ_ITEMS.map((item, i) => (
                  <div
                    className={"cc-faq-item" + (item.open ? "" : " cc-faq-item--dim")}
                    key={i}
                    id={"faq-header-" + (i + 1)}
                  >
                    <div className="cc-faq-item__title">
                      <strong>{item.strong}</strong>
                      {item.rest}
                    </div>
                    {item.open ? (
                      <div className="cc-faq-item__content" id={"faq-content-" + (i + 1)}>
                        <p className="cc-faq-item__content-text">{item.body}</p>
                      </div>
                    ) : null}
                  </div>
                ))}

                <a className="cc-btn-blue-solid" href="/features">
                  Explore the Features
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= 03 AI =============================== */}
      <section className="cc-ai-section">
        <div className="cc-container-wide">
          <div className="cc-col-12">
            <div className="cc-ai-content">
              <h2 className="cc-ai-headline">
                Skip the extra steps with <span className="cc-accent-circle">AI.</span>
              </h2>
              <p className="cc-sub-headline">
                Stay hands-on with the job while AI tools work in the background to handle
                everything else.
              </p>
              <a className="cc-btn-blue-solid" href="/ai-features">
                Get AI Tools
              </a>
            </div>

            <div className="cc-cards-container">
              <button className="cc-slick-arrow cc-slick-prev" type="button" aria-label="Previous">
                <IcCaretLeft />
              </button>

              <div className="cc-slick-list">
                <div className="cc-slick-track">
                  {AI_CARDS.map((card, i) => (
                    <div className="cc-ai-card" key={i} id={"slick-slide0" + i}>
                      <div className="cc-ai-card__badge-row">
                        <span className="cc-ai-card__icon">
                          <IcSparkle />
                        </span>
                      </div>
                      <div className="cc-ai-card__title">
                        <p>
                          {card.before}
                          <em>{card.em}</em>
                          {card.after}
                        </p>
                      </div>
                      <a className="cc-ai-card__btn" href={card.href}>
                        Learn More
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <button className="cc-slick-arrow cc-slick-next" type="button" aria-label="Next">
                <IcCaretRight />
              </button>

              <ul className="cc-slick-dots">
                <li className="cc-active">
                  <button type="button">1</button>
                </li>
                <li>
                  <button type="button">2</button>
                </li>
                <li>
                  <button type="button">3</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 04 TRUSTED BY PROS ====================== */}
      <section className="cc-trusted-section">
        <div className="cc-container-wide">
          <div className="cc-trusted-row">
            <div className="cc-trusted-col-title">
              <h3>
                Trusted by <span className="cc-accent-scribble">pros</span>
                <br /> on every job site:
              </h3>
            </div>
            <div className="cc-trusted-col-logos">
              <div className="cc-logo-slider">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div className="cc-logo-container" key={i}>
                    <img
                      src="https://companycam.imgix.net/images/homepage-2025/logo-PFM-1.png"
                      alt="Logo 2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================== 05 JOIN 285,000 PROS ====================== */}
      <section className="cc-join-section">
        <div className="cc-container-wide">
          <div className="cc-join-row">
            <div className="cc-join-left">
              <h3>
                Join <strong>285,000</strong>+ pros using
                <br /> CompanyCam on <strong>79 Million</strong>
                <br /> jobs.
              </h3>
              <p>
                Built for and used by the
                <br /> biggest brands in the industry.
              </p>
              <div className="cc-image-gallery">
                {Array.from({ length: 4 }).map((_, i) => (
                  <img
                    className="cc-gallery-image"
                    key={i}
                    src="https://companycam.imgix.net/images/homepage-2025/Mask-group-1.png"
                    alt="image"
                  />
                ))}
              </div>
            </div>

            <div className="cc-join-right">
              <div className="cc-testimonial-cards">
                {TESTIMONIALS.map((t, i) => (
                  <div className="cc-testimonial-card" key={i}>
                    <div className="cc-testimonial-card__number">
                      <span className="cc-big-num">{t.num}</span>
                      <span className="cc-blue-handwritten">{t.unit}</span>
                    </div>
                    <div className="cc-testimonial-card__body">
                      <div className="cc-testimonial-card__author">{t.author}</div>
                      <div className="cc-testimonial-card__text">{t.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 06 INTEGRATIONS ======================== */}
      <section className="cc-integrations-section">
        <div className="cc-integrations-container">
          <div className="cc-integrations-row">
            <div className="cc-integrations-left">
              <h2>
                Yep, we integrate
                <br /> with
              </h2>
              <p>
                Efficiency is the name of the game, so CompanyCam connects with all the tech you
                already use.
              </p>
              <a className="cc-btn-white-outline" href="/integrations">
                See All Integrations
              </a>
            </div>

            <div className="cc-integrations-right">
              <div className="cc-blob-stack">
                <div className="cc-blob-stack__inner">
                  {BLOBS.map((b, i) => (
                    <div className="cc-blob" key={i}>
                      <img src={b.src} alt={b.alt} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== 07 FIELD SOLUTIONS ======================= */}
      <section className="cc-field-section">
        <div className="cc-field-container">
          <div className="cc-col-12">
            <h2>
              Field solutions for <span className="cc-accent-circle">every</span>
              <br /> team.
            </h2>

            <div className="cc-slider-nav">
              <div className="cc-slider-nav-track">
                {FIELD_TABS.map((tab, i) => (
                  <div
                    className={"cc-tab" + (i === 0 ? " cc-tab--active" : "")}
                    key={i}
                    id={"tab-" + (i + 1)}
                  >
                    {tab}
                  </div>
                ))}
              </div>
            </div>

            <div className="cc-features-wrap">
              <div className="cc-features-slider-bg">
                <img
                  className="cc-slider-map cc-slider-map--1"
                  src="https://companycam.imgix.net/images/homepage-2025/bg-map-circle.png"
                  alt=""
                />
                <img
                  className="cc-slider-map cc-slider-map--2"
                  src="https://companycam.imgix.net/images/homepage-2025/bg-map-circle.png"
                  alt=""
                />
                <img
                  className="cc-slider-map cc-slider-map--3"
                  src="https://companycam.imgix.net/images/homepage-2025/bg-map-circle.png"
                  alt=""
                />
              </div>

              <div className="cc-features-slide">
                <div className="cc-features-slide__media">
                  <img
                    className="cc-slide-photo"
                    src="https://companycam.imgix.net/images/homepage-2025/image-field-slide.png"
                    alt="Tradesman posing for a profile picture"
                  />
                  <div className="cc-slider-blurb">
                    <img
                      src="https://companycam.imgix.net/images/homepage-2025/field-bg-small.png"
                      alt="Small Business Blurb"
                    />
                  </div>
                </div>

                <div className="cc-features-slide__text">
                  <p>1-10 employees documenting work and sharing updates.</p>
                  <a className="cc-link-underline" href="/who-we-serve/small-business">
                    Solutions for Small Businesses
                    <span className="cc-arrow-icon">
                      <IcArrowDark />
                    </span>
                  </a>
                  <div className="cc-caption-title">Small Business</div>
                  <div className="cc-caption-description">
                    Keep your whole team connected with unlimited photo storage, easy communication
                    tools, and simple sharing features.
                  </div>
                  <a className="cc-btn-pricing-small" href="/pricing">
                    See Pricing
                  </a>
                </div>
              </div>

              <div className="cc-features-slide">
                <div className="cc-features-slide__media">
                  <img
                    className="cc-slide-photo"
                    src="https://companycam.imgix.net/images/homepage-2025/Teams-Image-Medium-2.png"
                    alt="Tradeswomaman posing for a profile picture"
                  />
                  <div className="cc-slider-blurb">
                    <img
                      src="https://companycam.imgix.net/images/homepage-2025/field-bg-medium.png"
                      alt="Medium Business Blurb"
                    />
                  </div>
                </div>

                <div className="cc-features-slide__text">
                  <p>11-49 employees at a growing business managing multiple crews.</p>
                  <a className="cc-link-underline" href="/who-we-serve/medium-business">
                    Solutions for Medium Businesses
                    <span className="cc-arrow-icon">
                      <IcArrowDark />
                    </span>
                  </a>
                  <div className="cc-caption-title">Medium</div>
                  <div className="cc-caption-description">
                    Coordinate work across job sites and the office, track progress, and maintain
                    consistency with standardized workflows.
                  </div>
                  <a className="cc-btn-pricing-small" href="/pricing">
                    See Pricing
                  </a>
                </div>
              </div>

              <div className="cc-features-slide">
                <div className="cc-features-slide__media">
                  <img
                    className="cc-slide-photo"
                    src="https://companycam.imgix.net/images/homepage-2025/image-field-slide-2.png"
                    alt="Tradesman posing for a profile picture"
                  />
                  <div className="cc-slider-blurb">
                    <img
                      src="https://companycam.imgix.net/images/homepage-2025/field-bg-enterprise.png"
                      alt="Enterprise Business Blurb"
                    />
                  </div>
                </div>

                <div className="cc-features-slide__text">
                  <p>50+ employees at a large organization with complex operations.</p>
                  <a className="cc-link-underline" href="/who-we-serve/enterprise-business">
                    Solutions for Enterprise Businesses
                    <span className="cc-arrow-icon">
                      <IcArrowDark />
                    </span>
                  </a>
                  <div className="cc-caption-title">Enterprise</div>
                  <div className="cc-caption-description">
                    Scale efficiently and keep everyone accountable with custom workflows, tailored
                    implementation, and enhanced security features.
                  </div>
                  <a className="cc-btn-pricing-small" href="/pricing">
                    See Pricing
                  </a>
                </div>
              </div>

              <div className="cc-features-slide">
                <div className="cc-features-slide__media">
                  <img
                    className="cc-slide-photo"
                    src="https://companycam.imgix.net/images/homepage-2025/Teams-Image-Franchise-4.png"
                    alt="Tradesman posing for a profile picture"
                  />
                  <div className="cc-slider-blurb">
                    <img
                      src="https://companycam.imgix.net/images/homepage-2025/field-bg-franchise.png"
                      alt="Franchise Business Blurb"
                    />
                  </div>
                </div>

                <div className="cc-features-slide__text">
                  <p>Franchise networks maintaining brand consistency.</p>
                  <a className="cc-link-underline" href="/who-we-serve/franchise">
                    Solutions for Franchises
                    <span className="cc-arrow-icon">
                      <IcArrowDark />
                    </span>
                  </a>
                  <div className="cc-caption-title">Franchise</div>
                  <div className="cc-caption-description">
                    Standardize documentation across locations, share best practices, and monitor
                    performance with the tools to succeed.
                  </div>
                  <a className="cc-btn-pricing-small" href="/pricing">
                    See Pricing
                  </a>
                </div>
              </div>

              <div className="cc-features-slide">
                <div className="cc-features-slide__media">
                  <img
                    className="cc-slide-photo"
                    src="https://companycam.imgix.net/images/homepage-2025/Teams-Image-Trades-5.png"
                    alt="Tradesman posing for a profile picture"
                  />
                  <div className="cc-slider-blurb">
                    <img
                      src="https://companycam.imgix.net/images/homepage-2025/field-bg-trades.png"
                      alt="Trades Business Blurb"
                    />
                  </div>
                </div>

                <div className="cc-features-slide__text">
                  <h5>50+ Trades and Industries</h5>
                  <ul className="cc-trades-list">
                    {TRADES.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                  <a className="cc-link-underline" href="/resources/case-studies">
                    See Real Results
                    <span className="cc-arrow-icon">
                      <IcArrowDark />
                    </span>
                  </a>
                  <div className="cc-caption-description">
                    Get more done, no matter what type of work you're doing. From commercial
                    construction, to residential landscaping, field work is better with CompanyCam
                    on your side.
                  </div>
                  <a className="cc-btn-pricing-small" href="/pricing">
                    See Pricing
                  </a>
                </div>
              </div>

              <a className="cc-btn-free-trial" href="https://app.companycam.com/signup">
                Start a Free Trial{" "}
                <span className="cc-arrow-icon">
                  <IcArrowCircleWhite />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================ 08 TRY COMPANYCAM WITH YOUR TEAM ============ */}
      <section className="cc-try-section">
        <div className="cc-container-wide">
          <div className="cc-try-row">
            <div className="cc-try-left">
              <div className="cc-portfolio-banner">
                <span className="cc-portfolio-banner__new">New!</span>
                <span className="cc-portfolio-banner__text">
                  <strong>Introducing Portfolio features.</strong>
                  <a href="/portfolio-features">
                    Your visual sales pitch.
                    <span className="cc-portfolio-banner__arrow">
                      <IcArrowWhiteSmall />
                    </span>
                  </a>
                </span>
              </div>

              <h2>Try CompanyCam with your team.</h2>
              <p>Learn the app in 30 minutes, become pros in a day.</p>

              <div className="cc-hero-button-container">
                <a className="cc-btn-yellow-solid" href="https://app.companycam.com/signup">
                  Start a Free Trial
                </a>
                <a className="cc-btn-blue-small" href="/demo">
                  Book a Demo
                </a>
                <a className="cc-btn-white-outline-small" href="/pricing">
                  See Pricing
                </a>
              </div>
            </div>

            <div className="cc-try-right">
              <img
                src="https://companycam.imgix.net/images/homepage-2025/image-blurb.png"
                alt="Three men working on a roof."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================ FOOTER ========================== */}
      <footer className="cc-footer">
        <div className="cc-footer-row">
          <div className="cc-footer-col-brand">
            <div className="cc-footer-logo">
              <IcCompanyCamMark />
            </div>
            <div className="cc-footer-text">
              <p>
                CompanyCam helps contractors build trust with their crews and customers through
                photo documentation. We make it easy to keep everyone on the same page with an
                actively growing list of features and integrations.
              </p>
            </div>
            <ul className="cc-footer-group">
              <li>
                <a href="mailto:support@companycam.com">support@companycam.com</a>
              </li>
              <li>
                <a href="mailto:press@companycam.com">press@companycam.com</a>
              </li>
            </ul>
          </div>

          <div className="cc-footer-col">
            <h5 className="cc-footer-group-header">Product</h5>
            <ul className="cc-footer-group">
              {FOOTER_PRODUCT.map((l, i) => (
                <li key={i}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="cc-footer-col">
            <h5 className="cc-footer-group-header">Learn</h5>
            <ul className="cc-footer-group">
              {FOOTER_LEARN.map((l, i) => (
                <li key={i}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="cc-footer-col">
            <h5 className="cc-footer-group-header">About</h5>
            <ul className="cc-footer-group">
              {FOOTER_ABOUT.map((l, i) => (
                <li key={i}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="cc-footer-extras">
          <ul className="cc-footer-extras-group">
            <li className="cc-footer-legal">
              ©2026 CompanyCam{"  "}|{" "}
              <a href="/terms">Terms &amp; Conditions</a> |{" "}
              <a href="/privacy-notice">Privacy Notice</a> |{" "}
              <a href="/cookie-policy">Cookie Policy</a>
              <br />
              <a href="#">Cookie Preferences</a> |{" "}
              <a href="/privacy-preferences">Do Not Sell or Share My Personal Information</a> |{" "}
              <a href="/privacy-notice-at-collection">Notice at Collection</a>
            </li>
            <li className="cc-footer-social-links">
              {Array.from({ length: 6 }).map((_, i) => (
                <a href="https://www.facebook.com/companycam" key={i} aria-label="Social link">
                  <IcSocial />
                </a>
              ))}
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
