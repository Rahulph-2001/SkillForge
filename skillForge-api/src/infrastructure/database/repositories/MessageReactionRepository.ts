import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../di/types';
import { IMessageReactionRepository } from '../../../domain/repositories/IMessageReactionRepository';
import { MessageReaction } from '../../../domain/entities/MessageReaction';

@injectable()
export class MessageReactionRepository implements IMessageReactionRepository {
    constructor(
        @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
    ) { }

    public async create(reaction: MessageReaction): Promise<MessageReaction> {
        const data = reaction.toJSON();

        // Upsert: create if doesn't exist, or update createdAt if it does
        const created = await this.prisma.messageReaction.upsert({
            where: {
                messageId_userId_emoji: {
                    messageId: data.messageId as string,
                    userId: data.userId as string,
                    emoji: data.emoji as string,
                },
            },
            update: {
                createdAt: new Date(),
            },
            create: {
                id: data.id as string,
                messageId: data.messageId as string,
                userId: data.userId as string,
                emoji: data.emoji as string,
                createdAt: data.createdAt as Date,
            },
            include: { user: true },
        });

        return MessageReaction.fromDatabaseRow(created);
    }

    public async delete(messageId: string, userId: string, emoji: string): Promise<void> {
        await this.prisma.messageReaction.deleteMany({
            where: { messageId, userId, emoji },
        });
    }

    public async findByMessageId(messageId: string): Promise<MessageReaction[]> {
        const reactions = await this.prisma.messageReaction.findMany({
            where: { messageId },
            include: { user: true },
            orderBy: { createdAt: 'asc' },
        });

        return reactions.map(r => MessageReaction.fromDatabaseRow(r));
    }

    public async findByMessageAndUser(messageId: string, userId: string, emoji: string): Promise<MessageReaction | null> {
        const reaction = await this.prisma.messageReaction.findUnique({
            where: {
                messageId_userId_emoji: {
                    messageId,
                    userId,
                    emoji,
                },
            },
            include: { user: true },
        });

        return reaction ? MessageReaction.fromDatabaseRow(reaction) : null;
    }
}
