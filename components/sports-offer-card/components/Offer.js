// @flow
import React, { useState } from "react";
import { sanitiseHTML } from "@limio/sdk";
import { AddToBasketButton } from "./AddToBasketButton.js";

// Spurs feature lists come through as a series of block elements (<p> or <li>).
// Render each child element's text as a ticked benefit line.
function renderFeatures(featuresHtml) {
  if (!featuresHtml || typeof document === "undefined") return null;

  const container = document.createElement("div");
  container.innerHTML = sanitiseHTML(featuresHtml);

  const nodes = Array.from(container.children).filter(
    (el) => el.innerText && el.innerText.trim().length
  );

  if (!nodes.length) return null;

  return (
    <ul className="soc2-features">
      {nodes.map((el, i) => (
        <li key={i} className="soc2-feature">
          <svg
            className="soc2-feature-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>{el.innerText.trim()}</span>
        </li>
      ))}
    </ul>
  );
}

const Offer = ({ offer, moreInfoText = "Membership details" }) => {
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const {
    display_name__limio,
    display_price__limio,
    detailed_display_price__limio,
    offer_features__limio,
    offer_learn_more_detail,
    best_value__limio,
  } = offer.data.attributes;

  return (
    <div className={`soc2-card${best_value__limio ? " soc2-card--best" : ""}`}>
      {best_value__limio ? (
        <span className="soc2-best-value">Most popular</span>
      ) : null}

      {display_name__limio ? (
        <h3 className="soc2-card-title">{display_name__limio}</h3>
      ) : null}

      {detailed_display_price__limio ? (
        <div
          className="soc2-eligibility"
          dangerouslySetInnerHTML={{
            __html: sanitiseHTML(detailed_display_price__limio),
          }}
        />
      ) : null}

      {display_price__limio ? (
        <div
          className="soc2-price"
          dangerouslySetInnerHTML={{
            __html: sanitiseHTML(display_price__limio),
          }}
        />
      ) : null}

      {renderFeatures(offer_features__limio)}

      <div className="soc2-qty">
        <span className="soc2-qty-label">Memberships</span>
        <div className="soc2-qty-control">
          <button
            type="button"
            className="soc2-qty-btn"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            &#8722;
          </button>
          <span className="soc2-qty-value">{quantity}</span>
          <button
            type="button"
            className="soc2-qty-btn"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
          >
            &#43;
          </button>
        </div>
      </div>

      <AddToBasketButton offer={offer} quantity={quantity} />

      {offer_learn_more_detail ? (
        <div className="soc2-drawer">
          <button
            type="button"
            className="soc2-drawer-toggle"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {moreInfoText}
            <span className={`soc2-drawer-chevron${open ? " soc2-drawer-chevron--open" : ""}`} aria-hidden="true">
              &#9662;
            </span>
          </button>
          {open ? (
            <div className="soc2-drawer-section">
              <div
                className="soc2-drawer-section-content"
                dangerouslySetInnerHTML={{
                  __html: sanitiseHTML(offer_learn_more_detail),
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Offer;
