import React from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import PlanCard from "./components/PlanCard"
import "./index.css"

const EmmaPlans = () => {
    const props = useStaticProps() || {}
    const {
        sectionHeading = "",
        contractNote = "with annual contract",
        contactUsLabel = "Contact us",
        contactUsCtaText = "Let's talk",
        defaultCtaText = "Request a demo",
        primaryColor__limio_color = "#053A5E",
        ctaColor__limio_color = "#053A5E",
        highlightColor__limio_color = "#B9D1FF",
    } = props

    const { offers = [] } = useCampaign() || {}
    const { addToBasket } = useBasket() || {}

    const handleSelect = (offer) => {
        if (addToBasket) {
            addToBasket(offer)
        }
    }

    return (
        <section
            className="ep-plans"
            style={{
                "--ep-primary": primaryColor__limio_color,
                "--ep-cta": ctaColor__limio_color,
                "--ep-highlight": highlightColor__limio_color,
            }}
        >
            <div className="ep-container">
                {sectionHeading && (
                    <h2 className="ep-section-heading">{sectionHeading}</h2>
                )}

                <div className="ep-grid">
                    {offers.length > 0 ? (
                        offers.map((offer, i) => (
                            <PlanCard
                                key={offer?.id || offer?.path || i}
                                offer={offer}
                                contractNote={contractNote}
                                contactUsLabel={contactUsLabel}
                                contactUsCtaText={contactUsCtaText}
                                defaultCtaText={defaultCtaText}
                                onSelect={handleSelect}
                            />
                        ))
                    ) : (
                        <p className="ep-empty">No plans available.</p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default EmmaPlans
