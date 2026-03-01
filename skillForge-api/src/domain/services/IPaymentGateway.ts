// src/domain/services/IPaymentGateway.ts
import { type PaymentPurpose, type Currency } from '../enums/PaymentEnums';

export interface CreatePaymentIntentRequest {
    amount: number;
    currency: Currency;
    userId: string;
    purpose: PaymentPurpose;
    metadata?: Record<string, unknown>;
}

export interface CreatePaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
}

export interface IPaymentGateway {
    createPaymentIntent(request: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse>;
    confirmPayment(paymentIntentId: string): Promise<boolean>;
    refundPayment(paymentIntentId: string, amount?: number): Promise<boolean>;
    createCustomer(userId: string, email: string, name: string): Promise<string>;
    retrievePaymentIntent(paymentIntentId: string): Promise<Record<string, unknown>>;
}