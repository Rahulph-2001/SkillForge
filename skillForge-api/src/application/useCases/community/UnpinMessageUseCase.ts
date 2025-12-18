import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
export interface IUnpinMessageUseCase {
  execute(userId: string, messageId: string): Promise<CommunityMessage>;
}
@injectable()
export class UnpinMessageUseCase implements IUnpinMessageUseCase {
  constructor(
    @inject(TYPES.ICommunityMessageRepository) private readonly messageRepository: ICommunityMessageRepository,
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService
  ) {}
  public async execute(userId: string, messageId: string): Promise<CommunityMessage> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundError('Message not found');
    }
    const community = await this.communityRepository.findById(message.communityId);
    if (!community) {
      throw new NotFoundError('Community not found');
    }
    if (community.adminId !== userId) {
      throw new ForbiddenError('Only community admin can unpin messages');
    }
    message.unpin();
    const updatedMessage = await this.messageRepository.update(message);
    this.webSocketService.sendToCommunity(message.communityId, {
      type: 'unpin',
      communityId: message.communityId,
      data: updatedMessage.toJSON(),
    });
    return updatedMessage;
  }
}
