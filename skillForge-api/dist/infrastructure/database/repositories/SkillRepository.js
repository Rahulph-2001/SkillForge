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
let SkillRepository = class SkillRepository {
    constructor(db) {
        this.prisma = db.getClient();
    }
    async browse(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 12;
        const skip = (page - 1) * limit;
        // Build where clause
        const where = {
            status: 'approved',
            isBlocked: false,
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
        if (filters.level && filters.level !== 'All Levels') {
            where.level = filters.level;
        }
        // Price filter
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.creditsPerHour = {};
            if (filters.minPrice !== undefined) {
                where.creditsPerHour.gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                where.creditsPerHour.lte = filters.maxPrice;
            }
        }
        // Exclude user's own skills
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
    async update(skill) {
        const data = skill.toJSON();
        const updated = await this.prisma.skill.update({
            where: { id: skill.id },
            data: {
                title: data.title,
                description: data.description,
                category: data.category,
                level: data.level,
                durationHours: data.durationHours,
                creditsPerHour: data.creditsPerHour,
                tags: data.tags,
                imageUrl: data.imageUrl,
                status: data.status,
                verificationStatus: data.verificationStatus,
                mcqScore: data.mcqScore,
                mcqTotalQuestions: data.mcqTotalQuestions,
                mcqPassingScore: data.mcqPassingScore,
                verifiedAt: data.verifiedAt,
                totalSessions: data.totalSessions,
                rating: data.rating,
                isBlocked: data.isBlocked,
                blockedReason: data.blockedReason,
                blockedAt: data.blockedAt,
                updatedAt: new Date()
            }
        });
        return this.toDomain(updated);
    }
    async create(skill) {
        const data = skill.toJSON();
        const created = await this.prisma.skill.create({
            data: {
                id: data.id,
                providerId: data.providerId,
                templateId: data.templateId,
                title: data.title,
                description: data.description,
                category: data.category,
                level: data.level,
                durationHours: data.durationHours,
                creditsPerHour: data.creditsPerHour,
                tags: data.tags,
                imageUrl: data.imageUrl,
                status: data.status,
            }
        });
        return this.toDomain(created);
    }
    async findByProviderId(providerId) {
        const skills = await this.prisma.skill.findMany({
            where: {
                providerId,
                isDeleted: false,
                verificationStatus: {
                    not: 'failed' // Exclude failed MCQ skills (blocked skills are shown)
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return skills.map((s) => this.toDomain(s));
    }
    async findById(id) {
        const skill = await this.prisma.skill.findUnique({
            where: { id }
        });
        return skill ? this.toDomain(skill) : null;
    }
    async findAll() {
        const skills = await this.prisma.skill.findMany({
            where: { isDeleted: false }
        });
        return skills.map((s) => this.toDomain(s));
    }
    toDomain(ormEntity) {
        return new Skill_1.Skill({
            id: ormEntity.id,
            providerId: ormEntity.providerId,
            templateId: ormEntity.templateId,
            title: ormEntity.title,
            description: ormEntity.description,
            category: ormEntity.category,
            level: ormEntity.level,
            durationHours: ormEntity.durationHours,
            creditsPerHour: ormEntity.creditsPerHour,
            tags: ormEntity.tags,
            imageUrl: ormEntity.imageUrl,
            status: ormEntity.status,
            verificationStatus: ormEntity.verificationStatus,
            mcqScore: ormEntity.mcqScore,
            mcqTotalQuestions: ormEntity.mcqTotalQuestions,
            mcqPassingScore: ormEntity.mcqPassingScore,
            totalSessions: ormEntity.totalSessions,
            rating: Number(ormEntity.rating),
            isBlocked: ormEntity.isBlocked || false,
            blockedReason: ormEntity.blockedReason || null,
            blockedAt: ormEntity.blockedAt || null,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt
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