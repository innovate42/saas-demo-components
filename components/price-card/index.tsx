//@flow
import * as React from "react";
import PriceOfferCard from "./components/PriceOfferCard";
import "./styles.css";

type Props = {

  PriceOfferData: Array<{
    id: string;
    title: string;
    priceMonthly: number;
    priceYearly: number;
    savings: number;
    quantity: number;
    billingPeriod: string;
    onToggleBillingPeriod: string;
    mostPopular: boolean;
  }>;
};

function PriceCard({

  PriceOfferData = [],
}: Props) {
  const [billingPeriod, setBillingPeriod] = React.useState("monthly");
  const [changeQuatity, setChangeQuatity] = React.useState(0);

  const handleToggleBillingPeriod = () => {
    setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly");
  };

  
  const handleQuantityChange = (e) => {
    setChangeQuatity(e.target.value);
  };

  return (
    <div className="container mx-auto mt-8 px-4 py-4">
      <div className="flex justify-center items-center mb-4 gap-3">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={billingPeriod === "yearly"}
            onChange={handleToggleBillingPeriod}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {billingPeriod === "monthly" ? "Monthly" : "Yearly"}
          </span>
        </label>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">Quantity</span>
          <input
            type="number"
            min="1"
            value={changeQuatity}
            onChange={handleQuantityChange}
            style={{ background: "#D3D3D3" }}
            className="w-10 p-2 h-auto rounded-md border-gray-300  mr-2 "
          />
        </div>
      </div>
    
      <div className="flex gap-3">
        {PriceOfferData?.map((item, i) => {
          return (
            <PriceOfferCard
              key={item?.id}
              title={item?.title}
              priceMonthly={item?.priceMonthly}
              priceYearly={item?.priceYearly}
              savings={item?.savings}
              quantity={changeQuatity}
              billingPeriod={billingPeriod}
              mostPopular={item?.mostPopular}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PriceCard;
