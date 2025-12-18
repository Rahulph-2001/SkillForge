"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidFileFormatError = exports.FileProcessingError = void 0;
const AppError_1 = require("./AppError");
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
class FileProcessingError extends AppError_1.AppError {
    constructor(message, details = {}, httpCode = HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, appCode = 'FILE_001') {
        super(message, httpCode);
        this.name = 'FileProcessingError';
        this.details = details;
        this.appCode = appCode;
    }
}
exports.FileProcessingError = FileProcessingError;
class InvalidFileFormatError extends FileProcessingError {
    constructor(message) {
        super(message, {}, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, 'FILE_002');
        this.name = 'InvalidFileFormatError';
    }
}
exports.InvalidFileFormatError = InvalidFileFormatError;
//# sourceMappingURL=FileProcessingError.js.map