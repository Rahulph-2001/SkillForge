import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
export interface IDeleteMessageUseCase {
  execute(userId: string, messageId: string): Promise<void>;
}
@injectable()
export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(
    @inject(TYPES.ICommunityMessageRepository) private readonly messageRepository: ICommunityMessageRepository,
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService
  ) {}
  public async execute(userId: string, messageId: string): Promise<void> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundError('Message not found');
    }
    const community = await this.communityRepository.findById(message.communityId);
    if (!community) {
      throw new NotFoundError('Community not found');
    }
    if (message.senderId !== userId && community.adminId !== userId) {
      throw new ForbiddenError('You can only delete your own messages or admin can delete any message');
    }
    message.delete();
    await this.messageRepository.update(message);
    this.webSocketService.sendToCommunity(message.communityId, {
      type: 'delete',
      communityId: message.communityId,
      data: { messageId },
    });
  }
}
