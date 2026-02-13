import { PaginatedWithdrawalRequests, WithdrawalRequestFilters } from '../../../../../domain/repositories/IWithdrawalRequestRepository';

export interface IGetWithdrawalRequestsUseCase {
    execute(filters: WithdrawalRequestFilters): Promise<PaginatedWithdrawalRequestsResponseDTO>;
    // Note: We might want to return DTOs here instead of Domain Entities for strict Clean Architecture.
    // Let's create a DTO for the paginated response if strictness is required.
    // The current PaginatedWithdrawalRequests uses WithdrawalRequest[] (Domain Entity).
    // I should probably map it to WithdrawalRequestResponseDTO[].
}

import { WithdrawalRequestResponseDTO } from '../../../../dto/credit/WithdrawalRequestResponseDTO';

export interface PaginatedWithdrawalRequestsResponseDTO {
    requests: WithdrawalRequestResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IGetWithdrawalRequestsUseCase {
    execute(filters: WithdrawalRequestFilters): Promise<PaginatedWithdrawalRequestsResponseDTO>;
}
