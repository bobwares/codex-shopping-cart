/**
 * # App: Customer Registration API
 * # Package: api/src/common/http
 * # File: http-exception.filter.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Exports: HttpExceptionFilter
 * # Description: Implements a global exception filter translating NestJS exceptions into Problem Detail responses
 * #              while emitting structured logs for diagnostics.
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { JsonLogger } from '../logging/json-logger.service';
import { ProblemDetail } from './problem-detail';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
      private readonly httpAdapterHost: HttpAdapterHost,
      private readonly logger: JsonLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    const request = context.getRequest<Request & { path?: string }>();
    const status = this.resolveStatus(exception);
    const problem = this.buildProblemDetail(exception, status, request?.path ?? request?.url ?? 'unknown');

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ message: 'Unhandled exception', exception }, undefined, 'HttpExceptionFilter');
    } else {
      this.logger.warn({ message: 'HTTP exception', exception, status }, 'HttpExceptionFilter');
    }

    httpAdapter.reply(context.getResponse(), problem, status);
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private buildProblemDetail(exception: unknown, status: number, path: string): ProblemDetail {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const { message, error } =
          typeof response === 'string'
              ? { message: response, error: exception.name }
              : (response as { message?: string | string[]; error?: string });

      return {
        statusCode: status,
        error: error ?? exception.name,
        message: message ?? exception.message,
        path,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      statusCode: status,
      error: 'InternalServerError',
      message: 'An unexpected error occurred.',
      path,
      timestamp: new Date().toISOString(),
    };
  }
}
