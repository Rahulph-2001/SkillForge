import { Request, Response, NextFunction } from 'express';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { ICreatePaymentIntentUseCase } from '../../../application/useCases/payment/interfaces/ICreatePaymentIntentUseCase';
import { IConfirmPaymentUseCase } from '../../../application/useCases/payment/interfaces/IConfirmPaymentUseCase';
import { IHandleWebhookUseCase } from '../../../application/useCases/payment/interfaces/IHandleWebhookUseCase';
export declare class PaymentController {
    private responseBuilder;
    private createPaymentIntentUseCase;
    private confirmPaymentUseCase;
    private handleWebhookUseCase;
    private stripe;
    constructor(responseBuilder: IResponseBuilder, createPaymentIntentUseCase: ICreatePaymentIntentUseCase, confirmPaymentUseCase: IConfirmPaymentUseCase, handleWebhookUseCase: IHandleWebhookUseCase);
    createPaymentIntent(req: Request, res: Response, next: NextFunction): Promise<void>;
    confirmPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleWebhook(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PaymentController.d.ts.map