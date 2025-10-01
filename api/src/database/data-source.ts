/**
 * App: Shopping Cart
 * Package: api
 * File: database/data-source.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: AppDataSource
 * Description: TypeORM DataSource configuration loading environment variables for CLI interactions and migrations.
 */
import 'reflect-metadata';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ShoppingCartEntity } from '../shopping-cart/entities/shopping-cart.entity';
import { ShoppingCartItemEntity } from '../shopping-cart/entities/shopping-cart-item.entity';
import { ShoppingCartDiscountEntity } from '../shopping-cart/entities/shopping-cart-discount.entity';

const contextEnvPath = path.resolve(__dirname, '..', '..', 'ai', 'context', '.env');
dotenv.config({ path: contextEnvPath });
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: process.env.DATABASE_SCHEMA,
  ssl: (process.env.DATABASE_SSL ?? 'false').toLowerCase() === 'true' ? { rejectUnauthorized: false } : undefined,
  synchronize: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [ShoppingCartEntity, ShoppingCartItemEntity, ShoppingCartDiscountEntity],
  migrations: [path.resolve(__dirname, 'migrations', '*{.ts,.js}'), path.resolve(__dirname, '..', 'migrations', '*{.ts,.js}')],
});
