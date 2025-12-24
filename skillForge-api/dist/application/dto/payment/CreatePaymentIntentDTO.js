"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentIntentDTOSchema = void 0;
const zod_1 = require("zod");
const PaymentEnums_1 = require("../../../domain/enums/PaymentEnums");
exports.CreatePaymentIntentDTOSchema = zod_1.z.object({
    amount: zod_1.z.number().min(1, 'Amount must be at least 1'),
    currency: zod_1.z.nativeEnum(PaymentEnums_1.Currency).default(PaymentEnums_1.Currency.INR),
    purpose: zod_1.z.nativeEnum(PaymentEnums_1.PaymentPurpose),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
//# sourceMappingURL=CreatePaymentIntentDTO.js.map