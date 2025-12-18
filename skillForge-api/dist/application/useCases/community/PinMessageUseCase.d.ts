import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';
export interface IPinMessageUseCase {
    execute(userId: string, messageId: string): Promise<CommunityMessage>;
}
export declare class PinMessageUseCase implements IPinMessageUseCase {
    private readonly messageRepository;
    private readonly communityRepository;
    private readonly webSocketService;
    constructor(messageRepository: ICommunityMessageRepository, communityRepository: ICommunityRepository, webSocketService: IWebSocketService);
    execute(userId: string, messageId: string): Promise<CommunityMessage>;
}
//# sourceMappingURL=PinMessageUseCase.d.ts.map