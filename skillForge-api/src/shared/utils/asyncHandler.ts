import { Request, Response, NextFunction } from 'express';

/**
 * Async handler wrapper for Express route handlers
 * Eliminates the need for try-catch in every async route handler
 * 
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await userService.getAll();
 *   res.json(users);
 * }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Async handler for use case execution with standardized error handling
 * 
 * @example
 * const result = await executeUseCase(() => registerUseCase.execute(data));
 */
export const executeUseCase = async <T>(
  fn: () => Promise<T>
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    // Re-throw to let error middleware handle it
    throw error;
  }
};
