import React, { useState } from "react"
import { useStaticProps } from "./componentStaticProps"
import { defaultPlans, defaultCategories } from "./data/features"
import ComparisonCategory from "./components/ComparisonCategory"
import { renderValue } from "./components/FeatureRow"
import "./index.css"

const EmmaComparison = () => {
    const props = useStaticProps() || {}
    const {
        heading = "Compare plans",
        primaryColor__limio_color = "#053A5E",
        checkColor__limio_color = "#93c5fd",
        newBadgeColor__limio_color = "#dbeafe",
    } = props

    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0)

    return (
        <section
            className="ec-comparison"
            style={{
                "--ec-primary": primaryColor__limio_color,
                "--ec-check": checkColor__limio_color,
                "--ec-new-badge": newBadgeColor__limio_color,
            }}
        >
            <div className="ec-container">
                {heading && <h2 className="ec-heading">{heading}</h2>}

                {/* Desktop view */}
                <div className="ec-desktop">
                    <div className="ec-table-header">
                        <div className="ec-table-header-label">Features</div>
                        {defaultPlans.map((plan, i) => (
                            <div key={`header-${i}`} className="ec-table-header-plan">
                                {plan}
                            </div>
                        ))}
                    </div>

                    {defaultCategories.map((category, i) => (
                        <ComparisonCategory key={`cat-${i}`} category={category} />
                    ))}

                    <p className="ec-sms-note">
                        * SMS available for purchase as an add-on
                    </p>
                </div>

                {/* Mobile view */}
                <div className="ec-mobile">
                    <select
                        className="ec-mobile-selector"
                        value={selectedPlanIndex}
                        onChange={(e) => setSelectedPlanIndex(Number(e.target.value))}
                    >
                        {defaultPlans.map((plan, i) => (
                            <option key={`select-${i}`} value={i}>{plan}</option>
                        ))}
                    </select>

                    {defaultCategories.map((category, catIdx) => (
                        <div key={`m-cat-${catIdx}`} className="ec-mobile-category">
                            <h3 className="ec-mobile-category-name">{category.name}</h3>
                            {category.features.map((feature, featIdx) => (
                                <div key={`m-feat-${catIdx}-${featIdx}`} className="ec-mobile-feature">
                                    <span className="ec-mobile-feature-name">
                                        {feature.name}
                                        {feature.isNew && <span className="ec-new-badge">New</span>}
                                    </span>
                                    <span className="ec-mobile-feature-value">
                                        {renderValue(feature.values[selectedPlanIndex])}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}

                    <p className="ec-sms-note">
                        * SMS available for purchase as an add-on
                    </p>
                </div>
            </div>
        </section>
    )
}

export default EmmaComparison
