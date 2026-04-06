import type { Meta, StoryObj } from '@storybook/react-vite';
import { NodeStoryWrapper } from './ReactFlowDecorator.js';
import type { HoustonNodeData } from '../../../shared/types.js';
import { fn } from 'storybook/test';

const meta = {
  title: 'Nodes/StepNode',
  component: NodeStoryWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeStoryWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseData: HoustonNodeData = {
  label: 'Validate Input',
  nodeType: 'step',
};

export const Default: Story = {
  args: {
    nodeType: 'step',
    data: baseData,
    width: 350,
    height: 150,
  },
};

export const WithDescription: Story = {
  args: {
    nodeType: 'step',
    data: {
      ...baseData,
      description: 'Checks request body against Zod schema',
    },
    width: 500,
    height: 150,
  },
};

export const WithFileRef: Story = {
  args: {
    nodeType: 'step',
    data: {
      ...baseData,
      fileRef: { path: 'src/api/validate.ts', line: 42 },
      onOpenFile: fn(),
    } as HoustonNodeData,
    width: 350,
    height: 150,
  },
};

export const WithFunctionRef: Story = {
  args: {
    nodeType: 'step',
    data: {
      ...baseData,
      label: 'Hash Password',
      description: 'bcrypt hash with salt rounds',
      fileRef: { path: 'src/auth/hash.ts', functionName: 'hashPassword' },
      onOpenFile: fn(),
    } as HoustonNodeData,
    width: 450,
    height: 150,
  },
};

export const NoFileRef: Story = {
  args: {
    nodeType: 'step',
    data: {
      ...baseData,
      label: 'External API Call',
      description: 'Calls third-party payment provider',
    },
    width: 450,
    height: 150,
  },
};
