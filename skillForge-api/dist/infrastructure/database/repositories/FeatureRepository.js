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
exports.PrismaFeatureRepository = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const Feature_1 = require("../../../domain/entities/Feature");
const types_1 = require("../../di/types");
let PrismaFeatureRepository = class PrismaFeatureRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(feature) {
        const data = await this.prisma.feature.create({
            data: {
                planId: feature.planId,
                name: feature.name,
                description: feature.description,
                featureType: feature.featureType,
                limitValue: feature.limitValue,
                isEnabled: feature.isEnabled,
                displayOrder: feature.displayOrder,
                isHighlighted: feature.isHighlighted,
            },
        });
        return Feature_1.Feature.fromJSON(data);
    }
    async findById(id) {
        const data = await this.prisma.feature.findUnique({
            where: { id },
        });
        return data ? Feature_1.Feature.fromJSON(data) : null;
    }
    async findByPlanId(planId) {
        const data = await this.prisma.feature.findMany({
            where: { planId },
            orderBy: { displayOrder: 'asc' },
        });
        return data.map((item) => Feature_1.Feature.fromJSON(item));
    }
    async update(feature) {
        const data = await this.prisma.feature.update({
            where: { id: feature.id },
            data: {
                name: feature.name,
                description: feature.description,
                limitValue: feature.limitValue,
                isEnabled: feature.isEnabled,
                displayOrder: feature.displayOrder,
                isHighlighted: feature.isHighlighted,
                updatedAt: feature.updatedAt,
            },
        });
        return Feature_1.Feature.fromJSON(data);
    }
    async delete(id) {
        await this.prisma.feature.delete({
            where: { id },
        });
    }
    async reorderFeatures(planId, featureIds) {
        // Update display order for each feature
        const updates = featureIds.map((featureId, index) => this.prisma.feature.update({
            where: { id: featureId, planId },
            data: { displayOrder: index },
        }));
        await this.prisma.$transaction(updates);
    }
    async findHighlightedByPlanId(planId) {
        const data = await this.prisma.feature.findMany({
            where: {
                planId,
                isHighlighted: true,
            },
            orderBy: { displayOrder: 'asc' },
        });
        return data.map((item) => Feature_1.Feature.fromJSON(item));
    }
    async findLibraryFeatures() {
        const data = await this.prisma.feature.findMany({
            where: {
                planId: null,
            },
            orderBy: { displayOrder: 'asc' },
        });
        return data.map((item) => Feature_1.Feature.fromJSON(item));
    }
};
exports.PrismaFeatureRepository = PrismaFeatureRepository;
exports.PrismaFeatureRepository = PrismaFeatureRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaFeatureRepository);
//# sourceMappingURL=FeatureRepository.js.map