import { WithdrawalRequest } from '../../../domain/entities/WithdrawalRequest';
import { WithdrawalRequestResponseDTO } from '../../dto/credit/WithdrawalRequestResponseDTO';

export interface IWithdrawalRequestMapper {
    toResponseDTO(request: WithdrawalRequest): WithdrawalRequestResponseDTO;
}
