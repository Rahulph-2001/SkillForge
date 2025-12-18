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
let SkillTemplateRepository = class SkillTemplateRepository {
    constructor(db) {
        this.prisma = db.getClient();
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
    async findAll() {
        const templates = await this.prisma.skillTemplate.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        return templates.map((t) => this.toDomain(t));
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
        updateData.updatedAt = new Date();
        const updated = await this.prisma.skillTemplate.update({
            where: { id },
            data: updateData,
        });
        return this.toDomain(updated);
    }
    async delete(id) {
        await this.prisma.skillTemplate.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async toggleStatus(id) {
        const template = await this.prisma.skillTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new Error('Template not found');
        }
        const newStatus = template.status === 'Active' ? 'Inactive' : 'Active';
        const updated = await this.prisma.skillTemplate.update({
            where: { id },
            data: { status: newStatus, updatedAt: new Date() },
        });
        return this.toDomain(updated);
    }
    toDomain(ormEntity) {
        return new SkillTemplate_1.SkillTemplate({
            id: ormEntity.id,
            title: ormEntity.title,
            category: ormEntity.category,
            description: ormEntity.description,
            creditsMin: ormEntity.creditsMin,
            creditsMax: ormEntity.creditsMax,
            mcqCount: ormEntity.mcqCount,
            passRange: ormEntity.passRange,
            levels: ormEntity.levels,
            tags: ormEntity.tags,
            status: ormEntity.status,
            isActive: ormEntity.isActive,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
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