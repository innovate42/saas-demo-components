import { fn } from '@storybook/test';
import OfferCards from './../../../components/offer-cards-tailwind';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/Offer Cards",
  component: OfferCards,
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
    showImage: {
      control: "boolean"
    },
    componentId: {
      control: "text"
    },
    offerWidth: {
      control: "number"
    },
    primaryColor__limio_color: {
      control: "color"
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
    showGroupedOffers: {
      control: "boolean"
    },
    freeTrialLink: {
      control: "text"
    },
    best_value_color__limio_color: {
      control: "color"
    }
  }
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    heading: "Subscribe today",
    subheading: "Join today for instant access.",
    showImage: true,
    componentId: "offers-limio",
    offerWidth: "2",
    primaryColor__limio_color: "#F47C24",
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
    showGroupedOffers: false,
    freeTrialLink: "Start a free trial",
    best_value_color__limio_color: "#F47C24"
  }
};
