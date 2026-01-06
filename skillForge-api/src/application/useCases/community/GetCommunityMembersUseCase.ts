import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IGetCommunityMembersUseCase } from './interfaces/IGetCommunityMembersUseCase';
import { CommunityMemberResponseDTO } from '../../dto/community/CommunityMemberResponseDTO';

@injectable()
export class GetCommunityMembersUseCase implements IGetCommunityMembersUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
  ) {}

  async execute(
    communityId: string,
    limit: number,
    offset: number
  ): Promise<{
    members: CommunityMemberResponseDTO[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const members = await this.communityRepository.findMembersByCommunityId(communityId);
    const paginatedMembers = members.slice(offset, offset + limit);

    return {
      members: paginatedMembers.map(m => m.toJSON() as CommunityMemberResponseDTO),
      total: members.length,
      limit,
      offset,
    };
  }
}

