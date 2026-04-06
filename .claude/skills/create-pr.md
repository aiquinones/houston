---
name: create-pr
description: Create a pull request for the current branch with a well-formatted title and description.
user_invocable: true
---

Create a pull request for the current branch. Follow these steps:

1. Run these in parallel to understand the current state:
   - `git status` to see all changes
   - `git diff` to see staged/unstaged changes
   - `git log --oneline -10` to see recent commits
   - Check if the current branch tracks a remote and is up to date
   - `git diff main...HEAD` to see all changes since diverging from main

2. Analyze ALL commits on this branch (not just the latest) and draft:
   - A PR title using the format: `[category] emoji description` (under 70 characters)
   - A summary with 1-3 bullet points describing what changed and why

   **PR title categories** — pick the best fit from this list:
   | Category | Emoji | When to use |
   |----------|-------|-------------|
   | `[docs]` | 📝 | Documentation, READMEs, specs |
   | `[cleanup]` | 🧹 | Refactors, deps, CI, lint, dead code |
   | `[ui]` | 🎨 | Styling, layout, themes, visual changes |

   Example titles: `[ui] 🎨 add dark mode toggle`, `[docs] 📝 update architecture spec`

   **Only** use these three categories. If you are 85%+ confident the PR doesn't fit any of them, ask the user via `AskUserQuestion` to suggest a new category before proceeding. Do not invent categories on your own. If you found a new category, you MUST report it.

3. Push the branch if needed (`git push -u origin HEAD`), then create the PR:

```
gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>

## Test plan
<bulleted checklist of how to test>

Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

4. Return the PR URL when done.
