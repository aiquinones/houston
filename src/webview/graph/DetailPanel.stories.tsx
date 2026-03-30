import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DetailPanel } from './DetailPanel.js';
import { darkColors as colors } from '../theme/colors.js';
import type { StepSummary } from '../../shared/types.js';

const Wrapper = ({ children, ...props }: React.ComponentProps<typeof DetailPanel>) => (
  <div style={{ position: 'relative', width: '100vw', height: '100vh', background: colors.bg }}>
    <DetailPanel {...props} children={children} />
  </div>
);

const meta = {
  title: 'Components/DetailPanel',
  component: Wrapper,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onClose: fn(),
    onOpenFile: fn(),
  },
} satisfies Meta<typeof Wrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Database Migrations',
    children: [
      { label: 'Create users table', fileRef: { path: 'migrations/001_users.sql' } },
      { label: 'Add indexes', fileRef: { path: 'migrations/002_indexes.sql' } },
      { label: 'Create sessions table', fileRef: { path: 'migrations/003_sessions.sql' } },
      { label: 'Add RLS policies' },
      { label: 'Seed data', description: 'Insert default admin roles', fileRef: { path: 'migrations/005_seed.sql' } },
    ],
  },
};

export const WithFunctionRefs: Story = {
  args: {
    label: 'Auth Flow',
    children: [
      { label: 'Validate credentials', fileRef: { path: 'src/auth/login.ts', functionName: 'validateCredentials' } },
      { label: 'Generate JWT', description: 'Signs access + refresh tokens', fileRef: { path: 'src/auth/jwt.ts', functionName: 'signTokenPair' } },
      { label: 'Set cookies', fileRef: { path: 'src/auth/cookies.ts', line: 15 } },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    label: 'Cleanup',
    children: [
      { label: 'Remove temp files', description: 'Clears /tmp after build', fileRef: { path: 'scripts/cleanup.sh' } },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    label: 'Test Suite Results',
    children: Array.from({ length: 15 }, (_, i) => ({
      label: `Test case ${i + 1}`,
      description: i % 3 === 0 ? `Integration test for module ${i}` : undefined,
      fileRef: i % 2 === 0 ? { path: `tests/test_${i + 1}.ts`, line: (i + 1) * 10 } : undefined,
    })),
  },
};

export const NoFileRefs: Story = {
  args: {
    label: 'Planning Steps',
    children: [
      { label: 'Review requirements' },
      { label: 'Design schema' },
      { label: 'Write migration' },
      { label: 'Deploy to staging' },
    ],
  },
};
