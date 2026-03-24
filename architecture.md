---
name: Houston
version: 1.0
description: Mission control for your codebase — intent-based visualization
---

## Extension Host

The Node.js process running inside VSCode. Parses architecture.md, watches for changes, and communicates with the webview.

### Activation

- [activate](src/extension/index.ts@Activate) → Extension entry point, registers commands
  - [houston.open](src/extension/index.ts@Activate) → Creates webview panel or reveals existing
  - [houston.refresh](src/extension/index.ts@Activate) → Forces re-parse of architecture.md

### Parse Pipeline

- [Read file](src/extension/watcher.ts#readAndParse) → Read architecture.md from disk
  - [Parse markdown](src/extension/parser/architecture.ts#parseArchitectureMd) → Unified/remark AST
    - [Extract frontmatter](src/extension/parser/architecture.ts#extractFrontmatter) → YAML metadata
    - [Extract systems](src/extension/parser/architecture.ts#extractSystems) → H2 headings → System nodes
    - [Extract flows](src/extension/parser/architecture.ts#extractFlows) → H3 headings → Flow sequences
    - [Extract steps](src/extension/parser/architecture.ts#extractSteps) → List items → Step nodes
    - [Parse connections](src/extension/parser/architecture.ts#extractConnections) → Cross-system edges
  - [Layout](src/extension/parser/layout.ts#toGraphData) → Position nodes into React Flow format

### File Watching

- [Create watcher](src/extension/watcher.ts#createWatcher) → Watch architecture.md for changes
  - [On change](src/extension/watcher.ts#createWatcher) → Re-parse and push to webview
  - [On delete](src/extension/watcher.ts#createWatcher) → Show error state

### Send to Webview

- [sendGraphData](src/extension/index.ts@SendGraphData) → Find file, parse, post to webview
  - [postMessage](src/extension/panel.ts#postMessage) → Send graph data via vscode postMessage

### Connections

- [Extension Host] → [Webview] : sends graph data via postMessage
- [Extension Host] ← [Webview] : receives file-open requests

## Webview

React application rendered in a VSCode webview panel. Displays the interactive node graph.

### React Flow Graph

- [App](src/webview/App.tsx@App) → Root component, renders ReactFlow
  - [SystemNode](src/webview/graph/nodes/SystemNode.tsx@SystemNode) → Container node for systems
  - [FlowNode](src/webview/graph/nodes/FlowNode.tsx@FlowNode) → Flow label node
  - [StepNode](src/webview/graph/nodes/StepNode.tsx@StepNode) → Interactive step with file link

### Extension Communication

- [useExtensionMessages](src/webview/hooks/useExtensionMessages.ts@UseExtensionMessages) → Hook for message passing
  - [Receive updates](src/webview/hooks/useExtensionMessages.ts@UseExtensionMessages) → Graph data from extension
  - [Open file](src/webview/hooks/useExtensionMessages.ts@UseExtensionMessages) → Request extension to open file

### Theme

- [Mission Control theme](src/webview/theme/colors.ts@MissionControlTheme) → Dark blueprint aesthetic

### Connections

- [Webview] ← [Extension Host] : receives parsed graph data
- [Webview] → [Extension Host] : sends file navigation requests

## Shared

Types shared between extension host and webview.

### Type Definitions

- [Architecture types](src/shared/types.ts) → Frontmatter, System, Flow, Step, Connection
- [Graph types](src/shared/types.ts) → HoustonNode, HoustonEdge, GraphData
- [Message types](src/shared/types.ts) → Extension ↔ Webview message protocol
