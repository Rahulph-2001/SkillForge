import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IMessageReactionRepository } from '../../../domain/repositories/IMessageReactionRepository';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { MessageReaction } from '../../../domain/entities/MessageReaction';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';

export interface IRemoveReactionUseCase {
    execute(userId: string, messageId: string, emoji: string): Promise<void>;
}

@injectable()
export class RemoveReactionUseCase implements IRemoveReactionUseCase {
    constructor(
        @inject(TYPES.IMessageReactionRepository) private readonly reactionRepository: IMessageReactionRepository,
        @inject(TYPES.ICommunityMessageRepository) private readonly messageRepository: ICommunityMessageRepository,
        @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService
    ) { }

    public async execute(userId: string, messageId: string, emoji: string): Promise<void> {
        // Validate emoji
        if (!emoji || emoji.trim().length === 0) {
            throw new ValidationError('Emoji cannot be empty');
        }

        // Verify message exists
        const message = await this.messageRepository.findById(messageId);
        if (!message) {
            throw new NotFoundError('Message not found');
        }

        // Delete reaction
        await this.reactionRepository.delete(messageId, userId, emoji);

        // Get remaining reactions for this message
        const remainingReactions = await this.reactionRepository.findByMessageId(messageId);

        // Group reactions by emoji with user lists
        const groupedReactions = this.groupReactionsByEmoji(remainingReactions, userId);

        // Broadcast reaction removed event
        this.webSocketService.sendToCommunity(message.communityId, {
            type: 'reaction_removed',
            communityId: message.communityId,
            data: {
                messageId,
                reactions: groupedReactions,
            },
        });
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
