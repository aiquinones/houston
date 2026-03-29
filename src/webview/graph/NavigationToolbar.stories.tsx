import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { NavigationToolbar } from './NavigationToolbar.js';
import { darkColors as colors } from '../theme/colors.js';
import type { NavigationMode } from '../hooks/useNavigationMode.js';

const meta = {
  title: 'Components/NavigationToolbar',
  component: NavigationToolbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 400, height: 80, background: colors.bg, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavigationToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectMode: Story = {
  args: {
    mode: 'select',
    onModeChange: fn(),
  },
};

export const HandMode: Story = {
  args: {
    mode: 'hand',
    onModeChange: fn(),
  },
};

export const ZoomMode: Story = {
  args: {
    mode: 'zoom',
    onModeChange: fn(),
  },
};

export const Interactive: Story = {
  render: () => {
    const [mode, setMode] = useState<NavigationMode>('select');
    return (
      <div style={{ position: 'relative', width: 400, height: 80, background: colors.bg, borderRadius: 8 }}>
        <NavigationToolbar mode={mode} onModeChange={setMode} />
      </div>
    );
  },
};
