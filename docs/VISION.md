# Vision

## The Problem

41% of code is now AI-generated. Developers using tools like Claude Code, Cursor, and Copilot are producing codebases they haven't fully read. The industry calls this "vibe coding" — you describe what you want, the AI writes it, and you ship.

But you still need to understand what's going on. Code review, debugging, onboarding, and architecture decisions all require comprehension. Reading every file isn't scalable when the AI writes faster than you can read.

Existing tools for code visualization parse the code deterministically — imports, ASTs, call graphs — and render what the code *actually does* structurally. This produces overwhelming, brittle graphs with no semantic meaning.

## The Differentiator: Intent Mapping

Houston doesn't parse your code. It reads an `architecture.md` file — a structured markdown document that describes what your code is *meant to do*.

| Traditional tools | Houston |
|---|---|
| Parse imports/ASTs | Read architecture.md |
| Show what code *does* technically | Show what code *means* intentionally |
| Brittle to refactoring | Resilient — intent doesn't change when you rename a file |
| Deterministic, exact | Forgiving, approximate |
| Generated from code | Generated from understanding |

The `architecture.md` file acts as a **semantic layer** between the code and the visualization. It can be:
- AI-generated (Claude Code writes it as part of its workflow)
- Hand-written by the developer
- A mix — AI generates the skeleton, human refines the narrative

## The UI: Mission Control

The visual aesthetic is inspired by spacecraft engineering decks and blueprint schematics:

- Dark, minimal interface with subtle grid lines
- Nodes as compartments/systems on a blueprint
- Connections as circuit-like pathways between systems
- Subtle animations — indicators showing where AI agents are currently working
- Zoom levels: bird's-eye view of the whole system, zoom into a subsystem, zoom into a code chunk

This isn't a generic graph viewer. It should feel like you're looking at the engineering schematic of something purposeful.

## Live AI Session Visualization

Houston can show what an AI coding agent is doing in real time.

When Claude Code (or any AI tool) works on your codebase, it can write to special files:
- `plan.md` — the agent's current plan and progress
- `live-changes.md` — what the agent is currently modifying and why

Houston watches these files and renders the activity on the node graph:
- Which systems/files the agent is currently touching
- Progress indicators on the flow
- A real-time "mission status" view

## Contributing

Houston is open source (MIT). We welcome contributions — see the [SPEC.md](SPEC.md) for the architecture.md format and [ARCHITECTURE.md](ARCHITECTURE.md) for how the extension is structured.
