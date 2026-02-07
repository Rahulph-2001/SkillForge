import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IAdminListProjectsUseCase } from '../../../application/useCases/admin/interfaces/IAdminListProjectsUseCase';
import { IAdminGetProjectStatsUseCase } from '../../../application/useCases/admin/interfaces/IAdminGetProjectStatsUseCase';
import { IAdminGetProjectDetailsUseCase } from '../../../application/useCases/admin/interfaces/IAdminGetProjectDetailsUseCase';
import { IAdminSuspendProjectUseCase } from '../../../application/useCases/admin/interfaces/IAdminSuspendProjectUseCase';
import { IProcessProjectPaymentRequestUseCase } from '../../../application/useCases/admin/interfaces/IProcessProjectPaymentRequestUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { AdminSuspendProjectRequestDTOSchema } from '../../../application/dto/admin/AdminSuspendProjectDTO';

@injectable()
export class AdminProjectController {
    constructor(
        @inject(TYPES.IAdminListProjectsUseCase) private readonly listProjectsUseCase: IAdminListProjectsUseCase,
        @inject(TYPES.IAdminGetProjectStatsUseCase) private readonly getProjectStatsUseCase: IAdminGetProjectStatsUseCase,
        @inject(TYPES.IAdminGetProjectDetailsUseCase) private readonly getProjectDetailsUseCase: IAdminGetProjectDetailsUseCase,
        @inject(TYPES.IAdminSuspendProjectUseCase) private readonly suspendProjectUseCase: IAdminSuspendProjectUseCase,
        @inject(TYPES.IProcessProjectPaymentRequestUseCase) private readonly processPaymentRequestUseCase: IProcessProjectPaymentRequestUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    public processPaymentRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { requestId } = req.params;
            const { approved, notes, overrideAction } = req.body;
            const adminId = (req as any).user.id; // From auth middleware

            await this.processPaymentRequestUseCase.execute(requestId, adminId, approved, notes, overrideAction);

            const response = this.responseBuilder.success(
                null,
                approved ? 'Payment request approved successfully' : 'Payment request rejected successfully',
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public listProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const search = req.query.search as string | undefined;
            const status = req.query.status as 'Open' | 'In_Progress' | 'Pending_Completion' | 'Payment_Pending' | 'Refund_Pending' | 'Completed' | 'Cancelled' | undefined;
            const category = req.query.category as string | undefined;
            const isSuspended = req.query.isSuspended === 'true' ? true : req.query.isSuspended === 'false' ? false : undefined;

            const result = await this.listProjectsUseCase.execute({
                page,
                limit,
                search,
                status,
                category,
                isSuspended
            });

            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.PROJECT.FETCHED,
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public getProjectStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const stats = await this.getProjectStatsUseCase.execute();

            const response = this.responseBuilder.success(
                stats,
                'Project statistics retrieved successfully',
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public getProjectDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { projectId } = req.params;

            const details = await this.getProjectDetailsUseCase.execute(projectId);

            const response = this.responseBuilder.success(
                details,
                SUCCESS_MESSAGES.PROJECT.DETAILS_FETCHED,
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public suspendProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { projectId } = req.params;
            const adminId = (req as any).user.id;

            const validated = AdminSuspendProjectRequestDTOSchema.parse(req.body);

            const result = await this.suspendProjectUseCase.execute(projectId, validated, adminId);

            const response = this.responseBuilder.success(
                result,
                'Project suspended successfully',
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };
}
