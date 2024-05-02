import { fn } from "@storybook/test";
import priceCard from "./../../../components/price-card";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/price-card",
  component: priceCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    PriceOfferData: [
      {
        title: {
          control: "text",
        },
        priceMonthly: {
          control: "number",
        },
        priceYearly: {
          control: "number",
        },
        savings: {
          control: "number",
        },
        quantity: {
          control: "number",
        },
        billingPeriod: {
          control: "text",
        },
        onToggleBillingPeriod: {
          control: "text",
        },
        mostPopular: {
          control: "boolean",
        },
      },
    ],
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Primary = {
  args: {
    PriceOfferData: [
      {
        id: "1",
        title: "basicPlan",
        priceMonthly: 10,
        priceYearly: 100,
        savings: 20,
        quantity: 1,
        billingPeriod: "monthly",
        onToggleBillingPeriod: "handleToggleBillingPeriod",
        mostPopular: true,
      },
      {
        id: "2",
        title: "proPlan",
        priceMonthly: 20,
        priceYearly: 200,
        savings: 40,
        quantity: 1,
        billingPeriod: "monthly",
        onToggleBillingPeriod: "handleToggleBillingPeriod",
        mostPopular: false,
      },
      {
        id: "3",
        title: "premiumPlan",
        priceMonthly: 20,
        priceYearly: 200,
        savings: 40,
        quantity: 1,
        billingPeriod: "monthly",
        onToggleBillingPeriod: "handleToggleBillingPeriod",
        mostPopular: false,
      },
    ],
  },
};
