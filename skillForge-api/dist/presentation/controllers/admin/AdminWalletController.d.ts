import { Request, Response, NextFunction } from 'express';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { IGetAdminWalletStatsUseCase } from '../../../application/useCases/admin/interfaces/IGetAdminWalletStatsUseCase';
import { IGetWalletTransactionsUseCase } from '../../../application/useCases/admin/interfaces/IGetWalletTransactionsUseCase';
import { IGetAdminCreditTransactionsUseCase } from '../../../application/useCases/admin/interfaces/IGetAdminCreditTransactionsUseCase';
import { IGetAdminCreditStatsUseCase } from '../../../application/useCases/admin/interfaces/IGetAdminCreditStatsUseCase';
export declare class AdminWalletController {
    private readonly responseBuilder;
    private readonly getAdminWalletStatsUseCase;
    private readonly getWalletTransactionsUseCase;
    private readonly getAdminCreditTransactionsUseCase;
    private readonly getAdminCreditStatsUseCase;
    constructor(responseBuilder: IResponseBuilder, getAdminWalletStatsUseCase: IGetAdminWalletStatsUseCase, getWalletTransactionsUseCase: IGetWalletTransactionsUseCase, getAdminCreditTransactionsUseCase: IGetAdminCreditTransactionsUseCase, getAdminCreditStatsUseCase: IGetAdminCreditStatsUseCase);
    getWalletStats(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getWalletTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCreditTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCreditStats(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AdminWalletController.d.ts.map