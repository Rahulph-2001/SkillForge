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
exports.CommunityMessageRepository = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const types_1 = require("../../di/types");
const CommunityMessage_1 = require("../../../domain/entities/CommunityMessage");
let CommunityMessageRepository = class CommunityMessageRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(message) {
        const data = message.toJSON();
        const created = await this.prisma.communityMessage.create({
            data: {
                id: data.id,
                communityId: data.community_id,
                senderId: data.sender_id,
                content: data.content,
                type: data.type,
                fileUrl: data.file_url,
                fileName: data.file_name,
                isPinned: data.is_pinned,
                replyToId: data.reply_to_id,
                forwardedFromId: data.forwarded_from_id,
                isDeleted: data.is_deleted,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            },
        });
        return CommunityMessage_1.CommunityMessage.fromDatabaseRow(created);
    }
    async findById(id) {
        const message = await this.prisma.communityMessage.findUnique({
            where: { id },
        });
        return message ? CommunityMessage_1.CommunityMessage.fromDatabaseRow(message) : null;
    }
    async findByCommunityId(communityId, limit = 50, offset = 0) {
        const messages = await this.prisma.communityMessage.findMany({
            where: { communityId, isDeleted: false },
            include: {
                sender: true,
                reactions: {
                    include: { user: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
        return messages.map(m => CommunityMessage_1.CommunityMessage.fromDatabaseRow(m));
    }
    async findPinnedMessages(communityId) {
        const messages = await this.prisma.communityMessage.findMany({
            where: { communityId, isPinned: true, isDeleted: false },
            orderBy: { pinnedAt: 'desc' },
        });
        return messages.map(m => CommunityMessage_1.CommunityMessage.fromDatabaseRow(m));
    }
    async update(message) {
        const data = message.toJSON();
        const updated = await this.prisma.communityMessage.update({
            where: { id: message.id },
            data: {
                isPinned: data.is_pinned,
                pinnedAt: data.pinned_at,
                pinnedBy: data.pinned_by,
                isDeleted: data.is_deleted,
                deletedAt: data.deleted_at,
                updatedAt: new Date(),
            },
        });
        return CommunityMessage_1.CommunityMessage.fromDatabaseRow(updated);
    }
    async delete(id) {
        await this.prisma.communityMessage.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date(), updatedAt: new Date() },
        });
    }
};
exports.CommunityMessageRepository = CommunityMessageRepository;
exports.CommunityMessageRepository = CommunityMessageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], CommunityMessageRepository);
//# sourceMappingURL=CommunityMessageRepository.js.map