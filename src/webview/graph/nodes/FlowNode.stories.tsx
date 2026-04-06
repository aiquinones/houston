import type { Meta, StoryObj } from '@storybook/react-vite';
import { NodeStoryWrapper } from './ReactFlowDecorator.js';
import type { HoustonNodeData } from '../../../shared/types.js';

const meta = {
  title: 'Nodes/FlowNode',
  component: NodeStoryWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeStoryWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseData: HoustonNodeData = {
  label: 'User Login',
  nodeType: 'flow',
};

export const Default: Story = {
  args: {
    nodeType: 'flow',
    data: baseData,
    width: 300,
    height: 120,
  },
};

export const ShortLabel: Story = {
  args: {
    nodeType: 'flow',
    data: { ...baseData, label: 'Init' },
    width: 200,
    height: 120,
  },
};

export const LongLabel: Story = {
  args: {
    nodeType: 'flow',
    data: { ...baseData, label: 'Process Payment Transaction' },
    width: 400,
    height: 120,
  },
};
