"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditPackageResponseSchema = exports.UpdateCreditPackageSchema = exports.CreateCreditPackageSchema = void 0;
const zod_1 = require("zod");
// Create DTO
exports.CreateCreditPackageSchema = zod_1.z.object({
    credits: zod_1.z.number().int().min(1, 'Credits must be at least 1'),
    price: zod_1.z.number().min(0, 'Price cannot be negative'),
    isPopular: zod_1.z.boolean().default(false),
    isActive: zod_1.z.boolean().default(true),
    // discount field deliberately excluded from schema as per requirements
});
// Update DTO
exports.UpdateCreditPackageSchema = zod_1.z.object({
    credits: zod_1.z.number().int().min(1).optional(),
    price: zod_1.z.number().min(0).optional(),
    isPopular: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
    // discount: z.number().min(0).max(100).optional(), // Can verify later if needed
});
// Response DTO
exports.CreditPackageResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    credits: zod_1.z.number(),
    price: zod_1.z.number(),
    isPopular: zod_1.z.boolean(),
    isActive: zod_1.z.boolean(),
    discount: zod_1.z.number(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=CreditPackageDTO.js.map