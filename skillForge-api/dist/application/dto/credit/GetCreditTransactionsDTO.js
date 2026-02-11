"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCreditTransactionsResponseSchema = exports.CreditTransactionSchema = exports.GetCreditTransactionsRequestSchema = void 0;
const zod_1 = require("zod");
exports.GetCreditTransactionsRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['CREDIT_PURCHASE', 'SESSION_PAYMENT', 'SESSION_EARNING', 'PROJECT_EARNING']).optional(),
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(10),
});
exports.CreditTransactionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: zod_1.z.string(),
    amount: zod_1.z.number(),
    credits: zod_1.z.number().int().optional(),
    description: zod_1.z.string().nullable(),
    status: zod_1.z.enum(['COMPLETED', 'PENDING', 'FAILED']),
    createdAt: zod_1.z.string(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).nullable(),
});
exports.GetCreditTransactionsResponseSchema = zod_1.z.object({
    transactions: zod_1.z.array(exports.CreditTransactionSchema),
    pagination: zod_1.z.object({
        total: zod_1.z.number().int().min(0),
        page: zod_1.z.number().int().min(1),
        limit: zod_1.z.number().int().min(1),
        totalPages: zod_1.z.number().int().min(0),
    }),
    stats: zod_1.z.object({
        totalEarned: zod_1.z.number().int().min(0),
        totalSpent: zod_1.z.number().int().min(0),
        totalPurchased: zod_1.z.number().int().min(0),
    }),
});
//# sourceMappingURL=GetCreditTransactionsDTO.js.map