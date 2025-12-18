"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const AppError_1 = require("../../domain/errors/AppError");
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
const env_1 = require("../../config/env");
const errorHandler = (err, req, res, _next) => {
    const isAppError = err instanceof AppError_1.AppError;
    const appError = isAppError ? err : null;
    let statusCode;
    let errorCode;
    let message;
    let details = undefined;
    if (isAppError && appError) {
        statusCode = appError.statusCode;
        errorCode = appError.name || 'APP_ERROR';
        message = appError.message;
        // Include validation details if available
        const reqWithDetails = req;
        if (reqWithDetails.zodDetails) {
            details = reqWithDetails.zodDetails;
        }
    }
    else {
        statusCode = HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR;
        errorCode = 'INTERNAL_SERVER_ERROR';
        message = err instanceof Error ? err.message : 'Internal server error';
        // Only include stack in development
        if (env_1.env.NODE_ENV === 'development' && err instanceof Error) {
            details = { stack: err.stack };
        }
    }
    // Log error
    console.error('Error:', {
        errorCode,
        message,
        statusCode,
        path: req.path,
        method: req.method,
        ...(env_1.env.NODE_ENV === 'development' && {
            stack: err instanceof Error ? err.stack : undefined,
        }),
    });
    // Build and send error response with simplified structure for frontend
    const responseBody = {
        success: false,
        message,
        error: message, // Send error as string for easy frontend access
    };
    // Add details only if present
    if (details !== undefined) {
        responseBody.details = details;
    }
    res.status(statusCode).json(responseBody);
};
exports.errorHandler = errorHandler;
/**
 * Handler for 404 Not Found errors
 */
const notFoundHandler = (req, res) => {
    const response = {
        success: false,
        message: 'Route not found',
        error: `Route ${req.method} ${req.path} not found`,
        details: { path: req.path, method: req.method },
    };
    res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json(response);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map