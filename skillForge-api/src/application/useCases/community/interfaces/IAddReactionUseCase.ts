import { MessageReaction } from '../../../../domain/entities/MessageReaction';

export interface IAddReactionUseCase {
    execute(userId: string, messageId: string, emoji: string): Promise<MessageReaction>;
}

