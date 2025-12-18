import { Request, Response, NextFunction } from 'express';
export declare const errorHandler: (err: unknown, req: Request, res: Response, _next: NextFunction) => void;
/**
 * Handler for 404 Not Found errors
 */
export declare const notFoundHandler: (req: Request, res: Response) => void;
//# sourceMappingURL=errorHandler.d.ts.map