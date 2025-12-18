import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
/**
 * Middleware to validate request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export declare const validateBody: (schema: z.ZodSchema) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Middleware to validate request query parameters against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export declare const validateQuery: (schema: z.ZodSchema) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Middleware to validate request params against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export declare const validateParams: (schema: z.ZodSchema) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validationMiddleware.d.ts.map