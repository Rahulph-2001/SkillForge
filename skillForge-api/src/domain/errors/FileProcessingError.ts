
import { AppError } from "./AppError";
import { HttpStatusCode } from "../enums/HttpStatusCode";

export class FileProcessingError extends AppError {
    public readonly details: any;
    public readonly appCode: string;

    constructor(
        message: string,
        details: any = {},
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