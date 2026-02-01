import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProcessProjectPaymentRequestUseCase } from '../../../application/useCases/admin/interfaces/IProcessProjectPaymentRequestUseCase';
import { IGetPendingPaymentRequestsUseCase } from '../../../application/useCases/admin/interfaces/IGetPendingPaymentRequestsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class ProjectPaymentRequestController {
    constructor(
        @inject(TYPES.IProcessProjectPaymentRequestUseCase) private processUseCase: IProcessProjectPaymentRequestUseCase,
        @inject(TYPES.IGetPendingPaymentRequestsUseCase) private getPendingUseCase: IGetPendingPaymentRequestsUseCase,
        @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
    ) { }

    public getPendingPaymentRequests = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const requests = await this.getPendingUseCase.execute();
            const response = this.responseBuilder.success(requests, 'Pending payment requests fetched successfully', HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public processPaymentRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { approved, notes } = req.body;
            // Assuming admin ID is available in req.user from auth middleware
            const adminId = (req as any).user.id;

            await this.processUseCase.execute(id, adminId, approved, notes);

            const message = approved ? 'Payment request approved and processed' : 'Payment request rejected';
            const response = this.responseBuilder.success(null, message, HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };
}
