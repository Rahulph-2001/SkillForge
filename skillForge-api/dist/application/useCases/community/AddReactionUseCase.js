"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReactionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const MessageReaction_1 = require("../../../domain/entities/MessageReaction");
const AppError_1 = require("../../../domain/errors/AppError");
let AddReactionUseCase = class AddReactionUseCase {
    constructor(reactionRepository, messageRepository, webSocketService) {
        this.reactionRepository = reactionRepository;
        this.messageRepository = messageRepository;
        this.webSocketService = webSocketService;
    }
    async execute(userId, messageId, emoji) {
        // Validate emoji
        if (!emoji || emoji.trim().length === 0) {
            throw new AppError_1.ValidationError('Emoji cannot be empty');
        }
        if (emoji.length > 10) {
            throw new AppError_1.ValidationError('Invalid emoji');
        }
        // Verify message exists
        const message = await this.messageRepository.findById(messageId);
        if (!message) {
            throw new AppError_1.NotFoundError('Message not found');
        }
        // Create or update reaction (upsert)
        const reaction = new MessageReaction_1.MessageReaction({ messageId, userId, emoji });
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
    groupReactionsByEmoji(reactions, currentUserId) {
        const grouped = new Map();
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
            const group = grouped.get(emoji);
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
};
exports.AddReactionUseCase = AddReactionUseCase;
exports.AddReactionUseCase = AddReactionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IMessageReactionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICommunityMessageRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IWebSocketService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AddReactionUseCase);
//# sourceMappingURL=AddReactionUseCase.js.map