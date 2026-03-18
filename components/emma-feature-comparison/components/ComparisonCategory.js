// @flow
import React from "react";
import FeatureRow from "./FeatureRow.js";

const ComparisonCategory = ({ category }) => {
  const { name, features } = category;

  return (
    <div className="mb-2">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-t-lg">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
          {name}
        </h3>
      </div>
      <div>
        {features.map((feature, i) => (
          <FeatureRow
            key={`${feature.name}-${i}`}
            feature={feature}
            isLast={i === features.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default ComparisonCategory;
