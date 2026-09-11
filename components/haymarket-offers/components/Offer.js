// @flow
import React, { useMemo, useState } from "react";
import { sanitizeString, formatDisplayPrice } from "../../source/utils/string";
import { AddToBasketButton } from "./AddToBasketButton";

const CURRENCY_SYMBOLS = { GBP: "£", EUR: "€", USD: "$" };

function formatMoney(value, currencyCode) {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || "";
  const n = Number(value);
  if (!isFinite(n)) return `${symbol}${value}`;
  return `${symbol}${n.toLocaleString("en-GB", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

const Offer = ({
  offer,
  showImage,
  offerWidth,
  theme,
  seatLabel,
  seatHelpText,
  totalLabel,
}) => {
  const attachments = offer.data.attachments
    ? offer.data.attachments.filter((x) => x.type.includes("image"))
    : [];
  const hasAttachments = attachments.length > 0;

  const {
    display_name__limio,
    display_price__limio,
    display_equivalent_price,
    offer_features__limio,
    price__limio,
    detailed_display_price__limio,
    best_value__limio,
    display_description__limio,
    allow_multibuy__limio,
    default_quantity_options__limio,
  } = offer.data.attributes;

  const qtyOpts = default_quantity_options__limio || {};
  const min = Number(qtyOpts.minimum_quantity) || 1;
  const max = Number(qtyOpts.maximum_quantity) || 999;
  const step = Number(qtyOpts.increment) || 1;
  const initial = Number(qtyOpts.quantity) || min;

  const [seats, setSeats] = useState(initial);
  const isPerSeat = Boolean(allow_multibuy__limio);

  const unitPrice = price__limio?.[0]?.value;
  const currencyCode = price__limio?.[0]?.currencyCode;

  const total = useMemo(() => {
    const n = Number(unitPrice);
    if (!isFinite(n)) return null;
    return n * seats;
  }, [unitPrice, seats]);

  const clamp = (n) => Math.min(max, Math.max(min, n));
  const dec = () => setSeats((s) => clamp(s - step));
  const inc = () => setSeats((s) => clamp(s + step));
  const onType = (e) => {
    const v = parseInt(e.target.value, 10);
    setSeats(isNaN(v) ? min : clamp(v));
  };

  const bestValueBorder = best_value__limio
    ? `2px solid ${theme.bestValue}`
    : undefined;
  const bestValueText = display_description__limio || "Most popular";

  const formatBulletPoints = (string) => {
    const sanitised = sanitizeString(string);
    const holder = document.createElement("div");
    holder.innerHTML = sanitised;

    return [].slice.call(holder.children).map((feature, i) => (
      <li className="flex items-start gap-3" key={`${feature.innerText}-${i}`}>
        <svg
          className="flex-shrink-0 w-5 h-5 mt-0.5"
          fill="currentColor"
          style={{ color: theme.primary }}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>{feature.innerText}</span>
      </li>
    ));
  };

  return (
    <div
      className="hm-card flex flex-col p-6 xl:p-8 text-center"
      style={{
        minWidth: `${offerWidth * 10}em`,
        maxWidth: `${offerWidth * 10}em`,
        border: bestValueBorder,
        color: theme.body,
      }}
    >
      {best_value__limio && (
        <span className="hm-best-value" style={{ backgroundColor: theme.bestValue }}>
          {String(bestValueText).toUpperCase()}
        </span>
      )}

      <h3
        className="hm-card-title mb-4 text-2xl font-bold break-words"
        style={{ color: theme.heading }}
      >
        {display_name__limio}
      </h3>

      {showImage && hasAttachments && (
        <div className="flex flex-row justify-center mb-4">
          <div style={{ maxWidth: "40%" }}>
            <img
              src={attachments[0].url}
              alt={display_name__limio}
              className="rounded-lg object-scale-down"
            />
          </div>
        </div>
      )}

      <div className="flex justify-center items-baseline my-2">
        <span
          className="hm-price text-4xl font-extrabold"
          style={{ overflowWrap: "anywhere", color: theme.heading }}
          dangerouslySetInnerHTML={{
            __html: sanitizeString(
              formatDisplayPrice(display_price__limio, [
                { currencyCode, value: unitPrice },
              ])
            ),
          }}
        />
      </div>

      {display_equivalent_price && (
        <p className="hm-muted text-sm mb-2">{display_equivalent_price}</p>
      )}

      <p
        className="hm-muted text-sm mb-5"
        dangerouslySetInnerHTML={{
          __html: sanitizeString(
            formatDisplayPrice(detailed_display_price__limio, [
              { currencyCode, value: unitPrice },
            ])
          ),
        }}
      />

      {isPerSeat && (
        <div className="hm-seats mb-5">
          <div className="flex items-center justify-between mb-2">
            <label
              className="hm-seat-label font-semibold"
              htmlFor={`seats-${offer.id}`}
            >
              {seatLabel}
            </label>
            <div className="hm-stepper" style={{ borderColor: theme.primary }}>
              <button
                type="button"
                onClick={dec}
                disabled={seats <= min}
                aria-label="Remove a seat"
                style={{ color: theme.primary }}
              >
                &minus;
              </button>
              <input
                id={`seats-${offer.id}`}
                type="number"
                value={seats}
                min={min}
                max={max}
                step={step}
                onChange={onType}
                aria-label={seatLabel}
                style={{ color: theme.heading }}
              />
              <button
                type="button"
                onClick={inc}
                disabled={seats >= max}
                aria-label="Add a seat"
                style={{ color: theme.primary }}
              >
                +
              </button>
            </div>
          </div>
          {seatHelpText && <p className="hm-muted text-xs text-left">{seatHelpText}</p>}

          {total !== null && (
            <div
              className="hm-total mt-4"
              style={{ borderTopColor: "rgba(38,22,85,0.15)" }}
            >
              <span className="hm-muted text-sm">{totalLabel}</span>
              <strong style={{ color: theme.heading }}>
                {formatMoney(total, currencyCode)}
                <span className="hm-muted font-normal text-sm"> / year</span>
              </strong>
            </div>
          )}
        </div>
      )}

      <ul role="list" className="hm-features mb-8 space-y-3 text-left">
        {offer_features__limio && formatBulletPoints(offer_features__limio)}
      </ul>

      <AddToBasketButton
        offer={offer}
        primaryColor={theme.primary}
        quantity={isPerSeat ? seats : undefined}
      />
    </div>
  );
};

export default Offer;
