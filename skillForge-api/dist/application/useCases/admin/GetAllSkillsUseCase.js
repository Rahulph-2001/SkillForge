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
const types_1 = require("../../../infrastructure/di/types");
let GetAllSkillsUseCase = class GetAllSkillsUseCase {
    constructor(skillRepository, userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }
    async execute() {
        // Get all non-deleted skills that haven't failed verification
        const skills = await this.skillRepository.findAll();
        const filteredSkills = skills.filter(skill => skill.verificationStatus !== 'failed');
        // Get unique provider IDs
        const providerIds = [...new Set(filteredSkills.map(s => s.providerId))];
        const providers = await this.userRepository.findByIds(providerIds);
        const providersMap = new Map(providers.map(p => [p.id, p]));
        // Map to DTOs
        return filteredSkills
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map(skill => {
            const provider = providersMap.get(skill.providerId);
            return {
                id: skill.id,
                providerId: skill.providerId,
                providerName: provider?.name || 'Unknown',
                providerEmail: provider?.email.value || 'unknown@example.com',
                title: skill.title,
                description: skill.description,
                category: skill.category,
                level: skill.level,
                durationHours: skill.durationHours,
                creditsPerHour: Number(skill.creditsPerHour),
                tags: skill.tags,
                imageUrl: skill.imageUrl,
                templateId: skill.templateId,
                status: skill.status,
                verificationStatus: skill.verificationStatus,
                mcqScore: skill.mcqScore,
                mcqTotalQuestions: skill.mcqTotalQuestions,
                mcqPassingScore: skill.mcqPassingScore,
                verifiedAt: skill.verifiedAt,
                rejectionReason: skill.blockedReason,
                isBlocked: skill.isBlocked,
                blockedReason: skill.blockedReason,
                blockedAt: skill.blockedAt,
                totalSessions: skill.totalSessions,
                rating: skill.rating || 0,
                createdAt: skill.createdAt,
                updatedAt: skill.updatedAt,
            };
        });
    }
};
exports.GetAllSkillsUseCase = GetAllSkillsUseCase;
exports.GetAllSkillsUseCase = GetAllSkillsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetAllSkillsUseCase);
//# sourceMappingURL=GetAllSkillsUseCase.js.map