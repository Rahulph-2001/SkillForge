import { AppError } from "./AppError";
import { HttpStatusCode } from "../enums/HttpStatusCode";
export declare class FileProcessingError extends AppError {
    readonly details: any;
    readonly appCode: string;
    constructor(message: string, details?: any, httpCode?: HttpStatusCode, appCode?: string);
}
export declare class InvalidFileFormatError extends FileProcessingError {
    constructor(message: string);
}
//# sourceMappingURL=FileProcessingError.d.ts.map