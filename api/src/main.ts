/**
 * App: Shopping Cart
 * Package: api
 * File: main.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: bootstrap
 * Description: Bootstraps the NestJS HTTP server with validated configuration and structured logging.
 */
import 'reflect-metadata';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { JsonLogger } from './common/logging/json-logger.service';
import { LoggingInterceptor } from './common/logging/logging.interceptor';

const levelsOrder: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

function resolveLogLevels(level: string | undefined): LogLevel[] {
  const normalized = (level ?? 'log').toLowerCase();
  const index = levelsOrder.indexOf(normalized as LogLevel);
  if (index === -1) {
    return levelsOrder.slice(0, 3);
  }
  return levelsOrder.slice(0, index + 1);
}

async function bootstrap(): Promise<void> {
  const logLevels = resolveLogLevels(process.env.LOG_LEVEL);
  const app = await NestFactory.create(AppModule, { logger: logLevels });

  const jsonLogger = app.get(JsonLogger);
  jsonLogger.setLogLevels(logLevels);
  app.useLogger(jsonLogger);

  const loggingInterceptor = app.get(LoggingInterceptor);
  app.useGlobalInterceptors(loggingInterceptor);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port', 3000);
  await app.listen(port);
}

bootstrap().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
