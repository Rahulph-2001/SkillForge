import { RequestWithdrawalDTO } from '../../../../dto/credit/CreditRedemptionDTO';
import { WithdrawalRequestResponseDTO } from '../../../../dto/credit/WithdrawalRequestResponseDTO';

export interface IRequestWithdrawalUseCase {
    execute(userId: string, data: RequestWithdrawalDTO): Promise<WithdrawalRequestResponseDTO>;
}
