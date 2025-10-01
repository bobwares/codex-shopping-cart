/**
 * App: Shopping Cart
 * Package: api
 * File: shopping-cart/dto/shopping-cart.dto.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: CreateShoppingCartDto, UpdateShoppingCartDto, ResponseShoppingCartDto
 * Description: DTOs for shopping cart aggregate operations including validation and OpenAPI metadata.
 */
import { ApiProperty, ApiPropertyOptional, ApiResponseProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  CreateShoppingCartItemDto,
  ShoppingCartItemDto,
  UpdateShoppingCartItemDto,
} from './shopping-cart-item.dto';
import {
  CreateShoppingCartDiscountDto,
  ShoppingCartDiscountDto,
  UpdateShoppingCartDiscountDto,
} from './shopping-cart-discount.dto';

export class CreateShoppingCartDto {
  @ApiPropertyOptional({ description: 'Identifier for the cart', example: '3d5e67a5-0df5-4c08-9ad0-5f7c1c57c3d4' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Identifier of the cart owner', example: '3c76a9da-0c4e-44b6-8d89-2e24125b5c2f' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ description: 'Line items comprising the cart', type: [CreateShoppingCartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShoppingCartItemDto)
  items!: CreateShoppingCartItemDto[];

  @ApiPropertyOptional({
    description: 'Discounts applied to the cart',
    type: [CreateShoppingCartDiscountDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShoppingCartDiscountDto)
  discounts?: CreateShoppingCartDiscountDto[];

  @ApiProperty({ description: 'Subtotal prior to discounts and fees', example: 59.97, minimum: 0 })
  @Type(() => Number)
  @Min(0)
  subtotal!: number;

  @ApiPropertyOptional({ description: 'Total discounts applied', example: 5.0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  discountsTotal?: number;

  @ApiProperty({ description: 'Tax amount applied to the cart', example: 4.80, minimum: 0 })
  @Type(() => Number)
  @Min(0)
  tax!: number;

  @ApiProperty({ description: 'Shipping charges for the cart', example: 7.5, minimum: 0 })
  @Type(() => Number)
  @Min(0)
  shipping!: number;

  @ApiProperty({ description: 'Final total after discounts, tax, and shipping', example: 67.27, minimum: 0 })
  @Type(() => Number)
  @Min(0)
  total!: number;

  @ApiProperty({ description: 'Currency for monetary values', example: 'USD', pattern: '^[A-Z]{3}$' })
  @Matches(/^[A-Z]{3}$/)
  @IsString()
  currency!: string;

  @ApiPropertyOptional({ description: 'ISO timestamp when the cart was created', example: '2025-09-30T23:31:16.000Z' })
  @IsOptional()
  @IsString()
  createdAt?: string;

  @ApiPropertyOptional({ description: 'ISO timestamp when the cart was last updated', example: '2025-09-30T23:31:16.000Z' })
  @IsOptional()
  @IsString()
  updatedAt?: string;
}

export class UpdateShoppingCartDto extends PartialType(CreateShoppingCartDto) {
  @ApiPropertyOptional({ description: 'Line items comprising the cart', type: [UpdateShoppingCartItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateShoppingCartItemDto)
  override items?: UpdateShoppingCartItemDto[];

  @ApiPropertyOptional({ description: 'Discounts applied to the cart', type: [UpdateShoppingCartDiscountDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateShoppingCartDiscountDto)
  override discounts?: UpdateShoppingCartDiscountDto[];
}

export class ResponseShoppingCartDto {
  @ApiResponseProperty({ description: 'Identifier for the cart', example: '3d5e67a5-0df5-4c08-9ad0-5f7c1c57c3d4' })
  id!: string;

  @ApiResponseProperty({ description: 'Identifier of the cart owner', example: '3c76a9da-0c4e-44b6-8d89-2e24125b5c2f' })
  userId!: string;

  @ApiResponseProperty({ description: 'Line items comprising the cart', type: [ShoppingCartItemDto] })
  items!: ShoppingCartItemDto[];

  @ApiResponseProperty({ description: 'Discounts applied to the cart', type: [ShoppingCartDiscountDto] })
  discounts!: ShoppingCartDiscountDto[];

  @ApiResponseProperty({ description: 'Subtotal prior to discounts and fees', example: 59.97 })
  subtotal!: number;

  @ApiResponseProperty({ description: 'Aggregate discount amount', example: 5.0 })
  discountsTotal!: number;

  @ApiResponseProperty({ description: 'Tax amount applied to the cart', example: 4.8 })
  tax!: number;

  @ApiResponseProperty({ description: 'Shipping charges for the cart', example: 7.5 })
  shipping!: number;

  @ApiResponseProperty({ description: 'Final total after discounts, tax, and shipping', example: 67.27 })
  total!: number;

  @ApiResponseProperty({ description: 'Currency for monetary values', example: 'USD' })
  currency!: string;

  @ApiResponseProperty({ description: 'Timestamp when the cart was created', example: '2025-09-30T23:31:16.000Z' })
  createdAt!: string;

  @ApiResponseProperty({ description: 'Timestamp when the cart was last updated', example: '2025-09-30T23:41:16.000Z' })
  updatedAt!: string;
}
