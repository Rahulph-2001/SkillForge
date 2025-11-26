

import { injectable } from 'inversify';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { IResponseBuilder, HttpResponse } from './IResponseBuilder';
import {
  successResponse,
  errorResponse,
  createdResponse,
  noContentResponse,
} from './responseHelpers';

@injectable()
export class ResponseBuilder implements IResponseBuilder {
  success<T = unknown>(
    data: T,
    message: string = 'Operation completed successfully',
    statusCode: HttpStatusCode = HttpStatusCode.OK
  ): HttpResponse<T> {
    return successResponse(data, message, statusCode);
  }

  error(
    code: string,
    message: string,
    statusCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST,
    details?: unknown
  ): HttpResponse {
    return errorResponse(code, message, statusCode, details);
  }

  created<T = unknown>(
    data: T,
    message: string = 'Resource created successfully'
  ): HttpResponse<T> {
    return createdResponse(data, message);
  }

  noContent(message: string = 'Operation completed successfully'): HttpResponse {
    return noContentResponse(message);
  }
}

