import { injectable } from 'inversify';
import Stripe from 'stripe';
import { IPaymentGateway, CreatePaymentIntentRequest, CreatePaymentIntentResponse } from '../../domain/services/IPaymentGateway';
import { env } from '../../config/env';

@injectable()
export class StripePaymentGateway implements IPaymentGateway {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-12-15.clover',
        });
    }

    async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> {
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
            clientSecret: paymentIntent.client_secret!,
            paymentIntentId: paymentIntent.id,
        };
    }

    async confirmPayment(paymentIntentId: string): Promise<boolean> {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent.status === 'succeeded';
    }

    async refundPayment(paymentIntentId: string, amount?: number): Promise<boolean> {
        const refund = await this.stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
        });
        return refund.status === 'succeeded';
    }

    async createCustomer(userId: string, email: string, name: string): Promise<string> {
        const customer = await this.stripe.customers.create({
            email,
            name,
            metadata: { userId },
        });
        return customer.id;
    }

    async retrievePaymentIntent(paymentIntentId: string): Promise<any> {
        return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    }
}