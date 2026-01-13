import { IMessageReactionRepository } from '../../../domain/repositories/IMessageReactionRepository';
import { MessageReaction } from '../../../domain/entities/MessageReaction';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class MessageReactionRepository extends BaseRepository<MessageReaction> implements IMessageReactionRepository {
    constructor(db: Database);
    delete(messageId: string, userId: string, emoji: string): Promise<void>;
    create(reaction: MessageReaction): Promise<MessageReaction>;
    findByMessageId(messageId: string): Promise<MessageReaction[]>;
    findByMessageAndUser(messageId: string, userId: string, emoji: string): Promise<MessageReaction | null>;
}
//# sourceMappingURL=MessageReactionRepository.d.ts.map