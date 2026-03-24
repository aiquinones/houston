# Code Markers

Code markers are inline annotations that create stable, named references to code regions. Houston uses them to link architecture.md nodes to specific code blocks — without relying on line numbers that shift on every edit.

## Syntax

```
// marker:start MarkerName
...code...
// marker:end MarkerName
```

Markers are comment-based and language-agnostic. Use whatever comment style your language supports:

| Language | Start | End |
|----------|-------|-----|
| TypeScript/JS | `// marker:start X` | `// marker:end X` |
| Python | `# marker:start X` | `# marker:end X` |
| Rust | `// marker:start X` | `// marker:end X` |
| Go | `// marker:start X` | `// marker:end X` |
| Ruby | `# marker:start X` | `# marker:end X` |
| HTML/Vue/Svelte | `<!-- marker:start X -->` | `<!-- marker:end X -->` |
| CSS | `/* marker:start X */` | `/* marker:end X */` |
| SQL | `-- marker:start X` | `-- marker:end X` |

## Referencing markers in architecture.md

Use the `@` syntax in file references:

```markdown
- [Activate extension](src/extension/index.ts@Activate) → Entry point
```

This links to the region between `// marker:start Activate` and `// marker:end Activate` in `src/extension/index.ts`.

## Naming conventions

- **PascalCase** — matches function/component naming: `@Activate`, `@SystemNode`, `@ParsePipeline`
- **Descriptive** — the name should convey what the region does, not where it is
- **Unique per file** — marker names must be unique within a file (can repeat across files)

## When to use markers vs other references

| Reference type | Use when... |
|---|---|
| `file.ts` | Linking to an entire file |
| `file.ts#functionName` | Linking to a named export/function |
| `file.ts:42` | Linking to a specific line (fragile) |
| `file.ts:42-58` | Linking to a line range (fragile) |
| `file.ts@MarkerName` | Linking to a logical code region (stable) |

**Prefer markers when:**
- The code region isn't a single named export (e.g., a block inside a function)
- You want references that survive refactoring
- The region is architecturally significant enough to name

**Skip markers when:**
- The code is a single named function — use `#functionName` instead
- The reference is temporary / for debugging

## How Houston resolves markers

1. When a node references `file.ts@MarkerName`, Houston scans `file.ts` for `marker:start MarkerName`
2. It finds the line range between `marker:start` and `marker:end`
3. Double-clicking the node opens the file at that range
4. If the marker is missing, Houston falls back to opening the file at line 1

## Markers in this codebase

Houston dogfoods its own markers. Current markers:

| File | Marker | Purpose |
|------|--------|---------|
| `src/extension/index.ts` | `Activate` | Extension activation and command registration |
| `src/extension/index.ts` | `SendGraphData` | Core data flow: find → parse → send |
| `src/webview/App.tsx` | `NodeTypes` | React Flow node type registry |
| `src/webview/App.tsx` | `App` | Root React component |
| `src/webview/theme/colors.ts` | `MissionControlTheme` | Full color palette |
| `src/webview/hooks/useExtensionMessages.ts` | `VsCodeApi` | VSCode API bridge |
| `src/webview/hooks/useExtensionMessages.ts` | `UseExtensionMessages` | Message passing hook |
| `src/webview/graph/nodes/SystemNode.tsx` | `SystemNode` | System container node |
| `src/webview/graph/nodes/FlowNode.tsx` | `FlowNode` | Flow label node |
| `src/webview/graph/nodes/StepNode.tsx` | `StepNode` | Interactive step node |
