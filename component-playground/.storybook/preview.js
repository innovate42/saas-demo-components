/** @type { import('@storybook/react').Preview } */
import '../packages/design-system/default/style.css'
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
