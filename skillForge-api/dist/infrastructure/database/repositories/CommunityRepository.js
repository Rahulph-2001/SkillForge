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
exports.CommunityRepository = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const types_1 = require("../../di/types");
const Community_1 = require("../../../domain/entities/Community");
const CommunityMember_1 = require("../../../domain/entities/CommunityMember");
let CommunityRepository = class CommunityRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(community) {
        const data = community.toJSON();
        const created = await this.prisma.community.create({
            data: {
                id: data.id,
                name: data.name,
                description: data.description,
                category: data.category,
                imageUrl: data.image_url,
                videoUrl: data.video_url,
                adminId: data.admin_id,
                creditsCost: data.credits_cost,
                creditsPeriod: data.credits_period,
                membersCount: data.members_count,
                isActive: data.is_active,
                isDeleted: data.is_deleted,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            },
        });
        return Community_1.Community.fromDatabaseRow(created);
    }
    async findById(id) {
        const community = await this.prisma.community.findUnique({
            where: { id },
        });
        return community ? Community_1.Community.fromDatabaseRow(community) : null;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.category)
            where.category = filters.category;
        if (filters?.isActive !== undefined)
            where.isActive = filters.isActive;
        const communities = await this.prisma.community.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return communities.map(c => Community_1.Community.fromDatabaseRow(c));
    }
    async findByAdminId(adminId) {
        const communities = await this.prisma.community.findMany({
            where: { adminId },
            orderBy: { createdAt: 'desc' },
        });
        return communities.map(c => Community_1.Community.fromDatabaseRow(c));
    }
    async update(id, community) {
        const data = community.toJSON();
        const updated = await this.prisma.community.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                category: data.category,
                imageUrl: data.image_url,
                videoUrl: data.video_url,
                creditsCost: data.credits_cost,
                creditsPeriod: data.credits_period,
                membersCount: data.members_count,
                isActive: data.is_active,
                updatedAt: new Date(),
            },
        });
        return Community_1.Community.fromDatabaseRow(updated);
    }
    async delete(id) {
        await this.prisma.community.update({
            where: { id },
            data: { isDeleted: true, updatedAt: new Date() },
        });
    }
    async addMember(member) {
        const data = member.toJSON();
        const created = await this.prisma.communityMember.create({
            data: {
                id: data.id,
                communityId: data.community_id,
                userId: data.user_id,
                role: data.role,
                isAutoRenew: data.is_auto_renew,
                subscriptionEndsAt: data.subscription_ends_at,
                joinedAt: data.joined_at,
                isActive: data.is_active,
            },
        });
        return CommunityMember_1.CommunityMember.fromDatabaseRow(created);
    }
    async removeMember(communityId, userId) {
        await this.prisma.communityMember.updateMany({
            where: { communityId, userId },
            data: { isActive: false, leftAt: new Date() },
        });
    }
    async findMembersByCommunityId(communityId) {
        const members = await this.prisma.communityMember.findMany({
            where: { communityId, isActive: true },
            orderBy: { joinedAt: 'asc' },
        });
        return members.map(m => CommunityMember_1.CommunityMember.fromDatabaseRow(m));
    }
    async findMemberByUserAndCommunity(userId, communityId) {
        const member = await this.prisma.communityMember.findFirst({
            where: { userId, communityId },
        });
        return member ? CommunityMember_1.CommunityMember.fromDatabaseRow(member) : null;
    }
    async updateMember(member) {
        const data = member.toJSON();
        const updated = await this.prisma.communityMember.update({
            where: { id: member.id },
            data: {
                isAutoRenew: data.is_auto_renew,
                subscriptionEndsAt: data.subscription_ends_at,
                isActive: data.is_active,
                leftAt: data.left_at,
            },
        });
        return CommunityMember_1.CommunityMember.fromDatabaseRow(updated);
    }
};
exports.CommunityRepository = CommunityRepository;
exports.CommunityRepository = CommunityRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], CommunityRepository);
//# sourceMappingURL=CommunityRepository.js.map