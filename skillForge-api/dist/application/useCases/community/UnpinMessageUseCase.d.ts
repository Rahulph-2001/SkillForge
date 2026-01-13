import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { ICommunityMessageMapper } from '../../mappers/interfaces/ICommunityMessageMapper';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
import { IUnpinMessageUseCase } from './interfaces/IUnpinMessageUseCase';
export declare class UnpinMessageUseCase implements IUnpinMessageUseCase {
    private readonly messageRepository;
    private readonly communityRepository;
    private readonly webSocketService;
    private readonly messageMapper;
    constructor(messageRepository: ICommunityMessageRepository, communityRepository: ICommunityRepository, webSocketService: IWebSocketService, messageMapper: ICommunityMessageMapper);
    execute(userId: string, messageId: string): Promise<CommunityMessage>;
}
//# sourceMappingURL=UnpinMessageUseCase.d.ts.map