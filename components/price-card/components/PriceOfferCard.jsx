import React, { useState } from "react";

const PriceOfferCard = ({
  title,
  priceMonthly,
  priceYearly,
  savings,
  quantity,
  billingPeriod,
  mostPopular,
}) => {
 


 
  return (
    <div
      className={`w-full  rounded-lg px-2 py-4 overflow-hidden border ${
        mostPopular ? "most_pupular" : ""
      }`}
    >
      <div className="bg-gray-200 p-4">
        <h2 className="text-lg font-bold text-center">{title}</h2>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-center">
          <div>
            {billingPeriod === "monthly" ? (
              <p className="text-gray-600">${priceMonthly} / mo</p>
            ) : (
              <p className="text-gray-600">${priceYearly} / yr</p>
            )}
          </div>
        </div>
        {savings && billingPeriod === "yearly" && (
          <p className="text-green-600 text-center text-xs">
            Save
            <span className="font-bold">
              {" "}
              ${billingPeriod === "monthly" ? savings : savings * quantity}
            </span>{" "}
            with yearly billing
          </p>
        )}
        <div className="mt-4 ">
          <p className="text-gray-600 text-center font-bold">
            {" "}
            $
            {billingPeriod === "monthly"
              ? priceMonthly * quantity
              : priceYearly * quantity - savings * quantity}
          </p>
        </div>

     
      </div>
    </div>
  );
};

export default PriceOfferCard;
