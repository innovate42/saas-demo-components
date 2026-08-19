import React from "react";
import "./index.css";

/* --------------------------------------------------------------------------
   Captured avatars (data URIs from the live page)
   -------------------------------------------------------------------------- */

const AV_SAMANTHA = "data:image/webp;base64,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";
const AV_GEORGIE = "data:image/webp;base64,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";
const AV_JENNY = "data:image/webp;base64,UklGRpYFAABXRUJQVlA4IIoFAACwGgCdASpgAGAAPmEskUWkIqGVW1YAQAYEoAzIxyrbVNfaHmqOn9zs5+j/b8818zkzE570lRHE/YjG1y1no7mVX+oAeL3pIgTl5BI9cdtpCDM+3YYkzFFjHv4dzA4obJrrRMieR9LPZL9xwxTAKVowJHfWfG6iEc8SD9LSGDZBN8xEps9oWm9WALz4UbIcWIiKnGJgb2eP5+P/tAWCr3i63iqjpIp4zpSMeFJ/2OahJf9I+zUzWap+TOmPPEEbeY7SRM7t7dxdVcBias2eg/FfWioik1UMHyN+l1B1KYAA/vNgi1+3G4TcHARvc1bCK6b7X/WrJvQZpeKrmu+SF7/4Hfc0x8OAKCay8eXKqoyEnBpH7yj0eFTpQn0cJ48NVqs7SRBTYSGoKFE/LFYjynpSCV2oCQ2Yzp4+EA35IMIL7UDL+c/iTpeKywfEMiCZ4nEuAPFyr0Nga+0LCxoQ1e/p5ObycGnPeLJonMIIDYwXbm4dPnqyaQFbj39dgAQw+rxHdOjzEviHCo3Iq6nB7pc68Si3HnBDInlugSIBTE8LQqypzkJ9TYxSUE038z1DAjahwXneYw+ijJN8zXBQiDnrMxN+E08xRE03X4muIknW06K0MDdvDM78/g+lOFwiiL3PX8BxF+G/t/9WI0VrlsQYxUTOwS1FVbp5zXcn/GaI1+/2qeqJXi+R/my/dip608flWNxpT91EfGGRskAPzw0rRCA7zDnCGXNsJxqn4YIvFS62qHCcifqKngFtI7erkj7RX93XHhqLG60ogCaWjXOQzRb++3XnI9Hu92vWpz+Ua/b8lFrO52vfYh5CCbxQEvP4QCmS+OXbUmvmO7u6evRLkWQql6wbcOSKIqF1AzxhD0D2IjEEGSAjGJrK4Ej5PETyde488h+4VIzeW8otLbvbRz4LoruJgywSHfked8PZDekpQQzxPdiuFqNYjDN0YUWqWeFGVqXYAqRu0o1bdkdGrgaqZ6bCQLcbQJU0CJBEXtc5OG3W0J07q99N1bWgX+uVFhh48VPqZwRj3Z44xiXI93BQA3HroyPYp8zRrOWbIi38ab/8Xxmk1ceAG4ZrdYAQYegaJ5P7HgjxXvsIy1pBE/AnVAfBXJAHo3xS8oKoNhKeKUJR6PIUGkhRwXEELYcNBQ0ucst/ZWgj9KH3n8ElhgUtKfSBnjS/SXXIF+2Vqegm7NAyBlFTXsiruVd3+EM3Jq0IB9l9RsmoG1+efCz18XQXOys/EgpSRs1Rtc5OD49PdeoA6hLFDhZQUuna2vweavscRW309YJwlfPpd9rp9KOz2WHqw16OfBL9a0j3NO5CYwBGfnoVDrE79oyW0SXaqgvL0Wpdj+F7xmMBC/gUCwCUm3ZmN6R75lBFmgybke5zanyCITFiu8vvCfmewgvPjvobyF/CfwvmAz47uiTBSvt2RH0diliwzjRfDaAvAJGkW9HQPAMUzOwPDlqpwvEqh4If4egRJ/zg2tXKdYvO1rozfNIT5k4TVJeAYQT2BbBExO00yYOzytMrOJ/UNBi76DssEmF2vth49QWlsHwDKxBGLYVw1udS4sy2fAh/z7ECb6HxKjV2L6npYMtu9aPUfHFhScihlpSY5o1W4x0wY3P1Du0FVYtcQZVjRzY924xOgEmsQsGh99ZTdaCUasWB8usI70u/HezDhDDyotKyzJNnmlkDQVUiIC73f2U3gGGeXXYr+DSDf+i8YV3y7LJIMOysPRYoUZj5KtF5pl/v/KF78fK9zg2uLnKwSIOfPPibNYqI3Yim9r6q/O3bcFTHL3rWygjZSTP71WEtHeEeq4F1ovAoJUsqNlRlOHFvwX2r44of+4KsFSfqVeruGKKqywOCFNSqbZGxtU2DAPHL97o8Vslw52UAAA==";
const AV_MARCUS = "data:image/webp;base64,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";
const AV_MEMBER = "data:image/webp;base64,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";

const LOGO_URL =
  "https://xoda.com/__l5e/assets-v1/cbf58190-b568-4317-bc31-4ce86d2d61d8/xoda-logo.png";

/* --------------------------------------------------------------------------
   Captured icons (inlined from the live page)
   -------------------------------------------------------------------------- */

type IconProps = { className?: string; style?: React.CSSProperties };

function makeIcon(paths: React.ReactNode, strokeWidth: number) {
  return function Icon({ className, style }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
        style={style}
      >
        {paths}
      </svg>
    );
  };
}

/* ic0 / ic23 arrow-up-right */
const IcArrowUpRight = makeIcon(
  <>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </>,
  1.5
);
const IcArrowUpRight2 = makeIcon(
  <>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </>,
  2
);
/* ic1 maximize-2 */
const IcMaximize = makeIcon(
  <>
    <path d="M15 3h6v6" />
    <path d="m21 3-7 7" />
    <path d="m3 21 7-7" />
    <path d="M9 21H3v-6" />
  </>,
  2
);
/* ic2 arrow-right-left */
const IcArrowRightLeft = makeIcon(
  <>
    <path d="m16 3 4 4-4 4" />
    <path d="M20 7H4" />
    <path d="m8 21-4-4 4-4" />
    <path d="M4 17h16" />
  </>,
  2
);
/* ic3 iteration-ccw */
const IcIteration = makeIcon(
  <>
    <path d="m16 14 4 4-4 4" />
    <path d="M20 10a8 8 0 1 0-8 8h8" />
  </>,
  2
);
/* ic4 / ic5 pencil */
const IcPencil = makeIcon(
  <>
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <path d="m15 5 4 4" />
  </>,
  2
);
/* ic7 zap */
const IcZap = makeIcon(
  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
  1
);
/* ic8 bell */
const IcBell = makeIcon(
  <>
    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
  </>,
  1.5
);
/* ic9 qr-code */
const IcQr = makeIcon(
  <>
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </>,
  1.5
);
/* ic10 / ic12 chevron-right (thin) */
const IcChevronRightThin = makeIcon(<path d="m9 18 6-6-6-6" />, 1);
/* ic11 calendar */
const IcCalendar = makeIcon(
  <>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </>,
  1
);
/* ic13 chart-line */
const IcChartLine = makeIcon(
  <>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="m19 9-5 5-4-4-3 3" />
  </>,
  1
);
/* ic14 wallet */
const IcWallet = makeIcon(
  <>
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </>,
  1
);
/* ic15 plus */
const IcPlus = makeIcon(
  <>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </>,
  2
);
/* ic16 / ic25 chevron-left */
const IcChevronLeft = makeIcon(<path d="m15 18-6-6 6-6" />, 2);
/* ic17 / ic26 chevron-right */
const IcChevronRight = makeIcon(<path d="m9 18 6-6-6-6" />, 2);
/* ic18 funnel */
const IcFunnel = makeIcon(
  <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />,
  2
);
/* ic19 shield-check */
const IcShieldCheck = makeIcon(
  <>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </>,
  2
);
/* ic20 check */
const IcCheck = makeIcon(<path d="M20 6 9 17l-5-5" />, 1.5);
/* ic29 check (bold) */
const IcCheckBold = makeIcon(<path d="M20 6 9 17l-5-5" />, 3);
/* ic21 layers */
const IcLayers = makeIcon(
  <>
    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
    <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
    <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
  </>,
  2
);
/* ic22 credit-card */
const IcCreditCard = makeIcon(
  <>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </>,
  2
);
/* ic24 dumbbell */
const IcDumbbell = makeIcon(
  <>
    <path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" />
    <path d="m2.5 21.5 1.4-1.4" />
    <path d="m20.1 3.9 1.4-1.4" />
    <path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" />
    <path d="m9.6 14.4 4.8-4.8" />
  </>,
  2
);
/* ic27 / ic30 arrow-right */
const IcArrowRight = makeIcon(
  <>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </>,
  2
);
/* ic28 / ic31 chevron-down */
const IcChevronDown = makeIcon(<path d="m6 9 6 6 6-6" />, 2);

/* ic6 mouse-pointer-2 */
function IcCursor({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#ffffff"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
    </svg>
  );
}

/* ic32 instagram */
function IcInstagram({ className }: IconProps) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 448 512"
      height="18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   helpers
   -------------------------------------------------------------------------- */

const times = (n: number) => Array.from({ length: n }, (_, i) => i);

const px = (n: number) => `${n}px`;

/* schedule mock: 60px per hour, grid starts at 7:00 */
const HOUR = 60;
const slot = (h: number, m: number) => (h - 7) * HOUR + (m / 60) * HOUR;

type Ev = {
  time: string;
  name: string;
  room: string;
  count: string;
  tag: string;
  bg: string;
  border: string;
  tagBg: string;
  tagColor: string;
  dot: string;
  top: number;
  height: number;
};

const GREEN_EV = {
  bg: "rgb(232, 246, 232)",
  border: "rgb(134, 239, 172)",
  tagBg: "rgb(134, 239, 172)",
  tagColor: "rgb(20, 83, 45)",
};
const AMBER_EV = {
  bg: "rgb(254, 243, 199)",
  border: "rgb(252, 211, 77)",
  tagBg: "rgb(252, 211, 77)",
  tagColor: "rgb(120, 53, 15)",
};
const VIOLET_EV = {
  bg: "rgb(237, 233, 254)",
  border: "rgb(196, 181, 253)",
  tagBg: "rgb(196, 181, 253)",
  tagColor: "rgb(59, 7, 100)",
};
const TEAL_EV = {
  bg: "rgb(224, 251, 247)",
  border: "rgb(126, 232, 220)",
  tagBg: "rgb(126, 232, 220)",
  tagColor: "rgb(17, 94, 89)",
};
const CORAL_EV = {
  bg: "rgb(255, 240, 236)",
  border: "rgb(255, 188, 175)",
  tagBg: "rgb(255, 188, 175)",
  tagColor: "rgb(124, 45, 18)",
};

const LIVE = "rgb(34, 197, 94)";
const IDLE = "rgb(203, 213, 225)";

const SCHEDULE: Ev[][] = [
  [
    {
      time: "7:00 - 8:00am",
      name: "Cross Fit 101",
      room: "Olympic Room",
      count: "10/10",
      tag: "G",
      dot: LIVE,
      top: slot(7, 0),
      height: 60,
      ...GREEN_EV,
    },
    {
      time: "8:00 - 9:00am",
      name: "HIIT Burn",
      room: "Olympic Room",
      count: "9/12",
      tag: "G",
      dot: IDLE,
      top: slot(8, 0),
      height: 60,
      ...GREEN_EV,
    },
    {
      time: "10:30 - 11:30am",
      name: "Lunchtime HIIT",
      room: "Olympic Room",
      count: "14/16",
      tag: "G",
      dot: IDLE,
      top: slot(10, 30),
      height: 60,
      ...GREEN_EV,
    },
  ],
  [
    {
      time: "7:30 - 8:30am",
      name: "Power Vinyasa Flow",
      room: "Flow Room",
      count: "8/10",
      tag: "Y",
      dot: LIVE,
      top: slot(7, 30),
      height: 60,
      ...AMBER_EV,
    },
    {
      time: "9:00 - 10:00am",
      name: "Reformer Flow",
      room: "Flow Room",
      count: "7/8",
      tag: "P",
      dot: IDLE,
      top: slot(9, 0),
      height: 60,
      ...TEAL_EV,
    },
    {
      time: "11:00 - 12:00pm",
      name: "Yoga Restore",
      room: "Flow Room",
      count: "9/12",
      tag: "Y",
      dot: IDLE,
      top: slot(11, 0),
      height: 60,
      ...AMBER_EV,
    },
  ],
  [
    {
      time: "7:30 - 8:30am",
      name: "PT Session 60 min",
      room: "Olympic Room · John G.",
      count: "1/1",
      tag: "PT",
      dot: LIVE,
      top: slot(7, 30),
      height: 60,
      ...VIOLET_EV,
    },
    {
      time: "9:00 - 10:00am",
      name: "Pilates Core",
      room: "Flow Room",
      count: "10/10",
      tag: "P",
      dot: IDLE,
      top: slot(9, 0),
      height: 60,
      ...TEAL_EV,
    },
    {
      time: "10:30 - 11:30am",
      name: "PT Session 45 min",
      room: "Olympic Room · John G.",
      count: "1/1",
      tag: "PT",
      dot: IDLE,
      top: slot(10, 30),
      height: 60,
      ...VIOLET_EV,
    },
  ],
  [
    {
      time: "7:00 - 8:30am",
      name: "Strength Foundations",
      room: "Iron Room",
      count: "12/14",
      tag: "G",
      dot: LIVE,
      top: slot(7, 0),
      height: 90,
      ...GREEN_EV,
    },
    {
      time: "8:30 - 9:30am",
      name: "Mobility & Recovery",
      room: "Iron Room",
      count: "6/10",
      tag: "O",
      dot: IDLE,
      top: slot(8, 30),
      height: 60,
      ...CORAL_EV,
    },
    {
      time: "11:00 - 12:30pm",
      name: "Boxing Basics",
      room: "Iron Room",
      count: "10/14",
      tag: "G",
      dot: IDLE,
      top: slot(11, 0),
      height: 90,
      ...GREEN_EV,
    },
  ],
];

const STAFF = [
  { img: AV_SAMANTHA, name: "Samantha W." },
  { img: AV_GEORGIE, name: "Georgie M." },
  { img: AV_JENNY, name: "Jenny L." },
  { img: AV_MARCUS, name: "Marcus R." },
];

/* --------------------------------------------------------------------------
   component
   -------------------------------------------------------------------------- */

export default function ComponentMockupXoda() {
  return (
    <div className="xoda-root">
      {/* ================= 00 hero ================= */}
      <section className="x-hero">
        <div className="x-container x-hero-inner">
          <div className="x-center-copy">
            <h1 className="x-hero-h1">
              All-in-one <span className="mk mk-green">gym</span> and{" "}
              <span className="mk mk-aqua">fitness</span>{" "}
              <span className="mk mk-coral">management</span> software
            </h1>
            <p className="x-hero-sub">
              Manage memberships, class bookings, payments, staff, and member engagement with one
              powerful platform built for gyms, fitness studios, yoga, pilates, martial arts,
              personal trainers and wellness businesses.
            </p>
            <div className="x-hero-cta">
              <a className="x-btn-dark" href="/book-a-demo">
                <span className="x-btn-knob">
                  <IcArrowUpRight style={{ width: 26, height: 26 }} />
                </span>
                <span>Book a demo</span>
              </a>
              <a className="x-btn-outline" href="#platform">
                Explore features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 01 trusted by ================= */}
      <section className="x-trust">
        <div className="x-container x-trust-inner">
          <p className="x-trust-label">
            Trusted by gyms and studios across Australia, NZ, UK, US &amp; Asia
          </p>
          <div className="x-marquee">
            <div className="x-marquee-track">
              {times(30).map((i) => (
                <span className="x-marquee-item" key={i}>
                  Loft Pilates
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 02 by the numbers ================= */}
      <section className="x-stats">
        <div className="x-container">
          <div className="x-stats-grid">
            {times(4).map((i) => (
              <div key={i}>
                <div className="x-stat-value">500+</div>
                <div className="x-stat-label">Gyms &amp; studios</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 03 one platform ================= */}
      <section className="x-platform" id="platform">
        <div className="x-container">
          <div className="x-center-copy">
            <div className="x-eyebrow">The gym &amp; fitness platform</div>
            <h2 className="x-h2">One platform. Every part of your business.</h2>
            <p className="x-lede">
              Explore how XODA replaces the tangle of tools you use today. Tap any tile to see it in
              detail.
            </p>
          </div>

          <div className="x-bento">
            {/* tile 1 : memberships */}
            <button className="x-tile x-tile-wide x-tile-h352 x-tile-navy" type="button">
              <div className="x-tile-head">
                <h3 className="x-tile-title">
                  Sell memberships and recurring plans that just work
                </h3>
                <span className="x-tile-zoom">
                  <IcMaximize style={{ width: 16, height: 16 }} />
                </span>
              </div>
              <div className="x-tile-body">
                <div className="x-t1-stack">
                  <div className="x-card x-t1-card">
                    <div className="x-t1-cardhead">
                      <div className="x-t1-cardtitle">Plans</div>
                      <span className="x-pill-ghost">
                        <IcArrowRightLeft style={{ width: 12, height: 12 }} />
                        Change plan
                      </span>
                    </div>
                    <div className="x-t1-rows">
                      <div className="x-t1-row">
                        <div className="x-t1-name">Cross Fit 101</div>
                        <div className="x-t1-meta">
                          <span className="x-strong">$39.99</span>
                          <span className="x-dot-sep">·</span>
                          <span>monthly</span>
                          <span className="x-dot-sep">·</span>
                          <span
                            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                          >
                            30 Aug
                            <IcIteration style={{ width: 12, height: 12 }} />
                          </span>
                          <IcPencil style={{ width: 12, height: 12, opacity: 0.6 }} />
                          <span className="x-badge-warn">T&amp;C&apos;s pending</span>
                        </div>
                        <span className="x-toggle x-toggle-on">
                          <span className="x-toggle-knob" />
                        </span>
                      </div>
                      <div className="x-t1-row">
                        <div className="x-t1-name">Pilates Core</div>
                        <div className="x-t1-meta">
                          <span className="x-strong">$19.99</span>
                          <span className="x-dot-sep">·</span>
                          <span>fortnightly</span>
                          <span className="x-dot-sep">·</span>
                          <span
                            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                          >
                            15 Aug
                            <IcIteration style={{ width: 12, height: 12 }} />
                          </span>
                          <IcPencil style={{ width: 12, height: 12, opacity: 0.6 }} />
                          <span className="x-badge-ok">T&amp;C&apos;s signed</span>
                        </div>
                        <span className="x-toggle x-toggle-off">
                          <span className="x-toggle-knob" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="x-card x-t1-card">
                    <div className="x-t1-cardhead">
                      <div className="x-t1-cardtitle">Packs</div>
                      <span className="x-pill-ghost x-pill-invisible">
                        <IcArrowRightLeft style={{ width: 12, height: 12 }} />
                        Change plan
                      </span>
                    </div>
                    <div className="x-t1-rows">
                      <div className="x-t1-row">
                        <div className="x-t1-name">10-Class Pack</div>
                        <div className="x-t1-meta">
                          <span className="x-strong">$149.00</span>
                          <span className="x-dot-sep">·</span>
                          <span>7 of 10 left</span>
                          <span className="x-dot-sep">·</span>
                          <span>Exp 12 Nov, 2026</span>
                          <IcPencil
                            style={{ width: 12, height: 12, marginLeft: 2, opacity: 0.6 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* tile 2 : revenue */}
            <button className="x-tile x-tile-h352 x-tile-aqua" type="button">
              <div className="x-tile-head">
                <h3 className="x-tile-title">See exactly what is driving revenue</h3>
                <span className="x-tile-zoom">
                  <IcMaximize style={{ width: 16, height: 16 }} />
                </span>
              </div>
              <div className="x-tile-body">
                <div className="x-card x-t2-card">
                  <div className="x-t2-title">Revenue</div>
                  <div className="x-t2-chartwrap">
                    <div className="x-t2-plot">
                      <div className="x-t2-col">
                        <div className="x-t2-seg-product" style={{ height: 14 }} />
                        <div className="x-t2-seg-plan" style={{ height: 52 }} />
                        <div className="x-t2-seg-pack" style={{ height: 34 }} />
                      </div>
                      <div className="x-t2-col">
                        <div className="x-t2-seg-product" style={{ height: 18 }} />
                        <div className="x-t2-seg-plan" style={{ height: 60 }} />
                        <div className="x-t2-seg-pack" style={{ height: 28 }} />
                      </div>
                      <div className="x-t2-col">
                        <div className="x-t2-seg-product" style={{ height: 12 }} />
                        <div className="x-t2-seg-plan" style={{ height: 44 }} />
                        <div className="x-t2-seg-pack" style={{ height: 40 }} />
                      </div>
                      <div className="x-t2-tip">
                        <div className="x-t2-tip-title">Jun 2026</div>
                        <div className="x-t2-tip-total">
                          <span>Total</span>
                          <span>$3,190</span>
                        </div>
                        <div className="x-t2-tip-row">
                          <span
                            className="x-legend-dot"
                            style={{ backgroundColor: "#4a627f" }}
                          />
                          <span>Pack</span>
                          <em>$1,110</em>
                        </div>
                        <div className="x-t2-tip-row">
                          <span
                            className="x-legend-dot"
                            style={{ backgroundColor: "rgb(4, 240, 214)" }}
                          />
                          <span>Plan</span>
                          <em>$1,656</em>
                        </div>
                        <div className="x-t2-tip-row">
                          <span
                            className="x-legend-dot"
                            style={{ backgroundColor: "#c9adfb" }}
                          />
                          <span>Product</span>
                          <em>$424</em>
                        </div>
                      </div>
                      <IcCursor className="x-t2-cursor" />
                    </div>
                    <div className="x-t2-months">
                      <div>Jun</div>
                      <div>Jul</div>
                      <div>Aug</div>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* tile 3 : branded member app */}
            <button className="x-tile x-tile-h373 x-tile-coral" type="button">
              <div className="x-tile-head">
                <h3 className="x-tile-title">Your own branded member mobile app</h3>
                <span className="x-tile-zoom">
                  <IcMaximize style={{ width: 16, height: 16 }} />
                </span>
              </div>
              <div className="x-tile-body">
                <div className="x-t3-wrap">
                  <div className="x-t3-phones">
                    {/* second (branded login) phone: hidden at this breakpoint on the live page */}
                    <div className="x-phone x-hidden" style={{ zIndex: 0 }}>
                      <div className="x-ph-login-screen">
                        <div className="x-ph-wordmark">
                          <span>vibe</span>
                          <span>gym</span>
                        </div>
                        <div className="x-ph-tagline">Your branded member app</div>
                        <div className="x-ph-cta">Get started</div>
                        <div className="x-ph-cta2">Login</div>
                      </div>
                    </div>

                    <div className="x-phone">
                      <div className="x-phone-screen">
                        <div className="x-ph-top">
                          <div>
                            <div className="x-ph-hey">Hey Sarah</div>
                            <div className="x-ph-streak">
                              <IcZap style={{ width: 8, height: 8, fill: "currentColor" }} />
                              <span>1 weekly streak</span>
                            </div>
                          </div>
                          <div className="x-ph-bell">
                            <IcBell style={{ width: 16, height: 16 }} />
                            <span />
                          </div>
                        </div>

                        <div className="x-ph-checkin">
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="x-ph-checkin-label">Check in</div>
                            <div className="x-ph-gym">
                              <b>City Gym</b>
                              <span className="x-ph-divider" />
                              <span>Sydney CBD</span>
                            </div>
                          </div>
                          <IcQr style={{ width: 20, height: 20, color: "#000000" }} />
                        </div>

                        <div className="x-ph-section">Upcoming</div>

                        <div className="x-ph-upcoming">
                          <div className="x-ph-date">
                            <div className="x-ph-dow">MON</div>
                            <div className="x-ph-dom">16</div>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="x-ph-when">3:00pm - 4:00pm</div>
                            <div className="x-ph-class">Pilates Core</div>
                            <div className="x-ph-coach">Jenny Lee</div>
                          </div>
                          <IcChevronRightThin
                            style={{ width: 12, height: 12, opacity: 0.6 }}
                          />
                        </div>

                        <div className="x-ph-link">
                          <IcCalendar style={{ width: 16, height: 16, color: "#0b1421" }} />
                          <div>Book a session</div>
                          <IcChevronRightThin
                            style={{ width: 14, height: 14, color: "#0c1420" }}
                          />
                        </div>
                        <div className="x-ph-link">
                          <IcChartLine style={{ width: 16, height: 16, color: "#0b1421" }} />
                          <div>Track my stats</div>
                          <IcChevronRightThin
                            style={{ width: 14, height: 14, color: "#0c1420" }}
                          />
                        </div>
                        <div className="x-ph-link">
                          <IcWallet style={{ width: 16, height: 16, color: "#0b1421" }} />
                          <div>Memberships</div>
                          <IcChevronRightThin
                            style={{ width: 14, height: 14, color: "#0c1420" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* tile 4 : AI scheduling */}
            <button className="x-tile x-tile-wide x-tile-h373 x-tile-cream" type="button">
              <div className="x-tile-head">
                <h3 className="x-tile-title">Fill every class with smart AI scheduling</h3>
                <span className="x-tile-zoom">
                  <IcMaximize style={{ width: 16, height: 16 }} />
                </span>
              </div>
              <div className="x-tile-body">
                <div className="x-t4-pad">
                  <div className="x-t4-card">
                    <div className="x-t4-head">
                      <div className="x-t4-headleft">
                        <span className="x-t4-schedule">Schedule</span>
                        <span className="x-t4-date">Friday, 24 July</span>
                      </div>
                      <div className="x-t4-headright">
                        <span className="x-t4-chip">
                          New
                          <IcPlus style={{ width: 10, height: 10 }} />
                        </span>
                        <span className="x-t4-chip">Today</span>
                        <span className="x-t4-chip x-t4-chip-tight">
                          <IcChevronLeft style={{ width: 12, height: 12 }} />
                          <IcChevronRight style={{ width: 12, height: 12 }} />
                        </span>
                        <span className="x-t4-chip">
                          Day
                          <IcFunnel style={{ width: 10, height: 10 }} />
                        </span>
                      </div>
                    </div>

                    <div className="x-t4-grid">
                      <div className="x-t4-staffrow">
                        <div />
                        {STAFF.map((s) => (
                          <div className="x-t4-staff" key={s.name}>
                            <img src={s.img} alt={s.name} />
                            <span>{s.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="x-t4-body">
                        <div className="x-t4-times">
                          {[7, 8, 9, 10, 11, 12].map((h, i) => (
                            <div className="x-t4-time" key={h} style={{ top: px(i * HOUR) }}>
                              {h}:00
                            </div>
                          ))}
                        </div>
                        {SCHEDULE.map((col, ci) => (
                          <div className="x-t4-col" key={ci}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => (
                              <div
                                className="x-t4-hourline"
                                key={k}
                                style={{ top: px(k * 30) }}
                              />
                            ))}
                            {col.map((ev) => (
                              <div
                                className="x-ev"
                                key={ev.name}
                                style={{
                                  top: px(ev.top),
                                  height: px(ev.height),
                                  backgroundColor: ev.bg,
                                  borderColor: ev.border,
                                }}
                              >
                                <div className="x-ev-toprow">
                                  <span className="x-ev-time">{ev.time}</span>
                                  <span
                                    className="x-ev-dot"
                                    style={{ backgroundColor: ev.dot }}
                                  />
                                </div>
                                <div>
                                  <div className="x-ev-name">{ev.name}</div>
                                  <div className="x-ev-room">{ev.room}</div>
                                </div>
                                <div className="x-ev-botrow">
                                  <span className="x-ev-count">{ev.count}</span>
                                  <span
                                    className="x-ev-tag"
                                    style={{
                                      backgroundColor: ev.tagBg,
                                      color: ev.tagColor,
                                    }}
                                  >
                                    {ev.tag}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* tile 5 : CRM */}
            <button className="x-tile x-tile-h352 x-tile-lilac" type="button">
              <div className="x-tile-head">
                <h3 className="x-tile-title">A CRM built for member relationships</h3>
                <span className="x-tile-zoom">
                  <IcMaximize style={{ width: 16, height: 16 }} />
                </span>
              </div>
              <div className="x-tile-body">
                <div className="x-card x-t5-card">
                  {times(5).map((i) => (
                    <div className="x-t5-row" key={i}>
                      <img src={AV_MEMBER} alt="" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="x-t5-name">Maya P.</div>
                        <div className="x-t5-meta">Trial · Day 3</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </button>

            {/* tile 6 : leads */}
            <button className="x-tile x-tile-h352 x-tile-green" type="button">
              <div className="x-tile-head">
                <h3 className="x-tile-title">Turn leads into long-term members</h3>
                <span className="x-tile-zoom">
                  <IcMaximize style={{ width: 16, height: 16 }} />
                </span>
              </div>
              <div className="x-tile-body">
                <div className="x-t6-card">
                  <div className="x-t6-label">Campaign</div>
                  <div className="x-t6-name">Winter re-engage</div>
                  <div className="x-t6-stats">
                    <div className="x-t6-stat">
                      <b>62%</b>
                      <span>Open</span>
                    </div>
                    <div className="x-t6-stat">
                      <b>24%</b>
                      <span>Click</span>
                    </div>
                    <div className="x-t6-stat-green">
                      <b>148</b>
                      <span>Signups</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* tile 7 : access control */}
            <button className="x-tile x-tile-h352 x-tile-mauve" type="button">
              <div className="x-tile-head">
                <h3 className="x-tile-title">Secure access control that just works</h3>
                <span className="x-tile-zoom">
                  <IcMaximize style={{ width: 16, height: 16 }} />
                </span>
              </div>
              <div className="x-tile-body">
                <div className="x-card x-t7-card">
                  <div className="x-t7-head">
                    <div className="x-t7-shield">
                      <IcShieldCheck style={{ width: 20, height: 20 }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="x-t7-title">Self check-in</div>
                    </div>
                  </div>
                  <div className="x-t7-rows">
                    <div className="x-t7-cell x-t7-cell-first">Alex R.</div>
                    <div className="x-t7-cell">09:04am</div>
                    <div className="x-t7-cell">Unlimited</div>
                    <span className="x-t7-check">
                      <IcCheck style={{ width: 14, height: 14 }} />
                    </span>

                    <div className="x-t7-cell x-t7-cell-first">Maya P.</div>
                    <div className="x-t7-cell">09:07am</div>
                    <div className="x-t7-cell">10-pack</div>
                    <span className="x-t7-refund">-$12.50</span>

                    <div className="x-t7-cell x-t7-cell-first">Jordan K.</div>
                    <div className="x-t7-cell">09:12am</div>
                    <div className="x-t7-cell">Trial</div>
                    <span className="x-t7-check">
                      <IcCheck style={{ width: 14, height: 14 }} />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ================= 04 why xoda ================= */}
      <section className="x-why">
        <div className="x-container">
          <div className="x-center-copy">
            <div className="x-eyebrow">Why XODA</div>
            <h2 className="x-h2">
              Made for the way
              <br />
              fitness actually works.
            </h2>
            <p className="x-lede">
              A platform that respects your operators, your members and your margins.
            </p>
          </div>
          <div className="x-why-grid">
            {times(4).map((i) => (
              <div className="x-shadowcard" key={i}>
                <div className="x-shadowcard-back" />
                <div className="x-shadowcard-face">
                  <div className="x-why-icon">
                    <IcLayers style={{ width: 20, height: 20 }} />
                  </div>
                  <h3 className="x-why-h3">One platform</h3>
                  <p className="x-why-p">
                    Replace a stack of disconnected tools with one connected platform your team
                    actually enjoys using.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 05 modules ================= */}
      <section className="x-modules" id="features">
        <div className="x-container">
          <div className="x-center-copy">
            <div className="x-eyebrow">One platform</div>
            <h2 className="x-h2">Everything you need to grow.</h2>
            <p className="x-lede">
              Ten deeply-integrated modules that replace the tangle of subscriptions running your
              business today.
            </p>
          </div>
          <div className="x-modules-grid">
            {times(10).map((i) => (
              <a className="x-module" href="/features/membership-management" key={i}>
                <div className="x-module-top">
                  <span className="x-module-icon">
                    <IcCreditCard style={{ width: 16, height: 16 }} />
                  </span>
                  <IcArrowUpRight2
                    className="x-module-arrow"
                    style={{ width: 16, height: 16 }}
                  />
                </div>
                <h3 className="x-module-h3">Membership Management</h3>
                <p className="x-module-p">
                  Recurring plans, contracts, freezes, upgrades and renewals.
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 06 solutions ================= */}
      <section className="x-solutions">
        <div className="x-container">
          <div className="x-center-copy">
            <div className="x-eyebrow">Built for your business</div>
            <h2 className="x-h2">Purpose-built for what you do.</h2>
            <p className="x-lede">
              From single-location studios to global multi-site operators, XODA adapts to your
              model.
            </p>
          </div>
          <div className="x-solutions-grid">
            {times(8).map((i) => (
              <a className="x-sol" href="/solutions/gyms" key={i}>
                <div className="x-shadowcard-back" />
                <div className="x-sol-face">
                  <div className="x-sol-icon">
                    <IcDumbbell style={{ width: 20, height: 20 }} />
                  </div>
                  <div className="x-sol-foot">
                    <span className="x-sol-name">Gyms</span>
                    <span className="x-sol-arrow">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="x-viewall">
            <a href="/solutions">View all solutions →</a>
          </div>
        </div>
      </section>

      {/* ================= 07 testimonials ================= */}
      <section className="x-testimonials">
        <div className="x-container">
          <div className="x-center-copy">
            <div className="x-eyebrow">Loved by gym operators</div>
            <h2 className="x-h2">What our customers say.</h2>
          </div>
          <div className="x-carousel">
            <div className="x-carousel-nav">
              <button type="button" aria-label="Previous">
                <IcChevronLeft style={{ width: 32, height: 32 }} />
              </button>
              <button type="button" aria-label="Next">
                <IcChevronRight style={{ width: 32, height: 32 }} />
              </button>
            </div>
            <div className="x-carousel-track">
              {times(6).map((i) => (
                <div className="x-quote" key={i}>
                  <div className="x-quote-tag">
                    <div>
                      <span>Seamless scheduling</span>
                    </div>
                  </div>
                  <figure className="x-quote-fig">
                    <blockquote className="x-quote-text">
                      “ Since switching to XODA we&apos;ve seen our revenue increase, and the
                      scheduling is seamless. It&apos;s a fun, interactive app, my members message
                      each other and stay accountable. ”
                    </blockquote>
                    <figcaption className="x-quote-cap">
                      <div className="x-quote-name">Rehub Wellness</div>
                      <div className="x-quote-role">Chris B , Co-Founder &amp; CEO</div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
            <div className="x-dots">
              <button type="button" className="x-dot x-dot-wide" aria-label="Slide 1">
                <span className="x-dot-fill" style={{ width: 80, backgroundColor: "#0c1421" }} />
              </button>
              <button
                type="button"
                className="x-dot x-dot-sm"
                aria-label="Slide 2"
                style={{ backgroundColor: "#545e6f" }}
              />
            </div>
          </div>
          <div className="x-storylink">
            <a href="/customers">
              See customer success stories
              <IcArrowRight style={{ width: 16, height: 16 }} />
            </a>
          </div>
        </div>
      </section>

      {/* ================= 08 pricing ================= */}
      <section className="x-pricing">
        <div className="x-container">
          <div className="x-center-copy">
            <div className="x-eyebrow">Pricing</div>
            <h2 className="x-h2">Simple, transparent pricing.</h2>
            <p className="x-lede">
              Choose a plan that fits your business. No hidden fees, no surprises.
            </p>
          </div>

          <div className="x-currency">
            <span className="x-currency-label">Show prices in</span>
            <button type="button" className="x-currency-select">
              <span>AUD</span>
              <IcChevronDown style={{ width: 16, height: 16, opacity: 0.5 }} />
            </button>
          </div>

          <div className="x-plans">
            {times(4).map((i) => (
              <div className="x-plan" key={i}>
                <div className="x-plan-back" />
                <div className="x-plan-face">
                  <div className="x-plan-badge">Free forever</div>
                  <h3 className="x-plan-name">Freemium</h3>
                  <p className="x-plan-blurb">Run your business from one portal, free forever.</p>
                  <div className="x-plan-priceline">
                    <span className="x-plan-price">$0</span>
                  </div>
                  <div className="x-plan-note">Free forever</div>
                  <a className="x-plan-cta" href="/pricing#compare">
                    View features
                  </a>
                  <div className="x-plan-rule" />
                  <ul className="x-plan-feats">
                    {times(7).map((j) => (
                      <li className="x-plan-feat" key={j}>
                        <span className="x-plan-tick">
                          <IcCheckBold style={{ width: 12, height: 12 }} />
                        </span>
                        <span>XODA web portal + XODA member mobile app</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="x-tax">Prices exclude applicable taxes.</p>

          <div className="x-compare-cta">
            <a className="x-btn-dark" href="/pricing#compare">
              <span className="x-btn-knob">
                <IcArrowUpRight style={{ width: 26, height: 26 }} />
              </span>
              <span>See full plan comparison</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= 09 comparisons ================= */}
      <section className="x-compare">
        <div className="x-container">
          <div className="x-center-copy">
            <div className="x-eyebrow">Compare</div>
            <h2 className="x-h2">How XODA measures up.</h2>
            <p className="x-lede">
              See how XODA compares to the platforms our customers switched from.
            </p>
          </div>
          <div className="x-compare-carousel">
            <div className="x-carousel-nav">
              <button type="button" aria-label="Previous">
                <IcChevronLeft style={{ width: 32, height: 32 }} />
              </button>
              <button type="button" aria-label="Next">
                <IcChevronRight style={{ width: 32, height: 32 }} />
              </button>
            </div>
            <div className="x-carousel-track">
              {times(11).map((i) => (
                <a className="x-cmp" href="/compare/xoda-vs-mindbody" key={i}>
                  <div className="x-cmp-title">
                    XODA <span className="x-vs">vs</span>{" "}
                    <span className="x-strike">Mindbody</span>
                  </div>
                  <p className="x-cmp-p">
                    A modern, faster alternative built for today&apos;s fitness businesses.
                  </p>
                  <div className="x-cmp-read">
                    Read comparison
                    <IcArrowRight style={{ width: 16, height: 16 }} />
                  </div>
                </a>
              ))}
            </div>
            <div className="x-dots">
              <button
                type="button"
                className="x-dot x-dot-sm"
                aria-label="Slide 1"
                style={{ backgroundColor: "rgb(255, 145, 130)" }}
              />
              <button type="button" className="x-dot x-dot-wide" aria-label="Slide 2" />
              <button
                type="button"
                className="x-dot x-dot-sm"
                aria-label="Slide 3"
                style={{ backgroundColor: "#bc98f9" }}
              >
                <span className="x-dot-fill" style={{ width: 40, backgroundColor: "#bc98f9" }} />
              </button>
              <button
                type="button"
                className="x-dot x-dot-sm"
                aria-label="Slide 4"
                style={{ backgroundColor: "rgb(159, 235, 77)" }}
              />
            </div>
          </div>
          <div className="x-compare-all">
            <a href="/compare">View all comparisons →</a>
          </div>
        </div>
      </section>

      {/* ================= 10 watch how it works ================= */}
      <section className="x-video">
        <div className="x-container">
          <div className="x-center-copy">
            <div className="x-eyebrow">See XODA in action</div>
            <h2 className="x-h2">Watch how it works</h2>
            <p className="x-lede">
              A quick look at how XODA brings your gym, studio or wellness business together in one
              place.
            </p>
          </div>
          <div className="x-video-frame">
            <div className="x-video-inner" />
          </div>
        </div>
      </section>

      {/* ================= 11 faq ================= */}
      <section className="x-faq">
        <div className="x-container">
          <div className="x-faq-eyebrow">FAQ</div>
          <h2 className="x-faq-h2">Everything you need to know</h2>
          <div className="x-faq-list">
            {times(8).map((i) => (
              <div className="x-faq-item" key={i}>
                <h3 className="x-faq-q">
                  <button type="button">
                    What is gym and fitness management software?
                    <IcChevronDown style={{ width: 16, height: 16 }} />
                  </button>
                </h3>
                <div className="x-faq-a">
                  Gym and fitness management software helps fitness businesses manage day-to-day
                  operations from one platform. XODA brings together membership management, class
                  scheduling, online bookings, payments, staff management, reporting and member
                  engagement, helping reduce admin and create a better experience
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 12 final cta ================= */}
      <section className="x-final">
        <div className="x-container x-final-inner">
          <div className="x-center-copy">
            <h2 className="x-final-h2">Ready to grow your fitness business?</h2>
            <p className="x-final-p">
              See how XODA can help you streamline operations, engage members and grow with one
              powerful platform.
            </p>
          </div>
          <div className="x-final-cta">
            <a className="x-btn-dark" href="/book-a-demo">
              <span className="x-btn-knob">
                <IcArrowUpRight style={{ width: 26, height: 26 }} />
              </span>
              <span>Book a demo</span>
            </a>
            <a className="x-btn-outline" href="/create-account">
              Get started free
            </a>
          </div>
        </div>
      </section>

      {/* ================= 13 footer ================= */}
      <footer className="x-footer">
        <div className="x-container x-footer-inner">
          <div className="x-footer-grid">
            <div className="x-footer-brand">
              <a className="x-footer-logo" href="/">
                <img src={LOGO_URL} alt="XODA gym management software" />
              </a>
              <p className="x-footer-blurb">
                The all-in-one platform for gyms, studios and wellness businesses in Australia, NZ,
                Asia, UK and USA.
              </p>
              <div className="x-footer-social">
                {times(4).map((i) => (
                  <a href="https://www.instagram.com/xoda_com" key={i} aria-label="Instagram">
                    <IcInstagram />
                  </a>
                ))}
              </div>
            </div>
            {times(4).map((i) => (
              <div key={i}>
                <h3 className="x-footer-h3">Product</h3>
                <ul className="x-footer-list">
                  {times(4).map((j) => (
                    <li key={j}>
                      <a href="/features">Features</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="x-footer-legal">© 2026 XODA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
