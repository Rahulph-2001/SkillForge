import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
import { SendMessageDTO } from '../../dto/community/SendMessageDTO';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { ICommunityMessageMapper } from '../../mappers/interfaces/ICommunityMessageMapper';
import { ISendMessageUseCase } from './interfaces/ISendMessageUseCase';

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject(TYPES.ICommunityMessageRepository) private readonly messageRepository: ICommunityMessageRepository,
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
    @inject(TYPES.IStorageService) private readonly storageService: IStorageService,
    @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService,
    @inject(TYPES.ICommunityMessageMapper) private readonly messageMapper: ICommunityMessageMapper
  ) { }

  public async execute(
    userId: string,
    dto: SendMessageDTO,
    file?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<CommunityMessage> {
    const member = await this.communityRepository.findMemberByUserAndCommunity(userId, dto.communityId);
    if (!member || !member.isActive) {
      throw new ForbiddenError('You are not a member of this community');
    }

    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let messageType = dto.type || 'text';

    if (file) {
      const timestamp = Date.now();
      const key = `communities/${dto.communityId}/files/${userId}/${timestamp}-${file.originalname}`;
      fileUrl = await this.storageService.uploadFile(file.buffer, key, file.mimetype);
      fileName = file.originalname;

      if (file.mimetype.startsWith('image/')) {
        messageType = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        messageType = 'video';
      } else {
        messageType = 'file';
      }
    }

    const message = new CommunityMessage({
      communityId: dto.communityId,
      senderId: userId,
      content: dto.content,
      type: messageType,
      fileUrl,
      fileName,
      replyToId: dto.replyToId,
    });

    const createdMessage = await this.messageRepository.create(message);
    const messageDTO = await this.messageMapper.toDTO(createdMessage);

    // Broadcast via WebSocket
    this.webSocketService.sendToCommunity(dto.communityId, {
      type: 'message_sent',
      communityId: dto.communityId,
      data: messageDTO,
    });

    return createdMessage;
  }
}