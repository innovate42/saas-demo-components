import React from "react"
import { ErrorBoundary } from "@limio/sdk"
import xss from "xss"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const sanitize = (str) => xss(str || "")

// Styled placeholder palette for covers without an image — warm editorial
// tones so the collage carries color the way real covers would.
const COVER_TONES = [
    { bg: "#211712", fg: "#FFFDF9" },
    { bg: "#885F46", fg: "#FFFDF9" },
    { bg: "#DED0B9", fg: "#211712" },
    { bg: "#B33A3A", fg: "#FFFDF9" },
    { bg: "#2E4A3E", fg: "#FFFDF9" },
]

const Cover = ({ cover, index }) => {
    const tone = COVER_TONES[index % COVER_TONES.length]
    return (
        <div className="cafeyn-hero__cover" style={{ "--tilt": `${(index % 2 ? 1 : -1) * (2 + index)}deg` }}>
            {cover.image ? (
                <img src={cover.image} alt={cover.label || ""} loading="lazy" />
            ) : (
                <div className="cafeyn-hero__cover-placeholder" style={{ background: tone.bg, color: tone.fg }}>
                    <span className="cafeyn-hero__cover-masthead">{cover.label}</span>
                    <span className="cafeyn-hero__cover-lines" aria-hidden="true">
                        <i /><i /><i />
                    </span>
                </div>
            )}
        </div>
    )
}

const CafeynHero = () => {
    const props = useStaticProps() || {}
    const {
        kicker = "",
        heading = "",
        subheading = "",
        primaryCta = "",
        primaryCtaHref = "#plaene",
        secondaryCta = "",
        secondaryCtaHref = "#",
        finePrint = "",
        showCovers = true,
        covers = [],
        componentId = "cafeyn-hero",
    } = props

    return (
        <section id={componentId} className="cafeyn-hero">
            <div className="cafeyn-hero__inner">
                <div className="cafeyn-hero__copy">
                    {kicker?.trim() && <div className="cafeyn-hero__kicker">{kicker}</div>}
                    {heading?.trim() && <h1 className="cafeyn-hero__heading">{heading}</h1>}
                    {subheading?.trim() && (
                        <div className="cafeyn-hero__sub" dangerouslySetInnerHTML={{ __html: sanitize(subheading) }} />
                    )}
                    <div className="cafeyn-hero__ctas">
                        {primaryCta?.trim() && (
                            <a className="cafeyn-hero__btn cafeyn-hero__btn--primary" href={primaryCtaHref || "#"}>
                                {primaryCta}
                            </a>
                        )}
                        {secondaryCta?.trim() && (
                            <a className="cafeyn-hero__btn cafeyn-hero__btn--secondary" href={secondaryCtaHref || "#"}>
                                {secondaryCta}
                            </a>
                        )}
                    </div>
                    {finePrint?.trim() && <p className="cafeyn-hero__fine">{finePrint}</p>}
                </div>
                {showCovers && covers?.length > 0 && (
                    <div className="cafeyn-hero__collage" aria-hidden="true">
                        {covers.slice(0, 5).map((cover, i) => (
                            <Cover key={cover.id || i} cover={cover} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

CafeynHero.Skeleton = () => (
    <div className="cafeyn-hero cafeyn-hero--skeleton">
        <div className="cafeyn-hero__inner">
            <div className="cafeyn-hero__copy">
                <div className="cafeyn-hero__skl" style={{ width: "30%", height: 14 }} />
                <div className="cafeyn-hero__skl" style={{ width: "80%", height: 44 }} />
                <div className="cafeyn-hero__skl" style={{ width: "60%", height: 18 }} />
            </div>
        </div>
    </div>
)

CafeynHero.Error = () => (
    <div className="cafeyn-hero">
        <div className="cafeyn-hero__inner">
            <p>Dieser Inhalt kann gerade nicht geladen werden. Bitte laden Sie die Seite neu.</p>
        </div>
    </div>
)

const Wrapped = () => (
    <ErrorBoundary fallback={<CafeynHero.Error />}>
        <CafeynHero />
    </ErrorBoundary>
)

export default Wrapped
