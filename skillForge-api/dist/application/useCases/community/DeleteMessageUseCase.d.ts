import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { IDeleteMessageUseCase } from './interfaces/IDeleteMessageUseCase';
export declare class DeleteMessageUseCase implements IDeleteMessageUseCase {
    private readonly messageRepository;
    private readonly communityRepository;
    private readonly webSocketService;
    constructor(messageRepository: ICommunityMessageRepository, communityRepository: ICommunityRepository, webSocketService: IWebSocketService);
    execute(userId: string, messageId: string): Promise<void>;
}
//# sourceMappingURL=DeleteMessageUseCase.d.ts.map