"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const AppError_1 = require("../../domain/errors/AppError");
/**
 * Middleware to validate request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
const validateBody = (schema) => {
    return (req, _res, next) => {
        try {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                const errors = result.error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                const errorMessage = errors.map((e) => `${e.field}: ${e.message}`).join(', ');
                throw new AppError_1.ValidationError(errorMessage);
            }
            // Replace body with validated and transformed data
            req.body = result.data;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateBody = validateBody;
/**
 * Middleware to validate request query parameters against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
const validateQuery = (schema) => {
    return (req, _res, next) => {
        try {
            const result = schema.safeParse(req.query);
            if (!result.success) {
                const errors = result.error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                const errorMessage = errors.map((e) => `${e.field}: ${e.message}`).join(', ');
                throw new AppError_1.ValidationError(errorMessage);
            }
            req.query = result.data;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateQuery = validateQuery;
/**
 * Middleware to validate request params against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
const validateParams = (schema) => {
    return (req, _res, next) => {
        try {
            const result = schema.safeParse(req.params);
            if (!result.success) {
                const errors = result.error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                const errorMessage = errors.map((e) => `${e.field}: ${e.message}`).join(', ');
                throw new AppError_1.ValidationError(errorMessage);
            }
            req.params = result.data;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateParams = validateParams;
//# sourceMappingURL=validationMiddleware.js.map