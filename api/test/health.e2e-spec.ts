/**
 * App: Shopping Cart
 * Package: api
 * File: health.e2e-spec.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: (tests)
 * Description: Exercises the health endpoints through HTTP to verify liveness, readiness, and metadata responses.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const REQUIRED_ENV = {
  DATABASE_HOST: 'localhost',
  DATABASE_USER: 'postgres',
  DATABASE_PASSWORD: 'postgres',
  DATABASE_NAME: 'shopping_cart',
  LOG_FORMAT: 'json',
  LOG_LEVEL: 'error',
};

describe('Health E2E', () => {
  let app: INestApplication;
  const originalEnv = { ...process.env };

  beforeAll(async () => {
    Object.assign(process.env, REQUIRED_ENV);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    process.env = originalEnv;
  });

  it('/health (GET) -> 200', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBeDefined();
  });

  it('/health/live (GET) -> 200', async () => {
    const res = await request(app.getHttpServer()).get('/health/live');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('/health/ready (GET) -> 200', async () => {
    const res = await request(app.getHttpServer()).get('/health/ready');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
