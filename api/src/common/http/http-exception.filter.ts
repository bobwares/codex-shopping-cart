/**
 * App: Shopping Cart
 * Package: api
 * File: common/http/http-exception.filter.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: HttpExceptionFilter
 * Description: Global NestJS exception filter normalizing error responses into Problem Detail envelopes with structured logging.
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonLogger } from '../logging/json-logger.service';
import { ProblemDetail } from './problem-detail';

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: JsonLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const problem = this.buildProblemDetail(exception, request);
    this.logger.error('HTTP request failed', {
      ...problem,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(problem.statusCode).json(problem);
  }

  private buildProblemDetail(exception: unknown, request: Request): ProblemDetail {
    const timestamp = new Date().toISOString();
    const path = request.url;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return {
          statusCode: status,
          error: exception.name,
          message: response,
          path,
          timestamp,
        };
      }

      const body = response as Record<string, unknown>;
      return {
        statusCode: status,
        error: (body.error as string) ?? exception.name,
        message: (body.message as string | string[]) ?? exception.message,
        path,
        timestamp,
        details: body.details ?? body.errors,
      };
    }

    const message = exception instanceof Error ? exception.message : 'Internal server error';
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message,
      path,
      timestamp,
    };
  }
}
