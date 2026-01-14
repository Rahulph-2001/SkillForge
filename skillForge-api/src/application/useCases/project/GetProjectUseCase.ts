import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetProjectUseCase } from './interfaces/IGetProjectUseCase';
import { ProjectResponseDTO } from '../../dto/project/ProjectResponseDTO';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class GetProjectUseCase implements IGetProjectUseCase {
    constructor(
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
    ) { }

    async execute(projectId: string): Promise<ProjectResponseDTO> {
        // Fetch project
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Fetch client details
        const client = await this.userRepository.findById(project.clientId);

        // Map to responses DTO
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
            client: client ? {
                name: client.name,
                avatar: client.avatarUrl || undefined,
                rating: client.rating || undefined,
                isVerified: client.verification?.email_verified || false,
            } : {
                name: 'Unknown User',
                avatar: undefined,
                rating: undefined,
                isVerified: false,
            },
        };
    }
}
