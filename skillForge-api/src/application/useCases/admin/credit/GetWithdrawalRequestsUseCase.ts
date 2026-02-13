import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IGetWithdrawalRequestsUseCase, PaginatedWithdrawalRequestsResponseDTO } from './interfaces/IGetWithdrawalRequestsUseCase';
import { WithdrawalRequestFilters, IWithdrawalRequestRepository } from '../../../../domain/repositories/IWithdrawalRequestRepository';
import { IWithdrawalRequestMapper } from '../../../mappers/interfaces/IWithdrawalRequestMapper';

@injectable()
export class GetWithdrawalRequestsUseCase implements IGetWithdrawalRequestsUseCase {
    constructor(
        @inject(TYPES.IWithdrawalRequestRepository) private readonly withdrawalRepository: IWithdrawalRequestRepository,
        @inject(TYPES.IWithdrawalRequestMapper) private readonly withdrawalMapper: IWithdrawalRequestMapper
    ) { }

    async execute(filters: WithdrawalRequestFilters): Promise<PaginatedWithdrawalRequestsResponseDTO> {
        const result = await this.withdrawalRepository.getAll(filters);

        return {
            requests: result.requests.map(r => this.withdrawalMapper.toResponseDTO(r)),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
}
