import { WithdrawalRequest, WithdrawalStatus } from '../entities/WithdrawalRequest';

export interface WithdrawalRequestFilters {
    status?: WithdrawalStatus;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}

export interface PaginatedWithdrawalRequests {
    requests: WithdrawalRequest[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IWithdrawalRequestRepository {
    create(request: WithdrawalRequest): Promise<WithdrawalRequest>;
    findById(id: string): Promise<WithdrawalRequest | null>;
    getAll(filters?: WithdrawalRequestFilters): Promise<PaginatedWithdrawalRequests>;
    update(request: WithdrawalRequest): Promise<WithdrawalRequest>;
    countByStatus(status: WithdrawalStatus): Promise<number>;
}
