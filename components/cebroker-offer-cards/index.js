import React, { useEffect, useMemo, useState } from "react";
import { useCampaign, useBasket } from "@limio/sdk";
import { useStaticProps } from "./componentStaticProps";
import xss from "xss";
import "./index.css";

const sanitize = (str) => xss(str || "");

function groupOffers(offers, groupLabels) {
    const groups = {};
    for (const offer of offers || []) {
        const id = offer?.data?.attributes?.group__limio || "_other";
        groups[id] = groups[id] || [];
        groups[id].push(offer);
    }

    const ordered = [];
    for (const def of groupLabels || []) {
        if (groups[def.id]?.length) {
            ordered.push({ id: def.id, label: def.label, offers: groups[def.id] });
        }
    }
    return ordered;
}

function formatPrice(offer) {
    const attrs = offer?.data?.attributes || {};
    const priceList = Array.isArray(attrs.price__limio) ? attrs.price__limio : [];
    const first = priceList[0];

    if (first && first.value != null && first.value !== "") {
        const symbol = first.currency?.symbol || "$";
        const numeric = Number(first.value);
        const display = Number.isFinite(numeric)
            ? numeric.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })
            : first.value;
        return `${symbol}${display}`;
    }

    return attrs.display_price__limio || "";
}

const OfferRow = ({
    offer,
    primaryColor,
    showImage,
    showFreeTrialLink,
    freeTrialLink,
    onAdd,
}) => {
    const attrs = offer?.data?.attributes || {};
    const {
        display_name__limio,
        checkout_description__limio,
        cta_text__limio,
    } = attrs;

    const attachments = (offer?.data?.attachments || []).filter((a) =>
        (a?.type || "").includes("image")
    );
    const imageUrl = attachments[0]?.url;
    const priceHtml = formatPrice(offer);

    return (
        <article className="cb-card">
            {showImage && imageUrl && (
                <div className="cb-card-image">
                    <img src={imageUrl} alt={display_name__limio || ""} />
                </div>
            )}

            <div className="cb-card-main">
                <h3 className="cb-title">{display_name__limio}</h3>
                {checkout_description__limio && (
                    <div
                        className="cb-subtle"
                        dangerouslySetInnerHTML={{
                            __html: sanitize(checkout_description__limio),
                        }}
                    />
                )}
            </div>

            <div className="cb-card-side">
                {priceHtml && (
                    <div
                        className="cb-price"
                        dangerouslySetInnerHTML={{ __html: sanitize(priceHtml) }}
                    />
                )}
                <button
                    type="button"
                    className="cb-cta"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => onAdd(offer)}
                >
                    {cta_text__limio || "Add to cart"}
                </button>
                <button type="button" className="cb-cta-secondary">
                    More info
                </button>
                {showFreeTrialLink && freeTrialLink && (
                    <div
                        className="cb-free-trial"
                        dangerouslySetInnerHTML={{ __html: sanitize(freeTrialLink) }}
                    />
                )}
            </div>
        </article>
    );
};

export const CeBrokerOfferCards = () => {
    const props = useStaticProps() || {};
    const {
        heading,
        subheading,
        filterLabel,
        componentId,
        primaryColor = "#0B5394",
        showImage = true,
        showRoleFilter = true,
        roleFilterLabel = "I'm a",
        roleFilterAllLabel = "All roles",
        roleLabels = [],
        showStateFilter = true,
        stateFilterLabel = "in",
        stateFilterAllLabel = "All states",
        stateLabels = [],
        groupLabels = [],
        showGroupedOffers = true,
        showKeywordSearch = true,
        showFreeTrialLink = true,
        freeTrialLink,
    } = props;

    const { offers } = useCampaign();
    const basket = useBasket() || {};
    const { addOfferToBasket, initiateCheckout, navigateToCheckout, pageOptions, orderItems } = basket;

    const [selectedRole, setSelectedRole] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedGroup, setSelectedGroup] = useState();
    const [keyword, setKeyword] = useState("");

    const matchesAttribute = (value, selected) => {
        if (Array.isArray(value)) return value.includes(selected);
        return value === selected;
    };

    const topFilteredOffers = useMemo(() => {
        return (offers || []).filter((o) => {
            const attrs = o?.data?.attributes || {};
            if (selectedRole && !matchesAttribute(attrs.role, selectedRole)) return false;
            if (selectedState && !matchesAttribute(attrs.state, selectedState)) return false;
            return true;
        });
    }, [offers, selectedRole, selectedState]);

    const offerGroups = useMemo(
        () => groupOffers(topFilteredOffers, groupLabels),
        [topFilteredOffers, groupLabels]
    );

    useEffect(() => {
        if (offerGroups.length === 0) return;
        if (!selectedGroup || !offerGroups.some((g) => g.id === selectedGroup)) {
            setSelectedGroup(offerGroups[0].id);
        }
    }, [offerGroups, selectedGroup]);

    const groupFilteredOffers = showGroupedOffers
        ? offerGroups.find((g) => g.id === selectedGroup)?.offers || []
        : topFilteredOffers;

    const visibleOffers = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return groupFilteredOffers;
        return groupFilteredOffers.filter((o) =>
            (o?.data?.attributes?.display_name__limio || "")
                .toLowerCase()
                .includes(q)
        );
    }, [groupFilteredOffers, keyword]);

    const showSidebar =
        (showGroupedOffers && offerGroups.length > 0) || showKeywordSearch;

    const handleAdd = async (offer) => {
        // Use orderItems from the SDK to detect an active in-progress basket.
        // The SDK clears orderItems when a checkout completes, so returning
        // customers with a stale basket ID correctly get a fresh checkout.
        if (orderItems?.length > 0) {
            await addOfferToBasket({ offer });
        } else {
            await initiateCheckout({ order: { orderItems: [{ offer }] } });
        }
        if (pageOptions?.pushToCheckout && navigateToCheckout) {
            await navigateToCheckout();
        }
    };

    return (
        <section
            id={componentId}
            className="cebroker-offer-cards"
            style={{ "--cb-primary": primaryColor }}
        >
            <div className="cb-wrap">
                <header className="cb-header">
                    <h2 className="cb-heading">{heading}</h2>
                    {subheading && <p className="cb-subheading">{subheading}</p>}
                </header>

                {((showRoleFilter && roleLabels.length > 0) ||
                    (showStateFilter && stateLabels.length > 0)) && (
                    <div className="cb-top-bar">
                        {showRoleFilter && roleLabels.length > 0 && (
                            <>
                                <label
                                    className="cb-top-bar-label"
                                    htmlFor={`${componentId}-role`}
                                >
                                    {roleFilterLabel}
                                </label>
                                <select
                                    id={`${componentId}-role`}
                                    className="cb-top-bar-select"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    <option value="">{roleFilterAllLabel}</option>
                                    {roleLabels.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                        {showStateFilter && stateLabels.length > 0 && (
                            <>
                                <label
                                    className="cb-top-bar-label"
                                    htmlFor={`${componentId}-state`}
                                >
                                    {stateFilterLabel}
                                </label>
                                <select
                                    id={`${componentId}-state`}
                                    className="cb-top-bar-select"
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                >
                                    <option value="">{stateFilterAllLabel}</option>
                                    {stateLabels.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>
                )}

                <div className="cb-layout">
                    {showSidebar && (
                        <aside className="cb-filter">
                            {showGroupedOffers && offerGroups.length > 0 && (
                                <div className="cb-filter-section">
                                    <div className="cb-filter-label">{filterLabel}</div>
                                    <div className="cb-filter-list">
                                        {offerGroups.map((group) => {
                                            const selected = selectedGroup === group.id;
                                            return (
                                                <button
                                                    key={group.id}
                                                    type="button"
                                                    className={`cb-filter-item ${selected ? "is-selected" : ""}`}
                                                    onClick={() => setSelectedGroup(group.id)}
                                                >
                                                    <span>{group.label}</span>
                                                    <span className="cb-filter-count">
                                                        {group.offers.length}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {showKeywordSearch && (
                                <div className="cb-filter-section cb-filter-section--search">
                                    <div className="cb-filter-label">Keyword Search</div>
                                    <div className="cb-search">
                                        <svg
                                            className="cb-search-icon"
                                            viewBox="0 0 20 20"
                                            width="16"
                                            height="16"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M9 3a6 6 0 1 1-3.78 10.67l-3.6 3.6a1 1 0 1 1-1.41-1.41l3.6-3.6A6 6 0 0 1 9 3Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                                            />
                                        </svg>
                                        <input
                                            type="search"
                                            className="cb-search-input"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            aria-label="Keyword search"
                                        />
                                    </div>
                                </div>
                            )}
                        </aside>
                    )}

                    <div className="cb-results">
                        {visibleOffers.length > 0 ? (
                            visibleOffers.map((offer, i) => (
                                <OfferRow
                                    key={`${offer.path}-${i}`}
                                    offer={offer}
                                    primaryColor={primaryColor}
                                    showImage={showImage}
                                    showFreeTrialLink={showFreeTrialLink}
                                    freeTrialLink={freeTrialLink}
                                    onAdd={handleAdd}
                                />
                            ))
                        ) : (
                            <div className="cb-empty">No offers to display.</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CeBrokerOfferCards;
