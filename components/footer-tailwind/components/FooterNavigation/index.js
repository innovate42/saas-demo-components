// @flow
import React from "react"

const FooterNavigation = ({ items = [], alignment, divider }) => (
  <div className="flex w-full justify-center sm:w-1/2 sm:justify-end sm:items-start">
    {items.map((item, index) => (
      <div className=" m-0.5  p-1 sm:m-2" key={item.url + index}>
        <a href={item.url} className="hover:text-blue-700 dark:text-white">{item.label}</a>
        <div className="footer-divide">{divider}</div>
      </div>
    ))}
  </div>
)

export default FooterNavigation
