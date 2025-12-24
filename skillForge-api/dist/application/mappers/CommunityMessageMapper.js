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
exports.CommunityMessageMapper = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../infrastructure/di/types");
let CommunityMessageMapper = class CommunityMessageMapper {
    constructor(userRepository, messageRepository) {
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }
    async toDTO(message) {
        const sender = await this.userRepository.findById(message.senderId);
        let replyTo;
        if (message.replyToId) {
            const replyToMessage = await this.messageRepository.findById(message.replyToId);
            if (replyToMessage) {
                replyTo = await this.toDTO(replyToMessage);
            }
        }
        const messageData = message.toJSON();
        return {
            id: message.id,
            communityId: message.communityId,
            senderId: message.senderId,
            senderName: sender?.name || 'Unknown',
            senderAvatar: sender?.avatarUrl || null,
            content: message.content,
            type: message.type,
            fileUrl: message.fileUrl,
            fileName: message.fileName,
            isPinned: message.isPinned,
            pinnedAt: message.pinnedAt,
            pinnedBy: message.pinnedBy,
            replyToId: message.replyToId,
            forwardedFromId: message.forwardedFromId,
            replyTo,
            reactions: messageData.reactions || [],
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        };
    }
    async toDTOList(messages) {
        return Promise.all(messages.map(message => this.toDTO(message)));
    }
};
exports.CommunityMessageMapper = CommunityMessageMapper;
exports.CommunityMessageMapper = CommunityMessageMapper = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICommunityMessageRepository)),
    __metadata("design:paramtypes", [Object, Object])
], CommunityMessageMapper);
//# sourceMappingURL=CommunityMessageMapper.js.map