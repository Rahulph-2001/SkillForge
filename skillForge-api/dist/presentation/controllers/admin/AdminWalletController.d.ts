import { Request, Response, NextFunction } from 'express';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { IGetAdminWalletStatsUseCase } from '../../../application/useCases/admin/interfaces/IGetAdminWalletStatsUseCase';
import { IGetWalletTransactionsUseCase } from '../../../application/useCases/admin/interfaces/IGetWalletTransactionsUseCase';
export declare class AdminWalletController {
    private readonly responseBuilder;
    private readonly getAdminWalletStatsUseCase;
    private readonly getWalletTransactionsUseCase;
    constructor(responseBuilder: IResponseBuilder, getAdminWalletStatsUseCase: IGetAdminWalletStatsUseCase, getWalletTransactionsUseCase: IGetWalletTransactionsUseCase);
    getWalletStats(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getWalletTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AdminWalletController.d.ts.map