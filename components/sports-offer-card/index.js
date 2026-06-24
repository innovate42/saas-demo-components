// @flow
import React, { useEffect, useMemo, useState } from "react";
import { useCampaign } from "@limio/sdk";
import Offer from "./components/Offer.js";
import GiftSection from "./components/GiftSection.js";
import { useStaticProps } from "./componentStaticProps";
import "./fonts.css";
import "./index.css";

const capitalise = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

// Build the membership-type tabs from the offers' group__limio attribute
// (e.g. "adult" / "junior"). Offers without a group fall under "Memberships".
function groupOffersByType(offers) {
  const byGroup = {};
  (offers || []).forEach((offer) => {
    const attrs = offer && offer.data && offer.data.attributes;
    const group = (attrs && attrs.group__limio) || "all";
    (byGroup[group] = byGroup[group] || []).push(offer);
  });

  return Object.keys(byGroup).map((groupId) => ({
    id: groupId,
    label: groupId === "all" ? "Memberships" : capitalise(groupId),
    offers: byGroup[groupId],
  }));
}

const SportsOfferCard = () => {
  const {
    subheading = "Select a membership type and the number of memberships you'd like.",
    componentId = "sports-offers",
    accentColor = "#132257",
    showSideImage = true,
    sideImageUrl = "",
    backLinkUrl = "",
    backLinkText = "Back",
    showPromoCode = true,
    promoAppliedText = "Promo code applied. You saved {{discountAmount}}.",
    showGiftSection = false,
    showGiftToggle = false,
    giftSectionHeading = "Buying as a gift?",
    giftModalHeading = "Enter your gift code",
    giftLinkUrl = "/checkout-redeem",
    giftConfirmButtonUrl = "/checkout-redeem",
    showDisclaimer = true,
    disclaimerText = "",
    moreInfoText = "Membership details",
  } = useStaticProps();

  const { offers } = useCampaign();

  const groups = useMemo(() => groupOffersByType(offers), [offers]);

  const [selectedGroup, setSelectedGroup] = useState();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    if (!selectedGroup && groups.length) {
      setSelectedGroup(groups[0].id);
    }
  }, [groups, selectedGroup]);

  const activeGroup = groups.find((g) => g.id === selectedGroup) || groups[0];
  const activeOffers = activeGroup ? activeGroup.offers : [];

  const accentStyle = { ["--soc2-accent"]: accentColor };

  return (
    <section id={componentId} className="soc2" style={accentStyle}>
      <div className="soc2-layout">
        {showSideImage && sideImageUrl ? (
          <div
            className="soc2-side-image"
            style={{ backgroundImage: `url(${sideImageUrl})` }}
            role="img"
            aria-label="Membership marketing banner"
          />
        ) : null}

        <div className="soc2-panel">
          {backLinkUrl ? (
            <a className="soc2-back-link" href={backLinkUrl}>
              <span aria-hidden="true">&#8592;</span> {backLinkText}
            </a>
          ) : null}

          {subheading ? <p className="soc2-subheading">{subheading}</p> : null}

          {groups.length > 1 ? (
            <div className="soc2-tabs" role="tablist">
              {groups.map((group) => {
                const selected = group.id === selectedGroup;
                return (
                  <button
                    key={group.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={`soc2-tab${selected ? " soc2-tab--active" : ""}`}
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    {group.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="soc2-cards">
            {activeOffers.length > 0 ? (
              activeOffers.map((offer, i) => (
                <Offer
                  key={`${offer.path}-${i}`}
                  offer={offer}
                  moreInfoText={moreInfoText}
                />
              ))
            ) : (
              <p className="soc2-empty">
                No memberships to display. Add offers with a matching label to this page.
              </p>
            )}
          </div>

          {showPromoCode ? (
            <div className="soc2-promo">
              {promoApplied ? (
                <p className="soc2-promo-applied">
                  {promoAppliedText.replace("{{discountAmount}}", promoCode ? "your discount" : "")}
                </p>
              ) : (
                <div className="soc2-promo-row">
                  <input
                    className="soc2-promo-input"
                    type="text"
                    value={promoCode}
                    placeholder="Promo code"
                    onChange={(e) => setPromoCode(e.target.value)}
                    aria-label="Promo code"
                  />
                  <button
                    type="button"
                    className="soc2-promo-apply"
                    disabled={!promoCode}
                    onClick={() => setPromoApplied(true)}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {showGiftSection ? (
            <GiftSection
              heading={giftSectionHeading}
              modalHeading={giftModalHeading}
              redeemLinkUrl={giftLinkUrl}
              confirmButtonUrl={giftConfirmButtonUrl}
              showToggle={showGiftToggle}
            />
          ) : null}

          {showDisclaimer && disclaimerText ? (
            <div
              className="soc2-disclaimer"
              dangerouslySetInnerHTML={{ __html: disclaimerText }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default SportsOfferCard;
