import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetCommunityMembersUseCase } from './interfaces/IGetCommunityMembersUseCase';
import { CommunityMemberResponseDTO } from '../../dto/community/CommunityMemberResponseDTO';

@injectable()
export class GetCommunityMembersUseCase implements IGetCommunityMembersUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
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

    // Map members to DTOs (user details are already fetched by repository)
    const membersWithUserDetails: CommunityMemberResponseDTO[] = paginatedMembers.map((m) => {
      const json = m.toJSON();
      return {
        id: json.id as string,
        userId: json.userId as string,
        communityId: json.communityId as string,
        role: json.role as string,
        isAutoRenew: json.isAutoRenew as boolean,
        subscriptionEndsAt: json.subscriptionEndsAt as Date | null,
        joinedAt: json.joinedAt as Date,
        leftAt: json.leftAt as Date | null,
        isActive: json.isActive as boolean,
        userName: json.userName as string | undefined,
        userAvatar: json.userAvatar as string | undefined,
      };
    });

    return {
      members: membersWithUserDetails,
      total: members.length,
      limit,
      offset,
    };
  }
}