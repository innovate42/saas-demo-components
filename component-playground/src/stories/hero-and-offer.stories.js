import { fn } from '@storybook/test';
import HeroAndOffer from './../../../components/hero-and-offer';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/Hero And Offer",
  component: HeroAndOffer,
  parameters: {
    "layout": "fullscreen"
  },
  tags: [
    "autodocs"
  ],
  argTypes: {
    useDefaultSVG: {
      control: "boolean"
    },
    logoTextImg: {
      control: "text"
    },
    heroBannerText: {
      control: "text"
    },
    heroImg: {
      control: "text"
    },
    underbuttonText: {
      control: "text"
    }
  }
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    useDefaultSVG: "true",
    logoTextImg: "https://web-media.mailsubscriptions.co.uk/prod/images/original/8331e791a850-489042c2c928-maillogolarge.png",
    heroBannerText: "Get More From The Sun",
    heroImg: "https://web-media.mailsubscriptions.co.uk/prod/images/gm_preview/9f244e375278-hero-asset-still.png",
    underbuttonText: "No commitment, cancel any time"
  }
};
