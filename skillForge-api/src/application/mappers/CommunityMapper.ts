// skillForge-api/src/application/mappers/CommunityMapper.ts
import { injectable, inject } from 'inversify';
import { ICommunityMapper } from './interfaces/ICommunityMapper';
import { Community } from '../../domain/entities/Community';
import { CommunityResponseDTO } from '../dto/community/CommunityResponseDTO';
import { TYPES } from '../../infrastructure/di/types';
import { ICommunityRepository } from '../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class CommunityMapper implements ICommunityMapper {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
  ) { }

  public async toDTO(community: Community, userId?: string): Promise<CommunityResponseDTO> {
  
    let adminName: string | undefined = undefined;
    let adminAvatar: string | null | undefined = undefined;

    try {
      const adminUser = await this.userRepository.findById(community.adminId);
      if (adminUser) {
        adminName = adminUser.name;
        adminAvatar = adminUser.avatarUrl;
      }
    } catch (error) {
      console.error('[CommunityMapper] Failed to fetch admin user:', error);
    }

    return {
      id: community.id,
      name: community.name,
      description: community.description,
      category: community.category,
      imageUrl: community.imageUrl,
      videoUrl: community.videoUrl,
      adminId: community.adminId,
      adminName: adminName,
      adminAvatar: adminAvatar,
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

  public async toDTOList(communities: Community[], userId?: string): Promise<CommunityResponseDTO[]> {
    const dtos = await Promise.all(
      communities.map(community => this.toDTO(community, userId))
    );
    return dtos;
  }
}