import { Request, Response, NextFunction } from 'express';
import { IProcessProjectPaymentRequestUseCase } from '../../../application/useCases/admin/interfaces/IProcessProjectPaymentRequestUseCase';
import { IGetPendingPaymentRequestsUseCase } from '../../../application/useCases/admin/interfaces/IGetPendingPaymentRequestsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class ProjectPaymentRequestController {
    private processUseCase;
    private getPendingUseCase;
    private responseBuilder;
    constructor(processUseCase: IProcessProjectPaymentRequestUseCase, getPendingUseCase: IGetPendingPaymentRequestsUseCase, responseBuilder: IResponseBuilder);
    getPendingPaymentRequests: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    processPaymentRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ProjectPaymentRequestController.d.ts.map