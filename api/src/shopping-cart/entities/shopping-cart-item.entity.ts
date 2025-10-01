/**
 * App: Shopping Cart
 * Package: api
 * File: shopping-cart/entities/shopping-cart-item.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: ShoppingCartItemEntity
 * Description: TypeORM entity representing persisted shopping cart line items with product references and totals.
 */
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ColumnNumericTransformer } from '../../common/database/column-numeric.transformer';
import { ShoppingCartEntity } from './shopping-cart.entity';

@Entity({ name: 'shopping_cart_item', schema: 'shopping_cart' })
@Index('ix_shopping_cart_item_cart_id', ['cartId'])
@Unique('ux_shopping_cart_item_cart_product', ['cartId', 'productId'])
export class ShoppingCartItemEntity {
  @PrimaryGeneratedColumn('increment', { name: 'item_id', type: 'integer' })
  itemId!: number;

  @Column('uuid', { name: 'cart_id' })
  cartId!: string;

  @Column('varchar', { name: 'product_id', length: 100 })
  productId!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('integer', { name: 'quantity' })
  quantity!: number;

  @Column('numeric', {
    name: 'unit_price',
    precision: 12,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  unitPrice!: number;

  @Column('numeric', {
    name: 'total_price',
    precision: 12,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  totalPrice!: number;

  @Column('char', { name: 'currency', length: 3, nullable: true })
  currency?: string | null;

  @ManyToOne(() => ShoppingCartEntity, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'cartId' })
  cart!: ShoppingCartEntity;
}
