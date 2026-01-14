import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { NotFoundError } from '../../../domain/errors/AppError';
import { IGetUserProfileUseCase, UserProfileDTO } from './interfaces/IGetUserProfileUseCase';

@injectable()
export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository,
    @inject(TYPES.IUserSubscriptionRepository) private readonly subscriptionRepository: IUserSubscriptionRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private readonly planRepository: ISubscriptionPlanRepository,
    @inject(TYPES.IUsageRecordRepository) private readonly usageRecordRepository: IUsageRecordRepository
  ) { }

  async execute(userId: string): Promise<UserProfileDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Count skills offered by this user
    const skills = await this.skillRepository.findByProviderId(userId);
    const skillsOffered = skills.filter(s =>
      s.status === 'approved' &&
      s.verificationStatus === 'passed' &&
      !s.isBlocked &&
      !s.isAdminBlocked
    ).length;

    // Get Subscription Stats
    let projectPostLimit: number | null = 0; // Default to 0 if no plan (or Free logic TBD)
    let projectPostUsage = 0;
    let communityCreateLimit: number | null = 0;
    let communityCreateUsage = 0;

    const subscription = await this.subscriptionRepository.findByUserId(userId);

    if (subscription) {
      // Get Plan Limits
      const plan = await this.planRepository.findById(subscription.planId);
      if (plan) {
        // Project Posts
        projectPostLimit = plan.projectPosts;
        // Community Creation
        communityCreateLimit = plan.createCommunity;
      }

      // Get Usage
      // Since feature keys might vary, we fetch all for this subscription and filter
      const usageRecords = await this.usageRecordRepository.findBySubscriptionId(subscription.id);

      // Project Posts
      const projectUsageRecord = usageRecords.find(r => r.featureKey === 'project_posts');
      if (projectUsageRecord && projectUsageRecord.isPeriodActive()) {
        projectPostUsage = projectUsageRecord.usageCount;
      }

      // Community Creation
      // Logic from CreateCommunityUseCase checks 'create_community' or feature name.
      // We'll look for standard keys or assume 'create_community' is the primary one used by legacy logic.
      const communityUsageRecord = usageRecords.find(r =>
        r.featureKey === 'create_community' ||
        r.featureKey === 'create community' ||
        r.featureKey === 'community_creation'
      );
      if (communityUsageRecord && communityUsageRecord.isPeriodActive()) {
        communityCreateUsage = communityUsageRecord.usageCount;
      }
    } else {
      // Handle "Free" plan defaults if no subscription record exists but user is conceptually on "Free"
      // Often "Free" users might not have a subscription record if the system creates it only on upgrade.
      // If your system creates a "Free" subscription on registration, the above if(subscription) covers it.
      // Providing safe defaults here:
      projectPostLimit = 2; // Hardcoded default for free tier as seen in UI
      communityCreateLimit = 0;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      credits: user.credits,
      walletBalance: Number(user.walletBalance),
      skillsOffered,
      rating: user.rating ? Number(user.rating) : 0,
      reviewCount: user.reviewCount,
      totalSessionsCompleted: user.totalSessionsCompleted,
      memberSince: user.memberSince ? user.memberSince.toISOString() : new Date().toISOString(),
      subscriptionPlan: user.subscriptionPlan || '',
      subscriptionValidUntil: user.subscriptionValidUntil?.toISOString() || null,
      projectPostLimit,
      projectPostUsage,
      communityCreateLimit,
      communityCreateUsage
    };
  }
}
