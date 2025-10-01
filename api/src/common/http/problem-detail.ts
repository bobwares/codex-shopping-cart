/**
 * App: Shopping Cart
 * Package: api
 * File: common/http/problem-detail.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-30T23:55:39Z
 * Exports: ProblemDetail
 * Description: Problem Details response contract describing standardized error payloads returned by the API.
 */
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class ProblemDetail {
  @ApiProperty({ description: 'HTTP status code of the error', example: 400 })
  statusCode!: number;

  @ApiProperty({ description: 'Short error summary', example: 'Bad Request' })
  error!: string;

  @ApiProperty({ description: 'Human readable explanation of the problem' })
  message!: string | string[];

  @ApiProperty({ description: 'Request path that triggered the error', example: '/shopping-cart/123' })
  path!: string;

  @ApiProperty({ description: 'Timestamp indicating when the error occurred', example: '2025-09-30T23:31:16.000Z' })
  timestamp!: string;

  @ApiPropertyOptional({ description: 'Additional error details providing field level validation messages' })
  details?: unknown;
}
