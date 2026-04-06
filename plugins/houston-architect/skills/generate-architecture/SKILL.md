---
description: Analyze a codebase and generate an architecture.md file for Houston visualization. Use when the user wants to create an architecture.md from scratch.
---

# Generate architecture.md

Analyze the current codebase and generate an `architecture.md` file that Houston can visualize as an interactive node graph.

## Output format

The file MUST follow this exact structure:

```markdown
---
name: Project Name
version: 1.0
description: One-line project description
---

## System Name

Description of this system/module.

### Flow Name

- [Step Label](path/to/file.ts) → Description of what this step does
  - [Sub-step](path/to/file.ts#functionName) → Description
  - [Sub-step](path/to/file.ts:42) → Description

### Connections

- [System A] → [System B] : description of relationship
```

## Rules

1. **Systems (H2):** Group by logical domain (e.g., "Authentication", "API Layer", "Database"). Each system gets a description paragraph.
2. **Flows (H3):** Each flow is a user-facing operation or process (e.g., "User Signup", "Process Payment"). Flows contain ordered steps.
3. **Steps (list items):** Each step is a concrete code location. Use the format `- [Label](file_reference) → Description`.
4. **File references:** Use real file paths relative to workspace root. Prefer `path#functionName` over line numbers (more stable). Supported formats:
   - `(src/index.ts)` — file only
   - `(src/index.ts#functionName)` — named function/export
   - `(src/index.ts:42)` — specific line
   - `(src/index.ts:42-58)` — line range
   - `(src/index.ts@MarkerName)` — code marker region
5. **Sub-steps:** Use indentation for branching paths (success/error) or implementation details.
6. **Connections:** Add a `### Connections` section inside a system to show cross-system relationships using `→`, `←`, or `↔`.
7. **Verify all paths exist** before writing — don't reference files that don't exist in the workspace.

## Instructions

$ARGUMENTS

1. Explore the project structure — look at the directory tree, key entry points, and config files.
2. Identify 3-7 logical systems/domains in the codebase.
3. For each system, identify the most important flows (user-facing operations, data pipelines, etc.).
4. For each flow, trace the code path and list the steps with real file references.
5. Add connections between systems where they interact.
6. Write the file to `architecture.md` at the workspace root (or `.houston/architecture.md` if the user prefers).
7. Verify every file reference points to a real file.
