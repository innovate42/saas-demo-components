// @flow
import React, { useState } from "react";
import ComparisonCategory from "./components/ComparisonCategory.js";
import { defaultPlans, defaultCategories } from "./data/features.js";
import "../source/style/style.css";

type Feature = {
  name: string,
  values: Array<boolean | string>,
  isNew?: boolean,
};

type Category = {
  name: string,
  features: Array<Feature>,
};

type Props = {
  heading: string,
  plans: Array<string>,
  categories: Array<Category>,
  componentId: string,
};

function EmmaFeatureComparison({
  heading,
  plans,
  categories,
  componentId,
}: Props): React.Node {
  const planNames = plans && plans.length > 0 ? plans : defaultPlans;
  const featureCategories = categories && categories.length > 0 ? categories : defaultCategories;

  // Mobile: select a plan to view
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  return (
    <section className="bg-white dark:bg-gray-900" id={componentId}>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {heading && (
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-3xl sm:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              {heading}
            </h2>
          </div>
        )}

        {/* Mobile plan selector */}
        <div className="lg:hidden mb-6">
          <select
            value={selectedPlanIndex}
            onChange={(e) => setSelectedPlanIndex(Number(e.target.value))}
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-200"
          >
            {planNames.map((plan, i) => (
              <option key={`plan-select-${i}`} value={i}>
                {plan}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile view: single plan */}
        <div className="lg:hidden">
          {featureCategories.map((category, catIdx) => (
            <div key={`mobile-cat-${catIdx}`} className="mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-t-lg">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                  {category.name}
                </h3>
              </div>
              {category.features.map((feature, featIdx) => {
                const value = feature.values[selectedPlanIndex];
                return (
                  <div
                    key={`mobile-feat-${catIdx}-${featIdx}`}
                    className={`flex items-center justify-between py-3 px-4 ${featIdx < category.features.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""}`}
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      {feature.name}
                      {feature.isNew && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </span>
                    <span>
                      {value === true ? (
                        <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : value === false ? (
                        <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{value}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Desktop view: full comparison table */}
        <div className="hidden lg:block">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-5 items-center py-4 px-4">
              <div className="col-span-1">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">Features</span>
              </div>
              {planNames.map((plan, i) => (
                <div key={`header-${i}`} className="col-span-1 text-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{plan}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature categories */}
          {featureCategories.map((category, i) => (
            <ComparisonCategory key={`category-${i}`} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default EmmaFeatureComparison;
