"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserCreditPackagesResponseSchema = exports.UserCreditPackageSchema = void 0;
const zod_1 = require("zod");
exports.UserCreditPackageSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    credits: zod_1.z.number().int().positive(),
    price: zod_1.z.number().positive(),
    isPopular: zod_1.z.boolean(),
    discount: zod_1.z.number().int().min(0).max(100),
    finalPrice: zod_1.z.number().positive(),
    savingsAmount: zod_1.z.number().min(0),
});
exports.GetUserCreditPackagesResponseSchema = zod_1.z.object({
    packages: zod_1.z.array(exports.UserCreditPackageSchema),
});
//# sourceMappingURL=GetUserCreditPackagesDTO.js.map