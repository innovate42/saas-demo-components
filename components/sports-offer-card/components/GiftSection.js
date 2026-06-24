// @flow
import React, { useState } from "react";

const GiftSection = ({
  heading = "Buying as a gift?",
  modalHeading = "Enter your gift code",
  redeemLinkUrl = "/checkout-redeem",
  confirmButtonUrl = "/checkout-redeem",
  showToggle = false,
}) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  function confirm() {
    if (typeof window === "undefined") return;
    const base = confirmButtonUrl || redeemLinkUrl;
    const url = code
      ? `${base}${base.includes("?") ? "&" : "?"}code=${encodeURIComponent(code)}`
      : base;
    window.location.href = url;
  }

  return (
    <div className="soc2-gift">
      <div className="soc2-gift-header">
        <span className="soc2-gift-heading">{heading}</span>
        {showToggle ? (
          <button
            type="button"
            className="soc2-gift-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            {open ? "Close" : "Redeem a gift code"}
          </button>
        ) : (
          <a className="soc2-gift-link" href={redeemLinkUrl}>
            Redeem a gift code
          </a>
        )}
      </div>

      {showToggle && open ? (
        <div className="soc2-gift-modal" role="dialog" aria-label={modalHeading}>
          <p className="soc2-gift-modal-heading">{modalHeading}</p>
          <div className="soc2-gift-modal-row">
            <input
              className="soc2-gift-input"
              type="text"
              value={code}
              placeholder="Gift code"
              onChange={(e) => setCode(e.target.value)}
              aria-label="Gift code"
            />
            <button
              type="button"
              className="soc2-gift-confirm"
              disabled={!code}
              onClick={confirm}
            >
              Confirm
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GiftSection;
