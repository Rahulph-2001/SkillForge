import { IMessageReactionRepository } from '../../../domain/repositories/IMessageReactionRepository';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { IRemoveReactionUseCase } from './interfaces/IRemoveReactionUseCase';
export declare class RemoveReactionUseCase implements IRemoveReactionUseCase {
    private readonly reactionRepository;
    private readonly messageRepository;
    private readonly webSocketService;
    constructor(reactionRepository: IMessageReactionRepository, messageRepository: ICommunityMessageRepository, webSocketService: IWebSocketService);
    execute(userId: string, messageId: string, emoji: string): Promise<void>;
    private groupReactionsByEmoji;
}
//# sourceMappingURL=RemoveReactionUseCase.d.ts.map