/**
 * App: Shopping Cart
 * Package: api
 * File: shopping-cart/dto/shopping-cart-item.dto.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: CreateShoppingCartItemDto, UpdateShoppingCartItemDto, ShoppingCartItemDto
 * Description: DTO definitions describing shopping cart line items with validation rules and API annotations.
 */
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreateShoppingCartItemDto {
  @ApiProperty({ description: 'Product identifier within the catalog', example: 'SKU-12345' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ description: 'Human readable product name', example: 'Wireless Mouse' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Quantity of the product in the cart', example: 2, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({ description: 'Unit price for the product', example: 19.99, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  unitPrice!: number;

  @ApiPropertyOptional({ description: 'Currency for pricing in ISO 4217 format', example: 'USD', pattern: '^[A-Z]{3}$' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  currency?: string;

  @ApiPropertyOptional({ description: 'Override total line price when provided', example: 39.98, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  totalPrice?: number;
}

export class UpdateShoppingCartItemDto extends PartialType(CreateShoppingCartItemDto) {}

export class ShoppingCartItemDto {
  @ApiProperty({ description: 'Database identifier for the line item', example: 42 })
  @IsInt()
  itemId!: number;

  @ApiProperty({ description: 'Product identifier within the catalog', example: 'SKU-12345' })
  @IsString()
  productId!: string;

  @ApiProperty({ description: 'Human readable product name', example: 'Wireless Mouse' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Quantity of the product in the cart', example: 2 })
  @IsInt()
  quantity!: number;

  @ApiProperty({ description: 'Unit price for the product', example: 19.99 })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  unitPrice!: number;

  @ApiProperty({ description: 'Total price for the line item', example: 39.98 })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  totalPrice!: number;

  @ApiPropertyOptional({ description: 'Currency for pricing in ISO 4217 format', example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string | null;
}
