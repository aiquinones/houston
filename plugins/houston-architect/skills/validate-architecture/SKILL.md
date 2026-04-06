---
description: Validate an existing architecture.md file — check format, verify file references exist, and report issues. Use when the user wants to check their architecture.md is correct.
---

# Validate architecture.md

Check an existing `architecture.md` file for correctness and report any issues.

## Checks to perform

### 1. Structure validation
- Has valid YAML frontmatter with at least a `name` field
- Uses H2 (`##`) for systems and H3 (`###`) for flows
- Steps are list items inside flows
- No orphan steps outside of a flow

### 2. File reference validation
- Every file reference `(path/to/file.ts)` points to a file that exists in the workspace
- Function references `(path#functionName)` — verify the file exists (function validation is optional)
- Line references `(path:42)` — verify the file exists and has at least that many lines
- No absolute paths or paths containing `..`

### 3. Connection validation
- Connection syntax follows `[Source] → [Target] : description`
- Referenced system names in connections match actual H2 headings
- Arrow characters are valid: `→`, `←`, `↔`

### 4. Best practices
- Each system has a description paragraph
- Steps have both a label and a file reference (warn if missing)
- No empty flows (flows with no steps)
- No duplicate system names

## Output format

Report issues grouped by severity:
- **Errors:** Things that will break Houston (missing files, invalid syntax)
- **Warnings:** Things that degrade the visualization (missing descriptions, empty flows)
- **Info:** Suggestions for improvement

## Instructions

$ARGUMENTS

1. Find the architecture.md file (check `.houston/architecture.md` first, then workspace root).
2. Read the file contents.
3. Run all checks listed above.
4. For file references, verify each path exists using the filesystem.
5. Report findings grouped by severity.
6. If there are errors, suggest specific fixes.
