/**
 * App: Shopping Cart
 * Package: api
 * File: shopping-cart/services/shopping-cart.service.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: ShoppingCartService
 * Description: Domain service orchestrating transactional CRUD operations for shopping carts and nested relations.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ShoppingCartEntity } from '../entities/shopping-cart.entity';
import { ShoppingCartItemEntity } from '../entities/shopping-cart-item.entity';
import { ShoppingCartDiscountEntity } from '../entities/shopping-cart-discount.entity';
import {
  CreateShoppingCartDto,
  ResponseShoppingCartDto,
  UpdateShoppingCartDto,
} from '../dto/shopping-cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ShoppingCartEntity)
    private readonly cartRepository: Repository<ShoppingCartEntity>,
  ) {}

  async create(dto: CreateShoppingCartDto): Promise<ResponseShoppingCartDto> {
    return this.dataSource.transaction(async (manager) => {
      const cart = manager.create(ShoppingCartEntity, {
        cartId: dto.id,
        userId: dto.userId,
        subtotal: dto.subtotal,
        tax: dto.tax,
        shipping: dto.shipping,
        total: dto.total,
        currency: dto.currency,
      });

      cart.items = (dto.items ?? []).map((item) =>
        manager.create(ShoppingCartItemEntity, {
          cart,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice ?? item.unitPrice * item.quantity,
          currency: item.currency ?? dto.currency,
        }),
      );

      cart.discounts = (dto.discounts ?? []).map((discount) =>
        manager.create(ShoppingCartDiscountEntity, {
          cart,
          code: discount.code,
          amount: discount.amount,
        }),
      );

      const saved = await manager.save(cart);
      return this.toResponse(
        await manager.findOneOrFail(ShoppingCartEntity, {
          where: { cartId: saved.cartId },
          relations: ['items', 'discounts'],
        }),
      );
    });
  }

  async findAll(): Promise<ResponseShoppingCartDto[]> {
    const carts = await this.cartRepository.find({
      relations: ['items', 'discounts'],
      order: { createdAt: 'DESC' },
    });
    return carts.map((cart) => this.toResponse(cart));
  }

  async findOne(id: string): Promise<ResponseShoppingCartDto> {
    const cart = await this.cartRepository.findOne({
      where: { cartId: id },
      relations: ['items', 'discounts'],
    });

    if (!cart) {
      throw new NotFoundException(`Shopping cart ${id} not found`);
    }

    return this.toResponse(cart);
  }

  async update(id: string, dto: UpdateShoppingCartDto): Promise<ResponseShoppingCartDto> {
    return this.dataSource.transaction(async (manager) => {
      const cart = await manager.findOne(ShoppingCartEntity, {
        where: { cartId: id },
        relations: ['items', 'discounts'],
      });

      if (!cart) {
        throw new NotFoundException(`Shopping cart ${id} not found`);
      }

      if (dto.userId !== undefined) {
        cart.userId = dto.userId;
      }
      if (dto.subtotal !== undefined) {
        cart.subtotal = dto.subtotal;
      }
      if (dto.tax !== undefined) {
        cart.tax = dto.tax;
      }
      if (dto.shipping !== undefined) {
        cart.shipping = dto.shipping;
      }
      if (dto.total !== undefined) {
        cart.total = dto.total;
      }
      if (dto.currency !== undefined) {
        cart.currency = dto.currency;
      }

      if (dto.items) {
        await manager.delete(ShoppingCartItemEntity, { cartId: id });
        cart.items = dto.items.map((item) =>
          manager.create(ShoppingCartItemEntity, {
            cart,
            productId: item.productId!,
            name: item.name!,
            quantity: item.quantity!,
            unitPrice: item.unitPrice!,
            totalPrice:
              item.totalPrice !== undefined
                ? item.totalPrice
                : item.unitPrice! * item.quantity!,
            currency: item.currency ?? cart.currency,
          }),
        );
      }

      if (dto.discounts) {
        await manager.delete(ShoppingCartDiscountEntity, { cartId: id });
        cart.discounts = dto.discounts.map((discount) =>
          manager.create(ShoppingCartDiscountEntity, {
            cart,
            code: discount.code,
            amount: discount.amount ?? 0,
          }),
        );
      }

      const saved = await manager.save(cart);
      return this.toResponse(
        await manager.findOneOrFail(ShoppingCartEntity, {
          where: { cartId: saved.cartId },
          relations: ['items', 'discounts'],
        }),
      );
    });
  }

  async remove(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const result = await manager.delete(ShoppingCartEntity, { cartId: id });
      if (result.affected === 0) {
        throw new NotFoundException(`Shopping cart ${id} not found`);
      }
    });
  }

  async clearAll(): Promise<void> {
    const carts = await this.cartRepository.find({ select: ['cartId'] });
    if (carts.length === 0) {
      return;
    }
    const ids = carts.map((cart) => cart.cartId);
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(ShoppingCartDiscountEntity, { cartId: In(ids) });
      await manager.delete(ShoppingCartItemEntity, { cartId: In(ids) });
      await manager.delete(ShoppingCartEntity, { cartId: In(ids) });
    });
  }

  private toResponse(entity: ShoppingCartEntity): ResponseShoppingCartDto {
    const items = [...(entity.items ?? [])];
    const discounts = [...(entity.discounts ?? [])];
    const discountsTotal = discounts.reduce((sum, discount) => sum + discount.amount, 0);
    return plainToInstance(
      ResponseShoppingCartDto,
      {
        id: entity.cartId,
        userId: entity.userId,
        items: items
          .sort((a, b) => a.itemId - b.itemId)
          .map((item) => ({
            itemId: item.itemId,
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            currency: item.currency,
          })),
        discounts: discounts
          .sort((a, b) => a.discountId - b.discountId)
          .map((discount) => ({
            discountId: discount.discountId,
            code: discount.code,
            amount: discount.amount,
          })),
        subtotal: entity.subtotal,
        discountsTotal,
        tax: entity.tax,
        shipping: entity.shipping,
        total: entity.total,
        currency: entity.currency,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
      },
      { enableImplicitConversion: true },
    );
  }
}
