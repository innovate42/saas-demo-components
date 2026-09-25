import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import BrentfordFixtures from "../../../components/brentford-fixtures"

export default {
  title: "Sport/Brentford Fixtures",
  component: BrentfordFixtures,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <LimioProvider>
        <ComponentContext.Provider value={context.args}>
          <Story />
        </ComponentContext.Provider>
      </LimioProvider>
    ),
  ],
}

/* Live data from ESPN's public feed, all competitions. */
export const Live = { args: {} }

export const PremierLeagueOnly = {
  args: { competitions: "eng.1", standfirst: "The next three Premier League fixtures." },
}

export const FiveGamesWithResaleLinks = {
  args: { maxGames: 5, heading: "Upcoming fixtures", ticketsSource: "feed" },
}

export const NoBadgesNoButton = {
  args: { showBadges: false, ticketsSource: "none" },
}

export const DarkTheme = {
  args: {
    backgroundColor__limio_color: "#111111",
    cardColor__limio_color: "#1f1f1f",
    inkColor__limio_color: "#ffffff",
    primaryColor__limio_color: "#ff2a3a",
  },
}

/* Bad team id forces the feed to fail, so the sample fallback shows. */
export const SampleFallback = {
  args: { teamId: "0" },
}
