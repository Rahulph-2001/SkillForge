import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { ApiResponse } from './ApiResponse';
export interface HttpResponse<T = unknown> {
    statusCode: HttpStatusCode;
    body: ApiResponse<T>;
}
export declare function successResponse<T = unknown>(data: T, message?: string, statusCode?: HttpStatusCode): HttpResponse<T>;
export declare function errorResponse(code: string, message: string, statusCode?: HttpStatusCode, details?: unknown): HttpResponse;
export declare function createdResponse<T = unknown>(data: T, message?: string): HttpResponse<T>;
export declare function noContentResponse(message?: string): HttpResponse;
//# sourceMappingURL=responseHelpers.d.ts.map