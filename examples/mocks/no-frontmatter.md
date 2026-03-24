## CLI Tool

A simple CLI without frontmatter — tests graceful fallback.

### Parse Arguments

- [Parse flags](src/cli.ts#parseFlags) → Read --verbose, --output, etc.
- [Validate](src/cli.ts#validate) → Check required args
- [Execute](src/cli.ts#run) → Run the command

### Error Handling

- [Catch error](src/cli.ts:80) → Top-level try/catch
  - [Format error](src/errors.ts#format) → Human-readable message
  - [Exit](src/cli.ts:90) → Process.exit with code
