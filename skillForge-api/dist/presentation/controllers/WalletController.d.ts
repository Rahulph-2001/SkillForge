import { Request, Response, NextFunction } from 'express';
import { IGetUserWalletDataUseCase } from '../../application/useCases/wallet/interfaces/IGetUserWalletDataUseCase';
import { IGetUserWalletTransactionsUseCase } from '../../application/useCases/wallet/interfaces/IGetUserWalletTransactionsUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
export declare class WalletController {
    private readonly getUserWalletDataUseCase;
    private readonly getUserWalletTransactionsUseCase;
    private readonly responseBuilder;
    constructor(getUserWalletDataUseCase: IGetUserWalletDataUseCase, getUserWalletTransactionsUseCase: IGetUserWalletTransactionsUseCase, responseBuilder: IResponseBuilder);
    getWalletData: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=WalletController.d.ts.map