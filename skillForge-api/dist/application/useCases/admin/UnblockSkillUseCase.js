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
exports.UnblockSkillUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Skill_1 = require("../../../domain/entities/Skill");
const AppError_1 = require("../../../domain/errors/AppError");
let UnblockSkillUseCase = class UnblockSkillUseCase {
    constructor(skillRepository) {
        this.skillRepository = skillRepository;
    }
    async execute(skillId, _adminId) {
        // Verify skill exists
        const skill = await this.skillRepository.findById(skillId);
        if (!skill) {
            throw new AppError_1.NotFoundError('Skill not found');
        }
        if (!skill.isBlocked) {
            throw new AppError_1.ValidationError('Skill is not blocked');
        }
        // Create updated skill with unblocked status
        const skillData = skill.toJSON();
        const updatedSkill = new Skill_1.Skill({
            id: skillData.id,
            providerId: skillData.providerId,
            title: skillData.title,
            description: skillData.description,
            category: skillData.category,
            level: skillData.level,
            durationHours: skillData.durationHours,
            creditsPerHour: skillData.creditsPerHour,
            tags: skillData.tags,
            imageUrl: skillData.imageUrl,
            templateId: skillData.templateId,
            status: skillData.status,
            verificationStatus: skillData.verificationStatus,
            mcqScore: skillData.mcqScore,
            mcqTotalQuestions: skillData.mcqTotalQuestions,
            mcqPassingScore: skillData.mcqPassingScore,
            verifiedAt: skillData.verifiedAt,
            totalSessions: skillData.totalSessions,
            rating: skillData.rating,
            isBlocked: false,
            blockedReason: null,
            blockedAt: null,
            isAdminBlocked: false,
            createdAt: skillData.createdAt,
            updatedAt: new Date(),
        });
        await this.skillRepository.update(updatedSkill);
    }
};
exports.UnblockSkillUseCase = UnblockSkillUseCase;
exports.UnblockSkillUseCase = UnblockSkillUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __metadata("design:paramtypes", [Object])
], UnblockSkillUseCase);
//# sourceMappingURL=UnblockSkillUseCase.js.map