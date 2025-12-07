import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { IResponseBuilder, HttpResponse } from './IResponseBuilder';
export declare class ResponseBuilder implements IResponseBuilder {
    success<T = unknown>(data: T, message?: string, statusCode?: HttpStatusCode): HttpResponse<T>;
    error(code: string, message: string, statusCode?: HttpStatusCode, details?: unknown): HttpResponse;
    created<T = unknown>(data: T, message?: string): HttpResponse<T>;
    noContent(message?: string): HttpResponse;
}
//# sourceMappingURL=ResponseBuilder.d.ts.map