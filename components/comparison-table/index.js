import React from "react"
import { sanitiseHTML, useLimioContext } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const DEFAULT_SECTIONS = [
  {
    title: "Account management",
    rows: [
      { feature: "Tiered account structure", values: ["no", "2 subaccounts", "5+ subaccounts", "10+ subaccounts"] },
      { feature: "Users", values: ["5 users", "10 users", "25 users", "Unlimited users"] },
      { feature: "User permissions", values: ["2 role types", "5 role types", "6 role types", "6 role types"] },
      { feature: "Unlimited email sending", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Custom user permissions", values: ["no", "no", "yes", "yes"] },
      { feature: "Approvals dashboard", values: ["no", "no", "yes", "yes"] },
      { feature: "Activity dashboard", values: ["no", "no", "yes", "yes"] },
      { feature: "Subaccount categories", values: ["no", "no", "yes", "yes"] },
      { feature: "Private branding", values: ["no", "no", "yes", "yes"] },
    ],
  },
  {
    title: "Marketing channels & tools",
    rows: [
      { feature: "Email", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Email scheduling", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Marketing calendar", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Signup forms", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Landing pages", values: ["no", "yes", "yes", "yes"] },
      { feature: "SMS", values: ["no", "no", "yes", "yes"] },
    ],
  },
  {
    title: "Design",
    rows: [
      { feature: "Drag & drop email editor", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Save Email Rows", values: ["yes", "yes", "yes", "yes"] },
      { feature: "AI Assistant", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Email template gallery", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Code your own emails", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Asset library", values: ["yes", "yes", "yes", "yes"] },
    ],
  },
  {
    title: "Automation",
    rows: [
      { feature: "Automation builder", values: ["1 journey", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Multiple starting points", values: ["no", "yes", "yes", "yes"] },
      { feature: "Branching points", values: ["no", "yes", "yes", "yes"] },
      { feature: "Custom event-driven automations", values: ["no", "yes", "yes", "yes"] },
    ],
  },
  {
    title: "Audience",
    rows: [
      { feature: "Segmentation", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Dynamic content", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Subscription management", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Audience sharing", values: ["no", "no", "no", "yes"] },
    ],
  },
  {
    title: "Insights & optimization",
    rows: [
      { feature: "Real-time reporting", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Comparative reporting", values: ["no", "yes", "yes", "yes"] },
      { feature: "Trends reporting", values: ["no", "no", "yes", "yes"] },
      { feature: "Pre-send email testing", values: ["yes", "yes", "yes", "yes"] },
      { feature: "A/B subject line split testing", values: ["yes", "yes", "yes", "yes"] },
      { feature: "A/B content split testing", values: ["no", "yes", "yes", "yes"] },
      { feature: "Integrations", values: ["yes", "yes", "yes", "yes"] },
      { feature: "API access", values: ["yes", "yes", "yes", "yes"] },
    ],
  },
  {
    title: "Help & support",
    rows: [
      { feature: "In-app support", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Email support", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Phone support", values: ["yes", "yes", "yes", "Priority support"] },
      { feature: "Deliverability support", values: ["no", "no", "yes", "yes"] },
      { feature: "Help center", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Training videos", values: ["yes", "yes", "yes", "yes"] },
      { feature: "Single sign-on", values: ["no", "no", "yes", "yes"] },
    ],
  },
]

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
  return <span>{sanitiseHTML(value)}</span>
}

function parseSections(raw) {
  if (Array.isArray(raw)) return raw
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

const ComparisonTable = () => {
  const props = useStaticProps() || {}

  const { isInPageBuilder } = useLimioContext() || {}

  const headline = props.headline
  const tiers = Array.isArray(props.tiers) ? props.tiers : []
  const rawSections = parseSections(props.sections)
  const sections = rawSections.length ? rawSections : DEFAULT_SECTIONS
  const primaryColor = props.primaryColor__limio_color
  const componentId = props.componentId

  if (!tiers.length && !sections.length) return null

  return (
    <section id={componentId} className="comparison-table">
      {headline && <h2 className="comparison-table__headline">{sanitiseHTML(headline)}</h2>}

      <div className="comparison-table__tier-header">
        <div className="comparison-table__tier-header-spacer" />
        {tiers.map((tier, idx) => (
          <div key={idx} className="comparison-table__tier-col">
            <h4 className="comparison-table__tier-name">{sanitiseHTML(tier?.name)}</h4>
            <p className="comparison-table__tier-price">{sanitiseHTML(tier?.price)}</p>
            <a
              className="comparison-table__tier-cta"
              href={tier?.ctaUrl}
              style={{ color: primaryColor, border: `1px solid ${primaryColor}` }}
            >
              {sanitiseHTML(tier?.ctaText)}
            </a>
          </div>
        ))}
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} className="comparison-table__section">
          <h4 className="comparison-table__section-title">{sanitiseHTML(section?.title)}</h4>
          {(section?.rows || []).map((row, rIdx) => (
            <div key={rIdx} className="comparison-table__row">
              <div className="comparison-table__feature-name">
                {sanitiseHTML(row?.feature)}
              </div>
              {(row?.values || []).map((val, vIdx) => (
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
