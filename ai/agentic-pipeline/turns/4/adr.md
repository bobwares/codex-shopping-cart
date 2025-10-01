# ADR 4: Shopping Cart API Surface and Error Handling

**Status**: Accepted

**Date**: 2025-09-30

## Context
With persistence in place, the service needed HTTP endpoints, validation, and documented contracts so that clients can manage shopping carts reliably. Responses should return consistent error payloads and expose an OpenAPI definition for integration testing.

## Decision
Implement a dedicated `ShoppingCartController` backed by a transactional `ShoppingCartService` that materializes DTOs for creation, updates, and responses. Enable Nest's global `ValidationPipe` with whitelist and 422 semantics, add a custom `HttpExceptionFilter` producing Problem Detail envelopes, and surface Swagger UI plus JSON/YAML specs at `/api/docs` and `/api/openapi.*`.

## Consequences
Clients receive validated, well-documented CRUD endpoints with predictable error shapes, while automated suites can consume the OpenAPI document. Supertest e2e tests and .http scripts now exercise the full cart lifecycle, providing regression coverage tied to the live persistence layer.
