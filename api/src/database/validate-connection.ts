/**
 * App: Shopping Cart
 * Package: api
 * File: database/validate-connection.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Description: Connectivity smoke-test script for the DataSource ensuring database credentials succeed.
 */
import { AppDataSource } from './data-source';

(async () => {
  try {
    const dataSource = await AppDataSource.initialize();
    await dataSource.query('SELECT 1');
    await dataSource.destroy();
    // eslint-disable-next-line no-console
    console.log('DB connection OK');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('DB connection failed', error);
    process.exit(1);
  }
})();
