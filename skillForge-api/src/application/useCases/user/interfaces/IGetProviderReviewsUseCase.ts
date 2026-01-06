import { ProviderReviewResponseDTO } from '../../../dto/user/ProviderReviewResponseDTO';

export interface IGetProviderReviewsUseCase {
  execute(userId: string): Promise<ProviderReviewResponseDTO[]>;
}

