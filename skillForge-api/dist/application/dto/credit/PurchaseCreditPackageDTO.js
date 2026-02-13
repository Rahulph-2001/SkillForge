"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseCreditPackageResponseSchema = exports.PurchaseCreditPackageBodySchema = exports.PurchaseCreditPackageRequestSchema = void 0;
const zod_1 = require("zod");
// Schema for the complete request (used by use case)
exports.PurchaseCreditPackageRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    packageId: zod_1.z.string().uuid(),
    paymentIntentId: zod_1.z.string(),
});
// Schema for body validation (userId comes from auth middleware)
exports.PurchaseCreditPackageBodySchema = zod_1.z.object({
    packageId: zod_1.z.string().uuid(),
    paymentIntentId: zod_1.z.string(),
});
exports.PurchaseCreditPackageResponseSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    creditsAdded: zod_1.z.number().int().positive(),
    newCreditBalance: zod_1.z.number().int().min(0),
    amountPaid: zod_1.z.number().positive(),
    status: zod_1.z.enum(['COMPLETED', 'PENDING', 'FAILED']),
    createdAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=PurchaseCreditPackageDTO.js.map