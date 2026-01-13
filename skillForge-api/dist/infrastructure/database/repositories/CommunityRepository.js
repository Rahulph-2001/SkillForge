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
// skillForge-api/src/infrastructure/database/repositories/CommunityRepository.ts
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Community_1 = require("../../../domain/entities/Community");
const CommunityMember_1 = require("../../../domain/entities/CommunityMember");
const Database_1 = require("../Database");
const BaseRepository_1 = require("../BaseRepository");
let CommunityRepository = class CommunityRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'community');
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
        await super.delete(id);
    }
    async findMembersByCommunityId(communityId) {
        const members = await this.prisma.communityMember.findMany({
            where: { communityId, isActive: true },
            include: {
                user: {
                    select: {
                        name: true,
                        avatarUrl: true,
                    }
                }
            },
            orderBy: { joinedAt: 'desc' },
        });
        return members.map(m => {
            const member = CommunityMember_1.CommunityMember.fromDatabaseRow(m);
            const memberAny = member;
            if (m.user) {
                memberAny._userName = m.user.name;
                memberAny._userAvatar = m.user.avatarUrl;
            }
            return member;
        });
    }
    async findMemberByUserAndCommunity(communityId, userId) {
        const member = await this.prisma.communityMember.findFirst({
            where: {
                communityId,
                userId,
                isActive: true,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        if (!member)
            return null;
        const domainMember = CommunityMember_1.CommunityMember.fromDatabaseRow(member);
        const memberAny = domainMember;
        if (member.user) {
            memberAny._userName = member.user.name;
            memberAny._userAvatar = member.user.avatarUrl;
        }
        return domainMember;
    }
    async createMember(member) {
        const data = member.toJSON();
        const created = await this.prisma.communityMember.create({
            data: {
                id: data.id,
                communityId: data.communityId,
                userId: data.userId,
                role: data.role,
                isAutoRenew: data.isAutoRenew,
                subscriptionEndsAt: data.subscriptionEndsAt,
                joinedAt: data.joinedAt,
                isActive: data.isActive,
            },
        });
        return CommunityMember_1.CommunityMember.fromDatabaseRow(created);
    }
    async updateMember(member) {
        const data = member.toJSON();
        const updated = await this.prisma.communityMember.update({
            where: { id: member.id },
            data: {
                role: data.role,
                isAutoRenew: data.isAutoRenew,
                subscriptionEndsAt: data.subscriptionEndsAt,
                leftAt: data.leftAt,
                isActive: data.isActive,
            },
        });
        return CommunityMember_1.CommunityMember.fromDatabaseRow(updated);
    }
    async upsertMember(member) {
        const data = member.toJSON();
        const upserted = await this.prisma.communityMember.upsert({
            where: {
                communityId_userId: {
                    communityId: data.communityId,
                    userId: data.userId,
                },
            },
            create: {
                id: data.id,
                communityId: data.communityId,
                userId: data.userId,
                role: data.role,
                isAutoRenew: data.isAutoRenew,
                subscriptionEndsAt: data.subscriptionEndsAt,
                joinedAt: data.joinedAt,
                isActive: data.isActive,
            },
            update: {
                isActive: data.isActive,
                role: data.role,
                subscriptionEndsAt: data.subscriptionEndsAt,
                joinedAt: new Date(),
                leftAt: null,
            },
        });
        return CommunityMember_1.CommunityMember.fromDatabaseRow(upserted);
    }
    async addMember(member) {
        return this.createMember(member);
    }
    async removeMember(communityId, userId) {
        await this.prisma.communityMember.updateMany({
            where: {
                communityId,
                userId,
            },
            data: {
                isActive: false,
                leftAt: new Date(),
            },
        });
    }
    async findMembershipsByUserId(userId) {
        const members = await this.prisma.communityMember.findMany({
            where: { userId, isActive: true },
            include: {
                user: {
                    select: {
                        name: true,
                        avatarUrl: true,
                    }
                }
            },
            orderBy: { joinedAt: 'desc' },
        });
        return members.map(m => {
            const member = CommunityMember_1.CommunityMember.fromDatabaseRow(m);
            const memberAny = member;
            if (m.user) {
                memberAny._userName = m.user.name;
                memberAny._userAvatar = m.user.avatarUrl;
            }
            return member;
        });
    }
    async incrementMembersCount(communityId) {
        await this.prisma.community.update({
            where: { id: communityId },
            data: {
                membersCount: { increment: 1 },
                updatedAt: new Date(),
            },
        });
    }
};
exports.CommunityRepository = CommunityRepository;
exports.CommunityRepository = CommunityRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], CommunityRepository);
//# sourceMappingURL=CommunityRepository.js.map