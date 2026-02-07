import { Request, Response, NextFunction } from 'express';
import { IAdminListProjectsUseCase } from '../../../application/useCases/admin/interfaces/IAdminListProjectsUseCase';
import { IAdminGetProjectStatsUseCase } from '../../../application/useCases/admin/interfaces/IAdminGetProjectStatsUseCase';
import { IAdminGetProjectDetailsUseCase } from '../../../application/useCases/admin/interfaces/IAdminGetProjectDetailsUseCase';
import { IAdminSuspendProjectUseCase } from '../../../application/useCases/admin/interfaces/IAdminSuspendProjectUseCase';
import { IProcessProjectPaymentRequestUseCase } from '../../../application/useCases/admin/interfaces/IProcessProjectPaymentRequestUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class AdminProjectController {
    private readonly listProjectsUseCase;
    private readonly getProjectStatsUseCase;
    private readonly getProjectDetailsUseCase;
    private readonly suspendProjectUseCase;
    private readonly processPaymentRequestUseCase;
    private readonly responseBuilder;
    constructor(listProjectsUseCase: IAdminListProjectsUseCase, getProjectStatsUseCase: IAdminGetProjectStatsUseCase, getProjectDetailsUseCase: IAdminGetProjectDetailsUseCase, suspendProjectUseCase: IAdminSuspendProjectUseCase, processPaymentRequestUseCase: IProcessProjectPaymentRequestUseCase, responseBuilder: IResponseBuilder);
    processPaymentRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProjectStats: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProjectDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    suspendProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AdminProjectController.d.ts.map