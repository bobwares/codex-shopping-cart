# Database Toolkit

## Migrations

- `migrations/01_shopping_cart_domain.sql`
  - Creates the `shopping_cart` schema, normalized cart, item, and discount tables, plus the `shopping_cart_overview` view.
  - Run with `psql -f migrations/01_shopping_cart_domain.sql "$DATABASE_URL"` after exporting the required environment variables.
  - Smoke test: `SELECT cart_id, total FROM shopping_cart_overview LIMIT 5;`

## Test Data

- `test/shopping_cart_domain_test_data.sql`
  - Seeds ten carts with associated items and discounts for local development scenarios.
  - Apply after running the migrations using `psql -f test/shopping_cart_domain_test_data.sql "$DATABASE_URL"`.
  - Smoke test: `SELECT COUNT(*) FROM shopping_cart.shopping_cart;`
