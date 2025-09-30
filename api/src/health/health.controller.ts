/**
 * App: Shopping Cart
 * Package: api
 * File: health.controller.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: HealthController
 * Description: Exposes liveness, readiness, and metadata endpoints reporting service health details.
 */
import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type HealthPayload = {
  status: 'ok';
  service: string;
  version: string | null;
  commit: string | null;
  pid: number;
  uptime: number;
  timestamp: string;
  memory: NodeJS.MemoryUsage;
};

function getPkgVersion(): string | null {
  try {
    const pkgPath = join(process.cwd(), 'package.json');
    const pkgRaw = readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgRaw) as { version?: string };
    return typeof pkg.version === 'string' ? pkg.version : null;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    process.stderr.write(`Failed to read package.json: ${err.message}\n`);
    return null;
  }
}

@Controller('health')
export class HealthController {
  @Get()
  health(): HealthPayload {
    return {
      status: 'ok',
      service: process.env.APP_NAME ?? 'backend',
      version: getPkgVersion(),
      commit: process.env.COMMIT_SHA ?? null,
      pid: process.pid,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
    };
  }

  @Get('live')
  liveness(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('ready')
  readiness(): { status: 'ok' } {
    return { status: 'ok' };
  }
}
