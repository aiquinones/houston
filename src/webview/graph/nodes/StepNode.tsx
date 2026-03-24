import React, { useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { HoustonNodeData } from '../../../shared/types.js';
import { colors } from '../../theme/colors.js';

type StepNodeProps = NodeProps & {
  data: HoustonNodeData & {
    onOpenFile?: (fileRef: HoustonNodeData['fileRef']) => void;
  };
};

// marker:start StepNode
export const StepNode = ({ data }: StepNodeProps) => {
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
        background: colors.bgNode,
        border: `1px solid ${colors.border}`,
        borderRadius: 6,
        cursor: hasFile ? 'pointer' : 'default',
        minWidth: 160,
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.borderActive;
        e.currentTarget.style.boxShadow = `0 0 8px ${colors.accentGlow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
      title={nodeData.description ?? ''}
    >
      <div
        style={{
          fontSize: 12,
          color: colors.textPrimary,
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
        }}
      >
        {nodeData.label}
      </div>
      {nodeData.fileRef && (
        <div
          style={{
            fontSize: 10,
            color: colors.textMuted,
            fontFamily: 'monospace',
            marginTop: 2,
          }}
        >
          {nodeData.fileRef.path}
          {nodeData.fileRef.functionName && `#${nodeData.fileRef.functionName}`}
          {nodeData.fileRef.line && `:${nodeData.fileRef.line}`}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: colors.edgeDefault,
          border: 'none',
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: colors.edgeDefault,
          border: 'none',
          width: 6,
          height: 6,
        }}
      />
    </div>
  );
};
// marker:end StepNode
