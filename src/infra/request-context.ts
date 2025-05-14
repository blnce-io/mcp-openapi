import asyncHooks from "async_hooks";

const store = new Map();

const asyncHook = asyncHooks.createHook({ init, destroy });

function init(asyncId: number, type: string, triggerAsyncId: number): void {
  if (store.has(triggerAsyncId)) {
    store.set(asyncId, store.get(triggerAsyncId));
  }
}

function destroy(asyncId: number): void {
  if (store.has(asyncId)) {
    store.delete(asyncId);
  }
}

asyncHook.enable();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequestContext = Record<string, any>;

export function addRequestContext(context: RequestContext): void {
  store.set(asyncHooks.executionAsyncId(), {
    ...getRequestContext(),
    ...context,
  });
}

export function getRequestContext(): RequestContext {
  return store.get(asyncHooks.executionAsyncId());
}