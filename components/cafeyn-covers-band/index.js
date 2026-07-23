import React from "react"
import { ErrorBoundary } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const COVER_TONES = [
    { bg: "#211712", fg: "#FFFDF9" },
    { bg: "#885F46", fg: "#FFFDF9" },
    { bg: "#DED0B9", fg: "#211712" },
    { bg: "#B33A3A", fg: "#FFFDF9" },
    { bg: "#2E4A3E", fg: "#FFFDF9" },
    { bg: "#3B3A5A", fg: "#FFFDF9" },
]

const Cover = ({ item, index }) => {
    const tone = COVER_TONES[index % COVER_TONES.length]
    return (
        <div className="cafeyn-covers__cover">
            {item.image ? (
                <img src={item.image} alt={item.label || ""} loading="lazy" />
            ) : (
                <div className="cafeyn-covers__placeholder" style={{ background: tone.bg, color: tone.fg }}>
                    <span className="cafeyn-covers__masthead">{item.label}</span>
                    <span className="cafeyn-covers__lines" aria-hidden="true"><i /><i /><i /></span>
                </div>
            )}
        </div>
    )
}

const CafeynCoversBand = () => {
    const props = useStaticProps() || {}
    const { heading = "", titles = [], scrollSeconds = 35, componentId = "cafeyn-covers-band" } = props

    if (!titles?.length) return null
    // Duplicate the strip so the marquee loops seamlessly.
    const strip = [...titles, ...titles]

    return (
        <section id={componentId} className="cafeyn-covers">
            {heading?.trim() && <h2 className="cafeyn-covers__heading">{heading}</h2>}
            <div className="cafeyn-covers__viewport">
                <div className="cafeyn-covers__track" style={{ "--duration": `${Number(scrollSeconds) || 35}s` }}>
                    {strip.map((item, i) => (
                        <Cover key={`${item.id || item.label}-${i}`} item={item} index={i % titles.length} />
                    ))}
                </div>
            </div>
        </section>
    )
}

CafeynCoversBand.Skeleton = () => <div className="cafeyn-covers" style={{ minHeight: "14rem" }} />
CafeynCoversBand.Error = () => null

const Wrapped = () => (
    <ErrorBoundary fallback={<CafeynCoversBand.Error />}>
        <CafeynCoversBand />
    </ErrorBoundary>
)

export default Wrapped
