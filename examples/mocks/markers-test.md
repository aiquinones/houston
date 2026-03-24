---
name: Markers Test
version: 1.0
description: Tests code marker references with @ syntax
---

## Data Pipeline

ETL pipeline using code markers for stable references.

### Ingest

- [Read source](src/pipeline/ingest.ts@ReadSource) → Pull from S3
- [Validate schema](src/pipeline/ingest.ts@ValidateSchema) → JSON Schema check
- [Transform](src/pipeline/transform.ts@MainTransform) → Map fields

### Load

- [Batch insert](src/pipeline/load.ts@BatchInsert) → Postgres COPY
- [Update index](src/pipeline/load.ts@UpdateIndex) → Refresh materialized view
- [Notify](src/pipeline/notify.ts@PipelineComplete) → Webhook callback

### Connections

- [Data Pipeline] → [Warehouse] : writes processed data

## Warehouse

Postgres data warehouse.

### Query Layer

- [Build query](src/warehouse/query.ts:10-45) → Dynamic SQL builder
- [Execute](src/warehouse/query.ts:47-60) → Connection pool query
- [Format results](src/warehouse/format.ts#toCSV) → CSV or JSON output
