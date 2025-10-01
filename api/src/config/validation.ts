/**
 * App: Shopping Cart
 * Package: api
 * File: config/validation.ts
 * Version: 0.2.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: validationSchema
 * Description: Joi schema validating configuration required to run the API and supporting logging toggles.
 */
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  APP_NAME: Joi.string().default('backend'),
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
  DATABASE_HOST: Joi.string().hostname().required(),
  DATABASE_PORT: Joi.number().integer().min(1).max(65535).default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow('').required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SCHEMA: Joi.string().default('public'),
  DATABASE_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'log', 'debug', 'verbose').default('log'),
  LOG_FORMAT: Joi.string().valid('json', 'text').default('json'),
});
