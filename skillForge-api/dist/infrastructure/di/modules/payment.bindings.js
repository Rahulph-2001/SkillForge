"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindPaymentModule = void 0;
const types_1 = require("../types");
const CreatePaymentIntentUseCase_1 = require("../../../application/useCases/payment/CreatePaymentIntentUseCase");
const ConfirmPaymentUseCase_1 = require("../../../application/useCases/payment/ConfirmPaymentUseCase");
const HandleWebhookUseCase_1 = require("../../../application/useCases/payment/HandleWebhookUseCase");
const PaymentController_1 = require("../../../presentation/controllers/payment/PaymentController");
const paymentRoutes_1 = require("../../../presentation/routes/payment/paymentRoutes");
/**
 * Binds all payment-related use cases, controllers, and routes
 */
const bindPaymentModule = (container) => {
    // Payment Use Cases
    container.bind(types_1.TYPES.ICreatePaymentIntentUseCase).to(CreatePaymentIntentUseCase_1.CreatePaymentIntentUseCase);
    container.bind(types_1.TYPES.IConfirmPaymentUseCase).to(ConfirmPaymentUseCase_1.ConfirmPaymentUseCase);
    container.bind(types_1.TYPES.IHandleWebhookUseCase).to(HandleWebhookUseCase_1.HandleWebhookUseCase);
    // Controllers & Routes
    container.bind(types_1.TYPES.PaymentController).to(PaymentController_1.PaymentController);
    container.bind(types_1.TYPES.PaymentRoutes).to(paymentRoutes_1.PaymentRoutes);
};
exports.bindPaymentModule = bindPaymentModule;
//# sourceMappingURL=payment.bindings.js.map