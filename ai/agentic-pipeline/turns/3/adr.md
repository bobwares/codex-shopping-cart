# ADR 3: TypeORM Entity Model and Data Source Integration

**Status**: Accepted

**Date**: 2025-09-30

## Context
The project required an ORM layer that maps the previously defined shopping cart database schema to NestJS services, enabling transactional CRUD operations, migrations, and CLI tooling. Configuration needed to remain environment-driven and aligned with project conventions.

## Decision
Adopt TypeORM entities for the shopping cart, item, and discount tables, applying numeric transformers for currency fields and cascade relationships for child records. Configure a shared `AppDataSource` with SnakeNamingStrategy, environment loading from `ai/context/.env`, and register it through Nest's `TypeOrmModule`. Provide CLI scripts and a baseline migration to keep the ORM schema authoritative.

## Consequences
NestJS modules and services can inject repositories for domain persistence without manual query wiring. Migrations and connectivity checks run via repeatable npm scripts, and configuration validation ensures required database variables exist. Future features can reuse the entity classes and data source for additional queries and transactional operations.
