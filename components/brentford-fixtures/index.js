import React, { useEffect, useMemo, useState } from "react"
import { useLimioContext } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import { sampleFixtures } from "./sample"
import "./index.css"

/* ESPN's public site API. No key, CORS enabled. `fixture=true` returns the
   remaining schedule instead of played games; `soccer/all` spans every
   competition the club is in (league + cups). */
const feedUrl = (teamId, competitions) =>
  `https://site.api.espn.com/apis/site/v2/sports/soccer/${competitions || "all"}/teams/${teamId}/schedule?fixture=true`

const teamFromCompetitor = (c) => {
  const t = c?.team || {}
  return {
    id: String(t.id || ""),
    name: t.displayName || t.name || "",
    short: t.shortDisplayName || t.displayName || "",
    abbreviation: t.abbreviation || "",
    logo: t.logos?.[0]?.href || (t.id ? `https://a.espncdn.com/i/teamlogos/soccer/500/${t.id}.png` : ""),
  }
}

/* Normalise an ESPN event into the shape the cards render. */
const normaliseEvent = (ev, teamId) => {
  const comp = ev?.competitions?.[0] || {}
  const competitors = comp.competitors || []
  const us = competitors.find((c) => String(c?.team?.id) === String(teamId))
  const them = competitors.find((c) => String(c?.team?.id) !== String(teamId))
  const start = new Date(comp.date || ev?.date)
  const ticket = (comp.tickets || [])[0] || {}
  const ticketLink = (ticket.links || []).find((l) => (l.rel || []).includes("event"))?.href || ticket.links?.[0]?.href || ""
  return {
    id: String(ev?.id || comp.id || ""),
    start,
    state: comp.status?.type?.state || "pre",
    timeValid: comp.timeValid !== false,
    competition: ev?.league?.name || ev?.season?.displayName || "",
    venue: comp.venue?.fullName || "",
    city: comp.venue?.address?.city || "",
    isHome: us ? us.homeAway === "home" : null,
    opponent: teamFromCompetitor(them),
    ticketsUrl: ticketLink,
    ticketsSummary: ticket.summary || "",
  }
}

const useFixtures = ({ teamId, competitions, maxGames }) => {
  const [state, setState] = useState({ status: "loading", fixtures: [] })

  useEffect(() => {
    if (!teamId) {
      setState({ status: "error", fixtures: [] })
      return undefined
    }
    let cancelled = false
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null
    setState((s) => ({ ...s, status: "loading" }))

    fetch(feedUrl(teamId, competitions), { signal: controller?.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`ESPN responded ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        const now = Date.now()
        const fixtures = (json?.events || [])
          .map((ev) => normaliseEvent(ev, teamId))
          .filter((f) => f.start && !Number.isNaN(f.start.getTime()))
          .filter((f) => f.state !== "post" && f.start.getTime() > now - 3 * 60 * 60 * 1000)
          .sort((a, b) => a.start - b.start)
          .slice(0, maxGames)
        setState({ status: "ready", fixtures })
      })
      .catch((err) => {
        if (cancelled || err?.name === "AbortError") return
        setState({ status: "error", fixtures: [] })
      })

    return () => {
      cancelled = true
      controller?.abort()
    }
  }, [teamId, competitions, maxGames])

  return state
}

/* ---------------- Presentation ---------------- */

const fmt = (date, opts) => {
  try {
    return new Intl.DateTimeFormat("en-GB", opts).format(date)
  } catch (e) {
    return ""
  }
}

const FixtureCard = ({ fixture, showBadges, ctaLabel, ticketsSource, ticketsUrl, homeLabel, awayLabel, liveLabel, timeTbcLabel }) => {
  const { isHome, opponent } = fixture
  const href = ticketsSource === "feed" ? fixture.ticketsUrl : ticketsSource === "fixed" ? ticketsUrl : ""
  const isLive = fixture.state === "in"

  return (
    <li className={`bff-card${isHome ? " bff-card--home" : ""}`}>
      <div className="bff-date" aria-hidden="true">
        <span className="bff-date__day">{fmt(fixture.start, { weekday: "short" })}</span>
        <span className="bff-date__num">{fmt(fixture.start, { day: "numeric" })}</span>
        <span className="bff-date__month">{fmt(fixture.start, { month: "short" })}</span>
      </div>

      {showBadges && opponent?.logo && (
        <div className="bff-badge-wrap">
          <img className="bff-club-badge" src={opponent.logo} alt="" loading="lazy" />
        </div>
      )}

      <div className="bff-body">
        <div className="bff-meta">
          {isHome !== null && (
            <span className={`bff-badge ${isHome ? "bff-badge--home" : "bff-badge--away"}`}>{isHome ? homeLabel : awayLabel}</span>
          )}
          {isLive && <span className="bff-badge bff-badge--live">{liveLabel}</span>}
          {fixture.competition && <span className="bff-competition">{fixture.competition}</span>}
        </div>
        <h3 className="bff-opponent">
          <span className="bff-vs">{isHome === false ? "at" : "v"}</span> {opponent?.name || "TBC"}
        </h3>
        <p className="bff-details">
          <time dateTime={fixture.start.toISOString()}>
            {fmt(fixture.start, { weekday: "long", day: "numeric", month: "long" })}
            {fixture.timeValid !== false ? `, ${fmt(fixture.start, { hour: "2-digit", minute: "2-digit", hour12: false })}` : `, ${timeTbcLabel}`}
          </time>
          {fixture.venue && (
            <>
              <span className="bff-dot" aria-hidden="true">
                ·
              </span>
              {fixture.venue}
              {fixture.city ? `, ${fixture.city}` : ""}
            </>
          )}
        </p>
      </div>

      {ticketsSource !== "none" && (
        <div className="bff-cta">
          {href ? (
            <a className="bff-button" href={href} target="_blank" rel="noopener noreferrer">
              {ctaLabel}
            </a>
          ) : (
            <span className="bff-button bff-button--disabled">{ctaLabel}</span>
          )}
          {ticketsSource === "feed" && fixture.ticketsSummary && <span className="bff-ticket-note">{fixture.ticketsSummary}</span>}
        </div>
      )}
    </li>
  )
}

const BrentfordFixtures = () => {
  const props = useStaticProps() || {}
  const { isInPageBuilder } = useLimioContext() || {}

  const {
    eyebrow = "Fixtures",
    heading = "Next games",
    standfirst = "",
    teamId = "337",
    competitions = "all",
    maxGames: maxGamesRaw = 3,
    showBadges = true,
    ctaLabel = "Buy tickets",
    ticketsSource = "fixed",
    ticketsUrl = "",
    homeLabel = "Home",
    awayLabel = "Away",
    liveLabel = "Live",
    timeTbcLabel = "time TBC",
    emptyMessage = "No upcoming fixtures right now.",
    errorMessage = "We couldn't load the fixtures.",
    useSampleWhenUnavailable = true,
    attribution = "",
    primaryColor__limio_color: primaryColor = "#E30613",
    inkColor__limio_color: inkColor = "#1A1A1A",
    backgroundColor__limio_color: backgroundColor = "#FFFFFF",
    cardColor__limio_color: cardColor = "#F7F7F7",
    headingFont,
    bodyFont,
  } = props

  const maxGames = Math.max(1, parseInt(maxGamesRaw, 10) || 3)

  const { status, fixtures } = useFixtures({
    teamId: String(teamId || "").trim(),
    competitions: String(competitions || "all").trim(),
    maxGames,
  })

  const showSample = useSampleWhenUnavailable && status === "error"
  const list = useMemo(() => (showSample ? sampleFixtures.slice(0, maxGames) : fixtures), [showSample, fixtures, maxGames])

  const cssVars = {
    "--bff-primary": primaryColor,
    "--bff-ink": inkColor,
    "--bff-bg": backgroundColor,
    "--bff-card": cardColor,
  }
  if (headingFont) cssVars["--bff-heading-font"] = headingFont
  if (bodyFont) cssVars["--bff-body-font"] = bodyFont

  return (
    <section className="bff" style={cssVars} aria-labelledby="bff-heading">
      <div className="bff-inner">
        <header className="bff-head">
          {eyebrow && <p className="bff-eyebrow">{eyebrow}</p>}
          <h2 id="bff-heading" className="bff-heading">
            {heading}
          </h2>
          {standfirst && <p className="bff-standfirst">{standfirst}</p>}
        </header>

        {status === "loading" && <BrentfordFixtures.Skeleton count={maxGames} />}

        {status === "error" && !showSample && <p className="bff-notice bff-notice--error">{errorMessage}</p>}

        {(status === "ready" || showSample) && list.length === 0 && <p className="bff-notice">{emptyMessage}</p>}

        {(status === "ready" || showSample) && list.length > 0 && (
          <ul className="bff-list">
            {list.map((fixture) => (
              <FixtureCard
                key={fixture.id}
                fixture={fixture}
                showBadges={showBadges}
                ctaLabel={ctaLabel}
                ticketsSource={ticketsSource}
                ticketsUrl={ticketsUrl}
                homeLabel={homeLabel}
                awayLabel={awayLabel}
                liveLabel={liveLabel}
                timeTbcLabel={timeTbcLabel}
              />
            ))}
          </ul>
        )}

        {showSample && isInPageBuilder && (
          <p className="bff-notice bff-notice--hint">Showing sample fixtures because the live feed could not be reached.</p>
        )}

        {attribution && <p className="bff-attribution">{attribution}</p>}
      </div>
    </section>
  )
}

BrentfordFixtures.Skeleton = ({ count = 3 }) => (
  <ul className="bff-list bff-list--skeleton" aria-busy="true" aria-live="polite">
    {Array.from({ length: count }).map((_, i) => (
      <li key={i} className="bff-card bff-card--skeleton">
        <div className="bff-date bff-skel" />
        <div className="bff-body">
          <div className="bff-skel bff-skel--line" style={{ width: "30%" }} />
          <div className="bff-skel bff-skel--line bff-skel--tall" style={{ width: "60%" }} />
          <div className="bff-skel bff-skel--line" style={{ width: "80%" }} />
        </div>
        <div className="bff-cta">
          <div className="bff-skel bff-skel--button" />
        </div>
      </li>
    ))}
  </ul>
)

BrentfordFixtures.Error = () => (
  <section className="bff">
    <div className="bff-inner">
      <p className="bff-notice bff-notice--error">Something went wrong loading the fixtures.</p>
    </div>
  </section>
)

export default BrentfordFixtures
