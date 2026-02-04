import React, { useState } from "react"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const ChevronIcon = ({ color, isOpen }) => (
    <svg
        className={`spotify-faq__icon ${isOpen ? "spotify-faq__icon--open" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
)

const FAQItem = ({ question, answer, isOpen, onClick, cardBackgroundColor, textColor, mutedTextColor, accentColor }) => {
    return (
        <div className="spotify-faq__item" style={{ backgroundColor: cardBackgroundColor }}>
            <button
                className="spotify-faq__question"
                onClick={onClick}
                style={{ color: textColor }}
                aria-expanded={isOpen}
            >
                <span>{question}</span>
                <ChevronIcon color={accentColor} isOpen={isOpen} />
            </button>
            <div className={`spotify-faq__answer ${isOpen ? "spotify-faq__answer--open" : ""}`}>
                <div className="spotify-faq__answer-content" style={{ color: mutedTextColor }}>
                    {answer}
                </div>
            </div>
        </div>
    )
}

const SpotifyFAQ = () => {
    const props = useStaticProps() || {}
    const [openIndex, setOpenIndex] = useState(null)

    const {
        headline = "Frequently asked questions",
        faqs = [],
        backgroundColor__limio_color: backgroundColor = "#121212",
        cardBackgroundColor__limio_color: cardBackgroundColor = "#242424",
        textColor__limio_color: textColor = "#FFFFFF",
        mutedTextColor__limio_color: mutedTextColor = "#A7A7A7",
        accentColor__limio_color: accentColor = "#1ED760"
    } = props

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    if (!faqs || faqs.length === 0) {
        return null
    }

    return (
        <section className="spotify-faq" style={{ backgroundColor }}>
            <div className="spotify-faq__container">
                <h2 className="spotify-faq__headline" style={{ color: textColor }}>
                    {headline}
                </h2>

                <div className="spotify-faq__list">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={faq.id || index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                            cardBackgroundColor={cardBackgroundColor}
                            textColor={textColor}
                            mutedTextColor={mutedTextColor}
                            accentColor={accentColor}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SpotifyFAQ
