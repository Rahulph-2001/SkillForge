import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IMessageReactionRepository } from '../../../domain/repositories/IMessageReactionRepository';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { MessageReaction } from '../../../domain/entities/MessageReaction';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';

export interface IAddReactionUseCase {
    execute(userId: string, messageId: string, emoji: string): Promise<MessageReaction>;
}

@injectable()
export class AddReactionUseCase implements IAddReactionUseCase {
    constructor(
        @inject(TYPES.IMessageReactionRepository) private readonly reactionRepository: IMessageReactionRepository,
        @inject(TYPES.ICommunityMessageRepository) private readonly messageRepository: ICommunityMessageRepository,
        @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService
    ) { }

    public async execute(userId: string, messageId: string, emoji: string): Promise<MessageReaction> {
        // Validate emoji
        if (!emoji || emoji.trim().length === 0) {
            throw new ValidationError('Emoji cannot be empty');
        }
        if (emoji.length > 10) {
            throw new ValidationError('Invalid emoji');
        }

        // Verify message exists
        const message = await this.messageRepository.findById(messageId);
        if (!message) {
            throw new NotFoundError('Message not found');
        }

        // Create or update reaction (upsert)
        const reaction = new MessageReaction({ messageId, userId, emoji });
        const createdReaction = await this.reactionRepository.create(reaction);

        // Get all reactions for this message to send full state
        const allReactions = await this.reactionRepository.findByMessageId(messageId);

        // Group reactions by emoji with user lists
        const groupedReactions = this.groupReactionsByEmoji(allReactions, userId);

        // Broadcast reaction event
        this.webSocketService.sendToCommunity(message.communityId, {
            type: 'reaction_added',
            communityId: message.communityId,
            data: {
                messageId,
                reactions: groupedReactions,
            },
        });

        return createdReaction;
    }

    private groupReactionsByEmoji(reactions: MessageReaction[], currentUserId: string) {
        const grouped = new Map<string, { emoji: string; users: any[]; count: number; hasReacted: boolean }>();

        reactions.forEach(reaction => {
            const emoji = reaction.emoji;
            if (!grouped.has(emoji)) {
                grouped.set(emoji, {
                    emoji,
                    users: [],
                    count: 0,
                    hasReacted: false,
                });
            }

            const group = grouped.get(emoji)!;
            group.users.push({
                id: reaction.userId,
                name: reaction.userName || 'Unknown',
                avatar: reaction.userAvatar,
            });
            group.count++;
            if (reaction.userId === currentUserId) {
                group.hasReacted = true;
            }
        });

        return Array.from(grouped.values());
    }
}
