import { fn } from '@storybook/test';
import SaasPricingPage from './../../../components/saas-pricing-page';
import { Canvas } from '@storybook/blocks';


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
    groupLabels: [
      {
        id: {
          control: "text"
        },
        label: {
          control: "text"
        }
      }
    ],
    heading: {
      control: "text"
    },
    subheading: {
      control: "text"
    }
  }
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    groupLabels: [
      {
        "id": "monthly",
        "label": "Monthly"
      },
      {
        "id": "annual",
        "label": "Annual"
      }
    ],
    heading: "Our Pricing",
    subheading: "Pricing"
  }
};
