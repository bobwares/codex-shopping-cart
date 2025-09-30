-- App: Shopping Cart
-- Package: db
-- File: 01_shopping_cart_domain.sql
-- Version: 0.1.0
-- Turns: 2
-- Author: Codex Agent
-- Date: 2025-09-30T23:31:16Z
-- Description: Creates the shopping_cart schema with normalized tables, constraints, and indexes for cart persistence.
BEGIN;

CREATE SCHEMA IF NOT EXISTS shopping_cart;
SET search_path TO shopping_cart, public;

CREATE TABLE IF NOT EXISTS shopping_cart (
    cart_id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
    shipping NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (shipping >= 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    currency CHAR(3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    UNIQUE (user_id, cart_id)
);

CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_id
    ON shopping_cart (user_id);

CREATE TABLE IF NOT EXISTS shopping_cart_item (
    item_id BIGSERIAL PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES shopping_cart(cart_id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    currency CHAR(3),
    UNIQUE (cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_shopping_cart_item_cart_id
    ON shopping_cart_item (cart_id);

CREATE TABLE IF NOT EXISTS shopping_cart_discount (
    discount_id BIGSERIAL PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES shopping_cart(cart_id) ON DELETE CASCADE,
    code VARCHAR(64),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_shopping_cart_discount_code
    ON shopping_cart_discount (cart_id, code)
    WHERE code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_shopping_cart_discount_cart_id
    ON shopping_cart_discount (cart_id);

CREATE OR REPLACE VIEW shopping_cart_overview AS
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
FROM shopping_cart c
LEFT JOIN shopping_cart_item i ON i.cart_id = c.cart_id
LEFT JOIN shopping_cart_discount d ON d.cart_id = c.cart_id
GROUP BY c.cart_id;

COMMIT;

-- Smoke test: SELECT cart_id, total FROM shopping_cart_overview LIMIT 5;
