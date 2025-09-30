/**
 * App: Shopping Cart
 * Package: api
 * File: health.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: HealthModule
 * Description: Provides the health-check controller for liveness, readiness, and metadata endpoints.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
