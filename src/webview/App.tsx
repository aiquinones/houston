import React, { useMemo, useCallback, useState } from 'react';
import {
  ReactFlow,
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
import { colors } from './theme/colors.js';
import type { StepSummary } from '../shared/types.js';

// marker:start NodeTypes
const nodeTypes = {
  system: SystemNode,
  flow: FlowNode,
  step: StepNode,
  stepGroup: StepGroupNode,
};
// marker:end NodeTypes

// marker:start App
export const App = () => {
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
            border: `2px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          !
        </div>
        <div style={{ color: colors.textSecondary, fontSize: 14, maxWidth: 400, textAlign: 'center' }}>
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
            background: colors.accent,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
        <div style={{ color: colors.textMuted, fontSize: 12 }}>
          HOUSTON — AWAITING SIGNAL
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
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
              background: colors.success,
              boxShadow: `0 0 6px ${colors.success}40`,
            }}
          />
          <span style={{ color: colors.textSecondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {graphData.frontmatter.name}
          </span>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        panOnScroll
        panOnScrollSpeed={0.5}
        zoomOnScroll={false}
        zoomOnPinch
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          style: { stroke: colors.edgeDefault, strokeWidth: 1.5 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color={colors.gridDot}
          gap={20}
          size={1}
          style={{ background: colors.bg }}
        />
        <Controls
          style={{
            background: colors.bgSurface,
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
          }}
        />
        <style>{`
          .react-flow__controls-button {
            background: ${colors.bgSurface} !important;
            border: none !important;
            border-bottom: 1px solid ${colors.border} !important;
            fill: ${colors.textSecondary} !important;
            color: ${colors.textSecondary} !important;
          }
          .react-flow__controls-button:hover {
            background: ${colors.bgHover} !important;
            fill: ${colors.textPrimary} !important;
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
            if (n.type === 'system') return colors.borderSystem;
            if (n.type === 'flow') return colors.accent;
            return colors.bgNode;
          }}
          maskColor="rgba(10, 14, 23, 0.8)"
          style={{
            background: colors.bgSurface,
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
          }}
        />
      </ReactFlow>
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
