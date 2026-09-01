import React from "react"
import { useStaticProps } from "./componentStaticProps"
import {
    ShieldLogo, DashboardIcon, GlobeIcon, ClipboardCheckIcon, AlertCircleIcon,
    LockCircleIcon, DomainsIcon, BreachIcon, LookalikeIcon, GearIcon,
    AccountIcon, UsersIcon, BellIcon, CollapseIcon, SearchIcon, PlusIcon,
    PencilIcon, TrashIcon, SortArrowIcon, CaretDownIcon, ScrollUpIcon, ScrollDownIcon
} from "./icons"
import "./index.css"

/*
 * SMC-PORTAL — static replica of the prospect's User Management portal screen.
 *
 * Nothing here is clickable: every control renders as an inert span. Buttons,
 * nav items, icons and footer links still carry hover states so the screen
 * feels live when it is being demoed or screen-recorded.
 */

const NAV_ITEMS = [
    { label: "Dashboard", Icon: DashboardIcon },
    { label: "Email Sources", Icon: GlobeIcon },
    { label: "Authorized Senders", Icon: ClipboardCheckIcon },
    { label: "Forensic Reports", Icon: AlertCircleIcon },
    { label: "SMTP TLS", Icon: LockCircleIcon },
    { label: "Domains", Icon: DomainsIcon },
    { label: "Breach Detection", Icon: BreachIcon },
    { label: "Lookalike Domains", Icon: LookalikeIcon },
    { label: "Account Administration", Icon: GearIcon, active: true, caret: true },
    { label: "Accounts", Icon: AccountIcon },
    { label: "Users", Icon: UsersIcon, active: true },
    { label: "Alerts", Icon: BellIcon }
]

const FOOTER_LINKS = ["DNS TOOLS", "WEBSITE", "PRIVACY POLICY"]

const SmcPortal = () => {
    const props = useStaticProps() || {}

    const {
        pageTitle = "User Management",
        accountName = "SENDMARC - INTERNAL USERS",
        rowOneName = "Sam",
        rowTwoName = "Sendmarc - Administrator",
        quotaPercent = "18.9",
        quotaValue = "47.2K / 250K"
    } = props

    // The administrator row is protected in the source portal: edit only, no delete.
    const rows = [
        { name: rowOneName, deletable: true },
        { name: rowTwoName, deletable: false }
    ]

    const quotaFill = Math.max(0, Math.min(100, parseFloat(quotaPercent) || 0))

    return (
        <div className="smcp">
            {/* --------------------------------------------------------- sidebar */}
            <aside className="smcp-sidebar">
                <div className="smcp-brand">
                    <span className="smcp-brand__mark"><ShieldLogo /></span>
                    <span className="smcp-brand__word">SENDMARC</span>
                </div>

                <div className="smcp-navwrap">
                    <nav className="smcp-nav">
                        {NAV_ITEMS.map(({ label, Icon, active, caret }) => (
                            <span
                                key={label}
                                className={`smcp-navitem${active ? " is-active" : ""}`}
                            >
                                <span className="smcp-navitem__icon"><Icon /></span>
                                <span className="smcp-navitem__label">{label}</span>
                                {caret ? (
                                    <span className="smcp-navitem__caret"><CaretDownIcon /></span>
                                ) : null}
                            </span>
                        ))}
                    </nav>

                    <div className="smcp-scrollbar" aria-hidden="true">
                        <span className="smcp-scrollbar__arrow"><ScrollUpIcon /></span>
                        <span className="smcp-scrollbar__track">
                            <span className="smcp-scrollbar__thumb" />
                        </span>
                        <span className="smcp-scrollbar__arrow"><ScrollDownIcon /></span>
                    </div>
                </div>

                <div className="smcp-quota">
                    <div className="smcp-quota__label">{quotaPercent}% Quota Used</div>
                    <div className="smcp-quota__track">
                        <div className="smcp-quota__fill" style={{ width: `${quotaFill}%` }} />
                    </div>
                    <div className="smcp-quota__value">{quotaValue}</div>
                </div>
            </aside>

            {/* ------------------------------------------------------------ main */}
            <div className="smcp-main">
                <header className="smcp-topbar">
                    <span className="smcp-collapse"><CollapseIcon /></span>
                    <h1 className="smcp-title">{pageTitle}</h1>
                    <span className="smcp-topsearch">
                        <span className="smcp-topsearch__icon"><SearchIcon /></span>
                        <span className="smcp-topsearch__placeholder">Search</span>
                    </span>
                </header>

                <div className="smcp-body">
                    <div className="smcp-card">
                        <span className="smcp-card__tile"><UsersIcon /></span>
                        <span className="smcp-fab"><PlusIcon /></span>

                        <div className="smcp-breadcrumb">
                            <span className="smcp-breadcrumb__item">ACCOUNTS</span>
                            <span className="smcp-breadcrumb__sep">/</span>
                            <span className="smcp-breadcrumb__item">{accountName}</span>
                        </div>

                        <div className="smcp-controls">
                            <span className="smcp-show">
                                Show <span className="smcp-show__box">10</span> entries
                            </span>
                            <span className="smcp-filter">
                                <span className="smcp-filter__label">Search</span>
                                <span className="smcp-filter__input" />
                            </span>
                        </div>

                        <table className="smcp-table">
                            <thead>
                                <tr>
                                    <th className="smcp-table__th">
                                        <span className="smcp-sort">
                                            Name
                                            <span className="smcp-sort__arrow"><SortArrowIcon /></span>
                                        </span>
                                    </th>
                                    <th className="smcp-table__th smcp-table__th--actions" />
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(({ name, deletable }) => (
                                    <tr key={name} className="smcp-row">
                                        <td className="smcp-row__name">{name}</td>
                                        <td className="smcp-row__actions">
                                            <span className="smcp-iconbtn smcp-iconbtn--edit">
                                                <PencilIcon />
                                            </span>
                                            {deletable ? (
                                                <span className="smcp-iconbtn smcp-iconbtn--delete">
                                                    <TrashIcon />
                                                </span>
                                            ) : (
                                                <span className="smcp-iconbtn smcp-iconbtn--empty" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="smcp-count">
                            Showing 1 to {rows.length} of {rows.length} entries
                        </div>
                    </div>
                </div>

                <footer className="smcp-footer">
                    <div className="smcp-footer__links">
                        {FOOTER_LINKS.map((link) => (
                            <span key={link} className="smcp-footer__link">{link}</span>
                        ))}
                    </div>
                    <div className="smcp-footer__copy">
                        © 2024 <span className="smcp-footer__brand">Sendmarc</span>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default SmcPortal
