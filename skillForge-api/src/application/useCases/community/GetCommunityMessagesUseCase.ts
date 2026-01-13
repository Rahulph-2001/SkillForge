import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { IGetCommunityMessagesUseCase } from './interfaces/IGetCommunityMessagesUseCase';
@injectable()
export class GetCommunityMessagesUseCase implements IGetCommunityMessagesUseCase {
  constructor(
    @inject(TYPES.ICommunityMessageRepository) private readonly messageRepository: ICommunityMessageRepository,
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
  ) { }

  public async execute(userId: string, communityId: string, limit = 50, offset = 0): Promise<CommunityMessage[]> {
    // First, allow community admins to fetch messages even if not in members table
    const community = await this.communityRepository.findById(communityId);
    if (!community) {
      throw new ForbiddenError('Community not found');
    }
    if (community.adminId !== userId) {
      // Check active membership
      const member = await this.communityRepository.findMemberByUserAndCommunity(userId, communityId);
      if (!member || !member.isActive) {
        throw new ForbiddenError('You are not a member of this community');
      }
    }
    return await this.messageRepository.findByCommunityId(communityId, limit, offset);
  }
}