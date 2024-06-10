// @flow
import React, { useState } from "react";
import "../source/style/style.css"

type Props = {
  headline: String,
  subline: String,
  faqItems: Array<{
    question: String,
    answer: String,
  }>,
  componentId: String
};

const FaqBanner = (props: Props): React.Node => {
  const { headline, subline, faqItems = [], componentId } = props;
  const [active, setActive] = useState()

  function isLast(index) {
    return index === faqItems.length - 1;
  }

  // Took the map function for items outside the "HTML" section for better reading and understanding
  const retrieveFaqItems = faqItems.map((item, i) => {
    const expanded = active === i
    const last = isLast(i)

    return (
      <div key={`${item.question}-${i}`}>
        <h2 id={`accordion-collapse-heading-${!active}`}>
          <button type="button"
                  onClick={() => setActive(i)}
                  className={(last && !expanded ? "rounded-b-xl " : "border-b-0 ") + (i === 0 ? "rounded-t-xl " : "") + "flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"}
                  data-accordion-target={`#accordion-collapse-body-${i}`} aria-expanded="true"
                  aria-controls={`accordion-collapse-body-${i}`}>
            <span>{item.question}</span>
            <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 5 5 1 1 5"/>
            </svg>
          </button>
        </h2>
        <div id={`accordion-collapse-body-${i}`} className={expanded ? "" : "hidden"} aria-labelledby={`accordion-collapse-body-${i}`}>
          <div className={(last ? "rounded-b-xl " : "border-b-0 ") + "p-5 text-gray-500 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900"} dangerouslySetInnerHTML={{
            __html: item.answer
          }}/>
        </div>
        </div>
    );
  });

  return (
      <section className="bg-white dark:bg-gray-900" id={componentId}>
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{headline}</h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{subline}</p>
          </div>
          <div id="accordion-collapse" data-accordion="collapse">
            {retrieveFaqItems}
          </div>
        </div>
      </section>
  );
};

export default FaqBanner;
