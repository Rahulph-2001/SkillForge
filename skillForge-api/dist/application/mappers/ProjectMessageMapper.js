"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectMessageMapper = void 0;
const inversify_1 = require("inversify");
let ProjectMessageMapper = class ProjectMessageMapper {
    toResponseDTO(message, currentUserId) {
        return {
            id: message.id,
            projectId: message.projectId,
            senderId: message.senderId,
            content: message.content,
            isRead: message.isRead,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            sender: message.sender ? {
                id: message.sender.id,
                name: message.sender.name,
                avatarUrl: message.sender.avatarUrl,
            } : undefined,
            isMine: currentUserId ? message.senderId === currentUserId : undefined,
        };
    }
};
exports.ProjectMessageMapper = ProjectMessageMapper;
exports.ProjectMessageMapper = ProjectMessageMapper = __decorate([
    (0, inversify_1.injectable)()
], ProjectMessageMapper);
//# sourceMappingURL=ProjectMessageMapper.js.map