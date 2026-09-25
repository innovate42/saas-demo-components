// ------------------------------------------------------------------ //
// Copy, nav trees and image URLs for the Millwall memberships replica.
//
// Everything here is transcribed verbatim from
// https://www.eticketing.co.uk/millwallfc/Memberships/List — including
// the club's own inconsistencies, which are deliberate:
//   - card 2 renders its section headings unbolded while cards 1 and 3
//     bold theirs (hence `boldHeadings`)
//   - the Information submenu really does read "Supporter Infomation"
// Images hot-link the club's own Ticketmaster CDN so they always match
// the live page.
// ------------------------------------------------------------------ //

const CDN = "https://media.tmtickets.co.uk/uk_millwallfc/en-gb/assets"

export const IMAGES = {
  logo: `${CDN}/logo-redesign.png?etag=fbd0c5264738f76f419a69b8fae8e7da`,
  hero: `${CDN}/membership_heroimage_desktop.jpg?etag=f33989989829b0db76ad1106975428ab`,
  official: `${CDN}/membershiptype22.jpg?etag=42370a527da0e0ca7c11d42dc3f40617`,
  wallwide: `${CDN}/membershiptype24.jpg?etag=4f038308862e0ae9aecf35b8e3525784`,
  junior: `${CDN}/membershiptype23.jpg?etag=91e784cd0d31afb8fc3c1fff1789be7e`,
  sponsors: [
    { alt: "SBK", src: `${CDN}/firstlevellogo1.png?etag=880cdaa9233ce0d40cc150224b8c5e64` },
    { alt: "Errea", src: `${CDN}/firstlevellogo2.png?etag=a55d0de14ebd7f1ce6d11b7eec7a12b5` },
    { alt: "Wiggett", src: `${CDN}/firstlevellogo3.png?etag=d8e5224020159ce2fc155670e5e13623` },
    { alt: "FXD Capital", src: `${CDN}/firstlevellogo4.png?etag=823253c6a9c030860f21a92fcfaf8744` },
  ],
}

export const TOP_BAR = { backLabel: "Back to main site", mode: "Tickets" }

export const BRAND = { title: "Official Ticketing Website", description: "Millwall FC" }

export const NAV = [
  {
    label: "Tickets",
    sub: ["All Matches", "Away Games", "Home Games", "Hospitality", "Stadium Tours"],
  },
  { label: "Memberships", sub: null },
  { label: "Hospitality & Experiences", sub: null },
  { label: "Information", sub: ["My Network Guide", "Supporter Infomation"] },
]

export const GROUP_TITLE = "Club Memberships"

const TICKETING_CORE = [
  "Priority period for home games* - NEW",
  "Priority period for ticket exchange* - NEW",
  "Access to purchase away game tickets*",
]

export const MEMBERSHIPS = [
  {
    id: "official",
    image: IMAGES.official,
    imageAlt: "membershiptype22.jpg",
    mostPopular: true,
    title: "26/27 Official Membership",
    subtitle: null,
    boldHeadings: true,
    sections: [
      {
        heading: "Ticketing",
        items: [
          ...TICKETING_CORE,
          "£6 reduction on match ticket prices**",
          "10 loyalty points",
        ],
      },
      {
        heading: "Discounts",
        items: [
          "10% off Venue Room Hire*** - NEW",
          "5% off Matchday Hospitality",
          "Discounts on Stadium Tours",
          "Exclusive Lions Store promotions",
        ],
      },
      {
        heading: "Fan Engagement",
        items: [
          "Monthly e-mail membership newsletter - NEW",
          "Access to 'Arry's Bar on a matchday (over 14s only)",
          "Invitation to an Open Training Session at The Den",
          "Welcome booklet",
          "Physical membership card",
        ],
      },
    ],
    footnotes: [
      "*Subject to availability or additional conditions",
      "**When purchased in advance of matchday",
      "***T&C's: Minimum numbers and bar spend apply",
    ],
    levels: [
      "Over 65 - *£37.00 ",
      "18-21 - *£37.00 ",
      "Armed Forces - *£37.00 ",
      "Adult - *£37.00 ",
    ],
  },
  {
    id: "wallwide",
    image: IMAGES.wallwide,
    imageAlt: "membershiptype24.jpg",
    mostPopular: false,
    title: "26/27 Wallwide Membership",
    subtitle: "(INTERNATIONAL FANS ONLY)",
    boldHeadings: false,
    sections: [
      {
        heading: "Ticketing",
        items: [
          ...TICKETING_CORE,
          "£6 reduction on match ticket prices**",
          "10 loyalty points",
        ],
      },
      {
        heading: "Discounts",
        items: [
          "10% off Venue Room Hire*** - NEW",
          "50% off Millwall TV+",
          "5% off matchday hospitality",
          "Discounts on Stadium Tours",
          "Exclusive Lions Store promotions",
        ],
      },
      {
        heading: "Fan Engagement",
        items: [
          "Monthly e-mail membership newsletter - NEW",
          "Sign-up video message - NEW",
          "Exclusive gift - NEW",
          "Draw to win a matchday pitchside experience**** - NEW",
          "Access to 'Arry's Bar on a matchday (over 14s only)*",
          "Invitation to an Open Training Session at The Den",
          "Welcome booklet",
          "Physical membership card",
        ],
      },
    ],
    footnotes: [
      "*Subject to availability or additional conditions",
      "**When purchased in advance of matchday",
      "***T&C's: Minimum numbers and bar spend apply",
      "****Match tickets need to be purchased in advance to be eligible for the draw",
    ],
    levels: [
      "Over 65 - *£42.00 ",
      "18-21 - *£42.00 ",
      "Armed Forces - *£42.00 ",
      "Adult - *£42.00 ",
    ],
  },
  {
    id: "junior",
    image: IMAGES.junior,
    imageAlt: "membershiptype23.jpg",
    mostPopular: false,
    title: "26/27 Junior Membership",
    subtitle: null,
    boldHeadings: true,
    sections: [
      {
        heading: "Ticketing",
        items: [
          ...TICKETING_CORE,
          "£5 reduction on match ticket prices**",
          "FREE entry to Under 21s matches at The Den",
          "10 loyalty points",
        ],
      },
      {
        heading: "Discounts",
        items: [
          "5% off matchday hospitality",
          "Discounts on Stadium Tours",
          "Exclusive Lions Store promotions",
        ],
      },
      {
        heading: "Fan Engagement",
        items: [
          "Digital squad poster - NEW",
          "Monthly e-mail membership newsletter - NEW",
          "E-mail video birthday message - NEW",
          "E-mail video Christmas message - NEW",
          "Entry to a matchday mascot draw***",
          "Opportunity to be a ballboy/girl***",
          "Invitation to an Open Training Session at The Den",
          "Invitation to exclusive Junior Lion events",
          "Access to 'Arry's Bar on a matchday (over 14s only)*",
          "Certificate (under 14s)/letter from the Head Coach (under 18s)",
          "Welcome booklet",
          "Physical membership card",
        ],
      },
    ],
    footnotes: [
      "*Subject to availability or additional conditions",
      "**When purchased in advance of matchday",
      "***Age restrictions apply",
    ],
    levels: ["Under 6 - *£20.00 ", "Under 18 - *£20.00 ", "Under 14 - *£20.00 "],
  },
]

export const FEES = {
  note: "Membership prices exclusive of delivery, payment and/or admin fees.",
  link: "View additional fees",
  booking: "Booking Fee up to",
  bookingValue: " £2.00",
  delivery: "Delivery Fee up to",
  deliveryValue: " £4.00",
}

export const FOOTER_LINKS = [
  "Terms & Conditions",
  "Privacy Policy",
  "Contact Us",
  "FAQs",
  "Ticketing Fees",
  "Safeguarding",
  "Cookie Preferences",
]
