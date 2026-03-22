# architecture.md Format Specification

The `architecture.md` file is the source of truth for Houston's visualization. It describes the **intent and flow** of a codebase using structured markdown with YAML frontmatter.

## File Location

Houston looks for this file in order:
1. `.houston/architecture.md`
2. `architecture.md` (workspace root)

## Structure

```markdown
---
name: Project Name
version: 1.0
description: Optional one-liner
---

## System Name

Description of this system/module.

### Flow Name

- [Step Label](path/to/file.ts) → Description
  - [Sub-step](path/to/other.ts#functionName) → Description
  - [Sub-step](path/to/another.ts:42) → Description
```

## YAML Frontmatter

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Project name displayed in the graph header |
| `version` | string | no | Schema version (for future compatibility) |
| `description` | string | no | One-line project description |
| `theme` | string | no | UI theme override (`default`, `minimal`, `blueprint`) |

## Sections

### Systems (H2 headings)

Each `##` heading defines a **system** — a high-level grouping rendered as a container node.

```markdown
## Authentication

Handles user registration, login, and session management.
```

- The heading text becomes the system node label
- The paragraph below becomes the system description (shown on hover/expand)
- Systems are rendered as large container nodes that can contain flows

### Flows (H3 headings)

Each `###` heading within a system defines a **flow** — a sequence of steps.

```markdown
### User Signup

- [Validate input](src/lib/validation.ts#validateSignup) → Check email format, password strength
  - [Check duplicate](src/db/users.ts#findByEmail) → Ensure email isn't taken
- [Create user](src/db/users.ts#create) → Insert into database
- [Send verification](src/services/email.ts#sendVerification) → Dispatch verification email
- [Return response](src/routes/auth.ts:45) → 201 Created with user ID
```

### Steps (List items)

Each list item in a flow defines a **step** — a node in the graph.

**Syntax:**
```
- [Label](file_reference) → Description
```

| Part | Required | Description |
|------|----------|-------------|
| `Label` | yes | Display text for the node |
| `file_reference` | no | Link to source code (see File References below) |
| `→ Description` | no | Explanation shown on hover |

**Nesting:** Indented list items represent sub-steps or branching.

```markdown
- [Handle request](src/routes/api.ts#handler)
  - [Success path](src/routes/api.ts:52) → Return 200
  - [Error path](src/routes/api.ts:58) → Return 400 with validation errors
```

## File References

File references use markdown link syntax with extensions for specificity:

| Format | Example | Meaning |
|--------|---------|---------|
| File only | `(src/index.ts)` | Links to the file |
| With function | `(src/index.ts#functionName)` | Links to a named export/function |
| With line | `(src/index.ts:42)` | Links to a specific line |
| With range | `(src/index.ts:42-58)` | Links to a line range |
| With marker | `(src/index.ts@HandlerName)` | Links to a code marker region |

## Code Markers

Code markers are optional annotations in source files that Houston can detect and link to.

**Syntax (language-agnostic):**
```
# marker:start MarkerName
...code...
# marker:end MarkerName
```

**Comment-style variants:**
```typescript
// marker:start AuthMiddleware
export const authMiddleware = async (req, res, next) => {
  // ...
};
// marker:end AuthMiddleware
```

```python
# marker:start DataPipeline
def process_data(raw_input):
    ...
# marker:end DataPipeline
```

Markers allow Houston to reference specific code regions by name, independent of line numbers. When code moves, the marker moves with it.

## Connections Between Systems

Use a `### Connections` section to define cross-system relationships:

```markdown
## API Layer

### Connections

- [API Layer] → [Database] : reads/writes user data
- [API Layer] → [Email Service] : triggers transactional emails
- [API Layer] ← [Auth Middleware] : validates tokens
```

**Syntax:**
```
- [Source System] → [Target System] : description
- [Source System] ← [Target System] : description (reverse direction)
- [Source System] ↔ [Target System] : description (bidirectional)
```

## Live Files

Houston also watches optional live files for AI agent activity:

### `plan.md`

Written by AI agents to describe their current plan:

```markdown
---
status: in_progress
current_step: 3
---

1. [x] Set up database schema
2. [x] Create user model
3. [ ] **Implement signup endpoint** ← current
4. [ ] Add email verification
5. [ ] Write tests
```

### `live-changes.md`

Written by AI agents to describe what they're currently doing:

```markdown
---
agent: claude-code
timestamp: 2026-03-22T14:30:00Z
---

## Currently modifying

- `src/routes/auth.ts` — Adding signup POST handler
- `src/db/users.ts` — Adding create function

## Recently completed

- `src/lib/validation.ts` — Added signup validation schema
```

Houston renders this as activity indicators on the corresponding nodes in the graph.

## Full Example

See [examples/sample-architecture.md](../examples/sample-architecture.md) for a complete example.
