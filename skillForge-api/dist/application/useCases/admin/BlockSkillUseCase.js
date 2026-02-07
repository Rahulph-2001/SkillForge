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
exports.BlockSkillUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Skill_1 = require("../../../domain/entities/Skill");
const AppError_1 = require("../../../domain/errors/AppError");
const Notification_1 = require("../../../domain/entities/Notification");
let BlockSkillUseCase = class BlockSkillUseCase {
    constructor(skillRepository, notificationService) {
        this.skillRepository = skillRepository;
        this.notificationService = notificationService;
    }
    async execute(data) {
        // Verify skill exists
        const skill = await this.skillRepository.findById(data.skillId);
        if (!skill) {
            throw new AppError_1.NotFoundError('Skill not found');
        }
        // Only approved skills can be blocked
        if (skill.status !== 'approved') {
            throw new AppError_1.ValidationError('Only approved skills can be blocked');
        }
        if (skill.isBlocked) {
            throw new AppError_1.ValidationError('Skill is already blocked');
        }
        // Create updated skill with blocked status
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
            isBlocked: true,
            blockedReason: data.reason,
            blockedAt: new Date(),
            isAdminBlocked: true,
            createdAt: skillData.createdAt,
            updatedAt: new Date(),
        });
        await this.skillRepository.update(updatedSkill);
        // Notify skill provider
        await this.notificationService.send({
            userId: skill.providerId,
            type: Notification_1.NotificationType.SKILL_BLOCKED,
            title: 'Skill Blocked',
            message: `Your skill "${skill.title}" has been blocked by admin. ${data.reason ? `Reason: ${data.reason}` : ''}`,
            data: { skillId: skill.id, reason: data.reason },
        });
    }
};
exports.BlockSkillUseCase = BlockSkillUseCase;
exports.BlockSkillUseCase = BlockSkillUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __metadata("design:paramtypes", [Object, Object])
], BlockSkillUseCase);
//# sourceMappingURL=BlockSkillUseCase.js.map