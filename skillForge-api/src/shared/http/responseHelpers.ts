

import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from './ApiResponse';

export interface HttpResponse<T = unknown> {
  statusCode: HttpStatusCode;
  body: ApiResponse<T>;
}


export function successResponse<T = unknown>(
  data: T,
  message: string = 'Operation completed successfully',
  statusCode: HttpStatusCode = HttpStatusCode.OK
): HttpResponse<T> {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  return {
    statusCode,
    body,
  };
}


export function errorResponse(
  code: string,
  message: string,
  statusCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST,
  details?: unknown
): HttpResponse {
  const error: { code: string; message: string; details?: unknown } = {
    code,
    message,
  };
  
  if (details !== undefined) {
    error.details = details;
  }
  
  const body: ApiErrorResponse = {
    success: false,
    message,
    error,
  };

  return {
    statusCode,
    body,
  };
}


export function createdResponse<T = unknown>(
  data: T,
  message: string = 'Resource created successfully'
): HttpResponse<T> {
  return successResponse(data, message, HttpStatusCode.CREATED);
}


export function noContentResponse(
  message: string = 'Operation completed successfully'
): HttpResponse {
  return successResponse(null, message, HttpStatusCode.NO_CONTENT);
}

