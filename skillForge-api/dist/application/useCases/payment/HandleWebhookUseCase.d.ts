import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { WebhookEventDTO } from '../../dto/payment/WebhookEventDTO';
import { IActivateSubscriptionUseCase } from '../subscription/ActivateSubscriptionUseCase';
import { ICreditAdminWalletUseCase } from '../admin/CreditAdminWalletUseCase';
export interface IHandleWebhookUseCase {
    execute(event: WebhookEventDTO): Promise<void>;
}
export declare class HandleWebhookUseCase implements IHandleWebhookUseCase {
    private paymentRepository;
    private activateSubscriptionUseCase;
    private creditAdminWalletUseCase;
    constructor(paymentRepository: IPaymentRepository, activateSubscriptionUseCase: IActivateSubscriptionUseCase, creditAdminWalletUseCase: ICreditAdminWalletUseCase);
    execute(event: WebhookEventDTO): Promise<void>;
    private handlePaymentSuccess;
    private handleSubscriptionPayment;
    private handlePaymentFailure;
    private handleRefund;
}
//# sourceMappingURL=HandleWebhookUseCase.d.ts.map