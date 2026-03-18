import React from "react"

const ChevronIcon = ({ isOpen }) => (
    <svg
        className={`ef-accordion-icon ${isOpen ? "ef-accordion-icon--open" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
)

const FaqItem = ({ question, answer, isOpen, onToggle }) => {
    return (
        <div className="ef-accordion-item">
            <button
                className="ef-accordion-button"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span>{question}</span>
                <ChevronIcon isOpen={isOpen} />
            </button>
            {isOpen && (
                <div className="ef-accordion-content">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    )
}

export default FaqItem
