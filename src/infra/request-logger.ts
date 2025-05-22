import type { Request, Response, NextFunction } from 'express';
import * as logger from './logger';

export function requestLogger(request: Request, response: Response, next: NextFunction): void {
  if (!request.headers['user-agent'].startsWith('kube-probe/')) {
    logger.log('Request start', {
      method: request.method,
      url: request.url,
      headers: omit(request.headers, ['cookie', 'authorization']),
    });
  }
  next();
}

function omit(object: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  return Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key.toLowerCase())));
}
