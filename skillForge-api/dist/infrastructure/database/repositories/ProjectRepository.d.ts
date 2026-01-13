import { IProjectRepository, ListProjectsFilters, ListProjectsResult } from '../../../domain/repositories/IProjectRepository';
import { Project, ProjectStatus } from '../../../domain/entities/Project';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class ProjectRepository extends BaseRepository<Project> implements IProjectRepository {
    constructor(db: Database);
    private mapToDomain;
    findById(projectId: string): Promise<Project | null>;
    findByClientId(clientId: string): Promise<Project[]>;
    findByClientIdAndStatus(clientId: string, status: ProjectStatus): Promise<Project[]>;
    findByPaymentId(paymentId: string): Promise<Project | null>;
    listProjects(filters: ListProjectsFilters): Promise<ListProjectsResult>;
    create(project: Project): Promise<Project>;
    update(project: Project): Promise<Project>;
    delete(id: string): Promise<void>;
    updateStatus(projectId: string, status: ProjectStatus): Promise<Project>;
    incrementApplicationsCount(projectId: string): Promise<Project>;
}
//# sourceMappingURL=ProjectRepository.d.ts.map