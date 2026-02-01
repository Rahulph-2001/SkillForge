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
exports.UnpinMessageUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let UnpinMessageUseCase = class UnpinMessageUseCase {
    constructor(messageRepository, communityRepository, webSocketService, messageMapper) {
        this.messageRepository = messageRepository;
        this.communityRepository = communityRepository;
        this.webSocketService = webSocketService;
        this.messageMapper = messageMapper;
    }
    async execute(userId, messageId) {
        const message = await this.messageRepository.findById(messageId);
        if (!message) {
            throw new AppError_1.NotFoundError('Message not found');
        }
        const community = await this.communityRepository.findById(message.communityId);
        if (!community) {
            throw new AppError_1.NotFoundError('Community not found');
        }
        if (community.adminId !== userId) {
            throw new AppError_1.ForbiddenError('Only community admin can unpin messages');
        }
        message.unpin();
        const updatedMessage = await this.messageRepository.update(message);
        const messageDTO = await this.messageMapper.toDTO(updatedMessage);
        this.webSocketService.sendToCommunity(message.communityId, {
            type: 'message_unpinned',
            communityId: message.communityId,
            data: messageDTO,
        });
        return updatedMessage;
    }
};
exports.UnpinMessageUseCase = UnpinMessageUseCase;
exports.UnpinMessageUseCase = UnpinMessageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityMessageRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IWebSocketService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ICommunityMessageMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UnpinMessageUseCase);
//# sourceMappingURL=UnpinMessageUseCase.js.map