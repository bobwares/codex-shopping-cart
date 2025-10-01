/**
 * App: Shopping Cart
 * Package: api
 * File: shopping-cart/entities/shopping-cart.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: ShoppingCartEntity
 * Description: TypeORM aggregate root for persisted shopping cart records with financial totals and relational mapping.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnNumericTransformer } from '../../common/database/column-numeric.transformer';
import { ShoppingCartItemEntity } from './shopping-cart-item.entity';
import { ShoppingCartDiscountEntity } from './shopping-cart-discount.entity';

@Entity({ name: 'shopping_cart', schema: 'shopping_cart' })
@Unique('ux_shopping_cart_user_id_cart_id', ['userId', 'cartId'])
@Index('ix_shopping_cart_user_id', ['userId'])
export class ShoppingCartEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'cart_id' })
  cartId!: string;

  @Column('uuid', { name: 'user_id' })
  userId!: string;

  @Column('numeric', {
    name: 'subtotal',
    precision: 12,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  subtotal!: number;

  @Column('numeric', {
    name: 'tax',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  tax!: number;

  @Column('numeric', {
    name: 'shipping',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  shipping!: number;

  @Column('numeric', {
    name: 'total',
    precision: 12,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  total!: number;

  @Column('char', { name: 'currency', length: 3 })
  currency!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => ShoppingCartItemEntity, (item) => item.cart, {
    cascade: true,
    eager: false,
  })
  items!: ShoppingCartItemEntity[];

  @OneToMany(() => ShoppingCartDiscountEntity, (discount) => discount.cart, {
    cascade: true,
    eager: false,
  })
  discounts!: ShoppingCartDiscountEntity[];
}
