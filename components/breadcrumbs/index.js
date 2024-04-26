//@flow
import React from "react";
import BreadcrumbItem from "./components/BreadcrumbItem";

type Props = {
  breadcrumbs: Array<BreadcrumbItemProps>,
  componentId: string,
};

type BreadcrumbItemProps = {
  text: string,
  url: string,
};

export default function Breadcrumbs(props: Props) {
  const { breadcrumbs, componentId } = props;

  function isLast(index) {
    return index === breadcrumbs.length - 1;
  }

  return (
      <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb" id={componentId}>
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          {
            breadcrumbs.map((breadcrumb, index) => <BreadcrumbItem key={JSON.stringify(breadcrumb)} breadcrumb={breadcrumb} isLast={isLast(index)} isFirst={index === 0}/>)
          }
        </ol>
      </nav>
  );
}
