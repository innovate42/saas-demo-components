import React, { useState } from "react";

function ToggleSwitch({ selected, setSelected, offerGroups }) {
  const handleToggle = (option) => {
    setSelected(option.toLowerCase());
  };
  const left = offerGroups[0].charAt(0).toUpperCase() + offerGroups[0].slice(1);
  const right =
    offerGroups[1].charAt(0).toUpperCase() + offerGroups[1].slice(1);

  return (
    <div className="toggle-switch">
      <div
        className={`toggle-option ${
          selected === left.toLowerCase() ? "selected" : ""
        }`}
        onClick={() => handleToggle(left)}
      >
        {left}
      </div>
      <div
        className={`toggle-option ${
          selected === right.toLowerCase() ? "selected" : ""
        }`}
        onClick={() => handleToggle(right)}
      >
        {right}
      </div>
    </div>
  );
}

export default ToggleSwitch;
