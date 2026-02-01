import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetProviderProfileUseCase } from './interfaces/IGetProviderProfileUseCase';
import { ProviderProfileResponseDTO } from '../../dto/user/ProviderProfileResponseDTO';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class GetProviderProfileUseCase implements IGetProviderProfileUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
  ) { }

  async execute(userId: string): Promise<ProviderProfileResponseDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user || user.isDeleted || !user.isActive) {
      throw new NotFoundError('User not found');
    }

    const userData = user.toJSON();
    const verificationData = user.verification;

    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      avatarUrl: user.avatarUrl || (userData.avatarUrl as string | null) || (userData.avatar_url as string | null) || null,
      bio: userData.bio as string | null,
      location: userData.location as string | null,
      rating: Number(userData.rating) || 0,
      reviewCount: (userData.review_count as number) || 0,
      totalSessionsCompleted: (userData.total_sessions_completed as number) || 0,
      memberSince: (userData.member_since as Date) || new Date(),
      verification: {
        isEmailVerified: verificationData.email_verified || false,
        isPhoneVerified: false, // Phone verification not implemented yet
        isIdentityVerified: verificationData.bank_details?.verified || false,
      },
      skillsOffered: [], // TODO: Fetch from skill repository when needed
    };
  }
}

