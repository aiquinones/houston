# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Houston is a VSCode extension that visualizes codebases as interactive node graphs. It reads an `architecture.md` file (from workspace root or `.houston/`) and renders it as a navigable flow diagram inside VSCode using React Flow.

## Build & Dev Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Watch mode — rebuilds on changes (extension + webview)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm typecheck        # TypeScript type checking (tsc --noEmit)
pnpm package          # Build + package as .vsix
```

To test the extension: press F5 in VSCode to launch the Extension Development Host, then run "Houston: Open Mission Control" from the command palette (or Cmd+Shift+H).

## Architecture

Two separate processes communicate via `vscode.postMessage`:

1. **Extension host** (Node.js, CJS) — activates on `workspaceContains:architecture.md`, parses markdown, watches files, handles `openFile` navigation
2. **Webview** (browser, IIFE) — React + @xyflow/react rendering, sends `ready`/`openFile` messages back

Both are bundled separately by esbuild (`scripts/build.mjs`):
- Extension → `dist/extension/index.cjs` (CJS, `vscode` externalized)
- Webview → `dist/webview/index.js` (IIFE, everything bundled including React)

### Data Flow

`architecture.md` → `parseArchitectureMd()` (remark AST → `ArchitectureData`) → `toGraphData()` (layout to `GraphData` with nodes/edges) → postMessage → React Flow render

### Key Source Directories

- `src/extension/` — Extension host: activation, panel management, file watcher
- `src/extension/parser/` — `architecture.ts` (markdown→AST→typed data), `layout.ts` (data→React Flow nodes/edges)
- `src/webview/` — React app: `App.tsx`, custom nodes (`graph/nodes/`), hooks, theme
- `src/shared/types.ts` — All shared types: `ArchitectureData`, `GraphData`, `HoustonNode`, message types

### Message Protocol (`src/shared/types.ts`)

- Extension → Webview: `{ type: 'update', data: GraphData }` | `{ type: 'error', message: string }`
- Webview → Extension: `{ type: 'openFile', fileRef: FileReference }` | `{ type: 'ready' }`

## Tech Stack

- **Language:** TypeScript (strict mode)
- **UI:** React 18 + @xyflow/react v12+ (not the older `reactflow` package)
- **Bundler:** esbuild (custom script, not tsup)
- **Package manager:** pnpm
- **Markdown parsing:** unified/remark with remark-frontmatter + yaml

## Conventions

- Functional patterns, no classes (except where VSCode API requires)
- Named exports only, no default exports
- `const` arrow functions for components and handlers
- Early returns to reduce nesting
- Zod for runtime validation
- `async/await` over `.then()` chains
- Keep files under ~200 lines, split when larger

## Important Constraints

- The webview has no filesystem access — all data must come via postMessage from the extension host
- Read `docs/SPEC.md` before touching the parser — it defines the `architecture.md` format
- Read `docs/ARCHITECTURE.md` before making structural changes
- The parser maps markdown heading levels to graph hierarchy: H2 → Systems, H3 → Flows, list items → Steps
- File references in steps support multiple formats: `path`, `path:line`, `path:line-lineEnd`, `path#functionName`, `path@MarkerName`
