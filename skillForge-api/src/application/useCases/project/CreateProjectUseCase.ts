import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IValidateProjectPostLimitUseCase } from './interfaces/IValidateProjectPostLimitUseCase';
import { IIncrementProjectPostUsageUseCase } from './interfaces/IIncrementProjectPostUsageUseCase';
import { ICreateProjectUseCase } from './interfaces/ICreateProjectUseCase';
import { CreateProjectRequestDTO } from '../../dto/project/CreateProjectDTO';
import { ProjectResponseDTO } from '../../dto/project/ProjectResponseDTO';
import { Project, ProjectStatus } from '../../../domain/entities/Project';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { v4 as uuidv4 } from 'uuid';
import { IAdminNotificationService } from '../../../domain/services/IAdminNotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IValidateProjectPostLimitUseCase) private readonly validateLimitUseCase: IValidateProjectPostLimitUseCase,
    @inject(TYPES.IIncrementProjectPostUsageUseCase) private readonly incrementUsageUseCase: IIncrementProjectPostUsageUseCase,
    @inject(TYPES.IAdminNotificationService) private readonly adminNotificationService: IAdminNotificationService
  ) { }

  async execute(userId: string, request: CreateProjectRequestDTO, paymentId?: string): Promise<ProjectResponseDTO> {
    // 1. Verify user exists
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 2. Validate subscription and project post limit
    await this.validateLimitUseCase.execute(userId);

    // 3. Create project entity
    const project = Project.create({
      id: uuidv4(),
      clientId: userId,
      title: request.title,
      description: request.description,
      category: request.category,
      tags: request.tags || [],
      budget: request.budget,
      duration: request.duration,
      deadline: request.deadline || null,
      status: ProjectStatus.OPEN,
      paymentId: paymentId || null,
      applicationsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. Save project
    const savedProject = await this.projectRepository.create(project);

    // 5. Track usage (increment project post count)
    await this.incrementUsageUseCase.execute(userId);

    // 6. Notify admins
    await this.adminNotificationService.notifyAllAdmins({
      type: NotificationType.NEW_PROJECT_CREATED,
      title: 'New Project Created',
      message: `A new project "${savedProject.title}" has been created by ${user.name}.`,
      data: { projectId: savedProject.id, userId }
    });

    // 7. Map to response DTO
    return {
      id: savedProject.id!,
      clientId: savedProject.clientId,
      title: savedProject.title,
      description: savedProject.description,
      category: savedProject.category,
      tags: savedProject.tags,
      budget: savedProject.budget,
      duration: savedProject.duration,
      deadline: savedProject.deadline || undefined,
      status: savedProject.status as unknown as 'Open' | 'In_Progress' | 'Completed' | 'Cancelled',
      paymentId: savedProject.paymentId || undefined,
      applicationsCount: savedProject.applicationsCount,
      createdAt: savedProject.createdAt,
      updatedAt: savedProject.updatedAt,
      client: {
        name: user.name,
        avatar: user.avatarUrl || undefined,
        rating: user.rating || undefined,
        isVerified: user.verification?.email_verified || false,
      },
    };
  }
}