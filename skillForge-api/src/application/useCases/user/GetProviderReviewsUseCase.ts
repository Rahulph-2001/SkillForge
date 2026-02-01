import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetProviderReviewsUseCase } from './interfaces/IGetProviderReviewsUseCase';
import { ProviderReviewResponseDTO } from '../../dto/user/ProviderReviewResponseDTO';
import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';

@injectable()
export class GetProviderReviewsUseCase implements IGetProviderReviewsUseCase {
  constructor(
    @inject(TYPES.IReviewRepository) private readonly reviewRepository: IReviewRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository,
  ) { }

  async execute(userId: string): Promise<ProviderReviewResponseDTO[]> {
    // Fetch all reviews where the user is the provider
    const reviews = await this.reviewRepository.findByProviderId(userId);

    // Map reviews to DTOs with learner information and skill title
    const reviewDTOs: ProviderReviewResponseDTO[] = await Promise.all(
      reviews.map(async (review) => {
        // Get learner info for each review
        const learner = await this.userRepository.findById(review.learnerId);
        // Get skill title
        const skill = await this.skillRepository.findById(review.skillId);
        return {
          id: review.id,
          userName: learner?.name || 'Anonymous',
          userAvatar: learner?.avatarUrl || null,
          rating: review.rating,
          comment: review.review,
          skillTitle: skill?.title || 'Session',
          createdAt: review.createdAt,
        };
      })
    );

    return reviewDTOs;
  }
}
