import React, { useEffect, useMemo, useState } from "react";
import { useCampaign, useBasket } from "@limio/sdk";
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket";
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
        const symbol = first.currency?.symbol || "";
        const numeric = Number(first.value);
        const display = Number.isFinite(numeric)
            ? numeric.toLocaleString(undefined, {
                  minimumFractionDigits: numeric % 1 === 0 ? 0 : 2,
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
        groupLabels = [],
        showGroupedOffers = true,
        showFreeTrialLink = true,
        freeTrialLink,
    } = props;

    const { offers } = useCampaign();
    const basket = useBasket() || {};
    const { addOfferToBasket, initiateCheckout, navigateToCheckout, pageOptions } = basket;

    const [selectedRole, setSelectedRole] = useState("");
    const [selectedGroup, setSelectedGroup] = useState();

    const roleFilteredOffers = useMemo(() => {
        if (!selectedRole) return offers || [];
        return (offers || []).filter(
            (o) => o?.data?.attributes?.role__limio === selectedRole
        );
    }, [offers, selectedRole]);

    const offerGroups = useMemo(
        () => groupOffers(roleFilteredOffers, groupLabels),
        [roleFilteredOffers, groupLabels]
    );

    useEffect(() => {
        if (offerGroups.length === 0) return;
        if (!selectedGroup || !offerGroups.some((g) => g.id === selectedGroup)) {
            setSelectedGroup(offerGroups[0].id);
        }
    }, [offerGroups, selectedGroup]);

    const visibleOffers = showGroupedOffers
        ? offerGroups.find((g) => g.id === selectedGroup)?.offers || []
        : roleFilteredOffers;

    const handleAdd = async (offer) => {
        try {
            const checkoutId = getCurrentBasketId && getCurrentBasketId();
            if (!checkoutId && initiateCheckout) {
                await initiateCheckout({ order: { orderItems: [{ offer }] } });
            } else if (addOfferToBasket) {
                await addOfferToBasket({ offer });
            }
            if (pageOptions?.pushToCheckout && navigateToCheckout) {
                await navigateToCheckout();
            }
        } catch (e) {
            console.warn("[cebroker-offer-cards] add to basket failed", e);
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

                {showRoleFilter && roleLabels.length > 0 && (
                    <div className="cb-role-bar">
                        <label className="cb-role-label" htmlFor={`${componentId}-role`}>
                            {roleFilterLabel}
                        </label>
                        <select
                            id={`${componentId}-role`}
                            className="cb-role-select"
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
                    </div>
                )}

                <div className="cb-layout">
                    {showGroupedOffers && offerGroups.length > 0 && (
                        <aside className="cb-filter">
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
