# ADR 2: Shopping Cart Persistence Model

**Status**: Accepted

**Date**: 2025-09-30

**Context**
The shopping cart JSON schema required a normalized PostgreSQL representation supporting cart metadata, line items, and discounts with referential integrity and reporting views for downstream services.

**Decision**
Create a dedicated `shopping_cart` schema with separate tables for carts, items, and discounts, applying foreign keys with cascade deletes, numeric constraints, and indexes on frequently queried columns. Provide a summary view for analytics and generate the authoritative Draft 2020-12 entity schema from the migration.

**Consequences**
Database migrations and seed data now align with the JSON schema and enable deterministic local environments. Future migrations can build on the schema, and API layers have a contractually documented entity model for ORM mapping.
