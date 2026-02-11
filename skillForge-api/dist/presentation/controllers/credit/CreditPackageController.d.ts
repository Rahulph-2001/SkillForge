import { Request, Response, NextFunction } from 'express';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { ICreateCreditPackageUseCase } from '../../../application/useCases/credit/CreateCreditPackageUseCase';
import { IGetCreditPackagesUseCase } from '../../../application/useCases/credit/GetCreditPackagesUseCase';
import { IUpdateCreditPackageUseCase } from '../../../application/useCases/credit/interfaaces/IUpdateCreditPackageUseCase';
import { IDeleteCreditPackageUseCase } from '../../../application/useCases/credit/DeleteCreditPackageUseCase';
export declare class CreditPackageController {
    private readonly createUseCase;
    private readonly getUseCase;
    private readonly updateUseCase;
    private readonly deleteUseCase;
    private readonly responseBuilder;
    constructor(createUseCase: ICreateCreditPackageUseCase, getUseCase: IGetCreditPackagesUseCase, updateUseCase: IUpdateCreditPackageUseCase, deleteUseCase: IDeleteCreditPackageUseCase, responseBuilder: IResponseBuilder);
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=CreditPackageController.d.ts.map