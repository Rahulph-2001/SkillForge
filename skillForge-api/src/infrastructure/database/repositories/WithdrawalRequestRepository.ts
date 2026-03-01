import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { IWithdrawalRequestRepository, WithdrawalRequestFilters, PaginatedWithdrawalRequests } from '../../../domain/repositories/IWithdrawalRequestRepository';
import { WithdrawalRequest, WithdrawalStatus } from '../../../domain/entities/WithdrawalRequest';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaClient } from '@prisma/client';

@injectable()
export class WithdrawalRequestRepository extends BaseRepository<WithdrawalRequest> implements IWithdrawalRequestRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'withdrawalRequest');
    }

    async create(request: WithdrawalRequest): Promise<WithdrawalRequest> {
        const data = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.prisma as any).withdrawalRequest.create({
                data: {
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
                },
            });
        return this.toDomain(data);
    }

    async findById(id: string): Promise<WithdrawalRequest | null> {
        const data = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.prisma as any).withdrawalRequest.findUnique({
                where: { id },
            });
        return data ? this.toDomain(data) : null;
    }

    async getAll(filters?: WithdrawalRequestFilters): Promise<PaginatedWithdrawalRequests> {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.userId) {
            where.userId = filters.userId;
        }
        if (filters?.startDate || filters?.endDate) {
            const dateFilter: { gte?: Date; lte?: Date } = {};
            if (filters?.startDate) dateFilter.gte = filters.startDate;
            if (filters?.endDate) dateFilter.lte = filters.endDate;
            where.createdAt = dateFilter;
        }

        const [requests, total] = await Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.prisma as any).withdrawalRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.prisma as any).withdrawalRequest.count({ where }),
        ]);

        return {
            requests: (requests as Record<string, unknown>[]).map((r) => this.toDomain(r)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(request: WithdrawalRequest): Promise<WithdrawalRequest> {
        const data = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.prisma as any).withdrawalRequest.update({
                where: { id: request.id },
                data: {
                    status: request.status,
                    processedBy: request.processedBy,
                    processedAt: request.processedAt,
                    transactionId: request.transactionId,
                    adminNote: request.adminNote,
                    updatedAt: new Date(),
                },
            });
        return this.toDomain(data);
    }

    async countByStatus(status: WithdrawalStatus): Promise<number> {
        return await // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.prisma as any).withdrawalRequest.count({
                where: { status: status }
            });
    }

    private toDomain(data: Record<string, unknown>): WithdrawalRequest {
        return new WithdrawalRequest({
            id: data['id'] as string,
            userId: data['userId'] as string,
            amount: Number(data['amount']),
            currency: data['currency'] as string,
            status: data['status'] as WithdrawalStatus,
            bankDetails: data['bankDetails'] as Record<string, unknown>,
            adminNote: data['adminNote'] as string | null | undefined,
            processedBy: data['processedBy'] as string | null | undefined,
            processedAt: data['processedAt'] as Date | null | undefined,
            transactionId: data['transactionId'] as string | null | undefined,
            createdAt: data['createdAt'] as Date | undefined,
            updatedAt: data['updatedAt'] as Date | undefined,
        });
    }
}
