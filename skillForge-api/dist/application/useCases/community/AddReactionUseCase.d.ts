import { IMessageReactionRepository } from '../../../domain/repositories/IMessageReactionRepository';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { MessageReaction } from '../../../domain/entities/MessageReaction';
export interface IAddReactionUseCase {
    execute(userId: string, messageId: string, emoji: string): Promise<MessageReaction>;
}
export declare class AddReactionUseCase implements IAddReactionUseCase {
    private readonly reactionRepository;
    private readonly messageRepository;
    private readonly webSocketService;
    constructor(reactionRepository: IMessageReactionRepository, messageRepository: ICommunityMessageRepository, webSocketService: IWebSocketService);
    execute(userId: string, messageId: string, emoji: string): Promise<MessageReaction>;
    private groupReactionsByEmoji;
}
//# sourceMappingURL=AddReactionUseCase.d.ts.map