/**
 * App: Shopping Cart
 * Package: api
 * File: json-logger.service.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: JsonLogger
 * Description: Extends Nest's ConsoleLogger to emit structured JSON lines enriched with request context metadata.
 */
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { RequestContext } from './request-context';

type JsonLog = {
  timestamp: string;
  level: LogLevel;
  context?: string;
  message: string;
  requestId?: string;
  responseTimeMs?: number;
  stack?: string;
  [key: string]: unknown;
};

const LEVEL_METHOD: Record<LogLevel, keyof ConsoleLogger> = {
  error: 'error',
  warn: 'warn',
  log: 'log',
  debug: 'debug',
  verbose: 'verbose',
};

function shouldUseJson(): boolean {
  return (process.env.LOG_FORMAT ?? 'json').toLowerCase() === 'json';
}

@Injectable()
export class JsonLogger extends ConsoleLogger {
  override setLogLevels(levels: LogLevel[]): void {
    super.setLogLevels(levels);
  }

  private toMessage(payload: unknown): string {
    return typeof payload === 'string' ? payload : JSON.stringify(payload);
  }

  private write(
    level: LogLevel,
    message: unknown,
    context?: string,
    meta?: Record<string, unknown>,
    error?: unknown,
  ): void {
    if (!shouldUseJson()) {
      const method = LEVEL_METHOD[level] ?? 'log';
      if (method === 'error') {
        super.error(message, error instanceof Error ? error.stack : undefined, context);
      } else {
        super[method](message, context as any);
      }
      return;
    }

    const store = RequestContext.get();
    const line: JsonLog = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message: '',
      requestId: store?.requestId,
      ...(meta ?? {}),
    };

    if (typeof message === 'object' && message !== null) {
      const record = message as Record<string, unknown>;
      const { msg, message: nestedMessage, ...rest } = record;
      if (typeof msg === 'string') {
        line.message = msg;
      } else if (typeof nestedMessage === 'string') {
        line.message = nestedMessage;
      } else {
        line.message = JSON.stringify(record);
      }
      Object.assign(line, rest);
    } else {
      line.message = this.toMessage(message);
    }

    if (store?.startHrTime) {
      const diff = process.hrtime(store.startHrTime);
      line.responseTimeMs = Math.round(diff[0] * 1000 + diff[1] / 1_000_000);
    }

    if (error instanceof Error) {
      line.stack = error.stack ?? error.message;
    }

    process.stdout.write(`${JSON.stringify(line)}\n`);
  }

  override log(message: any, context?: string): void {
    this.write('log', message, context);
  }

  override error(message: any, stackOrContext?: string, context?: string): void {
    const hasContext = typeof context === 'string';
    const stack = hasContext ? stackOrContext : undefined;
    const ctx = hasContext ? context : stackOrContext;
    this.write('error', message, ctx, undefined, stack ? new Error(stack) : undefined);
  }

  override warn(message: any, context?: string): void {
    this.write('warn', message, context);
  }

  override debug(message: any, context?: string): void {
    this.write('debug', message, context);
  }

  override verbose(message: any, context?: string): void {
    this.write('verbose', message, context);
  }
}
