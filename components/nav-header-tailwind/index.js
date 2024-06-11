// @flow
import React, { useState } from "react"
import "../source/style/style.css"

export function NavHeader({ logo, logoHref, logoText, items, componentId }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <nav className="border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700" id={componentId}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href={logoHref} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="h-8" alt="Header Logo"/>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">{logoText}</span>
                </a>
                <button data-collapse-toggle="navbar-hamburger" type="button"
                        className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-hamburger" aria-expanded="false"
                        onClick={() => setExpanded(!expanded)}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className={expanded ? "w-full" : "hidden w-full"} id="navbar-hamburger">
                    <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                        {
                            items.map(({href, label}, i) => (
                                <li key={`${label}-${i}`}>
                                    <a href={href} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{label}</a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavHeader
