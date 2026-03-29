import React from 'react';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { darkColors as colors } from '../../theme/colors.js';
import { SystemNode } from './SystemNode.js';
import { FlowNode } from './FlowNode.js';
import { StepNode } from './StepNode.js';
import { StepGroupNode } from './StepGroupNode.js';
import type { HoustonNodeData } from '../../../shared/types.js';

const nodeTypes = {
  system: SystemNode,
  flow: FlowNode,
  step: StepNode,
  stepGroup: StepGroupNode,
};

type NodeStoryWrapperProps = {
  nodeType: string;
  data: HoustonNodeData;
  width?: number;
  height?: number;
};

export const NodeStoryWrapper = ({
  nodeType,
  data,
  width = 300,
  height = 200,
}: NodeStoryWrapperProps) => {
  const nodes = [
    {
      id: 'story-node',
      type: nodeType,
      position: { x: 50, y: 50 },
      data,
      ...(nodeType === 'system' ? { style: { width: width - 100, height: height - 100 } } : {}),
    },
  ];

  return (
    <div style={{ width, height, background: colors.bg, borderRadius: 8 }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={[]}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          style={{ background: colors.bg }}
        />
      </ReactFlowProvider>
    </div>
  );
};
