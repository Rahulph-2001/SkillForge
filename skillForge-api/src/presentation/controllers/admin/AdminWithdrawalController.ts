import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetWithdrawalRequestsUseCase } from '../../../application/useCases/admin/credit/interfaces/IGetWithdrawalRequestsUseCase';
import { IProcessWithdrawalUseCase } from '../../../application/useCases/admin/credit/interfaces/IProcessWithdrawalUseCase';
import { IUpdateRedemptionSettingsUseCase } from '../../../application/useCases/admin/credit/interfaces/IUpdateRedemptionSettingsUseCase';
import { SetRedemptionSettingsDTO } from '../../../application/dto/credit/CreditRedemptionDTO';
import { WithdrawalRequestFilters } from '../../../domain/repositories/IWithdrawalRequestRepository';

@injectable()
export class AdminWithdrawalController {
    constructor(
        @inject(TYPES.IGetWithdrawalRequestsUseCase) private readonly getWithdrawalRequestsUseCase: IGetWithdrawalRequestsUseCase,
        @inject(TYPES.IProcessWithdrawalUseCase) private readonly processWithdrawalUseCase: IProcessWithdrawalUseCase,
        @inject(TYPES.IUpdateRedemptionSettingsUseCase) private readonly updateRedemptionSettingsUseCase: IUpdateRedemptionSettingsUseCase
    ) { }

    getWithdrawals = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const status = req.query.status as string;

            const filters: WithdrawalRequestFilters = {
                page,
                limit,
                status: status && status !== 'ALL' ? (status as any) : undefined
            };

            const result = await this.getWithdrawalRequestsUseCase.execute(filters);
            res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    processWithdrawal = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const adminId = req.user!.id; // Assumes auth middleware populates user
            const { action, transactionId, adminNote } = req.body;

            const result = await this.processWithdrawalUseCase.execute(adminId, {
                withdrawalId: id,
                action,
                transactionId,
                adminNote
            });

            res.status(200).json({ success: true, data: result, message: 'Withdrawal processed successfully' });
        } catch (error: any) {
            if (error.name === 'NotFoundError') {
                res.status(404).json({ success: false, message: error.message });
            } else if (error.name === 'ValidationError') {
                res.status(400).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: error.message });
            }
        }
    };

    setConversionRate = async (req: Request, res: Response): Promise<void> => {
        try {
            const dto: SetRedemptionSettingsDTO = req.body;
            const adminId = req.user!.id;
            await this.updateRedemptionSettingsUseCase.execute(adminId, dto);
            res.status(200).json({ success: true, message: 'Redemption settings updated successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };
}
