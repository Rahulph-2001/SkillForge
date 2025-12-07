import { HttpStatusCode } from '../enums/HttpStatusCode';
export declare abstract class AppError extends Error {
    readonly statusCode: HttpStatusCode;
    readonly status: string;
    readonly isOperational: boolean;
    constructor(message: string, statusCode?: HttpStatusCode);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
export declare class ValidationError extends AppError {
    constructor(message?: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class InternalServerError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=AppError.d.ts.map