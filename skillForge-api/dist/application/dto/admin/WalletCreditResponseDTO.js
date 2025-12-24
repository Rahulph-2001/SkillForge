"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletCreditResponseSchema = void 0;
const zod_1 = require("zod");
/**
 * Response DTO Schema for admin wallet credit operation
 */
exports.WalletCreditResponseSchema = zod_1.z.object({
    adminId: zod_1.z.string().uuid(),
    previousBalance: zod_1.z.number(),
    creditedAmount: zod_1.z.number(),
    newBalance: zod_1.z.number(),
    currency: zod_1.z.string(),
    source: zod_1.z.string(),
    referenceId: zod_1.z.string(),
    timestamp: zod_1.z.date(),
});
//# sourceMappingURL=WalletCreditResponseDTO.js.map