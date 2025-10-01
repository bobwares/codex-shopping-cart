/**
 * App: Shopping Cart
 * Package: api
 * File: shopping-cart/shopping-cart.module.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: ShoppingCartModule
 * Description: Feature module bundling shopping cart entities, service, and controller registration.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCartEntity } from './entities/shopping-cart.entity';
import { ShoppingCartItemEntity } from './entities/shopping-cart-item.entity';
import { ShoppingCartDiscountEntity } from './entities/shopping-cart-discount.entity';
import { ShoppingCartService } from './services/shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingCartEntity, ShoppingCartItemEntity, ShoppingCartDiscountEntity]),
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}
