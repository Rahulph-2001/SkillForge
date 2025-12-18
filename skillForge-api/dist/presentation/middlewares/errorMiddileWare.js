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
    let message;
    if (isAppError && appError) {
        statusCode = appError.statusCode;
        message = appError.message;
    }
    else {
        statusCode = HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR;
        message = err instanceof Error ? err.message : 'Internal server error';
    }
    console.error('Error:', {
        message,
        name: appError?.name || 'Error',
        status: statusCode,
        isOperational: appError?.isOperational || false,
        stack: env_1.env.NODE_ENV === 'development'
            ? (err instanceof Error ? err.stack : undefined)
            : undefined,
        path: req.path,
        method: req.method,
    });
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(env_1.env.NODE_ENV === 'development' && {
            stack: err instanceof Error ? err.stack : undefined
        }),
        ...(req.zodDetails && {
            details: req.zodDetails,
        }),
    });
};
exports.errorHandler = errorHandler;
const responseHelpers_1 = require("../../shared/http/responseHelpers");
const notFoundHandler = (req, res) => {
    const response = (0, responseHelpers_1.errorResponse)('NOT_FOUND', 'Route not found', HttpStatusCode_1.HttpStatusCode.NOT_FOUND, { path: req.path });
    res.status(response.statusCode).json(response.body);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorMiddileWare.js.map