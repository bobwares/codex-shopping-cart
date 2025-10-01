/**
 * App: Shopping Cart
 * Package: api
 * File: app.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: AppModule
 * Description: Root application module wiring configuration, health endpoints, and structured logging middleware.
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { HealthModule } from './health/health.module';
import { RequestIdMiddleware } from './common/logging/request-id.middleware';
import { JsonLogger } from './common/logging/json-logger.service';
import { LoggingInterceptor } from './common/logging/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      validationSchema,
    }),
    HealthModule,
  ],
  providers: [JsonLogger, LoggingInterceptor],
  exports: [JsonLogger, LoggingInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
