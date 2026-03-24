---
name: Microservices Platform
version: 1.0
description: Tests many interconnected systems
---

## API Gateway

Routes external requests to internal services.

### Route Request

- [Receive](src/gateway/server.ts) → Accept HTTP/gRPC
- [Auth check](src/gateway/auth.ts#verify) → Validate JWT
- [Route](src/gateway/router.ts#dispatch) → Match to service

### Connections

- [API Gateway] → [User Service] : user operations
- [API Gateway] → [Order Service] : order operations
- [API Gateway] → [Product Service] : product queries
- [API Gateway] → [Notification Service] : push triggers

## User Service

User management and profiles.

### Create User

- [Validate](src/services/user/validate.ts) → Input validation
- [Hash password](src/services/user/auth.ts#hash) → bcrypt
- [Insert](src/services/user/repo.ts#create) → Postgres insert
- [Emit event](src/services/user/events.ts#created) → UserCreated to queue

### Connections

- [User Service] → [Database] : reads/writes users
- [User Service] → [Event Bus] : emits user events

## Order Service

Order lifecycle management.

### Place Order

- [Validate cart](src/services/order/validate.ts) → Check items and stock
- [Reserve inventory](src/services/order/inventory.ts#reserve) → Temporary hold
- [Create order](src/services/order/repo.ts#create) → Insert order record
- [Process payment](src/services/order/payment.ts#charge) → Stripe charge
- [Emit event](src/services/order/events.ts#placed) → OrderPlaced to queue

### Connections

- [Order Service] → [Database] : reads/writes orders
- [Order Service] → [Product Service] : inventory checks
- [Order Service] → [Event Bus] : emits order events

## Product Service

Product catalog and inventory.

### List Products

- [Query](src/services/product/repo.ts#list) → Paginated query
- [Enrich](src/services/product/enrich.ts#withPricing) → Add dynamic pricing
- [Cache](src/services/product/cache.ts#set) → Redis cache

### Connections

- [Product Service] → [Database] : reads products
- [Product Service] → [Cache] : reads/writes product cache

## Notification Service

Multi-channel notifications.

### Send Notification

- [Route](src/services/notify/router.ts#route) → Pick channel (email/push/SMS)
- [Template](src/services/notify/template.ts#render) → Render template
- [Dispatch](src/services/notify/dispatch.ts#send) → Send via provider

### Connections

- [Notification Service] ← [Event Bus] : consumes events
- [Notification Service] → [Email Provider] : sends emails
- [Notification Service] → [Push Provider] : sends push

## Event Bus

Async event routing via Redis Streams.

### Connections

- [Event Bus] ← [User Service] : user events
- [Event Bus] ← [Order Service] : order events
- [Event Bus] → [Notification Service] : triggers notifications

## Database

PostgreSQL with read replicas.

### Connections

- [Database] ← [User Service] : user CRUD
- [Database] ← [Order Service] : order CRUD
- [Database] ← [Product Service] : product reads

## Cache

Redis for caching and rate limiting.

### Connections

- [Cache] ← [Product Service] : product cache
- [Cache] ← [API Gateway] : rate limit counters
