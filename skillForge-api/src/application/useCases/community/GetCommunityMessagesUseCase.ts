import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
import { ForbiddenError } from '../../../domain/errors/AppError';


export interface IGetCommunityMessagesUseCase {
  execute(userId: string, communityId: string, limit?: number, offset?: number): Promise<CommunityMessage[]>;
}
@injectable()
export class GetCommunityMessagesUseCase implements IGetCommunityMessagesUseCase {
  constructor(
    @inject(TYPES.ICommunityMessageRepository) private readonly messageRepository: ICommunityMessageRepository,
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
  ) { }
  public async execute(userId: string, communityId: string, limit = 50, offset = 0): Promise<CommunityMessage[]> {
    const member = await this.communityRepository.findMemberByUserAndCommunity(userId, communityId);
    if (!member || !member.isActive) {
      throw new ForbiddenError('You are not a member of this community');
    }
    return await this.messageRepository.findByCommunityId(communityId, limit, offset);
  }
}