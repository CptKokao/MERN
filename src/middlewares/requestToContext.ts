import type { Request, Response, NextFunction } from "express";

export function requestToContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.req = req;
  next();
}
