import { MessageReaction } from '../../../../domain/entities/MessageReaction';
export interface IAddReactionUseCase {
    execute(userId: string, messageId: string, emoji: string): Promise<MessageReaction>;
}
//# sourceMappingURL=IAddReactionUseCase.d.ts.map