import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';


export interface IGetCommunitiesUseCase {
  execute(filters?: { category?: string }): Promise<Community[]>;
}
@injectable()
export class GetCommunitiesUseCase implements IGetCommunitiesUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
  ) { }
  public async execute(filters?: { category?: string }): Promise<Community[]> {
    return await this.communityRepository.findAll({ ...filters, isActive: true });
  }
}