# Houston — Claude Code Instructions

## Project Overview

Houston is a VSCode extension that visualizes codebases as interactive node graphs. It reads an `architecture.md` file and renders it as a navigable flow diagram inside VSCode using React Flow.

## Tech Stack

- **Runtime:** VSCode Extension API
- **Language:** TypeScript (strict mode)
- **UI:** React + @xyflow/react (in webview panel)
- **Bundler:** tsup
- **Package manager:** pnpm
- **Markdown parsing:** unified/remark ecosystem

## Conventions

- Functional patterns, no classes (except where VSCode API requires them)
- Named exports only, no default exports
- `const` arrow functions for components and handlers
- Early returns to reduce nesting
- Zod for any runtime validation
- `async/await` over `.then()` chains
- Keep files under ~200 lines, split when larger

## Architecture

Two processes communicate via `postMessage`:

1. **Extension host** (Node.js) — file watching, parsing, commands
2. **Webview** (browser) — React Flow rendering, user interaction

Key directories:
- `src/extension/` — Extension host code
- `src/webview/` — React webview code
- `src/shared/` — Types shared between both

## Key Files

- `docs/SPEC.md` — The architecture.md format specification
- `docs/ARCHITECTURE.md` — Houston's own architecture
- `docs/VISION.md` — Product vision and differentiators
- `examples/sample-architecture.md` — Example architecture.md

## When Working on This Project

- Read `docs/SPEC.md` before touching the parser
- Read `docs/ARCHITECTURE.md` before making structural changes
- The webview uses React Flow v12+ (@xyflow/react), not the older reactflow package
- VSCode webview has no direct filesystem access — all data comes via postMessage from the extension host
