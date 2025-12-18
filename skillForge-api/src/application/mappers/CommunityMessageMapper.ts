import { injectable, inject } from 'inversify';
import { ICommunityMessageMapper } from './interfaces/ICommunityMessageMapper';
import { CommunityMessage } from '../../domain/entities/CommunityMessage';
import { MessageResponseDTO } from '../dto/community/MessageResponseDTO';
import { TYPES } from '../../infrastructure/di/types';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ICommunityMessageRepository } from '../../domain/repositories/ICommunityMessageRepository';
@injectable()
export class CommunityMessageMapper implements ICommunityMessageMapper {
  constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.ICommunityMessageRepository) private readonly messageRepository: ICommunityMessageRepository
  ) {}
  public async toDTO(message: CommunityMessage): Promise<MessageResponseDTO> {
    const sender = await this.userRepository.findById(message.senderId);
    let replyTo: MessageResponseDTO | undefined;
    if (message.replyToId) {
      const replyToMessage = await this.messageRepository.findById(message.replyToId);
      if (replyToMessage) {
        replyTo = await this.toDTO(replyToMessage);
      }
    }
    return {
      id: message.id,
      communityId: message.communityId,
      senderId: message.senderId,
      senderName: sender?.name || 'Unknown',
      senderAvatar: sender?.avatarUrl || null,
      content: message.content,
      type: message.type,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      isPinned: message.isPinned,
      pinnedAt: message.pinnedAt,
      pinnedBy: message.pinnedBy,
      replyToId: message.replyToId,
      forwardedFromId: message.forwardedFromId,
      replyTo,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
  public async toDTOList(messages: CommunityMessage[]): Promise<MessageResponseDTO[]> {
    return Promise.all(messages.map(message => this.toDTO(message)));
  }
}