import { Request, Response, NextFunction } from 'express';

export const handleAsync = (
  fn: () => Promise<void>,
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  fn().catch(next);
};