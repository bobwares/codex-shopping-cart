/**
 * App: Shopping Cart
 * Package: api
 * File: migrations/1714512000000-CreateShoppingCartSchema.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Description: TypeORM migration creating shopping cart schema, tables, indexes, and supporting view.
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShoppingCartSchema1714512000000 implements MigrationInterface {
  name = 'CreateShoppingCartSchema1714512000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "shopping_cart"`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shopping_cart"."shopping_cart" (
        "cart_id" uuid PRIMARY KEY,
        "user_id" uuid NOT NULL,
        "subtotal" numeric(12, 2) NOT NULL CHECK ("subtotal" >= 0),
        "tax" numeric(12, 2) NOT NULL DEFAULT 0 CHECK ("tax" >= 0),
        "shipping" numeric(12, 2) NOT NULL DEFAULT 0 CHECK ("shipping" >= 0),
        "total" numeric(12, 2) NOT NULL CHECK ("total" >= 0),
        "currency" char(3) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        "updated_at" timestamptz NOT NULL DEFAULT NOW(),
        CONSTRAINT "ux_shopping_cart_user_id_cart_id" UNIQUE ("user_id", "cart_id")
      )
    `);

    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "ix_shopping_cart_user_id" ON "shopping_cart"."shopping_cart" ("user_id")',
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shopping_cart"."shopping_cart_item" (
        "item_id" BIGSERIAL PRIMARY KEY,
        "cart_id" uuid NOT NULL REFERENCES "shopping_cart"."shopping_cart" ("cart_id") ON DELETE CASCADE,
        "product_id" varchar(100) NOT NULL,
        "name" varchar(255) NOT NULL,
        "quantity" integer NOT NULL CHECK ("quantity" >= 1),
        "unit_price" numeric(12, 2) NOT NULL CHECK ("unit_price" >= 0),
        "total_price" numeric(12, 2) NOT NULL CHECK ("total_price" >= 0),
        "currency" char(3),
        CONSTRAINT "ux_shopping_cart_item_cart_product" UNIQUE ("cart_id", "product_id")
      )
    `);

    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "ix_shopping_cart_item_cart_id" ON "shopping_cart"."shopping_cart_item" ("cart_id")',
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shopping_cart"."shopping_cart_discount" (
        "discount_id" BIGSERIAL PRIMARY KEY,
        "cart_id" uuid NOT NULL REFERENCES "shopping_cart"."shopping_cart" ("cart_id") ON DELETE CASCADE,
        "code" varchar(64),
        "amount" numeric(12, 2) NOT NULL CHECK ("amount" >= 0)
      )
    `);

    await queryRunner.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "ux_shopping_cart_discount_code" ON "shopping_cart"."shopping_cart_discount" ("cart_id", "code") WHERE "code" IS NOT NULL',
    );

    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "ix_shopping_cart_discount_cart_id" ON "shopping_cart"."shopping_cart_discount" ("cart_id")',
    );

    await queryRunner.query(`
      CREATE OR REPLACE VIEW "shopping_cart"."shopping_cart_overview" AS
      SELECT
        c.cart_id,
        c.user_id,
        c.currency,
        c.total,
        c.subtotal,
        c.tax,
        c.shipping,
        COUNT(i.item_id) AS item_count,
        COALESCE(SUM(i.total_price), 0) AS items_total,
        COALESCE(SUM(d.amount), 0) AS discounts_total,
        c.created_at,
        c.updated_at
      FROM "shopping_cart"."shopping_cart" c
      LEFT JOIN "shopping_cart"."shopping_cart_item" i ON i.cart_id = c.cart_id
      LEFT JOIN "shopping_cart"."shopping_cart_discount" d ON d.cart_id = c.cart_id
      GROUP BY c.cart_id
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP VIEW IF EXISTS "shopping_cart"."shopping_cart_overview"');
    await queryRunner.query('DROP TABLE IF EXISTS "shopping_cart"."shopping_cart_discount" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "shopping_cart"."shopping_cart_item" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "shopping_cart"."shopping_cart" CASCADE');
    await queryRunner.query('DROP SCHEMA IF EXISTS "shopping_cart" CASCADE');
  }
}
