import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../domain/errors/AppError';

/**
 * Middleware to validate request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateBody = (schema: z.ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                const errors = result.error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                const errorMessage = errors.map((e: { field: string; message: string }) =>
                    `${e.field}: ${e.message}`
                ).join(', ');
                throw new ValidationError(errorMessage);
            }

            // Replace body with validated and transformed data
            req.body = result.data;
            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Middleware to validate request query parameters against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateQuery = (schema: z.ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            const result = schema.safeParse(req.query);

            if (!result.success) {
                const errors = result.error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                const errorMessage = errors.map((e: { field: string; message: string }) =>
                    `${e.field}: ${e.message}`
                ).join(', ');
                throw new ValidationError(errorMessage);
            }

            req.query = result.data as any;
            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Middleware to validate request params against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateParams = (schema: z.ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            const result = schema.safeParse(req.params);

            if (!result.success) {
                const errors = result.error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                const errorMessage = errors.map((e: { field: string; message: string }) =>
                    `${e.field}: ${e.message}`
                ).join(', ');
                throw new ValidationError(errorMessage);
            }

            req.params = result.data as any;
            next();
        } catch (error) {
            next(error);
        }
    };
};
