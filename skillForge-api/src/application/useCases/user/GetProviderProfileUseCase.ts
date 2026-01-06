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
  ) {}

  async execute(userId: string): Promise<ProviderProfileResponseDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user || user.isDeleted || !user.isActive) {
      throw new NotFoundError('User not found');
    }

    const userData = user.toJSON();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: userData.avatarUrl as string | null,
      bio: userData.bio as string | null,
      location: userData.location as string | null,
      rating: userData.rating as number | null,
      reviewCount: userData.reviewCount as number || 0,
      totalSessionsCompleted: userData.totalSessionsCompleted as number || 0,
      memberSince: userData.memberSince as Date,
      verification: userData.verification as boolean || false,
      skillsOffered: [], // TODO: Fetch from skill repository when needed
    };
  }
}

