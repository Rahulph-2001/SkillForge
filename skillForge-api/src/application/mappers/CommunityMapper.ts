import { injectable, inject } from 'inversify';
import { ICommunityMapper } from './interfaces/ICommunityMapper';
import { Community } from '../../domain/entities/Community';
import { CommunityResponseDTO } from '../dto/community/CommunityResponseDTO';
import { TYPES } from '../../infrastructure/di/types';
import { ICommunityRepository } from '../../domain/repositories/ICommunityRepository';
@injectable()
export class CommunityMapper implements ICommunityMapper {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
  ) { }
  public toDTO(community: Community, userId?: string): CommunityResponseDTO {
    return {
      id: community.id,
      name: community.name,
      description: community.description,
      category: community.category,
      imageUrl: community.imageUrl,
      videoUrl: community.videoUrl,
      adminId: community.adminId,
      creditsCost: community.creditsCost,
      creditsPeriod: community.creditsPeriod,
      membersCount: community.membersCount,
      isActive: community.isActive,
      createdAt: community.createdAt,
      updatedAt: community.updatedAt,
      isAdmin: (userId && community.adminId === userId) || community.isAdmin || false,
      isJoined: community.isJoined || false,
    };
  }
  public toDTOList(communities: Community[], userId?: string): CommunityResponseDTO[] {
    return communities.map(community => this.toDTO(community, userId));
  }
}
