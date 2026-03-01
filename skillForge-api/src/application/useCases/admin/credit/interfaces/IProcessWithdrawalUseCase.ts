import { type ProcessWithdrawalDTO } from '../../../../dto/credit/CreditRedemptionDTO';
import { type WithdrawalRequestResponseDTO } from '../../../../dto/credit/WithdrawalRequestResponseDTO';

export interface IProcessWithdrawalUseCase {
    execute(adminId: string, data: ProcessWithdrawalDTO): Promise<WithdrawalRequestResponseDTO>;
}
