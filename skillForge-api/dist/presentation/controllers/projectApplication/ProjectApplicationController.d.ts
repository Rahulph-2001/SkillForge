import { Request, Response, NextFunction } from 'express';
import { IApplyToProjectUseCase } from '../../../application/useCases/projectApplication/interfaces/IApplyToProjectUseCase';
import { IGetProjectApplicationsUseCase } from '../../../application/useCases/projectApplication/interfaces/IGetProjectApplicationsUseCase';
import { IUpdateApplicationStatusUseCase } from '../../../application/useCases/projectApplication/interfaces/IUpdateApplicationStatusUseCase';
import { IGetMyApplicationsUseCase } from '../../../application/useCases/projectApplication/interfaces/IGetMyApplicationsUseCase';
import { IWithdrawApplicationUseCase } from '../../../application/useCases/projectApplication/interfaces/IWithdrawApplicationUseCase';
import { GetReceivedApplicationsUseCase } from '../../../application/useCases/projectApplication/GetReceivedApplicationsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class ProjectApplicationController {
    private readonly applyToProjectUseCase;
    private readonly getProjectApplicationsUseCase;
    private readonly updateStatusUseCase;
    private readonly getMyApplicationsUseCase;
    private readonly withdrawApplicationUseCase;
    private readonly getReceivedApplicationsUseCase;
    private readonly responseBuilder;
    constructor(applyToProjectUseCase: IApplyToProjectUseCase, getProjectApplicationsUseCase: IGetProjectApplicationsUseCase, updateStatusUseCase: IUpdateApplicationStatusUseCase, getMyApplicationsUseCase: IGetMyApplicationsUseCase, withdrawApplicationUseCase: IWithdrawApplicationUseCase, getReceivedApplicationsUseCase: GetReceivedApplicationsUseCase, responseBuilder: IResponseBuilder);
    applyToProject(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProjectApplications(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void>;
    withdrawApplication(req: Request, res: Response, next: NextFunction): Promise<void>;
    getReceivedApplications(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=ProjectApplicationController.d.ts.map