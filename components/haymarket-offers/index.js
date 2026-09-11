// @flow
import React, { useEffect, useMemo, useState } from "react";
import { useCampaign } from "@limio/sdk";
import Offer from "./components/Offer.js";
import { sanitizeString } from "../source/utils/string";
import "../source/style/style.css";
import "./index.css";
import * as R from "ramda";

type Props = {
  heading: string,
  subheading: string,
  offerWidth: number,
};

function groupOffers(offers, groupLabels) {
  const groups = R.groupBy(
    R.path(["data", "attributes", "group__limio"]),
    offers
  );

  const order = (groupLabels || []).map((g) => g.id);
  const sorted = {};
  order.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(groups, key)) {
      sorted[key] = groups[key];
    }
  });

  return Object.keys(sorted)
    .map((groupId) => {
      const group = (groupLabels || []).find((g) => g.id === groupId);
      if (!group) return undefined;
      return {
        groupId,
        id: groupId,
        label: group.label,
        thumbnail: group.thumbnail,
        offers: groups[groupId],
      };
    })
    .filter((g) => g !== undefined);
}

export const HaymarketOffers = ({
  heading,
  subheading,
  seatLabel,
  seatHelpText,
  totalLabel,
  componentId,
  offerWidth,
  showImage,
  primaryColor__limio_color,
  headingColor__limio_color,
  bodyColor__limio_color,
  accentColor__limio_color,
  surfaceColor__limio_color,
  best_value_color__limio_color,
  showGroupedOffers,
  groupLabels,
  footnote,
}: Props) => {
  const { offers } = useCampaign();

  const offerGroups = useMemo(
    () => groupOffers(offers, groupLabels),
    [offers, groupLabels]
  );

  const [selectedGroup, setSelectedGroup] = useState();
  const selectedGroupItem = offerGroups.find((g) => g.id === selectedGroup);
  const visibleOffers = showGroupedOffers
    ? selectedGroupItem?.offers || []
    : offers;

  useEffect(() => {
    if (!selectedGroup) setSelectedGroup(offerGroups[0]?.id);
  }, [offerGroups, selectedGroup]);

  useEffect(() => {
    typeof performance !== "undefined" && performance?.mark?.("offers-init");
  }, []);

  const theme = {
    primary: primaryColor__limio_color,
    heading: headingColor__limio_color,
    body: bodyColor__limio_color,
    accent: accentColor__limio_color,
    bestValue: best_value_color__limio_color,
  };

  return (
    <section
      className="hm-offers"
      id={componentId}
      style={{ backgroundColor: surfaceColor__limio_color }}
    >
      <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 flex flex-col">
        <div className="mx-auto max-w-screen-md text-center mb-10 lg:mb-14">
          <h2
            className="hm-heading mb-4 text-4xl lg:text-5xl tracking-tight font-extrabold"
            style={{ color: theme.heading }}
          >
            {heading}
          </h2>
          <p className="hm-subheading text-lg sm:text-xl" style={{ color: theme.body }}>
            {subheading}
          </p>
        </div>

        {showGroupedOffers && offerGroups.length > 1 && (
          <div className="hm-toggle mx-auto mb-10" role="tablist">
            {offerGroups.map((group, i) => {
              const active = selectedGroup === group.id;
              return (
                <button
                  key={`${group.id}-${i}`}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedGroup(group.id)}
                  className="hm-toggle-btn"
                  style={
                    active
                      ? { backgroundColor: theme.primary, color: "#ffffff" }
                      : { color: theme.body }
                  }
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex justify-center flex-wrap items-stretch gap-6">
          {visibleOffers.length > 0 ? (
            visibleOffers.map((offer, i) => (
              <Offer
                key={`${offer.path}/parent-${i}`}
                offer={offer}
                showImage={showImage}
                offerWidth={offerWidth}
                theme={theme}
                seatLabel={seatLabel}
                seatHelpText={seatHelpText}
                totalLabel={totalLabel}
              />
            ))
          ) : (
            <p style={{ color: theme.body }}>No offers to display.</p>
          )}
        </div>

        {footnote && (
          <p
            className="hm-footnote text-center mt-10"
            style={{ color: theme.body }}
            dangerouslySetInnerHTML={{ __html: sanitizeString(footnote) }}
          />
        )}
      </div>
    </section>
  );
};

export default HaymarketOffers;
