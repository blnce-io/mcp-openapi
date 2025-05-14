import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";
import { addRequestContext } from "./request-context";

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const requestId = crypto.randomUUID();
  if (!res.headersSent) {
    res.setHeader("X-Request-Id", requestId);
  }
  addRequestContext({ requestId });
  next();
}