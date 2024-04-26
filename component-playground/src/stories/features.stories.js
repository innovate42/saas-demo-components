import { fn } from '@storybook/test';
import Features from './../../../components/features';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/Features",
  component: Features,
  parameters: {
    "layout": "fullscreen"
  },
  tags: [
    "autodocs"
  ],
  argTypes: {
    header: {
      control: "text"
    },
    subHeader: {
      control: "text"
    },
    features: [
      {
        image: {
          control: "text"
        },
        header: {
          control: "text"
        },
        text: {
          control: "text"
        },
        showButton__limio_boolean: {
          control: "boolean"
        },
        buttonText: {
          control: "text"
        },
        buttonLink: {
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
    header: "Lorem ipsum dolor sit amet",
    subHeader: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam suscipit.",
    features: [
      {
        "image": "https://campaigns.scdn.co/images/midyear-prem-benefit0.png",
        "header": "Download Music.",
        "text": "Listen anywhere.",
        "showButton__limio_boolean": false,
        "buttonText": "Click here",
        "buttonLink": "https://www.limio.com"
      },
      {
        "image": "https://campaigns.scdn.co/images/midyear-prem-benefit1.png",
        "header": "Listen without ads.",
        "text": "Enjoy nonstop music.",
        "showButton__limio_boolean": false,
        "buttonText": "Click here",
        "buttonLink": "https://www.limio.com"
      },
      {
        "image": "https://campaigns.scdn.co/images/midyear-prem-benefit2.png",
        "header": "Play any song.",
        "text": "Even on mobile.",
        "showButton__limio_boolean": false,
        "buttonText": "Click here",
        "buttonLink": "https://www.limio.com"
      }
    ],
    componentId: "features-limio"
  }
};
