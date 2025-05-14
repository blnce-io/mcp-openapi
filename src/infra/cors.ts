import type { Request, Response, NextFunction } from "express";

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // TODO (Security): Change this to k8s SD once we have it?
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.status(200).send();
    return;
  }
  next();
}