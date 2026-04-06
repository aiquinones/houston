import type { Meta, StoryObj } from '@storybook/react-vite';
import { NodeStoryWrapper } from './ReactFlowDecorator.js';
import type { HoustonNodeData } from '../../../shared/types.js';

const meta = {
  title: 'Nodes/SystemNode',
  component: NodeStoryWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeStoryWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseData: HoustonNodeData = {
  label: 'API Gateway',
  nodeType: 'system',
};

export const Default: Story = {
  args: {
    nodeType: 'system',
    data: baseData,
    width: 400,
    height: 200,
  },
};

export const WithDescription: Story = {
  args: {
    nodeType: 'system',
    data: {
      ...baseData,
      description: 'Handles incoming HTTP requests and routes to services',
    },
    width: 500,
    height: 250,
  },
};

export const ShortLabel: Story = {
  args: {
    nodeType: 'system',
    data: { ...baseData, label: 'DB' },
    width: 300,
    height: 180,
  },
};

export const LongLabel: Story = {
  args: {
    nodeType: 'system',
    data: {
      ...baseData,
      label: 'Authentication & Authorization Service',
      description: 'Manages JWT tokens, OAuth flows, and RBAC permissions',
    },
    width: 600,
    height: 280,
  },
};
