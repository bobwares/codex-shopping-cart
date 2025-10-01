/**
 * App: Shopping Cart
 * Package: api
 * File: shopping-cart/dto/shopping-cart-discount.dto.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: CreateShoppingCartDiscountDto, UpdateShoppingCartDiscountDto, ShoppingCartDiscountDto
 * Description: DTO models for cart discounts with validation constraints and OpenAPI metadata.
 */
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateShoppingCartDiscountDto {
  @ApiPropertyOptional({ description: 'Discount or coupon code applied to the cart', example: 'FREESHIP' })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  code?: string;

  @ApiProperty({ description: 'Monetary amount of the discount', example: 5.0, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  amount!: number;
}

export class UpdateShoppingCartDiscountDto extends PartialType(CreateShoppingCartDiscountDto) {}

export class ShoppingCartDiscountDto {
  @ApiProperty({ description: 'Database identifier for the discount row', example: 7 })
  discountId!: number;

  @ApiPropertyOptional({ description: 'Discount or coupon code applied to the cart', example: 'FREESHIP' })
  @IsOptional()
  @IsString()
  code?: string | null;

  @ApiProperty({ description: 'Monetary amount of the discount', example: 5.0 })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  amount!: number;
}
