/**
 * App: Shopping Cart
 * Package: api
 * File: json-logger.service.spec.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: (tests)
 * Description: Validates the JSON logger produces structured output enriched with request context metadata.
 */
import { JsonLogger } from '../json-logger.service';
import { RequestContext } from '../request-context';

describe('JsonLogger', () => {
  const originalEnv = { ...process.env };
  const originalWrite = process.stdout.write;

  afterEach(() => {
    process.env = { ...originalEnv };
    process.stdout.write = originalWrite;
  });

  it('emits JSON with requestId and responseTime when LOG_FORMAT=json', () => {
    process.env.LOG_FORMAT = 'json';

    const writes: string[] = [];
    process.stdout.write = ((chunk: unknown) => {
      writes.push(String(chunk));
      return true;
    }) as typeof process.stdout.write;

    const logger = new JsonLogger();
    logger.setLogLevels(['error', 'warn', 'log', 'debug', 'verbose']);

    RequestContext.run({ requestId: 'abc123', startHrTime: process.hrtime() }, () => {
      logger.log({ event: 'unit-test' }, 'HTTP');
    });

    expect(writes).toHaveLength(1);
    const parsed = JSON.parse(writes[0]);
    expect(parsed.requestId).toBe('abc123');
    expect(parsed.responseTimeMs).toEqual(expect.any(Number));
    expect(parsed.event ?? parsed.message).toBeDefined();
  });
});
