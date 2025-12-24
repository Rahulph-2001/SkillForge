"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmPaymentDTOSchema = void 0;
const zod_1 = require("zod");
exports.ConfirmPaymentDTOSchema = zod_1.z.object({
    paymentIntentId: zod_1.z.string().min(1, 'Payment intent ID is required'),
});
//# sourceMappingURL=ConfirmPaymentDTO.js.map