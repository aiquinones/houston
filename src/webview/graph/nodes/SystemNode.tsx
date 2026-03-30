import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { HoustonNodeData } from '../../../shared/types.js';
import { useTheme } from '../../theme/ThemeContext.js';

// marker:start SystemNode
export const SystemNode = ({ data }: NodeProps) => {
  const theme = useTheme();
  const nodeData = data as unknown as HoustonNodeData;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: theme.bgSystem,
        border: `1px solid ${theme.borderSystem}`,
        borderRadius: 8,
        padding: 0,
        position: 'relative',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${theme.borderSystem}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: theme.accent,
            boxShadow: `0 0 6px ${theme.accentGlow}`,
          }}
        />
        <span
          style={{
            color: theme.textPrimary,
            fontWeight: 600,
            fontSize: 13,
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {nodeData.label}
        </span>
      </div>
      {nodeData.description && (
        <div
          style={{
            padding: '6px 16px',
            fontSize: 11,
            color: theme.textMuted,
            fontFamily: 'monospace',
          }}
        >
          {nodeData.description}
        </div>
      )}
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};
// marker:end SystemNode
