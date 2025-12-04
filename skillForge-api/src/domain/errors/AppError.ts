import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ERROR_MESSAGES } from '../../config/messages';

export abstract class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.GENERAL.RESOURCE_NOT_FOUND) {
    super(message, HttpStatusCode.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = ERROR_MESSAGES.GENERAL.CONFLICT_EXISTS) {
    super(message, HttpStatusCode.CONFLICT);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.GENERAL.VALIDATION_FAILED) {
    super(message, HttpStatusCode.BAD_REQUEST);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = ERROR_MESSAGES.GENERAL.UNAUTHORIZED) {
    super(message, HttpStatusCode.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = ERROR_MESSAGES.GENERAL.FORBIDDEN) {
    super(message, HttpStatusCode.FORBIDDEN);
    this.name = 'ForbiddenError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR || 'Internal server error') {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
    this.name = 'InternalServerError';
  }
}
