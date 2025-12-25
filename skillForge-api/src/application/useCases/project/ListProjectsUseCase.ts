import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IListProjectsUseCase } from './interfaces/IListProjectsUseCase';
import { ListProjectsRequestDTO, ListProjectsResponseDTO } from '../../dto/project/ListProjectsDTO';
import { ProjectResponseDTO } from '../../dto/project/ProjectResponseDTO';
import { ProjectStatus } from '../../../domain/entities/Project';

@injectable()
export class ListProjectsUseCase implements IListProjectsUseCase {
  constructor(
    @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
  ) {}

  async execute(filters: ListProjectsRequestDTO): Promise<ListProjectsResponseDTO> {
    // Map DTO filters to repository filters
    const repositoryFilters = {
      search: filters.search,
      category: filters.category,
      status: filters.status as ProjectStatus | undefined,
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    // Get projects from repository
    const result = await this.projectRepository.listProjects(repositoryFilters);

    // Collect client IDs (only if we have projects)
    const clientIds = result.projects.length > 0 
      ? [...new Set(result.projects.map(p => p.clientId))]
      : [];

    // Fetch clients (only if we have client IDs)
    const clients = clientIds.length > 0 
      ? await this.userRepository.findByIds(clientIds)
      : [];
    const clientsMap = new Map(clients.map(c => [c.id, c]));

    // Map to response DTOs with client info
    const projectDTOs: ProjectResponseDTO[] = result.projects.map(project => {
      const client = clientsMap.get(project.clientId);
      if (!client) {
        // Log error but don't throw - return project without client info to avoid breaking the entire list
        console.error(`Client not found for project ${project.id}`);
        // Return project with minimal client info
        return {
          id: project.id!,
          clientId: project.clientId,
          title: project.title,
          description: project.description,
          category: project.category,
          tags: project.tags,
          budget: project.budget,
          duration: project.duration,
          deadline: project.deadline || undefined,
          status: project.status as 'Open' | 'In_Progress' | 'Completed' | 'Cancelled',
          paymentId: project.paymentId || undefined,
          applicationsCount: project.applicationsCount,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          client: {
            name: 'Unknown User',
            avatar: undefined,
            rating: undefined,
            isVerified: false,
          },
        };
      }

      return {
        id: project.id!,
        clientId: project.clientId,
        title: project.title,
        description: project.description,
        category: project.category,
        tags: project.tags,
        budget: project.budget,
        duration: project.duration,
        deadline: project.deadline || undefined,
        status: project.status as 'Open' | 'In_Progress' | 'Completed' | 'Cancelled',
        paymentId: project.paymentId || undefined,
        applicationsCount: project.applicationsCount,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        client: {
          name: client.name,
          avatar: client.avatarUrl || undefined,
          rating: client.rating || undefined,
          isVerified: client.verification?.email_verified || false,
        },
      };
    });

    return {
      projects: projectDTOs,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}

