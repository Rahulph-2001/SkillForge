import { CommunityMessage } from '../../../../domain/entities/CommunityMessage';

export interface IGetCommunityMessagesUseCase {
  execute(userId: string, communityId: string, limit?: number, offset?: number): Promise<CommunityMessage[]>;
}

