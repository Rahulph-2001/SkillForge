import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
import { SendMessageDTO } from '../../dto/community/SendMessageDTO';
import { ICommunityMessageMapper } from '../../mappers/interfaces/ICommunityMessageMapper';
import { ISendMessageUseCase } from './interfaces/ISendMessageUseCase';
export declare class SendMessageUseCase implements ISendMessageUseCase {
    private readonly messageRepository;
    private readonly communityRepository;
    private readonly storageService;
    private readonly webSocketService;
    private readonly messageMapper;
    constructor(messageRepository: ICommunityMessageRepository, communityRepository: ICommunityRepository, storageService: IStorageService, webSocketService: IWebSocketService, messageMapper: ICommunityMessageMapper);
    execute(userId: string, dto: SendMessageDTO, file?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<CommunityMessage>;
}
//# sourceMappingURL=SendMessageUseCase.d.ts.map