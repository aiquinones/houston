import React, { useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { HoustonNodeData } from '../../../shared/types.js';
import { useTheme } from '../../theme/ThemeContext.js';

type StepNodeProps = NodeProps & {
  data: HoustonNodeData & {
    onOpenFile?: (fileRef: HoustonNodeData['fileRef']) => void;
  };
};

// marker:start StepNode
export const StepNode = ({ data }: StepNodeProps) => {
  const theme = useTheme();
  const nodeData = data as unknown as HoustonNodeData & {
    onOpenFile?: (fileRef: HoustonNodeData['fileRef']) => void;
  };

  const handleDoubleClick = useCallback(() => {
    if (nodeData.fileRef && nodeData.onOpenFile) {
      nodeData.onOpenFile(nodeData.fileRef);
    }
  }, [nodeData]);

  const hasFile = !!nodeData.fileRef;

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        padding: '8px 14px',
        background: theme.bgNode,
        border: `1px solid ${theme.border}`,
        borderRadius: 6,
        cursor: hasFile ? 'pointer' : 'default',
        minWidth: 160,
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.borderActive;
        e.currentTarget.style.boxShadow = `0 0 8px ${theme.accentGlow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
      title={nodeData.description ?? ''}
    >
      <div
        style={{
          fontSize: 12,
          color: theme.textPrimary,
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
        }}
      >
        {nodeData.label}
        {nodeData.description && (
          <span style={{ color: theme.textMuted }}> → {nodeData.description}</span>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: theme.edgeDefault,
          border: 'none',
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: theme.edgeDefault,
          border: 'none',
          width: 6,
          height: 6,
        }}
      />
    </div>
  );
};
// marker:end StepNode
