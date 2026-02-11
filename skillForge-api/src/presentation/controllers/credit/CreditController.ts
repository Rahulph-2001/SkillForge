import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetUserCreditPackagesUseCase } from '../../../application/useCases/credit/interfaaces/IGetUserCreditPackagesUseCase';
import { IPurchaseCreditPackageUseCase } from '../../../application/useCases/credit/interfaaces/IPurchaseCreditPackageUseCase';
import { IGetCreditTransactionsUseCase } from '../../../application/useCases/credit/interfaaces/IGetCreditTransactionsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { GetCreditTransactionsRequestSchema } from '../../../application/dto/credit/GetCreditTransactionsDTO';

@injectable()
export class CreditController {
    constructor(
        @inject(TYPES.IGetUserCreditPackagesUseCase) private readonly getUserCreditPackagesUseCase: IGetUserCreditPackagesUseCase,
        @inject(TYPES.IPurchaseCreditPackageUseCase) private readonly purchaseCreditPackageUseCase: IPurchaseCreditPackageUseCase,
        @inject(TYPES.IGetCreditTransactionsUseCase) private readonly getCreditTransactionsUseCase: IGetCreditTransactionsUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    public getPackages = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.getUserCreditPackagesUseCase.execute();

            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.CREDITS.PACKAGES_FETCHED,
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error: unknown) {
            next(error);
        }
    };

    public purchasePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const result = await this.purchaseCreditPackageUseCase.execute({
                userId,
                ...req.body,
            });

            const response = this.responseBuilder.success(
                result,
                'Credits purchased successfully',
                HttpStatusCode.CREATED
            );
            res.status(response.statusCode).json(response.body);
        } catch (error: unknown) {
            next(error);
        }
    };

    public getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const filters = GetCreditTransactionsRequestSchema.parse({
                userId,
                ...req.query,
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
            });

            const result = await this.getCreditTransactionsUseCase.execute(filters);

            const response = this.responseBuilder.success(
                result,
                'Credit transactions retrieved successfully',
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error: unknown) {
            next(error);
        }
    };
}
