import { fn } from '@storybook/test';
import FaqBanner from './../../../components/faq-banner';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/Faq Banner",
  component: FaqBanner,
  parameters: {
    "layout": "fullscreen"
  },
  tags: [
    "autodocs"
  ],
  argTypes: {
    headline: {
      control: "text"
    },
    subline: {
      control: "text"
    },
    faqItems: [
      {
        question: {
          control: "text"
        },
        answer__limio_richtext: {
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
    headline: "Any questions?",
    subline: "We’ve got answers.",
    faqItems: [
      {
        "question": "How can I contact Customer Services?",
        "answer": "Go to our help centre"
      },
      {
        "question": "Can I cancel my subscription?",
        "answer": "Yes, of course!"
      },
      {
        "question": "I cannot subscribe – my email address is already recognised",
        "answer": "Go to login"
      }
    ],
    componentId: "faq-banner-limio"
  }
};
