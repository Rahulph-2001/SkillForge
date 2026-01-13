import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetProviderReviewsUseCase } from './interfaces/IGetProviderReviewsUseCase';
import { ProviderReviewResponseDTO } from '../../dto/user/ProviderReviewResponseDTO';

@injectable()
export class GetProviderReviewsUseCase implements IGetProviderReviewsUseCase {
  constructor() {
    // TODO: Inject review repository when reviews model is implemented
  }

  async execute(_userId: string): Promise<ProviderReviewResponseDTO[]> {
    // TODO: Implement when reviews model is created
    // For now, return empty array as per original implementation
    return [];
  }
}

