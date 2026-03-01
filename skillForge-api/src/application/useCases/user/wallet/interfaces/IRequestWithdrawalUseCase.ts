import { type RequestWithdrawalDTO } from '../../../../dto/credit/CreditRedemptionDTO';
import { type WithdrawalRequestResponseDTO } from '../../../../dto/credit/WithdrawalRequestResponseDTO';

export interface IRequestWithdrawalUseCase {
    execute(userId: string, data: RequestWithdrawalDTO): Promise<WithdrawalRequestResponseDTO>;
}
