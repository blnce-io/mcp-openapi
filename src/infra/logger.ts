import { getRequestContext } from './request-context.ts';

export function log(...args: unknown[]): void {
  const context = getRequestContext();
  console.log(
    JSON.stringify({
      time: Date.now(),
      requestId: context?.requestId,
      log: args.map((arg) => mapArg(arg)),
    }),
  );
}

export function error(...args: unknown[]): void {
  const context = getRequestContext();
  console.error(
    JSON.stringify({
      time: Date.now(),
      requestId: context?.requestId,
      log: args.map((arg) => mapArg(arg)),
    }),
  );
}

function mapArg(arg: unknown): unknown {
  if (arg instanceof Error) {
    return {
      [arg.name]: arg.message,
      cause: mapArg(arg.cause),
      stack: arg.stack,
    };
  }
  return arg;
}
