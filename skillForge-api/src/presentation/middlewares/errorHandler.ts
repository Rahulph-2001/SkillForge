
import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { env } from '../../config/env';
import { logger } from '../../config/logger';


interface ErrorResponse {
  success: boolean;
  message: string;
  error: string;
  details?: unknown;
}

interface RequestWithZodDetails extends Request {
  zodDetails?: unknown;
}


export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isAppError = err instanceof AppError;
  const appError = isAppError ? err : null;

  let statusCode: HttpStatusCode;
  let errorCode: string;
  let message: string;
  let details: unknown = undefined;

  if (isAppError && appError) {
    statusCode = appError.statusCode;
    errorCode = appError.name || 'APP_ERROR';
    message = appError.message;

    // Include validation details if available
    const reqWithDetails = req as RequestWithZodDetails;
    if (reqWithDetails.zodDetails) {
      details = reqWithDetails.zodDetails;
    }
  } else {
    statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    errorCode = 'INTERNAL_SERVER_ERROR';
    message = err instanceof Error ? err.message : 'Internal server error';

    // Only include stack in development
    if (env.NODE_ENV === 'development' && err instanceof Error) {
      details = { stack: err.stack };
    }
  }

  // Log error
  logger.error(
    {
      errorCode,
      statusCode,
      path: req.path,
      method: req.method,
      err: err instanceof Error ? err : undefined,
    },
    message
  );

  // Build and send error response with simplified structure for frontend
  const responseBody: ErrorResponse = {
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

/**
 * Handler for 404 Not Found errors
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ErrorResponse = {
    success: false,
    message: 'Route not found',
    error: `Route ${req.method} ${req.path} not found`,
    details: { path: req.path, method: req.method },
  };

  res.status(HttpStatusCode.NOT_FOUND).json(response);
};

/**
 * Async error handler wrapper for route handlers
 * Catches async errors and passes them to the error handler
 */
export const wrapAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};