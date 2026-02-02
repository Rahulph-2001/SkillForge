"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWalletTransactionsResponseSchema = exports.WalletTransactionSchema = void 0;
const zod_1 = require("zod");
exports.WalletTransactionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    transactionId: zod_1.z.string(),
    userId: zod_1.z.string(),
    userName: zod_1.z.string(),
    userEmail: zod_1.z.string(),
    type: zod_1.z.enum(['CREDIT', 'WITHDRAWAL', 'DEBIT']),
    amount: zod_1.z.number(),
    description: zod_1.z.string(),
    date: zod_1.z.date(),
    status: zod_1.z.enum(['COMPLETED', 'PENDING', 'FAILED']),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
exports.GetWalletTransactionsResponseSchema = zod_1.z.object({
    transactions: zod_1.z.array(exports.WalletTransactionSchema),
    total: zod_1.z.number(),
    page: zod_1.z.number(),
    limit: zod_1.z.number(),
    totalPages: zod_1.z.number(),
});
//# sourceMappingURL=GetWalletTransactionsDTO.js.map