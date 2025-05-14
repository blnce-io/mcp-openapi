import type { Request, Response, NextFunction } from "express";
import * as logger from "./logger";

export function requestLogger(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  logger.log("Request start", request.method, request.url);
  next();
}