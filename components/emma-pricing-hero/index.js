// @flow
import React from "react";
import "../source/style/style.css";

type Props = {
  heading: string,
  subheading: string,
  componentId: string,
};

function EmmaPricingHero({ heading, subheading, componentId }: Props): React.Node {
  return (
    <section className="bg-white dark:bg-gray-900" id={componentId}>
      <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-6">
        <div className="mx-auto max-w-screen-lg text-center">
          <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white leading-tight">
            {heading}
          </h1>
          <p className="font-light text-gray-500 text-lg sm:text-xl dark:text-gray-400">
            {subheading}
          </p>
        </div>
      </div>
    </section>
  );
}

export default EmmaPricingHero;
