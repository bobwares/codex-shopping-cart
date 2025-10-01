# ADR 1: Structured NestJS API Foundation

**Status**: Accepted

**Date**: 2025-09-30

**Context**
The first turn needed a reproducible NestJS 11 baseline with validated configuration, health endpoints, and observability hooks to support future domain work. Logging had to remain dependency-light while delivering correlation-friendly JSON output.

**Decision**
Bootstrap the API manually using the specified package.json and tooling, enable @nestjs/config with Joi validation, and implement structured logging via AsyncLocalStorage-backed request context, middleware, and a custom ConsoleLogger extension. Health endpoints were added with matching unit/E2E coverage and REST Client fixtures.

**Consequences**
The project now has deterministic scaffolding and observability primitives without external logger dependencies. Future modules can rely on consistent request IDs and JSON logs, while tests confirm health endpoints remain operational. Additional transports (e.g., file sinks) can build on the JsonLogger if needed.
