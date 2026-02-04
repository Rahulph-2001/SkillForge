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
exports.SendProjectMessageUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const ProjectMessage_1 = require("../../../domain/entities/ProjectMessage");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
let SendProjectMessageUseCase = class SendProjectMessageUseCase {
    constructor(messageRepository, projectRepository, messageMapper, socketService) {
        this.messageRepository = messageRepository;
        this.projectRepository = projectRepository;
        this.messageMapper = messageMapper;
        this.socketService = socketService;
    }
    async execute(currentUserId, data) {
        // 1. Verify Project Exists
        const project = await this.projectRepository.findById(data.projectId);
        if (!project) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }
        // 2. Verify User is Participant (Client or Accepted Contributor)
        const isClient = project.clientId === currentUserId;
        const isContributor = project.acceptedContributor?.id === currentUserId;
        if (!isClient && !isContributor) {
            throw new AppError_1.ForbiddenError('You are not a participant in this project');
        }
        // 3. Create Message Entity
        const message = new ProjectMessage_1.ProjectMessage({
            projectId: data.projectId,
            senderId: currentUserId,
            content: data.content,
        });
        // 4. Persist
        const savedMessage = await this.messageRepository.create(message);
        // 5. Create Response DTO
        const responseDTO = this.messageMapper.toResponseDTO(savedMessage, currentUserId);
        // 6. Emit Real-time Event
        // Determine recipient
        const recipientId = isClient ? project.acceptedContributor?.id : project.clientId;
        if (recipientId) {
            this.socketService.sendToUser(recipientId, {
                type: 'project_message_received',
                data: {
                    message: this.messageMapper.toResponseDTO(savedMessage, recipientId), // Map for recipient context
                    projectId: data.projectId
                }
            });
        }
        return responseDTO;
    }
};
exports.SendProjectMessageUseCase = SendProjectMessageUseCase;
exports.SendProjectMessageUseCase = SendProjectMessageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectMessageRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IProjectMessageMapper)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IWebSocketService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], SendProjectMessageUseCase);
//# sourceMappingURL=SendProjectMessageUseCase.js.map