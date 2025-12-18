"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeUseCase = exports.asyncHandler = void 0;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const executeUseCase = async (fn) => {
    try {
        return await fn();
    }
    catch (error) {
        // Re-throw to let error middleware handle it
        throw error;
    }
};
exports.executeUseCase = executeUseCase;
//# sourceMappingURL=asyncHandler.js.map