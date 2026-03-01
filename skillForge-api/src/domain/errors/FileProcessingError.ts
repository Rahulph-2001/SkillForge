
import { AppError } from "./AppError";
import { HttpStatusCode } from "../enums/HttpStatusCode";

export class FileProcessingError extends AppError {
    public readonly details: Record<string, unknown>;
    public readonly appCode: string;

    constructor(
        message: string,
        details: Record<string, unknown> = {},
        httpCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST,
        appCode: string = 'FILE_001'
    ) {
        super(message, httpCode);
        this.name = 'FileProcessingError';
        this.details = details;
        this.appCode = appCode;
    }
}

export class InvalidFileFormatError extends FileProcessingError {
    constructor(message: string) {
        super(message, {}, HttpStatusCode.BAD_REQUEST, 'FILE_002');
        this.name = 'InvalidFileFormatError';
    }
}