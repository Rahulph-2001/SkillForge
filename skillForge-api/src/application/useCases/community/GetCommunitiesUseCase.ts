import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { IPaginationResult } from '../../../domain/types/IPaginationParams';
import { IGetCommunitiesUseCase } from './interfaces/IGetCommunitiesUseCase';

@injectable()
export class GetCommunitiesUseCase implements IGetCommunitiesUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IPaginationService) private readonly paginationService: IPaginationService
  ) { }
  public async execute(
    filters?: { category?: string; search?: string },
    userId?: string,
    page: number = 1,
    limit: number = 12
  ): Promise<IPaginationResult<Community>> {
    const paginationParams = this.paginationService.createParams(page, limit);

    const { communities, total } = await this.communityRepository.findAllWithPagination(
      {
        category: filters?.category,
        search: filters?.search,
        isActive: true
      },
      {
        skip: paginationParams.skip,
        take: paginationParams.take
      }
    );

    let processedCommunities = communities;

    if (userId) {
      const memberships = await this.communityRepository.findMembershipsByUserId(userId);
      const joinedCommunityIds = new Set(memberships.map(m => m.communityId));

      processedCommunities = communities.map(community => {
        const isJoined = joinedCommunityIds.has(community.id);
        const isAdmin = community.adminId === userId;
        community.isJoined = isJoined;
        community.isAdmin = isAdmin;
        return community;
      });
    }

    return this.paginationService.createResult(
      processedCommunities,
      total,
      paginationParams.page,
      paginationParams.limit
    );
  }
}