/** @type { import('@storybook/react').Preview } */
import '../packages/design-system/default/style.css'
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
};

export default preview;
