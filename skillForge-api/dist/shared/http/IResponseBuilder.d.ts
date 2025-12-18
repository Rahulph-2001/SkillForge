import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { ApiResponse } from './ApiResponse';
export interface HttpResponse<T = unknown> {
    statusCode: HttpStatusCode;
    body: ApiResponse<T>;
}
export interface IResponseBuilder {
    /**
     * Builds a success response
     */
    success<T = unknown>(data: T, message?: string, statusCode?: HttpStatusCode): HttpResponse<T>;
    /**
     * Builds an error response
     */
    error(code: string, message: string, statusCode?: HttpStatusCode, details?: unknown): HttpResponse;
    /**
     * Builds a created response (201)
     */
    created<T = unknown>(data: T, message?: string): HttpResponse<T>;
    /**
     * Builds a no content response (204)
     */
    noContent(message?: string): HttpResponse;
}
//# sourceMappingURL=IResponseBuilder.d.ts.map