"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.createdResponse = createdResponse;
exports.noContentResponse = noContentResponse;
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
function successResponse(data, message = 'Operation completed successfully', statusCode = HttpStatusCode_1.HttpStatusCode.OK) {
    const body = {
        success: true,
        message,
        data,
    };
    return {
        statusCode,
        body,
    };
}
function errorResponse(code, message, statusCode = HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, details) {
    const error = {
        code,
        message,
    };
    if (details !== undefined) {
        error.details = details;
    }
    const body = {
        success: false,
        message,
        error,
    };
    return {
        statusCode,
        body,
    };
}
function createdResponse(data, message = 'Resource created successfully') {
    return successResponse(data, message, HttpStatusCode_1.HttpStatusCode.CREATED);
}
function noContentResponse(message = 'Operation completed successfully') {
    return successResponse(null, message, HttpStatusCode_1.HttpStatusCode.NO_CONTENT);
}
//# sourceMappingURL=responseHelpers.js.map