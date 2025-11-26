import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { env } from '../../config/env';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isAppError = err instanceof AppError;
  const appError = isAppError ? err as AppError : null;
  let statusCode: HttpStatusCode;
  let message: string;
  
  if (isAppError && appError) {
    statusCode = appError.statusCode;
    message = appError.message;
  } else {
    statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    message = err instanceof Error ? err.message : 'Internal server error';
  }
  console.error('Error:', {
    message,
    name: appError?.name || 'Error',
    status: statusCode,
    isOperational: appError?.isOperational || false,
    stack:
      env.NODE_ENV === 'development'
        ? (err instanceof Error ? err.stack : undefined)
        : undefined,
    path: req.path,
    method: req.method,
  });
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(env.NODE_ENV === 'development' && { 
      stack: err instanceof Error ? err.stack : undefined 
    }),
    ...((req as any).zodDetails && {
      details: (req as any).zodDetails,
    }),
  });
};

import { errorResponse } from '../../shared/http/responseHelpers';

export const notFoundHandler = (req: Request, res: Response): void => {
  const response = errorResponse(
    'NOT_FOUND',
    'Route not found',
    HttpStatusCode.NOT_FOUND,
    { path: req.path }
  );
  res.status(response.statusCode).json(response.body);
};