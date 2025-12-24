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
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const PaymentController_1 = require("../../controllers/payment/PaymentController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const express_2 = __importDefault(require("express"));
let PaymentRoutes = class PaymentRoutes {
    constructor(paymentController) {
        this.paymentController = paymentController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // POST /api/v1/payments/create-intent
        this.router.post('/create-intent', authMiddleware_1.authMiddleware, (req, res, next) => this.paymentController.createPaymentIntent(req, res, next));
        // POST /api/v1/payments/confirm
        this.router.post('/confirm', authMiddleware_1.authMiddleware, (req, res, next) => this.paymentController.confirmPayment(req, res, next));
        // POST /api/v1/payments/webhook
        // Note: Webhook needs raw body for Stripe signature verification
        this.router.post('/webhook', express_2.default.raw({ type: 'application/json' }), (req, res) => this.paymentController.handleWebhook(req, res));
    }
    getRouter() {
        return this.router;
    }
};
exports.PaymentRoutes = PaymentRoutes;
exports.PaymentRoutes = PaymentRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PaymentController)),
    __metadata("design:paramtypes", [PaymentController_1.PaymentController])
], PaymentRoutes);
//# sourceMappingURL=paymentRoutes.js.map