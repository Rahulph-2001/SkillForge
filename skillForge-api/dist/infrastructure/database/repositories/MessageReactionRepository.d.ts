import { PrismaClient } from '@prisma/client';
import { IMessageReactionRepository } from '../../../domain/repositories/IMessageReactionRepository';
import { MessageReaction } from '../../../domain/entities/MessageReaction';
export declare class MessageReactionRepository implements IMessageReactionRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(reaction: MessageReaction): Promise<MessageReaction>;
    delete(messageId: string, userId: string, emoji: string): Promise<void>;
    findByMessageId(messageId: string): Promise<MessageReaction[]>;
    findByMessageAndUser(messageId: string, userId: string, emoji: string): Promise<MessageReaction | null>;
}
//# sourceMappingURL=MessageReactionRepository.d.ts.map