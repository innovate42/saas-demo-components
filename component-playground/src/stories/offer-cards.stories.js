import { fn } from '@storybook/test';
import OfferCards from './../../../components/offer-cards';

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
    }
  }
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    heading: "Subscribe today",
    subheading: "Join today for instant access."
  }
};
