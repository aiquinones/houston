import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SystemNode, FlowNode, StepNode, StepGroupNode } from './graph/nodes/index.js';
import { DetailPanel } from './graph/DetailPanel.js';
import { useExtensionMessages } from './hooks/useExtensionMessages.js';
import { useTheme } from './theme/ThemeContext.js';
import type { StepSummary } from '../shared/types.js';

// marker:start NodeTypes
const nodeTypes = {
  system: SystemNode,
  flow: FlowNode,
  step: StepNode,
  stepGroup: StepGroupNode,
};
// marker:end NodeTypes

const FitViewOnData = ({ nodeCount }: { nodeCount: number }) => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (nodeCount === 0) return;
    // Small delay to let React Flow measure node dimensions
    const timer = setTimeout(() => fitView({ padding: 0.2 }), 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeCount]);

  return null;
};

// marker:start App
export const App = () => {
  const theme = useTheme();
  const { graphData, error, openFile } = useExtensionMessages();

  const [detailPanel, setDetailPanel] = useState<{
    label: string;
    children: StepSummary[];
  } | null>(null);

  const openDetail = useCallback((label: string, children: StepSummary[]) => {
    setDetailPanel({ label, children });
  }, []);

  const closeDetail = useCallback(() => {
    setDetailPanel(null);
  }, []);

  // Inject handlers into step/stepGroup nodes
  const nodes = useMemo<Node[]>(() => {
    if (!graphData) return [];
    return graphData.nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        onOpenFile: openFile,
        onOpenDetail: openDetail,
      },
    }));
  }, [graphData, openFile, openDetail]);

  const edges = useMemo<Edge[]>(() => {
    if (!graphData) return [];
    return graphData.edges;
  }, [graphData]);

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const data = node.data as { fileRef?: { path: string } };
      if (data.fileRef) {
        openFile(data.fileRef as { path: string });
      }
    },
    [openFile]
  );

  const defaultEdgeOptions = useMemo(
    () => ({ style: { stroke: theme.edgeDefault, strokeWidth: 1.5 } }),
    [theme.edgeDefault]
  );

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 16,
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: `2px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          !
        </div>
        <div style={{ color: theme.textSecondary, fontSize: 14, maxWidth: 400, textAlign: 'center' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!graphData) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 16,
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: theme.accent,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
        <div style={{ color: theme.textMuted, fontSize: 12 }}>
          HOUSTON — AWAITING SIGNAL
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <button
        onClick={theme.toggleTheme}
        style={{
          position: 'absolute',
          top: 12,
          right: 16,
          zIndex: 10,
          background: theme.bgSurface,
          border: `1px solid ${theme.border}`,
          borderRadius: 6,
          padding: '4px 10px',
          cursor: 'pointer',
          color: theme.textSecondary,
          fontFamily: 'monospace',
          fontSize: 13,
          lineHeight: '20px',
          display: 'flex',
          alignItems: 'center',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.borderActive;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.border;
        }}
        title={`Switch to ${theme.mode === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme.mode === 'dark' ? '\u2600' : '\u263E'}
      </button>
      {graphData.frontmatter.name && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 16,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: theme.success,
              boxShadow: `0 0 6px ${theme.success}40`,
            }}
          />
          <span style={{ color: theme.textSecondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {graphData.frontmatter.name}
          </span>
        </div>
      )}
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeDoubleClick={onNodeDoubleClick}
          minZoom={0.1}
          maxZoom={2}
          panOnScroll
          panOnScrollSpeed={0.5}
          zoomOnScroll={false}
          zoomOnPinch
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={defaultEdgeOptions}
        >
          <FitViewOnData nodeCount={nodes.length} />
          <Background
            variant={BackgroundVariant.Dots}
            color={theme.gridDot}
            gap={20}
            size={1}
            style={{ background: theme.bg }}
          />
          <Controls
            style={{
              background: theme.bgSurface,
              border: `1px solid ${theme.border}`,
              borderRadius: 6,
            }}
          />
          <style key={theme.mode}>{`
            .react-flow__controls-button {
              background: ${theme.bgSurface} !important;
              border: none !important;
              border-bottom: 1px solid ${theme.border} !important;
              fill: ${theme.textSecondary} !important;
              color: ${theme.textSecondary} !important;
            }
            .react-flow__controls-button:hover {
              background: ${theme.bgHover} !important;
              fill: ${theme.textPrimary} !important;
            }
            .react-flow__controls-button:last-child {
              border-bottom: none !important;
            }
            .react-flow__controls-button svg {
              fill: inherit !important;
            }
          `}</style>
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'system') return theme.borderSystem;
              if (n.type === 'flow') return theme.accent;
              return theme.bgNode;
            }}
            maskColor={theme.minimapMask}
            style={{
              background: theme.bgSurface,
              border: `1px solid ${theme.border}`,
              borderRadius: 6,
            }}
          />
        </ReactFlow>
      </ReactFlowProvider>
      {detailPanel && (
        <DetailPanel
          label={detailPanel.label}
          children={detailPanel.children}
          onClose={closeDetail}
          onOpenFile={openFile}
        />
      )}
    </div>
  );
};
// marker:end App
