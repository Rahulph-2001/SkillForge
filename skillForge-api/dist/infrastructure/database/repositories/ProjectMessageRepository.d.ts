import { PrismaClient } from '@prisma/client';
import { IProjectMessageRepository } from '../../../domain/repositories/IProjectMessageRepository';
import { ProjectMessage } from '../../../domain/entities/ProjectMessage';
export declare class ProjectMessageRepository implements IProjectMessageRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(message: ProjectMessage): Promise<ProjectMessage>;
    findByProjectId(projectId: string): Promise<ProjectMessage[]>;
    findById(id: string): Promise<ProjectMessage | null>;
    markAsRead(id: string): Promise<void>;
    markAllAsRead(projectId: string, userId: string): Promise<void>;
    private toDomain;
}
//# sourceMappingURL=ProjectMessageRepository.d.ts.map