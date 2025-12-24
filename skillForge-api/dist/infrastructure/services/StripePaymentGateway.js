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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePaymentGateway = void 0;
const inversify_1 = require("inversify");
const stripe_1 = __importDefault(require("stripe"));
const env_1 = require("../../config/env");
let StripePaymentGateway = class StripePaymentGateway {
    constructor() {
        this.stripe = new stripe_1.default(env_1.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-12-15.clover',
        });
    }
    async createPaymentIntent(request) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(request.amount * 100),
            currency: request.currency.toLowerCase(),
            metadata: {
                userId: request.userId,
                purpose: request.purpose,
                ...request.metadata,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
    }
    async confirmPayment(paymentIntentId) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent.status === 'succeeded';
    }
    async refundPayment(paymentIntentId, amount) {
        const refund = await this.stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
        });
        return refund.status === 'succeeded';
    }
    async createCustomer(userId, email, name) {
        const customer = await this.stripe.customers.create({
            email,
            name,
            metadata: { userId },
        });
        return customer.id;
    }
    async retrievePaymentIntent(paymentIntentId) {
        return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    }
};
exports.StripePaymentGateway = StripePaymentGateway;
exports.StripePaymentGateway = StripePaymentGateway = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], StripePaymentGateway);
//# sourceMappingURL=StripePaymentGateway.js.map