---
name: Deep Nesting Test
version: 1.0
description: Tests deeply nested steps and branching
---

## Request Pipeline

Middleware-heavy request processing with branching error paths.

### Incoming Request

- [Receive request](src/server.ts#handleRequest) → HTTP listener
  - [Parse headers](src/middleware/headers.ts#parse) → Extract auth, content-type, trace ID
    - [Validate auth token](src/middleware/auth.ts#validate) → JWT verification
      - [Token valid](src/middleware/auth.ts:42) → Attach user context
      - [Token expired](src/middleware/auth.ts:58) → Attempt refresh
        - [Refresh succeeds](src/middleware/auth.ts:65) → New token, continue
        - [Refresh fails](src/middleware/auth.ts:72) → 401 Unauthorized
      - [Token missing](src/middleware/auth.ts:80) → Check if route is public
  - [Parse body](src/middleware/body.ts#parse) → JSON / form-data / multipart
    - [Validate schema](src/middleware/validate.ts#checkSchema) → Zod runtime validation
      - [Valid](src/middleware/validate.ts:30) → Continue to handler
      - [Invalid](src/middleware/validate.ts:35) → 400 with field-level errors
  - [Rate limit check](src/middleware/ratelimit.ts#check) → Redis sliding window
    - [Under limit](src/middleware/ratelimit.ts:20) → Continue
    - [Over limit](src/middleware/ratelimit.ts:25) → 429 Too Many Requests

## Response Pipeline

Outbound response processing.

### Format Response

- [Serialize](src/response/serialize.ts#toJSON) → Convert to JSON
  - [Add CORS headers](src/response/cors.ts#apply) → Origin, methods, credentials
  - [Compress](src/response/compress.ts#gzip) → gzip if accepted
  - [Log](src/response/logger.ts#access) → Access log entry
- [Send](src/response/send.ts#flush) → Write to socket

### Connections

- [Response Pipeline] ← [Request Pipeline] : processes the handler output
