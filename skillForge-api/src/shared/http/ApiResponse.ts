

export interface ApiErrorDetails {
  code: string;
  message: string;
  details?: unknown;
  field?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export type ApiSuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: ApiError;
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(
  response: ApiResponse
): response is ApiErrorResponse {
  return response.success === false;
}

