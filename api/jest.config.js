/**
 * App: Shopping Cart
 * Package: api
 * File: jest.config.js
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: module.exports
 * Description: Base Jest configuration for unit tests targeting the NestJS API source files.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/__tests__/**/*.spec.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  coverageDirectory: '<rootDir>/coverage',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  }
};
