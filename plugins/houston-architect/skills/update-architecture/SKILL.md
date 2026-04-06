---
description: Update an existing architecture.md to reflect recent code changes — add new files, remove stale references, update flows. Use when the codebase has changed and architecture.md needs to catch up.
---

# Update architecture.md

Bring an existing `architecture.md` file in sync with the current state of the codebase.

## Process

### 1. Audit current state
- Read the existing `architecture.md`
- Extract all file references
- Check which references are stale (files moved, renamed, or deleted)
- Identify new files/modules that aren't represented

### 2. Detect changes
- Use `git diff` and `git log` to see what has changed since the file was last updated
- Look for new directories, new entry points, new exports
- Look for deleted or moved files that are still referenced

### 3. Update the file
- Fix stale file references (update paths for moved files, remove deleted ones)
- Add new flows or steps for significant new functionality
- Update system descriptions if the scope has changed
- Add new systems if entirely new domains were introduced
- Preserve the user's existing structure and descriptions where still accurate

## Rules

- **Preserve intent:** Don't rewrite descriptions the user wrote — only update file references and add new content.
- **Minimize churn:** Only change what's actually stale or missing. Don't reorganize for style.
- **Verify all paths:** Every file reference in the updated file must point to a real file.
- **Show the diff:** After updating, summarize what changed (added/removed/updated) so the user can review.

## Instructions

$ARGUMENTS

1. Read the existing `architecture.md`.
2. Extract all file references and verify each one exists.
3. Check recent git history for structural changes.
4. Update the file — fix stale refs, add new content, remove dead references.
5. Summarize the changes you made.
