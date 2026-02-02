"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebitAdminWalletRequestSchema = void 0;
const zod_1 = require("zod");
/**
 * Request DTO Schema for debiting admin wallet
 */
exports.DebitAdminWalletRequestSchema = zod_1.z.object({
    amount: zod_1.z.number().positive('Amount must be positive'),
    currency: zod_1.z.string().length(3, 'Currency must be 3 characters'),
    source: zod_1.z.string().min(1, 'Source is required'),
    referenceId: zod_1.z.string().min(1, 'Reference ID is required'),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
//# sourceMappingURL=DebitAdminWalletDTO.js.map