import { Request, Response, NextFunction } from 'express';
import { IListUsersUseCase } from '../../../application/useCases/admin/interfaces/IListUsersUseCase';
import { ISuspendUserUseCase } from '../../../application/useCases/admin/interfaces/ISuspendUserUseCase';
import { IUnsuspendUserUseCase } from '../../../application/useCases/admin/interfaces/IUnsuspendUserUseCase';
import { IListCommunitiesUseCase } from '../../../application/useCases/admin/interfaces/IListCommunitiesUseCase';
import { IUpdateCommunityByAdminUseCase } from '../../../application/useCases/admin/interfaces/IUpdateCommunityByAdminUseCase';
import { IBlockCommunityUseCase } from '../../../application/useCases/admin/interfaces/IBlockCommunityUseCase';
import { IUnblockCommunityUseCase } from '../../../application/useCases/admin/interfaces/IUnblockCommunityUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { IGetAdminDashboardStatsUseCase } from '../../../application/useCases/admin/interfaces/IGetAdminDashboardStatsUseCase';
export declare class AdminController {
    private readonly listUsersUseCase;
    private readonly suspendUserUseCase;
    private readonly unsuspendUserUseCase;
    private readonly listCommunitiesUseCase;
    private readonly updateCommunityUseCase;
    private readonly blockCommunityUseCase;
    private readonly unblockCommunityUseCase;
    private readonly responseBuilder;
    private readonly getDashboardStatsUseCase;
    constructor(listUsersUseCase: IListUsersUseCase, suspendUserUseCase: ISuspendUserUseCase, unsuspendUserUseCase: IUnsuspendUserUseCase, listCommunitiesUseCase: IListCommunitiesUseCase, updateCommunityUseCase: IUpdateCommunityByAdminUseCase, blockCommunityUseCase: IBlockCommunityUseCase, unblockCommunityUseCase: IUnblockCommunityUseCase, responseBuilder: IResponseBuilder, getDashboardStatsUseCase: IGetAdminDashboardStatsUseCase);
    listUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    suspendUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    unsuspendUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    listCommunities(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateCommunity(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockCommunity(req: Request, res: Response, next: NextFunction): Promise<void>;
    unblockCommunity(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDashboardStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AdminController.d.ts.map