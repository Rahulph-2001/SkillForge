"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentResponseDTOSchema = void 0;
// src/application/dto/payment/PaymentResponseDTO.ts
const zod_1 = require("zod");
const PaymentEnums_1 = require("../../../domain/enums/PaymentEnums");
exports.PaymentResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid payment ID'),
    userId: zod_1.z.string().uuid('Invalid user ID'),
    provider: zod_1.z.nativeEnum(PaymentEnums_1.PaymentProvider),
    providerPaymentId: zod_1.z.string().optional(),
    providerCustomerId: zod_1.z.string().optional(),
    amount: zod_1.z.number().min(0, 'Amount must be non-negative'),
    currency: zod_1.z.nativeEnum(PaymentEnums_1.Currency),
    purpose: zod_1.z.nativeEnum(PaymentEnums_1.PaymentPurpose),
    status: zod_1.z.nativeEnum(PaymentEnums_1.PaymentStatus),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    failureReason: zod_1.z.string().optional(),
    refundedAmount: zod_1.z.number().min(0).optional(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=PaymentResponseDTO.js.map