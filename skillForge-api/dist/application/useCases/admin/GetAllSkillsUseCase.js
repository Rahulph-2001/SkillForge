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
exports.GetAllSkillsUseCase = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const types_1 = require("../../../infrastructure/di/types");
let GetAllSkillsUseCase = class GetAllSkillsUseCase {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute() {
        const skills = await this.prisma.skill.findMany({
            where: {
                isDeleted: false,
                verificationStatus: {
                    not: 'failed' // Exclude failed MCQ skills (they are not saved)
                }
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return skills.map(skill => ({
            id: skill.id,
            providerId: skill.providerId,
            providerName: skill.provider.name,
            providerEmail: skill.provider.email,
            title: skill.title,
            description: skill.description,
            category: skill.category,
            level: skill.level,
            durationHours: skill.durationHours,
            creditsPerHour: skill.creditsPerHour,
            tags: skill.tags,
            imageUrl: skill.imageUrl,
            templateId: skill.templateId,
            status: skill.status,
            verificationStatus: skill.verificationStatus,
            mcqScore: skill.mcqScore,
            mcqTotalQuestions: skill.mcqTotalQuestions,
            mcqPassingScore: skill.mcqPassingScore,
            verifiedAt: skill.verifiedAt,
            rejectionReason: skill.rejectionReason,
            isBlocked: skill.isBlocked,
            blockedReason: skill.blockedReason,
            blockedAt: skill.blockedAt,
            totalSessions: skill.totalSessions,
            rating: Number(skill.rating),
            createdAt: skill.createdAt,
            updatedAt: skill.updatedAt,
        }));
    }
};
exports.GetAllSkillsUseCase = GetAllSkillsUseCase;
exports.GetAllSkillsUseCase = GetAllSkillsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], GetAllSkillsUseCase);
//# sourceMappingURL=GetAllSkillsUseCase.js.map