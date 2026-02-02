"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserWalletTransactionsRequestSchema = void 0;
const zod_1 = require("zod");
const UserWalletTransaction_1 = require("../../../domain/entities/UserWalletTransaction");
// Request DTO for getting transactions
exports.GetUserWalletTransactionsRequestSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(UserWalletTransaction_1.UserWalletTransactionType).optional(),
    status: zod_1.z.nativeEnum(UserWalletTransaction_1.UserWalletTransactionStatus).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
//# sourceMappingURL=UserWalletTransactionDTO.js.map