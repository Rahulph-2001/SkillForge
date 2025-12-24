"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentIntentResponseDTOSchema = void 0;
const zod_1 = require("zod");
exports.CreatePaymentIntentResponseDTOSchema = zod_1.z.object({
    clientSecret: zod_1.z.string().min(1, 'Client secret is required'),
    paymentIntentId: zod_1.z.string().min(1, 'Payment intent ID is required'),
    paymentId: zod_1.z.string().uuid('Invalid payment ID'),
});
//# sourceMappingURL=CreatePaymentIntentResponseDTO.js.map