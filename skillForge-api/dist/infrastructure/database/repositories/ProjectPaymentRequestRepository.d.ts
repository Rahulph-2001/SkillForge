import { PrismaClient } from '@prisma/client';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { ProjectPaymentRequest } from '../../../domain/entities/ProjectPaymentRequest';
import { ProjectPaymentRequestType } from '../../../domain/entities/ProjectPaymentRequest';
export declare class ProjectPaymentRequestRepository implements IProjectPaymentRequestRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(request: ProjectPaymentRequest): Promise<ProjectPaymentRequest>;
    findById(id: string): Promise<ProjectPaymentRequest | null>;
    findByProjectId(projectId: string): Promise<ProjectPaymentRequest[]>;
    findPending(): Promise<ProjectPaymentRequest[]>;
    findPendingByType(type: ProjectPaymentRequestType): Promise<ProjectPaymentRequest[]>;
    update(request: ProjectPaymentRequest): Promise<ProjectPaymentRequest>;
}
//# sourceMappingURL=ProjectPaymentRequestRepository.d.ts.map