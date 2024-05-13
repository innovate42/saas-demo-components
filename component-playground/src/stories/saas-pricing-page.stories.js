import { fn } from '@storybook/test';
import SaasPricingPage from './../../../components/saas-pricing-page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/Saas Pricing Page",
  component: SaasPricingPage,
  parameters: {
    "layout": "fullscreen"
  },
  tags: [
    "autodocs"
  ],
  argTypes: {
    subTermText: {
      control: "text"
    },
    quantityText: {
      control: "text"
    }
  }
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    subTermText: "Subscription Term",
    quantityText: "Number of Licenses"
  }
};
