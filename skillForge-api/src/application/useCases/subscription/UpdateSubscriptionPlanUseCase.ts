import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { SubscriptionPlan } from '../../../domain/entities/SubscriptionPlan';
import { UpdateSubscriptionPlanDTO } from '../../dto/subscription/UpdateSubscriptionPlanDTO';
import { ForbiddenError, NotFoundError, ConflictError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IUpdateSubscriptionPlanUseCase } from './interfaces/IUpdateSubscriptionPlanUseCase';
import { SubscriptionPlanDTO } from '../../dto/subscription/SubscriptionPlanDTO';
import { ISubscriptionPlanMapper } from '../../mappers/interfaces/ISubscriptionPlanMapper';

@injectable()
export class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TYPES.ISubscriptionPlanMapper) private subscriptionPlanMapper: ISubscriptionPlanMapper
  ) {}

  async execute(adminUserId: string, dto: UpdateSubscriptionPlanDTO): Promise<SubscriptionPlanDTO> {
    // Verify admin privileges
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Find existing plan
    const existingPlan = await this.subscriptionPlanRepository.findById(dto.planId);
    if (!existingPlan) {
      throw new NotFoundError('Subscription plan not found');
    }

    // Check if new name conflicts with another plan
    if (dto.name !== existingPlan.name) {
      const nameExists = await this.subscriptionPlanRepository.nameExists(dto.name, dto.planId);
      if (nameExists) {
        throw new ConflictError('A subscription plan with this name already exists');
      }
    }

    // Generate feature IDs for new features
    const features = dto.features.map((feature, index) => ({
      id: feature.id || `${Date.now()}-${index}`,
      name: feature.name,
    }));

    // Update domain entity
    existingPlan.updateDetails(
      dto.name,
      dto.price,
      dto.projectPosts,
      dto.communityPosts,
      dto.badge as any,
      dto.color
    );

    // Update features
    existingPlan.setFeatures(features);

    // Save to repository
    const updatedPlan = await this.subscriptionPlanRepository.update(existingPlan);

    return this.subscriptionPlanMapper.toDTO(updatedPlan);
  }
}
