/**
 * App: Shopping Cart
 * Package: api
 * File: shopping-cart/shopping-cart.controller.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: ShoppingCartController
 * Description: REST controller exposing CRUD operations for shopping cart aggregates with OpenAPI metadata.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ShoppingCartService } from './services/shopping-cart.service';
import {
  CreateShoppingCartDto,
  ResponseShoppingCartDto,
  UpdateShoppingCartDto,
} from './dto/shopping-cart.dto';
import { ProblemDetail } from '../common/http/problem-detail';

@ApiTags('ShoppingCart')
@ApiExtraModels(ProblemDetail)
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get()
  @ApiOperation({ summary: 'List all shopping carts' })
  @ApiOkResponse({ type: [ResponseShoppingCartDto] })
  async list(): Promise<ResponseShoppingCartDto[]> {
    return this.shoppingCartService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a shopping cart by identifier' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: ResponseShoppingCartDto })
  @ApiNotFoundResponse({ description: 'Shopping cart not found', type: ProblemDetail })
  async get(@Param('id', new ParseUUIDPipe()) id: string): Promise<ResponseShoppingCartDto> {
    return this.shoppingCartService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new shopping cart' })
  @ApiCreatedResponse({ type: ResponseShoppingCartDto })
  @ApiBadRequestResponse({ description: 'Payload validation failed', type: ProblemDetail })
  @ApiBody({ type: CreateShoppingCartDto })
  async create(@Body() dto: CreateShoppingCartDto): Promise<ResponseShoppingCartDto> {
    return this.shoppingCartService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing shopping cart' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: ResponseShoppingCartDto })
  @ApiBadRequestResponse({ description: 'Payload validation failed', type: ProblemDetail })
  @ApiNotFoundResponse({ description: 'Shopping cart not found', type: ProblemDetail })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateShoppingCartDto,
  ): Promise<ResponseShoppingCartDto> {
    return this.shoppingCartService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a shopping cart' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Cart removed successfully' })
  @ApiNotFoundResponse({ description: 'Shopping cart not found', type: ProblemDetail })
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.shoppingCartService.remove(id);
  }
}
