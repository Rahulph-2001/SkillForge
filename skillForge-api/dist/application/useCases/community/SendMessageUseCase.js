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
exports.SendMessageUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const CommunityMessage_1 = require("../../../domain/entities/CommunityMessage");
const AppError_1 = require("../../../domain/errors/AppError");
let SendMessageUseCase = class SendMessageUseCase {
    constructor(messageRepository, communityRepository, storageService, webSocketService, messageMapper) {
        this.messageRepository = messageRepository;
        this.communityRepository = communityRepository;
        this.storageService = storageService;
        this.webSocketService = webSocketService;
        this.messageMapper = messageMapper;
    }
    async execute(userId, dto, file) {
        const member = await this.communityRepository.findMemberByUserAndCommunity(userId, dto.communityId);
        if (!member || !member.isActive) {
            throw new AppError_1.ForbiddenError('You are not a member of this community');
        }
        let fileUrl = null;
        let fileName = null;
        let messageType = dto.type || 'text';
        if (file) {
            const timestamp = Date.now();
            const key = `communities/${dto.communityId}/files/${userId}/${timestamp}-${file.originalname}`;
            fileUrl = await this.storageService.uploadFile(file.buffer, key, file.mimetype);
            fileName = file.originalname;
            if (file.mimetype.startsWith('image/')) {
                messageType = 'image';
            }
            else if (file.mimetype.startsWith('video/')) {
                messageType = 'video';
            }
            else {
                messageType = 'file';
            }
        }
        const message = new CommunityMessage_1.CommunityMessage({
            communityId: dto.communityId,
            senderId: userId,
            content: dto.content,
            type: messageType,
            fileUrl,
            fileName,
            replyToId: dto.replyToId,
        });
        const createdMessage = await this.messageRepository.create(message);
        const messageDTO = await this.messageMapper.toDTO(createdMessage);
        // Broadcast via WebSocket
        this.webSocketService.sendToCommunity(dto.communityId, {
            type: 'message',
            communityId: dto.communityId,
            data: messageDTO,
        });
        return createdMessage;
    }
};
exports.SendMessageUseCase = SendMessageUseCase;
exports.SendMessageUseCase = SendMessageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityMessageRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IStorageService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IWebSocketService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ICommunityMessageMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], SendMessageUseCase);
//# sourceMappingURL=SendMessageUseCase.js.map