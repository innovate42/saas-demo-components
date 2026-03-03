import React from "react"
import FeatureRow from "./FeatureRow"

const ComparisonCategory = ({ category }) => {
    const { name, features } = category

    return (
        <div className="ec-category">
            <div className="ec-category-header">
                <h3 className="ec-category-name">{name}</h3>
            </div>
            {features.map((feature, i) => (
                <FeatureRow key={`${feature.name}-${i}`} feature={feature} />
            ))}
        </div>
    )
}

export default ComparisonCategory
