/**
 * App: Shopping Cart
 * Package: api
 * File: request-context.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-30T23:31:16Z
 * Exports: RequestContext, RequestContextStore
 * Description: AsyncLocalStorage-backed helper storing per-request identifiers and timings.
 */
import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestContextStore = {
  requestId: string;
  startHrTime: [number, number];
};

const storage = new AsyncLocalStorage<RequestContextStore>();

export const RequestContext = {
  run<T>(store: RequestContextStore, callback: () => T): T {
    return storage.run(store, callback);
  },
  get(): RequestContextStore | undefined {
    return storage.getStore();
  },
};
