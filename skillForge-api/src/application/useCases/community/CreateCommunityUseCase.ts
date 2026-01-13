import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { ICommunityMapper } from '../../mappers/interfaces/ICommunityMapper';
import { Community } from '../../../domain/entities/Community';
import { CommunityMember } from '../../../domain/entities/CommunityMember';
import { CreateCommunityDTO } from '../../dto/community/CreateCommunityDTO';
import { CommunityResponseDTO } from '../../dto/community/CommunityResponseDTO';
import { ValidationError, InternalServerError, ForbiddenError, NotFoundError } from '../../../domain/errors/AppError';
import { ICreateCommunityUseCase } from './interfaces/ICreateCommunityUseCase';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { ITransactionService } from '../../../domain/services/ITransactionService';
import { FeatureType } from '../../../domain/enums/SubscriptionEnums';
import { UsageRecord } from '../../../domain/entities/UsageRecord';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class CreateCommunityUseCase implements ICreateCommunityUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IStorageService) private readonly storageService: IStorageService,
    @inject(TYPES.ICommunityMapper) private readonly communityMapper: ICommunityMapper,
    @inject(TYPES.IUserSubscriptionRepository) private readonly subscriptionRepository: IUserSubscriptionRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private readonly planRepository: ISubscriptionPlanRepository,
    @inject(TYPES.IFeatureRepository) private readonly featureRepository: IFeatureRepository,
    @inject(TYPES.IUsageRecordRepository) private readonly usageRecordRepository: IUsageRecordRepository,
    @inject(TYPES.ITransactionService) private readonly transactionService: ITransactionService
  ) { }

  public async execute(
    userId: string,
    dto: CreateCommunityDTO,
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<CommunityResponseDTO> {
    // Validation
    if (!dto.name || dto.name.trim().length === 0) {
      throw new ValidationError('Community name is required');
    }
    if (!dto.description || dto.description.trim().length === 0) {
      throw new ValidationError('Community description is required');
    }
    if (!dto.category || dto.category.trim().length === 0) {
      throw new ValidationError('Community category is required');
    }

    // ============================================
    // SUBSCRIPTION AND FEATURE CHECK - INDUSTRIAL LEVEL
    // ============================================
    
    // 1. Check if user has an active subscription
    const subscription = await this.subscriptionRepository.findByUserId(userId);
    
    if (!subscription) {
      throw new ForbiddenError('You need an active subscription to create communities. Please subscribe to a plan first.');
    }

    // 2. Verify subscription is active
    if (!subscription.isActive()) {
      throw new ForbiddenError('Your subscription is not active. Please renew your subscription to create communities.');
    }

    // 3. Get subscription plan with features
    const plan = await this.planRepository.findById(subscription.planId);
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    // 4. Check limits (legacy or feature model)
    let limitValue: number | null | undefined = undefined;
    let featureKey: string = 'create_community';
    let createCommunityFeature: any = null;

    const legacyLimit = plan.createCommunity;
    
    if (legacyLimit !== null && legacyLimit !== undefined) {
      limitValue = legacyLimit;
      featureKey = 'create_community';
    } else {
      const features = await this.featureRepository.findByPlanId(plan.id);
      createCommunityFeature = features.find(
        f => f.name.toLowerCase() === 'create_community' || 
             f.name.toLowerCase() === 'create community' ||
             f.name.toLowerCase() === 'community_creation' ||
             f.name.toLowerCase() === 'communities'
      );

      if (!createCommunityFeature) {
        throw new ForbiddenError('Your subscription plan does not include community creation feature.');
      }

      if (!createCommunityFeature.isEnabled) {
        throw new ForbiddenError('Community creation feature is disabled for your plan.');
      }

      if (createCommunityFeature.featureType === FeatureType.NUMERIC_LIMIT) {
        limitValue = createCommunityFeature.limitValue;
        featureKey = createCommunityFeature.name;
        
        if (limitValue === null || limitValue === undefined) {
          throw new ForbiddenError('Community creation limit is not configured for your plan.');
        }
      } else if (createCommunityFeature.featureType === FeatureType.BOOLEAN) {
        if (!createCommunityFeature.isEnabled) {
          throw new ForbiddenError('Community creation is not available in your plan.');
        }
        limitValue = -1; // Unlimited
        featureKey = createCommunityFeature.name;
      } else {
        throw new ForbiddenError('Invalid feature type for community creation.');
      }
    }

    // 5. Check current usage
    let currentUsage = 0;
    
    if (limitValue !== null && limitValue !== undefined && limitValue !== -1) {
      const currentUsageRecords = await this.usageRecordRepository.findBySubscriptionId(subscription.id);
      const featureUsageRecord = currentUsageRecords.find(
        record => 
          record.featureKey === featureKey &&
          record.periodStart <= subscription.currentPeriodEnd &&
          record.periodEnd >= subscription.currentPeriodStart
      );

      currentUsage = featureUsageRecord ? featureUsageRecord.usageCount : 0;

      if (currentUsage >= limitValue) {
        throw new ForbiddenError(
          `You have reached your community creation limit (${limitValue}). Please upgrade your plan or wait for your billing period to reset.`
        );
      }
    }

    // 6. Handle image upload
    let imageUrl: string | null = null;
    if (imageFile) {
      if (imageFile.buffer.length > 5 * 1024 * 1024) {
        throw new ValidationError('Image size must be less than 5MB');
      }
      if (!imageFile.mimetype.startsWith('image/')) {
        throw new ValidationError('Only image files are allowed');
      }

      try {
        const timestamp = Date.now();
        // Sanitize filename: replace spaces with hyphens and remove special characters
        const sanitizedFilename = imageFile.originalname
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/[^a-zA-Z0-9.-]/g, '') // Remove special characters except dots and hyphens
          .toLowerCase(); // Convert to lowercase for consistency
        const key = `communities/${userId}/${timestamp}-${sanitizedFilename}`;
        imageUrl = await this.storageService.uploadFile(imageFile.buffer, key, imageFile.mimetype);
      } catch (error) {
        throw new InternalServerError('Failed to upload image. Please try again.');
      }
    }

    // 7. Create community entity
    const community = new Community({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      imageUrl,
      adminId: userId,
      creditsCost: dto.creditsCost,
      creditsPeriod: dto.creditsPeriod,
    });

    // 8. Use transaction service for atomic operations
    const createdCommunity = await this.transactionService.execute(async (repos) => {
      // Create community using repository
      const created = await repos.communityRepository.create(community);

      // Create admin member
      const adminMember = new CommunityMember({
        communityId: community.id,
        userId,
        role: 'admin',
      });
      await repos.communityRepository.addMember(adminMember);

      // Track feature usage if needed
      if (limitValue !== null && limitValue !== undefined && limitValue !== -1) {
        try {
          const existingUsageRecord = await repos.usageRecordRepository.findBySubscriptionAndFeature(
            subscription.id,
            featureKey,
            subscription.currentPeriodStart,
            subscription.currentPeriodEnd
          );

          if (existingUsageRecord) {
            existingUsageRecord.incrementUsage(1);
            await repos.usageRecordRepository.update(existingUsageRecord);
          } else {
            const newUsageRecord = new UsageRecord({
              id: uuidv4(),
              subscriptionId: subscription.id,
              featureKey: featureKey,
              usageCount: 1,
              limitValue: limitValue,
              periodStart: subscription.currentPeriodStart,
              periodEnd: subscription.currentPeriodEnd,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            await repos.usageRecordRepository.create(newUsageRecord);
          }
        } catch (usageError) {
          console.error('[CreateCommunityUseCase] Failed to track feature usage:', usageError);
        }
      }

      return created;
    });

    // 9. Return DTO using mapper
    return await this.communityMapper.toDTO(createdCommunity, userId);
  }
}