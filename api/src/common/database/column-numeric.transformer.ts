/**
 * App: Shopping Cart
 * Package: api
 * File: common/database/column-numeric.transformer.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: ColumnNumericTransformer
 * Description: TypeORM value transformer converting between numeric database strings and JavaScript numbers.
 */
import { ValueTransformer } from 'typeorm';

export class ColumnNumericTransformer implements ValueTransformer {
  to(value?: number | null): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }
    if (value === null) {
      return null;
    }
    return value.toString();
  }

  from(value: string | null): number | null {
    if (value === null) {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
}
