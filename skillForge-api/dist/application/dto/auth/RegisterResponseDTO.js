"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterResponseDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Register Response DTO
 */
exports.RegisterResponseDTOSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    expiresAt: zod_1.z.string().min(1, 'Expiration date is required'),
    message: zod_1.z.string().min(1, 'Message is required'),
});
//# sourceMappingURL=RegisterResponseDTO.js.map