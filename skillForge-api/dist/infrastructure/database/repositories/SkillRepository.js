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
exports.SkillRepository = void 0;
const inversify_1 = require("inversify");
const Skill_1 = require("../../../domain/entities/Skill");
const Database_1 = require("../Database");
const types_1 = require("../../di/types");
const BaseRepository_1 = require("../BaseRepository");
let SkillRepository = class SkillRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'skill');
    }
    async browse(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 12;
        const skip = (page - 1) * limit;
        // Build where clause
        const where = {
            status: 'approved',
            isBlocked: false,
            isAdminBlocked: false,
            isDeleted: false,
            verificationStatus: 'passed',
        };
        // Search filter
        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { tags: { hasSome: [filters.search] } },
            ];
        }
        // Category filter
        if (filters.category && filters.category !== 'All') {
            where.category = { contains: filters.category, mode: 'insensitive' };
        }
        // Level filter
        if (filters.level) {
            where.level = filters.level;
        }
        // Credits filter (changed from price)
        if (filters.minCredits !== undefined || filters.maxCredits !== undefined) {
            where.creditsPerHour = {};
            if (filters.minCredits !== undefined) {
                where.creditsPerHour.gte = filters.minCredits;
            }
            if (filters.maxCredits !== undefined) {
                where.creditsPerHour.lte = filters.maxCredits;
            }
        }
        // Exclude current user's own skills (industrial-level: prevent self-booking)
        if (filters.excludeProviderId) {
            where.providerId = {
                not: filters.excludeProviderId
            };
        }
        // Get total count
        const total = await this.prisma.skill.count({ where });
        // Get skills
        const skills = await this.prisma.skill.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { rating: 'desc' },
                { createdAt: 'desc' }
            ],
        });
        return {
            skills: skills.map((s) => this.toDomain(s)),
            total
        };
    }
    async findPending() {
        const skills = await this.prisma.skill.findMany({
            where: {
                status: 'in-review',
                verificationStatus: 'passed',
                isDeleted: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return skills.map((s) => this.toDomain(s));
    }
    async findById(id) {
        const skill = await this.prisma.skill.findUnique({
            where: { id, isDeleted: false },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        rating: true,
                        reviewCount: true,
                    }
                }
            }
        });
        return skill ? this.toDomain(skill) : null;
    }
    async findByProviderId(providerId) {
        const skills = await this.prisma.skill.findMany({
            where: {
                providerId,
                isDeleted: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return skills.map((s) => this.toDomain(s));
    }
    async findByProviderIdWithPagination(providerId, filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 12;
        const skip = (page - 1) * limit;
        const where = {
            providerId,
            isDeleted: false,
        };
        // Status filter
        if (filters.status && filters.status !== 'all') {
            where.status = filters.status;
        }
        const [skills, total] = await Promise.all([
            this.prisma.skill.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.skill.count({ where }),
        ]);
        return {
            skills: skills.map((s) => this.toDomain(s)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findAllAdminWithPagination(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;
        const where = {
            isDeleted: false,
        };
        // Status filter
        if (filters.status) {
            where.status = filters.status;
        }
        // Blocked filter
        if (filters.isBlocked !== undefined) {
            where.isAdminBlocked = filters.isBlocked;
        }
        // Search filter
        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { category: { contains: filters.search, mode: 'insensitive' } },
                {
                    provider: {
                        OR: [
                            { name: { contains: filters.search, mode: 'insensitive' } },
                            { email: { contains: filters.search, mode: 'insensitive' } }
                        ]
                    }
                }
            ];
        }
        const [skills, total] = await Promise.all([
            this.prisma.skill.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            this.prisma.skill.count({ where }),
        ]);
        return {
            skills: skills.map((s) => this.toDomain(s)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findByProviderIdAndStatus(providerId, status) {
        const skills = await this.prisma.skill.findMany({
            where: {
                providerId,
                status,
                isDeleted: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return skills.map((s) => this.toDomain(s));
    }
    async findAll() {
        const skills = await super.findAll();
        return skills
            .filter((s) => !s.isDeleted)
            .map((s) => this.toDomain(s));
    }
    async create(skill) {
        const created = await this.prisma.skill.create({
            data: {
                id: skill.id,
                providerId: skill.providerId,
                templateId: skill.templateId,
                title: skill.title,
                description: skill.description,
                category: skill.category,
                level: skill.level,
                creditsPerHour: skill.creditsPerHour,
                durationHours: skill.durationHours,
                tags: skill.tags,
                status: skill.status,
                verificationStatus: skill.verificationStatus,
                isBlocked: skill.isBlocked,
                isAdminBlocked: skill.isAdminBlocked,
                blockedReason: skill.blockedReason,
                imageUrl: skill.imageUrl,
                rating: skill.rating,
                createdAt: skill.createdAt,
                updatedAt: skill.updatedAt,
            },
        });
        return this.toDomain(created);
    }
    async update(skill) {
        const updated = await this.prisma.skill.update({
            where: { id: skill.id },
            data: {
                title: skill.title,
                description: skill.description,
                category: skill.category,
                level: skill.level,
                creditsPerHour: skill.creditsPerHour,
                durationHours: skill.durationHours,
                tags: skill.tags,
                status: skill.status,
                verificationStatus: skill.verificationStatus,
                isBlocked: skill.isBlocked,
                isAdminBlocked: skill.isAdminBlocked,
                blockedReason: skill.blockedReason,
                imageUrl: skill.imageUrl,
                updatedAt: new Date(),
            },
        });
        return this.toDomain(updated);
    }
    async delete(id) {
        await super.delete(id);
    }
    async countTotal() {
        return await this.prisma.skill.count({
            where: { isDeleted: false }
        });
    }
    async countPending() {
        return await this.prisma.skill.count({
            where: {
                isDeleted: false,
                status: 'in-review'
            }
        });
    }
    async countByDateRange(startDate, endDate) {
        return await this.prisma.skill.count({
            where: {
                isDeleted: false,
                createdAt: { gte: startDate, lte: endDate }
            }
        });
    }
    toDomain(data) {
        return new Skill_1.Skill({
            id: data.id,
            providerId: data.providerId,
            title: data.title,
            description: data.description,
            category: data.category,
            level: data.level,
            durationHours: data.durationHours,
            creditsPerHour: Number(data.creditsPerHour),
            tags: data.tags || [],
            imageUrl: data.imageUrl,
            templateId: data.templateId,
            status: data.status,
            verificationStatus: data.verificationStatus,
            mcqScore: data.mcqScore,
            mcqTotalQuestions: data.mcqTotalQuestions,
            mcqPassingScore: data.mcqPassingScore,
            verifiedAt: data.verifiedAt,
            totalSessions: data.totalSessions || 0,
            rating: data.rating || 0,
            isBlocked: data.isBlocked || false,
            blockedReason: data.blockingReason,
            blockedAt: data.blockedAt,
            isAdminBlocked: data.isAdminBlocked || false,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
};
exports.SkillRepository = SkillRepository;
exports.SkillRepository = SkillRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], SkillRepository);
//# sourceMappingURL=SkillRepository.js.map