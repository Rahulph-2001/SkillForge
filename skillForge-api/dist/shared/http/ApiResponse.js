"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuccessResponse = isSuccessResponse;
exports.isErrorResponse = isErrorResponse;
/**
 * Type guard to check if response is successful
 */
function isSuccessResponse(response) {
    return response.success === true;
}
/**
 * Type guard to check if response is an error
 */
function isErrorResponse(response) {
    return response.success === false;
}
//# sourceMappingURL=ApiResponse.js.map