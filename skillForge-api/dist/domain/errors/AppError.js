"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.AppError = void 0;
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
const messages_1 = require("../../config/messages");
class AppError extends Error {
    constructor(message, statusCode = HttpStatusCode_1.HttpStatusCode.BAD_REQUEST) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message = messages_1.ERROR_MESSAGES.GENERAL.RESOURCE_NOT_FOUND) {
        super(message, HttpStatusCode_1.HttpStatusCode.NOT_FOUND);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = messages_1.ERROR_MESSAGES.GENERAL.CONFLICT_EXISTS) {
        super(message, HttpStatusCode_1.HttpStatusCode.CONFLICT);
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
class ValidationError extends AppError {
    constructor(message = messages_1.ERROR_MESSAGES.GENERAL.VALIDATION_FAILED) {
        super(message, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message = messages_1.ERROR_MESSAGES.GENERAL.UNAUTHORIZED) {
        super(message, HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = messages_1.ERROR_MESSAGES.GENERAL.FORBIDDEN) {
        super(message, HttpStatusCode_1.HttpStatusCode.FORBIDDEN);
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends AppError {
    constructor(message = messages_1.ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR || 'Internal server error') {
        super(message, HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR);
        this.name = 'InternalServerError';
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=AppError.js.map