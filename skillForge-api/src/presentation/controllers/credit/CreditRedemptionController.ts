import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetWalletInfoUseCase } from '../../../application/useCases/user/wallet/interfaces/IGetWalletInfoUseCase';
import { IRedeemCreditsUseCase } from '../../../application/useCases/user/wallet/interfaces/IRedeemCreditsUseCase';
import { IRequestWithdrawalUseCase } from '../../../application/useCases/user/wallet/interfaces/IRequestWithdrawalUseCase';
import { IUpdateRedemptionSettingsUseCase } from '../../../application/useCases/admin/credit/interfaces/IUpdateRedemptionSettingsUseCase';
import { IGetRedemptionSettingsUseCase } from '../../../application/useCases/admin/credit/interfaces/IGetRedemptionSettingsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SetRedemptionSettingsDTO, RedeemCreditsDTO, RequestWithdrawalDTO, ProcessWithdrawalDTO } from '../../../application/dto/credit/CreditRedemptionDTO';
import { AuthenticatedRequest } from '../../../domain/interfaces/AuthenticatedRequest';
import { WithdrawalStatus } from '../../../domain/entities/WithdrawalRequest';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class CreditRedemptionController {
    constructor(
        @inject(TYPES.IGetWalletInfoUseCase) private readonly getWalletInfoUseCase: IGetWalletInfoUseCase,
        @inject(TYPES.IRedeemCreditsUseCase) private readonly redeemCreditsUseCase: IRedeemCreditsUseCase,
        @inject(TYPES.IRequestWithdrawalUseCase) private readonly requestWithdrawalUseCase: IRequestWithdrawalUseCase,
        @inject(TYPES.IUpdateRedemptionSettingsUseCase) private readonly updateRedemptionSettingsUseCase: IUpdateRedemptionSettingsUseCase,
        @inject(TYPES.IGetRedemptionSettingsUseCase) private readonly getRedemptionSettingsUseCase: IGetRedemptionSettingsUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }



    // User: Get Wallet Info
    async getWalletInfo(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as AuthenticatedRequest).user.userId;
            const result = await this.getWalletInfoUseCase.execute(userId);
            const response = this.responseBuilder.success(result, 'Wallet info retrieved successfully');
            res.status(response.statusCode).json(response.body);
        } catch (error: any) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', error.message || 'Failed to retrieve wallet info', HttpStatusCode.INTERNAL_SERVER_ERROR);
            res.status(response.statusCode).json(response.body);
        }
    }

    // User: Redeem Credits
    async redeemCredits(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as AuthenticatedRequest).user.userId;
            const dto: RedeemCreditsDTO = req.body;
            const result = await this.redeemCreditsUseCase.execute(userId, dto);
            const response = this.responseBuilder.success(result, 'Credits redeemed successfully');
            res.status(response.statusCode).json(response.body);
        } catch (error: any) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', error.message || 'Failed to redeem credits', HttpStatusCode.INTERNAL_SERVER_ERROR);
            res.status(response.statusCode).json(response.body);
        }
    }

    // User: Request Withdrawal
    async requestWithdrawal(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as AuthenticatedRequest).user.userId;
            const dto: RequestWithdrawalDTO = req.body;
            const result = await this.requestWithdrawalUseCase.execute(userId, dto);
            const response = this.responseBuilder.success(result, 'Withdrawal requested successfully');
            res.status(response.statusCode).json(response.body);
        } catch (error: any) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', error.message || 'Failed to request withdrawal', HttpStatusCode.INTERNAL_SERVER_ERROR);
            res.status(response.statusCode).json(response.body);
        }
    }

    // Admin: Update Redemption Settings
    async setConversionRate(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as AuthenticatedRequest).user.userId;
            const dto: SetRedemptionSettingsDTO = req.body;
            const result = await this.updateRedemptionSettingsUseCase.execute(userId, dto);
            const response = this.responseBuilder.success(result, 'Redemption settings updated successfully');
            res.status(response.statusCode).json(response.body);
        } catch (error: any) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', error.message || 'Failed to update redemption settings', HttpStatusCode.INTERNAL_SERVER_ERROR);
            res.status(response.statusCode).json(response.body);
        }
    }

    // Admin: Get Redemption Settings
    async getConversionRate(_req: Request, res: Response): Promise<void> {
        try {
            const result = await this.getRedemptionSettingsUseCase.execute();
            const response = this.responseBuilder.success(result, 'Redemption settings retrieved successfully');
            res.status(response.statusCode).json(response.body);
        } catch (error: any) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', error.message || 'Failed to get redemption settings', HttpStatusCode.INTERNAL_SERVER_ERROR);
            res.status(response.statusCode).json(response.body);
        }
    }


}
