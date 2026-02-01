import { Request, Response, NextFunction } from 'express';
import { IAdminListSessionsUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminListSessionsUseCase';
import { IAdminGetSessionStatsUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminGetSessionStatsUseCase';
import { IAdminCancelSessionUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminCancelSessionUseCase';
import { IAdminCompleteSessionUseCase } from '../../../application/useCases/admin/session/interfaces/IAdminCompleteSessionUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class AdminSessionController {
    private adminListSessionsUseCase;
    private adminGetSessionStatsUseCase;
    private adminCancelSessionUseCase;
    private adminCompleteSessionUseCase;
    private responseBuilder;
    constructor(adminListSessionsUseCase: IAdminListSessionsUseCase, adminGetSessionStatsUseCase: IAdminGetSessionStatsUseCase, adminCancelSessionUseCase: IAdminCancelSessionUseCase, adminCompleteSessionUseCase: IAdminCompleteSessionUseCase, responseBuilder: IResponseBuilder);
    listSessions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStats: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    cancelSession: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    completeSession: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AdminSessionController.d.ts.map