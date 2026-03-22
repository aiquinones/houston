# Architecture

Houston is a VSCode extension with a React-based webview panel.

## High-Level Components

```
┌─────────────────────────────────────────────┐
│                  VSCode                      │
│                                              │
│  ┌──────────────┐    ┌───────────────────┐   │
│  │  Extension    │◄──►│  Webview Panel    │   │
│  │  Host         │    │  (React + Flow)   │   │
│  │              │    │                   │   │
│  │  - File Watch │    │  - React Flow     │   │
│  │  - Parser     │    │  - Node Renderer  │   │
│  │  - Commands   │    │  - Navigation     │   │
│  │  - State      │    │  - Theme          │   │
│  └──────────────┘    └───────────────────┘   │
│         │                     ▲               │
│         │    postMessage      │               │
│         └─────────────────────┘               │
└─────────────────────────────────────────────┘
         │
         ▼
  ┌──────────────┐
  │ architecture │
  │ .md          │
  └──────────────┘
```

## Extension Host

The Node.js side running in VSCode's extension host process.

### Parser Pipeline

```
architecture.md → Markdown AST → Section Extraction → Graph Data → Webview
```

1. **Read** — Watch and read `architecture.md` from workspace root (or `.houston/architecture.md`)
2. **Parse** — Convert markdown + YAML frontmatter into an AST (using remark/unified)
3. **Extract** — Walk the AST to pull out flows, nodes, connections, and file references
4. **Transform** — Convert to React Flow-compatible node/edge data structures
5. **Send** — Post the graph data to the webview via `postMessage`

### File Watcher

Watches for changes to:
- `architecture.md` — re-parse and update the graph
- `plan.md` / `live-changes.md` — update agent activity indicators
- Code markers in source files — update node metadata

Uses `vscode.workspace.createFileSystemWatcher` for efficient native file watching.

### Commands

- `houston.open` — Open the Houston panel
- `houston.refresh` — Force re-parse architecture.md
- `houston.generate` — Generate architecture.md from the codebase (AI-powered, future)
- `houston.focusNode` — Navigate to a specific node (used by click-to-navigate)

## Webview Panel

A React application rendered in a VSCode webview panel.

### React Flow Graph

The core visualization. Uses `@xyflow/react` with custom node types:

- **SystemNode** — A high-level system/module (e.g., "Authentication", "Database")
- **FileNode** — A specific file with click-to-open
- **FlowNode** — A step in a flow (e.g., "Validate input", "Create user")
- **MarkerNode** — A code region defined by markers
- **AgentNode** — Shows current AI agent activity (live mode)

### Custom Edges

- **FlowEdge** — Directional flow between nodes, circuit-board style
- **DependencyEdge** — Softer connection showing relationships (not flow direction)

### Navigation

- Single-click a node → highlight and show details in sidebar
- Double-click a file node → open file in VSCode editor (`vscode.open` command via postMessage)
- Double-click a marker node → open file at the marker's line range
- Zoom controls + minimap for large graphs

### Theme

Mission-control / spacecraft blueprint aesthetic:
- Dark background with subtle grid
- Monospace typography for code references
- Accent color for active/highlighted nodes
- Subtle pulse animation for live agent activity nodes
- Circuit-board style edge routing

## Data Flow

```
architecture.md
      │
      ▼
  [Parser]  ──────────►  Graph Data (nodes + edges)
      │                        │
      │                        ▼
      │                  [postMessage]
      │                        │
      │                        ▼
      │                  [React Flow]
      │                        │
      │                        ▼
      │                  Interactive UI
      │
      │   plan.md / live-changes.md
      │         │
      │         ▼
      │   [Activity Parser] ─► Agent activity overlay
      │
  [File Watcher] ──── triggers re-parse on change
```

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `@xyflow/react` | Node graph rendering |
| `unified` / `remark` | Markdown parsing |
| `yaml` | YAML frontmatter parsing |
| `vscode-webview-ui-toolkit` | Native VSCode UI components |

## Directory Structure (planned)

```
src/
├── extension/
│   ├── index.ts              # Extension entry point (activate/deactivate)
│   ├── parser/
│   │   ├── architecture.ts   # architecture.md parser
│   │   ├── markers.ts        # Code marker scanner
│   │   └── activity.ts       # plan.md / live-changes.md parser
│   ├── watcher.ts            # File system watcher
│   ├── commands.ts           # VSCode command registrations
│   └── panel.ts              # Webview panel management
├── webview/
│   ├── App.tsx               # React root
│   ├── graph/
│   │   ├── nodes/            # Custom node components
│   │   ├── edges/            # Custom edge components
│   │   └── layout.ts         # Graph layout (dagre/ELK)
│   ├── theme/                # Mission control theme
│   └── hooks/                # React hooks for messaging, navigation
└── shared/
    └── types.ts              # Shared types between extension and webview
```
