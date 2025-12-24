"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const CreatePaymentIntentDTO_1 = require("../../../application/dto/payment/CreatePaymentIntentDTO");
const ConfirmPaymentDTO_1 = require("../../../application/dto/payment/ConfirmPaymentDTO");
const messages_1 = require("../../../config/messages");
const env_1 = require("../../../config/env");
const stripe_1 = __importDefault(require("stripe"));
let PaymentController = class PaymentController {
    constructor(responseBuilder, createPaymentIntentUseCase, confirmPaymentUseCase, handleWebhookUseCase) {
        this.responseBuilder = responseBuilder;
        this.createPaymentIntentUseCase = createPaymentIntentUseCase;
        this.confirmPaymentUseCase = confirmPaymentUseCase;
        this.handleWebhookUseCase = handleWebhookUseCase;
        this.stripe = new stripe_1.default(env_1.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-12-15.clover',
        });
    }
    async createPaymentIntent(req, res, next) {
        try {
            const userId = req.user.id;
            const validatedData = CreatePaymentIntentDTO_1.CreatePaymentIntentDTOSchema.parse(req.body);
            const result = await this.createPaymentIntentUseCase.execute(userId, validatedData);
            const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.PAYMENT.INTENT_CREATED, HttpStatusCode_1.HttpStatusCode.CREATED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async confirmPayment(req, res, next) {
        try {
            const validatedData = ConfirmPaymentDTO_1.ConfirmPaymentDTOSchema.parse(req.body);
            const result = await this.confirmPaymentUseCase.execute(validatedData);
            const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.PAYMENT.CONFIRMED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async handleWebhook(req, res) {
        try {
            const sig = req.headers['stripe-signature'];
            const event = this.stripe.webhooks.constructEvent(req.body, sig, env_1.env.STRIPE_WEBHOOK_SECRET);
            await this.handleWebhookUseCase.execute(event);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ received: true });
        }
        catch (error) {
            console.error('Webhook error:', error.message);
            res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).send(`Webhook Error: ${error.message}`);
        }
    }
};
exports.PaymentController = PaymentController;
exports.PaymentController = PaymentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICreatePaymentIntentUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IConfirmPaymentUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IHandleWebhookUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], PaymentController);
//# sourceMappingURL=PaymentController.js.map