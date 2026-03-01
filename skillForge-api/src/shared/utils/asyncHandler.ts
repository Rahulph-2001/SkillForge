import { type Request, type Response, type NextFunction } from 'express';


export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


export const executeUseCase = async <T>(
  fn: () => Promise<T>
): Promise<T> => {
  return fn();
};
