"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationResponseSchema = void 0;
const zod_1 = require("zod");
const PaginationResponseSchema = (itemSchema) => zod_1.z.object({
    data: zod_1.z.array(itemSchema),
    total: zod_1.z.number().int().nonnegative(),
    page: zod_1.z.number().int().positive(),
    limit: zod_1.z.number().int().positive(),
    totalPages: zod_1.z.number().int().nonnegative(),
    hasNextPage: zod_1.z.boolean(),
    hasPreviousPage: zod_1.z.boolean(),
});
exports.PaginationResponseSchema = PaginationResponseSchema;
//# sourceMappingURL=PaginationResponseDTO.js.map