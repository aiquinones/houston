import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '../src/webview/theme/ThemeContext.js';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'houston-dark',
      values: [
        { name: 'houston-dark', value: '#0a0e17' },
        { name: 'dark', value: '#1a1a2e' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
