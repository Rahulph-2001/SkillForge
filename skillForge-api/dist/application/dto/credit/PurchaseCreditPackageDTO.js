"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseCreditPackageResponseSchema = exports.PurchaseCreditPackageRequestSchema = void 0;
const zod_1 = require("zod");
exports.PurchaseCreditPackageRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
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