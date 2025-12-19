import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';
import { NotFoundError } from '../../../domain/errors/AppError';

export interface IGetCommunityDetailsUseCase {
  execute(communityId: string, userId?: string): Promise<Community>;
}
@injectable()
export class GetCommunityDetailsUseCase implements IGetCommunityDetailsUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
  ) { }
  public async execute(communityId: string, userId?: string): Promise<Community> {
    const community = await this.communityRepository.findById(communityId);
    if (!community) {
      throw new NotFoundError('Community not found');
    }

    if (userId) {
      const membership = await this.communityRepository.findMemberByUserAndCommunity(userId, communityId);
      // Check if membership exists AND is active
      community.isJoined = !!membership && membership.isActive;
      community.isAdmin = community.adminId === userId;
    }

    return community;
  }
}