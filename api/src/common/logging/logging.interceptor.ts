/**
 * App: Shopping Cart
 * Package: api
 * File: logging.interceptor.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: LoggingInterceptor
 * Description: Captures request lifecycle timings and emits structured JSON logs for every HTTP exchange.
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { JsonLogger } from './json-logger.service';

const HTTP_CONTEXT = 'HTTP';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: JsonLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { originalUrl?: string }>();
    const res = http.getResponse<{ statusCode?: number }>();

    const method = req.method;
    const url = req.originalUrl ?? req.url;

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          {
            event: 'request.completed',
            method,
            url,
            statusCode: res.statusCode ?? 200,
          },
          HTTP_CONTEXT,
        );
      }),
      catchError((error: unknown) => {
        const status = res.statusCode ?? 500;
        if (error instanceof Error) {
          this.logger.error('Request failed', error.stack, HTTP_CONTEXT);
        } else {
          this.logger.error('Request failed', undefined, HTTP_CONTEXT);
        }
        this.logger.log(
          {
            event: 'request.failed',
            method,
            url,
            statusCode: status,
          },
          HTTP_CONTEXT,
        );
        return throwError(() => error);
      }),
    );
  }
}
