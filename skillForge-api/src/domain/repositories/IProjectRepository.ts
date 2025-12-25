import { Project, ProjectStatus } from '../entities/Project';

export interface ListProjectsFilters {
  search?: string;
  category?: string;
  status?: ProjectStatus;
  clientId?: string;
  page?: number;
  limit?: number;
}

export interface ListProjectsResult {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProjectRepository {
  // Read Operations
  findById(projectId: string): Promise<Project | null>;
  findByClientId(clientId: string): Promise<Project[]>;
  findByClientIdAndStatus(clientId: string, status: ProjectStatus): Promise<Project[]>;
  findByPaymentId(paymentId: string): Promise<Project | null>;
  
  // List Operations with filters
  listProjects(filters: ListProjectsFilters): Promise<ListProjectsResult>;
  
  // Standard CRUD
  create(project: Project): Promise<Project>;
  update(project: Project): Promise<Project>;
  delete(projectId: string): Promise<void>;
  
  // Status Updates
  updateStatus(projectId: string, status: ProjectStatus): Promise<Project>;
  incrementApplicationsCount(projectId: string): Promise<Project>;
}

