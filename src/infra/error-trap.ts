import type { Request, Response, NextFunction } from 'express';
import * as logger from './logger';

export function errorTrapMiddleware(error: Error, request: Request, response: Response, next: NextFunction): void {
  if (response.headersSent) {
    return next(error);
  }
  logger.error(error);
  response
    .status(500)
    .setHeader('content-type', 'text/plain')
    .send({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal server error',
      },
      id: null,
    });
}
