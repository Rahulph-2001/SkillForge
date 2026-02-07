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
exports.ApproveSkillUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Skill_1 = require("../../../domain/entities/Skill");
const AppError_1 = require("../../../domain/errors/AppError");
const Notification_1 = require("../../../domain/entities/Notification");
let ApproveSkillUseCase = class ApproveSkillUseCase {
    constructor(skillRepository, notificationService) {
        this.skillRepository = skillRepository;
        this.notificationService = notificationService;
    }
    async execute(skillId, _adminId) {
        // Verify skill exists and is in review
        const skill = await this.skillRepository.findById(skillId);
        if (!skill) {
            throw new AppError_1.NotFoundError('Skill not found');
        }
        if (skill.status !== 'in-review') {
            throw new AppError_1.ValidationError('Skill is not in review status');
        }
        // Create updated skill with approved status
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
            status: 'approved',
            verificationStatus: 'passed',
            mcqScore: skillData.mcqScore,
            mcqTotalQuestions: skillData.mcqTotalQuestions,
            mcqPassingScore: skillData.mcqPassingScore,
            verifiedAt: skillData.verifiedAt,
            totalSessions: skillData.totalSessions,
            rating: skillData.rating,
            isBlocked: skillData.isBlocked,
            blockedReason: skillData.blockedReason,
            blockedAt: skillData.blockedAt,
            isAdminBlocked: skillData.isAdminBlocked,
            createdAt: skillData.createdAt,
            updatedAt: new Date(),
        });
        await this.skillRepository.update(updatedSkill);
        // Notify skill provider
        await this.notificationService.send({
            userId: skill.providerId,
            type: Notification_1.NotificationType.SKILL_APPROVED,
            title: 'Skill Approved!',
            message: `Your skill "${skill.title}" has been approved and is now visible to learners`,
            data: { skillId: skill.id },
        });
    }
};
exports.ApproveSkillUseCase = ApproveSkillUseCase;
exports.ApproveSkillUseCase = ApproveSkillUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __metadata("design:paramtypes", [Object, Object])
], ApproveSkillUseCase);
//# sourceMappingURL=ApproveSkillUseCase.js.map