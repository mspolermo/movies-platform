import type { Preview } from '@storybook/nextjs-vite';

import { createElement } from 'react';

import '../../src/app/styles/globals.scss';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'centered',
  },
  decorators: [
    (Story) =>
      createElement('div', { style: { color: 'var(--color-text)' } }, createElement(Story)),
  ],
};

export default preview;
