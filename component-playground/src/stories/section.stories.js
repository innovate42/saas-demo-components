import { fn } from '@storybook/test';
import Section from './../../../components/section';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/Section",
  component: Section,
  parameters: {
    "layout": "fullscreen"
  },
  tags: [
    "autodocs"
  ],
  argTypes: {
    image: {
      control: "text"
    },
    showButtons: {
      control: "boolean"
    },
    buttons: [
      {
        buttonText: {
          control: "text"
        },
        buttonLocation: {
          control: "text"
        }
      }
    ],
    header: {
      control: "text"
    },
    text: {
      control: "text"
    },
    secondaryTextImage: {
      control: "text"
    },
    componentId: {
      control: "text"
    }
  }
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    image: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/1156184/860406_495342.png",
    showButtons: true,
    buttons: [
      {
        "buttonText": "Learn More",
        "buttonLocation": "https://limio.com"
      }
    ],
    header: "Commerce tool for subscription companies",
    text: "From checkout to retention experience compliance, companies around the world use Limio to simplify their subscription stack",
    secondaryTextImage: "",
    componentId: "section-limio"
  }
};
