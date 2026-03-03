// @flow
import React from "react";

const FaqItem = ({ question, answer, isExpanded, onToggle, isFirst, isLast }) => {
  return (
    <div>
      <h2>
        <button
          type="button"
          onClick={onToggle}
          className={
            (isLast && !isExpanded ? "rounded-b-xl " : "border-b-0 ") +
            (isFirst ? "rounded-t-xl " : "") +
            "flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-700 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 gap-3 transition-colors"
          }
          aria-expanded={isExpanded}
        >
          <span className="text-left">{question}</span>
          <svg
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div className={isExpanded ? "" : "hidden"}>
        <div
          className={
            (isLast ? "rounded-b-xl " : "border-b-0 ") +
            "p-5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 leading-relaxed"
          }
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  );
};

export default FaqItem;
