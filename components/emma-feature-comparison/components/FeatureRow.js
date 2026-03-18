// @flow
import React from "react";

const CheckIcon = () => (
  <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CrossIcon = () => (
  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const renderValue = (value) => {
  if (value === true) return <CheckIcon />;
  if (value === false) return <CrossIcon />;
  return <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{value}</span>;
};

const FeatureRow = ({ feature, isLast }) => {
  const { name, values, isNew } = feature;

  return (
    <div className={`grid grid-cols-5 items-center py-3 px-4 ${!isLast ? "border-b border-gray-100 dark:border-gray-700" : ""} hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}>
      <div className="col-span-1 flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">{name}</span>
        {isNew && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            New
          </span>
        )}
      </div>
      {values.map((value, i) => (
        <div key={`${name}-${i}`} className="col-span-1 flex justify-center">
          {renderValue(value)}
        </div>
      ))}
    </div>
  );
};

export default FeatureRow;
