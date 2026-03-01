import { type WithdrawalRequest } from '../../../domain/entities/WithdrawalRequest';
import { type WithdrawalRequestResponseDTO } from '../../dto/credit/WithdrawalRequestResponseDTO';

export interface IWithdrawalRequestMapper {
    toResponseDTO(request: WithdrawalRequest): WithdrawalRequestResponseDTO;
}
