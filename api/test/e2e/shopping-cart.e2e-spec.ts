/**
 * App: Shopping Cart
 * Package: api
 * File: test/e2e/shopping-cart.e2e-spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Description: Supertest-driven end-to-end coverage for shopping cart CRUD flows and OpenAPI discovery.
 */
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { AppDataSource } from '../../src/database/data-source';
import { HttpExceptionFilter } from '../../src/common/http/http-exception.filter';
import { JsonLogger } from '../../src/common/logging/json-logger.service';
import { LoggingInterceptor } from '../../src/common/logging/logging.interceptor';

describe('ShoppingCartController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = AppDataSource;
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      await dataSource.runMigrations();
    }

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const logger = app.get(JsonLogger);
    logger.setLogLevels(['error']);
    app.useLogger(logger);
    app.useGlobalFilters(app.get(HttpExceptionFilter));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );
    app.useGlobalInterceptors(app.get(LoggingInterceptor));
    await app.init();
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE shopping_cart.shopping_cart_discount RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE shopping_cart.shopping_cart_item RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE shopping_cart.shopping_cart RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('creates, reads, updates, and deletes a shopping cart', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/shopping-cart')
      .send({
        userId: 'e4fb3c2a-8935-4431-90bf-6fb6c803a2e9',
        items: [
          {
            productId: 'SKU-777',
            name: 'Mechanical Keyboard',
            quantity: 1,
            unitPrice: 129.99,
            currency: 'USD',
          },
        ],
        discounts: [
          {
            code: 'WELCOME10',
            amount: 10,
          },
        ],
        subtotal: 129.99,
        tax: 11.7,
        shipping: 0,
        total: 131.69,
        currency: 'USD',
      })
      .expect(201);

    const cartId = createResponse.body.id;
    expect(createResponse.body.items).toHaveLength(1);
    expect(createResponse.body.discounts).toHaveLength(1);

    const listResponse = await request(app.getHttpServer())
      .get('/shopping-cart')
      .expect(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body[0].id).toEqual(cartId);

    await request(app.getHttpServer())
      .put(`/shopping-cart/${cartId}`)
      .send({
        tax: 12.0,
        total: 132.0,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.tax).toBeCloseTo(12.0);
        expect(body.total).toBeCloseTo(132.0);
      });

    await request(app.getHttpServer()).delete(`/shopping-cart/${cartId}`).expect(204);
    await request(app.getHttpServer()).get(`/shopping-cart/${cartId}`).expect(404);
  });

  it('rejects invalid payloads with problem detail envelope', async () => {
    const response = await request(app.getHttpServer())
      .post('/shopping-cart')
      .send({
        userId: 'not-a-uuid',
        items: [],
        subtotal: -1,
        tax: -1,
        shipping: -1,
        total: -1,
        currency: 'usd',
        unexpected: true,
      })
      .expect(422);

    expect(response.body).toMatchObject({
      statusCode: 422,
      error: 'Unprocessable Entity',
      path: '/shopping-cart',
    });
    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('returns 404 problem detail for unknown route', async () => {
    const response = await request(app.getHttpServer())
      .get('/shopping-cart/non-existent-id')
      .expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
    });
  });

  it('exposes OpenAPI contract with shopping cart paths', async () => {
    const response = await request(app.getHttpServer()).get('/api/openapi.json').expect(200);
    expect(response.body.paths['/shopping-cart']).toBeDefined();
    expect(response.body.paths['/shopping-cart/{id}']).toBeDefined();
  });
});
