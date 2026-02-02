import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { IGetUserWalletDataUseCase } from '../../application/useCases/wallet/interfaces/IGetUserWalletDataUseCase';
import { IGetUserWalletTransactionsUseCase } from '../../application/useCases/wallet/interfaces/IGetUserWalletTransactionsUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { GetUserWalletTransactionsRequestSchema } from '../../application/dto/wallet/UserWalletTransactionDTO';
import { SUCCESS_MESSAGES } from '../../config/messages';

@injectable()
export class WalletController {
    constructor(
        @inject(TYPES.IGetUserWalletDataUseCase) private readonly getUserWalletDataUseCase: IGetUserWalletDataUseCase,
        @inject(TYPES.IGetUserWalletTransactionsUseCase) private readonly getUserWalletTransactionsUseCase: IGetUserWalletTransactionsUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    public getWalletData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const walletData = await this.getUserWalletDataUseCase.execute(userId);

            const response = this.responseBuilder.success(
                walletData,
                'Wallet data retrieved successfully',
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error: unknown) {
            next(error);
        }
    };

    public getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const filters = GetUserWalletTransactionsRequestSchema.parse(req.query);
            const result = await this.getUserWalletTransactionsUseCase.execute(userId, filters);

            const response = this.responseBuilder.success(
                result,
                'Wallet transactions retrieved successfully',
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error: unknown) {
            next(error);
        }
    };
}
