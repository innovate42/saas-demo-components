import { fn } from '@storybook/test';
import GroupedOffers from './../../../components/grouped-offers';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/Grouped Offers",
  component: GroupedOffers,
  parameters: {
    "layout": "fullscreen"
  },
  tags: [
    "autodocs"
  ],
  argTypes: {
    heading: {
      control: "text"
    },
    subheading: {
      control: "text"
    },
    groupLabels: [
      {
        name: {
          control: "text"
        },
        url: {
          control: "text"
        },
        thumbnail: {
          control: "text"
        }
      }
    ],
    componentId: {
      control: "text"
    }
  }
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    heading: "Subscribe today",
    subheading: "Join today for instant access.",
    groupLabels: [
      {
        "id": "digital",
        "label": "Digital"
      },
      {
        "id": "bundle",
        "label": "Print + Digital"
      }
    ],
    componentId: "grouped-offers-component-limio"
  }
};
