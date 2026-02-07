import { IProjectRepository, ListProjectsFilters, ListProjectsResult } from '../../../domain/repositories/IProjectRepository';
import { Project, ProjectStatus } from '../../../domain/entities/Project';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class ProjectRepository extends BaseRepository<Project> implements IProjectRepository {
    constructor(db: Database);
    private mapToPrismaStatus;
    private mapToDomain;
    findById(projectId: string): Promise<Project | null>;
    findByClientId(clientId: string): Promise<Project[]>;
    findByClientIdAndStatus(clientId: string, status: ProjectStatus): Promise<Project[]>;
    findByPaymentId(paymentId: string): Promise<Project | null>;
    findContributingProjects(userId: string): Promise<Project[]>;
    listProjects(filters: ListProjectsFilters): Promise<ListProjectsResult>;
    create(project: Project): Promise<Project>;
    update(project: Project): Promise<Project>;
    delete(id: string): Promise<void>;
    updateStatus(projectId: string, status: ProjectStatus): Promise<Project>;
    incrementApplicationsCount(projectId: string): Promise<Project>;
    findAllAdmin(filters: {
        page?: number;
        limit?: number;
        search?: string;
        status?: ProjectStatus;
        category?: string;
        isSuspended?: boolean;
        includeCreator?: boolean;
        includeContributor?: boolean;
    }): Promise<{
        projects: Project[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStats(): Promise<{
        totalProjects: number;
        openProjects: number;
        inProgressProjects: number;
        completedProjects: number;
        pendingApprovalProjects: number;
        cancelledProjects: number;
        totalBudget: number;
    }>;
}
//# sourceMappingURL=ProjectRepository.d.ts.map