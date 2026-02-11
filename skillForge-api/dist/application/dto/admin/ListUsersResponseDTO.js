"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersResponseDTOSchema = exports.PaginationMetadataSchema = void 0;
const zod_1 = require("zod");
const UserAdminDTO_1 = require("./UserAdminDTO");
exports.PaginationMetadataSchema = zod_1.z.object({
    total: zod_1.z.number().int().nonnegative(),
    page: zod_1.z.number().int().positive(),
    limit: zod_1.z.number().int().positive(),
    totalPages: zod_1.z.number().int().nonnegative(),
    hasNextPage: zod_1.z.boolean(),
    hasPreviousPage: zod_1.z.boolean(),
});
exports.ListUsersResponseDTOSchema = zod_1.z.object({
    users: zod_1.z.array(UserAdminDTO_1.UserAdminDTOSchema),
    pagination: exports.PaginationMetadataSchema,
});
//# sourceMappingURL=ListUsersResponseDTO.js.map