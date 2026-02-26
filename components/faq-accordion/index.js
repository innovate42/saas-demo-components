import React, { useState } from "react"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const sanitize = (str) => xss(str || "")

const ChevronIcon = ({ isOpen }) => (
  <svg
    className={`faq-accordion__icon${isOpen ? " faq-accordion__icon--open" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FAQItem = ({ question, answerHtml, borderColor }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="faq-accordion__item" style={{ borderBottomColor: borderColor }}>
      <button
        className="faq-accordion__question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{sanitize(question)}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      <div className={`faq-accordion__answer${isOpen ? " faq-accordion__answer--open" : ""}`}>
        <div
          className="faq-accordion__answer-content"
          dangerouslySetInnerHTML={{ __html: sanitize(answerHtml) }}
        />
      </div>
    </div>
  )
}

const FAQAccordion = () => {
  const {
    headline,
    items = [],
    borderColor__limio_color: borderColor,
    componentId,
  } = useStaticProps()

  return (
    <section id={componentId} className="faq-accordion">
      {headline && <h2 className="faq-accordion__headline">{sanitize(headline)}</h2>}
      {items.map((item, idx) => (
        <FAQItem
          key={idx}
          question={item.question}
          answerHtml={item["answer__limio_richtext"]}
          borderColor={borderColor}
        />
      ))}
    </section>
  )
}

export default FAQAccordion
