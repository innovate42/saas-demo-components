/** @type { import('@storybook/react').Preview } */
import React from "react"
import '../packages/design-system/default/style.css'
import { ClaudeOverlay } from "./claude-overlay"

const preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <ClaudeOverlay />
      </>
    ),
  ],
};

export default preview
