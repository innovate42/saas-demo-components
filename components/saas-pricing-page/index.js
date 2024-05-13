//@flow
import * as React from "react";
import {useState} from "react";
import "./index.css";
import ToggleSwitch from "./components/ToggleSwitch";
import PricingPageError from "./components/PricingPageError";
import {ErrorBoundary, useCampaign, useBasket} from "@limio/sdk";
import {getAllOfferFeatures} from "./helpers";


type Props = {};

function SaasPricingPage({}: Props): React.Node {
    const [licenses, setLicenses] = React.useState(1);
    const { addToBasket } = useBasket();

    const {offers = []} = useCampaign();
    const allFeatures = React.useMemo(
        () => getAllOfferFeatures(offers),
        [offers]
    );

    const offerGroups = offers.reduce((acc, offer) => {
        const key = offer.data.attributes.group__limio || false;

        if (!key || acc.includes(key)) {
            return acc;
        }

        return [...acc, key];
    }, []);


    const [selected, setSelected] = useState(offerGroups[0].toLowerCase());

    const sortedOffers = offers
        .sort(
            (a, b) =>
                a.data.attributes.offer_features.length -
                b.data.attributes.offer_features.length
        )
        .filter((offer) => {
            const group = offer.data.attributes.group__limio || "";
            if (!group) {
                return false;
            }
            return group.toLowerCase() === selected;
        });

    const handleLicensesChange = (e) => {
        setLicenses(e.target.value);
    };

    const renderFeatureCell = (offer, feature) => {
        return offer.data.attributes.offer_features.includes(feature) ? "✔️" : "➖";
    };

    const addToBasketHandler = (offer) => {
        addToBasket(offer, null, licenses)
    };

    return (
        <ErrorBoundary fallback={<PricingPageError/>}>
            <div className="page-container">
      <span className="options-box">
        <div className="options-element-box br">
          <h2>Subscription Term</h2>
          <ToggleSwitch
              selected={selected}
              setSelected={setSelected}
              offerGroups={offerGroups}
          />
        </div>
        <div className="options-element-box">
          <h2>Number of licenses</h2>
          <input
              type="number"
              value={licenses}
              onChange={(e) => handleLicensesChange(e)}
              className="input-field"
          />
        </div>
      </span>
                <table className="pricing-table">
                    <thead>
                    <tr>
                        <th></th>
                        {sortedOffers.map((offer, index) => {
                            const bestValue = offer.data.attributes.best_value__limio || "";

                            return (
                                <th
                                    key={`offer-header-${index}`}
                                    className={bestValue ? "best-value table-head" : "table-head"}
                                >
                                    {bestValue && (
                                        <div className="best-value-badge">Best Value</div>
                                    )}
                                    <div className="internal-offer-head">
                                        <div>{offer.data.attributes.display_name__limio}</div>
                                        <div className="pricing-texts">
                                            <div>{offer.data.attributes.display_price__limio || ""}</div>
                                            <div>{offer.data.attributes.detailed_display_price__limio || ""}</div>
                                        </div>

                                        <button className={bestValue ? "best-value-cta" : "cta"} onClick={() => addToBasketHandler(offer)}>
                                            {offer.data.attributes.cta_text__limio}
                                        </button>
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {allFeatures.map((feature, index) => (
                        <tr key={`feature-${index}`}>
                            <td>{feature}</td>
                            {sortedOffers.map((offer, offerIndex) => {
                                const bestValue = offer.data.attributes.best_value__limio || "";

                                const classes = bestValue ? "best-value-offer icon" : "icon";
                                return (
                                    <td
                                        key={`feature-${index}-offer-${offerIndex}`}
                                        className={classes}
                                    >
                                        {renderFeatureCell(offer, feature)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </ErrorBoundary>
    );
}

export default SaasPricingPage;
