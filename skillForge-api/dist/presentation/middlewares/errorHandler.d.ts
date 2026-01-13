import { Request, Response, NextFunction } from 'express';
export declare const errorHandler: (err: unknown, req: Request, res: Response, _next: NextFunction) => void;
/**
 * Handler for 404 Not Found errors
 */
export declare const notFoundHandler: (req: Request, res: Response) => void;
/**
 * Async error handler wrapper for route handlers
 * Catches async errors and passes them to the error handler
 */
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map