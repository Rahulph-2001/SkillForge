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
exports.GetProjectMessagesUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
let GetProjectMessagesUseCase = class GetProjectMessagesUseCase {
    constructor(messageRepository, projectRepository, messageMapper) {
        this.messageRepository = messageRepository;
        this.projectRepository = projectRepository;
        this.messageMapper = messageMapper;
    }
    async execute(currentUserId, projectId) {
        // 1. Verify Project Exists
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }
        // 2. Verify User is Participant
        const isClient = project.clientId === currentUserId;
        const isContributor = project.acceptedContributor?.id === currentUserId;
        // Allow admin to view messages? (Optional, but for now strict participant only)
        // If currentUserId has admin role? Check user entity or context.
        // For strictly "Client <-> Contributor", limit to them.
        if (!isClient && !isContributor) {
            throw new AppError_1.ForbiddenError('You are not a participant in this project');
        }
        // 3. Fetch Messages
        const messages = await this.messageRepository.findByProjectId(projectId);
        // 4. Mark as Read (if recipient is viewing)
        // Optimization: Could be done asynchronously or in a separate call
        // For simplicity: If I am receiving messages, mark UNREAD messages from OTHER as read.
        // Implementation detail: Repository markAllAsRead
        await this.messageRepository.markAllAsRead(projectId, currentUserId);
        // 5. Map to DTOs
        return messages.map(msg => this.messageMapper.toResponseDTO(msg, currentUserId));
    }
};
exports.GetProjectMessagesUseCase = GetProjectMessagesUseCase;
exports.GetProjectMessagesUseCase = GetProjectMessagesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectMessageRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IProjectMessageMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetProjectMessagesUseCase);
//# sourceMappingURL=GetProjectMessagesUseCase.js.map