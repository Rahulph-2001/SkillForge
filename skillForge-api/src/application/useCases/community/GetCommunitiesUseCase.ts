import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';


export interface IGetCommunitiesUseCase {
  execute(filters?: { category?: string }, userId?: string): Promise<Community[]>;
}
@injectable()
export class GetCommunitiesUseCase implements IGetCommunitiesUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
  ) { }
  public async execute(filters?: { category?: string }, userId?: string): Promise<Community[]> {
    const communities = await this.communityRepository.findAll({ ...filters, isActive: true });

    if (userId) {
      const memberships = await this.communityRepository.findMembershipsByUserId(userId);
      const joinedCommunityIds = new Set(memberships.map(m => m.communityId));

      return communities.map(community => {
        const isJoined = joinedCommunityIds.has(community.id);
        const isAdmin = community.adminId === userId;
        community.isJoined = isJoined;
        community.isAdmin = isAdmin;
        return community;
      });
    }

    return communities;
  }
}