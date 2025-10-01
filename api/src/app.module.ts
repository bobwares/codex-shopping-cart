/**
 * App: Shopping Cart
 * Package: api
 * File: app.module.ts
 * Version: 0.2.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: AppModule
 * Description: Root application module wiring configuration, health endpoints, logging, database connectivity, and domain modules.
 */
import * as path from 'node:path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { HealthModule } from './health/health.module';
import { RequestIdMiddleware } from './common/logging/request-id.middleware';
import { JsonLogger } from './common/logging/json-logger.service';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { HttpExceptionFilter } from './common/http/http-exception.filter';
import { ShoppingCartEntity } from './shopping-cart/entities/shopping-cart.entity';
import { ShoppingCartItemEntity } from './shopping-cart/entities/shopping-cart-item.entity';
import { ShoppingCartDiscountEntity } from './shopping-cart/entities/shopping-cart-discount.entity';

const CONTEXT_ENV = path.resolve(__dirname, '.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [CONTEXT_ENV, '.env'],
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('db.host'),
        port: config.get<number>('db.port', 5432),
        username: config.getOrThrow<string>('db.user'),
        password: config.getOrThrow<string>('db.pass'),
        database: config.getOrThrow<string>('db.name'),
        schema: config.get<string>('db.schema', 'public'),
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        logging: false,
        entities: [ShoppingCartEntity, ShoppingCartItemEntity, ShoppingCartDiscountEntity],
        migrations: [path.join(__dirname, 'migrations', '*{.js,.ts}')],
      }),
    }),
    HealthModule,
    ShoppingCartModule,
  ],
  providers: [JsonLogger, LoggingInterceptor, HttpExceptionFilter],
  exports: [JsonLogger, LoggingInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
