import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../di/types';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { ProjectPaymentRequest } from '../../../domain/entities/ProjectPaymentRequest';
import { ProjectPaymentRequestType } from '../../../domain/entities/ProjectPaymentRequest';

@injectable()
export class ProjectPaymentRequestRepository implements IProjectPaymentRequestRepository {
    constructor(
        @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
    ) { }

    async create(request: ProjectPaymentRequest): Promise<ProjectPaymentRequest> {
        const data = request.toObject();

        // Convert domain enums to string/Prisma enums if necessary, 
        // but Prisma client usually handles matching string enums well if they match.
        // However, since we haven't successfully run prisma generate yet, 
        // we need to be careful. The Prisma types will be updated after generation.

        const created = await this.prisma.projectPaymentRequest.create({
            data: {
                id: data.id,
                projectId: data.projectId,
                type: data.type as any, // Cast to any to avoid type error before regeneration
                amount: data.amount,
                requestedBy: data.requestedBy,
                recipientId: data.recipientId,
                status: data.status as any,
                adminNotes: data.adminNotes,
                processedAt: data.processedAt,
                processedBy: data.processedBy,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });

        return ProjectPaymentRequest.fromDatabaseRow(created);
    }

    async findById(id: string): Promise<ProjectPaymentRequest | null> {
        const found = await this.prisma.projectPaymentRequest.findUnique({
            where: { id },
        });

        if (!found) return null;
        return ProjectPaymentRequest.fromDatabaseRow(found);
    }

    async findByProjectId(projectId: string): Promise<ProjectPaymentRequest[]> {
        const results = await this.prisma.projectPaymentRequest.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });

        return results.map((row: any) => ProjectPaymentRequest.fromDatabaseRow(row));
    }

    async findPending(): Promise<ProjectPaymentRequest[]> {
        const results = await this.prisma.projectPaymentRequest.findMany({
            where: { status: 'PENDING' as any },
            orderBy: { createdAt: 'asc' },
            include: {
                project: {
                    select: {
                        title: true,
                        budget: true,
                    }
                }
            }
        });

        return results.map((row: any) => ProjectPaymentRequest.fromDatabaseRow(row));
    }

    async findPendingByType(type: ProjectPaymentRequestType): Promise<ProjectPaymentRequest[]> {
        const results = await this.prisma.projectPaymentRequest.findMany({
            where: {
                status: 'PENDING' as any,
                type: type as any
            },
            orderBy: { createdAt: 'asc' },
        });

        return results.map((row: any) => ProjectPaymentRequest.fromDatabaseRow(row));
    }

    async update(request: ProjectPaymentRequest): Promise<ProjectPaymentRequest> {
        const data = request.toObject();

        const updated = await this.prisma.projectPaymentRequest.update({
            where: { id: data.id },
            data: {
                status: data.status as any,
                adminNotes: data.adminNotes,
                processedAt: data.processedAt,
                processedBy: data.processedBy,
                updatedAt: data.updatedAt,
            },
        });

        return ProjectPaymentRequest.fromDatabaseRow(updated);
    }
}
