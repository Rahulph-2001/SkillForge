import { type CommunityMessage } from '../../../../domain/entities/CommunityMessage';

export interface IPinMessageUseCase {
  execute(userId: string, messageId: string): Promise<CommunityMessage>;
}

