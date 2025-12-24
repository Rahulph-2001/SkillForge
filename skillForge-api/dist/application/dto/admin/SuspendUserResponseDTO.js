"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuspendUserResponseDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Suspend User Response DTO
 */
exports.SuspendUserResponseDTOSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string().min(1, 'Message is required'),
});
//# sourceMappingURL=SuspendUserResponseDTO.js.map