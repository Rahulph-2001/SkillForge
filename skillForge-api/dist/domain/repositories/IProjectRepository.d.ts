import { Project, ProjectStatus } from '../entities/Project';
export interface ListProjectsFilters {
    search?: string;
    category?: string;
    status?: ProjectStatus;
    clientId?: string;
    page?: number;
    limit?: number;
    isSuspended?: boolean;
}
export interface ListProjectsResult {
    projects: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface ProjectStats {
    totalProjects: number;
    openProjects: number;
    inProgressProjects: number;
    completedProjects: number;
    pendingApprovalProjects: number;
    cancelledProjects: number;
    totalBudget: number;
}
export interface AdminListProjectsFilters extends ListProjectsFilters {
    includeCreator?: boolean;
    includeContributor?: boolean;
    isSuspended?: boolean;
}
export interface IProjectRepository {
    findById(projectId: string): Promise<Project | null>;
    findByClientId(clientId: string): Promise<Project[]>;
    findByClientIdAndStatus(clientId: string, status: ProjectStatus): Promise<Project[]>;
    findByPaymentId(paymentId: string): Promise<Project | null>;
    findContributingProjects(userId: string): Promise<Project[]>;
    listProjects(filters: ListProjectsFilters): Promise<ListProjectsResult>;
    findAllAdmin(filters: AdminListProjectsFilters): Promise<ListProjectsResult>;
    getStats(): Promise<ProjectStats>;
    create(project: Project): Promise<Project>;
    update(project: Project): Promise<Project>;
    delete(projectId: string): Promise<void>;
    updateStatus(projectId: string, status: ProjectStatus): Promise<Project>;
    incrementApplicationsCount(projectId: string): Promise<Project>;
}
//# sourceMappingURL=IProjectRepository.d.ts.map