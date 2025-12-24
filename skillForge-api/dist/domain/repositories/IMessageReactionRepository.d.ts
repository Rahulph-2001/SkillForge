import { MessageReaction } from '../entities/MessageReaction';
export interface IMessageReactionRepository {
    create(reaction: MessageReaction): Promise<MessageReaction>;
    delete(messageId: string, userId: string, emoji: string): Promise<void>;
    findByMessageId(messageId: string): Promise<MessageReaction[]>;
    findByMessageAndUser(messageId: string, userId: string, emoji: string): Promise<MessageReaction | null>;
}
//# sourceMappingURL=IMessageReactionRepository.d.ts.map