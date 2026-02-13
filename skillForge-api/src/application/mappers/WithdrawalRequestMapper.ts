import { injectable } from 'inversify';
import { WithdrawalRequest } from '../../domain/entities/WithdrawalRequest';
import { WithdrawalRequestResponseDTO } from '../dto/credit/WithdrawalRequestResponseDTO';
import { IWithdrawalRequestMapper } from './interfaces/IWithdrawalRequestMapper';

@injectable()
export class WithdrawalRequestMapper implements IWithdrawalRequestMapper {
    toResponseDTO(request: WithdrawalRequest): WithdrawalRequestResponseDTO {
        return {
            id: request.id,
            userId: request.userId,
            amount: request.amount,
            currency: request.currency,
            status: request.status,
            bankDetails: request.bankDetails,
            adminNote: request.adminNote,
            processedBy: request.processedBy,
            processedAt: request.processedAt,
            transactionId: request.transactionId,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
        };
    }
}
