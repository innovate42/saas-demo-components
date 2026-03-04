import React from "react"

const CheckIcon = () => (
    <svg className="ec-check-icon" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
)

const CrossIcon = () => (
    <svg className="ec-cross-icon" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
)

export const renderValue = (value) => {
    if (value === true) return <CheckIcon />
    if (value === false) return <CrossIcon />
    return <span>{value}</span>
}

const FeatureRow = ({ feature }) => {
    const { name, values, isNew } = feature

    return (
        <div className="ec-feature-row">
            <div className="ec-feature-name">
                <span>{name}</span>
                {isNew && <span className="ec-new-badge">New</span>}
            </div>
            {values.map((value, i) => (
                <div key={`${name}-${i}`} className="ec-feature-value">
                    {renderValue(value)}
                </div>
            ))}
        </div>
    )
}

export default FeatureRow
