# Houston

Mission control for your codebase.

Houston is a VSCode extension that visualizes your codebase as an interactive node graph — like a spacecraft's engineering deck, showing the flows, systems, and structure of your code at a glance.

Unlike dependency graphing tools that parse imports and ASTs, Houston maps **intent**. It reads an AI-generated `architecture.md` file that describes what your code is *meant to do*, and renders it as a navigable, interactive blueprint.

## Why Houston?

Vibe coding is here. AI generates most of the code, but you still need to understand what's going on. Reading every file isn't the answer — seeing the big picture is.

Houston gives you:

- **Intent-based flow visualization** — not import graphs, but the actual flows: "user signs up → email verified → profile created → dashboard"
- **Interactive node graph** — built with React Flow, rendered inside VSCode. Click to navigate, double-click to see code.
- **Live AI session tracking** — watch what your AI coding agent is doing in real time, spatially mapped to your codebase
- **Code markers** — annotate your code with semantic markers that Houston picks up and renders

## How It Works

1. An `architecture.md` file describes your codebase's flows, components, and connections
2. Houston parses it and renders an interactive node graph in a VSCode webview panel
3. Nodes link to files and code locations — double-click to jump there
4. File watchers keep the visualization in sync as code changes
5. Special files (`plan.md`, `live-changes.md`) enable real-time AI session visualization

## The `architecture.md` Format

Houston uses a structured markdown file with YAML frontmatter as its source of truth. This file can be AI-generated, hand-written, or a mix of both.

```yaml
---
name: My App
version: 1.0
---

## Authentication Flow

- [POST /signup](src/routes/signup.ts) → User registration
  - [validateInput](src/lib/validation.ts#validateSignup) → Input validation
  - [createUser](src/db/users.ts#create) → Database insert
  - [sendVerification](src/services/email.ts#verify) → Email dispatch
```

See [docs/SPEC.md](docs/SPEC.md) for the full format specification.

## Status

Early development. Not usable yet.

## Tech Stack

- TypeScript (strict mode)
- VSCode Extension API (webview panels)
- React Flow (@xyflow/react) for the node graph
- pnpm

## Contributing

This is an open-source project and contributions are welcome. See the [docs/](docs/) folder for vision, architecture, and specs.

## License

MIT
