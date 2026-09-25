/* Sample fixtures shown if the live feed fails (and the fallback is
   enabled). Dates are generated relative to "now" so a demo never looks
   stale. Badges come from ESPN's public CDN. */

const badge = (id) => `https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`

const daysFromNow = (days, hour, minute) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d
}

export const sampleFixtures = [
  {
    id: "sample-1",
    start: daysFromNow(6, 15, 0),
    competition: "English Premier League",
    venue: "Gtech Community Stadium",
    city: "Brentford",
    isHome: true,
    opponent: { id: "359", name: "Arsenal", short: "Arsenal", abbreviation: "ARS", logo: badge(359) },
    ticketsUrl: "",
    ticketsSummary: "",
  },
  {
    id: "sample-2",
    start: daysFromNow(13, 17, 30),
    competition: "English Premier League",
    venue: "Etihad Stadium",
    city: "Manchester",
    isHome: false,
    opponent: { id: "382", name: "Manchester City", short: "Man City", abbreviation: "MCI", logo: badge(382) },
    ticketsUrl: "",
    ticketsSummary: "",
  },
  {
    id: "sample-3",
    start: daysFromNow(20, 20, 0),
    competition: "English Carabao Cup",
    venue: "Gtech Community Stadium",
    city: "Brentford",
    isHome: true,
    opponent: { id: "361", name: "Newcastle United", short: "Newcastle", abbreviation: "NEW", logo: badge(361) },
    ticketsUrl: "",
    ticketsSummary: "",
  },
]
