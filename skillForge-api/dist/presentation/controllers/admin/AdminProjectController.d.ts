import { Request, Response, NextFunction } from 'express';
import { IAdminListProjectsUseCase } from '../../../application/useCases/admin/interfaces/IAdminListProjectsUseCase';
import { IAdminGetProjectStatsUseCase } from '../../../application/useCases/admin/interfaces/IAdminGetProjectStatsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class AdminProjectController {
    private readonly listProjectsUseCase;
    private readonly getProjectStatsUseCase;
    private readonly responseBuilder;
    constructor(listProjectsUseCase: IAdminListProjectsUseCase, getProjectStatsUseCase: IAdminGetProjectStatsUseCase, responseBuilder: IResponseBuilder);
    listProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProjectStats: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AdminProjectController.d.ts.map