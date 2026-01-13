"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdminWalletRequestSchema = void 0;
const zod_1 = require("zod");
exports.CreateAdminWalletRequestSchema = zod_1.z.object({
    amount: zod_1.z.number().positive('Amount must be positive'),
    currency: zod_1.z.string().length(3, 'Currency must be 3 charcters'),
    source: zod_1.z.string().min(1, 'Source is required'),
    description: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
//# sourceMappingURL=CreateAdminWalletDTO.js.map