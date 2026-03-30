import React, { useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { HoustonNodeData, StepSummary } from '../../../shared/types.js';
import { useTheme } from '../../theme/ThemeContext.js';

type StepGroupNodeProps = NodeProps & {
  data: HoustonNodeData & {
    onOpenFile?: (fileRef: HoustonNodeData['fileRef']) => void;
    onOpenDetail?: (label: string, children: StepSummary[]) => void;
  };
};

// marker:start StepGroupNode
export const StepGroupNode = ({ data }: StepGroupNodeProps) => {
  const theme = useTheme();
  const nodeData = data as unknown as HoustonNodeData & {
    onOpenFile?: (fileRef: HoustonNodeData['fileRef']) => void;
    onOpenDetail?: (label: string, children: StepSummary[]) => void;
  };

  const handleClick = useCallback(() => {
    if (nodeData.children && nodeData.onOpenDetail) {
      nodeData.onOpenDetail(nodeData.label, nodeData.children);
    }
  }, [nodeData]);

  const handleDoubleClick = useCallback(() => {
    if (nodeData.fileRef && nodeData.onOpenFile) {
      nodeData.onOpenFile(nodeData.fileRef);
    }
  }, [nodeData]);

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        padding: '8px 14px',
        background: theme.bgNode,
        border: `1px solid ${theme.border}`,
        borderRadius: 6,
        cursor: 'pointer',
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
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
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
        {nodeData.childCount && nodeData.childCount > 0 && (
          <div
            style={{
              background: theme.accent,
              color: '#fff',
              fontSize: 10,
              fontFamily: 'monospace',
              fontWeight: 600,
              borderRadius: 10,
              padding: '1px 7px',
              minWidth: 18,
              textAlign: 'center',
              lineHeight: '16px',
              flexShrink: 0,
            }}
          >
            {nodeData.childCount}
          </div>
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
// marker:end StepGroupNode
