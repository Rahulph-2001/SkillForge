"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersResponseDTOSchema = void 0;
const zod_1 = require("zod");
const UserAdminDTO_1 = require("./UserAdminDTO");
/**
 * Zod schema for List Users Response DTO
 */
exports.ListUsersResponseDTOSchema = zod_1.z.object({
    users: zod_1.z.array(UserAdminDTO_1.UserAdminDTOSchema),
    total: zod_1.z.number().int().min(0, 'Total must be non-negative'),
});
//# sourceMappingURL=ListUsersResponseDTO.js.map