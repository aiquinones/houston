import React, { useCallback } from 'react';
import type { FileReference, StepSummary } from '../../shared/types.js';
import { colors } from '../theme/colors.js';

type DetailPanelProps = {
  label: string;
  children: StepSummary[];
  onClose: () => void;
  onOpenFile: (fileRef: FileReference) => void;
};

// marker:start DetailPanel
export const DetailPanel = ({ label, children, onClose, onOpenFile }: DetailPanelProps) => {
  const handleItemClick = useCallback(
    (fileRef?: FileReference) => {
      if (fileRef) onOpenFile(fileRef);
    },
    [onOpenFile]
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 320,
        height: '100%',
        background: colors.bgSurface,
        borderLeft: `1px solid ${colors.border}`,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'monospace',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 12, color: colors.textPrimary, fontWeight: 600 }}>
          {label}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: colors.textMuted,
            cursor: 'pointer',
            fontSize: 16,
            padding: '0 4px',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {children.map((child, i) => (
          <div
            key={i}
            onClick={() => handleItemClick(child.fileRef)}
            style={{
              padding: '10px 16px',
              cursor: child.fileRef ? 'pointer' : 'default',
              transition: 'background 0.1s',
              borderBottom: `1px solid ${colors.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.bgHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <div style={{ fontSize: 12, color: colors.textPrimary }}>
              {child.label}
              {child.description && (
                <span style={{ color: colors.textMuted }}> → {child.description}</span>
              )}
            </div>
            {child.fileRef && (
              <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 3 }}>
                {child.fileRef.path}
                {child.fileRef.functionName && `#${child.fileRef.functionName}`}
                {child.fileRef.line && `:${child.fileRef.line}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
// marker:end DetailPanel
