/**
 * # App: Customer Registration API
 * # Package: api/src/common/logging
 * # File: json-logger.service.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-09-30T16:46:37+00:00
 * # Description: Custom logger producing JSON lines enriched with request context metadata.
 * #
 * # Types
 * # - JsonLine: Shape of each structured log entry emitted when JSON format is active.
 * #
 * # Classes
 * # - JsonLogger: Extends NestJS ConsoleLogger to output structured JSON logs with request correlation data.
 * #   - configure: Applies runtime log levels and resolves active format.
 * #   - log/warn/error/debug/verbose: Emit structured entries while respecting configured format.
 */
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { RequestContext } from './request-context';

type JsonLine = {
  timestamp: string;
  level: LogLevel;
  context?: string;
  message: string;
  requestId?: string;
  stack?: string;
  [key: string]: unknown;
};

const FORMAT_ENV = 'LOG_FORMAT';

@Injectable()
export class JsonLogger extends ConsoleLogger {
  private format: 'json' | 'text' = this.resolveFormat();

  configure(levels: LogLevel[]): void {
    super.setLogLevels(levels);
    this.format = this.resolveFormat();
  }

  override log(message: unknown, context?: string): void {
    this.write('log', message, context);
  }

  override warn(message: unknown, context?: string): void {
    this.write('warn', message, context);
  }

  override error(message: unknown, stack?: string, context?: string): void {
    this.write('error', message, context, stack);
  }

  override debug(message: unknown, context?: string): void {
    this.write('debug', message, context);
  }

  override verbose(message: unknown, context?: string): void {
    this.write('verbose', message, context);
  }

  private write(level: LogLevel, message: unknown, context?: string, stack?: string): void {
    if (this.format === 'text') {
      this.writeText(level, message, stack, context);
      return;
    }

    const payload = this.buildJsonLine(level, message, context, stack);
    process.stdout.write(`${JSON.stringify(payload)}\n`);
  }

  private writeText(level: LogLevel, message: unknown, stack?: string, context?: string): void {
    const printable = typeof message === 'string' ? message : JSON.stringify(message);
    switch (level) {
      case 'error':
        super.error(printable, stack, context);
        break;
      case 'warn':
        super.warn(printable, context);
        break;
      case 'debug':
        super.debug(printable, context);
        break;
      case 'verbose':
        super.verbose(printable, context);
        break;
      default:
        super.log(printable, context);
    }
  }

  private buildJsonLine(
      level: LogLevel,
      message: unknown,
      context?: string,
      stack?: string,
  ): JsonLine {
    const requestContext = RequestContext.get();
    const line: JsonLine = {
      timestamp: new Date().toISOString(),
      level,
      message: '',
    };

    if (typeof requestContext?.requestId === 'string') {
      line.requestId = requestContext.requestId;
    }

    if (typeof context === 'string') {
      line.context = context;
    }

    if (typeof stack === 'string') {
      line.stack = stack;
    }

    if (typeof message === 'object' && message !== null) {
      const data = message as Record<string, unknown>;
      const { message: msg, msg: legacyMsg, ...rest } = data;
      line.message = typeof msg === 'string' ? msg : typeof legacyMsg === 'string' ? legacyMsg : level;
      Object.assign(line, rest);
    } else {
      line.message = String(message);
    }

    return line;
  }

  private resolveFormat(): 'json' | 'text' {
    const value = process.env[FORMAT_ENV]?.toLowerCase();
    return value === 'text' ? 'text' : 'json';
  }
}
