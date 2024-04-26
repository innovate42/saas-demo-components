//@flow
import React from "react";

type Props = {
  breadcrumb: { text: string, url: string },
  isLast: boolean,
  isFirst: boolean,
};

const formatUrl = (url) => {
  const params = new URL(window.location).searchParams;
  const subId = params.get("subId");

  if (subId) {
    return `${url}?subId=${params.get("subId")}`;
  } else {
    return url;
  }
};

const BreadcrumbItem = ({
  breadcrumb,
  isLast,
  isFirst
}: Props) => {
  return (
      <li className="inline-flex items-center">
        <a href={formatUrl(breadcrumb.url)}
           className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
          {
            isFirst &&
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                            viewBox="0 0 20 20">
                <path
                    d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
          }
          {breadcrumb.text}
          {
            !isLast &&
              <svg className="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 9 4-4-4-4"/>
              </svg>
          }
        </a>
      </li>
  );
};

export default BreadcrumbItem;
