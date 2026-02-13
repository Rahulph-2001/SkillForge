import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { IWithdrawalRequestRepository, WithdrawalRequestFilters, PaginatedWithdrawalRequests } from '../../../domain/repositories/IWithdrawalRequestRepository';
import { WithdrawalRequest, WithdrawalStatus } from '../../../domain/entities/WithdrawalRequest';
import { PrismaClient } from '@prisma/client';

@injectable()
export class WithdrawalRequestRepository extends BaseRepository<WithdrawalRequest> implements IWithdrawalRequestRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'withdrawalRequest' as any);
    }

    async create(request: WithdrawalRequest): Promise<WithdrawalRequest> {
        const data = await (this.prisma as any).withdrawalRequest.create({
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
        const data = await (this.prisma as any).withdrawalRequest.findUnique({
            where: { id },
        });
        return data ? this.toDomain(data) : null;
    }

    async getAll(filters?: WithdrawalRequestFilters): Promise<PaginatedWithdrawalRequests> {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.userId) {
            where.userId = filters.userId;
        }
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters?.startDate) where.createdAt.gte = filters.startDate;
            if (filters?.endDate) where.createdAt.lte = filters.endDate;
        }

        const [requests, total] = await Promise.all([
            (this.prisma as any).withdrawalRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            (this.prisma as any).withdrawalRequest.count({ where }),
        ]);

        return {
            requests: requests.map((r: any) => this.toDomain(r)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(request: WithdrawalRequest): Promise<WithdrawalRequest> {
        const data = await (this.prisma as any).withdrawalRequest.update({
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
        return await (this.prisma as any).withdrawalRequest.count({
            where: { status: status }
        });
    }

    private toDomain(data: any): WithdrawalRequest {
        return new WithdrawalRequest({
            id: data.id,
            userId: data.userId,
            amount: Number(data.amount),
            currency: data.currency,
            status: data.status as WithdrawalStatus,
            bankDetails: data.bankDetails as Record<string, any>,
            adminNote: data.adminNote,
            processedBy: data.processedBy,
            processedAt: data.processedAt,
            transactionId: data.transactionId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
}
