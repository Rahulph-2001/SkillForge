"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseDTOSchema = void 0;
const zod_1 = require("zod");
const UserResponseDTO_1 = require("./UserResponseDTO");
/**
 * Zod schema for Login Response DTO
 */
exports.LoginResponseDTOSchema = zod_1.z.object({
    user: UserResponseDTO_1.UserResponseDTOSchema,
    token: zod_1.z.string().min(1, 'Token is required'),
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
//# sourceMappingURL=LoginResponseDTO.js.map