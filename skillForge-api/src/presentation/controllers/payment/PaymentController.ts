import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder'
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { ICreatePaymentIntentUseCase } from '../../../application/useCases/payment/interfaces/ICreatePaymentIntentUseCase';
import { IConfirmPaymentUseCase } from '../../../application/useCases/payment/interfaces/IConfirmPaymentUseCase';
import { IHandleWebhookUseCase } from '../../../application/useCases/payment/interfaces/IHandleWebhookUseCase';
import { CreatePaymentIntentDTOSchema } from '../../../application/dto/payment/CreatePaymentIntentDTO';
import { ConfirmPaymentDTOSchema } from '../../../application/dto/payment/ConfirmPaymentDTO';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../config/messages';
import { env } from '../../../config/env';
import Stripe from 'stripe';

@injectable()
export class PaymentController {
    private stripe: Stripe;

    constructor(
        @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder,
        @inject(TYPES.ICreatePaymentIntentUseCase) private createPaymentIntentUseCase: ICreatePaymentIntentUseCase,
        @inject(TYPES.IConfirmPaymentUseCase) private confirmPaymentUseCase: IConfirmPaymentUseCase,
        @inject(TYPES.IHandleWebhookUseCase) private handleWebhookUseCase: IHandleWebhookUseCase
    ) {
        this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-12-15.clover',
        });
    }

    async createPaymentIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const validatedData = CreatePaymentIntentDTOSchema.parse(req.body);
            const result = await this.createPaymentIntentUseCase.execute(userId, validatedData);

            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.PAYMENT.INTENT_CREATED,
                HttpStatusCode.CREATED
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    }

    async confirmPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = ConfirmPaymentDTOSchema.parse(req.body);
            const result = await this.confirmPaymentUseCase.execute(validatedData);

            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.PAYMENT.CONFIRMED,
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    }

    async handleWebhook(req: Request, res: Response): Promise<void> {
        try {
            const sig = req.headers['stripe-signature'] as string;

            const event = this.stripe.webhooks.constructEvent(
                req.body,
                sig,
                env.STRIPE_WEBHOOK_SECRET
            );
            await this.handleWebhookUseCase.execute(event);

            res.status(HttpStatusCode.OK).json({ received: true });
        } catch (error: any) {
            console.error('Webhook error:', error.message);
            res.status(HttpStatusCode.BAD_REQUEST).send(`Webhook Error: ${error.message}`);
        }
    }
}