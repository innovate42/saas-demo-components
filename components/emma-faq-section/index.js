// @flow
import React, { useState } from "react";
import FaqItem from "./components/FaqItem.js";
import CtaBanner from "./components/CtaBanner.js";
import "../source/style/style.css";

type FaqItemType = {
  question: string,
  answer: string,
};

type Props = {
  faqHeading: string,
  faqItems: Array<FaqItemType>,
  ctaHeading: string,
  ctaDescription: string,
  ctaButtonText: string,
  ctaButtonLink: string,
  primaryColor__limio_color: string,
  componentId: string,
};

function EmmaFaqSection({
  faqHeading,
  faqItems = [],
  ctaHeading,
  ctaDescription,
  ctaButtonText,
  ctaButtonLink,
  primaryColor__limio_color,
  componentId,
}: Props): React.Node {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white dark:bg-gray-900" id={componentId}>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {/* FAQ Section */}
        {faqHeading && (
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-3xl sm:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              {faqHeading}
            </h2>
          </div>
        )}

        {faqItems.length > 0 && (
          <div className="mx-auto max-w-screen-lg">
            {faqItems.map((item, i) => (
              <FaqItem
                key={`faq-${i}`}
                question={item.question}
                answer={item.answer}
                isExpanded={activeIndex === i}
                onToggle={() => handleToggle(i)}
                isFirst={i === 0}
                isLast={i === faqItems.length - 1}
              />
            ))}
          </div>
        )}

        {/* CTA Banner */}
        {ctaHeading && (
          <div className="mx-auto max-w-screen-lg">
            <CtaBanner
              heading={ctaHeading}
              description={ctaDescription}
              buttonText={ctaButtonText || "Let's chat"}
              buttonLink={ctaButtonLink || "#"}
              primaryColor={primaryColor__limio_color}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default EmmaFaqSection;
