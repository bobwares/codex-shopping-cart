/**
 * App: Shopping Cart
 * Package: api
 * File: request-id.middleware.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: RequestIdMiddleware
 * Description: Ensures every HTTP request has an X-Request-Id header and seeds the request context store.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from './request-context';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const existing = req.headers['x-request-id'] as string | undefined;
    const requestId = existing && existing.length > 0 ? existing : randomUUID();
    req.headers['x-request-id'] = requestId;

    const start = process.hrtime();
    RequestContext.run({ requestId, startHrTime: start }, () => {
      next();
    });
  }
}
