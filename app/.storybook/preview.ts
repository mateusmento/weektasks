import type { Preview } from '@storybook/vue3';
import '../src/assets/components.sass';
import '../src/assets/main.css';
import '../src/assets/utils.sass';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
