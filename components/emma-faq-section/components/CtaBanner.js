// @flow
import React from "react";

const CtaBanner = ({ heading, description, buttonText, buttonLink, primaryColor }) => {
  return (
    <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 lg:p-12">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            {heading}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-6">
            {description}
          </p>
          <a
            href={buttonLink}
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 focus:ring-4 focus:ring-blue-200"
            style={{ backgroundColor: primaryColor || "#053A5E" }}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CtaBanner;
