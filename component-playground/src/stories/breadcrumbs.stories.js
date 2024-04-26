import { fn } from '@storybook/test';
import Breadcrumbs from './../../../components/breadcrumbs';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    "layout": "fullscreen"
  },
  tags: [
    "autodocs"
  ],
  argTypes: {
    breadcrumbs: [
      {
        text: {
          control: "text"
        },
        url: {
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
    breadcrumbs: [
      {
        "text": "Manage My Account",
        "url": "/mma"
      },
      {
        "text": "Cancel",
        "url": "/cancel"
      },
      {
        "text": "Change Payment Method",
        "url": "/change-payment"
      }
    ],
    componentId: "breadcrumbs-limio"
  }
};
