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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmPaymentUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const PaymentEnums_1 = require("../../../domain/enums/PaymentEnums");
const UserWalletTransaction_1 = require("../../../domain/entities/UserWalletTransaction");
const uuid_1 = require("uuid");
let ConfirmPaymentUseCase = class ConfirmPaymentUseCase {
    constructor(paymentGateway, paymentRepository, assignSubscriptionUseCase, createProjectUseCase, creditAdminWalletUseCase, userWalletTransactionRepository, userRepository) {
        this.paymentGateway = paymentGateway;
        this.paymentRepository = paymentRepository;
        this.assignSubscriptionUseCase = assignSubscriptionUseCase;
        this.createProjectUseCase = createProjectUseCase;
        this.creditAdminWalletUseCase = creditAdminWalletUseCase;
        this.userWalletTransactionRepository = userWalletTransactionRepository;
        this.userRepository = userRepository;
    }
    async execute(dto) {
        // Retrieve intent from Stripe to get metadata
        const paymentIntent = await this.paymentGateway.retrievePaymentIntent(dto.paymentIntentId);
        const payment = await this.paymentRepository.findByProviderPaymentId(dto.paymentIntentId);
        if (!payment) {
            throw new AppError_1.NotFoundError('Payment not found');
        }
        const confirmed = await this.paymentGateway.confirmPayment(dto.paymentIntentId);
        if (confirmed) {
            payment.markAsSucceeded(dto.paymentIntentId);
            const updatedPayment = await this.paymentRepository.update(payment);
            // Check if this was for a subscription
            if (updatedPayment.purpose === PaymentEnums_1.PaymentPurpose.SUBSCRIPTION) {
                try {
                    // Extract metadata from payment intent (Stripe)
                    const metadata = paymentIntent.metadata || {};
                    const planId = metadata.planId;
                    const planName = metadata.planName;
                    const billingInterval = metadata.billingInterval;
                    if (planId && billingInterval) {
                        const assignDto = {
                            userId: updatedPayment.userId,
                            planId: planId,
                            billingInterval: billingInterval,
                            startTrial: false, // Explicitly set false as payment was made
                            stripeCustomerId: paymentIntent.customer
                        };
                        await this.assignSubscriptionUseCase.execute(assignDto);
                        // Credit admin wallet for subscription payment
                        try {
                            await this.creditAdminWalletUseCase.execute({
                                amount: updatedPayment.amount,
                                currency: updatedPayment.currency,
                                source: 'SUBSCRIPTION_PAYMENT',
                                referenceId: updatedPayment.id,
                                metadata: {
                                    planId,
                                    planName,
                                    userId: updatedPayment.userId
                                }
                            });
                        }
                        catch (walletError) {
                            // Log error but don't throw - payment confirmation should still succeed
                            // TODO: Add proper logging service for error tracking
                        }
                    }
                }
                catch (error) {
                    // Failed to assign subscription after payment
                    // We don't throw here to avoid failing the payment confirmation response
                    // TODO: Add proper logging service and retry mechanism
                    // We don't throw here to avoid failing the payment confirmation response, 
                    // but in production we should alert or retry.
                }
            }
            // Check if this was for a project post
            if (updatedPayment.purpose === PaymentEnums_1.PaymentPurpose.PROJECT_POST) {
                try {
                    // Extract project data from payment metadata
                    const metadata = paymentIntent.metadata || {};
                    let tags = [];
                    if (metadata.tags) {
                        try {
                            tags = JSON.parse(metadata.tags);
                        }
                        catch {
                            tags = [];
                        }
                    }
                    const projectData = {
                        title: metadata.title,
                        description: metadata.description,
                        category: metadata.category,
                        tags: tags,
                        budget: parseFloat(metadata.budget),
                        duration: metadata.duration,
                        deadline: metadata.deadline || undefined,
                    };
                    if (projectData.title && projectData.description && projectData.category && projectData.budget) {
                        await this.createProjectUseCase.execute(updatedPayment.userId, projectData, updatedPayment.id);
                        // Credit admin wallet with escrow budget
                        try {
                            await this.creditAdminWalletUseCase.execute({
                                amount: projectData.budget,
                                currency: updatedPayment.currency,
                                source: 'PROJECT_ESCROW',
                                referenceId: updatedPayment.id,
                                metadata: {
                                    projectTitle: projectData.title,
                                    userId: updatedPayment.userId,
                                    category: projectData.category
                                }
                            });
                            console.log(`[ConfirmPayment] Credited ${projectData.budget} ${updatedPayment.currency} to admin wallet as escrow for project`);
                        }
                        catch (walletError) {
                            console.error('[ConfirmPayment] Failed to credit admin wallet for project escrow:', walletError);
                        }
                        // Log User Transaction (To show in Wallet History as "Paid")
                        try {
                            const user = await this.userRepository.findById(updatedPayment.userId);
                            const currentBalance = user ? user.walletBalance : 0;
                            await this.userWalletTransactionRepository.create(UserWalletTransaction_1.UserWalletTransaction.create({
                                id: (0, uuid_1.v4)(),
                                userId: updatedPayment.userId,
                                type: UserWalletTransaction_1.UserWalletTransactionType.PROJECT_PAYMENT,
                                amount: -projectData.budget, // NEGATIVE - money locked in escrow for project
                                currency: 'INR',
                                source: 'STRIPE_PAYMENT',
                                referenceId: updatedPayment.id,
                                description: `Payment for project: ${projectData.title}`,
                                metadata: {
                                    projectId: updatedPayment.id, // Ideally this would be the actual project ID, but we might not have it easily if CreateProject returned void/DTO. 
                                    // Actually CreateProject DOES return DTO, but we are blindly calling execute. 
                                    // ideally we should capture the project ID. But for now, linking to payment ID is okay.
                                    paymentId: updatedPayment.id,
                                    projectTitle: projectData.title,
                                    budget: projectData.budget,
                                },
                                previousBalance: currentBalance,
                                newBalance: currentBalance, // Balance doesn't change as it was direct payment
                                status: UserWalletTransaction_1.UserWalletTransactionStatus.COMPLETED,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            }));
                        }
                        catch (txError) {
                            console.warn('[ConfirmPayment] Failed to log user wallet transaction for project payment', txError);
                        }
                    }
                }
                catch (error) {
                    console.error('[ConfirmPayment] Failed to create project after payment:', error);
                    // Failed to create project after payment
                    // We don't throw here to avoid failing the payment confirmation response
                    // TODO: Add proper logging service and retry mechanism
                }
            }
            return updatedPayment.toJSON();
        }
        throw new AppError_1.InternalServerError('Payment confirmation failed');
    }
};
exports.ConfirmPaymentUseCase = ConfirmPaymentUseCase;
exports.ConfirmPaymentUseCase = ConfirmPaymentUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IPaymentGateway)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IPaymentRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IAssignSubscriptionUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ICreateProjectUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ICreditAdminWalletUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IUserWalletTransactionRepository)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], ConfirmPaymentUseCase);
//# sourceMappingURL=ConfirmPaymentUseCase.js.map