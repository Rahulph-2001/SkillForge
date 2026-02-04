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
exports.ProjectMessageRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const client_1 = require("@prisma/client");
const ProjectMessage_1 = require("../../../domain/entities/ProjectMessage");
let ProjectMessageRepository = class ProjectMessageRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(message) {
        const created = await this.prisma.projectMessage.create({
            data: {
                id: message.id,
                projectId: message.projectId,
                senderId: message.senderId,
                content: message.content,
                isRead: message.isRead,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                }
            }
        });
        return this.toDomain(created);
    }
    async findByProjectId(projectId) {
        const messages = await this.prisma.projectMessage.findMany({
            where: {
                projectId: projectId
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                }
            }
        });
        return messages.map(this.toDomain);
    }
    async findById(id) {
        const message = await this.prisma.projectMessage.findUnique({
            where: { id },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                }
            }
        });
        return message ? this.toDomain(message) : null;
    }
    async markAsRead(id) {
        await this.prisma.projectMessage.update({
            where: { id },
            data: { isRead: true }
        });
    }
    async markAllAsRead(projectId, userId) {
        // Mark all messages in this project NOT sent by me (userId) as read
        await this.prisma.projectMessage.updateMany({
            where: {
                projectId: projectId,
                senderId: { not: userId }, // Messages sent by OTHER person
                isRead: false
            },
            data: { isRead: true }
        });
    }
    toDomain(ormEntity) {
        return new ProjectMessage_1.ProjectMessage({
            id: ormEntity.id,
            projectId: ormEntity.projectId,
            senderId: ormEntity.senderId,
            content: ormEntity.content,
            isRead: ormEntity.isRead,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
            sender: ormEntity.sender ? {
                id: ormEntity.sender.id,
                name: ormEntity.sender.name,
                avatarUrl: ormEntity.sender.avatarUrl,
            } : undefined
        });
    }
};
exports.ProjectMessageRepository = ProjectMessageRepository;
exports.ProjectMessageRepository = ProjectMessageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], ProjectMessageRepository);
//# sourceMappingURL=ProjectMessageRepository.js.map