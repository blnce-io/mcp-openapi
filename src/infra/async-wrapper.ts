import type { Request, Response, NextFunction } from "express";

// Express callbacks shouldn't return Promises, so to have Async/Await we wrap it in this
export const asyncWrapper = <T>(
  callback: (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<T>,
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      return await callback(request, response, next);
    } catch (e) {
      next(e);
    }
  };
};