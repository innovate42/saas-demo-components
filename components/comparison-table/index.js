import React from "react"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const sanitize = (str) => xss(str || "")

const CheckIcon = ({ color }) => (
  <svg className="comparison-table__icon comparison-table__icon--check" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 13.5L3.5 9.5L2 11L7.5 16.5L18 6L16.5 4.5L7.5 13.5Z" fill={color} />
  </svg>
)

const CrossIcon = () => (
  <svg className="comparison-table__icon comparison-table__icon--cross" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const CellValue = ({ value, checkColor }) => {
  if (value === "yes") return <CheckIcon color={checkColor} />
  if (value === "no") return <CrossIcon />
  return <span>{sanitize(value)}</span>
}

const ComparisonTable = () => {
  const {
    headline,
    tiers = [],
    sections = [],
    primaryColor__limio_color: primaryColor,
    componentId,
  } = useStaticProps()

  return (
    <section id={componentId} className="comparison-table">
      {headline && <h2 className="comparison-table__headline">{sanitize(headline)}</h2>}

      <div className="comparison-table__tier-header">
        <div className="comparison-table__tier-header-spacer" />
        {tiers.map((tier, idx) => (
          <div key={idx} className="comparison-table__tier-col">
            <h4 className="comparison-table__tier-name">{sanitize(tier.name)}</h4>
            <p className="comparison-table__tier-price">{sanitize(tier.price)}</p>
            <a
              className="comparison-table__tier-cta"
              href={tier.ctaUrl}
              style={{ color: primaryColor, border: `1px solid ${primaryColor}` }}
            >
              {sanitize(tier.ctaText)}
            </a>
          </div>
        ))}
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} className="comparison-table__section">
          <h4 className="comparison-table__section-title">{sanitize(section.title)}</h4>
          {(section.rows || []).map((row, rIdx) => (
            <div key={rIdx} className="comparison-table__row">
              <div className="comparison-table__feature-name">
                {sanitize(row.feature)}
              </div>
              {(row.values || []).map((val, vIdx) => (
                <div key={vIdx} className="comparison-table__cell">
                  <CellValue value={val} checkColor={primaryColor} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}

export default ComparisonTable
