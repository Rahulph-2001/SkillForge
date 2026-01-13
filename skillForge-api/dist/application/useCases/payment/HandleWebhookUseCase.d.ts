import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { WebhookEventDTO } from '../../dto/payment/WebhookEventDTO';
import { IHandleWebhookUseCase } from './interfaces/IHandleWebhookUseCase';
import { IActivateSubscriptionUseCase } from '../subscription/interfaces/IActivateSubscriptionUseCase';
import { ICreditAdminWalletUseCase } from '../admin/interfaces/ICreditAdminWalletUseCase';
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