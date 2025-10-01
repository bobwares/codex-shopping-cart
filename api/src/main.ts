/**
 * App: Shopping Cart
 * Package: api
 * File: main.ts
 * Version: 0.2.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: bootstrap
 * Description: Bootstraps the NestJS HTTP server with validated configuration, structured logging, global validation, and OpenAPI docs.
 */
import 'reflect-metadata';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LogLevel, ValidationPipe, HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { stringify as toYaml } from 'yaml';
import { AppModule } from './app.module';
import { JsonLogger } from './common/logging/json-logger.service';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { HttpExceptionFilter } from './common/http/http-exception.filter';

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

  const exceptionFilter = app.get(HttpExceptionFilter);
  app.useGlobalFilters(exceptionFilter);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: true },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port', 3000);

  const packageJson = JSON.parse(
    readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'),
  ) as { version: string };

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shopping Cart API')
    .setDescription('REST API for managing shopping cart aggregates')
    .setVersion(packageJson.version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/api/openapi.json', (_req, res) => {
    res.json(document);
  });
  httpAdapter.get('/api/openapi.yaml', (_req, res) => {
    res.type('text/yaml').send(toYaml(document));
  });

  await app.listen(port);
}

bootstrap().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
