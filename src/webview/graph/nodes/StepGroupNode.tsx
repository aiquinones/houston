import React, { useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { HoustonNodeData, StepSummary } from '../../../shared/types.js';
import { colors } from '../../theme/colors.js';

type StepGroupNodeProps = NodeProps & {
  data: HoustonNodeData & {
    onOpenFile?: (fileRef: HoustonNodeData['fileRef']) => void;
    onOpenDetail?: (label: string, children: StepSummary[]) => void;
  };
};

// marker:start StepGroupNode
export const StepGroupNode = ({ data }: StepGroupNodeProps) => {
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
        background: colors.bgNode,
        border: `1px solid ${colors.border}`,
        borderRadius: 6,
        cursor: 'pointer',
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
            color: colors.textPrimary,
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}
        >
          {nodeData.label}
          {nodeData.description && (
            <span style={{ color: colors.textMuted }}> → {nodeData.description}</span>
          )}
        </div>
        {nodeData.childCount && nodeData.childCount > 0 && (
          <div
            style={{
              background: colors.accent,
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
// marker:end StepGroupNode
