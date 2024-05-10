import React from "react";
import * as R from "ramda";

export function renderElementWithProp(prop, elementTag, children) {
  if (prop) {
    return React.createElement(elementTag, prop, children);
  }
  return null;
}

export function getAllOfferFeatures(offers) {
  const allFeatures = offers.reduce((acc, offer) => {
    const features = offer.data.attributes.offer_features;
    return R.concat(acc, features);
  }, []);

  return R.uniq(allFeatures);
}
