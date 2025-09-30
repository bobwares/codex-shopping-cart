/**
 * App: Shopping Cart
 * Package: api
 * File: configuration.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: default
 * Description: Configuration factory providing strongly typed access to application and database settings.
 */
export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'backend',
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  db: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    schema: process.env.DATABASE_SCHEMA ?? 'public',
    ssl: (process.env.DATABASE_SSL ?? 'false').toLowerCase() === 'true',
  },
  logging: {
    level: (process.env.LOG_LEVEL ?? 'log').toLowerCase(),
    format: (process.env.LOG_FORMAT ?? 'json').toLowerCase(),
  },
});
