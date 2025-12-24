import { IPaymentGateway, CreatePaymentIntentRequest, CreatePaymentIntentResponse } from '../../domain/services/IPaymentGateway';
export declare class StripePaymentGateway implements IPaymentGateway {
    private stripe;
    constructor();
    createPaymentIntent(request: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse>;
    confirmPayment(paymentIntentId: string): Promise<boolean>;
    refundPayment(paymentIntentId: string, amount?: number): Promise<boolean>;
    createCustomer(userId: string, email: string, name: string): Promise<string>;
    retrievePaymentIntent(paymentIntentId: string): Promise<any>;
}
//# sourceMappingURL=StripePaymentGateway.d.ts.map