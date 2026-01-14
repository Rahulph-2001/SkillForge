import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IAdminListSessionsUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminListSessionsUseCase';
import { IAdminGetSessionStatsUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminGetSessionStatsUseCase';
import { IAdminCancelSessionUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminCancelSessionUseCase';
import { IAdminCompleteSessionUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminCompleteSessionUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class AdminSessionController {
    constructor(
        @inject(TYPES.IAdminListSessionsUseCase) private adminListSessionsUseCase: IAdminListSessionsUseCase,
        @inject(TYPES.IAdminGetSessionStatsUseCase) private adminGetSessionStatsUseCase: IAdminGetSessionStatsUseCase,
        @inject(TYPES.IAdminCancelSessionUseCase) private adminCancelSessionUseCase: IAdminCancelSessionUseCase,
        @inject(TYPES.IAdminCompleteSessionUseCase) private adminCompleteSessionUseCase: IAdminCompleteSessionUseCase,
        @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
    ) { }

    public listSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const search = req.query.search as string;

            const result = await this.adminListSessionsUseCase.execute(page, limit, search);

            const response = this.responseBuilder.success(result, 'Sessions listed successfully', HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const stats = await this.adminGetSessionStatsUseCase.execute();

            const response = this.responseBuilder.success(stats, 'Session stats fetched successfully', HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public cancelSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            const result = await this.adminCancelSessionUseCase.execute(id, reason || 'Cancelled by admin');

            const response = this.responseBuilder.success(result, 'Session cancelled successfully', HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public completeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            const result = await this.adminCompleteSessionUseCase.execute(id);

            const response = this.responseBuilder.success(result, 'Session marked as completed successfully', HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };
}
