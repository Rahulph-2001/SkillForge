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
exports.ProjectMessageController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const ProjectMessageDTO_1 = require("../../../application/dto/project/ProjectMessageDTO");
const messages_1 = require("../../../config/messages");
let ProjectMessageController = class ProjectMessageController {
    constructor(sendUseCase, getMessagesUseCase, responseBuilder) {
        this.sendUseCase = sendUseCase;
        this.getMessagesUseCase = getMessagesUseCase;
        this.responseBuilder = responseBuilder;
        this.getMessages = async (req, res) => {
            try {
                const projectId = req.params.projectId;
                if (!projectId) {
                    const response = this.responseBuilder.error('VALIDATION_ERROR', 'Project ID is required', 400);
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                const currentUserId = req.user.id;
                const messages = await this.getMessagesUseCase.execute(currentUserId, projectId);
                const response = this.responseBuilder.success(messages, messages_1.SUCCESS_MESSAGES.COMMUNITY.MESSAGES_FETCHED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                console.error('Get Messages Error:', error);
                if (error.type === 'NOT_FOUND') {
                    const response = this.responseBuilder.error('NOT_FOUND', error.message, 404);
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                if (error.type === 'FORBIDDEN') {
                    const response = this.responseBuilder.error('FORBIDDEN', error.message, 403);
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', messages_1.ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR, 500);
                res.status(response.statusCode).json(response.body);
            }
        };
        this.sendMessage = async (req, res) => {
            try {
                const projectId = req.params.projectId;
                if (!projectId) {
                    const response = this.responseBuilder.error('VALIDATION_ERROR', 'Project ID is required', 400);
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                const validation = ProjectMessageDTO_1.CreateProjectMessageSchema.safeParse({ ...req.body, projectId });
                if (!validation.success) {
                    const response = this.responseBuilder.error('VALIDATION_ERROR', validation.error.issues[0].message, 400);
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                const currentUserId = req.user.id;
                const result = await this.sendUseCase.execute(currentUserId, validation.data);
                const response = this.responseBuilder.created(result, messages_1.SUCCESS_MESSAGES.COMMUNITY.MESSAGE_SENT);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                console.error('Send Message Error:', error);
                if (error.type === 'NOT_FOUND') {
                    const response = this.responseBuilder.error('NOT_FOUND', error.message, 404);
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                if (error.type === 'FORBIDDEN') {
                    const response = this.responseBuilder.error('FORBIDDEN', error.message, 403);
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', messages_1.ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR, 500);
                res.status(response.statusCode).json(response.body);
            }
        };
    }
};
exports.ProjectMessageController = ProjectMessageController;
exports.ProjectMessageController = ProjectMessageController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISendProjectMessageUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IGetProjectMessagesUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProjectMessageController);
//# sourceMappingURL=ProjectMessageController.js.map