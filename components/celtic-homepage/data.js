// Page content mirrored from celticfc.com. Assets point at the club's own CDN /
// origin so the replica renders identically without shipping any binaries.

const SITE = "https://www.celticfc.com"

export const asset = (path) => `${SITE}${path}`
export const site = (path) => `${SITE}${path}`

export const globalNavLinks = [
  { label: "Celticfc.com", href: site("/") },
  {
    label: "Tickets",
    href: "https://www.eticketing.co.uk/celtic/?utm_source=celticfc&utm_medium=referral&utm_campaign=nav_link",
  },
  {
    label: "Store",
    href: "https://store.celticfc.com/?utm_source=club&utm_medium=referral&utm_campaign=nav_link",
  },
  { label: "CelticPlayer", href: "https://player.celticfc.com/" },
]

export const primaryNavLinks = [
  { label: "News", href: site("/news") },
  { label: "Tickets", href: site("/tickets") },
  { label: "Hospitality", href: site("/hospitality") },
  { label: "Fixtures", href: site("/fixtures") },
  { label: "Teams", href: site("/teams") },
  { label: "Shop", href: site("/shop-celtic") },
  { label: "Visit Celtic Park", href: site("/visit-celtic-park") },
]

export const headerSponsors = [
  { name: "Adidas", href: "https://www.adidas.co.uk/football", logo: asset("/sponsors/header/adidas.png") },
  { name: "Dafabet", href: "https://dafa.io/celtic-matchday", logo: asset("/sponsors/header/dafabet.png") },
]

export const hero = {
  imageLarge:
    "https://images.webapi.gc.celticfc.com/fit-in/1600x1600/f60d3530-a7a1-11f1-9d81-1d642e8c9242.jpg",
  imageSmall:
    "https://images.webapi.gc.celticfc.com/fit-in/900x900/fcbacd70-a7a1-11f1-9d81-1d642e8c9242.jpg",
  icon: "video-a",
  dateTime: "2026-09-03T14:51:52Z",
  date: "03 Sep 2026",
  category: "Featured",
  title: "Oliver Sørensen: This Celtic team is full of quality",
  summary: "Danish midfielder delighted to make his debut for the Hoops",
  href: site("/news/2026/september/03/oliver-s-rensen--/"),
}

export const additionalArticles = [
  {
    icon: "video-a",
    dateTime: "2026-09-03T13:53:28Z",
    date: "03 Sep 2026",
    category: "First Team",
    title: "Sam Johnstone’s start to life as a Celt",
    href: site("/news/2026/september/03/sam-johnstone-s-start-to-life-as-a-celt/"),
    image: "https://images.webapi.gc.celticfc.com/fit-in/1000x1000/6ad129c0-a79e-11f1-a4be-eb76b1259b92.jpg",
    thumb: "https://images.webapi.gc.celticfc.com/fit-in/600x600/6ad129c0-a79e-11f1-a4be-eb76b1259b92.jpg",
  },
  {
    icon: "camera-a",
    dateTime: "2026-09-03T09:44:10Z",
    date: "03 Sep 2026",
    category: "Galleries",
    title: "Match Gallery: Celtic v Aberdeen",
    href: site("/news/2026/september/03/match-gallery--celtic-v-aberdeen/"),
    image: "https://images.webapi.gc.celticfc.com/fit-in/1000x1000/5a0e5220-a77b-11f1-9222-27a7c983d175.jpg",
    thumb: "https://images.webapi.gc.celticfc.com/fit-in/600x600/5a0e5220-a77b-11f1-9222-27a7c983d175.jpg",
  },
  {
    icon: "article-a",
    dateTime: "2026-09-02T21:56:38Z",
    date: "02 Sep 2026",
    category: "First Team",
    title: "Welcome to Celtic, Jordan Lotomba",
    href: site("/news/2026/september/02/welcome-to-celtic--jordan-lotomba/"),
    image: "https://images.webapi.gc.celticfc.com/fit-in/1000x1000/3ceb7180-a719-11f1-b83a-f5543210d559.jpg",
    thumb: "https://images.webapi.gc.celticfc.com/fit-in/600x600/3ceb7180-a719-11f1-b83a-f5543210d559.jpg",
  },
  {
    icon: "article-a",
    dateTime: "2026-09-02T21:41:09Z",
    date: "02 Sep 2026",
    category: "First Team",
    title: "Manager pleased with performance over Aberdeen",
    href: site("/news/2026/september/02/manager-pleased-with-performance-over-aberdeen/"),
    image: "https://images.webapi.gc.celticfc.com/fit-in/1000x1000/fe2cbd20-a716-11f1-a2c4-efd9c20141a1.jpg",
    thumb: "https://images.webapi.gc.celticfc.com/fit-in/600x600/fe2cbd20-a716-11f1-a2c4-efd9c20141a1.jpg",
  },
]

export const advert = {
  href: site("/tickets/europa-league-four-match-package-tickets/"),
  image: "https://images.webapi.gc.celticfc.com/fit-in/750x750/b942be40-a774-11f1-848e-b7807132b399.gif",
}

export const latestResult = {
  competition: "Scottish Premiership",
  competitionIcon:
    "https://images.webapi.gc.celticfc.com/fit-in/160x160/SPL-2021-White-Outline.png",
  background: "https://images.webapi.gc.celticfc.com/e902de10-6ec4-11f0-bbb6-038531c69efc.jpg",
  kickoffTime: "19:45",
  kickoffDate: "Wed 2 Sep",
  venue: "Celtic Park",
  homeCrest:
    "https://images.webapi.gc.celticfc.com/fit-in/200x200/794c1e80-572a-11f0-a67f-ddadc7c5dfab.png",
  awayCrest:
    "https://images.webapi.gc.celticfc.com/fit-in/200x200/3b1ea0ed-5f37-47e9-9274-baad07b977be.png",
  homeTeam: "Celtic",
  awayTeam: "Aberdeen",
  score: "3 - 0",
  matchCentreHref: site("/match"),
}

export const playerProfile = {
  image: "https://images.webapi.gc.celticfc.com/838c4720-a6c6-11f1-809e-13de088dfd17.png",
  firstName: "Camilo",
  lastName: "Durán",
  position: "Striker",
  number: "11",
  shirtHref:
    "https://store.celticfc.com/collections/home-kit?utm_source=club&utm_medium=referral&utm_campaign=homepage_profile",
  profileHref: site("/players/camilo-duran"),
}

export const videos = [
  { id: "gspLwzdAvDg", title: "Full Media Conference | Oliver Sørensen speaks to the media (03/08/26)" },
  { id: "oMC-sxdSnvY", title: "Full Media Conference | Sam Johnstone speaks to the media for the first time as a Celt (03/08/26)" },
  { id: "flDUK3gU2Mw", title: "Exclusive Interview | King Kenny Dalglish (02/09/26)" },
  { id: "G1Pju5Khvh0", title: "Unique Angle: Celtic 3-0 Aberdeen | 3 goals and 3 points for the Hoops at Paradise (02/09/26)" },
  { id: "VEW4t9K3pHw", title: "Full Media Conference | Liam Scales speaks to the media following tonight’s victory (02/09/26)" },
  { id: "dwuVH4kVC4U", title: "Full Media Conference | Martin O’Neill | Three goals and three points for the Hoops at Paradise" },
  { id: "tRqILNLb2xc", title: "On the Match | Alex Oxlade-Chamberlain and back-to-back Man of the Match winner Camilo Durán" },
  { id: "ldvgDXokyZ4", title: "On the Match | Martin O’Neill gives his verdict on a convincing victory (02/09/26)" },
  { id: "5BTSa4FRp2Q", title: "Classic Match | Celtic 3-2 Aberdeen (27/09/08) | Five-Goal Thriller at Paradise!" },
  { id: "WnbWv9ecaog", title: "Matchday Paradise: Celtic v Falkirk (29/08/26)" },
  { id: "KLoWr6-s35M", title: "First interview | Oliver Sørensen (01/09/26)" },
  { id: "SgHpKXZHsYM", title: "Full Media Conference | Shaun Maloney speaks to the media ahead of Aberdeen (01/09/26)" },
]

export const products = [
  {
    name: "HOME SHIRT 26/27",
    image: asset("/products/homepage/home-shirt-26-27.png"),
    href: "https://store.celticfc.com/pages/home-kit?utm_source=club&utm_medium=referral&utm_content=home&utm_campaign=home_kit_pre_order_26",
  },
  {
    name: "Away Shirt 26/27",
    image: asset("/products/homepage/away-kit-2026.png"),
    href: "https://store.celticfc.com/collections/away-kit?utm_source=club&utm_medium=referral&utm_content=kits_grid&utm_campaign=away_kit_out_now_26",
  },
  {
    name: "Third Kit 26/27",
    image: asset("/products/homepage/27-third-kit.png"),
    href: "https://store.celticfc.com/collections/third-kit?utm_source=club&utm_medium=referral&utm_content=kits_grid&utm_campaign=third_kit_out_now_26",
  },
  {
    name: "Goalkeeper Kit 26/27",
    image: asset("/products/homepage/27-goalkeeper-kit.png"),
    href: "https://store.celticfc.com/collections/goalkeeper-kit?utm_source=club&utm_medium=referral&utm_content=kits_grid&utm_campaign=goalkeeper_kit_out_now_26",
  },
]

export const lightPromos = [
  "https://images.webapi.gc.celticfc.com/fit-in/1600x1600/db5d6a60-8664-11f1-9c6c-c1db5892e660.jpg",
  "https://images.webapi.gc.celticfc.com/fit-in/1600x1600/8c4ef660-450a-11f0-af48-11f9af268add.png",
]

export const honours = [
  { name: "League Champions", image: asset("/content/ScottishLeague.png"), stat: "56" },
  { name: "Scottish Cup Winners", image: asset("/content/ScottishCup.png"), stat: "43" },
  { name: "League Cup Winners", image: asset("/content/ScottishLeagueCup.png"), stat: "22" },
  { name: "European Cup Winners", image: asset("/content/EuropeanCup.png"), stat: "'67" },
]

export const darkPromos = [
  { heading: "Celtic FC Pools", image: asset("/promos/homepage/pools-promo.png?1") },
  { heading: "Celtic FC Foundation", image: asset("/promos/homepage/foundation-promo.png?1") },
]

export const adModule = [
  {
    href: "https://store.celticfc.com/pages/away-kit?utm_source=club&utm_medium=referral&utm_content=sitewide_ad&utm_campaign=away_kit_out_now_26",
    image: "https://images.webapi.gc.celticfc.com/fit-in/1600x1600/db5d6a60-8664-11f1-9c6c-c1db5892e660.jpg",
  },
  {
    href: site("/news/2026/july/28/download--switch-on--breaking-news-straight-to-your-phone/"),
    image: "https://images.webapi.gc.celticfc.com/fit-in/1600x1600/f793fe00-2936-11f1-98b1-31542baa8791.jpg",
  },
  {
    href: "https://player.celticfc.com/",
    image: "https://images.webapi.gc.celticfc.com/fit-in/1600x1600/1dff5e30-a7aa-11f1-9980-ff0932d5c780.jpg",
  },
]

export const footerSponsorRows = [
  {
    title: "A CLUB LIKE NO OTHER",
    sponsors: [
      {
        name: "Adidas",
        href: "https://www.adidas.co.uk/football",
        logo: "https://images.webapi.gc.celticfc.com/fit-in/400x400/f41b5e40-0c2d-11ee-843f-f5405c6e8a0f.png",
      },
      {
        name: "Dafabet",
        href: "https://www.dafabet.co.uk/",
        logo: "https://images.webapi.gc.celticfc.com/fit-in/400x400/8d49cd00-49e3-11eb-9a64-eb64c969dea9.png",
      },
    ],
  },
  {
    title: null,
    sponsors: [
      {
        name: "JD Sports",
        href: "https://www.jdsports.co.uk/",
        logo: "https://images.webapi.gc.celticfc.com/fit-in/400x400/ef7a36e0-49e3-11eb-9a64-eb64c969dea9.png",
      },
      {
        name: "William Hill Scottish Premiership",
        href: "https://www.williamhill.com/",
        logo: "https://images.webapi.gc.celticfc.com/fit-in/400x400/b9015550-79b1-11f0-a714-afe58d530475.png",
      },
      {
        name: "Sky Sports",
        href: "https://www.skysports.com/",
        logo: "https://images.webapi.gc.celticfc.com/fit-in/400x400/7640c720-49e4-11eb-9a64-eb64c969dea9.png",
      },
      {
        name: "Premier Sports",
        href: "https://www.premiersports.com/",
        logo: "https://images.webapi.gc.celticfc.com/fit-in/400x400/d348a940-8f31-11f1-8a2f-f339b68e23b0.png",
      },
    ],
  },
]

export const socialChannels = [
  { name: "Facebook", icon: "facebook-a", href: "https://www.facebook.com/CelticFC" },
  { name: "X", icon: null, href: "https://twitter.com/CelticFC", custom: "x" },
  { name: "Threads", icon: null, href: "https://www.threads.net/@celticfc", custom: "threads" },
  { name: "Instagram", icon: "instagram-a", href: "https://www.instagram.com/celticfc/" },
  { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/CelticFC" },
  { name: "Snapchat", icon: "snapchat", href: "https://www.snapchat.com/add/celticfc" },
  { name: "Tiktok", icon: "tiktok-a", href: "https://www.tiktok.com/@celticfc?lang=en" },
  { name: "Linkedin", icon: "linkedin", href: "https://www.linkedin.com/company/celtic-football-club/" },
  { name: "Weibo", icon: "weibo", href: "https://www.weibo.com/OfficialCelticfc" },
]

// The two social marks celticfc.com draws with bespoke multi-path SVGs.
export const socialCustomPaths = {
  x: {
    viewBox: "0 0 24 24",
    clip: "M0 0h23.472v24H0z",
    d: "M13.969 10.157 22.707 0h-2.07l-7.588 8.82L6.99 0H0l9.164 13.336L0 23.988h2.07l8.013-9.314 6.4 9.314h6.989l-9.504-13.83h.001Zm-2.836 3.297-.929-1.328L2.817 1.559h3.18l5.962 8.528.929 1.328 7.75 11.085h-3.181l-6.324-9.046Z",
  },
  threads: {
    viewBox: "0 0 24 24",
    clip: "M1 0h21.072v24H1z",
    d: "M11.72 24h-.006c-3.581-.024-6.334-1.205-8.184-3.509-1.644-2.052-2.494-4.905-2.523-8.481v-.017c.029-3.579.879-6.43 2.525-8.482C5.38 1.205 8.135.024 11.714 0h.014c2.746.02 5.042.725 6.826 2.098 1.677 1.29 2.858 3.13 3.508 5.467l-2.04.569c-1.104-3.96-3.897-5.984-8.304-6.015-2.908.022-5.11.936-6.54 2.717C3.842 6.504 3.15 8.914 3.124 12c.026 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.141 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.019.142c-.125-.742-.374-1.332-.749-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.845 0-1.992.232-2.721 1.32L7.269 7.847c.979-1.454 2.568-2.256 4.478-2.256h.043c3.195.02 5.098 1.975 5.288 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.095 2.628-7.277 2.65h-.007Zm1.004-11.69c-.242 0-.487.007-.74.021-1.835.103-2.98.946-2.915 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.817-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221Z",
  },
}

export const signForCeltic = {
  logo: asset("/sign-for-celtic/sign-for-celtic@2x.png"),
  title: "Enter now for your chance to be a winner",
  text: "Our exclusive 'SIGN FOR CELTIC' competitions with the chance to win some fantastic prizes.",
  href: site("/sign-for-celtic"),
}

export const footerMenu = [
  {
    heading: "Official Celtic FC Website",
    links: [
      { label: "Terms of Use", href: site("/help-and-faqs/website-terms-of-use") },
      { label: "Privacy Policy", href: site("/help-and-faqs/privacy-policy") },
      { label: "Modern Slavery Statement", href: site("/help-and-faqs/modern-slavery-statement") },
      { label: "Cookie Policy", href: site("/help-and-faqs/cookie-policy") },
      { label: "Safeguarding Policy", href: site("/club/safeguarding") },
      { label: "Accessibility", href: site("/help-and-faqs") },
    ],
  },
  {
    heading: null,
    links: [
      { label: "Working at Celtic FC", href: site("/club/jobs-at-celtic") },
      { label: "Investor Relations", href: site("/club/celtic-plc-investor-relations") },
      { label: "Celtic FC Pools", href: site("/celtic-pools") },
      { label: "Celtic FC Foundation", href: "https://charity.celticfc.com" },
      { label: "Contact Us", href: site("/help-and-faqs") },
    ],
  },
  {
    heading: "Quick Links",
    links: [
      { label: "Visit Celtic Park", href: site("/visit-celtic-park") },
      { label: "CelticPlayer", href: "https://player.celticfc.com/" },
      { label: "Shop", href: site("/shop-celtic") },
      { label: "Celtic View", href: site("/shop-celtic/publications") },
      { label: "Celtic Soccer Academy", href: site("/club/celtic-soccer-academy") },
    ],
  },
  {
    heading: null,
    links: [
      { label: "News", href: site("/news") },
      { label: "Fixtures", href: site("/fixtures") },
      { label: "Teams", href: site("/teams") },
      { label: "Tickets", href: site("/tickets") },
      { label: "Hospitality", href: site("/hospitality") },
    ],
  },
]
