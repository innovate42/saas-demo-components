import { fn } from '@storybook/test';
import PriceCard from './../../../components/price-card';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/Price Card",
  component: PriceCard,
  parameters: {
    "layout": "fullscreen"
  },
  tags: [
    "autodocs"
  ],
  argTypes: {
    PriceOfferData: [
      {
        id: {
          control: "text"
        },
        title: {
          control: "text"
        },
        priceMonthly: {
          control: "number"
        },
        priceYearly: {
          control: "number"
        },
        savings: {
          control: "number"
        },
        quantity: {
          control: "number"
        },
        billingPeriod: {
          control: "text"
        },
        onToggleBillingPeriod: {
          control: "text"
        },
        mostPopular: {
          control: "boolean"
        }
      }
    ]
  }
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    PriceOfferData: [
      {
        "id": 1,
        "title": "basicPlan",
        "priceMonthly": 10,
        "priceYearly": 100,
        "savings": 20,
        "quantity": 5,
        "billingPeriod": "monthly",
        "onToggleBillingPeriod": "handleToggleBillingPeriod",
        "mostPopular": true
      },
      {
        "id": 2,
        "title": "proPlan",
        "priceMonthly": 20,
        "priceYearly": 200,
        "savings": 40,
        "quantity": 6,
        "billingPeriod": "monthly",
        "onToggleBillingPeriod": "handleToggleBillingPeriod",
        "mostPopular": false
      },
      {
        "id": 3,
        "title": "premiumPlan",
        "priceMonthly": 20,
        "priceYearly": 200,
        "savings": 40,
        "quantity": 1,
        "billingPeriod": "monthly",
        "onToggleBillingPeriod": "handleToggleBillingPeriod",
        "mostPopular": false
      }
    ]
  }
};
