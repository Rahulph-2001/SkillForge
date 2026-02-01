import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { ICommunityMapper } from '../../mappers/interfaces/ICommunityMapper';
import { CommunityResponseDTO } from '../../dto/community/CommunityResponseDTO';
import { NotFoundError } from '../../../domain/errors/AppError';
import { IGetCommunityDetailsUseCase } from './interfaces/IGetCommunityDetailsUseCase';

@injectable()
export class GetCommunityDetailsUseCase implements IGetCommunityDetailsUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.ICommunityMapper) private readonly communityMapper: ICommunityMapper
  ) { }

  public async execute(communityId: string, userId?: string): Promise<CommunityResponseDTO> {
    const community = await this.communityRepository.findById(communityId);
    if (!community) {
      throw new NotFoundError('Community not found');
    }

    if (userId) {
      const membership = await this.communityRepository.findMemberByUserAndCommunity(userId, communityId);
      // Check if membership exists AND is active
      community.setIsJoined(!!membership && membership.isActive);
      community.setIsAdmin(community.adminId === userId);
    }

    return this.communityMapper.toDTO(community, userId);
  }
}