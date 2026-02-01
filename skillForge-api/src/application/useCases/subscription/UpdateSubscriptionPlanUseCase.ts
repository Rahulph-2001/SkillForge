import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { UpdateSubscriptionPlanDTO } from '../../dto/subscription/UpdateSubscriptionPlanDTO';
import { ForbiddenError, NotFoundError, ConflictError, InternalServerError } from '../../../domain/errors/AppError';
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
    @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository,
    @inject(TYPES.ISubscriptionPlanMapper) private subscriptionPlanMapper: ISubscriptionPlanMapper
  ) { }

  async execute(
    adminUserId: string,
    planId: string,
    dto: UpdateSubscriptionPlanDTO
  ): Promise<SubscriptionPlanDTO> {
    // Verify admin privileges
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
    }

    // Find existing plan
    const plan = await this.subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    // Check if new name conflicts with existing plan
    if (dto.name && dto.name !== plan.name) {
      const nameExists = await this.subscriptionPlanRepository.nameExists(dto.name, planId);
      if (nameExists) {
        throw new ConflictError('A subscription plan with this name already exists');
      }
    }

    // Auto-populate legacy fields from features if not passed in DTO
    let projectPosts = dto.projectPosts;
    let createCommunity = dto.createCommunity;

    // If legacy fields are undefined but features are updated, try to sync from features
    if (dto.features && dto.features.length > 0) {
      if (projectPosts === undefined) {
        const feature = dto.features.find(f =>
          f.name.toLowerCase().includes('project') && f.name.toLowerCase().includes('post')
        );
        if (feature && feature.limitValue !== undefined) {
          projectPosts = feature.limitValue;
        }
      }

      if (createCommunity === undefined) {
        const feature = dto.features.find(f =>
          f.name.toLowerCase().includes('community') && f.name.toLowerCase().includes('create')
        );
        if (feature && feature.limitValue !== undefined) {
          createCommunity = feature.limitValue;
        }
      }
    }

    // Update plan properties
    if (dto.name || dto.price !== undefined || projectPosts !== undefined ||
      createCommunity !== undefined || dto.badge || dto.color) {
      plan.updateDetails(
        dto.name ?? plan.name,
        dto.price ?? plan.price,
        projectPosts !== undefined ? projectPosts : plan.projectPosts,
        createCommunity !== undefined ? createCommunity : plan.createCommunity,
        (dto.badge ?? plan.badge) as any,
        dto.color ?? plan.color
      );
    }

    // Update active status
    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        plan.activate();
      } else {
        plan.deactivate();
      }
    }

    // Save plan updates
    await this.subscriptionPlanRepository.update(plan);

    // Update features if provided
    if (dto.features) {
      // 1. Delete all existing features for this plan
      const existingFeatures = await this.featureRepository.findByPlanId(planId);
      if (existingFeatures.length > 0) {
        await Promise.all(existingFeatures.map(f => this.featureRepository.delete(f.id)));
      }

      // 2. Create new features
      if (dto.features.length > 0) {
        // Import dependencies
        const { Feature } = await import('../../../domain/entities/Feature');
        const { v4: uuidv4 } = await import('uuid');

        const featurePromises = dto.features.map(async (featureDto) => {
          const feature = new Feature({
            id: uuidv4(),
            planId: planId,
            name: featureDto.name,
            description: featureDto.description,
            featureType: featureDto.featureType as any,
            limitValue: featureDto.limitValue,
            isEnabled: featureDto.isEnabled,
            displayOrder: featureDto.displayOrder,
            isHighlighted: featureDto.isHighlighted,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          return this.featureRepository.create(feature);
        });

        await Promise.all(featurePromises);
      }
    }

    // Fetch updated plan with features
    const updatedPlan = await this.subscriptionPlanRepository.findById(planId);
    if (!updatedPlan) {
      throw new InternalServerError('Failed to retrieve updated plan');
    }

    return this.subscriptionPlanMapper.toDTO(updatedPlan);
  }
}
