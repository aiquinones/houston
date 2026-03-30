import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { HoustonNodeData } from '../../../shared/types.js';
import { useTheme } from '../../theme/ThemeContext.js';

// marker:start FlowNode
export const FlowNode = ({ data }: NodeProps) => {
  const theme = useTheme();
  const nodeData = data as unknown as HoustonNodeData;

  return (
    <div
      style={{
        padding: '6px 12px',
        background: 'transparent',
        borderLeft: `2px solid ${theme.accent}`,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span
        style={{
          color: theme.textAccent,
          fontSize: 12,
          fontFamily: 'monospace',
          fontWeight: 500,
        }}
      >
        {nodeData.label}
      </span>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};
// marker:end FlowNode
