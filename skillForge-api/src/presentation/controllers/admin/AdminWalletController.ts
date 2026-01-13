import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { IGetAdminWalletStatsUseCase } from '../../../application/useCases/admin/interfaces/IGetAdminWalletStatsUseCase';
import { IGetWalletTransactionsUseCase } from '../../../application/useCases/admin/interfaces/IGetWalletTransactionsUseCase';
import { SUCCESS_MESSAGES } from '../../../config/messages';

@injectable()
export class AdminWalletController {
    constructor(
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder,
        @inject(TYPES.IGetAdminWalletStatsUseCase) private readonly getAdminWalletStatsUseCase: IGetAdminWalletStatsUseCase,
        @inject(TYPES.IGetWalletTransactionsUseCase) private readonly getWalletTransactionsUseCase: IGetWalletTransactionsUseCase
    ) { }

    async getWalletStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await this.getAdminWalletStatsUseCase.execute();
            const response = this.responseBuilder.success(
                stats,
                SUCCESS_MESSAGES.WALLET.STATS_FETCHED,
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    }

    async getWalletTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const search = req.query.search as string | undefined;
            const type = req.query.type as 'CREDIT' | 'WITHDRAWAL' | undefined;
            const status = req.query.status as 'COMPLETED' | 'PENDING' | 'FAILED' | undefined;

            const result = await this.getWalletTransactionsUseCase.execute(page, limit, search, type, status);
            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.WALLET.TRANSACTIONS_FETCHED,
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    }
}