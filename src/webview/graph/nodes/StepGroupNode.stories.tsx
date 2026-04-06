import type { Meta, StoryObj } from '@storybook/react-vite';
import { NodeStoryWrapper } from './ReactFlowDecorator.js';
import type { HoustonNodeData } from '../../../shared/types.js';
import { fn } from 'storybook/test';

const meta = {
  title: 'Nodes/StepGroupNode',
  component: NodeStoryWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeStoryWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseData: HoustonNodeData = {
  label: 'Database Migrations',
  nodeType: 'stepGroup',
  childCount: 5,
  children: [
    { label: 'Create users table', fileRef: { path: 'migrations/001.sql' } },
    { label: 'Add indexes', fileRef: { path: 'migrations/002.sql' } },
    { label: 'Create sessions table', fileRef: { path: 'migrations/003.sql' } },
    { label: 'Add RLS policies' },
    { label: 'Seed data', description: 'Insert default roles', fileRef: { path: 'migrations/005.sql' } },
  ],
};

export const Default: Story = {
  args: {
    nodeType: 'stepGroup',
    data: {
      ...baseData,
      onOpenDetail: fn(),
    } as unknown as HoustonNodeData,
    width: 400,
    height: 150,
  },
};

export const WithDescription: Story = {
  args: {
    nodeType: 'stepGroup',
    data: {
      ...baseData,
      description: 'Sequential migration steps',
      onOpenDetail: fn(),
    } as unknown as HoustonNodeData,
    width: 500,
    height: 150,
  },
};

export const SingleChild: Story = {
  args: {
    nodeType: 'stepGroup',
    data: {
      ...baseData,
      label: 'Cleanup',
      childCount: 1,
      children: [{ label: 'Remove temp files' }],
      onOpenDetail: fn(),
    } as unknown as HoustonNodeData,
    width: 350,
    height: 150,
  },
};

export const ManyChildren: Story = {
  args: {
    nodeType: 'stepGroup',
    data: {
      ...baseData,
      label: 'Test Suite',
      childCount: 24,
      children: Array.from({ length: 24 }, (_, i) => ({
        label: `Test case ${i + 1}`,
      })),
      onOpenDetail: fn(),
    } as unknown as HoustonNodeData,
    width: 350,
    height: 150,
  },
};

export const WithFileRef: Story = {
  args: {
    nodeType: 'stepGroup',
    data: {
      ...baseData,
      fileRef: { path: 'src/db/migrations/index.ts' },
      onOpenFile: fn(),
      onOpenDetail: fn(),
    } as unknown as HoustonNodeData,
    width: 400,
    height: 150,
  },
};
