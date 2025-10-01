/**
 * App: Shopping Cart
 * Package: api
 * File: shopping-cart/entities/shopping-cart-discount.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: ShoppingCartDiscountEntity
 * Description: TypeORM entity modeling discounts applied to shopping carts with uniqueness constraints per code.
 */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../../common/database/column-numeric.transformer';
import { ShoppingCartEntity } from './shopping-cart.entity';

@Entity({ name: 'shopping_cart_discount', schema: 'shopping_cart' })
@Index('ix_shopping_cart_discount_cart_id', ['cartId'])
@Index('ux_shopping_cart_discount_code', ['cartId', 'code'], { unique: true, where: 'code IS NOT NULL' })
export class ShoppingCartDiscountEntity {
  @PrimaryGeneratedColumn('increment', { name: 'discount_id', type: 'integer' })
  discountId!: number;

  @Column('uuid', { name: 'cart_id' })
  cartId!: string;

  @Column('varchar', { length: 64, nullable: true })
  code?: string | null;

  @Column('numeric', {
    name: 'amount',
    precision: 12,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount!: number;

  @ManyToOne(() => ShoppingCartEntity, (cart) => cart.discounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'cartId' })
  cart!: ShoppingCartEntity;
}
