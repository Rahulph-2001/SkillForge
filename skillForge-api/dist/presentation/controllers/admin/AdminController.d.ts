import { Request, Response, NextFunction } from 'express';
import { IListUsersUseCase } from '../../../application/useCases/admin/interfaces/IListUsersUseCase';
import { ISuspendUserUseCase } from '../../../application/useCases/admin/interfaces/ISuspendUserUseCase';
import { IUnsuspendUserUseCase } from '../../../application/useCases/admin/interfaces/IUnsuspendUserUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class AdminController {
    private readonly listUsersUseCase;
    private readonly suspendUserUseCase;
    private readonly unsuspendUserUseCase;
    private readonly responseBuilder;
    constructor(listUsersUseCase: IListUsersUseCase, suspendUserUseCase: ISuspendUserUseCase, unsuspendUserUseCase: IUnsuspendUserUseCase, responseBuilder: IResponseBuilder);
    listUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    suspendUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    unsuspendUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AdminController.d.ts.map