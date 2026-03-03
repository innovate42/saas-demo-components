import React from "react"
import xss from "xss"

const CheckIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
        />
    </svg>
)

const parseFeatures = (html) => {
    if (!html) return []
    const sanitized = xss(html)
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = sanitized
    const items = tempDiv.querySelectorAll("li, p")
    if (items.length === 0) {
        return tempDiv.textContent ? [tempDiv.textContent] : []
    }
    return Array.from(items).map(el => el.textContent).filter(Boolean)
}

const PlanCard = ({ offer, contractNote, contactUsLabel, contactUsCtaText, defaultCtaText, onSelect }) => {
    const attributes = offer?.data?.attributes || {}
    const {
        display_name__limio,
        display_price__limio,
        display_description__limio,
        offer_features__limio,
        price__limio,
        cta_text__limio,
        best_value__limio,
        badge_text__limio,
    } = attributes

    const isContactUs = !price__limio || price__limio.length === 0
    const ctaText = cta_text__limio || (isContactUs ? contactUsCtaText : defaultCtaText)
    const features = parseFeatures(offer_features__limio)

    const formatPrice = () => {
        if (isContactUs) return contactUsLabel
        const price = price__limio[0]
        if (!price) return contactUsLabel
        const symbol = price.currencyCode === "GBP" ? "\u00A3" : price.currencyCode === "EUR" ? "\u20AC" : "$"
        const amount = parseFloat(price.value)
        const interval = price.repeat_interval_type === "years" ? "/year" : "/month"
        return <>{symbol}{Math.floor(amount)} <span>{interval}</span></>
    }

    return (
        <div className="ep-card">
            {(best_value__limio || badge_text__limio) && (
                <span className="ep-card-badge">
                    {badge_text__limio || "Best Value"}
                </span>
            )}

            <h3 className="ep-card-name">{display_name__limio || offer?.name}</h3>

            <div className="ep-card-price">{formatPrice()}</div>

            {!isContactUs && (
                <p className="ep-card-price-note">
                    10,000 contacts {contractNote}
                </p>
            )}

            {display_description__limio && (
                <p className="ep-card-description">{display_description__limio}</p>
            )}

            {features.length > 0 && (
                <ul className="ep-card-features">
                    {features.map((feature, i) => (
                        <li key={i}>
                            <CheckIcon />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            )}

            <button className="ep-card-cta" onClick={() => onSelect && onSelect(offer)}>
                {ctaText}
            </button>
        </div>
    )
}

export default PlanCard
