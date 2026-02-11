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
exports.SkillTemplateRepository = void 0;
const inversify_1 = require("inversify");
const SkillTemplate_1 = require("../../../domain/entities/SkillTemplate");
const Database_1 = require("../Database");
const types_1 = require("../../di/types");
const BaseRepository_1 = require("../BaseRepository");
const AppError_1 = require("../../../domain/errors/AppError");
let SkillTemplateRepository = class SkillTemplateRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'skillTemplate');
    }
    async create(template) {
        const data = template.toJSON();
        // Don't pass id - let database generate UUID
        const created = await this.prisma.skillTemplate.create({
            data: {
                title: data.title,
                category: data.category,
                description: data.description,
                creditsMin: data.creditsMin,
                creditsMax: data.creditsMax,
                mcqCount: data.mcqCount,
                passRange: data.passRange,
                levels: data.levels,
                tags: data.tags,
                status: data.status,
                isActive: data.isActive,
            },
        });
        return this.toDomain(created);
    }
    async findById(id) {
        const template = await this.prisma.skillTemplate.findUnique({
            where: { id },
        });
        return template ? this.toDomain(template) : null;
    }
    async findWithPagination(filters, pagination) {
        const where = {};
        if (filters.search) {
            where.title = { contains: filters.search, mode: 'insensitive' };
        }
        if (filters.category && filters.category !== 'All') {
            where.category = filters.category;
        }
        if (filters.status && filters.status !== 'All Status') {
            where.status = filters.status;
        }
        const [templates, total] = await Promise.all([
            this.prisma.skillTemplate.findMany({
                where,
                skip: pagination.skip,
                take: pagination.take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.skillTemplate.count({ where }),
        ]);
        return {
            templates: templates.map((t) => this.toDomain(t)),
            total,
        };
    }
    async findByCategory(category) {
        const templates = await this.prisma.skillTemplate.findMany({
            where: { category, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        return templates.map((t) => this.toDomain(t));
    }
    async findByStatus(status) {
        const templates = await this.prisma.skillTemplate.findMany({
            where: { status, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        return templates.map((t) => this.toDomain(t));
    }
    async update(id, updates) {
        const updateData = {};
        if (updates.title)
            updateData.title = updates.title;
        if (updates.category)
            updateData.category = updates.category;
        if (updates.description)
            updateData.description = updates.description;
        if (updates.creditsMin !== undefined)
            updateData.creditsMin = updates.creditsMin;
        if (updates.creditsMax !== undefined)
            updateData.creditsMax = updates.creditsMax;
        if (updates.mcqCount !== undefined)
            updateData.mcqCount = updates.mcqCount;
        if (updates.passRange !== undefined)
            updateData.passRange = updates.passRange;
        if (updates.levels)
            updateData.levels = updates.levels;
        if (updates.tags)
            updateData.tags = updates.tags;
        if (updates.status)
            updateData.status = updates.status;
        if (updates.isActive !== undefined)
            updateData.isActive = updates.isActive;
        updateData.updatedAt = new Date();
        const updated = await this.prisma.skillTemplate.update({
            where: { id },
            data: updateData,
        });
        return this.toDomain(updated);
    }
    async delete(id) {
        await super.delete(id);
    }
    async toggleStatus(id) {
        const template = await this.prisma.skillTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new AppError_1.NotFoundError('Skill template not found');
        }
        const updated = await this.prisma.skillTemplate.update({
            where: { id },
            data: {
                isActive: !template.isActive,
                updatedAt: new Date(),
            },
        });
        return this.toDomain(updated);
    }
    toDomain(data) {
        return new SkillTemplate_1.SkillTemplate({
            id: data.id,
            title: data.title,
            category: data.category,
            description: data.description,
            creditsMin: data.creditsMin,
            creditsMax: data.creditsMax,
            mcqCount: data.mcqCount,
            passRange: data.passRange,
            levels: data.levels || [],
            tags: data.tags || [],
            status: data.status,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
};
exports.SkillTemplateRepository = SkillTemplateRepository;
exports.SkillTemplateRepository = SkillTemplateRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], SkillTemplateRepository);
//# sourceMappingURL=SkillTemplateRepository.js.map