import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { NotFoundError } from '../../../domain/errors/AppError';
import { IGetUserProfileUseCase, UserProfileDTO } from './interfaces/IGetUserProfileUseCase';

@injectable()
export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository
  ) {}

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
    };
  }
}
