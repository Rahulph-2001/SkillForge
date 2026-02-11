import { Request, Response, NextFunction } from 'express';
import { IGetUserCreditPackagesUseCase } from '../../../application/useCases/credit/interfaaces/IGetUserCreditPackagesUseCase';
import { IPurchaseCreditPackageUseCase } from '../../../application/useCases/credit/interfaaces/IPurchaseCreditPackageUseCase';
import { IGetCreditTransactionsUseCase } from '../../../application/useCases/credit/interfaaces/IGetCreditTransactionsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class CreditController {
    private readonly getUserCreditPackagesUseCase;
    private readonly purchaseCreditPackageUseCase;
    private readonly getCreditTransactionsUseCase;
    private readonly responseBuilder;
    constructor(getUserCreditPackagesUseCase: IGetUserCreditPackagesUseCase, purchaseCreditPackageUseCase: IPurchaseCreditPackageUseCase, getCreditTransactionsUseCase: IGetCreditTransactionsUseCase, responseBuilder: IResponseBuilder);
    getPackages: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    purchasePackage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=CreditController.d.ts.map