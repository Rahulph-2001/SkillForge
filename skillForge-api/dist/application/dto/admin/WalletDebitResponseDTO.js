"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletDebitResponseSchema = void 0;
const zod_1 = require("zod");
/**
 * Response DTO Schema for admin wallet debit operation
 */
exports.WalletDebitResponseSchema = zod_1.z.object({
    adminId: zod_1.z.string().uuid(),
    previousBalance: zod_1.z.number(),
    debitedAmount: zod_1.z.number(),
    newBalance: zod_1.z.number(),
    currency: zod_1.z.string(),
    source: zod_1.z.string(),
    referenceId: zod_1.z.string(),
    timestamp: zod_1.z.date(),
});
//# sourceMappingURL=WalletDebitResponseDTO.js.map